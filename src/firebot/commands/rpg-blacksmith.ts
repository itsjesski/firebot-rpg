import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { increaseRefinementLevelOfUserItem } from '../../systems/equipment/refinements';
import {
    getRefinementBaseCost,
    getRefinementCostMultiplier,
    getRefinementLevelLimit,
} from '../../systems/settings';
import { getUserName, getUserData } from '../../systems/user/user';
import { EnchantmentTypes } from '../../types/equipment';
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
    const { args } = userCommand;
    const { upgrades } = await getWorldMeta();
    const characterName = await getUserName(username);
    const { blacksmith } = upgrades;
    const statLimit = blacksmith * getRefinementLevelLimit();
    const userdata = await getUserData(username);
    const elementTypeToEnchant = args[2] as EnchantmentTypes;
    const item = userdata[itemSlot];
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);

    // Check to see if this item exists.
    if (item == null) {
        sendChatMessage(
            `@${username}, ${characterName} doesn't have an item to enchant!`
        );
        return;
    }

    const baseCost =
        item.enchantments[elementTypeToEnchant] * getRefinementBaseCost();
    const costToReinforce =
        baseCost + baseCost * (getRefinementCostMultiplier() / 100);

    // See if they even have enough money.
    if (characterCurrencyTotal < costToReinforce) {
        logger(
            'debug',
            `${username} did not have enough money to refine an item.`
        );
        sendChatMessage(
            `@${username}, ${characterName} needs ${costToReinforce} ${currencyName} to refine an item.`
        );
        return;
    }

    // Check to see if they're at max already.
    if (
        item.enchantments[elementTypeToEnchant as EnchantmentTypes] >= statLimit
    ) {
        logger('debug', `${username} hit the refinement limit for an item.`);
        sendChatMessage(
            `@${username}, ${characterName} has hit the refinement limit for that item. The blacksmith needs upgrades to increase this limit.`
        );
        return;
    }

    // Okay, lets enchant.
    await increaseRefinementLevelOfUserItem(username, itemSlot);

    // Deduct currency from user.
    await adjustCurrencyForUser(-Math.abs(costToReinforce), username);
    sendChatMessage(`@${username}, ${characterName} refined their item.`);
}

/**
 * The enchanter allows the player to enchant their items.
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
            `@${username}, ${characterName} approached the blacksmith shop. There was a sign on the door said "Coming soon!".`
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
                `@${username}, specify a slot to enchant. Slots: main, off, armor. Example: !rpg shop enchanter armor fire`
            );
    }
}
