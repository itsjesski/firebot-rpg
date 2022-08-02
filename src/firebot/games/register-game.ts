import { RunRequest, ScriptModules } from "@crowbartools/firebot-custom-scripts-types";
import { SettingCategoryDefinition } from "@crowbartools/firebot-custom-scripts-types/types/modules/game-manager";
import { setupRPG } from "../../systems/setup";
import { registerCommands } from "../commands/register-commands";

const gameSettings: Record<string, SettingCategoryDefinition> = {
    generalSettings: {
      title: "General Settings",
      description: "General settings for the RPG.",
      sortRank: 1,
      settings: {
        currencyId: {
          type: "currency-select",
          title: "Currency",
          description: "Which currency to use for this game.",
          tip: "Select the currency players will use throughout the game.",
          default: '',
          sortRank: 1,
          showBottomHr: false,
          validation: {
              required: true
          }
        }
      }
    },
    kingdomSettings: {
      title: "Kingdom Settings",
      description: "Your kingdom settings.",
      sortRank: 2,
      settings: {
        kingdomName: {
          type: "string",
          title: "Name",
          description: "What would you like your game area to be called?",
          tip: "This will be used to reference your game world throughout the game.",
          default: "Firetopia",
          sortRank: 1,
          showBottomHr: false,
          validation: {
            required: true
          }
        },
        kingdomType: {
          type: "string",
          title: "Type",
          description: "What is your game area type?",
          tip: "This just adds flavor. You could have a city, town, village, etc...",
          default: "Kingdom",
          sortRank: 2,
          showBottomHr: false,
          validation: {
            required: true
          }
        },
        kingdomCitizens: {
          type: "string",
          title: "Citizens",
          description: "What type of people inhabit your kingdom?",
          tip: "This just adds flavor. You could have a kingdom of elves, orcs, humans, people, etc...",
          default: "People",
          sortRank: 3,
          showBottomHr: false,
          validation: {
            required: true
          }
        },
      }
    },
  };

export function registerGame(firebotRequest : RunRequest<any>): void {
  const { logger, gameManager } = firebotRequest.modules;
  logger.info("Starting Firebot RPG...");

  gameManager.registerGame({
    id: 'fbrpg',
    name: 'Firebot RPG',
    subtitle: 'A chat based RPG',
    description: 'An RPG entirely driven by Firebot and your chat.',
    icon: 'fa-swords',
    settingCategories: gameSettings,
    onLoad: () => {
      setupRPG(firebotRequest);
      registerCommands(firebotRequest);
      
    },
    onUnload: () => {},
    onSettingsUpdate: () => {},
  })
}