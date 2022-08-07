import { GameSettings } from "../firebot/games/register-game";
import { getFirebot } from "./utils";

/**
 * Get all game settings
 * @returns 
 */
export function getAllGameSettings() : GameSettings | null{
    const firebot = getFirebot();
    const {gameManager, logger} = firebot.modules;
    const settings = gameManager.getGameSettings('fbrpg');
    return settings.settings as GameSettings;
}

/**
 * Returns the settings for our world.
 * @param firebot 
 * @returns 
 */
export function getWorldSettings(){
    const settings = getAllGameSettings();
    return settings.worldSettings;
}

/**
 * Get world name from our settings.
 * @returns 
 */
export function getWorldName() : string{
    const gameSettings = getWorldSettings();
    return gameSettings.name;
}

/**
 * Get the world type from our settings.
 * @returns 
 */
export function getWorldType() : string{
    const gameSettings = getWorldSettings();
    return gameSettings.type;
}

/**
 * Gets the type of citizens from our world.
 * @returns 
 */
export function getWorldCitizens() : string{
    const gameSettings = getWorldSettings();
    return gameSettings.citizens;
}