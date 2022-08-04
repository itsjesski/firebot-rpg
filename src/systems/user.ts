import { getFirebot } from "./utils";

/**
 * Returns the raw character meta data.
 * @param firebotRequest 
 * @param username 
 * @returns 
 */
export async function getCharacterData(username: string){
    const firebotRequest = getFirebot();
    const characterMeta = await firebotRequest.modules.userDb.getUserMetadata(username, 'fbrpg');
    return characterMeta;
}

export async function updateUserMetadata(username: string, property : string, value : any){
    const characterMeta = await getCharacterData(username);

    if(characterMeta == null){
        // TODO: Create a new base character.
    }

    // TODO: Update specific meta data.
}