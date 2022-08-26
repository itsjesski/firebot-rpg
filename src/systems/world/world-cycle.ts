import { getWorldMeta, logger, sendChatMessage } from '../../firebot/firebot';
import {
    WorldBuildingTypes,
    WorldTendency,
    WorldTendencyTypes,
} from '../../types/world';
import { setWorldStat, setWorldUpgrade } from './world-stats';
import { clearWorldTendency, worldTendencyPools } from './world-tendency';

async function upgradeBuilding() {
    const { research } = await getWorldMeta();

    if (research < 100) {
        return;
    }

    const buildings = [
        'blacksmith',
        'guild',
        'shipyard',
        'tavern',
        'tower',
    ] as WorldBuildingTypes[];

    const selectedBuilding =
        buildings[Math.floor(Math.random() * buildings.length)];

    // Upgrade the building by 1.
    await setWorldUpgrade(selectedBuilding, 1);

    // Reset research level.
    await setWorldStat('research', 0, true);

    logger('debug', `${selectedBuilding} was upgraded!`);

    sendChatMessage(
        `Research complete! ${selectedBuilding} has been upgraded!`
    );
}

/**
 * Updates our world stats based on our world tendency pools for this cycle.
 */
async function worldCycleUpdateStats() {
    logger('debug', `Updating world stats for this cycle.`);

    const promises: any[] = [];

    Object.keys(worldTendencyPools).forEach((stat: WorldTendencyTypes) => {
        const positives =
            worldTendencyPools[stat as keyof WorldTendency].positive;
        const negatives =
            worldTendencyPools[stat as keyof WorldTendency].negative;
        const netTendency = positives - negatives;

        if (netTendency === 0) {
            logger(
                'debug',
                `Net tendency was zero. No changes needed to world tendency for ${stat}.`
            );
        } else if (netTendency > 0) {
            logger(
                'debug',
                `World ${stat} shifted globally by +1 for this cycle.`
            );
            promises.push(setWorldStat(stat, 1));
        } else if (netTendency < 0) {
            logger(
                'debug',
                `World ${stat} shifted globally by -1 for this cycle.`
            );
            promises.push(setWorldStat(stat, -1));
        }
    });

    return Promise.all(promises);
}

/**
 * This function is run each game cycle and updates world settings.
 */
export async function worldCycle() {
    logger(
        'debug',
        'World cycle complete! Adjusting world stats and restarting the cycle.'
    );
    await worldCycleUpdateStats();
    await upgradeBuilding();
    clearWorldTendency();
}
