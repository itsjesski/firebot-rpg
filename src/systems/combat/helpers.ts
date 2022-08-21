import { logger } from '../../firebot/firebot';
import { Armor, Weapon } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character, EquippableSlots } from '../../types/user';
import { getItemByID } from '../equipment/helpers';
import { rollDice } from '../utils';

/**
 * Returns an array of characters in turn order.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
export function initiative(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Character[] | GeneratedMonster[] {
    logger('debug', 'Getting initiative order.');
    const turnOrder = [];

    // Initiative
    if (characterOne.dex > characterTwo.dex) {
        turnOrder.push(characterOne);
    } else if (characterTwo.dex > characterOne.dex) {
        turnOrder.push(characterTwo);
    } else {
        const playerOneFirst = Math.random() < 0.5;
        if (playerOneFirst) {
            turnOrder.push(characterOne);
        } else {
            turnOrder.push(characterTwo);
        }
    }

    if (turnOrder.includes(characterOne)) {
        turnOrder.push(characterTwo);
    } else if (turnOrder.includes(characterTwo)) {
        turnOrder.push(characterOne);
    }

    return turnOrder;
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
 * Takes two characters and checks to see if we hit.
 * @param attacker
 * @param defender
 */
export async function didCharacterHit(
    attacker: Character,
    defender: Character | GeneratedMonster,
    slot: EquippableSlots
): Promise<boolean> {
    logger(
        'debug',
        `Checking if ${attacker.name} hit ${defender.name} with ${slot}.`
    );
    let defenderAC = 0;

    // If defender has armor, let's figure out their ac.
    if (defender.armor != null) {
        const defenderArmor = getItemByID(defender.armor.id, 'armor') as Armor;
        defenderAC = defenderArmor.armorClass + defender.armor.refinements;
    }

    const hitBonus = Math.floor(attacker.dex / 5);
    const roll = rollDice(`1d20 +${hitBonus}`);

    /**
     * TODO:
     * We want to take into account weapon properties, like 'light' weapons should remove the miss chance in offhand etc...
     */

    // Offhand has 25% chance to miss.
    if (slot === 'offHand') {
        const offhandMiss = rollDice(`1d4`) === 1;
        if (offhandMiss) {
            logger('debug', `${attacker.name} missed!`);
            return false;
        }
    }

    if (roll >= defenderAC) {
        logger('debug', `${attacker.name} hit!`);
        return true;
    }

    logger('debug', `${attacker.name} missed!`);
    return false;
}
