import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";

export function getStreamerUsername(firebotRequest : RunRequest<any>){
    return firebotRequest.firebot.accounts.streamer.username;
}