import { Service } from "@flamework/core";
import type { Logger } from "@rbxts/log";
import { BadgeService } from "@rbxts/services";

import { store } from "server/store";
import { selectPlayerAchievements } from "shared/store/persistent";
import { Badge } from "types/enum/badge";

import type PlayerEntity from "./player-entity";
import type { OnPlayerJoin } from "./player-service";

@Service({})
export default class PlayerBadgeService implements OnPlayerJoin {
	constructor(private readonly logger: Logger) {}

	public onPlayerJoin(playerEntity: PlayerEntity): void {
		const { userId } = playerEntity;

		this.awardBadge(playerEntity, Badge.Welcome).catch(err => {
			this.logger.Error(`Failed to check if ${userId} has badge ${Badge.Welcome}: ${err}`);
		});

		this.awardUnrewardedBadges(playerEntity).catch(err => {
			this.logger.Error(`Failed to award unrewarded badges to ${userId}: ${err}`);
		});
	}

	/**
	 * Awards a badge to a player if they don't already have it.
	 *
	 * If the badge is unable to be awarded, the error will be logged and the
	 * badge will not be awarded. We will still internally track that the badge
	 * was attempted to be awarded so that any function that relies on a badge
	 * having been awarded will consider it as awarded.
	 *
	 * @param playerEntity - The player entity to award the badge to.
	 * @param badge - The badge to be awarded.
	 * @returns A promise that resolves when the badge has been awarded.
	 */
	public async awardBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
		const hasBadge = await this.checkIfPlayerHasBadge(playerEntity, badge);
		if (hasBadge) {
			return;
		}

		return this.giveBadge(playerEntity, badge);
	}

	public async checkIfPlayerHasBadge(
		{ player, userId }: PlayerEntity,
		badge: Badge,
	): Promise<boolean> {
		const hasBadge = store.getState(selectPlayerAchievements(userId))?.badges.get(badge);
		if (hasBadge !== undefined) {
			return true;
		}

		return Promise.try(() => BadgeService.UserHasBadgeAsync(player.UserId, tonumber(badge)));
	}

	public async getBadgeInfo(badge: Badge): Promise<BadgeInfo> {
		return Promise.try(() => BadgeService.GetBadgeInfoAsync(tonumber(badge)));
	}

	private async giveBadge(playerEntity: PlayerEntity, badge: Badge): Promise<void> {
		const { player, userId } = playerEntity;

		const badgeInfo = await this.getBadgeInfo(badge);
		if (!badgeInfo.IsEnabled) {
			this.logger.Warn(`Badge ${badge} is not enabled.`);
			return;
		}

		const [success, awarded] = pcall(() =>
			BadgeService.AwardBadge(player.UserId, tonumber(badge)),
		);
		if (!success) {
			throw awarded;
		}

		if (!awarded) {
			this.logger.Warn(`Awarded badge ${badge} to ${userId} but it was not successful.`);
		} else {
			this.logger.Info(`Awarded badge ${badge} to ${userId}`);
		}

		store.awardBadge(userId, badge, awarded);
	}

	private async awardUnrewardedBadges(playerEntity: PlayerEntity): Promise<void> {
		const { userId } = playerEntity;

		const badges = store.getState(selectPlayerAchievements(userId))?.badges;
		if (badges === undefined) {
			return;
		}

		for (const [badge, hasBadge] of badges) {
			if (hasBadge) {
				continue;
			}

			this.awardBadge(playerEntity, badge).catch(err => {
				this.logger.Error(`Failed to check if ${userId} has badge ${badge}: ${err}`);
			});
		}
	}
}
