import { logger } from '../../firebot/firebot';
import {
    CharacterClass,
    Rarity,
    StoredArmor,
    StoredCharacterClass,
    StoredShield,
    StoredTitle,
    StoredWeapon,
    Title,
    Weapon,
} from '../../types/equipment';
import {
    GeneratedMonster,
    Monster,
    MonsterDifficulties,
} from '../../types/monsters';
import { getItemByID } from '../equipment/helpers';
import { rpgLootGenerator } from '../equipment/loot-generation';
import { getMinimumMonsterHP, getResetID } from '../settings';
import { getUserData } from '../user/user';
import { addOrSubtractRandomPercentage } from '../utils';
import { getMonsterByDifficulty, getMonsterByID } from './monsters';

async function generateMonsterStats(
    username: string,
    monster: Monster
): Promise<{ str: number; dex: number; int: number; hp: number }> {
    const user = await getUserData(username);

    const stats = {
        str: addOrSubtractRandomPercentage(user.str),
        dex: addOrSubtractRandomPercentage(user.dex),
        int: addOrSubtractRandomPercentage(user.int),
        hp: addOrSubtractRandomPercentage(user.totalHP),
    };

    stats.str += Math.floor(stats.str * (monster.bonuses.str / 100));
    stats.dex += Math.floor(stats.dex * (monster.bonuses.dex / 100));
    stats.int += Math.floor(stats.int * (monster.bonuses.int / 100));
    stats.hp += Math.floor(stats.hp * (monster.bonuses.hp / 100));

    return stats;
}

async function generateMonsterOffhand(
    username: string,
    mainHandId: number,
    allowedMonsterRarity: Rarity[]
): Promise<StoredWeapon | StoredShield | null> {
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
    const monsterIsID = Number(monster);

    // Pick the monster we're going to use.
    if (Number.isNaN(monsterIsID)) {
        selectedMonster = getMonsterByDifficulty(
            monster as MonsterDifficulties
        );
    } else {
        selectedMonster = getMonsterByID(monster as number);
    }

    // Generate our monster stats.
    const monsterStats = await generateMonsterStats(username, selectedMonster);

    // Make sure the stats hit our minimums.
    const minimumHP = getMinimumMonsterHP(selectedMonster.difficulty[0]);
    if (monsterStats.hp < minimumHP) {
        monsterStats.hp = minimumHP;
    }

    // Our generated monster stats.
    const generatedMonster: GeneratedMonster = {
        resetId: getResetID(),
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
        characterClass: null,
        title: null,
        duel: {
            challenger: null,
            time: null,
        },
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

        const characterClass = getItemByID(
            generatedMonster.characterClass.id,
            'characterClass'
        ) as CharacterClass;

        generatedMonster.str +=
            generatedMonster.str * (characterClass.bonuses.str / 100);
        generatedMonster.dex +=
            generatedMonster.dex * (characterClass.bonuses.dex / 100);
        generatedMonster.int +=
            generatedMonster.int * (characterClass.bonuses.int / 100);
    }

    // Generate a title for our monster.
    if (selectedMonster.equipment.title) {
        generatedMonster.title = (await rpgLootGenerator(
            username,
            'title',
            allowedMonsterRarity
        )) as StoredTitle;

        const characterTitle = getItemByID(
            generatedMonster.title.id,
            'title'
        ) as Title;

        generatedMonster.str +=
            generatedMonster.str * (characterTitle.bonuses.str / 100);
        generatedMonster.dex +=
            generatedMonster.dex * (characterTitle.bonuses.dex / 100);
        generatedMonster.int +=
            generatedMonster.int * (characterTitle.bonuses.int / 100);
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
