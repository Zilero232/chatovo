import type { ShopState } from '@chatovo/schemas';

import { COSMETIC_KEYS, cosmeticKeySchema, hasPermission } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { isNonNullish } from 'remeda';

import type { EquipCosmeticServiceInput } from '../shop.service.types';

import { AppForbiddenException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { findUserRole } from '../../../../lib';
import { patchParticipantMetadataEverywhere } from '../../../livekit';
import { parseEquippedCosmetics } from '../../../users';
import { YookassaService } from '../yookassa';

@Injectable()
export class CosmeticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassa: YookassaService
  ) {}

  private async hasUnlockedAll(userId: string): Promise<boolean> {
    const role = await findUserRole(userId);

    return hasPermission({ role, permission: 'unlockAllCosmetics' });
  }

  async getState(userId: string): Promise<ShopState> {
    const [unlockedAll, entitlements, profile] = await Promise.all([
      this.hasUnlockedAll(userId),
      this.prisma.entitlement.findMany({
        where: { userId },
        select: { productKey: true },
        orderBy: { createdAt: 'asc' }
      }),
      this.prisma.profile.findUnique({
        where: { userId },
        select: { cosmetics: true }
      })
    ]);

    const owned = unlockedAll
      ? [...COSMETIC_KEYS]
      : entitlements
          .map(({ productKey }) => cosmeticKeySchema.safeParse(productKey).data)
          .filter(isNonNullish);

    return {
      enabled: this.yookassa.isEnabled(),
      unlockedAll,
      owned,
      equipped: parseEquippedCosmetics(profile?.cosmetics)
    };
  }

  async equip({ userId, input }: EquipCosmeticServiceInput): Promise<ShopState> {
    const { kind, productKey } = input;

    if (isNonNullish(productKey) && !(await this.hasUnlockedAll(userId))) {
      const owned = await this.prisma.entitlement.findUnique({
        where: { userId_productKey: { userId, productKey } }
      });

      if (!owned) {
        throw new AppForbiddenException('COSMETIC_NOT_OWNED', 'Cosmetic not owned');
      }
    }

    await this.prisma.profile.upsert({ where: { userId }, create: { userId }, update: {} });

    const [profile] = await this.prisma.$queryRaw<{ cosmetics: unknown }[]>`
      UPDATE "profile"
      SET "cosmetics" = jsonb_set(
        COALESCE("cosmetics", '{}'::jsonb),
        ARRAY[${kind}]::text[],
        COALESCE(to_jsonb(${productKey}::text), 'null'::jsonb)
      )
      WHERE "userId" = ${userId}
      RETURNING "cosmetics"
    `;
    const cosmetics = parseEquippedCosmetics(profile?.cosmetics);

    await patchParticipantMetadataEverywhere({ identity: userId, patch: { cosmetics } });

    return this.getState(userId);
  }
}
