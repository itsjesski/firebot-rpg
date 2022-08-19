import { logger } from '../../firebot/firebot';
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
    logger(
        'debug',
        `Attack round: ${attacker.name} is attacking ${defender.name}.`
    );
    let damage = 0;

    // Check to see if we did any damage with the main hand.
    const mainWeapon = getItemByID(
        attacker.mainHand.id,
        attacker.mainHand.itemType
    ) as Weapon;
    if (await didCharacterHit(attacker, defender, 'mainHand')) {
        damage += rollDice(mainWeapon.damage);
    }

    // Offhand check
    if (attacker.offHand != null) {
        const offHand = getItemByID(
            attacker.offHand.id,
            attacker.offHand.itemType
        ) as Weapon | Shield | null;
        if (
            offHand.itemType === 'weapon' &&
            (await didCharacterHit(attacker, defender, 'offHand'))
        ) {
            damage += rollDice(offHand.damage);
        }
    }

    logger('debug', `${attacker.name} hit ${defender.name} for ${damage} dmg.`);

    return -Math.abs(damage);
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

    logger('debug', 'Combat round started.');

    // Determine which character goes first.
    const turnOrder = initiative(characterOne, characterTwo);

    logger('debug', `Turn order: ${turnOrder[0].name}, ${turnOrder[1].name}.`);

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
                logger(
                    'debug',
                    `Turn results: ${JSON.stringify(healthResults)}`
                );
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
                logger(
                    'debug',
                    `Turn results: ${JSON.stringify(healthResults)}`
                );
                return healthResults;
            }
        }
    }

    logger('debug', `Turn results: ${JSON.stringify(healthResults)}`);
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
    logger(
        'debug',
        `Starting combat between ${characterOne.name} and ${characterTwo.name}.`
    );
    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    let roundStats = null;

    while (characterOneTemp.currentHP > 0 && characterTwoTemp.currentHP > 0) {
        // eslint-disable-next-line no-await-in-loop
        roundStats = await combatRound(characterOneTemp, characterTwoTemp);
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;
        logger(
            'debug',
            `Current health: Player one: ${characterOneTemp.currentHP} and Player two: ${characterTwoTemp.currentHP}.`
        );
    }

    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
    };

    logger(
        'debug',
        `Combat results: Player one: ${results.one} and Player two: ${results.two}.`
    );

    return results;
}
