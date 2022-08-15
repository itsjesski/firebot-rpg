import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getItemByID } from '../../systems/equipment/helpers';
import { getCharacterData } from '../../systems/user/user';
import { sendChatMessage, setCharacterMeta } from '../firebot';

async function isBackpackEmpty(username: string) {
    const { backpack } = await getCharacterData(username);
    if (backpack == null) {
        return false;
    }
    return true;
}

async function equipMainHand(username: string) {
    const { backpack } = await getCharacterData(username);
    const backpackItem = getItemByID(backpack.id, backpack.itemType);

    if (backpack.itemType !== 'weapon') {
        sendChatMessage(
            `@${username}, you can't equip that item in your main hand.`
        );
        return;
    }

    // Un-equip off hand item if main hand item is two handed.
    if (backpackItem.properties.includes('two-handed')) {
        setCharacterMeta(username, backpackItem, 'mainHand');
        setCharacterMeta(username, null, 'offHand');
        sendChatMessage(
            `@${username}, you equipped the ${backpackItem.name} in your main hand. It was two handed and takes both the main and off hand slots.`
        );
        return;
    }

    // We have a regular one handed item, so equip it.
    setCharacterMeta(username, backpackItem, 'mainHand');
    sendChatMessage(
        `@${username}, you equipped the ${backpackItem.name} in your main hand.`
    );
}

async function equipOffHand(username: string) {
    const { backpack, mainHand } = await getCharacterData(username);
    const backpackItem = getItemByID(backpack.id, backpack.itemType);
    const mainHandItem = getItemByID(mainHand.id, mainHand.itemType);

    if (
        backpack.itemType !== 'weapon' ||
        backpackItem.properties.includes('two-handed') ||
        mainHandItem.properties.includes('two-handed')
    ) {
        sendChatMessage(
            `@${username}, you can't equip that item in your off hand.`
        );
        return;
    }

    setCharacterMeta(username, backpackItem, 'offHand');
    sendChatMessage(
        `@${username}, you equipped the ${backpackItem.name} in your off hand.`
    );
}

async function equipArmor(username: string) {
    const { backpack } = await getCharacterData(username);
    const backpackItem = getItemByID(backpack.id, backpack.itemType);

    if (backpackItem.itemType !== 'armor') {
        sendChatMessage(
            `@${username}, you can't equip that item as your armor.`
        );
        return;
    }

    setCharacterMeta(username, backpackItem, 'armor');
    sendChatMessage(
        `@${username}, you equipped the ${backpackItem.name} as your armor.`
    );
}

export async function rpgEquipCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    const backpackEmpty = await isBackpackEmpty(username);

    if (backpackEmpty) {
        sendChatMessage(
            `@${username}, you have nothing in your backpack to equip!`
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
