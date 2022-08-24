import { logger } from '../firebot/firebot';
import { getWorldCycleTimeSettings } from './settings';
import { worldCycle } from './world/world-cycle';

export function startGameCycle() {
    logger('debug', `Starting game cycle.`);
    const gameCycle = getWorldCycleTimeSettings();
    setInterval(async () => {
        await worldCycle();
    }, gameCycle * 1000);
}
