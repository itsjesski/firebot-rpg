import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";

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

