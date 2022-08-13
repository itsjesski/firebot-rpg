export type EquippableSlots =
    | 'backpack'
    | 'armor'
    | 'main_hand'
    | 'off_hand'
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
    main_hand: any;
    off_hand: any;
    potion: any;
    class: any;
    title: any;
};
