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
            dex: 20,
            int: 0,
            hp: 0,
        },
        amount: {
            couple: 'pack of Wolves',
            many: 'den of Wolves',
        },
    },
    {
        id: 2,
        difficulty: ['medium'],
        name: 'Barbarian',
        equipment: {
            armor: true,
            title: false,
            characterClass: false,
            potion: false,
        },
        bonuses: {
            str: 10,
            dex: 0,
            int: 0,
            hp: 15,
        },
        amount: {
            couple: 'group of Barbarians',
            many: 'clan of Barbarians',
        },
    },
    {
        id: 3,
        difficulty: ['hard'],
        name: 'Spellsword',
        equipment: {
            armor: true,
            title: true,
            characterClass: true,
            potion: false,
        },
        bonuses: {
            str: 35,
            dex: 0,
            int: 10,
            hp: 35,
        },
        amount: {
            couple: 'expert Spellsword',
            many: 'master Spellsword',
        },
    },
    {
        id: 4,
        difficulty: ['legendary'],
        name: 'Black Dragon',
        equipment: {
            armor: true,
            title: true,
            characterClass: true,
            potion: true,
        },
        bonuses: {
            str: 25,
            dex: 25,
            int: 25,
            hp: 100,
        },
        amount: {
            couple: 'old Black Dragon',
            many: 'ancient Black Dragon',
        },
    },
];
