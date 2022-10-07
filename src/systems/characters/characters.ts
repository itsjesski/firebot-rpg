import { logger } from '../../firebot/firebot';
import {
    Armor,
    CharacterClass,
    Enchantments,
    EnchantmentTypes,
    Shield,
    Spell,
    Title,
    Weapon,
} from '../../types/equipment';
import {
    Character,
    CharacterStatNames,
    CompleteCharacter,
    EquippableSlots,
} from '../../types/user';
import { getArmorDexBonus } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { getDamageBonusSettings, getHitBonusSettings } from '../settings';

export async function getAdjustedCharacterStat(
    character: CompleteCharacter,
    stat: CharacterStatNames
): Promise<number> {
    logger('debug', `Getting adjusted character stats for ${character.name}.`);
    const baseStat = character[stat as CharacterStatNames];
    let bonus = 0;

    if (character.title != null) {
        const title = character.titleData as Title;
        const titleBonus = title.bonuses[stat as CharacterStatNames];
        bonus += titleBonus;
    }

    if (character.characterClass != null) {
        const characterClass = character.characterClassData as CharacterClass;
        const characterClassBonus =
            characterClass.bonuses[stat as CharacterStatNames];
        bonus += characterClassBonus;
    }

    const totalEquipmentBonusPercentage = bonus / 100;

    // Round down.
    return Math.floor(baseStat * (1 + totalEquipmentBonusPercentage));
}

/**
 * Get's the range of a characters weapon.
 * @param character
 * @param slot
 * @returns
 */
export async function getCharacterWeaponRange(
    character: CompleteCharacter,
    slot: 'mainHand' | 'offHand'
): Promise<number> {
    if (slot === 'offHand' && character.offHand?.itemType === 'weapon') {
        const weapon = character.offHandData as Weapon;
        return weapon.range;
    }

    const weapon = character.mainHandData as Weapon;
    return weapon.range;
}

/**
 * Returns AC of user with dex bonus, refinements, shields, and other things applied.
 * @param username
 */
export async function getCharacterTotalAC(
    defender: CompleteCharacter,
    roundCounter: number
): Promise<number> {
    let defenderAC = 0;

    // Calculate armor AC.
    if (defender.armor !== null) {
        const defenderArmor = defender.armorData as Armor;
        const armorDexBonus =
            ((await getAdjustedCharacterStat(defender, 'dex')) *
                getArmorDexBonus(defenderArmor.properties[0])) /
            10;
        defenderAC =
            defenderArmor.armorClass +
            defender.armor.refinements +
            armorDexBonus;
    } else {
        defenderAC =
            ((await getAdjustedCharacterStat(defender, 'dex')) *
                getArmorDexBonus(null)) /
            10;
    }

    // Get shield AC value.
    if (defender.offHand !== null && defender.offHand?.itemType === 'shield') {
        const defenderShield = defender.offHandData as Shield;
        defenderAC += defenderShield.armorClass + defender.offHand.refinements;
    }

    const preDefenseDown = defenderAC;

    // After 10 rounds, armor starts to wear down.
    let defenseDown = roundCounter - 10;
    let defenderACMod = 0;
    if (defenseDown > 0) {
        defenseDown /= 10; // convert to percentage
        defenderACMod = Math.floor(defenderAC * defenseDown);
        defenderAC = Math.max(Math.floor(defenderAC - defenderACMod), 0);
        logger(
            'debug',
            `We're on round ${roundCounter}. So ${defender.name} AC was lowered by ${defenderACMod}. It is now ${defenderAC} / ${preDefenseDown}.`
        );
    }

    return Math.floor(defenderAC);
}

/**
 * Returns defenders defenses against a specific element.
 * @param defender
 * @param enchantment
 * @returns
 */
export function getCharacterElementalDefense(
    defender: CompleteCharacter,
    enchantment: EnchantmentTypes,
    roundCounter: number
) {
    let totalDefenderValue = 0;
    let armor = null;
    let shield = null;

    if (defender.armor != null) {
        armor = defender.armorData as Armor;
    }

    if (defender.offHand != null && defender.offHand?.itemType === 'shield') {
        shield = defender.offHandData as Shield;
    }

    if (armor != null) {
        totalDefenderValue +=
            defender.armor.enchantments[enchantment as keyof Enchantments] +
            armor.enchantments[enchantment as keyof Enchantments];
    }

    if (shield != null) {
        totalDefenderValue +=
            shield.enchantments[enchantment as keyof Enchantments];
    }

    const preDefenseDown = totalDefenderValue;

    // After 10 rounds, defenses starts to wear down.
    let defenseDown = roundCounter - 10;
    let defenderResistMod = 0;
    if (defenseDown > 0) {
        defenseDown /= 10; // convert to percentage
        defenderResistMod = Math.floor(totalDefenderValue * defenseDown);
        totalDefenderValue = Math.max(
            Math.floor(totalDefenderValue - defenderResistMod),
            0
        );
        logger(
            'debug',
            `We're on round ${roundCounter}. So ${defender.name} ${enchantment} resist was lowered by ${defenderResistMod}. It is now ${totalDefenderValue} / ${preDefenseDown}.`
        );
    }

    return Math.floor(totalDefenderValue);
}

