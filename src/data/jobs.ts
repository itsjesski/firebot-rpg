import { Job } from '../types/jobs';

export const jobList: Job[] = [
    {
        id: 1,
        template:
            "A friendly monk wanders by and asks for your advice. He's thankful and gives you a weapon from his cart.",
        encounter: false,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
];
