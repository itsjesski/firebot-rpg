import { logger } from '../../firebot/firebot';

export type WorldTendency = {
    happiness: {
        positive: number;
        negative: number;
    };
    resources: {
        positive: number;
        negative: number;
    };
    research: {
        positive: number;
        negative: number;
    };
};

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
export function updateWorldTendency(stat: string, value: number) {
    // @ts-ignore
    const currentAmount = worldTendencyPools[stat];

    if (currentAmount == null) {
        logger('error', `RPG: Couldn't find stat ${stat} in world stat pool.`);
        return;
    }

    // @ts-ignore
    worldTendencyPools[stat] = currentAmount + value;
}

/**
 * This clears the world stat pool at the end of a cycle.
 */
export function clearWorldTendency() {
    logger('debug', "Clearing this cycle's world stat pool.");

    for (const stat in worldTendencyPools) {
        if (stat != null) {
            worldTendencyPools[stat as keyof WorldTendency].positive = 0;
            worldTendencyPools[stat as keyof WorldTendency].negative = 0;
        }
    }
}
