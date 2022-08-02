import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { verifyWorld } from "./world";

export function setupRPG(firebotRequest : RunRequest<any>){
    verifyWorld(firebotRequest);

}