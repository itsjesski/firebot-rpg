import {
    SubCommand,
    SystemCommandTriggerEvent,
} from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';

import { verifyUser } from '../../systems/user/user';
import { logger, registerSystemCommand } from '../firebot';
import { rpgBlacksmithCommand } from './rpg-blacksmith';
import { rpgEnchanterCommand } from './rpg-enchanter';
import { rpgEquipCommand } from './rpg-equip';
import { rpgHealerCommand } from './rpg-healer';
import { rpgJobCommand } from './rpg-job';
import { rpgNameCommand } from './rpg-name';
import { rpgShopCommand } from './rpg-shop';
import { rpgStatsCommand } from './rpg-stats';
import { rpgTrainerCommand } from './rpg-trainer';
import { worldCommand } from './rpg-world';

function getSubCommands(): SubCommand[] {
    return [
        {
            id: 'fbrpg:rpg-world',
            usage: 'world',
            name: '!rpg world',
            description: 'Shows the stats of your world.',
            active: true,
            trigger: 'world',
            arg: 'world',
            cooldown: {
                global: 120,
                user: 0,
            },
        },
        {
            id: 'fbrpg:rpg-stats',
            usage: 'stats [slot]',
            name: '!rpg stats',
            description: 'Shows the stats of your character.',
            active: true,
            trigger: 'stats',
            arg: 'stats',
            cooldown: {
                global: 0,
                user: 10,
            },
        },
        {
            id: 'fbrpg:rpg-name',
            usage: 'name [name]',
            name: '!rpg name',
            description: 'Lets you change your character name.',
            active: true,
            trigger: 'name',
            arg: 'name',
            cooldown: {
                global: 0,
                user: 3600,
            },
        },
        {
            id: 'fbrpg:rpg-equip',
            usage: 'equip [slot]',
            name: '!rpg equip',
            description: 'Equips the currently held item.',
            active: true,
            trigger: 'equip',
            arg: 'equip',
            cooldown: {
                global: 0,
                user: 30,
            },
        },
        {
            id: 'fbrpg:rpg-job',
            usage: 'job',
            name: '!rpg job',
            description: 'Sends the player off on a job.',
            active: true,
            trigger: 'job',
            arg: 'job',
            cooldown: {
                global: 0,
                user: 120,
            },
        },
        {
            id: 'fbrpg:rpg-healer',
            usage: 'healer',
            name: '!rpg healer',
            description: 'A healer will heal the player.',
            active: true,
            trigger: 'healer',
            arg: 'healer',
            cooldown: {
                global: 0,
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-enchanter',
            usage: 'enchanter [slot] [element]',
            name: '!rpg enchanter',
            description:
                'Players can enchant their items with specific elements.',
            active: true,
            trigger: 'enchanter',
            arg: 'enchanter',
            cooldown: {
                global: 0,
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-blacksmith',
            usage: 'blacksmith [slot]',
            name: '!rpg blacksmith',
            description: 'Players can improve their items at the blacksmith.',
            active: true,
            trigger: 'blacksmith',
            arg: 'blacksmith',
            cooldown: {
                global: 0,
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-trainer',
            usage: 'trainer [attribute]',
            name: '!rpg trainer',
            description:
                'Players can improve their stats by visiting a trainer.',
            active: true,
            trigger: 'trainer',
            arg: 'trainer',
            cooldown: {
                global: 0,
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-shop',
            usage: 'shop',
            name: '!rpg shop',
            description: 'Players can shop for specific items.',
            active: true,
            trigger: 'shop',
            arg: 'shop',
            cooldown: {
                global: 0,
                user: 60,
            },
        },
    ];
}

export function registerCommands() {
    const subCommandUsages = getSubCommands().map((a) => a.name);

    registerSystemCommand({
        definition: {
            id: 'fbrpg:rpg',
            name: 'Firebot RPG',
            description: 'Allows users to play the RPG.',
            baseCommandDescription: 'Shows RPG commands.',
            active: true,
            trigger: '!rpg',
            sortTags: ['rpg'],
            effects: {
                list: [
                    {
                        chatter: 'Bot',
                        message: `Try these rpg commands: ${subCommandUsages.join(
                            ', '
                        )}.`,
                        type: 'firebot:chat',
                    },
                ],
            },
            restrictionData: {
                mode: 'any',
                sendFailMessage: true,
                failMessage:
                    'Sorry, you could not use this command because {reason}.',
                restrictions: [],
            },
            subCommands: getSubCommands(),
        },
        async onTriggerEvent(event: SystemCommandTriggerEvent) {
            const { userCommand } = event;
            const { args } = userCommand;

            // Base !rpg command was used.
            if (args.length === 0) {
                return;
            }

            // Verify the user has a character build before running any other command.
            await verifyUser(userCommand);

            // Now, parse the subcommand.
            const commandUsed = args[0];
            logger(
                'debug',
                `${userCommand.commandSender} tried to use the ${commandUsed} command.`
            );

            switch (commandUsed) {
                case 'world': {
                    worldCommand();
                    break;
                }
                case 'stats': {
                    rpgStatsCommand(userCommand);
                    break;
                }
                case 'equip': {
                    rpgEquipCommand(userCommand);
                    break;
                }
                case 'job': {
                    rpgJobCommand(userCommand);
                    break;
                }
                case 'name': {
                    rpgNameCommand(userCommand);
                    break;
                }
                case 'healer': {
                    rpgHealerCommand(userCommand);
                    break;
                }
                case 'enchanter': {
                    rpgEnchanterCommand(userCommand);
                    break;
                }
                case 'blacksmith': {
                    rpgBlacksmithCommand(userCommand);
                    break;
                }
                case 'trainer': {
                    rpgTrainerCommand(userCommand);
                    break;
                }
                case 'shop': {
                    rpgShopCommand(userCommand);
                    break;
                }
                // eslint-disable-next-line no-empty
                default: {
                }
            }
        },
    });
}
