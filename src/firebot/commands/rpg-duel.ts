import { UserCommand } from '@crowbartools/firebot-custom-scripts-types/types/modules/command-manager';
import { isDuelExpired, startDuel } from '../../systems/duels/duels';

import { getUserData, getUserName } from '../../systems/user/user';
import { Duel } from '../../types/user';
import { logger, sendChatMessage, setCharacterMeta } from '../firebot';

export async function rpgDuelCommand(userCommand: UserCommand) {
    logger('debug', 'Sending world command.');
    const username = userCommand.commandSender;
    const { args } = userCommand;
    const commandUsed = args[1] as string;
    let challenged = args[2] as string;

    // If user includes @ in username, strip the at symbol.
    if (challenged != null && challenged.charAt(0) === '@') {
        challenged = challenged.substring(1);
    }

    const duel = {
        challenger: null,
        time: null,
    } as Duel;

    const character = await getUserData(username);
    const characterName = await getUserName(username);
    let challengedCharacter = null;
    let duelResults = null;

    switch (commandUsed) {
        case 'challenge':
            // Make sure they gave a name.
            if (challenged == null) {
                sendChatMessage(
                    `@${username}, specify who you want to challenge. EX: !rpg duel challenge @Twitch_Username`
                );
                return;
            }

            // Make sure challenged character exists.
            challengedCharacter = await getUserData(challenged);
            if (challengedCharacter == null) {
                sendChatMessage(
                    `@${username}, user not found or they have no character.`
                );
                return;
            }

            // Check to see if the challenged already has an ongoing duel request.
            if (!isDuelExpired(challengedCharacter.duel.time)) {
                sendChatMessage(
                    `@${username}, user has an ongoing duel request. Try again in a few minutes.`
                );
                return;
            }

            // Create the duel object.
            duel.challenger = username;
            duel.time = Date.now();
            setCharacterMeta(challenged, duel, 'duel');

            // Send our final message.
            sendChatMessage(
                `@${username} & @${challenged}, ${characterName} has challenged ${await getUserName(
                    challenged
                )} to a duel! They have 2 minutes to accept.`
            );

            break;
        case 'accept':
            // Check to see if the challenged already has an ongoing duel request.
            if (isDuelExpired(character.duel.time)) {
                sendChatMessage(
                    `@${username}, ${characterName} has not been challenged to a duel.`
                );

                // Reset their duel
                duel.challenger = null;
                duel.time = null;
                setCharacterMeta(challenged, duel, 'duel');
                return;
            }

            // Run the duel
            duelResults = await startDuel(character.duel.challenger, username);

            // Announce the results.
            if (duelResults.one > duelResults.two) {
                sendChatMessage(
                    `@${username} & @${
                        character.duel.challenger
                    }, ${await getUserName(
                        character.duel.challenger
                    )} has beaten ${await getUserName(username)} in a duel!`
                );
            } else {
                sendChatMessage(
                    `@${username} & @${
                        character.duel.challenger
                    }, ${await getUserName(
                        username
                    )} has beaten ${await getUserName(
                        character.duel.challenger
                    )} in a duel!`
                );
            }

            // Reset their duel
            duel.challenger = null;
            duel.time = null;
            setCharacterMeta(username, duel, 'duel');
            break;
        default:
            sendChatMessage(
                `@${username}, specify if you want to challenge or accept. EX: !rpg duel challenge @Twitch_Username, !rpg duel accept`
            );
    }
}
