import { classList } from '../../data/classes';
import { logger } from '../../firebot/firebot';
import {
    CharacterClass,
    Rarity,
    StoredCharacterClass,
} from '../../types/equipment';
import { filterArrayByProperty } from '../utils';
import { getWeightedRarity } from './helpers';

export function getClassFilteredByRarity(rarity: Rarity[]): CharacterClass {
    logger('debug', `Getting class filtered by rarity array.`);

    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    logger('debug', `Our selected rarity is ${selectedRarity}`);

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

export async function generateClassForUser(
    username: string,
    rarity: Rarity[]
): Promise<StoredCharacterClass> {
    logger('debug', `Generating a ${rarity} class for ${username}.`);
    const characterClass = getClassFilteredByRarity(rarity);

    return {
        id: characterClass.id,
        itemType: 'characterClass',
    };
}
