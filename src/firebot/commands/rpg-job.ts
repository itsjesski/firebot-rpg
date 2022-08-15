import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList } from '../../data/jobs';
import { getFullItemName, getItemByID } from '../../systems/equipment/helpers';
import { generateWeaponForUser } from '../../systems/equipment/weapons';
import { equipItemOnUser, getCharacterName } from '../../systems/user/user';
import { addOrSubtractRandomPercentage, capitalize } from '../../systems/utils';
import { StoredArmor, StoredWeapon } from '../../types/equipment';
import { Job } from '../../types/jobs';
import {
    getCurrencyName,
    giveCurrencyToUser,
    logger,
    sendChatMessage,
} from '../firebot';

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

async function rpgJobMessageBuilder(
    username: string,
    messageTemplate: string,
    moneyReward: number,
    itemReward: StoredWeapon | StoredArmor | null
) {
    const currencyName = getCurrencyName();
    const characterName = await getCharacterName(username);
    let jobMessage = `@${username}: ${messageTemplate}`;

    // If they got currency, add that to the reward message.
    if (moneyReward > 0) {
        jobMessage = `${jobMessage} ${characterName} received: ${moneyReward} ${currencyName.toLowerCase()}`;
    }

    // If they got a reward item, add that to the reward message.
    if (itemReward != null) {
        const rewardItem = getItemByID(itemReward.id, itemReward.itemType);
        const itemName = getFullItemName(itemReward);
        jobMessage = `${jobMessage} and a ${capitalize(
            rewardItem.rarity
        )} ${itemName}`;
    }

    return jobMessage;
}

async function rpgLootGenerator(
    username: string,
    job: Job
): Promise<StoredWeapon | StoredArmor> {
    const lootType = job.loot.item.itemType;
    let loot;

    logger('debug', `Generating loot for ${username}`);

    switch (lootType) {
        case 'weapon':
            loot = await generateWeaponForUser(username, job.loot.item.rarity);
            break;
        case 'armor':
            break;
        default:
    }

    return loot;
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
        itemGiven = await rpgLootGenerator(username, selectJob);
        equipItemOnUser(username, itemGiven, 'backpack');
    }

    // Create our response message.
    const jobMessage = await rpgJobMessageBuilder(
        username,
        selectJob.template,
        currencyGiven,
        itemGiven
    );

    // TODO: Add result to the world tendency pool.

    // Send our message template for this job to chat.
    sendChatMessage(jobMessage);
}
