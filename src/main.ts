import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { registerRPG } from "./firebot/games/register-game";
import { setFirebot } from "./firebot/firebot";

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
    // Set our run request variable for use throughout the app.
    setFirebot(runRequest);

    // Register the game in Firebot.
    registerRPG();
  },
};

export default script;
