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
    const characterStats = await getUserData(username);
    const armor = characterStats.armor as StoredArmor;
    const values = {
        armor: 0,
    };

    if (armor?.refinements != null) {
        values.armor = armor.refinements;
    }
    return values;
}
