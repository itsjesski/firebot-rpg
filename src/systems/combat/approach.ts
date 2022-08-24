import { logger } from '../../firebot/firebot';
import { Armor, Weapon } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character } from '../../types/user';
import { getRange } from '../characters/character-stats';
import { getArmorMovementSpeed } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { rollDice } from '../utils';
import { initiative } from './combat';
import { didCharacterHitRanged } from './combat-hit';

async function rangedAttack(
    attacker: Character,
    defender: Character | GeneratedMonster,
    distance: number
): Promise<number> {
    logger(
        'debug',
        `Ranged Attack round: ${attacker.name} is attacking ${defender.name}.`
    );
    let damage = 0;

    // Get all of our weapons
    const mainWeapon = (await getItemByID(
        attacker.mainHand.id,
        'weapon'
    )) as Weapon;

    // See if we need to attack with our main weapon.
    if (
        mainWeapon.range >= distance &&
        (await didCharacterHitRanged(attacker, defender, 'mainHand'))
    ) {
        damage += rollDice(mainWeapon.damage);
    }

    // Try the offhand.
    if (attacker.offHand != null) {
        if (attacker.offHand.itemType === 'weapon') {
            const offHandWeapon = (await getItemByID(
                attacker.offHand.id,
                'weapon'
            )) as Weapon;

            // Check if we're attacking with offhand.
            if (
                offHandWeapon.range >= distance &&
                (await didCharacterHitRanged(attacker, defender, 'offHand'))
            ) {
                damage += rollDice(mainWeapon.damage);
            }
        }
    }

    logger(
        'debug',
        `${attacker.name} hit ${defender.name} for ${damage} dmg total.`
    );

    return -Math.abs(damage);
}

/**
 * Starts up a ranged combat round.
 * @param characterOne
 * @param characterTwo
 * @param distance
 * @returns
 */
async function rangedCombatRound(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster,
    distance: number
): Promise<{ one: number; two: number }> {
    logger('debug', `Ranged combat round starting.`);
    const healthResults = {
        one: 0,
        two: 0,
    };

    // Determine which character goes first.
    const turnOrder = initiative(characterOne, characterTwo);
    logger('debug', `Turn order: ${turnOrder[0].name}, ${turnOrder[1].name}.`);

    // eslint-disable-next-line no-restricted-syntax
    for (const character of turnOrder) {
        if (character === characterOne) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.two = await rangedAttack(
                characterOne,
                characterTwo,
                distance
            );

            // If this would kill a character, immediately return results.
            if (characterTwo.currentHP + healthResults.two <= 0) {
                logger(
                    'debug',
                    `Turn results: ${JSON.stringify(healthResults)}`
                );
                return healthResults;
            }
        } else if (character === characterTwo) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.one = await rangedAttack(
                characterTwo,
                characterOne,
                distance
            );

            // If this would kill a character, immediately return results.
            if (characterOne.currentHP + healthResults.one <= 0) {
                logger(
                    'debug',
                    `Turn results: ${JSON.stringify(healthResults)}`
                );
                return healthResults;
            }
        }
    }

    return healthResults;
}

async function isUsingAmmunitionWeapon(character: Character) {
    const weapon = (await getItemByID(
        character.mainHand.id,
        'weapon'
    )) as Weapon;
    if (weapon.properties.includes('ammunition')) {
        return true;
    }
    return false;
}

/**
 * Returns the maximum range of all weapons in combat.
 * @param character
 * @returns
 */
async function getMaxRangeOfCharacter(
    character: Character | GeneratedMonster
): Promise<number> {
    const ranges = [];

    ranges.push(await getRange(character, 'mainHand'));
    ranges.push(await getRange(character, 'offHand'));

    return Math.max(...ranges);
}

/**
 * Returns the maximum range of all weapons in combat.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
async function getMaxRangeOfEncounter(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<number> {
    const ranges = [];

    ranges.push(await getRange(characterOne, 'mainHand'));
    ranges.push(await getRange(characterTwo, 'mainHand'));

    ranges.push(await getRange(characterOne, 'offHand'));
    ranges.push(await getRange(characterTwo, 'offHand'));

    return Math.max(...ranges);
}

/**
 * Randomly generate initial engagement distance somewhere between max range and 50% of max range.
 * @param maxRange
 * @returns
 */
