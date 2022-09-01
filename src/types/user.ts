import {
    StorableItems,
    StoredArmor,
    StoredCharacterClass,
    StoredShield,
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
    mainHand: StoredWeapon;
    offHand: StoredWeapon | StoredShield | null;
    characterClass: StoredCharacterClass;
    title: StoredTitle;
};
