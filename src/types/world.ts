export type WorldStats = {
    happiness: number;
    resources: number;
    research: number;
    upgrades: {
        blacksmith: number;
        defenses: number;
        stable: number;
        tavern: number;
        tower: number;
        shipyard: number;
    };
};
