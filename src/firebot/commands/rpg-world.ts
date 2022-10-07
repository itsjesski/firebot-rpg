import {
    getWorldCitizens,
    getWorldName,
    getWorldType,
} from '../../systems/settings';
import {
    getWorldBuildings,
    verifyWorld,
} from '../../systems/world/world-stats';
import { logger, sendChatMessage, getWorldMeta } from '../firebot';

export async function worldCommand() {
    logger('debug', 'Sending world command.');

    await verifyWorld();

    const worldName = getWorldName();
    const worldType = getWorldType();
    const worldCitizens = getWorldCitizens();
    const worldStats = await getWorldMeta();

    const buildings = await getWorldBuildings();

    const message = `The ${worldType} of ${worldName} currently has ${
        worldStats.resources
    } resources, ${
        worldStats.research
    } research, and the ${worldCitizens.toLowerCase()} are ${
        worldStats.happiness
    }% happy. | Tavern: ${buildings.tavern} | Blacksmith: ${
        buildings.blacksmith
    } | Enchanter: ${buildings.enchanter} | Shipyard: ${
        buildings.shipyard
    } | Guild: ${buildings.guild} | Trainer: ${buildings.trainer}`;

    sendChatMessage(message);
}
