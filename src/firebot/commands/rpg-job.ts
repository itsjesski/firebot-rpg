import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList } from '../../data/jobs';
import { generateWeaponForUser } from '../../systems/equipment/weapons';
import { addOrSubtractRandomPercentage } from '../../systems/utils';
import { StoredArmor, StoredWeapon } from '../../types/equipment';
import { Job } from '../../types/jobs';
import {
    getCurrencyName,
    giveCurrencyToUser,
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

function rpgJobMessageBuilder(
    username: string,
    messageTemplate: string,
    moneyReward: number
) {
    const currencyName = getCurrencyName();
    let jobMessage = `@${username}: ${messageTemplate}`;

    // If they got currency, add that to the reward message.
    if (moneyReward > 0) {
        jobMessage = `${jobMessage} They received ${moneyReward} ${currencyName.toLowerCase()}.`;
    }

    return jobMessage;
}

async function rpgLootGenerator(
    username: string,
    job: Job
): Promise<StoredWeapon | StoredArmor> {
    const lootType = job.loot.item.itemType;
    let loot;

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

export async function rpgJob(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const selectJob: Job = jobList[Math.floor(Math.random() * jobList.length)];

    if (selectJob.encounter) {
        // TODO: Add an encounter system.
    }

    // Give currency to the user if this job rewards that.
    const currencyGiven = await giveJobCurrencyReward(selectJob, username);

    // Generate our loot item if there is one.
    if (selectJob.loot?.item?.itemType != null) {
        // TODO: Pass item to message output, and apply it to the users held slot.
        // eslint-disable-next-line no-unused-vars
        const item = rpgLootGenerator(username, selectJob);
    }

    // Create our response message.
    const jobMessage = rpgJobMessageBuilder(
        username,
        selectJob.template,
        currencyGiven
    );

    // Send our message template for this job to chat.
    sendChatMessage(jobMessage);
}
