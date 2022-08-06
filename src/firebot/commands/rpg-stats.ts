import { UserCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { getCharacterData } from "../../systems/user";
import { getFirebot } from "../../systems/utils";

export async function rpgStatsCommand(userCommand : UserCommand){
    const firebot = getFirebot();
    const {twitchChat, logger} = firebot.modules;
    logger.debug('RPG: Sending world command.');

    const username = userCommand.commandSender;
    const character = await getCharacterData(username);

    const message = `${character.class.name} ${username} ${character.title.name} has: ${character.str} STR, ${character.dex} DEX, ${character.int} INT, and ${character.currentHP}/${character.totalHP} HP.`;
    twitchChat.sendChatMessage(message);
}