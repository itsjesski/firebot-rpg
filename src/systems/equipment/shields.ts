import { shieldList } from '../../data/shields';
import { logger } from '../../firebot/firebot';
import { Rarity, Shield, StoredShield } from '../../types/equipment';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import {
    generateEnchantmentListForUser,
    getUserEnchantmentCount,
    getUserRefinementCount,
    getWeightedRarity,
} from './helpers';

export function getShieldFilteredByRarity(rarity: Rarity[]): Shield {
    logger('debug', `Getting shield filtered by rarity array.`);

    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    logger('debug', `Our selected rarity is ${selectedRarity}`);

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

export async function generateShieldForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredShield> {
    logger('debug', `Generating a ${rarity} shield.`);
    const userEnchantmentValues = await getUserEnchantmentCount(username);
    const userRefinementValues = await getUserRefinementCount(username);

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
    const enchantmentStats =
        generateEnchantmentListForUser(baseEnchantmentValue);

    // Combine them into a "stored shield" and return.
    return {
        id: shield.id,
        itemType: 'shield',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
