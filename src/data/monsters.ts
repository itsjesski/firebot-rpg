import { Monster } from '../types/monsters';

export const monsterList: Monster[] = [
    {
        id: 1,
        difficulty: ['easy'],
        name: 'Wolf',
        equipment: {
            armor: false,
            title: false,
            characterClass: false,
            potion: false,
        },
        bonuses: {
            str: 0,
            dex: 0,
            int: 0,
            hp: 0,
        },
        amount: {
            couple: 'pack of Wolves',
            many: 'den of Wolves',
        },
    },
];
