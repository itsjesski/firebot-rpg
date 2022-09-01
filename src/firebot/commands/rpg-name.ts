import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getUserName } from '../../systems/user/user';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

export async function rpgNameCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const originalName = await getUserName(username);
    const newName = args.splice(1, 5).join(' ');

    if (newName.length > 30 || newName.length === 0) {
        sendChatMessage(
            `@${username} That name is either too short or too long. It must be between 1 and 30 characters.`
        );
        return;
    }

    logger('debug', `${username} changed their character name to ${newName}.`);

    setCharacterMeta(username, newName, 'name');

    sendChatMessage(`@${username} ${originalName} is now known as ${newName}.`);
}
