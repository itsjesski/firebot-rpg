import { TendencyStat } from '../types/world';

export type Job = {
    id: number;
    template: string;
    encounter: boolean;
    world_tendency: TendencyStat;
    loot: {
        item: boolean;
        money: number;
    };
};

export const jobList: Job[] = [
    {
        id: 1,
        template:
            "A friendly monk wanders by and asks for your advice. He's thankful and gives you an item.",
        encounter: false,
        loot: {
            item: false,
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
];
