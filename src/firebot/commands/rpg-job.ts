import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList, Job } from '../../data/jobs';
import { addOrSubtractRandomPercentage } from '../../systems/utils';
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

export async function rpgJob(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const selectJob: Job = jobList[Math.floor(Math.random() * jobList.length)];

    if (selectJob.encounter) {
        // TODO: Add an encounter system.
    }

    // Give currency to the user if this job rewards that.
    const currencyGiven = await giveJobCurrencyReward(selectJob, username);

    // Create our response message.
    const jobMessage = rpgJobMessageBuilder(
        username,
        selectJob.template,
        currencyGiven
    );

    // Send our message template for this job to chat.
    sendChatMessage(jobMessage);
}
