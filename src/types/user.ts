import { StoredArmor, StoredWeapon } from './equipment';

export type EquippableSlots =
    | 'backpack'
    | 'armor'
    | 'mainHand'
    | 'offHand'
    | 'potion';

export type Character = {
    name: string;
    totalHP: number;
    currentHP: number;
    str: number;
    dex: number;
    int: number;
    backpack: StoredArmor | StoredWeapon | null;
    armor: StoredArmor | null;
    mainHand: StoredWeapon;
    offHand: StoredWeapon | null;
    potion: any;
    class: any;
    title: any;
};
