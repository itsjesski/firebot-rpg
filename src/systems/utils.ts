import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { GameSettings } from "../firebot/games/register-game";

let firebot : RunRequest<any> | null = null;

export function setFirebot(firebotRequest : RunRequest<any>){
    firebot = firebotRequest;
}

export function getFirebot() : RunRequest<any>{
    return firebot;
}

export function getStreamerUsername(){
    const firebot = getFirebot();
    return firebot.firebot.accounts.streamer.username;
}

export function getAllGameSettings() : GameSettings | null{
    const firebot = getFirebot();
    const {gameManager, logger} = firebot.modules;
    const settings = gameManager.getGameSettings('fbrpg');
    return settings.settings as GameSettings;
}