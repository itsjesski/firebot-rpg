import { UserCommand } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";
import { getFirebot } from "./utils";

const characterKey = "fbrpg-character";

export type Character = {
    totalHP: number;
    currentHP: number;
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
    const characterMeta = await userDb.getUserMetadata(username, characterKey);
    return characterMeta;
}

/**
 * Verifies the character is properly built. If it's not, then it sets missing settings to default.
 * Also serves to build an initial character.
 * @param firebot
 */
export async function verifyCharacter(userCommand : UserCommand){
    const firebot = getFirebot();
    const userName = userCommand.commandSender;
    const {logger, userDb} = firebot.modules;
    logger.debug(`RPG: Verifying the character state for ${userName}...`);

    const characterStats = await getCharacterData(userName);

    if(characterStats == null){
        logger.debug(`RPG: ${userName} doesn't exist yet! Creating a new character.`);
        const newCharacter : Character = {
            "totalHP": 10,
            "currentHP": 10,
            "str": 10,
            "dex": 10,
            "int": 10,
            "held": {},
            "armor": {},
            "weapon": {},
            "potion": {},
            "class": {
                "name": "Peasant",
                "str": 0,
                "dex": 0,
                "int": 0,
                "hp": 0,
            },
            "title": {
                "name": "the Unknown",
                "str": 0,
                "dex": 0,
                "int": 0,
                "hp": 0,
            },
            "spell": {},
            "companion": {}
        };
        await userDb.updateUserMetadata(userName, characterKey, newCharacter);
    }
}

export async function updateCharacter(username: string, property : string, value : any){
    const characterMeta = await getCharacterData(username);

    if(characterMeta == null){
        // TODO: Create a new base character.
    }

    // TODO: Update specific meta data.
}