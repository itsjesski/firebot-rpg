import { armorList } from '../../data/armor';
import { classList } from '../../data/classes';
import { shieldList } from '../../data/shields';
import { spellList } from '../../data/spells';
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
    Spell,
    Enchantments,
} from '../../types/equipment';
import { CompleteCharacter, EquippableSlots } from '../../types/user';
import { getItemFromItemListById } from '../utils';
import { getArcaneFailureChance } from './armor';
import {
    getEnchantmentName,
    getMergedEnchantmentsOfItem,
} from './enchantments';

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
        return null;
    }

    let item = null;

    logger('debug', `Getting item by id. ID: ${id}, TYPE: ${type}`);

    switch (type) {
        case 'weapon':
            [item] = getItemFromItemListById(weaponList, id) as Weapon[];
            break;
        case 'armor':
            [item] = getItemFromItemListById(armorList, id) as Armor[];
            break;
        case 'characterClass':
            [item] = getItemFromItemListById(classList, id) as CharacterClass[];
            break;
        case 'shield':
            [item] = getItemFromItemListById(shieldList, id) as Shield[];
            break;
        case 'title':
            [item] = getItemFromItemListById(titleList, id) as Title[];
            break;
        case 'spell':
            [item] = getItemFromItemListById(spellList, id) as Spell[];
            break;
        default:
    }

    if (item == null) {
        logger('debug', `Failed to find item.`);
    }

    return item;
}

export function mergeEnchantments(item: Enchantments, itemTwo: Enchantments) {
    const mergedObj = {} as Enchantments;

    Object.keys(item).forEach((key) => {
        mergedObj[key as keyof Enchantments] =
            item[key as keyof Enchantments] +
            (itemTwo[key as keyof Enchantments] || 0);
    });

    return mergedObj;
}

/**
 * This takes a stored item, and assembles its full name using it's refinements and enchantments.
 * @param item
 */
export function getFullItemName(
    character: CompleteCharacter,
    slot: EquippableSlots
): string {
    logger('debug', 'Compiling full item name.');

    const key = `${slot}Data`;
    const dbItem = character[
        key as keyof CompleteCharacter
    ] as EquippableItemsDetails;
    const item = character[slot as keyof CompleteCharacter] as StorableItems;

    if (dbItem == null) {
        return 'Nothing';
    }

    let itemName = `${dbItem.name}`;

    // These two items dont have enchantments or refinements, so stop here.
    if (item.itemType === 'characterClass' || item.itemType === 'title') {
        return itemName;
    }

    // Here we want to only run extra checks if the item has enchantments or refinements.
    const enchantments = getMergedEnchantmentsOfItem(character, slot);
    const enchantmentName = getEnchantmentName(enchantments, item.itemType);

    if (enchantmentName != null) {
        itemName = `${itemName} of ${enchantmentName}`;
    }

    if (item.refinements !== 0) {
        itemName = `${itemName} +${item.refinements}`;
    }

    return itemName;
}

/**
 * This puts together an item name, including it's stats, for displaying item details.
 * @param item
 * @returns
 */
export function getFullItemTextWithStats(
    character: CompleteCharacter,
    slot: EquippableSlots
) {
    logger('debug', 'Compiling full item name with stats.');

    const storedItem = character[slot];
    if (storedItem == null) {
        return 'Nothing';
    }

    const key = `${slot}Data`;
    const dbItem = character[
        key as keyof CompleteCharacter
    ] as EquippableItemsDetails;

    let message;

    const fullName = getFullItemName(character, slot);
    if (fullName == null) {
        return 'Nothing';
    }

    let enchantments = null;

    switch (dbItem.itemType) {
        case 'weapon':
            enchantments = getMergedEnchantmentsOfItem(character, slot);
            message = `${fullName} | ${dbItem.damage} DMG | ${
                dbItem.damage_type
            } | ${dbItem.properties.join(', ')} | ${
                dbItem.range > 0 ? dbItem.range : 'melee'
            } range | ${dbItem.rarity} ${getItemTypeDisplayName(
                dbItem
            )} | Earth: ${enchantments.earth}, Wind: ${
                enchantments.wind
            }, Fire: ${enchantments.fire}, Water: ${
                enchantments.water
            }, Light: ${enchantments.light}, Dark: ${enchantments.darkness}`;
            break;
        case 'armor':
            enchantments = getMergedEnchantmentsOfItem(character, slot);
            message = `${fullName} | ${
                dbItem.armorClass
            } AC | arcane failure ${getArcaneFailureChance(
                dbItem.properties[0]
            )}% | ${dbItem.properties.join(', ')} | ${
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)} | Earth: ${
                enchantments.earth
            }, Wind: ${enchantments.wind}, Fire: ${enchantments.fire}, Water: ${
                enchantments.water
            }, Light: ${enchantments.light}, Dark: ${enchantments.darkness}`;
            break;
        case 'shield':
            enchantments = getMergedEnchantmentsOfItem(character, slot);
            message = `${fullName} | ${
                dbItem.armorClass
            } AC | ${dbItem.properties.join(', ')} | ${
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)} | Earth: ${
                enchantments.earth
            }, Wind: ${enchantments.wind}, Fire: ${enchantments.fire}, Water: ${
                enchantments.water
            }, Light: ${enchantments.light}, Dark: ${enchantments.darkness}`;
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
            }% DEX, +${dbItem.bonuses.int}% INT | ${
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)}`;
            break;
        case 'spell':
            enchantments = getMergedEnchantmentsOfItem(character, slot);
            message = `${fullName} | ${dbItem.damage} DMG | ${
                dbItem.damage_type
            } | ${dbItem.properties.join(', ')} | ${
                dbItem.range > 0 ? dbItem.range : 'melee'
            } range | ${dbItem.rarity} ${getItemTypeDisplayName(
                dbItem
            )} | Earth: ${enchantments.earth}, Wind: ${
                enchantments.wind
            }, Fire: ${enchantments.fire}, Water: ${
                enchantments.water
            }, Light: ${enchantments.light}, Dark: ${enchantments.darkness}`;
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
