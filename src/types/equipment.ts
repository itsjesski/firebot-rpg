export type Enchantments = {
    earth: number;
    wind: number;
    fire: number;
    water: number;
    light: number;
    darkness: number;
};

export type Weapon = {
    id: number;
    name: string;
    cost: number;
    damage: string;
    damage_type: string;
    properties: string[];
    rarity: 'basic' | 'rare' | 'epic' | 'legendary';
};

export type StoredWeapon = {
    id: number;
    nickname: string | null;
    rarity: 'basic' | 'rare' | 'epic' | 'legendary';
    refinements: number;
    enchantments: Enchantments;
};

export type Armor = {
    id: number;
    name: string;
    cost: number;
    armor_class: number;
    properties: string[];
    rarity: 'basic' | 'rare' | 'epic' | 'legendary';
};

export type StoredArmor = {
    id: number;
    nickname: string | null;
    rarity: 'basic' | 'rare' | 'epic' | 'legendary';
    refinements: number;
    enchantments: Enchantments;
};
