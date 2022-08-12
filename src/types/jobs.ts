import { ItemTypes, Rarity } from '../types/equipment';
import { TendencyStat } from '../types/world';

export type Job = {
    id: number;
    template: string;
    encounter: boolean;
    world_tendency: TendencyStat;
    loot: {
        item?: {
            itemType?: ItemTypes;
            rarity?: Rarity[];
        };
        money?: number;
    };
};
