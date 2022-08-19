import { Armor, Shield, Weapon } from '../../types/equipment';
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
function initiative(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Character[] | GeneratedMonster[] {
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
 * Takes two characters and checks to see if we hit.
 * @param attacker
 * @param defender
 */
async function didCharacterHit(
    attacker: Character,
    defender: Character | GeneratedMonster,
    slot: EquippableSlots
): Promise<boolean> {
    const defenderArmor = getItemByID(defender.armor.id, 'armor') as Armor;
    const defenderAC = defenderArmor.armorClass + defender.armor.refinements;
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
            return false;
        }
    }

    if (roll >= defenderAC) {
        return true;
    }

    return false;
}

/**
 * First character attacking second character. Returns damage dealt if any.
 * @param characterOne
 * @param characterTwo
 */
async function attackCharacter(
    attacker: Character,
    defender: Character | GeneratedMonster
): Promise<number> {
    const mainWeapon = (await getItemByID(
        attacker.mainHand.id,
        attacker.mainHand.itemType
    )) as Weapon;

    const offHand = (await getItemByID(
        attacker.offHand.id,
        attacker.offHand.itemType
    )) as Weapon | Shield | null;

    let damage = 0;

    // Check to see if we did any damage with the main hand.
    if (didCharacterHit(attacker, defender, 'mainHand')) {
        damage += rollDice(mainWeapon.damage);
    }

    // Offhand check
    if (
        offHand.itemType === 'weapon' &&
        didCharacterHit(attacker, defender, 'offHand')
    ) {
        damage += rollDice(offHand.damage);
    }

    return damage;
}

/**
 * Runs a round of combat against two characters and returns the amount of HP each character gained or lost.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
async function combatRound(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<{ one: number; two: number }> {
    const healthResults = {
        one: 0,
        two: 0,
    };

    // Determine which character goes first.
    const turnOrder = initiative(characterOne, characterTwo);

    // eslint-disable-next-line no-restricted-syntax
    for (const character of turnOrder) {
        if (character === characterOne) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.two = await attackCharacter(
                characterOne,
                characterTwo
            );

            // If this would kill a character, immediately return results.
            if (healthResults.two - characterTwo.currentHP <= 0) {
                return healthResults;
            }
        } else if (character === characterTwo) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.one = await attackCharacter(
                characterTwo,
                characterOne
            );

            // If this would kill a character, immediately return results.
            if (healthResults.one - characterOne.currentHP <= 0) {
                return healthResults;
            }
        }
    }

    return healthResults;
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
    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    let roundStats = null;

    while (characterOneTemp.currentHP > 0 || characterTwoTemp.currentHP > 0) {
        // eslint-disable-next-line no-await-in-loop
        roundStats = await combatRound(characterOneTemp, characterTwoTemp);
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;
    }

    return {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
    };
}
