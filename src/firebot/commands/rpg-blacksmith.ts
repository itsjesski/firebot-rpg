import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { increaseRefinementLevelOfUserItem } from '../../systems/equipment/refinements';
import {
    getRefinementBaseCost,
    getRefinementCostMultiplier,
    getRefinementLevelLimit,
} from '../../systems/settings';
import { calculateShopCost } from '../../systems/shops/shops';
import { getUserName, getUserData } from '../../systems/user/user';
import {
    StoredArmor,
    StoredShield,
    StoredSpell,
    StoredWeapon,
} from '../../types/equipment';
import { EquippableSlots } from '../../types/user';
import {
    getWorldMeta,
    getCurrencyName,
    getUserCurrencyTotal,
    sendChatMessage,
    adjustCurrencyForUser,
    logger,
} from '../firebot';

async function shopReinforceItem(
    userCommand: UserCommand,
    itemSlot: EquippableSlots
) {
    const username = userCommand.commandSender;
    const { upgrades } = await getWorldMeta();
    const characterName = await getUserName(username);
    const { blacksmith } = upgrades;
    const statLimit = blacksmith * getRefinementLevelLimit();
    const userdata = await getUserData(username);
    const item = userdata[itemSlot] as
        | StoredWeapon
        | StoredArmor
        | StoredShield
        | StoredSpell;
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);
    let currentRefinements = 1;

    // Check to see if this item exists.
    if (item == null) {
        sendChatMessage(
            `@${username}, ${characterName} doesn't have an item to refine!`
        );
        return;
    }

    // This is for calculating base costs.
    if (item.refinements !== 0) {
        currentRefinements = item.refinements + 1;
    }

    const baseCost = getRefinementBaseCost();
    const percentage =
        currentRefinements * (getRefinementCostMultiplier() / 100);
    const costToReinforce = baseCost + baseCost * percentage;

    const totalCost = await calculateShopCost(costToReinforce);

    // See if they even have enough money.
    if (characterCurrencyTotal < totalCost) {
        logger(
            'debug',
            `${username} did not have enough money to refine an item.`
        );
        sendChatMessage(
            `@${username}, ${characterName} needs ${totalCost} ${currencyName} to refine an item.`
        );
        return;
    }

    // Check to see if they're at max already.
    if (item.refinements >= statLimit) {
        logger('debug', `${username} hit the refinement limit for an item.`);
        sendChatMessage(
            `@${username}, ${characterName} has hit the refinement limit for that item. The blacksmith needs upgrades to increase this limit.`
        );
        return;
    }

    // Okay, lets apply the changes..
    await increaseRefinementLevelOfUserItem(username, itemSlot);

    // Deduct currency from user.
    await adjustCurrencyForUser(-Math.abs(totalCost), username);

    if (item.itemType === 'spell') {
        sendChatMessage(
            `@${username}, The runesmith improved ${characterName}'s spell. It cost ${totalCost} ${currencyName}.`
        );
    } else {
        sendChatMessage(
            `@${username}, The blacksmith improved ${characterName}'s item. It cost ${totalCost} ${currencyName}.`
        );
    }
}

/**
 * The blacksmith allows users to upgrade an item.
 * @param userCommand
 */
export async function rpgBlacksmithCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const slotToImprove = args[1] as string;
    const { upgrades } = await getWorldMeta();
    const { blacksmith } = upgrades;
    const characterName = await getUserName(username);

    if (blacksmith < 1) {
        sendChatMessage(
            `@${username}, ${characterName} approached the blacksmith shop. There was a sign on the door that said "Coming soon!".`
        );
        return;
    }

    // Okay, now lets try to enchant a slot.
    switch (slotToImprove) {
        case 'armor':
            await shopReinforceItem(userCommand, 'armor');
            break;
        case 'mainHand':
        case 'main':
            await shopReinforceItem(userCommand, 'mainHand');
            break;
        case 'offHand':
        case 'off':
            await shopReinforceItem(userCommand, 'offHand');
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to enchant. Slots: main, off, armor. Example: !rpg blacksmith armor`
            );
    }
}
