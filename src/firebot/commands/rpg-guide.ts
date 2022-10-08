import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { sendChatMessage } from '../firebot';

export function rpgGuideCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;

    const message = `@${username} You can view the in-depth player handbook here: https://github.com/Firebottle/firebot-rpg/wiki/Player-Handbook`;
    sendChatMessage(message);
}
