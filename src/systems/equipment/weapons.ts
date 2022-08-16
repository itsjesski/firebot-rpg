import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import { Rarity, StoredWeapon, Weapon } from '../../types/equipment';
import { getCharacterData } from '../user/user';
import {
    addOrSubtractRandomPercentage,
    filterArrayByProperty,
    sumOfObjectProperties,
} from '../utils';
import { generateEnchantmentListForUser, getWeightedRarity } from './helpers';

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

export async function getUserWeaponEnchantmentCount(
    username: string
): Promise<{ main_hand: number; off_hand: number }> {
    logger('debug', `Getting weapon enchantment count for ${username}.`);
    const characterStats = await getCharacterData(username);
    const mainHand = characterStats.mainHand as StoredWeapon;
    const offHand = characterStats.offHand as StoredWeapon;
    const values = {
        main_hand: 0,
        off_hand: 0,
    };

    if (mainHand?.enchantments != null) {
        values.main_hand = sumOfObjectProperties(mainHand.enchantments);
    }

    if (offHand?.enchantments != null) {
        values.off_hand = sumOfObjectProperties(offHand.enchantments);
    }

    logger(
        'debug',
        `Enchantment count for main hand of ${username} is ${values.main_hand}.`
    );
    logger(
        'debug',
        `Enchantment count for off hand of ${username} is ${values.off_hand}.`
    );

    return values;
}

export async function getUserWeaponRefinementCount(
    username: string
): Promise<{ mainHand: number; offHand: number }> {
    logger('debug', `Getting weapon refinement count for ${username}.`);
    const characterStats = await getCharacterData(username);
    const mainHand = characterStats.mainHand as StoredWeapon;
    const offHand = characterStats.offHand as StoredWeapon;
    const values = {
        mainHand: 0,
        offHand: 0,
    };

    if (mainHand?.refinements != null) {
        values.mainHand = mainHand.refinements;
    }

    if (offHand?.refinements != null) {
        values.offHand = offHand.refinements;
    }

    logger(
        'debug',
        `Refinement count for main hand of ${username} is ${values.mainHand}.`
    );
    logger(
        'debug',
        `Refinement count for off hand of ${username} is ${values.offHand}.`
    );

    return values;
}

export async function generateWeaponForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredWeapon> {
    logger('debug', `Generating a ${rarity} weapon for ${username}.`);
    const userEnchantmentValues = await getUserWeaponEnchantmentCount(username);
    const userRefinementValues = await getUserWeaponRefinementCount(username);

    logger('debug', `Got user weapon enchantment and refinement base counts.`);

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
