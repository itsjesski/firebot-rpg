import { startCombat } from '../combat/combat';
import { getUserData } from '../user/user';

export function isDuelExpired(date: number | null) {
    if (date == null) {
        return true;
    }

    const timer = 1000 * 60 * 2; // 2 minutes
    const checked = Date.now() - timer;

    return date > checked;
}

export async function startDuel(attacker: string, defender: string) {
    const attackingCharacter = await getUserData(attacker);
    const defendingCharacter = await getUserData(defender);
    const results = await startCombat(attackingCharacter, defendingCharacter);
    return results;
}
