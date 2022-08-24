import { armorList } from '../../data/armor';
import { logger } from '../../firebot/firebot';
import {
    Armor,
    ArmorProperties,
    Rarity,
    StoredArmor,
} from '../../types/equipment';
import { getUserData } from '../user/user';
import {
    addOrSubtractRandomPercentage,
    filterArrayByProperty,
    sumOfObjectProperties,
} from '../utils';
import { generateEnchantmentList } from './enchantments';
import { getWeightedRarity } from './helpers';

export async function getUserArmorEnchantmentCount(
    username: string
): Promise<{ armor: number }> {
    logger('debug', `Getting armor enchantment count for ${username}.`);
    const characterStats = await getUserData(username);
    const armor = characterStats.armor as StoredArmor;
    const values = {
        armor: 0,
    };

    if (armor?.enchantments != null) {
        values.armor = sumOfObjectProperties(armor.enchantments);
    }

    logger(
        'debug',
        `Enchantment count for ${username}'s armor is ${values.armor}.`
    );

    return values;
}

export async function getUserArmorRefinementCount(
    username: string
): Promise<{ armor: number }> {
    logger('debug', `Getting armor refinement count for ${username}.`);
    const characterStats = await getUserData(username);
    const armor = characterStats.armor as StoredArmor;
    const values = {
        armor: 0,
    };

    if (armor?.refinements != null) {
        values.armor = armor.refinements;
    }

    logger(
        'debug',
        `Refinement count for ${username}'s armor is ${values.armor}.`
    );

    return values;
}

export function getArmorFilteredByRarity(rarity: Rarity[]): Armor {
    logger('debug', `Getting armor filtered by rarity array.`);

    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    logger('debug', `Our selected rarity is ${selectedRarity}`);

    // Then, narrow down our armor list to only items with that rarity.
    const availableArmor = filterArrayByProperty(
        armorList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected armor.
    return availableArmor[Math.floor(Math.random() * availableArmor.length)];
}

/**
 * Returns our dex bonus for certain armor types.
 * @param armorType
 * @returns
 */
export function getArmorDexBonus(armorType: ArmorProperties) {
    switch (armorType) {
        case 'heavy':
            return 0.25;
        case 'medium':
            return 0.5;
        case 'light':
            return 0.75;
        default:
            return 1;
    }
}

/**
 * Returns movement speed for armor types.
 * @param armor
 * @returns
 */
export function getArmorMovementSpeed(armor: Armor): number {
    if (armor == null) {
        return 60;
    }

    if (armor?.properties.includes('heavy')) {
        return 20;
    }

    if (armor?.properties.includes('medium')) {
        return 30;
    }

    // Light armor
    return 40;
}

export async function generateArmorForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredArmor> {
    logger('debug', `Generating a ${rarity} armor.`);

    const userEnchantmentValues = await getUserArmorEnchantmentCount(username);
    const userRefinementValues = await getUserArmorRefinementCount(username);

    logger('debug', `Got user armor enchantment and refinement base counts.`);

    // Get our weapon, our new refinement value, and our new enchantment stats.
    const armor = getArmorFilteredByRarity(rarity);
    const refinementValue = addOrSubtractRandomPercentage(
        userRefinementValues.armor
    );
    const enchantmentStats = generateEnchantmentList(
        userEnchantmentValues.armor
    );

    // Combine them into a "stored weapon" and return.
    return {
        id: armor.id,
        itemType: 'armor',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
