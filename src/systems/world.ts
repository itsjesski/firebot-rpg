import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { getStreamerUsername } from "./utils";

export type rpgWorld = {
    "name": string,
    "type": string,
    "happiness": number,
    "resources": number,
    "military": number,
}

/**
 * Gets our world data from the streamer account meta.
 * @param firebotRequest 
 * @returns 
 */
export function getWorldData(firebotRequest : RunRequest<any>){
    const streamerName = getStreamerUsername(firebotRequest);
    return firebotRequest.modules.userDb.getUserMetadata(streamerName, 'fbrpg', 'world');
}

/**
 * Verifies the world is properly built.
 * @param firebotRequest
 */
export function verifyWorld(firebotRequest : RunRequest<any>){
    const world = getWorldData(firebotRequest);

    // TODO: Always update name to match game settings if it doesn't match.
    // TODO: Update type to match game settings if it doesn't match.
    // TODO: Set other attributes to 100 if they're not set.

}