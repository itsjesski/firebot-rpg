import { Title } from '../types/equipment';

export const titleList: Title[] = [
    {
        id: 1,
        name: 'Commoner',
        bonuses: {
            str: 0,
            dex: 0,
            int: 0,
            totalHP: 0,
        },
        rarity: 'basic',
        itemType: 'title',
    },
    {
        id: 2,
        name: 'Commoner',
        bonuses: {
            str: 10,
            dex: 10,
            int: 10,
            totalHP: 0,
        },
        rarity: 'rare',
        itemType: 'title',
    },
    {
        id: 3,
        name: 'Commoner',
        bonuses: {
            str: 20,
            dex: 20,
            int: 20,
            totalHP: 0,
        },
        rarity: 'epic',
        itemType: 'title',
    },
    {
        id: 4,
        name: 'Commoner',
        bonuses: {
            str: 30,
            dex: 30,
            int: 30,
            totalHP: 0,
        },
        rarity: 'legendary',
        itemType: 'title',
    },
];
