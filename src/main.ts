import { Firebot } from "firebot-custom-scripts-types";
import { registerGame } from "./firebot/games/register-game";

interface Params {
  message: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name: "Firebot RPG",
      description: "A chat based RPG.",
      author: "Firebottle",
      version: "1.0",
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      message: {
        type: "string",
        default: "REMOVE ME",
        description: "Welcome!",
        secondaryDescription: "Typescript seems to require that I have this here.",
      },
    };
  },
  run: (runRequest) => {
    const { logger, gameManager} = runRequest.modules;
    logger.info("Starting Firebot RPG...");

    registerGame(gameManager);
  },
};

export default script;
