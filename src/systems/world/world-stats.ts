import { logger, updateWorldMeta, getWorldMeta } from '../../firebot/firebot';
import {
    WorldBuildings,
    WorldBuildingTypes,
    WorldStats,
    WorldTendencyTypes,
} from '../../types/world';

/**
 * Generic function for updating any world property.
 * @param firebot
 * @param property
 * @param value
 */
async function updateWorldProperty(property: string, value: any) {
    const rpgMeta = await getWorldMeta();

    if (Number.isNaN(value)) {
        logger(
            'error',
            `Invalid amount passed to update world property, ${value}.`
        );
        return;
    }

    // World doesn't exist.
    if (rpgMeta == null) {
        logger(
            'error',
            `Couldn't update world property as world stats could not be found.`
        );
        return;
    }

    logger('debug', `Setting world ${property} to ${JSON.stringify(value)}.`);
    await updateWorldMeta(value, property);
}

export async function setWorldUpgrade(
    upgrade: WorldBuildingTypes,
    value: number
) {
    if (Number.isNaN(value)) {
        logger('error', `Trying to set ${upgrade} to invalid value, ${value}.`);
        return;
    }

    const { upgrades } = await getWorldMeta();

    // Set our value.
    upgrades[upgrade as keyof WorldBuildings] += value;

    // Now, feed the entire upgrades object back into the world.
    await updateWorldProperty('upgrades', upgrades);
}

/**
 * Sets one of the world stats to a specific thing, making sure to cap min and maximum values.
 * @param firebot
 */
export async function setWorldStat(
    stat: WorldTendencyTypes,
    value: number,
    setExactly?: boolean
) {
    const worldStats = await getWorldMeta();
    let worldValue = 50;

    if (Number.isNaN(value)) {
        logger('error', `Trying to set ${stat} to invalid value, ${value}.`);
        return;
    }

    // This allows us to set a world stat to a specific number.
    if (setExactly) {
        worldValue = Math.min(Math.max(value, 0), 100);
        await updateWorldProperty(stat, value);
        return;
    }

    // Clamp our world stats to 0 and 100.
    worldValue = Math.min(Math.max(worldStats[stat] + value, 0), 100);

    await updateWorldProperty(stat, worldValue);
}

/**
 * Verifies the world is properly built. If it's not, then it sets missing settings to default.
 * Also serves to build the initial world.
 * @param firebot
 */
export async function verifyWorld() {
    logger('debug', `Verifying the world state...`);

    const worldStats = await getWorldMeta();

    if (worldStats == null) {
        logger('debug', `World doesn't exist yet! Creating a new one.`);
        const newWorld: WorldStats = {
            happiness: 50,
            resources: 50,
            research: 0,
            upgrades: {
                blacksmith: 0,
                tavern: 0,
                enchanter: 0,
                shipyard: 0,
                guild: 0,
            },
        };
        await updateWorldMeta(newWorld);
    }
}