async function getEngagementDistance(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<number> {
    const maxRange = await getMaxRangeOfEncounter(characterOne, characterTwo);

    if (maxRange === 0) {
        return 0;
    }

    const minRange = maxRange * 0.5;
    return Math.floor(Math.random() * (maxRange - minRange) + minRange);
}

/**
 * Gets the distance characters will move each round to try to engage.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
async function getDistanceMoved(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<number> {
    logger('debug', `Calculating move distance.`);
    const characterOneMaxRange = await getMaxRangeOfCharacter(characterOne);
    const characterTwoMaxRange = await getMaxRangeOfCharacter(characterTwo);
    let approacherArmor = null;

    if (characterOneMaxRange >= characterTwoMaxRange) {
        approacherArmor = await getItemByID(characterTwo.armor?.id, 'armor');
    }

    approacherArmor = (await getItemByID(
        characterOne.armor?.id,
        'armor'
    )) as Armor;

    return getArmorMovementSpeed(approacherArmor);
}

/**
 * This is for a shootout, where both characters are using ammunition weapons.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
async function shootoutCombat(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<{ one: number; two: number }> {
    logger(
        'debug',
        `Both characters are using ammunition weapons. Let the shootout begin.`
    );

    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    let roundStats = null;
    while (characterOneTemp.currentHP > 0 && characterTwoTemp.currentHP > 0) {
        // Start shootout. Always pass distance of 1 and never change it. All ammunition weapons have this range.
        // eslint-disable-next-line no-await-in-loop
        roundStats = await rangedCombatRound(
            characterOneTemp,
            characterTwoTemp,
            1
        );
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
        `Shootout phase results: ${characterOne.name}: ${results.one} and ${characterTwo.name}: ${results.two}.`
    );

    return results;
}

/**
 * Here, characters are trying to get into melee range. Close distance each round until it is zero.
 * @param characterOne
 * @param characterTwo
 * @param engagementDistance
 * @returns
 */
async function approachCombat(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster,
    engagementDistance: number
): Promise<{ one: number; two: number }> {
    logger(
        'debug',
        `Approach phase has started. Engagement distance is: ${engagementDistance}.`
    );

    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    const distanceMoved = await getDistanceMoved(characterOne, characterTwo);
    logger('debug', `Characters will be moving ${distanceMoved} per round.`);

    let roundStats = null;
    let currentDistance = engagementDistance;

    while (
        characterOneTemp.currentHP > 0 &&
        characterTwoTemp.currentHP > 0 &&
        currentDistance > 0
    ) {
        // eslint-disable-next-line no-await-in-loop
        roundStats = await rangedCombatRound(
            characterOneTemp,
            characterTwoTemp,
            currentDistance
        );
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;

        // Move characters together.
        currentDistance -= distanceMoved;

        logger(
            'debug',
            `Current health: ${characterOne.name}: ${characterOneTemp.currentHP} and ${characterTwo.name}: ${characterTwoTemp.currentHP}. Remaining distance ${currentDistance}.`
        );
    }

    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
    };

    logger(
        'debug',
        `Approach phase results: ${characterOne.name}: ${results.one} and ${characterTwo.name}: ${results.two}.`
    );

    return results;
}

/**
 * The approach phase consists of characters approaching each other for melee. This is the ranged combat round.
 */
export async function approachPhase(
    characterOne: Character,
    characterTwo: Character | GeneratedMonster
): Promise<{ one: number; two: number }> {
    logger(
        'debug',
        `Starting approach phase between ${characterOne.name} and ${characterTwo.name}.`
    );

    const engagementDistance = await getEngagementDistance(
        characterOne,
        characterTwo
    );

    // Engagement distance is zero, both users are melee without any range.
    if (engagementDistance === 0) {
        const results = {
            one: characterOne.currentHP,
            two: characterTwo.currentHP,
        };

        logger(
            'debug',
            `Skipping approach phase, neither character has range.`
        );

        return results;
    }

    // Shootout, both characters are using ammunition weapons. So neither will want to engage in melee and distance is ignored.
    if (
        (await isUsingAmmunitionWeapon(characterOne)) &&
        (await isUsingAmmunitionWeapon(characterTwo))
    ) {
        return shootoutCombat(characterOne, characterTwo);
    }

    // Approach phase! Characters will gradually get closer together and make range attacks when possible until distance is zero.
    return approachCombat(characterOne, characterTwo, engagementDistance);
}
