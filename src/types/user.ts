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
    backpack: any;
    armor: any;
    mainHand: any;
    offHand: any;
    potion: any;
    class: any;
    title: any;
};
