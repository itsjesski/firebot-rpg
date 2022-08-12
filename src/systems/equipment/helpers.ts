import { armorList } from '../../data/armor';
import { weaponEnchantmentNames } from '../../data/enchantments';
import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import {
    Armor,
    Enchantments,
    Rarity,
    StoredArmor,
    StoredWeapon,
    Weapon,
} from '../../types/equipment';
import { filterArrayByProperty, getTopValuesFromObject } from '../utils';

/**
 * This will choose a rarity from one of the given raritys, weighting them so that lower rarities show more often.
 * @param rarity
 * @returns
 */
export function getWeightedRarity(rarity: Rarity[]) {
    logger('debug', 'Calculating weighted rarity.');
    const weights: number[] = [];

    // Here we're defining the rarity of each rarity type.
    // If the rarity array is a full list of all rarities, then these are basically percentages. Otherwise they're weighted.
    rarity.forEach((item) => {
        switch (item) {
            case 'basic':
                weights.push(50);
                break;
            case 'rare':
                weights.push(35);
                break;
            case 'epic':
                weights.push(10);
                break;
            case 'legendary':
                weights.push(5);
                break;
            default:
        }
    });

    let i;

    // eslint-disable-next-line no-plusplus, no-param-reassign
    for (i = 0; i < weights.length; i++) weights[i] += weights[i - 1] || 0;

    const random = Math.random() * weights[weights.length - 1];

    // eslint-disable-next-line no-plusplus
    for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

    return rarity[i];
}

/**
 * Takes an ID and Item Type, and will return that item from it's list.
 * @param id
 * @param type
 * @returns
 */
export function getItemByID(id: number, type: string): Weapon | Armor | null {
    logger('debug', `Getting ${id} in ${type} list.`);
    let item = null;
    switch (type) {
        case 'weapon':
            [item] = filterArrayByProperty(weaponList, ['id'], id) as Weapon[];
            break;
        case 'armor':
            [item] = filterArrayByProperty(armorList, ['id'], id) as Armor[];
            break;
        default:
    }

    return item;
}

/**
 * Takes a list of enchantments and item type, and returns a neat enchantment name based on that combination.
 * @param enchantments
 * @param itemType
 */
export function getEnchantmentName(
    enchantments: Enchantments,
    itemType: string
): string | null {
    const topValues = getTopValuesFromObject(enchantments, 2);
    let enchantmentName = null;

    if (topValues.length === 0 || topValues == null) {
        return null;
    }

    logger(
        'debug',
        `Generating enchantment name. Top values were ${topValues[0]} and ${topValues[1]}.`
    );

    switch (itemType) {
        case 'weapon':
            enchantmentName = filterArrayByProperty(
                weaponEnchantmentNames,
                ['enchantments'],
                topValues
            );
            break;
        case 'armor':
            enchantmentName = [
                {
                    name: 'Protection',
                },
            ];
            break;
        default:
            enchantmentName = [
                {
                    name: 'Magic',
                },
            ];
    }

    return enchantmentName[0].name;
}

/**
 * This takes a stored item, and assembles its full name using it's reinforcements and enchantments.
 * @param item
 */
export function getFullItemName(item: StoredWeapon | StoredArmor): string {
    logger('debug', 'Compiling full item name.');
    const dbItem = getItemByID(item.id, item.itemType);
    let itemName = dbItem.name;
    const { enchantments } = item;
    const enchantmentName = getEnchantmentName(enchantments, item.itemType);

    if (enchantmentName != null) {
        itemName = `${itemName} of ${enchantmentName}`;
    }

    if (item.refinements !== 0) {
        itemName = `${itemName} +${item.refinements}`;
    }

    return itemName;
}
