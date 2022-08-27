import {
    weaponEnchantmentNames,
    armorEnchantmentNames,
} from '../../data/enchantments';
import { logger, setCharacterMeta } from '../../firebot/firebot';
import {
    Armor,
    Enchantments,
    EnchantmentTypes,
    Shield,
    StoredArmor,
    StoredShield,
    StoredWeapon,
    Weapon,
} from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character, EquippableSlots } from '../../types/user';
import { getDamageBonusSettings } from '../settings';
import { getUserData } from '../user/user';
import {
    addOrSubtractRandomPercentage,
    filterArrayByProperty,
    getTopValuesFromObject,
    sumOfObjectProperties,
} from '../utils';
import { getItemByID } from './helpers';

/**
 * Generates an enchantment list using the given number of enchantment points.
 * @param baseEnchantmentValue
 * @returns
 */
export function generateEnchantmentList(
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

/**
 * Returns the refinement count for mainhand and offhand slots.
 * @param username
 * @returns
 */
export async function getUserHandItemEnchantmentCount(
    username: string
): Promise<{ main_hand: number; off_hand: number }> {
    const characterStats = await getUserData(username);
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

    return values;
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
    }

    if (enchantmentName == null || enchantmentName === []) {
        return 'Magic';
    }

    return enchantmentName[0].name;
}

/**
 * Gets the armor enchantment count for a user.
 * @param username
 * @returns
 */
export async function getUserArmorEnchantmentCount(
    username: string
): Promise<{ armor: number }> {
    const characterStats = await getUserData(username);
    const armor = characterStats.armor as StoredArmor;
    const values = {
        armor: 0,
    };

    if (armor?.enchantments != null) {
        values.armor = sumOfObjectProperties(armor.enchantments);
    }

    return values;
}

/**
 * Calculates the total elemental damage done to a defender.
 * @param attacker
 * @param defender
 */
export function getElementalDamageOfAttack(
    attacker: Character,
    defender: Character | GeneratedMonster,
    slot: EquippableSlots
): number {
    let item;
    let armor;
    let shield;
    let damage = 0;

    const damageBonusDivider = getDamageBonusSettings()
        ? getDamageBonusSettings()
        : 10;
    const intDmgBonus = Math.floor(attacker.int / damageBonusDivider);

    if (slot === 'mainHand') {
        item = getItemByID(attacker.mainHand.id, 'weapon') as Weapon;
    }

    if (slot === 'offHand' && attacker.offHand.itemType === 'weapon') {
        item = getItemByID(attacker.offHand.id, 'weapon') as Weapon;
    }

    if (item == null) {
        return 0;
    }

    if (defender.armor != null) {
        armor = getItemByID(defender.armor.id, 'armor') as Armor;
    }

    if (defender.offHand != null && defender.offHand?.itemType === 'shield') {
        shield = getItemByID(defender.armor.id, 'shield') as Shield;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [enchantment, enchantmentValue] of Object.entries(
        item.enchantments
    )) {
        // Get attacker offenses.
        const totalAttackerValue =
            enchantmentValue +
            item.enchantments[enchantment as keyof Enchantments];

        // Figure out opponent defenses.
        let totalDefenderValue = 0;

        if (armor != null) {
            totalDefenderValue +=
                defender.armor.enchantments[enchantment as keyof Enchantments] +
                armor.enchantments[enchantment as keyof Enchantments];
        }

        if (shield != null) {
            totalDefenderValue +=
                shield.enchantments[enchantment as keyof Enchantments];
        }

        // Now, figure out how much damage we took from this element.
        const roundDamage = totalAttackerValue - totalDefenderValue;

        logger(
            'debug',
            `${attacker.name} did ${roundDamage} ${enchantment} damage to ${defender.name}.`
        );

        if (roundDamage > 0) {
            damage += roundDamage;
        }
    }

    return damage + intDmgBonus;
}

/**
 * Increase the enchanted element on an item by one.
 * @param username
 * @param slot
 * @param element
 * @returns
 */
export async function increaseEnchantmentOfUserItem(
    username: string,
    slot: EquippableSlots,
    element: EnchantmentTypes
) {
    const userdata = await getUserData(username);

    // Make sure the slot is a valid one that can get enchantments.
    if (slot !== 'armor' && slot !== 'mainHand' && slot !== 'offHand') {
        return;
    }

    // Then, get the item from that slot.
    const item = userdata[slot] as StoredArmor | StoredWeapon | StoredShield;
    if (item == null) {
        return;
    }

    // Figure out current enchantment level, and then add one to the item.
    const currentLevel = item.enchantments[element];
    logger(
        'debug',
        `Increasing enchantment from ${currentLevel} to ${currentLevel + 1}.`
    );
    item.enchantments[element] = currentLevel + 1;

    // Return the item to it's slot with the new properties.
    await setCharacterMeta(username, item, slot);
}
