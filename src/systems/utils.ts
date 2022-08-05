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
    const settings = getFirebot().modules.gameManager.getGameSettings('fbrpg');
    // @ts-ignore : Settings returned from firebot.
    return settings;
}