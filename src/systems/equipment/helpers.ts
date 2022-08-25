import { armorList } from '../../data/armor';
import { classList } from '../../data/classes';
import { shieldList } from '../../data/shields';
import { titleList } from '../../data/titles';
import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import {
    Armor,
    EquippableItemsDetails,
    Rarity,
    StorableItems,
    Weapon,
    ItemTypes,
    CharacterClass,
    Shield,
    Title,
} from '../../types/equipment';
import { filterArrayByProperty } from '../utils';
import { getEnchantmentName } from './enchantments';

/**
 * Let's us translate our db item types to better display names.
 * @param item
 * @returns
 */
export function getItemTypeDisplayName(item: EquippableItemsDetails) {
    switch (item.itemType) {
        case 'characterClass':
            return 'class';
        default:
            return item.itemType;
    }
}

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
export function getItemByID(
    id: number,
    type: ItemTypes
): EquippableItemsDetails | null {
    if (id == null || type == null) {
        logger('debug', `Null passed to getitembyid, returning null.`);
        return null;
    }

    let item = null;

    switch (type) {
        case 'weapon':
            [item] = filterArrayByProperty(weaponList, ['id'], id) as Weapon[];
            break;
        case 'armor':
            [item] = filterArrayByProperty(armorList, ['id'], id) as Armor[];
            break;
        case 'characterClass':
            [item] = filterArrayByProperty(
                classList,
                ['id'],
                id
            ) as CharacterClass[];
            break;
        case 'shield':
            [item] = filterArrayByProperty(shieldList, ['id'], id) as Shield[];
            break;
        case 'title':
            [item] = filterArrayByProperty(titleList, ['id'], id) as Title[];
            break;
        default:
    }

    if (item == null) {
        logger('debug', `Failed to find item.`);
    }

    return item;
}

/**
 * This takes a stored item, and assembles its full name using it's reinforcements and enchantments.
 * @param item
 */
export function getFullItemName(item: StorableItems | null): string {
    logger('debug', 'Compiling full item name.');
    const dbItem = getItemByID(item.id, item.itemType);

    if (dbItem == null) {
        return 'Nothing';
    }

    let itemName = `${dbItem.name}`;
    let enchantments;
    let enchantmentName;

    // Here we want to only run extra checks if the item has enchantments or refinements.
    switch (item.itemType) {
        case 'weapon':
        case 'armor':
        case 'shield':
            enchantments = item.enchantments;
            enchantmentName = getEnchantmentName(enchantments, item.itemType);

            if (enchantmentName != null) {
                itemName = `${itemName} of ${enchantmentName}`;
            }

            if (item.refinements !== 0) {
                itemName = `${itemName} +${item.refinements}`;
            }
            break;
        default:
    }

    return itemName;
}

/**
 * This puts together an item name, including it's stats, for displaying item details.
 * @param item
 * @returns
 */
export function getFullItemTextWithStats(item: StorableItems | null) {
    logger('debug', 'Compiling full item name with stats.');

    if (item == null) {
        logger('debug', 'Null item passed to getFullItemTextWithStats');
        return 'Nothing';
    }

    const dbItem = getItemByID(item.id, item.itemType);
    let message;

    if (dbItem == null) {
        logger('debug', 'Could not find weapon in database.');
        return 'Nothing';
    }

    const fullName = getFullItemName(item);
    if (fullName == null) {
        return 'Nothing';
    }

    switch (dbItem.itemType) {
        case 'weapon':
            message = `${fullName} | ${dbItem.damage} DMG | ${
                dbItem.damage_type
            } | ${dbItem.properties.join(', ')} | ${
                dbItem.range > 0 ? dbItem.range : 'melee'
            } range | ${dbItem.rarity} ${getItemTypeDisplayName(dbItem)}`;
            break;
        case 'armor':
        case 'shield':
            message = `${fullName} | ${
                dbItem.armorClass
            } AC | ${dbItem.properties.join(', ')} | ${
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)}`;
            break;
        case 'title':
            message = `${fullName} | +${dbItem.bonuses.str}% STR, +${
                dbItem.bonuses.dex
            }% DEX, +${dbItem.bonuses.int}% INT | ${
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)}`;
            break;
        case 'characterClass':
            message = `${fullName} | +${dbItem.bonuses.str}% STR, +${
                dbItem.bonuses.dex
            }% DEX, +${dbItem.bonuses.int}% INT | ${dbItem.properties.join(
                ', '
            )} | ${dbItem.rarity} ${getItemTypeDisplayName(dbItem)}`;
            break;
        default:
            logger(
                'error',
                'Invalid item type passed to getFullItemTextWithStats'
            );
            return 'Invalid';
    }

    return message;
}
