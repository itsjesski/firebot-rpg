import { logger } from '../../firebot/firebot';
import { Armor, Spell, Weapon } from '../../types/equipment';
import { CompleteCharacter } from '../../types/user';
import { getCharacterWeaponRange } from '../characters/characters';
import { getArmorMovementSpeed } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { calculateDamage, initiative } from './combat';
import { didCharacterHitRanged } from './combat-hit';

async function rangedAttack(
    attacker: CompleteCharacter,
    defender: CompleteCharacter,
    distance: number,
    roundCounter: number
): Promise<number> {
    logger(
        'debug',
        `Ranged Attack round: ${attacker.name} is attacking ${defender.name}.`
    );
    let damage = 0;

    // Get all of our weapons
    const mainWeapon = attacker.mainHandData as Weapon | Spell;

    // See if we need to attack with our main weapon.
    if (
        mainWeapon.range >= distance &&
        (await didCharacterHitRanged(
            attacker,
            defender,
            'mainHand',
            roundCounter
        ))
    ) {
        damage += await calculateDamage(
            attacker,
            defender,
            'mainHand',
            roundCounter
        );
    }

    // Try the offhand.
    if (attacker.offHand != null) {
        if (
            attacker.offHand.itemType === 'weapon' ||
            attacker.offHand.itemType === 'spell'
        ) {
            const offHandWeapon = attacker.offHandData as Weapon | Spell;

            // Check if we're attacking with offhand.
            if (
                offHandWeapon.range >= distance &&
                (await didCharacterHitRanged(
                    attacker,
                    defender,
                    'offHand',
                    roundCounter
                ))
            ) {
                damage += await calculateDamage(
                    attacker,
                    defender,
                    'offHand',
                    roundCounter
                );
            }
        }
    }

    if (damage > 0) {
        logger(
            'debug',
            `${attacker.name} hit ${defender.name} for ${damage} dmg total.`
        );
    }

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
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter,
    distance: number,
    roundCounter: number
): Promise<{ one: number; two: number }> {
    logger('debug', `Ranged combat round starting.`);
    const healthResults = {
        one: 0,
        two: 0,
    };

    // Determine which character goes first.
    const turnOrder = initiative(characterOne, characterTwo);
    logger(
        'debug',
        `Turn order: ${turnOrder[0].name}, ${turnOrder[1].name}. Round: ${roundCounter}.`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const character of turnOrder) {
        if (character === characterOne) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.two = await rangedAttack(
                characterOne,
                characterTwo,
                distance,
                roundCounter
            );

            // If this would kill a character, immediately return results.
            if (characterTwo.currentHP + healthResults.two <= 0) {
                return healthResults;
            }
        } else if (character === characterTwo) {
            // eslint-disable-next-line no-await-in-loop
            healthResults.one = await rangedAttack(
                characterTwo,
                characterOne,
                distance,
                roundCounter
            );

            // If this would kill a character, immediately return results.
            if (characterOne.currentHP + healthResults.one <= 0) {
                return healthResults;
            }
        }
    }

    return healthResults;
}

async function isUsingAmmunitionWeapon(character: CompleteCharacter) {
    const weapon = character.mainHandData;
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
    character: CompleteCharacter
): Promise<number> {
    const ranges = [];

    ranges.push(await getCharacterWeaponRange(character, 'mainHand'));
    ranges.push(await getCharacterWeaponRange(character, 'offHand'));

    return Math.max(...ranges);
}

/**
 * Returns the maximum range of all weapons in combat.
 * @param characterOne
 * @param characterTwo
 * @returns
 */
async function getMaxRangeOfEncounter(
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter
): Promise<number> {
    const ranges = [];

    ranges.push(await getCharacterWeaponRange(characterOne, 'mainHand'));
    ranges.push(await getCharacterWeaponRange(characterTwo, 'mainHand'));

    ranges.push(await getCharacterWeaponRange(characterOne, 'offHand'));
    ranges.push(await getCharacterWeaponRange(characterTwo, 'offHand'));

    return Math.max(...ranges);
}

/**
 * Randomly generate initial engagement distance somewhere between max range and 50% of max range.
 * @param maxRange
 * @returns
 */
async function getEngagementDistance(
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter
): Promise<number> {
    logger('debug', 'Getting engagement distances...');
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
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter
): Promise<number> {
    logger('debug', 'Getting move distance...');
    const characterOneMaxRange = await getMaxRangeOfCharacter(characterOne);
    const characterTwoMaxRange = await getMaxRangeOfCharacter(characterTwo);
    let approacherArmor = null;

    if (characterOneMaxRange >= characterTwoMaxRange) {
        approacherArmor = (await getItemByID(
            characterTwo.armor?.id,
            'armor'
        )) as Armor;
        return getArmorMovementSpeed(approacherArmor);
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
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter
): Promise<{ one: number; two: number; rounds: number }> {
    logger(
        'debug',
        `Both characters are using ammunition weapons. Let the shootout begin.`
    );

    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    let roundStats = null;
    let roundCounter = 1;
    while (characterOneTemp.currentHP > 0 && characterTwoTemp.currentHP > 0) {
        // Start shootout. Always pass distance of 1 and never change it. All ammunition weapons have this range.
        // eslint-disable-next-line no-await-in-loop
        roundStats = await rangedCombatRound(
            characterOneTemp,
            characterTwoTemp,
            1,
            roundCounter
        );
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;
        logger(
            'debug',
            `Current health: ${characterOne.name}: ${characterOneTemp.currentHP} and ${characterTwo.name}: ${characterTwoTemp.currentHP}.`
        );

        // Up round by one.
        roundCounter += 1;
    }

    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
        rounds: roundCounter,
    };

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
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter,
    engagementDistance: number
): Promise<{ one: number; two: number; rounds: number }> {
    logger(
        'debug',
        `Approach phase has started. Engagement distance is: ${engagementDistance}.`
    );

    const characterOneTemp = characterOne;
    const characterTwoTemp = characterTwo;
    const distanceMoved = await getDistanceMoved(characterOne, characterTwo);
    logger('debug', `Characters will be moving ${distanceMoved} per round.`);

    let roundStats = null;
    let roundCounter = 1;
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
            currentDistance,
            roundCounter
        );
        characterOneTemp.currentHP += roundStats.one;
        characterTwoTemp.currentHP += roundStats.two;

        // Move characters together.
        currentDistance -= distanceMoved;

        // Count round up
        roundCounter += 1;

        logger(
            'debug',
            `Current health: ${characterOne.name}: ${characterOneTemp.currentHP} and ${characterTwo.name}: ${characterTwoTemp.currentHP}. Remaining distance ${currentDistance}.`
        );
    }

    const results = {
        one: characterOneTemp.currentHP,
        two: characterTwoTemp.currentHP,
        rounds: roundCounter,
    };

    logger(
        'debug',
        `Approach phase complete: ${characterOne.name}: ${results.one} and ${characterTwo.name}: ${results.two}. Took ${roundCounter} rounds.`
    );

    return results;
}

/**
 * The approach phase consists of characters approaching each other for melee. This is the ranged combat round.
 */
export async function approachPhase(
    characterOne: CompleteCharacter,
    characterTwo: CompleteCharacter
): Promise<{ one: number; two: number; rounds: number }> {
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
            rounds: 1,
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
