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
    | 'potion'
    | 'characterClass'
    | 'title';

export type CharacterStatNames = 'str' | 'dex' | 'int';

export type Character = {
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
    potion: any;
    characterClass: StoredCharacterClass;
    title: StoredTitle;
};
