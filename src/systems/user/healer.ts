import { calculateShopCost } from '../shops/shops';
import { getUserData, getUserName, setUserCurrentHP } from './user';
import {
    getCurrencyName,
    getUserCurrencyTotal,
    adjustCurrencyForUser,
} from '../../firebot/firebot';

/**
 * Heals the player to full, as long as they have the money.
 * @param userCommand
 * @returns
 */
export async function chargePlayerForHeal(username: string): Promise<string> {
    const { currentHP, totalHP } = await getUserData(username);
    const amountToHeal = totalHP - currentHP;
    const characterName = await getUserName(username);
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);

    if (currentHP === totalHP) {
        return '';
    }

    const totalCost = await calculateShopCost(amountToHeal);

    // User has enough money to heal to full.
    if (characterCurrencyTotal >= totalCost) {
        // If no payment provided, then heal for full.
        await setUserCurrentHP(username, totalHP);
        await adjustCurrencyForUser(-Math.abs(totalCost), username);
        return `The healer charged ${characterName} ${totalCost} ${currencyName} to heal.`;
    }

    // User doesn't have enough money to heal to full, so use whatever currency they have left.
    await setUserCurrentHP(username, totalHP);
    await adjustCurrencyForUser(-Math.abs(characterCurrencyTotal), username);

    return `The healer, bound by oath, charged ${characterCurrencyTotal} ${currencyName} to heal.`;
}
