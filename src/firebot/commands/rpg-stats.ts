import { UserCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { logger, sendChatMessage } from "../firebot";
import { getCharacterData } from "../../systems/user/user";

export async function rpgStatsCommand(userCommand : UserCommand){
    logger('debug', 'Sending world command.');

    const username = userCommand.commandSender;
    const character = await getCharacterData(username);

    const message = `${character.class.name} ${username} ${character.title.name} has: ${character.str} STR, ${character.dex} DEX, ${character.int} INT, and ${character.currentHP}/${character.totalHP} HP.`;
    sendChatMessage(message);
}