/**
 * Gets a characters int bonus used in spellcasting and resisting.
 * @param attacker
 */
export async function getCharacterIntBonus(attacker: CompleteCharacter) {
    const toHitDivider = getHitBonusSettings() ? getHitBonusSettings() : 10;
    const int = await getAdjustedCharacterStat(attacker, 'int');
    return Math.floor(int / toHitDivider);
}

/**
 * Gets the to hit bonus based on weapon type.
 * @param attacker
 * @param slot
 * @returns
 */
export async function getCharacterHitBonus(
    attacker: CompleteCharacter,
    slot: EquippableSlots
): Promise<number> {
    const toHitDivider = getHitBonusSettings() ? getHitBonusSettings() : 10;
    let item;
    const str = await getAdjustedCharacterStat(attacker, 'str');
    const dex = await getAdjustedCharacterStat(attacker, 'dex');
    const int = await getAdjustedCharacterStat(attacker, 'int');

    // Get our item first.
    if (slot === 'mainHand') {
        item = getItemByID(attacker.mainHand.id, attacker.mainHand.itemType) as
            | Weapon
            | Spell;
    }

    if (
        (slot === 'offHand' && attacker.offHand.itemType === 'weapon') ||
        (slot === 'offHand' && attacker.offHand.itemType === 'spell')
    ) {
        item = getItemByID(attacker.offHand.id, attacker.mainHand.itemType) as
            | Weapon
            | Spell;
    }

    if (item == null) {
        return 0;
    }

    // Spell to hit.
    if (item.itemType === 'spell') {
        return Math.floor(int / toHitDivider) + item.refinements;
    }

    // Now, adjust for item properties.
    if (item.properties.includes('versatile')) {
        return Math.floor(Math.max(str, dex)) + item.refinements;
    }

    if (
        item.properties.includes('heavy') ||
        item.damage_type === 'bludgeoning'
    ) {
        return Math.floor(str / toHitDivider) + item.refinements;
    }

    if (
        item.properties.includes('finesse') ||
        item.damage_type === 'piercing'
    ) {
        return Math.floor(dex / toHitDivider) + item.refinements;
    }

    // If it's a regular weapon, then we go with str + dex / 2.
    return Math.floor((str + dex / 2) / toHitDivider) + item.refinements;
}

/**
 * Gets the to hit bonus based on weapon type.
 * @param attacker
 * @param slot
 * @returns
 */
export async function getCharacterDamageBonus(
    attacker: CompleteCharacter,
    slot: EquippableSlots
): Promise<number> {
    const damageBonusDivider = getDamageBonusSettings()
        ? getDamageBonusSettings()
        : 10;
    let item;
    const str = await getAdjustedCharacterStat(attacker, 'str');
    const dex = await getAdjustedCharacterStat(attacker, 'dex');
    const int = await getAdjustedCharacterStat(attacker, 'int');

    // Get our item first.
    if (slot === 'mainHand') {
        item = getItemByID(attacker.mainHand.id, 'weapon') as Weapon | Spell;
    }

    if (slot === 'offHand' && attacker.offHand.itemType !== 'shield') {
        item = getItemByID(attacker.offHand.id, 'weapon') as Weapon | Spell;
    }

    if (item == null) {
        return 0;
    }

    // Item is a spell, use int.
    if (item.itemType === 'spell') {
        return Math.floor(int / damageBonusDivider);
    }

    // Now, adjust for item properties.
    if (item.properties.includes('versatile')) {
        return Math.floor(Math.max(str, dex) / damageBonusDivider);
    }

    if (item.properties.includes('heavy')) {
        return Math.floor(str / damageBonusDivider);
    }

    if (item.properties.includes('finesse')) {
        return Math.floor(dex / damageBonusDivider);
    }

    // If it's a regular weapon, then we go with str + dex / 2.
    return Math.floor((str + dex / 2) / damageBonusDivider);
}

/**
 * Pulls all of the data needed for a player, including all items.
 * @param character
 */
export async function getCompleteCharacterData(
    character: Character
): Promise<CompleteCharacter> {
    const characterData = character as CompleteCharacter;

    logger(
        'debug',
        `Getting complete character details for ${character.name}.`
    );

    // Main Hand
    characterData.mainHandData = getItemByID(
        characterData.mainHand.id,
        characterData.mainHand.itemType
    ) as Weapon | Spell;

    // Off Hand
    if (characterData.offHand != null) {
        characterData.offHandData = getItemByID(
            characterData.offHand.id,
            characterData.offHand.itemType
        ) as Weapon | Spell | Shield;
    } else {
        characterData.offHandData = null;
    }

    // Armor
    if (characterData.armor != null) {
        characterData.armorData = getItemByID(
            characterData.armor.id,
            characterData.armor.itemType
        ) as Armor;
    } else {
        characterData.armorData = null;
    }

    // Class
    if (characterData.characterClass != null) {
        characterData.characterClassData = getItemByID(
            characterData.characterClass.id,
            characterData.characterClass.itemType
        ) as CharacterClass;
    } else {
        characterData.characterClassData = null;
    }

    // Title
    if (characterData.title != null) {
        characterData.titleData = getItemByID(
            characterData.title.id,
            characterData.title.itemType
        ) as Title;
    } else {
        characterData.titleData = null;
    }

    return characterData;
}
