import { getNumberOfOnlineUsers, logger } from '../../firebot/firebot';
import { getPercentage } from '../utils';
import { setWorldStat } from './world-stats';
import {
    clearWorldTendency,
    WorldTendency,
    worldTendencyPools,
} from './world-tendency';

/**
 * Updates our world stats based on our world tendency pools for this cycle.
 */
async function worldCycleUpdateStats() {
    logger('debug', `Updating world stats for this cycle.`);

    const promises = [];
    const numOnlineUsers = await getNumberOfOnlineUsers();

    for (const stat in worldTendencyPools) {
        if (Object.prototype.hasOwnProperty.call(worldTendencyPools, stat)) {
            // Compare our stat pools to the number of active users.

            const positivePercentage = getPercentage(
                worldTendencyPools[stat as keyof WorldTendency].positive,
                numOnlineUsers
            );

            const negativePercentage = getPercentage(
                worldTendencyPools[stat as keyof WorldTendency].negative,
                numOnlineUsers
            );

            // Compare our percentages to each other.
            const netTendency = positivePercentage - negativePercentage;
            const isPositive = netTendency > 0;

            // Changes are needed, lets shrink our number and clamp it between 1 and 2.
            // Adjust this value to have more wild fluctuations between cycles.
            let adjustedValue = Math.round(Math.abs(netTendency) / 10);
            adjustedValue = Math.min(Math.max(adjustedValue, 1), 2);

            // If value change will be negative, make our adjusted value negative.
            if (!isPositive) {
                adjustedValue = -Math.abs(adjustedValue);
            }

            // Now, update our stat.
            promises.push(setWorldStat(stat, adjustedValue));
        }
    }

    return Promise.all(promises);
}

/**
 * This function is run each game cycle and updates world settings.
 */
export async function worldCycle() {
    await worldCycleUpdateStats();
    clearWorldTendency();
}
