import { titleList } from '../../data/titles';
import { logger } from '../../firebot/firebot';
import { Rarity, StoredTitle, Title } from '../../types/equipment';
import { filterArrayByProperty } from '../utils';
import { getWeightedRarity } from './helpers';

export function getTitleFilteredByRarity(rarity: Rarity[]): Title {
    logger('debug', `Getting title filtered by rarity array.`);

    // First, pick which rarity our item will be.
    const selectedRarity = getWeightedRarity(rarity);

    logger('debug', `Our selected rarity is ${selectedRarity}`);

    // Then, narrow down our armor list to only items with that rarity.
    const availableTitles = filterArrayByProperty(
        titleList,
        ['rarity'],
        selectedRarity
    );

    // Then, pick a random item from our selected armor.
    return availableTitles[Math.floor(Math.random() * availableTitles.length)];
}

/**
 * Generates a title to be used on a character.
 * @param rarity
 * @returns
 */
export async function generateTitleByRarity(
    rarity: Rarity[]
): Promise<StoredTitle> {
    logger('debug', `Generating a ${rarity} title.`);
    const title = getTitleFilteredByRarity(rarity);

    return {
        id: title.id,
        itemType: 'title',
    };
}
