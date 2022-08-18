import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList } from '../../data/jobs';
import {
    getItemTypeDisplayName,
    getFullItemName,
    getItemByID,
} from '../../systems/equipment/helpers';
import { rpgLootGenerator } from '../../systems/equipment/loot-generation';
import {
    getWorldCitizens,
    getWorldName,
    getWorldType,
} from '../../systems/settings';
import { equipItemOnUser, getCharacterName } from '../../systems/user/user';
import { addOrSubtractRandomPercentage } from '../../systems/utils';
import { updateWorldTendency } from '../../systems/world/world-tendency';
import { StorableItems } from '../../types/equipment';
import { Job, JobTemplateReplacements } from '../../types/jobs';
import { WorldTendencyTypes } from '../../types/world';
import {
    getCurrencyName,
    giveCurrencyToUser,
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
    const characterName = await getCharacterName(username);
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

    return `${characterName} received: ${rewards.join(', ')}`;
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
        name: await getCharacterName(username),
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
    itemReward: StorableItems | null
) {
    const jobMessage = `@${username}: ${messageTemplate}`;
    const rewards = await rpgJobMessageLootTemplate(
        username,
        moneyReward,
        itemReward
    );

    const message = await rpgJobMessageTemplateReplacement(
        username,
        `${jobMessage} ${rewards}.`
    );

    return message;
}

export async function rpgJobCommand(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const selectJob: Job = jobList[Math.floor(Math.random() * jobList.length)];
    let itemGiven = null;

    if (selectJob.encounter) {
        // TODO: Add an encounter system.
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
    const jobMessage = await rpgJobMessageBuilder(
        username,
        selectJob.template,
        currencyGiven,
        itemGiven
    );

    // Send our message template for this job to chat.
    sendChatMessage(jobMessage);
}
