import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getItemByID } from '../../systems/equipment/helpers';
import { getUserData, getUserName } from '../../systems/user/user';
import { Shield, Weapon } from '../../types/equipment';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

async function isBackpackEmpty(username: string) {
    const { backpack } = await getUserData(username);
    if (backpack == null) {
        return true;
    }
    return false;
}

async function equipMainHand(username: string) {
    const { backpack } = await getUserData(username);
    const characterName = await getUserName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    // Check if backpack is empty first.
    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    logger('debug', `${username} is equipping a main hand item.`);

    // If it's not a weapon, throw an error.
    if (backpack.itemType !== 'weapon') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item in their main hand.`
        );
        return;
    }

    // Get details of the item in the backpack, we confirmed above that it should be a weapon.
    const backpackDetails = getItemByID(
        backpack.id,
        backpack.itemType
    ) as Weapon;

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
    const { backpack, mainHand } = await getUserData(username);
    const characterName = await getUserName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    // Check if backpack is empty.
    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    // Can we even equip the item in the backpack in the off hand?
    if (backpack.itemType !== 'weapon' && backpack.itemType !== 'shield') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item in their off hand.`
        );
        return;
    }

    // Check if main hand is empty. If it is empty, for some reason, we want them to equip weapons there first.
    let mainHandItemDetails = null;
    if (mainHand !== null) {
        mainHandItemDetails = getItemByID(
            mainHand.id,
            mainHand.itemType
        ) as Weapon;
    } else {
        sendChatMessage(
            `@${username}, ${characterName} doesn't have anything in their main hand yet! Try using !rpg equip main.`
        );
        return;
    }

    // Okay, now we're going to get details for the item in the backpack and try to equip it.
    const backpackDetails = getItemByID(backpack.id, backpack.itemType) as
        | Weapon
        | Shield;
    logger('debug', `${username} is trying to equip an off hand item.`);

    // Don't let them equip in offhand if it's not a weapon or if there is a two handed item in the main hand.
    if (backpackDetails.itemType === 'weapon') {
        if (
            backpackDetails.properties.includes('two-handed') ||
            mainHandItemDetails.properties.includes('two-handed')
        ) {
            sendChatMessage(
                `@${username}, ${characterName} can't equip that item because they are using a two handed weapon.`
            );
            return;
        }
    }

    // Equip to off hand.
    await setCharacterMeta(username, backpack, 'offHand');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} equipped the ${backpackDetails.name} in their off hand.`
    );
}

async function equipArmor(username: string) {
    const { backpack } = await getUserData(username);
    const characterName = await getUserName(username);
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

async function equipTitle(username: string) {
    const { backpack } = await getUserData(username);
    const characterName = await getUserName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    logger('debug', `${username} is equipping an title item.`);

    if (backpackDetails.itemType !== 'title') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item as a title.`
        );
        return;
    }

    await setCharacterMeta(username, backpack, 'title');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} has claimed the title of ${backpackDetails.name}.`
    );
}

async function equipClass(username: string) {
    const { backpack } = await getUserData(username);
    const characterName = await getUserName(username);
    const backpackIsEmpty = await isBackpackEmpty(username);

    if (backpackIsEmpty) {
        sendChatMessage(
            `@${username},  doesn't have anything in their backpack to equip.`
        );
        return;
    }

    const backpackDetails = getItemByID(backpack.id, backpack.itemType);
    logger('debug', `${username} is equipping an class item.`);

    if (backpackDetails.itemType !== 'characterClass') {
        sendChatMessage(
            `@${username}, ${characterName} can't equip that item as a class.`
        );
        return;
    }

    await setCharacterMeta(username, backpack, 'characterClass');
    await setCharacterMeta(username, null, 'backpack');
    sendChatMessage(
        `@${username}, ${characterName} has changed their class to ${backpackDetails.name}.`
    );
}

export async function rpgEquipCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    const backpackIsEmpty = await isBackpackEmpty(username);
    const characterName = await getUserName(username);

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
        case 'armour':
            await equipArmor(username);
            break;
        case 'title':
            await equipTitle(username);
            break;
        case 'class':
            await equipClass(username);
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to equip the item to. Slots: main, off, armor`
            );
    }
}
