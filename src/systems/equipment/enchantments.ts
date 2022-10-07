import {
    weaponEnchantmentNames,
    armorEnchantmentNames,
} from '../../data/enchantments';
import { logger, setCharacterMeta } from '../../firebot/firebot';
import {
    Enchantments,
    EnchantmentTypes,
    Spell,
    StoredArmor,
    StoredShield,
    StoredWeapon,
    Weapon,
} from '../../types/equipment';
import { CompleteCharacter, EquippableSlots } from '../../types/user';
import {
    getCharacterDamageBonus,
    getCharacterElementalDefense,
    getCharacterIntBonus,
} from '../characters/characters';
import { getUserData } from '../user/user';
import {
    addOrSubtractRandomPercentage,
    filterArrayByProperty,
    getTopValuesFromObject,
    rollDice,
    sumOfObjectProperties,
} from '../utils';
import { mergeEnchantments } from './helpers';

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
        case 'spell':
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

    if (!enchantmentName?.length) {
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
 * Calculates if the defender resisted a magic spell.
 * @param attacker
 * @param defender
 */
export async function didDefenderResistMagic(
    attacker: CompleteCharacter,
    defender: CompleteCharacter
) {
    const defenderResistRoll =
        rollDice('1d20') + (await getCharacterIntBonus(defender));
    const attackerSpellRoll =
        rollDice('1d20') + (await getCharacterIntBonus(attacker));

    if (defenderResistRoll > attackerSpellRoll) {
        logger('debug', `${defender.name} resisted the spell!`);
        return true;
    }

    return false;
}

/**
 * Takes a character and item slot name, and returns a list of enchants, merging base and character enchantments together.
 * @param attacker
 * @param slot
 * @returns
 */
function getMergedEnchantmentsOfItem(
    attacker: CompleteCharacter,
    slot: EquippableSlots
) {
    let item;

    if (slot === 'mainHand') {
        item = attacker.mainHandData as Weapon | Spell;

        if (item == null) {
            return null;
        }

        return mergeEnchantments(
            item.enchantments,
            attacker.mainHand.enchantments
        );
    }

    if (slot === 'offHand' && attacker.offHand.itemType !== 'shield') {
        item = attacker.offHandData as Weapon | Spell;

        if (item == null) {
            return null;
        }

        return mergeEnchantments(
            item.enchantments,
            attacker.offHand.enchantments
        );
    }

    return null;
}

/**
 * Calculates the total elemental damage done to a defender.
 * @param attacker
 * @param defender
 */
export async function getElementalDamageOfAttack(
    attacker: CompleteCharacter,
    defender: CompleteCharacter,
    slot: EquippableSlots,
    roundCounter: number
): Promise<number> {
    let damage = 0;
    const mergedEnchantments = getMergedEnchantmentsOfItem(attacker, slot);
    const intDmgBonus = await getCharacterDamageBonus(attacker, slot);

    if (mergedEnchantments == null) {
        return 0;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [enchantment] of Object.entries(mergedEnchantments)) {
        // Get attacker offenses.
        const totalAttackerValue =
            mergedEnchantments[enchantment as keyof Enchantments];

        const totalDefenderValue = getCharacterElementalDefense(
            defender,
            enchantment as keyof Enchantments,
            roundCounter
        );

        const roundDamage = totalAttackerValue - totalDefenderValue;

        if (roundDamage > 0) {
            damage += roundDamage;
        }
    }

    // No int bonus for zero damage.
    if (damage === 0) {
        return 0;
    }

    return Math.floor(damage + intDmgBonus);
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
