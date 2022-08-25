import { logger } from '../../firebot/firebot';
import { Weapon } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character, EquippableSlots } from '../../types/user';
import { getCharacterDamageBonus } from '../characters/characters';
import { getElementalDamageOfAttack } from '../equipment/enchantments';
import { getItemByID } from '../equipment/helpers';
import { rollDice } from '../utils';
import { approachPhase } from './approach';
import { meleePhase } from './melee';

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
 * Calculate our damage for a certain attack against a specific character.
 * @param attacker
 * @param defender
 * @param slot
 * @returns
 */
export function calculateDamage(
    attacker: Character,
    defender: Character | GeneratedMonster,
    slot: EquippableSlots
) {
    logger('debug', `Calculating damage...`);
    let damage = 0;

    if (slot === 'mainHand') {
        const mainWeapon = getItemByID(
            attacker.mainHand.id,
            attacker.mainHand.itemType
        ) as Weapon;
        damage +=
            rollDice(mainWeapon.damage) +
            getCharacterDamageBonus(attacker, 'mainHand') +
            getElementalDamageOfAttack(attacker, defender, 'mainHand');
    }

    if (attacker.offHand != null && attacker.offHand.itemType === 'weapon') {
        const offHand = getItemByID(
            attacker.offHand.id,
            attacker.offHand.itemType
        ) as Weapon;

        damage +=
            rollDice(offHand.damage) +
            getCharacterDamageBonus(attacker, 'offHand') +
            getElementalDamageOfAttack(attacker, defender, 'offHand');
    }

    // Sanity check.
    if (damage < 0) {
        return 0;
    }

    return damage;
}

/**
 * Initiates combat between two characters.
 * Returns the remaining HP of both parties on combat end.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
export async function startCombat(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<{ one: number; two: number }> {
    logger(
        'debug',
        `Starting combat between ${characterOne.name} and ${characterTwo.name}.`
    );
    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;

    // First, start with our approach phase.
    const phaseOne = await approachPhase(characterOne, characterTwo);
    characterOneTemp.currentHP = phaseOne.one;
    characterTwoTemp.currentHP = phaseOne.two;

    // Check if anyone died in approach phase.
    if (characterOneTemp.currentHP <= 0 || characterTwoTemp.currentHP <= 0) {
        const results = {
            one: characterOneTemp.currentHP,
            two: characterTwoTemp.currentHP,
        };

        logger(
            'debug',
            `Final combat results: ${characterOne.name}: ${characterOne.currentHP} and ${characterTwo.name}: ${characterTwo.currentHP}.`
        );

        return results;
    }

    // Now, our melee phase since people are still alive.
    // After the melee combat, someone WILL be defeated.
    // Make sure to pass temp characters through here so the health from phase one is carried over.
    const phaseTwo = await meleePhase(characterOneTemp, characterTwoTemp);
    characterOneTemp.currentHP = phaseTwo.one;
    characterTwoTemp.currentHP = phaseTwo.two;

    // Alright, lets return our results.
    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
    };
    logger(
        'debug',
        `Final combat results: ${characterOne.name}: ${characterOne.currentHP} and ${characterTwo.name}: ${characterTwo.currentHP}.`
    );
    return results;
}
