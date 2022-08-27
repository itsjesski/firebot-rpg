import { setCharacterMeta } from '../../firebot/firebot';
import { StoredArmor, StoredShield, StoredWeapon } from '../../types/equipment';
import { EquippableSlots } from '../../types/user';
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

/**
 * Increase the refinement level of an item.
 * @param username
 * @param slot
 * @returns
 */
export async function increaseRefinementLevelOfUserItem(
    username: string,
    slot: EquippableSlots
) {
    const userdata = await getUserData(username);

    // Make sure the slot is a valid one that can get enchantments.
    if (slot !== 'armor' && slot !== 'mainHand' && slot !== 'offHand') {
        return;
    }

    // Then, get the item from that slot.
    const item = userdata[slot] as StoredArmor | StoredWeapon | StoredShield;
    if (item == null) {
        return;
    }

    // Figure out current refinement level, and then add one to the item.
    const currentLevel = item.refinements;
    item.refinements = currentLevel + 1;

    // Return the item to it's slot with the new properties.
    await setCharacterMeta(username, item, slot);
}
