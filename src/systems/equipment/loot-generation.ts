import { ItemTypes, Rarity, StorableItems } from '../../types/equipment';
import { generateArmorForUser } from './armor';
import { generateClass } from './character-class';
import { generateShieldForUser } from './shields';
import { generateSpellForUser } from './spells';
import { generateTitleByRarity } from './title';
import { generateWeaponForUser } from './weapons';

export async function rpgLootGenerator(
    username: string,
    lootType: ItemTypes,
    lootRarity: Rarity[]
): Promise<StorableItems> {
    let loot;

    switch (lootType) {
        case 'weapon':
            loot = await generateWeaponForUser(username, lootRarity);
            break;
        case 'armor':
            loot = await generateArmorForUser(username, lootRarity);
            break;
        case 'title':
            loot = await generateTitleByRarity(lootRarity);
            break;
        case 'characterClass':
            loot = await generateClass(lootRarity);
            break;
        case 'shield':
            loot = await generateShieldForUser(username, lootRarity);
            break;
        case 'spell':
            loot = await generateSpellForUser(username, lootRarity);
            break;
        default:
    }

    return loot;
}
