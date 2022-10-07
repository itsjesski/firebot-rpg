import { SettingCategoryDefinition } from '@crowbartools/firebot-custom-scripts-types/types/modules/game-manager';
import { startGameCycle } from '../../systems/cycle';
import { formatDate } from '../../systems/utils';

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
            resetId: {
                type: 'string',
                title: 'Reset ID',
                description: 'This id is set on all characters when created.',
                tip: 'If a character does not have this reset id, then they will be reset the next time they run a command. Change this to reset the game.',
                default: formatDate(new Date()),
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
            cycleTime: {
                type: 'string',
                title: 'Cycle Time',
                description:
                    'How many seconds should each world cycle be? Changing this requires you restart Firebot.',
                tip: 'This is the timer used for each "round" of the game. Extending this time will slow down how often world stats change.',
                default: 60,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            name: {
                type: 'string',
                title: 'Name',
                description: 'What would you like your game area to be called?',
                tip: 'This will be used to reference your game world throughout the game.',
                default: 'Firetopia',
                sortRank: 2,
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
                sortRank: 3,
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
                sortRank: 4,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
        },
    },
    creatureSettings: {
        title: 'Creature Settings',
        description:
            'Settings related to the creatures and monsters in the world.',
        sortRank: 3,
        settings: {
            easyMinHP: {
                type: 'number',
                title: 'Easy Creature Min Health',
                description:
                    'This is the minimum health of an "easy" rank creature.',
                tip: 'Setting this higher makes "easy" rank creatures more difficult.',
                default: 10,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            mediumMinHP: {
                type: 'number',
                title: 'Medium Creature Min Health',
                description:
                    'This is the minimum health of an "medium" rank creature.',
                tip: 'Setting this higher makes "medium" rank creatures more difficult.',
                default: 50,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            hardMinHP: {
                type: 'number',
                title: 'Hard Creature Min Health',
                description:
                    'This is the minimum health of an "hard" rank creature.',
                tip: 'Setting this higher makes "hard" rank creatures more difficult.',
                default: 100,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            legendaryMinHP: {
                type: 'number',
                title: 'Legendary Creature Min Health',
                description:
                    'This is the minimum health of an "legendary" rank creature.',
                tip: 'Setting this higher makes "legendary" rank creatures more difficult.',
                default: 200,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            mediumGuildLevel: {
                type: 'number',
                title: 'Guild Level - Medium Difficulty',
                description:
                    'This is the guild level needed to get medium difficulty missions.',
                tip: '',
                default: 2,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            hardGuildLevel: {
                type: 'number',
                title: 'Guild Level - Hard Difficulty',
                description:
                    'This is the guild level needed to get hard difficulty missions.',
                tip: '',
                default: 4,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            legendaryGuildLevel: {
                type: 'number',
                title: 'Guild Level - Legendary Difficulty',
                description:
                    'This is the guild level needed to get legendary difficulty missions.',
                tip: '',
                default: 6,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
        },
    },
    shops: {
        title: 'Shops',
        description: 'Settings related to the shops',
        sortRank: 4,
        settings: {
            refinementBaseCost: {
                type: 'number',
                title: 'Refinement Base Cost',
                description:
                    'The lower this is the cheaper refinements will be.',
                tip: 'This is the base cost of a refinement.',
                default: 500,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            refinementMultiplier: {
                type: 'number',
                title: 'Refinement Cost Multiplier',
                description:
                    'This is a percentage of how much more each refinement level will cost than the last.',
                tip: 'Each refinement will be this much more than the last. Keep this at zero to keep costs the same, otherwise they get progressively more expensive.',
                default: 25,
                sortRank: 2,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            refinementsPerLevel: {
                type: 'number',
                title: 'Refinement Limit',
                description:
                    'This is the number of refinements someone can have per blacksmith level.',
                tip: 'The lower this is, the slower the power creep in the game.',
                default: 5,
                sortRank: 3,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            enchantmentBaseCost: {
                type: 'number',
                title: 'Enchantment Base Cost',
                description:
                    'The lower this is the cheaper enchantments will be.',
                tip: 'This is the base cost of a enchantments.',
                default: 500,
                sortRank: 4,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            enchantmentMultiplier: {
                type: 'number',
                title: 'Enchantment Cost Multiplier',
                description:
                    'This is a percentage of how much more each enchantment level will cost than the last.',
                tip: 'Each enchantment will be this much more than the last. Keep this at zero to keep costs the same, otherwise they get progressively more expensive.',
                default: 25,
                sortRank: 5,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            enchantmentsPerLevel: {
                type: 'number',
                title: 'Enchantment Limit',
                description:
                    'This is the number of enchantment someone can have per enchanter level.',
                tip: 'The lower this is, the slower the power creep in the game.',
                default: 5,
                sortRank: 2,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            trainingBaseCost: {
                type: 'number',
                title: 'Training Base Cost',
                description:
                    'The lower this is the cheaper stat training will be.',
                tip: 'This is the base cost of a stat training.',
                default: 500,
                sortRank: 4,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            trainingMultiplier: {
                type: 'number',
                title: 'Training Cost Multiplier',
                description:
                    'This is a percentage of how much more each training level will cost than the last.',
                tip: 'Each training will be this much more than the last. Keep this at zero to keep costs the same, otherwise they get progressively more expensive.',
                default: 25,
                sortRank: 5,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            trainingsPerLevel: {
                type: 'number',
                title: 'Training Limit',
                description:
                    'This is the number of trainings someone can have per trainer level.',
                tip: 'The lower this is, the slower the power creep in the game.',
                default: 5,
                sortRank: 6,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
        },
    },
    combatSettings: {
        title: 'Combat Settings',
        description: 'Settings related to combat.',
        sortRank: 5,
        settings: {
            duelTimeout: {
                type: 'number',
                title: 'Duel Timeout',
                description:
                    'This is the number of minutes that must pass before a duel request times out.',
                tip: 'New duels can not be issued to someone until the previous duel times out.',
                default: 2,
                sortRank: 1,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            offHandMissChance: {
                type: 'number',
                title: 'Off hand fumble chance',
                description:
                    'If a weapon or spell is in the off hand and is not "light", this is the fumble chance (skipped turn).',
                tip: 'Setting this lower makes off hand weapons stronger in melee.',
                default: 25,
                sortRank: 2,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            rangedInMeleePenalty: {
                type: 'number',
                title: 'Ranged in melee fumble chance',
                description:
                    'If a ranged weapon is used in melee, this is the fumble chance (skipped turn).',
                tip: 'Setting this lower makes ranged weapons stronger in melee.',
                default: 25,
                sortRank: 3,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            hitBonus: {
                type: 'number',
                title: 'Hit bonus',
                description:
                    'Divide character stats by this number to determine hit bonus',
                tip: 'The lower this number, the higher the hit bonus. This will make characters hit more often.',
                default: 10,
                sortRank: 4,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            damageBonus: {
                type: 'number',
                title: 'Damage bonus',
                description:
                    'Divide character stats by this number to determine damage bonus',
                tip: 'The lower this number, the higher the damage bonus. This will make characters deal more damage.',
                default: 10,
                sortRank: 5,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            heavyMovementSpeed: {
                type: 'number',
                title: 'Heavy Armor Movement',
                description:
                    'This is how fast a character moves in heavy armor.',
                tip: 'The higher this number, the faster heavy armor characters will approach in the ranged phase of combat.',
                default: 30,
                sortRank: 6,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            mediumMovementSpeed: {
                type: 'number',
                title: 'Medium Armor Movement',
                description:
                    'This is how fast a character moves in medium armor.',
                tip: 'The higher this number, the faster medium armor characters will approach in the ranged phase of combat.',
                default: 40,
                sortRank: 7,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            lightMovementSpeed: {
                type: 'number',
                title: 'Light Armor Movement',
                description:
                    'This is how fast a character moves in light armor.',
                tip: 'The higher this number, the faster light armor characters+ will approach in the ranged phase of combat.',
                default: 50,
                sortRank: 8,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            nakedMovementSpeed: {
                type: 'number',
                title: 'Unarmored Movement',
                description:
                    'This is how fast a character moves with no armor.',
                tip: 'The higher this number, the faster unarmored characters will approach in the ranged phase of combat.',
                default: 50,
                sortRank: 9,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            heavyDexBonus: {
                type: 'number',
                title: 'Heavy Dex Bonus',
                description:
                    'Percent of dex used when calculating bonus AC for this armor type.',
                tip: 'The higher this number, the better this armor type becomes.',
                default: 25,
                sortRank: 10,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            mediumDexBonus: {
                type: 'number',
                title: 'Medium Dex Bonus',
                description:
                    'Percent of dex used when calculating bonus AC for this armor type.',
                tip: 'The higher this number, the better this armor type becomes.',
                default: 50,
                sortRank: 11,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            lightDexBonus: {
                type: 'number',
                title: 'Light Dex Bonus',
                description:
                    'Percent of dex used when calculating bonus AC for this armor type.',
                tip: 'The higher this number, the better this armor type becomes.',
                default: 75,
                sortRank: 12,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            nakedDexBonus: {
                type: 'number',
                title: 'Unarmored Dex Bonus',
                description:
                    'Percent of dex used when calculating bonus AC for this armor type.',
                tip: 'The higher this number, the better this armor type becomes.',
                default: 100,
                sortRank: 13,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            heavyArcaneFailure: {
                type: 'number',
                title: 'Heavy Arcane Failure',
                description:
                    'Percent chance a spell will fail to cast when wearing this type of armor.',
                tip: 'Lower numbers makes this armor better for spell users.',
                default: 50,
                sortRank: 10,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            mediumArcaneFailure: {
                type: 'number',
                title: 'Medium Arcane Failure',
                description:
                    'Percent chance a spell will fail to cast when wearing this type of armor.',
                tip: 'Lower numbers makes this armor better for spell users.',
                default: 30,
                sortRank: 10,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            lightArcaneFailure: {
                type: 'number',
                title: 'Light Arcane Failure',
                description:
                    'Percent chance a spell will fail to cast when wearing this type of armor.',
                tip: 'Lower numbers makes this armor better for spell users.',
                default: 0,
                sortRank: 10,
                showBottomHr: false,
                validation: {
                    required: true,
                },
            },
            nakedArcaneFailure: {
                type: 'number',
                title: 'Unarmored Arcane Failure',
                description:
                    'Percent chance a spell will fail to cast when wearing this type of armor.',
                tip: 'Lower numbers makes this armor better for spell users.',
                default: 0,
                sortRank: 10,
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
        onLoad: async () => {
            registerCommands();
            await verifyWorld();
            await startGameCycle();
        },
        onUnload: () => {},
        onSettingsUpdate: () => {
            verifyWorld();
        },
    });
}
