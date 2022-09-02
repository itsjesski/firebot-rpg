import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { increaseEnchantmentOfUserItem } from '../../systems/equipment/enchantments';
import {
    getEnchantmentBaseCost,
    getEnchantmentCostMultiplier,
    getEnchantmentLevelLimit,
} from '../../systems/settings';
import { calculateShopCost } from '../../systems/shops/shops';
import { getUserName, getUserData } from '../../systems/user/user';
import { capitalize } from '../../systems/utils';
import { EnchantmentTypes } from '../../types/equipment';
import { EnchantableSlots } from '../../types/user';
import {
    getWorldMeta,
    getCurrencyName,
    getUserCurrencyTotal,
    sendChatMessage,
    adjustCurrencyForUser,
    logger,
} from '../firebot';

async function shopEnchantItem(
    userCommand: UserCommand,
    itemSlot: EnchantableSlots
) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const { upgrades } = await getWorldMeta();
    const characterName = await getUserName(username);
    const { enchanter } = upgrades;
    const statLimit = enchanter * getEnchantmentLevelLimit();
    const userdata = await getUserData(username);
    const elementTypeToEnchant = args[2] as EnchantmentTypes;
    const item = userdata[itemSlot];
    const currencyName = getCurrencyName();
    const characterCurrencyTotal = await getUserCurrencyTotal(username);
    let currentEnchantments = 1;

    // Check to see if this item exists.
    if (item == null) {
        sendChatMessage(
            `@${username}, ${characterName} doesn't have an item to enchant!`
        );
        return;
    }

    if (item.enchantments[elementTypeToEnchant] !== 0) {
        currentEnchantments = item.enchantments[elementTypeToEnchant] + 1;
    }

    const baseCost = getEnchantmentBaseCost();
    const percentage =
        currentEnchantments * (getEnchantmentCostMultiplier() / 100);
    const costToEnchant = baseCost + baseCost * percentage;

    const totalCost = await calculateShopCost(costToEnchant);

    // See if they even have enough money.
    if (characterCurrencyTotal < totalCost) {
        logger('debug', `${username} didn't have enough money to enchant.`);
        sendChatMessage(
            `@${username}, ${characterName} needs ${totalCost} ${currencyName} to enchant an item.`
        );
        return;
    }

    // Check to see if they're at max already.
    if (item.enchantments[elementTypeToEnchant] >= statLimit) {
        logger('debug', `${username} hit the enchantment limit for an item.`);
        sendChatMessage(
            `@${username}, ${characterName} has hit the enchantment limit for that item. The enchanter needs upgrades to increase this limit.`
        );
        return;
    }

    // Okay, lets enchant.
    await increaseEnchantmentOfUserItem(
        username,
        itemSlot,
        elementTypeToEnchant
    );

    // Deduct currency from user.
    await adjustCurrencyForUser(-Math.abs(totalCost), username);
    sendChatMessage(
        `@${username}, ${characterName} increased their ${capitalize(
            elementTypeToEnchant
        )} enchantment by one. It cost ${totalCost} ${currencyName}.`
    );
}

/**
 * The enchanter allows the player to enchant their items.
 * @param userCommand
 */
export async function rpgEnchanterCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const itemSlotToEnchant = args[1] as string;
    const elementTypeToEnchant = args[2] as EnchantmentTypes;
    const { upgrades } = await getWorldMeta();
    const { enchanter } = upgrades;
    const characterName = await getUserName(username);

    if (enchanter < 1) {
        sendChatMessage(
            `@${username}, ${characterName} approached the enchanter tower. There was a sign on the door that said "Coming soon!".`
        );
        return;
    }

    // Verify our enchantment type.
    const validElements = [
        'darkness',
        'earth',
        'fire',
        'light',
        'water',
        'wind',
    ] as EnchantmentTypes[];

    if (
        elementTypeToEnchant == null ||
        !validElements.includes(elementTypeToEnchant)
    ) {
        sendChatMessage(
            `@${username}, specify an element to enchant. Elements: ${validElements.join(
                ', '
            )}. Example: !rpg enchanter armor fire.`
        );
        return;
    }

    // Okay, now lets try to enchant a slot.
    switch (itemSlotToEnchant) {
        case 'armor':
            await shopEnchantItem(userCommand, 'armor');
            break;
        case 'mainHand':
        case 'main':
            await shopEnchantItem(userCommand, 'mainHand');
            break;
        case 'offHand':
        case 'off':
            await shopEnchantItem(userCommand, 'offHand');
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to enchant. Slots: main, off, armor. Example: !rpg enchanter armor fire`
            );
    }
}
