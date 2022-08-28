import { CharacterClass } from '../types/equipment';

export const classList: CharacterClass[] = [
    {
        id: 1,
        name: 'Worker',
        bonuses: {
            str: 0,
            dex: 0,
            int: 0,
            totalHP: 0,
        },
        properties: ['strength'],
        rarity: 'basic',
        itemType: 'characterClass',
    },
    {
        id: 2,
        name: 'Worker',
        bonuses: {
            str: 10,
            dex: 10,
            int: 10,
            totalHP: 0,
        },
        properties: ['strength'],
        rarity: 'rare',
        itemType: 'characterClass',
    },
    {
        id: 3,
        name: 'Worker',
        bonuses: {
            str: 20,
            dex: 20,
            int: 20,
            totalHP: 0,
        },
        properties: ['strength'],
        rarity: 'epic',
        itemType: 'characterClass',
    },
    {
        id: 4,
        name: 'Worker',
        bonuses: {
            str: 30,
            dex: 30,
            int: 30,
            totalHP: 0,
        },
        properties: ['strength'],
        rarity: 'legendary',
        itemType: 'characterClass',
    },
];
