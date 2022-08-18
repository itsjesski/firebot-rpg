import { logger } from '../../firebot/firebot';
import { ItemTypes, Rarity, StorableItems } from '../../types/equipment';
import { generateArmorForUser } from './armor';
import { generateClassForUser } from './character-class';
import { generateShieldForUser } from './shields';
import { generateTitleForUser } from './title';
import { generateWeaponForUser } from './weapons';

export async function rpgLootGenerator(
    username: string,
    lootType: ItemTypes,
    lootRarity: Rarity[]
): Promise<StorableItems> {
    let loot;

    logger('debug', `Generating loot for ${username}`);

    switch (lootType) {
        case 'weapon':
            loot = await generateWeaponForUser(username, lootRarity);
            break;
        case 'armor':
            loot = await generateArmorForUser(username, lootRarity);
            break;
        case 'title':
            loot = await generateTitleForUser(username, lootRarity);
            break;
        case 'characterClass':
            loot = await generateClassForUser(username, lootRarity);
            break;
        case 'shield':
            loot = await generateShieldForUser(username, lootRarity);
            break;
        default:
    }

    return loot;
}
