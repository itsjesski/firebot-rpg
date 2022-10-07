import { logger } from '../../firebot/firebot';
import { Spell, Weapon } from '../../types/equipment';
import { CompleteCharacter, EquippableSlots } from '../../types/user';
import {
    getCharacterHitBonus,
    getCharacterTotalAC,
} from '../characters/characters';
import { getItemByID } from '../equipment/helpers';
import {
    getOffHandMissChanceSettings,
    getRangedInMeleeChanceSettings,
} from '../settings';
import { rollDice } from '../utils';
import { didCharacterCastSuccessfully } from './magic';

/**
 * Checks to see if user passed the innate offhand fumble chance.
 * @param attacker
 * @returns
 */
function offhandFumbled(attacker: CompleteCharacter): boolean {
    const offhand = attacker.offHandData as Weapon | Spell;

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
 * Check to see if we fumbled our ranged attack in melee.
 * @param attacker
 * @returns
 */
function rangedFumbled(attacker: CompleteCharacter): boolean {
    const missChance = getRangedInMeleeChanceSettings()
        ? getRangedInMeleeChanceSettings()
        : 25;
    const miss = rollDice(`1d100`) <= missChance;
    if (miss) {
        logger('debug', `${attacker.name} ranged fumbled!`);
        return true;
    }

    return false;
}

export async function didCharacterHitRanged(
    attacker: CompleteCharacter,
    defender: CompleteCharacter,
    slot: EquippableSlots,
    roundCounter: number
) {
    const defenderAC = await getCharacterTotalAC(defender, roundCounter);
    const hitBonus = await getCharacterHitBonus(attacker, slot);
    const roll = rollDice(`1d20`) + hitBonus;

    // You can only attack with these two slots, so check for that.
    if (slot !== 'mainHand' && slot !== 'offHand') {
        logger(
            'debug',
            `Could not get item in ${slot}. Assuming character missed...`
        );
        return false;
    }

    // Get our weapon data using the given slot.
    const key = `${slot}Data`;
    const item = attacker[key as keyof CompleteCharacter] as Weapon | Spell;

    // Make sure item exists.
    if (item == null) {
        logger(
            'debug',
            `Could not get item in ${slot}. Assuming character missed...`
        );
        return false;
    }

    // Spell arcane failure
    if (item.itemType === 'spell' && !didCharacterCastSuccessfully(attacker)) {
        return false;
    }

    if (slot === 'offHand') {
        // If we're using an offhand weapon, see if we fumbled.
        if (offhandFumbled(attacker)) {
            return false;
        }
    }

    // Check to see if our roll beats or hits the defender AC.
    if (roll >= defenderAC) {
        logger(
            'debug',
            `${attacker.name} hit! Hit: ${roll} (+${hitBonus}) vs AC: ${defenderAC}.`
        );
        return true;
    }

    logger(
        'debug',
        `${attacker.name} missed! Hit: ${roll} (+${hitBonus}) vs AC: ${defenderAC}.`
    );
    return false;
}

/**
 * Takes two characters and checks to see if we hit.
 * @param attacker
 * @param defender
 */
export async function didCharacterHitMelee(
    attacker: CompleteCharacter,
    defender: CompleteCharacter,
    slot: EquippableSlots,
    roundCounter: number
): Promise<boolean> {
    const defenderAC = await getCharacterTotalAC(defender, roundCounter);
    const hitBonus = await getCharacterHitBonus(attacker, slot);
    const roll = rollDice(`1d20 +${hitBonus}`);

    const item = getItemByID(
        attacker[slot as EquippableSlots].id,
        attacker[slot as EquippableSlots].itemType
    ) as Weapon | Spell;

    if (item == null) {
        logger(
            'debug',
            `Could not get item in ${slot}. Assuming character missed...`
        );
        return false;
    }

    // Spell arcane failure
    if (item.itemType === 'spell' && !didCharacterCastSuccessfully(attacker)) {
        return false;
    }

    // If we're using a ranged weapon in melee, see if we fumbled.
    if (item.properties.includes('ammunition') && rangedFumbled(attacker)) {
        return false;
    }

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
