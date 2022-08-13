import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getFullItemTextWithStats } from '../../systems/equipment/helpers';

import { getCharacterData } from '../../systems/user/user';
import { EquippableSlots } from '../../types/user';
import { logger, sendChatMessage } from '../firebot';

export async function rpgStatsCommand(userCommand: UserCommand) {
    logger('debug', 'Sending world command.');

    const username = userCommand.commandSender;
    const character = await getCharacterData(username);
    const { args } = userCommand;
    const commandUsed = args[1] as EquippableSlots | null;
    let message = null;
    let item;
    const { backpack } = await getCharacterData(username);

    switch (commandUsed) {
        case 'backpack':
            item = getFullItemTextWithStats(backpack);
            message = `@${username} Your backpack contains: ${item}`;
            break;
        default:
            message = `@${username} ${character.title.name} ${character.name} the ${character.class.name} has: ${character.str} STR, ${character.dex} DEX, ${character.int} INT, and ${character.currentHP}/${character.totalHP} HP.`;
    }

    if (message != null) {
        sendChatMessage(message);
    }
}
