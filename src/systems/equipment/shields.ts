import { shieldList } from '../../data/shields';
import { logger } from '../../firebot/firebot';
import { Rarity, Shield, StoredShield } from '../../types/equipment';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import {
    getUserHandItemEnchantmentCount,
    generateEnchantmentList,
} from './enchantments';
import { getWeightedRarity } from './helpers';
import { getUserHandItemRefinementCount } from './refinements';

/**
 * Get a random shield from a certain rarity.
 * @param rarity
 * @returns
 */
export function getShieldFilteredByRarity(rarity: Rarity[]): Shield {
    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    // Then, narrow down our shield list to only items with that rarity.
    const availableShields = filterArrayByProperty(
        shieldList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected weapons.
    return availableShields[
        Math.floor(Math.random() * availableShields.length)
    ];
}

/**
 * Generates a shield for a user around their level.
 * @param username
 * @param rarity
 * @returns
 */
export async function generateShieldForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredShield> {
    const userEnchantmentValues = await getUserHandItemEnchantmentCount(
        username
    );
    const userRefinementValues = await getUserHandItemRefinementCount(username);

    logger('debug', `Got user enchantment and refinement base counts.`);

    const baseEnchantmentValue = Math.max(
        userEnchantmentValues.main_hand,
        userEnchantmentValues.off_hand
    );
    const baseRefinementValue = Math.max(
        userRefinementValues.mainHand,
        userRefinementValues.offHand
    );

    // Get our weapon, our new refinement value, and our new enchantment stats.
    const shield = getShieldFilteredByRarity(rarity);
    const refinementValue = addOrSubtractRandomPercentage(baseRefinementValue);
    const enchantmentStats = generateEnchantmentList(baseEnchantmentValue);

    // Combine them into a "stored shield" and return.
    return {
        id: shield.id,
        itemType: 'shield',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
