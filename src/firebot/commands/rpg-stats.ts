import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import {
    getAdjustedCharacterStat,
    getCharacterTotalAC,
    getCompleteCharacterData,
} from '../../systems/characters/characters';
import { getFullItemTextWithStats } from '../../systems/equipment/helpers';

import { getUserData, getUserName } from '../../systems/user/user';
import { logger, sendChatMessage } from '../firebot';

export async function rpgStatsCommand(userCommand: UserCommand) {
    logger('debug', 'Sending world command.');

    const username = userCommand.commandSender;
    const character = await getUserData(username);
    const completeCharacter = await getCompleteCharacterData(character);
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    let message = null;
    let item;
    let storedCharacterClass;
    let storedTitle;
    let str;
    let dex;
    let int;
    let acTotal;
    const characterName = await getUserName(username);

    switch (commandUsed) {
        case 'backpack':
            item = getFullItemTextWithStats(completeCharacter.backpack);
            message = `@${username} ${characterName}'s backpack contains: ${item}`;
            break;
        case 'main':
        case 'main-hand':
        case 'main_hand':
            item = getFullItemTextWithStats(completeCharacter.mainHand);
            message = `@${username} ${characterName}'s main hand holds: ${item}`;
            break;
        case 'off':
        case 'off-hand':
        case 'off_hand':
            item = getFullItemTextWithStats(completeCharacter.offHand);
            message = `@${username} ${characterName}'s off hand holds: ${item}`;
            break;
        case 'armor':
            item = getFullItemTextWithStats(completeCharacter.armor);
            message = `@${username} ${characterName}'s equipped armor: ${item}`;
            break;
        case 'title':
            item = getFullItemTextWithStats(completeCharacter.title);
            message = `@${username} ${characterName}'s title is: ${item}`;
            break;
        case 'class':
        case 'characterClass':
            item = getFullItemTextWithStats(completeCharacter.characterClass);
            message = `@${username} ${characterName}'s class is: ${item}`;
            break;
        case 'character':
        case 'profile':
            storedCharacterClass = completeCharacter.characterClassData;
            storedTitle = completeCharacter.titleData;
            str = await getAdjustedCharacterStat(completeCharacter, 'str');
            dex = await getAdjustedCharacterStat(completeCharacter, 'dex');
            int = await getAdjustedCharacterStat(completeCharacter, 'int');
            acTotal = await getCharacterTotalAC(completeCharacter, 0);
            message = `@${username} ${storedTitle.name} ${characterName} the ${storedCharacterClass.name} has: ${str} STR, ${dex} DEX, ${int} INT, ${acTotal} AC, and ${character.totalHP} HP.`;
            break;
        default:
            message = `@${username}, please choose which slot to view stats on. Options: backpack, main, off, armor, title, class, or character. Example: !rpg stats character`;
    }

    if (message != null) {
        sendChatMessage(message);
    }
}
