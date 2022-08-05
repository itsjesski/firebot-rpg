import { getFirebot } from "./utils";

export type Character = {
    str: number;
    dex: number;
    int: number;
    held: any;
    armor: any;
    weapon: any;
    potion: any;
    class: any;
    title: any;
    spell: any;
    companion: any;
}

/**
 * Returns the raw character meta data.
 * @param firebot 
 * @param username 
 * @returns 
 */
export async function getCharacterData(username: string){
    const firebot = getFirebot();
    const {userDb} = firebot.modules;
    const characterMeta = await userDb.getUserMetadata(username, 'fbrpg');
    return characterMeta;
}

export async function updateUserMetadata(username: string, property : string, value : any){
    const characterMeta = await getCharacterData(username);

    if(characterMeta == null){
        // TODO: Create a new base character.
    }

    // TODO: Update specific meta data.
}