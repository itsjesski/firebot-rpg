import { Armor, CharacterClass, Title, Weapon } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import {
    Character,
    CharacterStatNames,
    EquippableSlots,
} from '../../types/user';
import { getArmorDexBonus } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { getToHitBonusSettings } from '../settings';

export async function getAdjustedCharacterStat(
    character: Character,
    stat: CharacterStatNames
): Promise<number> {
    const baseStat = character[stat as CharacterStatNames];

    const title = getItemByID(character.title.id, 'title') as Title;
    const characterClass = getItemByID(
        character.characterClass.id,
        'characterClass'
    ) as CharacterClass;

    const titleBonus = title.bonuses[stat as CharacterStatNames];
    const characterClassBonus =
        characterClass.bonuses[stat as CharacterStatNames];

    const totalEquipmentBonusPercentage =
        (titleBonus + characterClassBonus) / 100;

    // Round down.
    return Math.floor(baseStat * (1 + totalEquipmentBonusPercentage));
}

/**
 * Get's the range of a characters weapon.
 * @param character
 * @param slot
 * @returns
 */
export async function getRange(
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

    if (defender.armor != null) {
        const defenderArmor = getItemByID(defender.armor.id, 'armor') as Armor;
        const armorDexBonus =
            (await getAdjustedCharacterStat(defender, 'dex')) *
            getArmorDexBonus(defenderArmor.properties[0]);
        defenderAC =
            defenderArmor.armorClass +
            defender.armor.refinements +
            armorDexBonus;
    } else {
        defenderAC = await getAdjustedCharacterStat(defender, 'dex');
    }

    return defenderAC;
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
    const toHitDivider = getToHitBonusSettings() ? getToHitBonusSettings() : 5;
    let item;

    if (slot === 'mainHand') {
        item = getItemByID(attacker.mainHand.id, 'weapon') as Weapon;

        if (item.properties.includes('heavy')) {
            return Math.floor(attacker.str / toHitDivider);
        }

        if (item.properties.includes('finesse')) {
            return Math.floor(attacker.dex / toHitDivider);
        }

        return Math.floor((attacker.str + attacker.dex / 2) / toHitDivider);
    }

    if (slot === 'offHand' && attacker.offHand.itemType === 'weapon') {
        item = getItemByID(attacker.mainHand.id, 'weapon') as Weapon;

        if (item.properties.includes('heavy')) {
            return Math.floor(attacker.str / toHitDivider);
        }

        if (item.properties.includes('finesse')) {
            return Math.floor(attacker.dex / toHitDivider);
        }

        return Math.floor((attacker.str + attacker.dex / 2) / toHitDivider);
    }

    return 0;
}
