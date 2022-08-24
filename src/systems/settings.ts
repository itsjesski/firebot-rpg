import { getGameSettings } from '../firebot/firebot';

/**
 * Returns the settings for our world.
 * @param firebot
 * @returns
 */
export function getWorldSettings() {
    const settings = getGameSettings();
    return settings.worldSettings;
}

/**
 * Get world name from our settings.
 * @returns
 */
export function getWorldName(): string {
    const gameSettings = getWorldSettings();
    return gameSettings.name;
}

/**
 * Get the world type from our settings.
 * @returns
 */
export function getWorldType(): string {
    const gameSettings = getWorldSettings();
    return gameSettings.type;
}

/**
 * Gets the type of citizens for our world.
 * @returns
 */
export function getWorldCitizens(): string {
    const gameSettings = getWorldSettings();
    return gameSettings.citizens;
}

/**
 * Get our world cycle time.
 * @returns
 */
export function getWorldCycleTimeSettings(): number {
    const gameSettings = getWorldSettings();
    return gameSettings.cycleTime;
}

/**
 * Get all combat settings
 * @returns
 */
export function getCombatSettings() {
    const settings = getGameSettings();
    return settings.combatSettings;
}

/**
 * Return our innate off hand miss chance.
 * @returns
 */
export function getOffHandMissChanceSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.offHandMissChance;
}

/**
 * Returns our to hit bonus settings.
 * @returns
 */
export function getToHitBonusSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.toHitBonus;
}

/**
 * The chance ranged weapons fumble in combat.
 * @returns
 */
export function getRangedInMeleeChanceSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.rangedInMeleePenalty;
}
