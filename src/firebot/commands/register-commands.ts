import { ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { CommandManager, SystemCommandTriggerEvent } from "@crowbartools/firebot-custom-scripts-types/types/modules/command-manager";

export function registerCommands(commandManager : CommandManager, firebotModules: ScriptModules){
    
    commandManager.registerSystemCommand({
        definition: {
            id: "fbrpg:rpg",
            name: "Firebot RPG",
            description: "Allows users to play the RPG.",
            baseCommandDescription: "Shows RPG commands.",
            active: true,
            trigger: "!rpg",
            cooldown: {
                global: 0,
                user: 0
            },
            sendCooldownMessage: true,
            sortTags: ['rpg'],
            effects: {
                list: [
                    {
                        "chatter": "Bot",
                        "message": "Try these !rpg commands: !rpg",
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
            subCommands: [
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
            ]
        },
        onTriggerEvent: function (event: SystemCommandTriggerEvent): void | PromiseLike<void> {
            // TODO:
        }
    });
    
}