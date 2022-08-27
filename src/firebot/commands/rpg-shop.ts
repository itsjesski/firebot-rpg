import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { sendChatMessage } from '../firebot';

export async function rpgShopCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;

    switch (commandUsed) {
        default:
            sendChatMessage(
                `@${username}, a sign in front of the shop reads coming soon!`
            );
    }
}
