import { getWorldMeta } from '../../firebot/firebot';

/**
 * Returns final cost with resources discount built in.
 * @param cost
 * @returns
 */
export async function calculateShopCost(cost: number) {
    const world = await getWorldMeta();
    const { resources } = world;
    let resourcesBonus = 0;

    if (resources < 25) {
        resourcesBonus = 0.25;
    } else if (resources >= 25 && resources < 50) {
        resourcesBonus = 0.1;
    } else if (resources >= 50 && resources < 75) {
        resourcesBonus = -0.1;
    } else {
        resourcesBonus = -0.25;
    }

    const finalTotal = Math.floor(cost * resourcesBonus + cost);
    return finalTotal;
}
