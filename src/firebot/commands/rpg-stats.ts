import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getFullItemTextWithStats } from '../../systems/equipment/helpers';

import { getCharacterData } from '../../systems/user/user';
import { logger, sendChatMessage } from '../firebot';

export async function rpgStatsCommand(userCommand: UserCommand) {
    logger('debug', 'Sending world command.');

    const username = userCommand.commandSender;
    const character = await getCharacterData(username);
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    let message = null;
    let item;
    const { backpack, mainHand, offHand } = await getCharacterData(username);

    switch (commandUsed) {
        case 'backpack':
            item = getFullItemTextWithStats(backpack);
            message = `@${username} Your backpack contains: ${item}`;
            break;
        case 'main':
        case 'main-hand':
        case 'main_hand':
            item = getFullItemTextWithStats(mainHand);
            message = `@${username} Your main hand holds: ${item}`;
            break;
        case 'off':
        case 'off-hand':
        case 'off_hand':
            item = getFullItemTextWithStats(offHand);
            message = `@${username} Your off hand holds: ${item}`;
            break;
        default:
            message = `@${username} ${character.title.name} ${character.name} the ${character.class.name} has: ${character.str} STR, ${character.dex} DEX, ${character.int} INT, and ${character.currentHP}/${character.totalHP} HP.`;
    }

    if (message != null) {
        sendChatMessage(message);
    }
}
