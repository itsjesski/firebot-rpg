import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList } from '../../data/jobs';
import { startCombat } from '../../systems/combat/combat';
import {
    getItemTypeDisplayName,
    getFullItemName,
    getItemByID,
} from '../../systems/equipment/helpers';
import { rpgLootGenerator } from '../../systems/equipment/loot-generation';
import { generateMonster } from '../../systems/monsters/monster-generation';
import { getMonsterByID } from '../../systems/monsters/monsters';
import {
    getWorldCitizens,
    getWorldName,
    getWorldType,
} from '../../systems/settings';
import {
    equipItemOnUser,
    getUserData,
    getUserName,
} from '../../systems/user/user';
import {
    addOrSubtractRandomPercentage,
    getPercentage,
} from '../../systems/utils';
import { updateWorldTendency } from '../../systems/world/world-tendency';
import { StorableItems } from '../../types/equipment';
import { Job, JobTemplateReplacements } from '../../types/jobs';
import { GeneratedMonster } from '../../types/monsters';
import { WorldTendencyTypes } from '../../types/world';
import {
    getCurrencyName,
    giveCurrencyToUser,
    logger,
    sendChatMessage,
} from '../firebot';

/**
 * Gives currency reward to the user from a job.
 * @param job
 * @param username
 * @returns
 */
async function giveJobCurrencyReward(
    job: Job,
    username: string
): Promise<number> {
    const amount = job.loot.money;

    if (amount == null || amount === 0) {
        return 0;
    }

    const total = addOrSubtractRandomPercentage(amount);

    await giveCurrencyToUser(total, username);

    return total;
}

/**
 * Builds out the loot part of a job message.
 * @param username
 * @param moneyReward
 * @param itemReward
 * @returns
 */
async function rpgJobMessageLootTemplate(
    username: string,
    moneyReward: number,
    itemReward: StorableItems | null
): Promise<string> {
    const currencyName = getCurrencyName();
    const characterName = await getUserName(username);
    const rewards: string[] = [];

    // They didn't get anything.
    if (moneyReward === 0 && itemReward == null) {
        return '';
    }

    // If they got currency, add that to the reward message.
    if (moneyReward > 0) {
        rewards.push(`${moneyReward} ${currencyName.toLowerCase()}`);
    }

    // If they got a reward item, add that to the reward message.
    if (itemReward != null) {
        const itemName = getFullItemName(itemReward);
        const dbItem = await getItemByID(itemReward.id, itemReward.itemType);
        rewards.push(
            `${itemName} (${dbItem.rarity} ${getItemTypeDisplayName(dbItem)})`
        );
    }

    return `${characterName} received: ${rewards.join(', ')}.`;
}

/**
 * Replaces template placeholders in a job message with actual text.
 * @param username
 * @param message
 * @returns
 */
async function rpgJobMessageTemplateReplacement(
    username: string,
    message: string
): Promise<string> {
    const replacements = {
        name: await getUserName(username),
        worldName: getWorldName(),
        worldType: getWorldType(),
        citizenName: getWorldCitizens(),
    };

    const result = message.replace(
        /#(\w+)/g,
        (match, key) =>
            replacements[key as keyof JobTemplateReplacements] || match
    );

    return result;
}

async function rpgJobMessageCombatTemplate(
    username: string,
    combatResults: { fought: GeneratedMonster; won: boolean } | null
): Promise<string> {
    if (combatResults == null) {
        return '';
    }

    const characterName = await getUserName(username);
    const character = await getUserData(username);
    const monster = await getMonsterByID(combatResults.fought.id);
    const playerWon = combatResults.won ? 'won' : 'lost';

    // Compare monster and player stats to figure out how to show the combat message.
    const monsterStats =
        combatResults.fought.str +
        combatResults.fought.dex +
        combatResults.fought.int;
    const playerStats = character.str + character.dex + character.int;
    const percentageDiff = getPercentage(monsterStats, playerStats);
    let amount = null;

    // Figure out if which "amount" we want to show.
    logger(
        'debug',
        `Monster was ${percentageDiff} stronger / weaker than the player. Monster: ${monsterStats} vs Player: ${playerStats}.`
    );
    if (percentageDiff > 1.5) {
        amount = monster.amount.many;
    } else if (percentageDiff > 1.1) {
        amount = monster.amount.couple;
    }

    if (amount != null) {
        return `${characterName} fought a ${amount} and ${playerWon}.`;
    }

    return `${characterName} fought a ${monster.name} and ${playerWon}.`;
}

/**
 * Main function for building out the message for our jobs and compiling it.
 * @param username
 * @param messageTemplate
 * @param moneyReward
 * @param itemReward
 * @returns
 */
async function rpgJobMessageBuilder(
    username: string,
    messageTemplate: string,
    moneyReward: number,
    itemReward: StorableItems | null,
    combatResults: { fought: GeneratedMonster; won: boolean } | null
): Promise<string> {
    const jobMessage = `@${username}: ${messageTemplate}`;
    const rewards = await rpgJobMessageLootTemplate(
        username,
        moneyReward,
        itemReward
    );
    const combat = await rpgJobMessageCombatTemplate(username, combatResults);

    const message = await rpgJobMessageTemplateReplacement(
        username,
        `${jobMessage} ${combat} ${rewards}`
    );

    return message;
}

export async function rpgJobCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const selectJob: Job = jobList[Math.floor(Math.random() * jobList.length)];
    let itemGiven = null;
    let combatResults = null;
    let jobMessage = '';

    logger('debug', `JOB STARTED: ${username}`);

    // Combat time.
    if (selectJob.encounter != null) {
        logger('debug', `This job has an encounter: ${selectJob.encounter}`);
        const monster = await generateMonster(username, selectJob.encounter);
        const player = await getUserData(username);
        const combat = await startCombat(player, monster);
        combatResults = {
            fought: monster,
            won: combat.one > 0,
        };

        // Player lost, stop here.
        if (!combatResults.won) {
            jobMessage = await rpgJobMessageBuilder(
                username,
                selectJob.template,
                0,
                null,
                combatResults
            );

            Object.keys(selectJob.world_tendency).forEach((stat) => {
                const key = stat as WorldTendencyTypes;
                const statValue = -Math.abs(selectJob.world_tendency[key]);
                if (statValue !== 0) {
                    updateWorldTendency(key, statValue);
                }
            });

            sendChatMessage(jobMessage);
            return;
        }
    }

    // Give currency to the user if this job rewards that.
    const currencyGiven = await giveJobCurrencyReward(selectJob, username);

    // Generate our loot item if there is one.
    // Hand our loot to the player right away.
    if (selectJob.loot?.item?.itemType != null) {
        itemGiven = await rpgLootGenerator(
            username,
            selectJob.loot.item.itemType,
            selectJob.loot.item.rarity
        );
        await equipItemOnUser(username, itemGiven, 'backpack');
    }

    // Add result to the world tendency pool.
    Object.keys(selectJob.world_tendency).forEach((stat) => {
        const key = stat as WorldTendencyTypes;
        const statValue = selectJob.world_tendency[key];
        if (statValue !== 0) {
            updateWorldTendency(key, statValue);
        }
    });

    // Create our response message.
    jobMessage = await rpgJobMessageBuilder(
        username,
        selectJob.template,
        currencyGiven,
        itemGiven,
        combatResults
    );

    // Send our message template for this job to chat.
    sendChatMessage(jobMessage);
}
