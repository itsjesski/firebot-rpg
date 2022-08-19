import { monsterList } from '../../data/monsters';
import { logger } from '../../firebot/firebot';
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

    logger(
        'debug',
        `Monster list (${difficulty}): ${JSON.stringify(monsters)}`
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
    logger('debug', `Monster list by ID (${id}): ${JSON.stringify(monsters)}`);
    return monsters[0];
}
