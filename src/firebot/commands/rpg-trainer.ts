import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import {
    getTrainingBaseCost,
    getTrainingCostMultiplier,
    getTrainingLevelLimit,
} from '../../systems/settings';
import { calculateShopCost } from '../../systems/shops/shops';
import { getUserName, getUserData, setUserStat } from '../../systems/user/user';
import { CharacterStatNames } from '../../types/user';
import {
    getWorldMeta,
    getCurrencyName,
    getUserCurrencyTotal,
    sendChatMessage,
    adjustCurrencyForUser,
    logger,
} from '../firebot';

async function shopTrainStat(
    userCommand: UserCommand,
    stat: CharacterStatNames | 'totalHP'
) {
    const username = userCommand.commandSender;
    const { upgrades } = await getWorldMeta();
    const characterName = await getUserName(username);
    const { trainer } = upgrades;
    const statLimit = trainer * getTrainingLevelLimit();
    const userdata = await getUserData(username);
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);

    const baseCost = userdata[stat] * getTrainingBaseCost();
    const costToTrain =
        baseCost + baseCost * (getTrainingCostMultiplier() / 100);
    const totalCost = await calculateShopCost(costToTrain);

    // See if they even have enough money.
    if (characterCurrencyTotal < totalCost) {
        logger('debug', `${username} did not have enough money to train.`);
        sendChatMessage(
            `@${username}, ${characterName} needs ${totalCost} ${currencyName} to train a stat.`
        );
        return;
    }

    // Check to see if they're at max already.
    if (userdata[stat] >= statLimit) {
        logger('debug', `${username} hit the stat limit.`);
        sendChatMessage(
            `@${username}, ${characterName} has hit the stat limit. The trainer needs upgrades to increase this limit.`
        );
        return;
    }

    // Okay, lets apply the changes.
    await setUserStat(username, stat, 1);

    // Deduct currency from user.
    await adjustCurrencyForUser(-Math.abs(totalCost), username);
    sendChatMessage(
        `@${username}, ${characterName} increased their ${stat}. It cost ${totalCost} ${currencyName}.`
    );
}

/**
 * The enchanter allows the player to enchant their items.
 * @param userCommand
 */
export async function rpgTrainerCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const statToImprove = args[1] as string;
    const { upgrades } = await getWorldMeta();
    const { trainer } = upgrades;
    const characterName = await getUserName(username);

    if (trainer < 1) {
        sendChatMessage(
            `@${username}, ${characterName} approached the training field. There was a sign on the gate that said "Coming soon!".`
        );
        return;
    }

    // Okay, now lets try to enchant a slot.
    switch (statToImprove) {
        case 'str':
        case 'strength':
            await shopTrainStat(userCommand, 'str');
            break;
        case 'dex':
        case 'dexterity':
            await shopTrainStat(userCommand, 'dex');
            break;
        case 'int':
        case 'intelligence':
            await shopTrainStat(userCommand, 'int');
            break;
        case 'hp':
        case 'health':
            await shopTrainStat(userCommand, 'totalHP');
            break;
        default:
            sendChatMessage(
                `@${username}, specify a stat to train. Stats: str, dex, int, hp. Example: !rpg trainer str`
            );
    }
}
