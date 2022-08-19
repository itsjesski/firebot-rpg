import { monsterList } from '../../data/monsters';
import { Monster, MonsterDifficulties } from '../../types/monsters';
import { filterArrayByProperty } from '../utils';

/**
 * Selects a random monsters from the given difficulty.
 * @param difficulty
 * @returns
 */
export function getMonsterByDifficulty(
    difficulty: MonsterDifficulties
): Monster {
    const monsters = filterArrayByProperty(
        monsterList,
        ['difficulty'],
        difficulty
    );

    return monsters[Math.floor(Math.random() * monsters.length)];
}

/**
 * Selects a monster by the given id number.
 * @param id
 * @returns
 */
export function getMonsterByID(id: number): Monster {
    const monsters = filterArrayByProperty(monsterList, ['id'], id);
    return monsters[0];
}
