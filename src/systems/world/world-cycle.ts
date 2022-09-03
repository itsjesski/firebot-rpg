import { getWorldMeta, logger, sendChatMessage } from '../../firebot/firebot';
import {
    WorldBuildingTypes,
    WorldTendency,
    WorldTendencyTypes,
} from '../../types/world';
import { getWorldCitizens, getWorldName, getWorldType } from '../settings';
import { capitalize } from '../utils';
import {
    getWorldBuildings,
    setWorldStat,
    setWorldUpgrade,
} from './world-stats';
import { clearWorldTendency, worldTendencyPools } from './world-tendency';

/**
 * Checks to see which building to upgrade, and then upgrades it.
 * @returns
 */
async function upgradeBuilding() {
    const { research } = await getWorldMeta();

    if (research < 100) {
        return;
    }

    // Here we're picking the lowest upgraded building to upgrade.
    const buildings = await getWorldBuildings();
    const selectedBuilding = Object.keys(buildings).reduce(
        (key: WorldBuildingTypes, v: WorldBuildingTypes) =>
            buildings[v] < buildings[key] ? v : key
    ) as WorldBuildingTypes;

    // Flavor
    const worldName = getWorldName();
    const worldType = getWorldType();
    const citizenName = getWorldCitizens();

    // Upgrade the building by 1.
    await setWorldUpgrade(selectedBuilding, 1);

    // These building immediately affect world stats.
    switch (selectedBuilding) {
        case 'blacksmith':
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! The new technology allows the ${citizenName} of ${worldName} to improve their items further!`
            );
            break;
        case 'enchanter':
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! The ${worldType} celebrates as new arcane potential is unlocked for their items.`
            );
            break;
        case 'guild':
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! The ${worldType} of ${worldName} has come under greater threat and bigger jobs are being offered for more money.`
            );
            break;
        case 'shipyard':
            await setWorldStat('resources', 20);
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! The ${worldType} has more room to harbor traders from other lands.`
            );
            break;
        case 'tavern':
            await setWorldStat('happiness', 20);
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! The ${citizenName} of ${worldName} celebrate the occasion with a great feast!`
            );
            break;
        case 'trainer':
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded! With threats growing, the ${citizenName} of ${worldName} have to keep pushing themselves to get stronger.`
            );
            break;
        default:
            sendChatMessage(
                `Research complete! The ${capitalize(
                    selectedBuilding
                )} has been upgraded!`
            );
    }

    // Reset research level.
    await setWorldStat('research', 0, true);

    logger('debug', `${selectedBuilding} was upgraded!`);
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
