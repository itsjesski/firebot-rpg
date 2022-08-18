import { Job } from '../types/jobs';

export const jobList: Job[] = [
    {
        id: 1,
        template: `A friendly monk wanders by and asks for #name's advice. He's thankful and gives #name a weapon from his cart.`,
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
    {
        id: 2,
        template: `A local blacksmith offers to create a piece of armor for #name as promo for his shop. He throws it onto the back of #name's horse.`,
        encounter: false,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 0,
        },
        world_tendency: {
            happiness: 0,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 3,
        template: `#name finds a magic book on the side of the road. It teaches them ancient secrets.`,
        encounter: false,
        loot: {
            item: {
                itemType: 'characterClass',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 0,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 4,
        template: `#name stumbles on a abandoned battlefield. Whoever fought here fled in a hurry.`,
        encounter: false,
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 15,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 5,
        template: `A local lord has been keeping track of #name's exploits and grants them a title and small stipend.`,
        encounter: false,
        loot: {
            item: {
                itemType: 'title',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 10,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
];
