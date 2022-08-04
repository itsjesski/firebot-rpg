import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { GameSettings } from "../firebot/games/register-game";

export function getStreamerUsername(firebotRequest : RunRequest<any>){
    return firebotRequest.firebot.accounts.streamer.username;
}

export function getAllGameSettings(firebotRequest : RunRequest<any>) : GameSettings | null{
    const settings = firebotRequest.modules.gameManager.getGameSettings('fbrpg');
    // @ts-ignore : Settings returned from firebot.
    return settings;
}