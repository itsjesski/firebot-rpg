import { logger } from '../../firebot/firebot';
import { Weapon, Shield } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character } from '../../types/user';
import { getCharacterDamageBonus } from '../characters/characters';
import { getItemByID } from '../equipment/helpers';
import { rollDice } from '../utils';
import { initiative } from './combat';
import { didCharacterHitMelee } from './combat-hit';

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
    if (await didCharacterHitMelee(attacker, defender, 'mainHand')) {
        damage +=
            rollDice(mainWeapon.damage) +
            getCharacterDamageBonus(attacker, 'mainHand');
    }

    // Offhand check
    if (attacker.offHand != null) {
        const offHand = getItemByID(
            attacker.offHand.id,
            attacker.offHand.itemType
        ) as Weapon | Shield | null;
        if (
            offHand.itemType === 'weapon' &&
            (await didCharacterHitMelee(attacker, defender, 'offHand'))
        ) {
            damage +=
                rollDice(offHand.damage) +
                getCharacterDamageBonus(attacker, 'offHand');
        }
    }

    logger(
        'debug',
        `${attacker.name} hit ${defender.name} for ${damage} dmg total.`
    );

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

    logger(
        'debug',
        `Combat round started. ${characterOne.name} has ${characterOne.currentHP}/${characterOne.totalHP} hp vs ${characterTwo.currentHP}/${characterTwo.totalHP} hp.`
    );

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
            if (characterTwo.currentHP + healthResults.two <= 0) {
                logger(
                    'debug',
                    `Turn results (${
                        characterTwo.name
                    } dead.): ${JSON.stringify(healthResults)}`
                );
                return healthResults;
            }
        }

        if (character === characterTwo) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.one = await attackCharacter(
                characterTwo,
                characterOne
            );

            // If this would kill a character, immediately return results.
            if (characterOne.currentHP + healthResults.one <= 0) {
                logger(
                    'debug',
                    `Turn results (${
                        characterOne.name
                    } dead.): ${JSON.stringify(healthResults)}`
                );
                return healthResults;
            }
        }
    }

    logger('debug', `Turn results: ${JSON.stringify(healthResults)}`);
    return healthResults;
}

/**
 * Manages our melee phase.
 * @param characterOne
 * @param characterTwo
 */
export async function meleePhase(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<{ one: number; two: number }> {
    logger(
        'debug',
        `Starting melee combat between ${characterOne.name} and ${characterTwo.name}.`
    );
    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    let roundStats = null;

    // Here we're doing combat rounds until the death.
    while (characterOneTemp.currentHP > 0 && characterTwoTemp.currentHP > 0) {
        // eslint-disable-next-line no-await-in-loop
        roundStats = await combatRound(characterOneTemp, characterTwoTemp);
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;
        logger(
            'debug',
            `Current health: ${characterOne.name}: ${characterOneTemp.currentHP} and ${characterTwo.name}: ${characterTwoTemp.currentHP}.`
        );
    }

    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
    };

    logger(
        'debug',
        `Melee phase results: ${characterOne.name}: ${results.one} and ${characterTwo.name}: ${results.two}.`
    );

    return results;
}
