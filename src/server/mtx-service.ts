import type { OnInit, OnStart } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import { Object } from "@rbxts/luau-polyfill";
import { MarketplaceService, Players } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Signal from "@rbxts/signal";

import type { PlayerData } from "shared/store/persistent";
import { selectPlayerData, selectPlayerMtx } from "shared/store/persistent";
import { noYield } from "shared/util/no-yield";
import { GamePass, Product } from "types/enum/mtx";

import { Events } from "./network";
import type PlayerEntity from "./player/player-entity";
import type { OnPlayerJoin } from "./player/player-service";
import type PlayerService from "./player/player-service";
import { store } from "./store";

const NETWORK_RETRY_DELAY = 2;
const NETWORK_RETRY_ATTEMPTS = 10;

type ProductInfo = DeveloperProductInfo | GamePassProductInfo;

/**
 * A service for managing game passes and processing receipts.
 *
 * ```
 * this.mtxService.gamePassStatusChanged.Connect((playerEntity, gamePassId, isActive) => {
 *     if (!gamePassId === GamePasses.Example || !isActive) {
 *         return;
 *     }
 *
 *     // Do something with the game pass owned
 *     ...
 * });
 *
 * for (const pass of gamePasses) {
 *     if (this.mtxService.isGamePassActive(playerEntity, gamePassId)) {
 *         // Do something with the game pass owned
 *         ...
 *     }
 * }
 * ```
 */
@Service({})
export default class MtxService implements OnInit, OnStart, OnPlayerJoin {
	private readonly productHandlers = new Map<
		Product,
		(playerEntity: PlayerEntity, productId: Product) => boolean
	>();

	private readonly productInfoCache = new Map<number, ProductInfo>();
	private readonly purchaseIdLog = 50;

	public readonly gamePassStatusChanged = new Signal<
		(playerEntity: PlayerEntity, gamePassId: GamePass, isActive: boolean) => void
	>();

	constructor(
		private readonly logger: Logger,
		private readonly playerService: PlayerService,
	) {}

