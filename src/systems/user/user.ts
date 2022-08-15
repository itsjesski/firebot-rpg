import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';

import {
    getCharacterMeta,
    logger,
    setCharacterMeta,
} from '../../firebot/firebot';
import { StoredArmor, StoredWeapon } from '../../types/equipment';
import { Character, EquippableSlots } from '../../types/user';
import { sumOfObjectProperties } from '../utils';

/**
 * Returns the raw character meta data.
 * @param firebot
 * @param username
 * @returns
 */
export async function getCharacterData(username: string): Promise<Character> {
    const characterMeta = await getCharacterMeta(username);
    return characterMeta;
}

/**
 * Returns custom name, else returns username.
 * @param username
 * @returns
 */
export async function getCharacterName(username: string): Promise<string> {
    const character = await getCharacterData(username);
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
export async function verifyCharacter(userCommand: UserCommand) {
    const userName = userCommand.commandSender;
    logger('debug', `Verifying the character state for ${userName}...`);

    const characterStats = await getCharacterData(userName);

    if (characterStats == null) {
        logger(
            'debug',
            `RPG: ${userName} doesn't exist yet! Creating a new character.`
        );
        const newCharacter: Character = {
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
            potion: null,
            class: {
                name: 'Commoner',
                str: 0,
                dex: 0,
                int: 0,
                hp: 0,
            },
            title: {
                name: 'Worker',
                str: 0,
                dex: 0,
                int: 0,
                hp: 0,
            },
        };

        setCharacterMeta(userName, newCharacter);
    }
}

export async function getUserWeaponEnchantmentCount(
    username: string
): Promise<{ main_hand: number; off_hand: number }> {
    logger('debug', `Getting weapon enchantment count for ${username}.`);
    const characterStats = await getCharacterData(username);
    const mainHand = characterStats.mainHand as StoredWeapon;
    const offHand = characterStats.offHand as StoredWeapon;
    const values = {
        main_hand: 0,
        off_hand: 0,
    };

    if (mainHand?.enchantments != null) {
        values.main_hand = sumOfObjectProperties(mainHand.enchantments);
    }

    if (offHand?.enchantments != null) {
        values.off_hand = sumOfObjectProperties(offHand.enchantments);
    }

    logger(
        'debug',
        `Enchantment count for main hand of ${username} is ${values.main_hand}.`
    );
    logger(
        'debug',
        `Enchantment count for off hand of ${username} is ${values.off_hand}.`
    );

    return values;
}

export async function getUserWeaponRefinementCount(
    username: string
): Promise<{ mainHand: number; offHand: number }> {
    logger('debug', `Getting weapon refinement count for ${username}.`);
    const characterStats = await getCharacterData(username);
    const mainHand = characterStats.mainHand as StoredWeapon;
    const offHand = characterStats.offHand as StoredWeapon;
    const values = {
        mainHand: 0,
        offHand: 0,
    };

    if (mainHand?.refinements != null) {
        values.mainHand = mainHand.refinements;
    }

    if (offHand?.refinements != null) {
        values.offHand = offHand.refinements;
    }

    logger(
        'debug',
        `Refinement count for main hand of ${username} is ${values.mainHand}.`
    );
    logger(
        'debug',
        `Refinement count for off hand of ${username} is ${values.offHand}.`
    );

    return values;
}

export async function equipItemOnUser(
    username: string,
    item: StoredWeapon | StoredArmor,
    slot: EquippableSlots
) {
    setCharacterMeta(username, item, slot);
}
