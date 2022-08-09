import { RunRequest } from '@crowbartools/firebot-custom-scripts-types';
import { SystemCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { FirebotGame } from '@crowbartools/firebot-custom-scripts-types/types/modules/game-manager';

import { GameSettings } from '../types/game';
import { Character } from '../types/user';
import { WorldStats } from '../types/world';

let firebot: RunRequest<any> | null = null;

export function setFirebot(firebotRequest: RunRequest<any>): void {
    firebot = firebotRequest;
}

export function getStreamerUsername(): string {
    return firebot.firebot.accounts.streamer.username;
}

export async function getNumberOfOnlineUsers(): Promise<number> {
    const { userDb } = firebot.modules;
    const onlineUsers = await userDb.getOnlineUsers();
    return onlineUsers.length;
}

export async function getStreamOnlineStatus(): Promise<boolean> {
    const streamerName = getStreamerUsername();
    const streamOnline =
        await firebot.modules.twitchApi.channels.getOnlineStatus(streamerName);
    return streamOnline;
}

export function sendChatMessage(
    message: string,
    whisperTarget?: string | null,
    accountType?: 'bot' | 'streamer'
): void {
    firebot.modules.twitchChat.sendChatMessage(
        message,
        whisperTarget,
        accountType
    );
}

export function registerSystemCommand(systemCommand: SystemCommand): void {
    const { commandManager } = firebot.modules;
    commandManager.registerSystemCommand(systemCommand);
}

export function registerGame(gameDefinition: FirebotGame): void {
    const { gameManager } = firebot.modules;
    gameManager.registerGame(gameDefinition);
}

export function getGameSettings(): GameSettings | null {
    const { gameManager } = firebot.modules;
    const settings = gameManager.getGameSettings('fbrpg');
    return settings.settings as GameSettings;
}

export async function getWorldMeta(): Promise<WorldStats> {
    const { userDb } = firebot.modules;
    const streamer = getStreamerUsername();
    const worldMeta = await userDb.getUserMetadata(streamer, 'fbrpg-world');
    return worldMeta;
}

export async function updateWorldMeta(
    value: any,
    property?: string
): Promise<void> {
    const { userDb } = firebot.modules;
    const streamer = getStreamerUsername();
    if (property != null) {
        await userDb.updateUserMetadata(
            streamer,
            'fbrpg-world',
            value,
            property
        );
    }
    await userDb.updateUserMetadata(streamer, 'fbrpg-world', value);
}

export async function getCharacterMeta(username: string): Promise<Character> {
    const { userDb } = firebot.modules;
    const characterMeta = await userDb.getUserMetadata(
        username,
        'fbrpg-character'
    );
    return characterMeta;
}

export async function updateCharacterMeta(
    userName: string,
    value: any,
    property?: string
): Promise<void> {
    const { userDb } = firebot.modules;
    await userDb.updateUserMetadata(
        userName,
        'fbrpg-character',
        value,
        property
    );
}

export function logger(type: string, message: string): void {
    const fblogger = firebot.modules.logger;

    switch (type) {
        case 'debug':
            fblogger.debug(`FBRPG: ${message}`);
            break;
        case 'error':
            fblogger.error(`FBRPG: ${message}`);
            break;
        case 'warn':
            fblogger.warn(`FBRPG: ${message}`);
            break;
        default:
            fblogger.info(`FBRPG: ${message}`);
    }
}
