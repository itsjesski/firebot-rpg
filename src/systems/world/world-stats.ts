import { getFirebot, getNumberOfOnlineUsers, getPercentage, getStreamerUsername, getStreamOnlineStatus } from "../utils";

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
export async function setWorldStat(stat: string, value: number, setExactly?: boolean){
    const firebot = getFirebot();
    const {logger} = firebot.modules;
    logger.debug(`RPG: Trying to update world ${stat}...`);

    const worldStats = await getWorldStats();
    let worldValue = 0;

    if( value == null || worldStats == null){
        logger.error(`RPG: Trying to set ${stat} to invalid value.`);
        return;
    }


    // This allows us to set a world stat to a specific number.
    if(setExactly){
        worldValue = worldValue = Math.min(Math.max(value, 0), 100);
        await updateWorldProperty(stat, value);
        return;
    }

    // The rest of this lets us add or remove from the current value.
    if(worldStats != null){
        // @ts-ignore
        worldValue = worldStats[stat];
    }

    // Clamp our world stats to 0 and 100.
    worldValue = Math.min(Math.max(worldValue + value, 0), 100);

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

