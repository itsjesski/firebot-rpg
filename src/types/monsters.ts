import { Character } from './user';

export type MonsterDifficulties = 'easy' | 'medium' | 'hard' | 'legendary';

export type Monster = {
    id: number;
    difficulty: [MonsterDifficulties];
    name: string;
    equipment: {
        armor: boolean;
        title: boolean;
        characterClass: boolean;
        potion: boolean;
    };
    bonuses: {
        str: number;
        dex: number;
        int: number;
        hp: number;
    };
    amount: {
        couple: string;
        many: string;
    };
};

export type GeneratedMonster = {
    id: number;
} & Character;
