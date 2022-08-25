import {
    Armor,
    CharacterClass,
    Shield,
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
 * Gets the to hit bonus based on weapon type.
 * @param attacker
 * @param slot
 * @returns
 */
export function getCharacterHitBonus(
    attacker: Character | GeneratedMonster,
    slot: EquippableSlots
): number {
    const toHitDivider = getHitBonusSettings() ? getHitBonusSettings() : 10;
    let item;

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
        return (
            Math.floor(Math.max(attacker.str, attacker.dex)) + item.refinements
        );
    }

    if (
        item.properties.includes('heavy') ||
        item.damage_type === 'bludgeoning'
    ) {
        return Math.floor(attacker.str / toHitDivider) + item.refinements;
    }

    if (
        item.properties.includes('finesse') ||
        item.damage_type === 'piercing'
    ) {
        return Math.floor(attacker.dex / toHitDivider) + item.refinements;
    }

    // If it's a regular weapon, then we go with str + dex / 2.
    return (
        Math.floor((attacker.str + attacker.dex / 2) / toHitDivider) +
        item.refinements
    );
}

/**
 * Gets the to hit bonus based on weapon type.
 * @param attacker
 * @param slot
 * @returns
 */
export function getCharacterDamageBonus(
    attacker: Character | GeneratedMonster,
    slot: EquippableSlots
): number {
    const damageBonusDivider = getDamageBonusSettings()
        ? getDamageBonusSettings()
        : 10;
    let item;

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
        return (
            Math.floor(
                Math.max(attacker.str, attacker.dex) / damageBonusDivider
            ) + item.refinements
        );
    }

    if (
        item.properties.includes('heavy') ||
        item.damage_type === 'bludgeoning'
    ) {
        return Math.floor(attacker.str / damageBonusDivider) + item.refinements;
    }

    if (
        item.properties.includes('finesse') ||
        item.damage_type === 'piercing'
    ) {
        return Math.floor(attacker.dex / damageBonusDivider) + item.refinements;
    }

    // If it's a regular weapon, then we go with str + dex / 2.
    return (
        Math.floor((attacker.str + attacker.dex / 2) / damageBonusDivider) +
        item.refinements
    );
}
