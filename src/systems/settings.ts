import { getGameSettings } from "../firebot/firebot";

/**
 * Returns the settings for our world.
 * @param firebot 
 * @returns 
 */
export function getWorldSettings(){
    const settings = getGameSettings();
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
 * Gets the type of citizens for our world.
 * @returns 
 */
export function getWorldCitizens() : string{
    const gameSettings = getWorldSettings();
    return gameSettings.citizens;
}