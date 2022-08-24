import { getGameSettings } from '../firebot/firebot';
import { ArmorProperties } from '../types/equipment';

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
export function getHitBonusSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.hitBonus;
}

/**
 * Returns our to damage bonus settings.
 * @returns
 */
export function getDamageBonusSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.damageBonus;
}

/**
 * The chance ranged weapons fumble in combat.
 * @returns
 */
export function getRangedInMeleeChanceSettings(): number {
    const gameSettings = getCombatSettings();
    return gameSettings.rangedInMeleePenalty;
}

/**
 * Returns movement speed of armor type.
 * @param armorType
 */
export function getArmorMovementSpeedSettings(
    armorType: ArmorProperties
): number {
    const gameSettings = getCombatSettings();

    switch (armorType) {
        case 'heavy':
            return gameSettings.heavyMovementSpeed;
        case 'light':
            return gameSettings.lightMovementSpeed;
        case 'medium':
            return gameSettings.mediumMovementSpeed;
        default:
            return gameSettings.nakedMovementSpeed;
    }
}

/**
 * Returns movement speed of armor type.
 * @param armorType
 */
export function getArmorDexBonusSettings(armorType: ArmorProperties): number {
    const gameSettings = getCombatSettings();

    switch (armorType) {
        case 'heavy':
            return gameSettings.heavyDexBonus;
        case 'light':
            return gameSettings.lightDexBonus;
        case 'medium':
            return gameSettings.mediumDexBonus;
        default:
            return gameSettings.nakedDexBonus;
    }
}
