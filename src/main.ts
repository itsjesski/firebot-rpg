import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { registerGame } from "./firebot/games/register-game";
import { setFirebot } from "./systems/utils";

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
    registerGame();
  },
};

export default script;
