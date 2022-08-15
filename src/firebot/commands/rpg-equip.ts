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
    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    const characterName = await getCharacterName(username);

    logger('debug', `${username} is equipping a main hand item.`);

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
        setCharacterMeta(username, backpack, 'mainHand');
        setCharacterMeta(username, null, 'offHand');
        setCharacterMeta(username, null, 'backpack');
        sendChatMessage(
            `@${username}, ${characterName} equipped the ${backpackDetails.name} in their main hand. It was two handed and takes both the main and off hand slots.`
        );
        return;
    }

    // We have a regular one handed item, so equip it.
    setCharacterMeta(username, backpack, 'mainHand');
    setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} in their main hand.`
    );
}

async function equipOffHand(username: string) {
    const { backpack, mainHand } = await getCharacterData(username);
    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    const mainHandItemDetails = getItemByID(mainHand.id, mainHand.itemType);
    const characterName = await getCharacterName(username);

    logger('debug', `${username} is equipping an off hand item.`);

    if (
        backpack.itemType !== 'weapon' ||
        backpackDetails.properties.includes('two-handed') ||
        mainHandItemDetails.properties.includes('two-handed') ||
        mainHandItemDetails == null
    ) {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item in their off hand.`
        );
        return;
    }

    setCharacterMeta(username, backpack, 'offHand');
    setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} in their off hand.`
    );
}

async function equipArmor(username: string) {
    const { backpack } = await getCharacterData(username);
    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    const characterName = await getCharacterName(username);

    logger('debug', `${username} is equipping an armor item.`);

    if (backpackDetails.itemType !== 'armor') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item as armor.`
        );
        return;
    }

    setCharacterMeta(username, backpack, 'armor');
    setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} as their armor.`
    );
}

export async function rpgEquipCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    const backpackEmpty = await isBackpackEmpty(username);
    const characterName = await getCharacterName(username);

    logger('debug', `${username} is trying to equip an item.`);

    if (backpackEmpty) {
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
            equipMainHand(username);
            break;
        case 'off':
        case 'off-hand':
        case 'off_hand':
            equipOffHand(username);
            break;
        case 'armor':
            equipArmor(username);
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to equip the item to. Slots: main, off, armor`
            );
    }
}
