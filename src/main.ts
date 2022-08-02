import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { registerGame } from "./firebot/games/register-game";


const script: Firebot.CustomScript<{}> = {
  getScriptManifest: () => {
    return {
      name: "Firebot RPG",
      description: "A chat based RPG.",
      author: "Firebottle",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {return {};},
  run: (runRequest) => {
    registerGame(runRequest);
  },
};

export default script;
