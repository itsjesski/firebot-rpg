import { armorList } from '../../data/armor';
import { classList } from '../../data/classes';
import {
    armorEnchantmentNames,
    weaponEnchantmentNames,
} from '../../data/enchantments';
import { shieldList } from '../../data/shields';
import { titleList } from '../../data/titles';
import { weaponList } from '../../data/weapons';
import { logger } from '../../firebot/firebot';
import {
    Armor,
    Enchantments,
    EquippableItemsDetails,
    Rarity,
    StorableItems,
    StoredWeapon,
    Weapon,
    ItemTypes,
    CharacterClass,
    Shield,
    Title,
} from '../../types/equipment';
import { getCharacterData } from '../user/user';
import {
    filterArrayByProperty,
    getTopValuesFromObject,
    addOrSubtractRandomPercentage,
    sumOfObjectProperties,
} from '../utils';

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
        return null;
    }

    logger('debug', `Getting ${id} in ${type} list.`);
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
        case 'shield':
            enchantmentName = filterArrayByProperty(
                armorEnchantmentNames,
                ['enchantments'],
                topValues
            );
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
                dbItem.rarity
            } ${getItemTypeDisplayName(dbItem)}`;
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

export function generateEnchantmentListForUser(
    baseEnchantmentValue: number
): Enchantments {
    let availablePoints = addOrSubtractRandomPercentage(baseEnchantmentValue);
    const enchantments = {
        earth: 0,
        wind: 0,
        fire: 0,
        water: 0,
        light: 0,
        darkness: 0,
    };
    const enchantmentKeys = Object.keys(enchantments);

    // TODO: This could probably be improved.
    // Randomly assign our pool of points until we're out of them.
    while (availablePoints > 0) {
        const selectedEnchantment =
            enchantmentKeys[Math.floor(Math.random() * enchantmentKeys.length)];
        // @ts-ignore
        enchantments[selectedEnchantment] += 1;
        availablePoints -= 1;
    }

    return enchantments;
}

export async function getUserEnchantmentCount(
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

export async function getUserRefinementCount(
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
