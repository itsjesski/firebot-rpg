import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';

import { getCharacterData } from '../../systems/user/user';
import { logger, sendChatMessage } from '../firebot';

export async function rpgStatsCommand(userCommand: UserCommand) {
    logger('debug', 'Sending world command.');

    const username = userCommand.commandSender;
    const character = await getCharacterData(username);

    const message = `${character.title.name} ${character.name} the ${character.class.name} has: ${character.str} STR, ${character.dex} DEX, ${character.int} INT, and ${character.currentHP}/${character.totalHP} HP.`;
    sendChatMessage(message);
}
