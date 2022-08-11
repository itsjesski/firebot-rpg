import { TendencyStat } from '../types/world';

export type Job = {
    id: number;
    template: string;
    encounter: boolean;
    world_tendency: TendencyStat;
};

export const jobList: Job[] = [
    {
        id: 1,
        template:
            "A friendly monk wanders by and asks for your advice. He's thankful and gives you an item.",
        encounter: false,
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
];
