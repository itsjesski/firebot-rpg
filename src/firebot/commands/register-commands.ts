import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { CommandManager, SystemCommandTriggerEvent } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";

function getSubCommands(){
    return [
        {
            id: 'fbrpg:rpg-world',
            usage: 'world',
            name: '!rpg world',
            description: 'Shows the stats of your world.',
            active: true,
            trigger: 'world',
            arg: 'world',
        },
        {
            id: 'fbrpg:rpg-stats',
            usage: 'stats',
            name: '!rpg stats',
            description: 'Shows the stats of your character.',
            active: true,
            trigger: 'stats',
            arg: 'stats',
        },
        {
            id: 'fbrpg:rpg-inv',
            usage: 'inv',
            name: '!rpg inv',
            description: 'Shows the equipment of your character.',
            active: true,
            trigger: 'inv',
            arg: 'inv',
        },
        {
            id: 'fbrpg:rpg-held',
            usage: 'held',
            name: '!rpg held',
            description: 'Shows info on the currently held item.',
            active: true,
            trigger: 'held',
            arg: 'held',
        },
        {
            id: 'fbrpg:rpg-equip',
            usage: 'equip',
            name: '!rpg equip',
            description: 'Equips the currently held item.',
            active: true,
            trigger: 'equip',
            arg: 'equip',
        },
        {
            id: 'fbrpg:rpg-adventure',
            usage: 'adventure',
            name: '!rpg adventure',
            description: 'Sends the player off on an adventure.',
            active: true,
            trigger: 'adventure',
            arg: 'adventure',
        },
        {
            id: 'fbrpg:rpg-shop',
            usage: 'shop',
            name: '!rpg shop',
            description: 'Lists out items currently available in the shop.',
            active: true,
            trigger: 'shop',
            arg: 'shop',
        },
        {
            id: 'fbrpg:rpg-shop-sell',
            usage: 'shop-sell',
            name: '!rpg shop-sell',
            description: 'Sells the currently held item to the shop for money.',
            active: true,
            trigger: 'shop-sell',
            arg: 'shop-sell',
        },
        {
            id: 'fbrpg:rpg-shop-buy',
            usage: 'shop-buy [number]',
            name: '!rpg shop-buy',
            description: 'Buys the item in the designated shop slot.',
            active: true,
            trigger: 'shop-buy',
            arg: 'shop-buy',
            minArg: 2,
        },
        {
            id: 'fbrpg:rpg-shop-donate',
            usage: 'shop-donate',
            name: '!rpg shop-donate',
            description: 'Donates the currently held item to the kingdom.',
            active: true,
            trigger: 'shop-donate',
            arg: 'shop-donate',
        },
    ];
}

export function registerCommands(commandManager : CommandManager, firebotModules: ScriptModules){

    const subCommandUsages = getSubCommands().map(a => a.name);
    
    commandManager.registerSystemCommand({
        definition: {
            id: "fbrpg:rpg",
            name: "Firebot RPG",
            description: "Allows users to play the RPG.",
            baseCommandDescription: "Shows RPG commands.",
            active: true,
            trigger: "!rpg",
            sortTags: ['rpg'],
            effects: {
                list: [
                    {
                        "chatter": "Bot",
                        "message": `Try these rpg commands: ${subCommandUsages.join(', ')}.`,
                        "type": "firebot:chat",
                    }
                ]
            },
            restrictionData: {
                mode: "any",
                sendFailMessage: true,
                failMessage: "Sorry, you could not use this command because {reason}.",
                restrictions: []
            },
            subCommands: getSubCommands()
        },
        onTriggerEvent: function (event: SystemCommandTriggerEvent): void | PromiseLike<void> {
            const { commandOptions, userCommand } = event;
            const args = userCommand.args;

            // Base !rpg command was used.
            if(args.length === 0){
                return;
            }

            const commandUsed = args[0];
            switch(commandUsed) {
                case "world": {
                    // TODO: Implement
                    return;
                }
                case "stats": {
                    // TODO: Implement
                    return;
                }
                case "inv": {
                    // TODO: Implement
                    return;
                }
                case "held": {
                    // TODO: Implement
                    return;
                }
                case "equip": {
                    // TODO: Implement
                    return;
                }
                case "adventure": {
                    // TODO: Implement
                    return;
                }
                case "shop": {
                    // TODO: Implement
                    return;
                }
                case "shop-sell": {
                    // TODO: Implement
                    return;
                }
                case "shop-buy": {
                    // TODO: Implement
                    return;
                }
                case "shop-donate": {
                    // TODO: Implement
                    return;
                }
                default: {
                    // TODO: Implement
                    return;
                }
            }
        }
    });
    
}