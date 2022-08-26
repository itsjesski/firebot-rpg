import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getUserData, getUserName } from '../../systems/user/user';
import {
    getCurrencyName,
    adjustCurrencyForUser,
    sendChatMessage,
    setCharacterMeta,
    getUserCurrencyTotal,
} from '../firebot';

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
        await setCharacterMeta(username, totalHP, 'currentHP');
        await adjustCurrencyForUser(-Math.abs(amountToHeal), username);
        sendChatMessage(
            `@${username}, ${characterName} healed for ${amountToHeal}. It cost ${amountToHeal} ${currencyName}.`
        );
        return;
    }

    // User doesn't have enough money to heal to full, so use whatever currency they have left.
    const healAmount = currentHP + characterCurrencyTotal;
    await setCharacterMeta(username, healAmount, 'currentHP');
    await adjustCurrencyForUser(-Math.abs(characterCurrencyTotal), username);
    sendChatMessage(
        `@${username}, ${characterName} healed for ${healAmount}. It cost ${healAmount} ${currencyName}.`
    );
}
