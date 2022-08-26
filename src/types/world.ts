export type WorldTendencyTypes = 'happiness' | 'resources' | 'research';

export type WorldBuildingTypes =
    | 'blacksmith'
    | 'tower'
    | 'tavern'
    | 'shipyard'
    | 'guild'
    | 'field';

export type WorldBuildings = {
    blacksmith: number;
    tower: number;
    tavern: number;
    shipyard: number;
    guild: number;
    field: number;
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
