import { getCompleteCharacterData } from '../characters/characters';
import { startCombat } from '../combat/combat';
import { getDuelTimeout } from '../settings';
import { getUserData } from '../user/user';

export function isDuelExpired(date: number | null) {
    if (date == null) {
        return true;
    }

    const duelTimeout = getDuelTimeout() ? getDuelTimeout() : 2;
    const timer = 1000 * 60 * duelTimeout;
    const checked = Date.now() - timer;

    // If duel challenge time is less than current time -2 minutes, duel is expired.
    return date < checked;
}

export async function startDuel(attacker: string, defender: string) {
    const attackingCharacter = await getUserData(attacker);
    const defendingCharacter = await getUserData(defender);

    const completePlayer = await getCompleteCharacterData(attackingCharacter);
    const completePlayerTwo = await getCompleteCharacterData(
        defendingCharacter
    );

    const results = await startCombat(completePlayer, completePlayerTwo);
    return results;
}
