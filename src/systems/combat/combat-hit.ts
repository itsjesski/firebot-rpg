import { logger } from '../../firebot/firebot';
import { Weapon } from '../../types/equipment';
import { GeneratedMonster } from '../../types/monsters';
import { Character, EquippableSlots } from '../../types/user';
import {
    getCharacterHitBonus,
    getCharacterTotalAC,
} from '../characters/character-stats';
import { getItemByID } from '../equipment/helpers';
import { getOffHandMissChanceSettings } from '../settings';
import { rollDice } from '../utils';

/**
 * Checks to see if user passed the innate offhand fumble chance.
 * @param attacker
 * @returns
 */
function offhandFumbled(attacker: Character): boolean {
    const offhand = getItemByID(attacker.offHand.id, 'weapon') as Weapon;

    if (offhand == null) {
        logger(
            'debug',
            `${attacker.name} offhand fumbled! Couldn't find weapon in weapon list.`
        );
        return true;
    }

    const offhandIsLight = offhand.properties.includes('light');

    if (offhandIsLight) {
        return false;
    }

    const offhandMissChance = getOffHandMissChanceSettings()
        ? getOffHandMissChanceSettings()
        : 25;
    const offhandMiss = rollDice(`1d100`) <= offhandMissChance;
    if (offhandMiss) {
        logger('debug', `${attacker.name} offhand fumbled!`);
        return true;
    }

    return false;
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

    const defenderAC = await getCharacterTotalAC(defender);
    const hitBonus = getCharacterHitBonus(attacker, slot);
    const roll = rollDice(`1d20 +${hitBonus}`);

    // If we're using an offhand weapon, see if we fumbled.
    if (slot === 'offHand') {
        if (offhandFumbled(attacker)) {
            return false;
        }
    }

    // Check to see if our roll beats or hits the defender AC.
    if (roll >= defenderAC) {
        logger(
            'debug',
            `${attacker.name} hit! Hit: ${roll} vs AC: ${defenderAC}.`
        );
        return true;
    }

    logger(
        'debug',
        `${attacker.name} missed! Hit: ${roll} vs AC: ${defenderAC}.`
    );
    return false;
}
