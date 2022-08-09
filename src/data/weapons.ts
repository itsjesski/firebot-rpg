import { Weapon } from '../types/equipment';

export const basicWeapons: Weapon[] = [
    {
        name: 'Dagger',
        cost: 1,
        damage: '1d4',
        damage_type: 'piercing',
        properties: ['light', 'finesse', 'thrown'],
    },
    {
        name: 'Cestus',
        cost: 10,
        damage: '1d4',
        damage_type: 'bludgeoning',
        properties: ['light', 'stun'],
    },
    {
        name: 'Club',
        cost: 10,
        damage: '1d4',
        damage_type: 'bludgeoning',
        properties: ['light', 'stun'],
    },
];

export const rareWeapons: Weapon[] = [
    {
        name: 'Brandistock',
        cost: 50,
        damage: '1d8',
        damage_type: 'piercing',
        properties: ['bleed', 'two-handed'],
    },
    {
        name: 'Falx',
        cost: 50,
        damage: '1d6',
        damage_type: 'slashing',
        properties: ['versatile'],
    },
];

export const epicWeapons: Weapon[] = [
    {
        name: 'Dagger',
        cost: 1,
        damage: '1d4',
        damage_type: 'piercing',
        properties: ['light', 'finesse', 'thrown'],
    },
];

export const legendaryWeapons: Weapon[] = [
    {
        name: 'Dagger',
        cost: 1,
        damage: '1d4',
        damage_type: 'piercing',
        properties: ['light', 'finesse', 'thrown'],
    },
];
