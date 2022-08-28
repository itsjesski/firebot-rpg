import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { calculateShopCost } from '../../systems/shops/shops';
import {
    getUserData,
    getUserName,
    setUserCurrentHP,
} from '../../systems/user/user';
import {
    getCurrencyName,
    getUserCurrencyTotal,
    adjustCurrencyForUser,
    sendChatMessage,
} from '../firebot';

/**
 * Heals the player to full, as long as they have the money.
 * @param userCommand
 * @returns
 */
export async function rpgHealerCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { currentHP, totalHP } = await getUserData(username);
    const amountToHeal = totalHP - currentHP;
    const characterName = await getUserName(username);
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);

    const totalCost = await calculateShopCost(amountToHeal);

    // User has enough money to heal to full.
    if (characterCurrencyTotal >= totalCost) {
        // If no payment provided, then heal for full.
        await setUserCurrentHP(username, totalHP);
        await adjustCurrencyForUser(-Math.abs(totalCost), username);
        sendChatMessage(
            `@${username}, ${characterName} healed for ${amountToHeal}. It cost ${totalCost} ${currencyName}.`
        );
        return;
    }

    // User doesn't have enough money to heal to full, so use whatever currency they have left.
    const healAmount = currentHP + characterCurrencyTotal;
    const partialCost = await calculateShopCost(healAmount);
    await setUserCurrentHP(username, totalHP);
    await adjustCurrencyForUser(-Math.abs(partialCost), username);
    sendChatMessage(
        `@${username}, ${characterName} healed for ${healAmount}. It cost ${partialCost} ${currencyName}.`
    );
}
