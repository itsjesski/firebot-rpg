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
                    id: 'fbrpg:rpg-stats',
                    usage: 'stats',
                    name: '!rpg stats',
                    description: 'Shows the stats of your world.',
                    active: true,
                    trigger: 'stats',
                    arg: 'stats',
                }
            ],
            fallbackSubcommand: undefined,
        },
        onTriggerEvent: function (event: SystemCommandTriggerEvent): void | PromiseLike<void> {
            // TODO:
        }
    });
    
}