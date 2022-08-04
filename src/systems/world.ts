import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { getAllGameSettings, getStreamerUsername } from "./utils";

export type WorldStats = {
    "happiness": number,
    "resources": number,
    "research": number,
}

/**
 * Gets our world data from the streamer account meta.
 * @param firebotRequest 
 * @returns 
 */
export async function getWorldStats(firebotRequest : RunRequest<any>) : Promise<WorldStats>{
    const streamerName = getStreamerUsername(firebotRequest);
    const worldStats : WorldStats = await firebotRequest.modules.userDb.getUserMetadata(streamerName, 'fbrpg-world');

    return worldStats;
}

/**
 * Returns the settings for our world.
 * @param firebotRequest 
 * @returns 
 */
export function getWorldSettings(firebotRequest : RunRequest<any>){
    const settings = getAllGameSettings(firebotRequest);
    return settings.worldSettings;
}

/**
 * Generic function for updating any world property.
 * @param firebotRequest 
 * @param property 
 * @param value 
 */
async function updateWorldProperty(firebotRequest : RunRequest<any>, property : string, value : any){
    const {logger} = firebotRequest.modules;
    const streamerName = getStreamerUsername(firebotRequest);
    const rpgMeta = getWorldStats(firebotRequest);

    // World doesn't exist.
    if(rpgMeta == null){
        logger.error(`RPG: Couldn't update world property as world stats could not be found.`);
        return;
    }

    logger.debug(`RPG: Setting world ${property} to ${value}.`);
    await firebotRequest.modules.userDb.updateUserMetadata(streamerName, 'fbrpg-world', value, property);
}

/**
 * Sets one of the world stats to a specific thing, making sure to cap min and maximum values.
 * @param firebotRequest 
 */
export async function setWorldStat(firebotRequest : RunRequest<any>, stat:string, value : string){
    const {logger} = firebotRequest.modules;
    logger.debug(`RPG: Trying to update world ${stat}...`);

    const streamerName = getStreamerUsername(firebotRequest);
    const worldStats = await getWorldStats(firebotRequest);
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

    await updateWorldProperty(firebotRequest, stat, worldValue);
}

/**
 * Verifies the world is properly built. If it's not, then it sets missing settings to default.
 * Also serves to build the initial world.
 * @param firebotRequest
 */
export async function verifyWorld(firebotRequest : RunRequest<any>){
    const streamerName = getStreamerUsername(firebotRequest);
    const {logger} = firebotRequest.modules;
    logger.debug(`RPG: Verifying the world state...`);

    const worldStats = await getWorldStats(firebotRequest);

    if(worldStats == null){
        logger.debug(`RPG: World doesn't exist yet! Creating a new one.`);
        const newWorld : WorldStats = {
            "happiness": 100,
            "resources": 0,
            "research": 0
        };
        await firebotRequest.modules.userDb.updateUserMetadata(streamerName, 'fbrpg-world', newWorld);
    }
}