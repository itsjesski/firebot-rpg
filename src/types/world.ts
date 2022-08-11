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

export type WorldTendency = {
    happiness: {
        positive: number;
        negative: number;
    };
    resources: {
        positive: number;
        negative: number;
    };
    research: {
        positive: number;
        negative: number;
    };
};

export type TendencyStat = {
    happiness: number;
    resources: number;
    research: number;
};
