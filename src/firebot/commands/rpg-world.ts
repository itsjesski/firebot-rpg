import { getFirebot } from "../../systems/utils";
import { getWorldCitizens, getWorldName, getWorldStats, getWorldType } from "../../systems/world";

export async function worldCommand(){
    const firebot = getFirebot();
    const {twitchChat, logger} = firebot.modules;
    logger.debug('RPG: Sending world command.');

    const worldName = getWorldName();
    const worldType = getWorldType();
    const worldCitizens = getWorldCitizens();
    const worldStats = await getWorldStats();

    const message = `The ${worldType} of ${worldName} currently has ${worldStats.resources} resources, ${worldStats.research} research, and the ${worldCitizens.toLowerCase()} are ${worldStats.happiness}% happy.`;
    twitchChat.sendChatMessage(message);
}