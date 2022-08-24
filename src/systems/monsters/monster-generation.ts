import { logger } from '../../firebot/firebot';
import {
    Rarity,
    StoredArmor,
    StoredCharacterClass,
    StoredShield,
    StoredTitle,
    StoredWeapon,
    Weapon,
} from '../../types/equipment';
import {
    GeneratedMonster,
    Monster,
    MonsterDifficulties,
} from '../../types/monsters';
import { getItemByID } from '../equipment/helpers';
import { rpgLootGenerator } from '../equipment/loot-generation';
import { getUserData } from '../user/user';
import { addOrSubtractRandomPercentage } from '../utils';
import { getMonsterByDifficulty, getMonsterByID } from './monsters';

async function generateMonsterStats(
    username: string,
    monster: Monster
): Promise<{ str: number; dex: number; int: number; hp: number }> {
    logger('debug', `Generating monster stats.`);
    const user = await getUserData(username);

    const stats = {
        str: addOrSubtractRandomPercentage(user.str),
        dex: addOrSubtractRandomPercentage(user.dex),
        int: addOrSubtractRandomPercentage(user.int),
        hp: addOrSubtractRandomPercentage(user.totalHP),
    };

    stats.str += stats.str * (monster.bonuses.str / 100);
    stats.dex += stats.dex * (monster.bonuses.dex / 100);
    stats.int += stats.int * (monster.bonuses.int / 100);
    stats.hp += stats.hp * (monster.bonuses.hp / 100);

    logger('debug', `Monster stats: ${JSON.stringify(stats)}`);

    return stats;
}

async function generateMonsterOffhand(
    username: string,
    mainHandId: number,
    allowedMonsterRarity: Rarity[]
): Promise<StoredWeapon | StoredShield | null> {
    logger('debug', `Generating monster off hand item.`);
    let item = null;

    // See if we need an off hand weapon...
    const mainWeaponStats = getItemByID(mainHandId, 'weapon') as Weapon;

    // There is also a 25% chance we don't generate an offhand at all.
    const shouldHaveOffhand = Math.random() < 0.25;

    // First, if our main hand weapon is a two-hander, then don't generate anything.
    if (
        !mainWeaponStats.properties.includes('two-handed') &&
        shouldHaveOffhand
    ) {
        // Now, there is a 50% chance we'll have a shield versus a weapon.
        const shouldHaveShield = Math.random() < 0.5;
        if (shouldHaveShield) {
            item = (await rpgLootGenerator(
                username,
                'shield',
                allowedMonsterRarity
            )) as StoredWeapon;
        } else {
            const offhandWeapon = (await rpgLootGenerator(
                username,
                'weapon',
                allowedMonsterRarity
            )) as StoredWeapon;
            const offhandWeaponStats = getItemByID(
                mainHandId,
                'weapon'
            ) as Weapon;

            // Here we're making sure the offhand weapon we generated is not two handed.
            // If it is two handed, then this creature just won't have an off hand item.
            if (!offhandWeaponStats.properties.includes('two-handed')) {
                item = offhandWeapon;
            }
        }
    }

    return item;
}

export async function generateMonster(
    username: string,
    monster: number | MonsterDifficulties
): Promise<GeneratedMonster> {
    let selectedMonster;
    const allowedMonsterRarity = ['basic', 'rare', 'epic'] as Rarity[];

    logger('debug', `Generating a monster for the encounter: ${monster}`);
    const monsterIsID = Number(monster);

    // Pick the monster we're going to use.
    if (Number.isNaN(monsterIsID)) {
        selectedMonster = getMonsterByDifficulty(
            monster as MonsterDifficulties
        );
    } else {
        selectedMonster = getMonsterByID(monster as number);
    }

    logger('debug', `Selected monster: ${JSON.stringify(selectedMonster)}.`);

    // Generate our monster stats.
    const monsterStats = await generateMonsterStats(username, selectedMonster);

    // Our generated monster stats.
    const generatedMonster: GeneratedMonster = {
        id: selectedMonster.id,
        name: selectedMonster.name,
        totalHP: monsterStats.hp,
        currentHP: monsterStats.hp,
        str: monsterStats.str,
        dex: monsterStats.dex,
        int: monsterStats.int,
        backpack: null,
        armor: null,
        mainHand: null,
        offHand: null,
        potion: null,
        characterClass: null,
        title: null,
    };

    // Generate a weapon for the main hand.
    generatedMonster.mainHand = (await rpgLootGenerator(
        username,
        'weapon',
        allowedMonsterRarity
    )) as StoredWeapon;

    // Generate some armor for our monster.
    if (selectedMonster.equipment.armor) {
        generatedMonster.armor = (await rpgLootGenerator(
            username,
            'armor',
            allowedMonsterRarity
        )) as StoredArmor;
    }

    // Generate a class for our monster.
    if (selectedMonster.equipment.characterClass) {
        generatedMonster.characterClass = (await rpgLootGenerator(
            username,
            'characterClass',
            allowedMonsterRarity
        )) as StoredCharacterClass;
    }

    // Generate a title for our monster.
    if (selectedMonster.equipment.title) {
        generatedMonster.title = (await rpgLootGenerator(
            username,
            'title',
            allowedMonsterRarity
        )) as StoredTitle;
    }

    // Generated our off hand if we need one.
    generatedMonster.offHand = await generateMonsterOffhand(
        username,
        generatedMonster.mainHand.id,
        allowedMonsterRarity
    );

    logger('debug', `Generated monster: ${JSON.stringify(generatedMonster)}.`);

    return generatedMonster;
}
