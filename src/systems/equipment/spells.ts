import { spellList } from '../../data/spells';
import { Rarity, Spell, StoredSpell } from '../../types/equipment';
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
export function getSpellFilteredByRarity(rarity: Rarity[]): Spell {
    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    // Then, narrow down our spell list to only items with that rarity.
    const availableSpells = filterArrayByProperty(
        spellList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected spells.
    return availableSpells[Math.floor(Math.random() * availableSpells.length)];
}

/**
 * Generates a new weapon for a user.
 * @param username
 * @param rarity
 * @returns
 */
export async function generateSpellForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredSpell> {
    const userEnchantmentValues = await getUserHandItemEnchantmentCount(
        username
    );
    const userRefinementValues = await getUserHandItemRefinementCount(username);

    const baseEnchantmentValue = Math.max(
        userEnchantmentValues.main_hand,
        userEnchantmentValues.off_hand
    );
    const baseRefinementValue = Math.max(
        userRefinementValues.mainHand,
        userRefinementValues.offHand
    );

    // Get our spell, our new refinement value, and our new enchantment stats.
    const spell = getSpellFilteredByRarity(rarity);
    const refinementValue = addOrSubtractRandomPercentage(baseRefinementValue);
    const enchantmentStats = generateEnchantmentList(baseEnchantmentValue);

    // Combine them into a "stored weapon" and return.
    return {
        id: spell.id,
        itemType: 'spell',
        nickname: null,
        refinements: refinementValue,
        enchantments: enchantmentStats,
    };
}
