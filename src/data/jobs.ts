import { Job } from '../types/jobs';

export const jobList: Job[] = [
    {
        id: 1,
        challenge: 'easy',
        template: `A friendly monk wanders by and asks for #name's advice. He's thankful and gives #name a weapon from his cart.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
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
        challenge: 'easy',
        template: `A local blacksmith offers to create a piece of armor for #name as promo for his shop. He throws it onto the back of #name's horse.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
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
        challenge: 'easy',
        template: `#name finds a magic book on the side of the road. It's bait for a trap!`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'characterClass',
                rarity: ['basic', 'rare'],
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
        challenge: 'medium',
        template: `#name stumbles on a abandoned battlefield. Whoever fought here fled in a hurry.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic'],
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
        challenge: 'easy',
        template: `A local lord has been keeping track of #name's exploits and grants them a title and small stipend.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'title',
                rarity: ['basic'],
            },
            money: 10,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 6,
        challenge: 'legendary',
        template: `The #citizenName of the #worldType of #worldName demand you destroy the monster destroying local farms!`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['epic', 'legendary'],
            },
            money: 150,
        },
        world_tendency: {
            happiness: 2,
            resources: 1,
            research: 1,
        },
    },
];
