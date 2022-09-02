export type Rarity = 'basic' | 'rare' | 'epic' | 'legendary';

export type ItemTypes =
    | 'weapon'
    | 'armor'
    | 'characterClass'
    | 'title'
    | 'shield'
    | 'spell';

export type WeaponProperties =
    | 'two-handed'
    | 'light'
    | 'finesse'
    | 'thrown'
    | 'ammunition'
    | 'heavy'
    | 'reach'
    | 'versatile';

export type WeaponDamageTypes = 'piercing' | 'bludgeoning' | 'slashing';

export type ArmorProperties = 'heavy' | 'medium' | 'light';

export type EnchantmentTypes =
    | 'earth'
    | 'wind'
    | 'fire'
    | 'water'
    | 'light'
    | 'darkness';

export type Enchantments = {
    earth: number;
    wind: number;
    fire: number;
    water: number;
    light: number;
    darkness: number;
};

export type EnchantmentName = {
    name: string;
    enchantments: string[];
};

export type Weapon = {
    id: number;
    name: string;
    cost: number;
    damage: string;
    damage_type: WeaponDamageTypes;
    properties: WeaponProperties[];
    rarity: Rarity;
    range: number;
    itemType: 'weapon';
    refinements: number;
    enchantments: Enchantments;
};

export type StoredWeapon = {
    id: number;
    itemType: 'weapon';
    nickname: string | null;
    refinements: number;
    enchantments: Enchantments;
};

export type Spell = {
    id: number;
    name: string;
    cost: number;
    damage: string;
    damage_type: WeaponDamageTypes;
    properties: WeaponProperties[];
    rarity: Rarity;
    range: number;
    itemType: 'spell';
    refinements: number;
    enchantments: Enchantments;
};

export type StoredSpell = {
    id: number;
    itemType: 'spell';
    nickname: string | null;
    refinements: number;
    enchantments: Enchantments;
};

export type Armor = {
    id: number;
    name: string;
    cost: number;
    armorClass: number;
    properties: ArmorProperties[];
    rarity: Rarity;
    itemType: 'armor';
    refinements: number;
    enchantments: Enchantments;
};

export type StoredArmor = {
    id: number;
    itemType: 'armor';
    nickname: string | null;
    refinements: number;
    enchantments: Enchantments;
};

export type Shield = {
    id: number;
    name: string;
    cost: number;
    armorClass: number;
    rarity: Rarity;
    properties: ArmorProperties[];
    itemType: 'shield';
    refinements: number;
    enchantments: Enchantments;
};

export type StoredShield = {
    id: number;
    itemType: 'shield';
    nickname: string | null;
    refinements: number;
    enchantments: Enchantments;
};

export type Title = {
    id: number;
    name: string;
    bonuses: {
        str: number;
        dex: number;
        int: number;
    };
    rarity: Rarity;
    itemType: 'title';
};

export type StoredTitle = {
    id: number;
    itemType: 'title';
};

export type CharacterClass = {
    id: number;
    name: string;
    bonuses: {
        str: number;
        dex: number;
        int: number;
    };
    rarity: Rarity;
    itemType: 'characterClass';
};

export type StoredCharacterClass = {
    id: number;
    itemType: 'characterClass';
};

export type EquippableItemsDetails =
    | Weapon
    | Armor
    | Title
    | CharacterClass
    | Shield
    | Spell;

export type StorableItems =
    | StoredArmor
    | StoredCharacterClass
    | StoredShield
    | StoredTitle
    | StoredWeapon
    | StoredSpell;
