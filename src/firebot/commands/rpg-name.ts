import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { getCharacterData, getCharacterName } from '../../systems/user/user';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

export async function rpgNameCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const character = await getCharacterData(username);
    const originalName = await getCharacterName(username);
    const newName = args.splice(1, 5).join(' ');

    if (newName.length > 30) {
        sendChatMessage(
            `@${username} That name is too long. There is a character limit of 30 characters.`
        );
        return;
    }

    logger('debug', `${username} changed their character name to ${newName}.`);

    setCharacterMeta(username, newName, 'name');

    sendChatMessage(
        `@${username} ${character.title.name} ${originalName} the ${character.class.name} is now known as ${newName}.`
    );
}
