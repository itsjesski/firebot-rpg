export type GameSettings = {
    generalSettings: {
        currencyId: string;
    };
    worldSettings: {
        name: string;
        type: string;
        citizens: string;
        cycleTime: number;
    };
    combatSettings: {
        offHandMissChance: number;
        rangedInMeleePenalty: number;
        hitBonus: number;
        damageBonus: number;
        heavyMovementSpeed: number;
        mediumMovementSpeed: number;
        lightMovementSpeed: number;
        nakedMovementSpeed: number;
        heavyDexBonus: number;
        mediumDexBonus: number;
        lightDexBonus: number;
        nakedDexBonus: number;
    };
};
