import { logger } from '../../firebot/firebot';
import { StoredArmor, StoredWeapon } from '../../types/equipment';
import { getUserData } from '../user/user';

/**
 * Returns the refinement count for mainhand and offhand slots.
 * @param username
 * @returns
 */
export async function getUserHandItemRefinementCount(
    username: string
): Promise<{ mainHand: number; offHand: number }> {
    logger('debug', `Getting weapon refinement count for ${username}.`);
    const characterStats = await getUserData(username);
    const mainHand = characterStats.mainHand as StoredWeapon;
    const offHand = characterStats.offHand as StoredWeapon;
    const values = {
        mainHand: 0,
        offHand: 0,
    };

    if (mainHand?.refinements != null) {
        values.mainHand = mainHand.refinements;
    }

    if (offHand?.refinements != null) {
        values.offHand = offHand.refinements;
    }

    logger(
        'debug',
        `Refinement count for main hand of ${username} is ${values.mainHand}.`
    );
    logger(
        'debug',
        `Refinement count for off hand of ${username} is ${values.offHand}.`
    );

    return values;
}

/**
 * Gets the armor refinement count for a user.
 * @param username
 * @returns
 */
export async function getUserArmorRefinementCount(
    username: string
): Promise<{ armor: number }> {
    logger('debug', `Getting armor refinement count for ${username}.`);
    const characterStats = await getUserData(username);
    const armor = characterStats.armor as StoredArmor;
    const values = {
        armor: 0,
    };

    if (armor?.refinements != null) {
        values.armor = armor.refinements;
    }

    logger(
        'debug',
        `Refinement count for ${username}'s armor is ${values.armor}.`
    );

    return values;
}
