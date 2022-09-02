import {
    Armor,
    CharacterClass,
    Shield,
    Spell,
    Title,
    Weapon,
} from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import {
    Character,
    CharacterStatNames,
    EquippableSlots,
} from '../../types/user';
import { getArmorDexBonus } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { getDamageBonusSettings, getHitBonusSettings } from '../settings';

export async function getAdjustedCharacterStat(
    character: Character | GeneratedMonster,
    stat: CharacterStatNames
): Promise<number> {
    const baseStat = character[stat as CharacterStatNames];
    let bonus = 0;

    if (character.title != null) {
        const title = getItemByID(character.title.id, 'title') as Title;
        const titleBonus = title.bonuses[stat as CharacterStatNames];
        bonus += titleBonus;
    }

    if (character.characterClass != null) {
        const characterClass = getItemByID(
            character.characterClass.id,
            'characterClass'
        ) as CharacterClass;
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
    character: Character | GeneratedMonster,
    slot: 'mainHand' | 'offHand'
): Promise<number> {
    if (slot === 'offHand' && character.offHand?.itemType === 'weapon') {
        const weapon = getItemByID(character.offHand.id, 'weapon') as Weapon;
        return weapon.range;
    }

    const weapon = getItemByID(character.mainHand.id, 'weapon') as Weapon;
    return weapon.range;
}

/**
 * Returns AC of user with dex bonus, refinements, shields, and other things applied.
 * @param username
 */
export async function getCharacterTotalAC(
    defender: Character | GeneratedMonster
): Promise<number> {
    let defenderAC = 0;

    // Calculate armor AC.
    if (defender.armor !== null) {
        const defenderArmor = getItemByID(defender.armor.id, 'armor') as Armor;
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
        const defenderShield = getItemByID(
            defender.offHand.id,
            'shield'
        ) as Shield;
        defenderAC += defenderShield.armorClass + defender.offHand.refinements;
    }

    return Math.floor(defenderAC);
}

/**
 * Gets a characters int bonus used in spellcasting and resisting.
 * @param attacker
 */
export async function getCharacterIntBonus(
    attacker: Character | GeneratedMonster
) {
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
    attacker: Character | GeneratedMonster,
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
    attacker: Character | GeneratedMonster,
    slot: EquippableSlots
): Promise<number> {
    const damageBonusDivider = getDamageBonusSettings()
        ? getDamageBonusSettings()
        : 10;
    let item;
    const str = await getAdjustedCharacterStat(attacker, 'str');
    const dex = await getAdjustedCharacterStat(attacker, 'dex');

    // Get our item first.
    if (slot === 'mainHand') {
        item = getItemByID(attacker.mainHand.id, 'weapon') as Weapon;
    }

    if (slot === 'offHand' && attacker.offHand.itemType === 'weapon') {
        item = getItemByID(attacker.offHand.id, 'weapon') as Weapon;
    }

    if (item == null) {
        return 0;
    }

    // Now, adjust for item properties.
    if (item.properties.includes('versatile')) {
        return Math.floor(Math.max(str, dex) / damageBonusDivider);
    }

    if (
        item.properties.includes('heavy') ||
        item.damage_type === 'bludgeoning'
    ) {
        return Math.floor(str / damageBonusDivider);
    }

    if (
        item.properties.includes('finesse') ||
        item.damage_type === 'piercing'
    ) {
        return Math.floor(dex / damageBonusDivider);
    }

    // If it's a regular weapon, then we go with str + dex / 2.
    return Math.floor((str + dex / 2) / damageBonusDivider);
}
