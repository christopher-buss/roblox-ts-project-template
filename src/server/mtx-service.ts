import type { OnInit } from "@flamework/core";
import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { MarketplaceService, Players } from "@rbxts/services";
import Sift from "@rbxts/sift";
import Signal from "@rbxts/signal";

import { selectPlayerData, selectPlayerMtx } from "shared/store/persistent";
import { Gamepass, Product } from "types/enum/mtx";

import type PlayerEntity from "./player/player-entity";
import type { OnPlayerJoin } from "./player/player-service";
import type PlayerService from "./player/player-service";
import { store } from "./store";

const NETWORK_RETRY_DELAY = 2;
const NETWORK_RETRY_ATTEMPTS = 10;

type ProductInfo = GamePassProductInfo | DeveloperProductInfo;

/**
 * A service for managing gamepasses and processing receipts.
 *
 * ```
 * this.mtxService.gamepassStatusChanged.Connect((playerEntity, gamepassId, isActive) => {
 *     if (!gamepassId === Gamepasses.Example || !isActive) {
 *         return;
 *     }
 *
 *     // Do something with the gamepass owned
 *     ...
 * });
 *
 * for (const gamepass of gamepasses) {
 *     if (this.mtxService.isGamepassActive(playerEntity, gamepass)) {
 *         // Do something with the gamepass owned
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
		(player: Player, productId: number) => void
	>();

	public readonly gamepassStatusChanged = new Signal<
		(player: Player, gamepassId: Gamepass, isActive: boolean) => void
	>();

	constructor(
		private readonly logger: Logger,
		private readonly playerService: PlayerService,
	) {}

	/** @ignore */
	public onInit(): void {
		MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, id, wasPurchased) => {
			this.onGamePassPurchaseFinished(player, tostring(id) as Gamepass, wasPurchased);
		});

		MarketplaceService.ProcessReceipt = (...args): Enum.ProductPurchaseDecision => {
			const result = this.processReceipt(...args).expect();
			this.logger.Info(`ProcessReceipt result: ${result}`);
			return result;
		};
	}

	/** @ignore */
	public onPlayerJoin({ player, userId }: PlayerEntity): void {
		const gamepasses = store.getState(selectPlayerMtx(userId))?.gamepasses;
		if (gamepasses === undefined) {
			return;
		}

		const unowned = Object.values(Gamepass).filter(gamepassId => !gamepasses.has(gamepassId));
		for (const gamepassId of unowned) {
			this.checkForGamepassOwned(player, gamepassId)
				.then(owned => {
					if (!owned) {
						return;
					}

					store.setGamepassOwned(userId, gamepassId);
				})
				.catch(err => {
					this.logger.Warn(`Error checking gamepass ${gamepassId}: ${err}`);
				});
		}

		for (const [id, gamepassData] of gamepasses) {
			this.notifyProductActive(player, id, gamepassData.active);
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
		infoType: "Product" | "GamePass",
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
	 * Checks if a gamepass is active for a specific player. This method will
	 * return false if the gamepass is not owned by the player.
	 *
	 * @param player - The player for whom to check the gamepass.
	 * @param gamepassId - The ID of the gamepass to check.
	 * @returns A boolean indicating whether the gamepass is active or not.
	 */
	public isGamepassActive(player: Player, gamepassId: Gamepass): boolean {
		return (
			store.getState(selectPlayerMtx(tostring(player.UserId)))?.gamepasses.get(gamepassId)
				?.active ?? false
		);
	}

	private async checkForGamepassOwned(player: Player, gamepassId: Gamepass): Promise<boolean> {
		// Ensure gamepassId is a valid gamepasses for our game
		if (!Object.values(Gamepass).includes(gamepassId)) {
			throw `Invalid gamepass id ${gamepassId}`;
		}

		const owned = store
			.getState(selectPlayerMtx(tostring(player.UserId)))
			?.gamepasses.has(gamepassId);
		if (owned === true) {
			return true;
		}

		return MarketplaceService.UserOwnsGamePassAsync(player.UserId, tonumber(gamepassId));
	}

	private grantProduct(player: Player, productId: number, wasPurchased: boolean): void {
		if (!wasPurchased) {
			return;
		}

		// Ensure productId is a valid product for our game
		if (!Object.values(Product).includes(tostring(productId) as Product)) {
			this.logger.Warn(
				`Player ${player.Name} attempted to purchased invalid product ${productId}`,
			);
			return;
		}

		this.logger.Info(`Player ${player.Name} purchased developer product ${productId}`);

		store.purchaseDeveloperProduct(tostring(player.UserId), productId);

		this.developerProductPurchased.Fire(player, productId);
	}

	private notifyProductActive(player: Player, productId: Gamepass, isActive: boolean): void {
		this.gamepassStatusChanged.Fire(player, productId, isActive);
	}

	private onGamePassPurchaseFinished(
		player: Player,
		gamepassId: Gamepass,
		wasPurchased: boolean,
	): void {
		if (!wasPurchased) {
			return;
		}

		// Ensure gamepassId is a valid gamepasses for our game
		if (!Object.values(Gamepass).includes(gamepassId)) {
			this.logger.Warn(
				`Player ${player.Name} attempted to purchased invalid gamepass ${gamepassId}`,
			);
			return;
		}

		this.logger.Info(`Player ${player.Name} purchased gamepass ${gamepassId}`);

		store.setGamepassOwned(tostring(player.UserId), gamepassId);

		this.notifyProductActive(player, gamepassId, true);
	}

	private async processReceipt(receiptInfo: ReceiptInfo): Promise<Enum.ProductPurchaseDecision> {
		this.logger.Info(
			`Processing receipt ${receiptInfo.PurchaseId} for ${receiptInfo.PlayerId}`,
		);

		const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);
		if (!player) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		const playerEntity = this.playerService.getPlayerEntity(player);
		if (!playerEntity) {
			this.logger.Error(`No entity for player ${player.Name}, cannot process receipt`);
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return this.purchaseIdCheck(playerEntity, receiptInfo);
	}

	private async purchaseIdCheck(
		{ document, player }: PlayerEntity,
		{ ProductId, PurchaseId }: ReceiptInfo,
	): Promise<Enum.ProductPurchaseDecision> {
		if (document.read().mtx.receiptHistory.includes(PurchaseId)) {
			const [ok] = document.save().await();
			if (!ok) {
				return Enum.ProductPurchaseDecision.NotProcessedYet;
			}

			return Enum.ProductPurchaseDecision.PurchaseGranted;
		}

		this.grantProduct(player, ProductId, true);

		const data = store.getState(selectPlayerData(tostring(player.UserId)));
		if (!data) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		if (!data.mtx.receiptHistory.includes(PurchaseId)) {
			await document.save();
		}

		const { receiptHistory } = data.mtx;

		document.write(
			Sift.Dictionary.merge(data, {
				mtx: {
					receiptHistory:
						receiptHistory.size() >= this.purchaseIdLog
							? Sift.Array.shift(
									receiptHistory,
									receiptHistory.size() - this.purchaseIdLog + 1,
								)
							: receiptHistory,
				},
			}),
		);

		const [savedOk] = document.save().await();
		if (!savedOk) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}
}
