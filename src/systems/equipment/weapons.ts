import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import { Rarity, StoredWeapon, Weapon } from '../../types/equipment';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import {
    getUserHandItemEnchantmentCount,
    generateEnchantmentList,
} from './enchantments';
import { getWeightedRarity } from './helpers';
import { getUserHandItemRefinementCount } from './refinements';

/**
 * Selects a random weapon of a certain rarity.
 * @param rarity
 * @returns
 */
export function getWeaponFilteredByRarity(rarity: Rarity[]): Weapon {
    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    // Then, narrow down our weapon list to only items with that rarity.
    const availableWeapons = filterArrayByProperty(
        weaponList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected weapons.
    return availableWeapons[
        Math.floor(Math.random() * availableWeapons.length)
    ];
}

/**
 * Generates a new weapon for a user.
 * @param username
 * @param rarity
 * @returns
 */
export async function generateWeaponForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredWeapon> {
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
    const weapon = getWeaponFilteredByRarity(rarity);
    const refinementValue = addOrSubtractRandomPercentage(baseRefinementValue);
    const enchantmentStats = generateEnchantmentList(baseEnchantmentValue);

    // Combine them into a "stored weapon" and return.
    return {
        id: weapon.id,
        itemType: 'weapon',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
