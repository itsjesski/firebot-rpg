import { getGameSettings } from '../firebot/firebot';
import { ArmorProperties } from '../types/equipment';
import { MonsterDifficulties } from '../types/monsters';

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
 * Get all creature settings.
 * @returns
 */
export function getCreatureSettings() {
    const settings = getGameSettings();
    return settings.creatureSettings;
}

/**
 * Get all shop settings.
 * @returns
 */
export function getShopSettings() {
    const settings = getGameSettings();
    return settings.shops;
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
export function getArmorDexBonusSettings(
    armorType: ArmorProperties | null
): number {
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

/**
 * Returns arcane failure of armor type.
 * @param armorType
 */
export function getArmorArcaneFailure(
    armorType: ArmorProperties | null
): number {
    const gameSettings = getCombatSettings();

    switch (armorType) {
        case 'heavy':
            return gameSettings.heavyArcaneFailure;
        case 'light':
            return gameSettings.lightArcaneFailure;
        case 'medium':
            return gameSettings.mediumArcaneFailure;
        default:
            return gameSettings.nakedArcaneFailure;
    }
}

/**
 * Returns minimum hp for a creature difficulty.
 * @param difficulty
 */
export function getMinimumMonsterHP(difficulty: MonsterDifficulties): number {
    const gameSettings = getCreatureSettings();

    switch (difficulty) {
        case 'legendary':
            return gameSettings.legendaryMinHP;
        case 'medium':
            return gameSettings.mediumMinHP;
        case 'hard':
            return gameSettings.hardMinHP;
        default:
            return gameSettings.easyMinHP;
    }
}

/**
 * Gets base enchantment cost from settings.
 */
export function getEnchantmentBaseCost() {
    const gameSettings = getShopSettings();
    return gameSettings.enchantmentBaseCost;
}

/**
 * Gets enchantment multiplier cost from settings.
 */
export function getEnchantmentCostMultiplier() {
    const gameSettings = getShopSettings();
    return gameSettings.enchantmentMultiplier;
}

/**
 * Get the number of enchantments we can have per enchanter level.
 * @returns
 */
export function getEnchantmentLevelLimit() {
    const gameSettings = getShopSettings();
    return gameSettings.enchantmentsPerLevel;
}

/**
 * Gets base refinement cost from settings.
 */
export function getRefinementBaseCost() {
    const gameSettings = getShopSettings();
    return gameSettings.refinementBaseCost;
}

/**
 * Gets refinement multiplier cost from settings.
 */
export function getRefinementCostMultiplier() {
    const gameSettings = getShopSettings();
    return gameSettings.refinementMultiplier;
}

/**
 * Get the number of refinements we can have per blacksmith level.
 * @returns
 */
export function getRefinementLevelLimit() {
    const gameSettings = getShopSettings();
    return gameSettings.refinementsPerLevel;
}

/**
 * Gets base training cost from settings.
 */
export function getTrainingBaseCost() {
    const gameSettings = getShopSettings();
    return gameSettings.trainingBaseCost;
}

/**
 * Gets training multiplier cost from settings.
 */
export function getTrainingCostMultiplier() {
    const gameSettings = getShopSettings();
    return gameSettings.trainingMultiplier;
}

/**
 * Get the number of trainings we can have per blacksmith level.
 * @returns
 */
export function getTrainingLevelLimit() {
    const gameSettings = getShopSettings();
    return gameSettings.trainingsPerLevel;
}

/**
 * Gets our game reset id.
 * @returns
 */
export function getResetID() {
    const settings = getGameSettings();
    return settings.generalSettings.resetId;
}

export function getDuelTimeout() {
    const gameSettings = getCombatSettings();
    return gameSettings.duelTimeout;
}
