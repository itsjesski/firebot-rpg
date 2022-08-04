import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";

/**
 * Returns the raw character meta data.
 * @param firebotRequest 
 * @param username 
 * @returns 
 */
export async function getCharacterData(firebotRequest : RunRequest<any>, username: string){
    const characterMeta = await firebotRequest.modules.userDb.getUserMetadata(username, 'fbrpg');
    return characterMeta;
}

export async function updateUserMetadata(firebotRequest : RunRequest<any>, username: string, property : string, value : any){
    const characterMeta = await getCharacterData(firebotRequest, username);

    if(characterMeta == null){
        // TODO: Create a new base character.
    }

    // TODO: Update specific meta data.
}