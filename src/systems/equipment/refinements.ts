import { logger } from '../../firebot/firebot';
import { StoredWeapon } from '../../types/equipment';
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
