import {
    getNumberOfOnlineUsers,
    getStreamOnlineStatus,
    logger,
} from '../firebot/firebot';
import { getWorldCycleTime } from './settings';
import { worldCycle } from './world/world-cycle';

/**
 * Tells us if the world cycle should run or not.
 * @returns
 */
export async function shouldGameCycle() {
    const onlineUsers = await getNumberOfOnlineUsers();
    const streamOnline = await getStreamOnlineStatus();

    if (onlineUsers === 0 || !streamOnline) {
        return false;
    }

    return true;
}

export function startGameCycle() {
    logger('debug', `Starting game cycle.`);
    const gameCycle = getWorldCycleTime();
    setInterval(async () => {
        if (!shouldGameCycle()) {
            logger(
                'debug',
                `Game cycle paused as stream has zero online users or the stream is offline.`
            );
            return;
        }

        // Update our world first, as this could affect buffs from world stats.
        await worldCycle();
    }, gameCycle * 1000);
}
