import { clearWorldTendency, worldTendencyPools } from "./world-tendency";
import { setWorldStat } from "./world-stats";
import { getPercentage } from "../utils";
import { logger } from "../../firebot/firebot";

/**
 * Updates our world stats based on our world tendency pools for this cycle.
 */
async function worldCycleUpdateStats(){
    logger('debug', `Updating world stats for this cycle.`);

    for (let stat in worldTendencyPools) {
        if (worldTendencyPools.hasOwnProperty(stat)) {
            // Compare our stat pools to the number of active users.
            // @ts-ignore
            const positivePercentage = getPercentage(worldTendencyPools[stat]['positive'], numOnlineUsers);
            // @ts-ignore
            const negativePercentage = getPercentage(worldTendencyPools[stat]['negative'], numOnlineUsers);

            // Compare our percentages to each other.
            const netTendency = positivePercentage - negativePercentage;
            const isPositive = netTendency > 0; 

            // No changes needed.
            if(netTendency === 0){
                continue;
            }

            // Changes are needed, lets shrink our number and clamp it between 1 and 5.
            let adjustedValue = Math.round((Math.abs(netTendency) / 10));
            adjustedValue = Math.min(Math.max(adjustedValue, 1), 5);

            // If value change will be negative, make our adjusted value negative.
            if(!isPositive){
                adjustedValue = -Math.abs(adjustedValue);
            }

            // Now, update our stat.
            await setWorldStat(stat, adjustedValue);
        }
    }
}

/**
 * This function is run each game cycle and updates world settings.
 */
export async function worldCycle(){
    await worldCycleUpdateStats();
    clearWorldTendency();
}