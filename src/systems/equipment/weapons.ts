import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import { Rarity, StoredWeapon, Weapon } from '../../types/equipment';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import {
    generateEnchantmentListForUser,
    getUserEnchantmentCount,
    getUserRefinementCount,
    getWeightedRarity,
} from './helpers';

export function getWeaponFilteredByRarity(rarity: Rarity[]): Weapon {
    logger('debug', `Getting weapon filtered by rarity array.`);

    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    logger('debug', `Our selected rarity is ${selectedRarity}`);

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

export async function generateWeaponForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredWeapon> {
    logger('debug', `Generating a ${rarity} weapon.`);
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
    const weapon = getWeaponFilteredByRarity(rarity);
    const refinementValue = addOrSubtractRandomPercentage(baseRefinementValue);
    const enchantmentStats =
        generateEnchantmentListForUser(baseEnchantmentValue);

    // Combine them into a "stored weapon" and return.
    return {
        id: weapon.id,
        itemType: 'weapon',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
