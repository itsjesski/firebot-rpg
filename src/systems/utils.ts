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

export async function getNumberOfOnlineUsers(){
    const firebot = getFirebot();
    const {userDb} = firebot.modules;
    const onlineUsers = await userDb.getOnlineUsers();
    return onlineUsers.length;
}

export async function getStreamOnlineStatus(){
    const streamerName = getStreamerUsername();
    const streamOnline = await firebot.modules.twitchApi.channels.getOnlineStatus(streamerName);
    return streamOnline;
}

export function getPercentage(a : number, b : number) : number{
  return ( a * b ) / 100;
}