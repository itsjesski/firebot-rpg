import { logger } from '../../firebot/firebot';
import { GeneratedMonster } from '../../types/monsters';
import { Character } from '../../types/user';
import { approachPhase } from './approach';
import { meleePhase } from './melee';

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
