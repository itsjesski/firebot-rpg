import { RunRequest } from "@crowbartools/firebot-custom-scripts-types";
import { registerCommands } from "../firebot/commands/register-commands";
import { verifyWorld } from "./world";

/**
 * Handles setting up the RPG on initial load, as well as verifying core game data is correct.
 * @param firebotRequest 
 */
export function setupRPG(firebotRequest : RunRequest<any>){
    verifyWorld(firebotRequest);
    registerCommands(firebotRequest);
}