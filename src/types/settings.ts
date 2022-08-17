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
};
