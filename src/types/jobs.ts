import { ItemTypes, Rarity } from '../types/equipment';
import { TendencyStat } from '../types/world';
import { MonsterDifficulties } from './monsters';

export type JobChallengeRatings = 'easy' | 'medium' | 'hard' | 'legendary';

export type JobTemplateReplacements = {
    name: string;
    worldName: string;
    worldType: string;
    citizenName: string;
};

export type Job = {
    id: number;
    challenge: JobChallengeRatings;
    template: string;
    encounter: number | MonsterDifficulties | null;
    world_tendency: TendencyStat;
    loot: {
        item?: {
            itemType?: ItemTypes;
            rarity?: Rarity[];
        };
        money?: number;
    };
};
