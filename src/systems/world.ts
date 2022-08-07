import { getFirebot, getStreamerUsername } from "./utils";

export const worldKey = 'fbrpg-world';

export type WorldStats = {
    "happiness": number,
    "resources": number,
    "research": number,
}

/**
 * Gets our world data from the streamer account meta.
 * @param firebot 
 * @returns 
 */
export async function getWorldStats() : Promise<WorldStats>{
    const firebot = getFirebot();
    const {userDb} = firebot.modules;
    const streamerName = getStreamerUsername();
    const worldStats : WorldStats = await userDb.getUserMetadata(streamerName, worldKey);

    return worldStats;
}

/**
 * Generic function for updating any world property.
 * @param firebot 
 * @param property 
 * @param value 
 */
async function updateWorldProperty(property : string, value : any){
    const firebot = getFirebot();
    const {logger, userDb} = firebot.modules;
    const streamerName = getStreamerUsername();
    const rpgMeta = getWorldStats();

    // World doesn't exist.
    if(rpgMeta == null){
        logger.error(`RPG: Couldn't update world property as world stats could not be found.`);
        return;
    }

    logger.debug(`RPG: Setting world ${property} to ${value}.`);
    await userDb.updateUserMetadata(streamerName, worldKey, value, property);
}

/**
 * Sets one of the world stats to a specific thing, making sure to cap min and maximum values.
 * @param firebot 
 */
export async function setWorldStat(stat:string, value : string){
    const firebot = getFirebot();
    const {logger} = firebot.modules;
    logger.debug(`RPG: Trying to update world ${stat}...`);

    const worldStats = await getWorldStats();
    const firstChar = value.charAt(0);
    const newValue = parseInt(value);
    let worldValue = 0;

    if(worldStats != null){
        // @ts-ignore
        worldValue = worldStats[stat];
    }

    if(worldValue == null || newValue == null || worldStats == null){
        logger.error(`RPG: Trying to set ${stat} to invalid value.`);
        return;
    }

    // Here we determine if we're setting an exact value, adding, or subtracting.
    switch (firstChar){
        case "+":
        case "-":
            worldValue = worldValue + newValue;
        break;
        default:
            worldValue = newValue;
    }

    // Don't allow values below zero.
    if(worldValue < 0) {
        worldValue === 0;
    }

    // Don't allow happiness over 100.
    if(worldValue > 100){
        worldValue === 100;
    }

    await updateWorldProperty(stat, worldValue);
}

/**
 * Verifies the world is properly built. If it's not, then it sets missing settings to default.
 * Also serves to build the initial world.
 * @param firebot
 */
export async function verifyWorld(){
    const firebot = getFirebot();
    const streamerName = getStreamerUsername();
    const {logger, userDb} = firebot.modules;
    logger.debug(`RPG: Verifying the world state...`);

    const worldStats = await getWorldStats();

    if(worldStats == null){
        logger.debug(`RPG: World doesn't exist yet! Creating a new one.`);
        const newWorld : WorldStats = {
            "happiness": 50,
            "resources": 50,
            "research": 0
        };
        await userDb.updateUserMetadata(streamerName, worldKey, newWorld);
    }
}

export async function worldCycle(){

}