import { logger } from '../../firebot/firebot';
import { WorldTendency, WorldTendencyTypes } from '../../types/world';

export const worldTendencyPools: WorldTendency = {
    happiness: {
        positive: 0,
        negative: 0,
    },
    resources: {
        positive: 0,
        negative: 0,
    },
    research: {
        positive: 0,
        negative: 0,
    },
};

/**
 * Updates one of the stats in our world stat pool.
 * You give this a postive or negative number and it'll add or subtract from current values.
 * @param stat
 * @param value
 * @returns
 */
export function updateWorldTendency(stat: WorldTendencyTypes, value: number) {
    if (value === 0 || value == null) {
        return;
    }

    logger('debug', `Adjusting world ${stat} pool value by ${value}.`);

    let currentAmount = worldTendencyPools[stat].positive;

    // If value is less than zero, let's add it to the negative pool.
    if (value < 0) {
        currentAmount = worldTendencyPools[stat].negative;
        worldTendencyPools[stat].negative = currentAmount - value;
        return;
    }

    // Otherwise, it goes to the positive pool.
    worldTendencyPools[stat].positive = currentAmount + value;
}

/**
 * This clears the world stat pool at the end of a cycle.
 */
export function clearWorldTendency() {
    logger('debug', "Clearing this cycle's world stat pool.");

    // eslint-disable-next-line no-restricted-syntax
    for (const stat of Object.keys(worldTendencyPools)) {
        if (stat != null) {
            worldTendencyPools[stat as keyof WorldTendency].positive = 0;
            worldTendencyPools[stat as keyof WorldTendency].negative = 0;
        }
    }
}
