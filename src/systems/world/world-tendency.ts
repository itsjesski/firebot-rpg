import { getFirebot } from "../utils";

export type WorldTendency = {
    "happiness": {
        "positive": number;
        "negative": number;
    },
    "resources": {
        "positive": number;
        "negative": number;
    },
    "research": {
        "positive": number;
        "negative": number;
    }  
}

export let worldTendencyPools : WorldTendency = {
    "happiness": {
        "positive": 0,
        "negative": 0
    },
    "resources": {
        "positive": 0,
        "negative": 0
    },
    "research": {
        "positive": 0,
        "negative": 0
    }
}

/**
 * Updates one of the stats in our world stat pool.
 * You give this a postive or negative number and it'll add or subtract from current values.
 * @param stat 
 * @param value 
 * @returns 
 */
export function updateWorldTendency(stat: string, value: number){
    const firebot = getFirebot();
    const {logger} = firebot.modules;

    // @ts-ignore
    let currentAmount = worldTendencyPools[stat];

    if(currentAmount == null){
        logger.error(`RPG: Couldn't find stat ${stat} in world stat pool.`);
        return;
    }

    // @ts-ignore
    worldTendencyPools[stat] = currentAmount + value;
}

/**
 * This clears the world stat pool at the end of a cycle.
 */
export function clearWorldTendency(){
    const firebot = getFirebot();
    const {logger} = firebot.modules;

    logger.debug("RPG: Clearing this cycle's world stat pool.");

    for (let stat in worldTendencyPools) {
        // @ts-ignore
        worldTendencyPools[stat].positive = 0;
        // @ts-ignore
        worldTendencyPools[stat].negative = 0;
    }
}