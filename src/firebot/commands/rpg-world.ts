import {
    getWorldCitizens,
    getWorldName,
    getWorldType,
} from '../../systems/settings';
import { logger, sendChatMessage, getWorldMeta } from '../firebot';

export async function worldCommand() {
    logger('debug', 'Sending world command.');

    const worldName = getWorldName();
    const worldType = getWorldType();
    const worldCitizens = getWorldCitizens();
    const worldStats = await getWorldMeta();

    const message = `The ${worldType} of ${worldName} currently has ${
        worldStats.resources
    } resources, ${
        worldStats.research
    } research, and the ${worldCitizens.toLowerCase()} are ${
        worldStats.happiness
    }% happy.`;
    sendChatMessage(message);
}
