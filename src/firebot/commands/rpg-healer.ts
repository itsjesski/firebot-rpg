import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
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

    // User has enough money to heal to full.
    if (characterCurrencyTotal >= amountToHeal) {
        // If no payment provided, then heal for full.
        await setUserCurrentHP(username, totalHP);
        await adjustCurrencyForUser(-Math.abs(amountToHeal), username);
        sendChatMessage(
            `@${username}, ${characterName} healed for ${amountToHeal}. It cost ${amountToHeal} ${currencyName}.`
        );
        return;
    }

    // User doesn't have enough money to heal to full, so use whatever currency they have left.
    const healAmount = currentHP + characterCurrencyTotal;
    await setUserCurrentHP(username, totalHP);
    await adjustCurrencyForUser(-Math.abs(characterCurrencyTotal), username);
    sendChatMessage(
        `@${username}, ${characterName} healed for ${healAmount}. It cost ${healAmount} ${currencyName}.`
    );
}
