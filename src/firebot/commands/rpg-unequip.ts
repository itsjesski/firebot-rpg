import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getUserName } from '../../systems/user/user';
import { EquippableSlots } from '../../types/user';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

async function unequipSlot(username: string, slot: EquippableSlots) {
    const characterName = await getUserName(username);

    switch (slot) {
        case 'mainHand':
            await setCharacterMeta(
                username,
                {
                    id: 1,
                    itemType: 'weapon',
                    nickname: null,
                    refinements: 0,
                    enchantments: {
                        earth: 0,
                        wind: 0,
                        fire: 0,
                        water: 0,
                        light: 0,
                        darkness: 0,
                    },
                },
                'mainHand'
            );

            sendChatMessage(
                `@${username}, ${characterName} unequipped their main hand item.`
            );
            break;
        case 'offHand':
            await setCharacterMeta(username, null, 'offHand');

            sendChatMessage(
                `@${username}, ${characterName} unequipped their off hand item.`
            );
            break;
        case 'armor':
            await setCharacterMeta(
                username,
                {
                    id: 1,
                    itemType: 'armor',
                    nickname: null,
                    refinements: 0,
                    enchantments: {
                        earth: 0,
                        wind: 0,
                        fire: 0,
                        water: 0,
                        light: 0,
                        darkness: 0,
                    },
                },
                'armor'
            );

            sendChatMessage(
                `@${username}, ${characterName} unequipped their armor.`
            );
            break;
        case 'title':
            await setCharacterMeta(username, null, 'title');

            sendChatMessage(
                `@${username}, ${characterName} discarded their title.`
            );
            break;
        case 'characterClass':
            await setCharacterMeta(username, null, 'characterClass');

            sendChatMessage(
                `@${username}, ${characterName} discarded their class.`
            );
            break;
        default:
    }
}

export async function rpgUnequipCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;

    logger('debug', `${username} is trying to unequip an item.`);

    switch (commandUsed) {
        case 'main':
        case 'main-hand':
        case 'main_hand':
        case 'mainhand':
            await unequipSlot(username, 'mainHand');
            break;
        case 'off':
        case 'off-hand':
        case 'off_hand':
        case 'offhand':
            await unequipSlot(username, 'offHand');
            break;
        case 'armor':
        case 'armour':
            await unequipSlot(username, 'armor');
            break;
        case 'title':
            await unequipSlot(username, 'title');
            break;
        case 'class':
            await unequipSlot(username, 'characterClass');
            break;
        default:
            sendChatMessage(
                `@${username}, specify a slot to unequip the item to. Slots: main, off, armor, title, or class.`
            );
    }
}
