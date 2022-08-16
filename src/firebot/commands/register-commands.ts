import {
    SubCommand,
    SystemCommandTriggerEvent,
} from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';

import { verifyCharacter } from '../../systems/user/user';
import { logger, registerSystemCommand } from '../firebot';
import { rpgEquipCommand } from './rpg-equip';
import { rpgJobCommand } from './rpg-job';
import { rpgNameCommand } from './rpg-name';
import { rpgStatsCommand } from './rpg-stats';
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
                global: 60,
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-stats',
            usage: 'stats',
            name: '!rpg stats',
            description: 'Shows the stats of your character.',
            active: true,
            trigger: 'stats',
            arg: 'stats',
            cooldown: {
                global: 0,
                user: 30,
            },
        },
        {
            id: 'fbrpg:rpg-name',
            usage: 'name',
            name: '!rpg name',
            description: 'Lets you change your character name.',
            active: true,
            trigger: 'name',
            arg: 'name',
            cooldown: {
                global: 0,
                user: 120,
            },
        },
        {
            id: 'fbrpg:rpg-equip',
            usage: 'equip',
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
                user: 60,
            },
        },
        {
            id: 'fbrpg:rpg-shop',
            usage: 'shop',
            name: '!rpg shop',
            description: 'Lists out items currently available in the shop.',
            active: true,
            trigger: 'shop',
            arg: 'shop',
            cooldown: {
                global: 0,
                user: 30,
            },
        },
        {
            id: 'fbrpg:rpg-shop-buy',
            usage: 'shop-buy [number]',
            name: '!rpg shop-buy',
            description: 'Buys the item in the designated shop slot.',
            active: true,
            trigger: 'shop-buy',
            arg: 'shop-buy',
            cooldown: {
                global: 0,
                user: 30,
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
            await verifyCharacter(userCommand);

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
                case 'shop': {
                    // TODO: Implement
                    break;
                }
                case 'shop-buy': {
                    // TODO: Implement
                    break;
                }
                // eslint-disable-next-line no-empty
                default: {
                }
            }
        },
    });
}
