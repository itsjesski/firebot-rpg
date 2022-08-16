import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getItemByID } from '../../systems/equipment/helpers';
import { getCharacterData, getCharacterName } from '../../systems/user/user';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

async function isBackpackEmpty(username: string) {
    const { backpack } = await getCharacterData(username);
    if (backpack == null) {
        return true;
    }
    return false;
}

async function equipMainHand(username: string) {
    const { backpack } = await getCharacterData(username);
    const characterName = await getCharacterName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    // Check if backpack is empty first.
    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    // Get details of the item in the backpack.
    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    logger('debug', `${username} is equipping a main hand item.`);

    // If it's not a weapon, throw an error.
    if (backpack.itemType !== 'weapon') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item in their main hand.`
        );
        return;
    }

    // Un-equip off hand item if main hand item is two handed.
    if (backpackDetails.properties.includes('two-handed')) {
        logger(
            'debug',
            `${username} is equipping a two handed item, so we are un-equipping the off hand.`
        );
        await setCharacterMeta(username, backpack, 'mainHand');
        await setCharacterMeta(username, null, 'offHand');
        await setCharacterMeta(username, null, 'backpack');
        sendChatMessage(
            `@${username}, ${characterName} equipped the ${backpackDetails.name} in their main hand. It was two handed and takes both the main and off hand slots.`
        );
        return;
    }

    // We have a regular one handed item, so equip it.
    await setCharacterMeta(username, backpack, 'mainHand');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} in their main hand.`
    );
}

async function equipOffHand(username: string) {
    const { backpack, mainHand } = await getCharacterData(username);
    const characterName = await getCharacterName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    // Check if backpack is empty.
    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }
    const backpackDetails = getItemByID(backpack.id, backpack.itemType);

    // Check if main hand is empty.
    let mainHandItemDetails = null;
    if (mainHand !== null) {
        mainHandItemDetails = getItemByID(mainHand.id, mainHand.itemType);
    } else {
        sendChatMessage(
            `@${username}, ${characterName} doesn't have anything in their main hand yet! Try using !rpg equip main.`
        );
        return;
    }

    logger('debug', `${username} is trying to equip an off hand item.`);

    // Don't let them equip in offhand if it's not a weapon or if there is a two handed item in the main hand.
    if (
        backpack.itemType !== 'weapon' ||
        backpackDetails.properties.includes('two-handed') ||
        mainHandItemDetails.properties.includes('two-handed')
    ) {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item in their off hand.`
        );
        return;
    }

    // Equip to off hand.
    await setCharacterMeta(username, backpack, 'offHand');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} in their off hand.`
    );
}

async function equipArmor(username: string) {
    const { backpack } = await getCharacterData(username);
    const characterName = await getCharacterName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    logger('debug', `${username} is equipping an armor item.`);

    if (backpackDetails.itemType !== 'armor') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item as armor.`
        );
        return;
    }

    await setCharacterMeta(username, backpack, 'armor');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} as their armor.`
    );
}

export async function rpgEquipCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    const backpackIsEmpty = await isBackpackEmpty(username);
    const characterName = await getCharacterName(username);

    logger('debug', `${username} is trying to equip an item.`);

    if (backpackIsEmpty) {
        logger(
            'debug',
            `${username}'s backpack was empty. Could not equip an item.`
        );
        sendChatMessage(
            `@${username}, ${characterName} has nothing in their backpack to equip!`
        );
        return;
    }

    switch (commandUsed) {
        case 'main':
        case 'main-hand':
        case 'main_hand':
        case 'mainhand':
            await equipMainHand(username);
            break;
        case 'off':
        case 'off-hand':
        case 'off_hand':
        case 'offhand':
            await equipOffHand(username);
            break;
        case 'armor':
            await equipArmor(username);
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to equip the item to. Slots: main, off, armor`
            );
    }
}
