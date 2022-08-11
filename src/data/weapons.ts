import { Weapon } from '../types/equipment';

export const weaponList: Weapon[] = [
    {
        id: 1,
        rarity: 'basic',
        name: 'Dagger',
        cost: 1,
        damage: '1d4',
        damage_type: 'piercing',
        properties: ['light', 'finesse', 'thrown'],
    },
];
