import type { OnInit } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Document } from "@rbxts/lapis";
import type { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { MarketplaceService, Players } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Signal from "@rbxts/signal";

import type { PlayerData } from "shared/store/persistent";
import { selectPlayerData, selectPlayerMtx } from "shared/store/persistent";
import { GamePass, Product } from "types/enum/mtx";

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
export default class MtxService implements OnInit, OnPlayerJoin {
	private readonly productInfoCache = new Map<number, ProductInfo>();
	private readonly purchaseIdLog = 50;

	public readonly developerProductPurchased = new Signal<
		(playerEntity: PlayerEntity, productId: Product) => void
	>();

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
				this.onGamePassPurchaseFinished(playerEntity, gamePassId, purchased);
			}),
		);

		MarketplaceService.ProcessReceipt = (...args): Enum.ProductPurchaseDecision => {
			const result = this.processReceipt(...args).expect();
			this.logger.Info(`ProcessReceipt result: ${result}`);
			return result;
		};
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

					store.purchaseGamePass(userId, gamePassId);
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
	 * Retrieves the product information for a given product or game pass.
	 *
	 * @param infoType - The type of information to retrieve ("Product" or
	 *   "GamePass").
	 * @param productId - The ID of the product or game pass.
	 * @returns A Promise that resolves to the product information, or undefined
	 *   if the information is not available.
	 */
	public async getProductInfo(
		infoType: "GamePass" | "Product",
		productId: number,
	): Promise<ProductInfo | undefined> {
		if (this.productInfoCache.has(productId)) {
			return this.productInfoCache.get(productId);
		}

		const price = await Promise.retryWithDelay(
			async () => {
				return MarketplaceService.GetProductInfo(
					productId,
					Enum.InfoType[infoType],
				) as ProductInfo;
			},
			NETWORK_RETRY_ATTEMPTS,
			NETWORK_RETRY_DELAY,
		).catch(() => {
			this.logger.Warn(`Failed to get price for product ${productId}`);
		});

		if (price === undefined) {
			return undefined;
		}

		this.productInfoCache.set(productId, price);

		return price;
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
		wasPurchased: boolean,
	): void {
		if (!wasPurchased) {
			return;
		}

		const { userId } = playerEntity;

		const product = tostring(productId) as Product;

		// Ensure productId is a valid product for our game
		if (!Object.values(Product).includes(product)) {
			this.logger.Warn(
				`Player ${userId} attempted to purchased invalid product ${productId}`,
			);
			return;
		}

		this.logger.Info(`Player ${userId} purchased developer product ${productId}`);
		store.purchaseDeveloperProduct(userId, product);
		this.developerProductPurchased.Fire(playerEntity, product);
	}

	private notifyProductActive(
		playerEntity: PlayerEntity,
		productId: GamePass,
		isActive: boolean,
	): void {
		this.gamePassStatusChanged.Fire(playerEntity, productId, isActive);
	}

	private onGamePassPurchaseFinished(
		playerEntity: PlayerEntity,
		gamePassId: number,
		wasPurchased: boolean,
	): void {
		if (!wasPurchased) {
			return;
		}

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
		{ ProductId, PurchaseId }: ReceiptInfo,
	): Promise<Enum.ProductPurchaseDecision> {
		const { document, userId } = playerEntity;

		if (document.read().mtx.receiptHistory.includes(PurchaseId)) {
			const [success] = document.save().await();
			if (!success) {
				return Enum.ProductPurchaseDecision.NotProcessedYet;
			}

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		}

		this.grantProduct(playerEntity, ProductId, true);

		const data = store.getState(selectPlayerData(userId));
		if (!data) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		this.updateReceiptHistory(data, document, PurchaseId);

		const [success] = document.save().await();
		if (!success) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	private updateReceiptHistory(
		data: PlayerData,
		document: Document<PlayerData>,
		purchaseId: string,
	): void {
		const { receiptHistory } = data.mtx;

		const updatedReceiptHistory =
			receiptHistory.size() >= this.purchaseIdLog
				? Sift.Array.shift(receiptHistory, receiptHistory.size() - this.purchaseIdLog + 1)
				: receiptHistory;
		updatedReceiptHistory.push(purchaseId);

		document.write(
			Sift.Dictionary.merge(data, {
				mtx: {
					receiptHistory: updatedReceiptHistory,
				},
			}),
		);
	}
}
