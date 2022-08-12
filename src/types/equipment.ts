export type Rarity = 'basic' | 'rare' | 'epic' | 'legendary';

export type ItemTypes = 'weapon' | 'armor';

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
    rarity: Rarity;
};

export type StoredWeapon = {
    id: number;
    nickname: string | null;
    refinements: number;
    enchantments: Enchantments;
};

export type Armor = {
    id: number;
    name: string;
    cost: number;
    armor_class: number;
    properties: string[];
    rarity: Rarity;
};

export type StoredArmor = {
    id: number;
    nickname: string | null;
    rarity: Rarity;
    refinements: number;
    enchantments: Enchantments;
};
