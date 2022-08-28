export type WorldTendencyTypes = 'happiness' | 'resources' | 'research';

export type WorldBuildingTypes =
    | 'blacksmith'
    | 'enchanter'
    | 'tavern'
    | 'shipyard'
    | 'guild'
    | 'trainer';

export type WorldBuildings = {
    blacksmith: number;
    enchanter: number;
    tavern: number;
    shipyard: number;
    guild: number;
    trainer: number;
};

export type WorldStats = {
    happiness: number;
    resources: number;
    research: number;
    upgrades: WorldBuildings;
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