	/** @ignore */
	public onInit(): void {
		MarketplaceService.PromptGamePassPurchaseFinished.Connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, purchased) => {
				if (!purchased) {
					return;
				}

				this.grantGamePass(playerEntity, gamePassId);
			}),
		);

		MarketplaceService.ProcessReceipt = (...args): Enum.ProductPurchaseDecision => {
			const result = this.processReceipt(...args).expect();
			this.logger.Info(`ProcessReceipt result: ${result}`);
			return result;
		};
	}

	/** @ignore */
	public onStart(): void {
		Events.mtx.setGamePassActive.connect(
			this.playerService.withPlayerEntity((playerEntity, gamePassId, active) => {
				this.setGamePassActive(playerEntity, gamePassId, active).catch(err => {
					this.logger.Error(
						`Failed to set game pass ${gamePassId} active for ${playerEntity.userId}: ${err}`,
					);
				});
			}),
		);
	}

	/** @ignore */
	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { userId } = playerEntity;

		const gamePasses = store.getState(selectPlayerMtx(userId))?.gamePasses;
		if (gamePasses === undefined) {
			return;
		}

		const unowned = Object.values(GamePass).filter(gamePassId => !gamePasses.has(gamePassId));
		for (const gamePassId of unowned) {
			this.checkForGamePassOwned(playerEntity, gamePassId)
				.then(owned => {
					if (!owned) {
						return;
					}

					this.grantGamePass(playerEntity, tonumber(gamePassId));
				})
				.catch(err => {
					this.logger.Warn(`Error checking game pass ${gamePassId}: ${err}`);
				});
		}

		for (const [id, gamePassData] of gamePasses) {
			this.notifyProductActive(playerEntity, id, gamePassData.active);
		}
	}

	/**
	 * Registers a handler for a specific product. The handler will be called
	 * when a player purchases the developer product.
	 *
	 * The handler should return true if the product was successfully processed,
	 * or false if there was an error. The handler will also return false if
	 * there is an error processing the product.
	 *
	 * @param productId - The ID of the product to register the handler for.
	 * @param handler - The callback handler to call when the product is
	 *   purchased. The handler should return true if the product was
	 *   successfully processed, or false if there was an error.
	 * @note Handlers should be registered before the player purchases the
	 *  product, and should never yield.
	 */
	public registerProductHandler(
		productId: Product,
		handler: (playerEntity: PlayerEntity, productId: Product) => boolean,
	): void {
		if (this.productHandlers.has(productId)) {
			this.logger.Error(`Handler already registered for product ${productId}`);
			return;
		}

		this.logger.Debug(`Registered handler for product ${productId}`);
		this.productHandlers.set(productId, handler);
	}

	/**
	 * Retrieves the product information for a given product or game pass.
	 *
	 * @param infoType - The type of information to retrieve ("Product" or
	 *   "GamePass").
	 * @param productId - The ID of the product or game pass.
	 * @returns A Promise that resolves to the product information, or undefined
	 *   if the information is not available.
	 */
	public async getProductInfo(
		infoType: Enum.InfoType,
		productId: number,
	): Promise<ProductInfo | undefined> {
		if (this.productInfoCache.has(productId)) {
			return this.productInfoCache.get(productId);
		}

		const productInfo = await Promise.retryWithDelay(
			async () => MarketplaceService.GetProductInfo(productId, infoType) as ProductInfo,
			NETWORK_RETRY_ATTEMPTS,
			NETWORK_RETRY_DELAY,
		).catch(() => {
			this.logger.Warn(`Failed to get price for product ${productId}`);
		});

		if (productInfo === undefined) {
			return undefined;
		}

		this.productInfoCache.set(productId, productInfo);

		return productInfo;
	}

	/**
	 * Checks if a game pass is active for a specific player. This method will
	 * return false if the game pass is not owned by the player.
	 *
	 * @param playerEntity - The player entity for whom to check the game pass.
	 * @param gamePassId - The ID of the game pass to check.
	 * @returns A boolean indicating whether the game pass is active or not.
	 */
	public isGamePassActive({ userId }: PlayerEntity, gamePassId: GamePass): boolean {
		return store.getState(selectPlayerMtx(userId))?.gamePasses.get(gamePassId)?.active ?? false;
	}

	private async checkForGamePassOwned(
		{ player, userId }: PlayerEntity,
		gamePassId: GamePass,
	): Promise<boolean> {
		// Ensure game passId is a valid game passes for our game
		if (!Object.values(GamePass).includes(gamePassId)) {
			throw `Invalid game pass id ${gamePassId}`;
		}

		const owned = store.getState(selectPlayerMtx(userId))?.gamePasses.has(gamePassId);
		if (owned === true) {
			return true;
		}

		return MarketplaceService.UserOwnsGamePassAsync(player.UserId, tonumber(gamePassId));
	}

	private grantProduct(
		playerEntity: PlayerEntity,
		productId: number,
		currencySpent: number,
	): boolean {
		const { userId } = playerEntity;

		const product = tostring(productId) as Product;

		// Ensure productId is a valid product for our game
		if (!Object.values(Product).includes(product)) {
			this.logger.Warn(
				`Player ${userId} attempted to purchased invalid product ${productId}`,
			);
			return false;
		}

		const handler = this.productHandlers.get(product);
		if (!handler) {
			this.logger.Fatal(`No handler for product ${product}`);
			return false;
		}

		const [success, result] = pcall(() => noYield(handler, playerEntity, product));
		if (!success || !result) {
			this.logger.Error(`Failed to process product ${product}`);
			return false;
		}

		this.logger.Info(`Player ${userId} purchased developer product ${productId}`);
		store.purchaseDeveloperProduct(userId, product, currencySpent);
		return true;
	}

	private async setGamePassActive(
		playerEntity: PlayerEntity,
		gamePassId: GamePass,
		active: boolean,
	): Promise<void> {
		await this.checkForGamePassOwned(playerEntity, gamePassId).then(owned => {
			const { userId } = playerEntity;
			if (!owned) {
				this.logger.Warn(
					`Player ${userId} tried to activate not game pass ${gamePassId} that they do not own.`,
				);

				return;
			}

			store.setGamePassActive(userId, gamePassId, active);
			this.notifyProductActive(playerEntity, gamePassId, active);
		});
	}

	private notifyProductActive(
		playerEntity: PlayerEntity,
		productId: GamePass,
		isActive: boolean,
	): void {
		this.gamePassStatusChanged.Fire(playerEntity, productId, isActive);
	}

	private grantGamePass(playerEntity: PlayerEntity, gamePassId: number): void {
		const { userId } = playerEntity;
		const gamePass = tostring(gamePassId) as GamePass;

		// Ensure game passId is a valid game passes for our game
		if (!Object.values(GamePass).includes(gamePass)) {
			this.logger.Warn(
				`Player ${userId} attempted to purchased invalid game pass ${gamePassId}`,
			);
			return;
		}

		this.logger.Info(`Player ${userId} purchased game pass ${gamePassId}`);
		store.purchaseGamePass(userId, gamePass);
		this.notifyProductActive(playerEntity, gamePass, true);
	}

	private async processReceipt(receiptInfo: ReceiptInfo): Promise<Enum.ProductPurchaseDecision> {
		this.logger.Info(
			`Processing receipt ${receiptInfo.PurchaseId} for ${receiptInfo.PlayerId}`,
		);

		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
		if (!player) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const playerEntity = await this.playerService.getPlayerEntityAsync(player);
		if (!playerEntity) {
			this.logger.Error(`No entity for player ${player.UserId}, cannot process receipt`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return this.purchaseIdCheck(playerEntity, receiptInfo);
	}

	private async purchaseIdCheck(
		playerEntity: PlayerEntity,
		{ CurrencySpent, ProductId, PurchaseId }: ReceiptInfo,
	): Promise<Enum.ProductPurchaseDecision> {
		const { document, userId } = playerEntity;

		if (document.read().mtx.receiptHistory.includes(PurchaseId)) {
			const [success] = document.save().await();
			if (!success) {
				return Enum.ProductPurchaseDecision.NotProcessedYet;
			}

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		}

		const data = store.getState(selectPlayerData(userId));
		if (!data) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		if (!this.grantProduct(playerEntity, ProductId, CurrencySpent)) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		this.updateReceiptHistory(userId, data, PurchaseId);

		const [success] = document.save().await();
		if (!success) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	private updateReceiptHistory(userId: string, data: PlayerData, purchaseId: string): void {
		const { receiptHistory } = data.mtx;

		let updatedReceiptHistory = Sift.Array.push(receiptHistory, purchaseId);
		if (updatedReceiptHistory.size() > this.purchaseIdLog) {
			updatedReceiptHistory = Sift.Array.shift(
				updatedReceiptHistory,
				updatedReceiptHistory.size() - this.purchaseIdLog + 1,
			);
		}

		store.updateReceiptHistory(userId, updatedReceiptHistory);
	}
}
