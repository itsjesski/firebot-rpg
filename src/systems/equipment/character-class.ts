import { classList } from '../../data/classes';
import {
    CharacterClass,
    Rarity,
    StoredCharacterClass,
} from '../../types/equipment';
import { filterArrayByProperty } from '../utils';
import { getWeightedRarity } from './helpers';

/**
 * Gets a random class by the given rarity.
 * @param rarity
 * @returns
 */
export function getClassFilteredByRarity(rarity: Rarity[]): CharacterClass {
    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    // Then, narrow down our armor list to only items with that rarity.
    const availableClasses = filterArrayByProperty(
        classList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected armor.
    return availableClasses[
        Math.floor(Math.random() * availableClasses.length)
    ];
}

/**
 * Generates a class for user on character.
 * @param rarity
 * @returns
 */
export async function generateClass(
    rarity: Rarity[]
): Promise<StoredCharacterClass> {
    const characterClass = getClassFilteredByRarity(rarity);

    return {
        id: characterClass.id,
        itemType: 'characterClass',
    };
}
