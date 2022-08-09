import { getNumberOfOnlineUsers, getStreamOnlineStatus } from "../firebot/firebot";
import { worldCycle } from "./world/world-cycle";

const gameCycleInterval = 60;

/**
 * Tells us if the world cycle should run or not.
 * @returns 
 */
export async function shouldGameCycle(){
    const onlineUsers = await getNumberOfOnlineUsers();
    const streamOnline = await getStreamOnlineStatus();

    if(onlineUsers === 0 || !streamOnline){
        return false;
    }

    return true;
}

export function startGameCycle(){
    setInterval(() => {
        if(!shouldGameCycle()){
            return;
        }

        // Update our world first, as this could affect buffs from world stats.
        worldCycle();

    }, gameCycleInterval * 1000);
}