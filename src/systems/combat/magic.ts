import { logger } from '../../firebot/firebot';
import { Armor } from '../../types/equipment';
import { Character } from '../../types/user';
import { getArcaneFailureChance } from '../equipment/armor';
import { getItemByID } from '../equipment/helpers';
import { rollDice } from '../utils';

export async function didCharacterCastSuccessfully(
    attacker: Character
): Promise<boolean> {
    // Naked users have no arcane failure.
    if (attacker.armor == null) {
        return true;
    }

    const armor = (await getItemByID(attacker.armor.id, 'armor')) as Armor;
    const failureChance = getArcaneFailureChance(armor.properties[0]);
    const roll = rollDice('1d100');

    if (roll > failureChance) {
        return true;
    }

    logger('debug', `${attacker.name} failed their cast!`);
    return false;
}
