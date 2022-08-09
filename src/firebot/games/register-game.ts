import { SettingCategoryDefinition } from '@crowbartools/firebot-custom-scripts-types/types/modules/game-manager';

import { verifyWorld } from '../../systems/world/world-stats';
import { registerCommands } from '../commands/register-commands';
import { logger, registerGame } from '../firebot';

const gameSettings: Record<string, SettingCategoryDefinition> = {
    generalSettings: {
        title: 'General Settings',
        description: 'General settings for the RPG.',
        sortRank: 1,
        settings: {
            currencyId: {
                type: 'currency-select',
                title: 'Currency',
                description: 'Which currency to use for this game.',
                tip: 'Select the currency players will use throughout the game.',
                default: '',
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
        },
    },
    worldSettings: {
        title: 'World Settings',
        description: 'Your world settings.',
        sortRank: 2,
        settings: {
            name: {
                type: 'string',
                title: 'Name',
                description: 'What would you like your game area to be called?',
                tip: 'This will be used to reference your game world throughout the game.',
                default: 'Firetopia',
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            type: {
                type: 'string',
                title: 'Type',
                description: 'What is your game area type?',
                tip: 'This just adds flavor. You could have a city, town, village, etc...',
                default: 'Kingdom',
                sortRank: 2,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            citizens: {
                type: 'string',
                title: 'Citizens',
                description: 'What type of people inhabit your kingdom?',
                tip: 'This just adds flavor. You could have a kingdom of elves, orcs, humans, people, etc...',
                default: 'People',
                sortRank: 3,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
        },
    },
};

export function registerRPG(): void {
    logger('info', 'RPG: Starting Firebot RPG...');

    registerGame({
        id: 'fbrpg',
        name: 'Firebot RPG',
        subtitle: 'A chat based RPG',
        description: 'An RPG entirely driven by Firebot and your chat.',
        icon: 'fa-swords',
        settingCategories: gameSettings,
        onLoad: () => {
            registerCommands();
            verifyWorld();
        },
        onUnload: () => {},
        onSettingsUpdate: () => {
            verifyWorld();
        },
    });
}
