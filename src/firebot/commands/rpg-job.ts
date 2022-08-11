import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { jobList, Job } from '../../data/jobs';
import { sendChatMessage } from '../firebot';

export function rpgJob(userCommand: UserCommand) {
    const username = userCommand.commandSender;
    const selectJob: Job = jobList[Math.floor(Math.random() * jobList.length)];
    sendChatMessage(`@${username}: ${selectJob.template}`);
}
