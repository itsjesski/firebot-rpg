import {
    StorableItems,
    StoredArmor,
    StoredCharacterClass,
    StoredShield,
    StoredSpell,
    StoredTitle,
    StoredWeapon,
} from './equipment';

export type EquippableSlots =
    | 'backpack'
    | 'armor'
    | 'mainHand'
    | 'offHand'
    | 'characterClass'
    | 'title';

export type EnchantableSlots = 'armor' | 'mainHand' | 'offHand';

export type CharacterStatNames = 'str' | 'dex' | 'int';

export type Duel = {
    challenger: string | null;
    time: number | null;
};

export type Character = {
    resetId: string;
    name: string;
    totalHP: number;
    currentHP: number;
    str: number;
    dex: number;
    int: number;
    backpack: StorableItems | null;
    armor: StoredArmor | null;
    mainHand: StoredWeapon | StoredSpell;
    offHand: StoredWeapon | StoredShield | StoredSpell | null;
    characterClass: StoredCharacterClass;
    title: StoredTitle;
    duel: Duel;
};
