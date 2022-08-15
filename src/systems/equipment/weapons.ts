import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import {
    Enchantments,
    Rarity,
    StoredWeapon,
    Weapon,
} from '../../types/equipment';
import {
    getUserWeaponEnchantmentCount,
    getUserWeaponRefinementCount,
} from '../user/user';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import { getWeightedRarity } from './helpers';

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

export function generateEnchantmentListForUser(
    baseEnchantmentValue: number
): Enchantments {
    let availablePoints = addOrSubtractRandomPercentage(baseEnchantmentValue);
    const enchantments = {
        earth: 0,
        wind: 0,
        fire: 0,
        water: 0,
        light: 0,
        darkness: 0,
    };
    const enchantmentKeys = Object.keys(enchantments);

    // TODO: This could probably be improved.
    // Randomly assign our pool of points until we're out of them.
    while (availablePoints > 0) {
        const selectedEnchantment =
            enchantmentKeys[Math.floor(Math.random() * enchantmentKeys.length)];
        // @ts-ignore
        enchantments[selectedEnchantment] += 1;
        availablePoints -= 1;
    }

    return enchantments;
}

export async function generateWeaponForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredWeapon> {
    logger('debug', `Generating a ${rarity} weapon for ${username}.`);
    const userEnchantmentValues = await getUserWeaponEnchantmentCount(username);
    const userRefinementValues = await getUserWeaponRefinementCount(username);

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
