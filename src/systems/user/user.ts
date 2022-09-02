import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';

import {
    getCharacterMeta as getUserMeta,
    logger,
    setCharacterMeta as setUserMeta,
} from '../../firebot/firebot';
import { StorableItems } from '../../types/equipment';
import {
    Character,
    CharacterStatNames,
    EquippableSlots,
} from '../../types/user';
import { getResetID } from '../settings';

/**
 * Returns the raw character meta data.
 * @param firebot
 * @param username
 * @returns
 */
export async function getUserData(username: string): Promise<Character> {
    const characterMeta = await getUserMeta(username);
    return characterMeta;
}

/**
 * Returns custom name, else returns username.
 * @param username
 * @returns
 */
export async function getUserName(username: string): Promise<string> {
    const character = await getUserData(username);
    if (character.name != null) {
        return character.name;
    }

    return username;
}

/**
 * Verifies the character is properly built. If it's not, then it sets missing settings to default.
 * Also serves to build an initial character.
 * @param firebot
 */
export async function verifyUser(userCommand: UserCommand) {
    const userName = userCommand.commandSender;
    logger('debug', `Verifying the character state for ${userName}...`);

    const characterStats = await getUserData(userName);

    if (characterStats == null || characterStats.resetId !== getResetID()) {
        logger(
            'debug',
            `RPG: ${userName} doesn't exist yet! Creating a new character.`
        );
        const newCharacter: Character = {
            resetId: getResetID(),
            name: userName,
            totalHP: 10,
            currentHP: 10,
            str: 10,
            dex: 10,
            int: 10,
            backpack: null,
            armor: null,
            mainHand: {
                id: 1,
                itemType: 'weapon',
                nickname: null,
                refinements: 0,
                enchantments: {
                    earth: 0,
                    wind: 0,
                    fire: 0,
                    water: 0,
                    light: 0,
                    darkness: 0,
                },
            },
            offHand: {
                id: 1,
                itemType: 'weapon',
                nickname: null,
                refinements: 0,
                enchantments: {
                    earth: 0,
                    wind: 0,
                    fire: 0,
                    water: 0,
                    light: 0,
                    darkness: 0,
                },
            },
            characterClass: {
                id: 1,
                itemType: 'characterClass',
            },
            title: {
                id: 1,
                itemType: 'title',
            },
        };

        await setUserMeta(userName, newCharacter);
        return;
    }

    logger(
        'debug',
        `RPG: ${userName} exists! No need to create a new character.`
    );
}

/**
 * Equips an item on a user in a specific slot.
 * @param username
 * @param item
 * @param slot
 */
export async function equipItemOnUser(
    username: string,
    item: StorableItems,
    slot: EquippableSlots
) {
    setUserMeta(username, item, slot);
}

/**
 * Sets the users current HP to a specific amount.
 * @param username
 * @param health
 */
export async function setUserCurrentHP(username: string, health: number) {
    await setUserMeta(username, health, 'currentHP');
}

/**
 * Adjusts a characters stat by X amount.
 * @param username
 * @param stat
 */
export async function setUserStat(
    username: string,
    stat: CharacterStatNames | 'totalHP',
    amount: number
) {
    const user = await getUserData(username);
    const currentStat = user[stat];
    const newStat = currentStat + amount;

    await setUserMeta(username, newStat, stat);
}
