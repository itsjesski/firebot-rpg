import { armorList } from '../../data/armor';
import {
    Armor,
    ArmorProperties,
    Rarity,
    StoredArmor,
} from '../../types/equipment';
import {
    getArmorArcaneFailure,
    getArmorDexBonusSettings,
    getArmorMovementSpeedSettings,
} from '../settings';
import { addOrSubtractRandomPercentage, filterArrayByProperty } from '../utils';
import {
    generateEnchantmentList,
    getUserArmorEnchantmentCount,
} from './enchantments';
import { getWeightedRarity } from './helpers';
import { getUserArmorRefinementCount } from './refinements';

export function getArmorFilteredByRarity(rarity: Rarity[]): Armor {
    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

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
export function getArmorDexBonus(armorType: ArmorProperties): number {
    return getArmorDexBonusSettings(armorType) / 100;
}

/**
 * Returns movement speed for armor types.
 * @param armor
 * @returns
 */
export function getArmorMovementSpeed(armor: Armor): number {
    if (armor == null) {
        return getArmorMovementSpeedSettings(null)
            ? getArmorMovementSpeedSettings(null)
            : 60;
    }

    if (armor?.properties.includes('heavy')) {
        return getArmorMovementSpeedSettings('heavy')
            ? getArmorMovementSpeedSettings('heavy')
            : 30;
    }

    if (armor?.properties.includes('medium')) {
        return getArmorMovementSpeedSettings('medium')
            ? getArmorMovementSpeedSettings('medium')
            : 40;
    }

    // Light armor
    return getArmorMovementSpeedSettings('light')
        ? getArmorMovementSpeedSettings('light')
        : 50;
}

export async function generateArmorForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredArmor> {
    const userEnchantmentValues = await getUserArmorEnchantmentCount(username);
    const userRefinementValues = await getUserArmorRefinementCount(username);

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

/**
 * Get arcane failure chance of armor.
 * @param weight
 * @returns
 */
export function getArcaneFailureChance(weight: ArmorProperties): number {
    return getArmorArcaneFailure(weight);
}
