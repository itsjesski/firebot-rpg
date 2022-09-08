import { Job } from '../types/jobs';

export const jobList: Job[] = [
    {
        id: 1,
        challenge: 'easy',
        template: `A friendly monk wanders by and asks for #name's advice. He's thankful and gives #name a weapon from his cart.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 2,
        challenge: 'easy',
        template: `A local blacksmith offers to create a piece of armor for #name as promo for his shop. He throws it onto the back of #name's horse.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['rare'],
            },
            money: 0,
        },
        world_tendency: {
            happiness: 0,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 3,
        challenge: 'easy',
        template: `#name finds a book on the side of the road. But, it was bait in a trap!`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic'],
            },
            money: 10,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 4,
        challenge: 'easy',
        template: `A local lord has been keeping track of #name's exploits and grants them a title and small stipend.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'title',
                rarity: ['basic'],
            },
            money: 10,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 4,
        challenge: 'easy',
        template: `A local lord has been keeping track of #name's exploits and grants them a title and small stipend.`,
        encounter: null,
        loot: {
            item: {
                itemType: 'title',
                rarity: ['basic'],
            },
            money: 10,
        },
        world_tendency: {
            happiness: 0,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 5,
        challenge: 'easy',
        template: `A cryptic aristocrat named Guire seeks a company of adventurers to thwart a monstrous plan. However, the quest is a trap.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 6,
        challenge: 'medium',
        template: `A guarded priest named Damasil seeks a practiced adventurer to find and explore the ancient ruins of the Fortress of the Gargoyle Prince`,
        encounter: 41,
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 2,
            research: 0,
        },
    },
    {
        id: 7,
        challenge: 'easy',
        template: `A guarded sage named Ilos seeks a group to recover and destroy an evil artifact from the ruins of Narvi's Hold.`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 0,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 7,
        challenge: 'easy',
        template: `A shady ex-adventurer seeks a company of adventurers to steal Ziri's Articles from a rival.`,
        encounter: 3,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 0,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 8,
        challenge: 'legendary',
        template: `An ex-adventurer named Frodwe seeks a group to rescue the #worldType of #worldName from the Vampire of the Mountains of Madness.`,
        encounter: 32,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 9,
        challenge: 'easy',
        template: `A guarded elven lady seeks soldiers to escort The Demonic Articles of Phantesocr safely to the #worldType of #worldName`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 0,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 10,
        challenge: 'easy',
        template: `An aristocrat seeks a fighters to thwart the monstrous plan of Mastu the Insane.`,
        encounter: 8,
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 11,
        challenge: 'easy',
        template: `An ex-adventurer named Sybel seeks adventurers to steal a powerful arcane device from a rival. However, the quest is a trap.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 12,
        challenge: 'medium',
        template: `An elf seeks a company of adventurers to rescue the village of Hosvelundr from the Wraith of the Breda Forest.`,
        encounter: 14,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 13,
        challenge: 'medium',
        template: `An adventurer named Aethed seeks adventurers to recover the Relic of Sandard from the brigands of the Starfall Jungle.`,
        encounter: 19,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 14,
        challenge: 'medium',
        template: `An dwarf named Rotli seeks a company of adventurers to escort a caravan of exotic goods safely to the elven village of Hawe.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 15,
        challenge: 'medium',
        template: `Adventurers are needed to escort a caravan of exotic goods to the ships in the port of Lithway.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 2,
            research: 0,
        },
    },
    {
        id: 16,
        challenge: 'medium',
        template: `Local thieves have tried to steal riches from a nearby tomb, but released creatures into a nearby town. The town asks for protection.`,
        encounter: 17,
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 17,
        challenge: 'medium',
        template: `Dragon cultists have discovered a tablet with a summoning ritual that will allow them to destroy at a whim. They must be stopped.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 18,
        challenge: 'medium',
        template: `A terrible plague has ravaged #worldName, and the #citizenName citizens suspect something may have contaminated the water system. Men have started going missing while searching the sewers below.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 19,
        challenge: 'medium',
        template: `Mysterious murders plague an eerie quiet town. The adventurers hear whispers of how a young girl and her doll are somehow involved.`,
        encounter: 17,
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 20,
        challenge: 'medium',
        template: `Packs of flying harpies are preying on local farmers and making off with their livestock. Victims tell the players of a mysterious forest in the mountains.`,
        encounter: 18,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 21,
        challenge: 'medium',
        template: `A friend's magic weapon goes missing, rumored to be stolen by an infamous thief. It must be found!`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 22,
        challenge: 'hard',
        template: `There are rumors at the local tavern of a mysterious cult. The townspeople believe the extremist faction is killing all of the divine casters in the area.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 23,
        challenge: 'hard',
        template: `A necromancer and his minions have run out of graves to rob in the surrounding cities. Now they seek to create fresh cadavers by any means necessary.`,
        encounter: 23,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 24,
        challenge: 'hard',
        template: `A local artificer grants powerful artifacts in exchange for ridding his forge of an unknown infestation.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 2,
            research: 0,
        },
    },
    {
        id: 25,
        challenge: 'hard',
        template: `Children have gone missing at a local orphanage. The party discovers a cultist runs the facility. He brainwashes the strong into sacrificing the weak, all in the name of his patron.`,
        encounter: 22,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 26,
        challenge: 'hard',
        template: `A local mage has mysteriously passed away, and all manner of creatures and magic has begun to creep from their tower into the surrounding cities.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 27,
        challenge: 'hard',
        template: `#citizenName are slowly disappearing. The culprit is a changeling summoner who assumes the identity of their most recent kill for several days before its subsequent murder.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 28,
        challenge: 'hard',
        template: `A crazed owner has built his tavern atop a mysterious dungeon entrance. He coerces drunk customers to venture inside, hoping to rob them upon their return. However, the monster have gotten out.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 2,
        },
    },
    {
        id: 29,
        challenge: 'hard',
        template: `Locals claim to have found treasure within a newly discovered dungeon. However, it is a complex trap intended to harvest souls, magical power, or life energy.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 2,
        },
    },
    {
        id: 30,
        challenge: 'hard',
        template: `A traveling circus has come to town and proceeds to put on a fantastic show. However, they disappear in the morning without a trace, taking several children.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 31,
        challenge: 'hard',
        template: `Two rival thieves guilds are fighting for control of the city, and their battles have spilled into the streets. Some of them are strong mages.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['basic', 'rare', 'epic', 'legendary'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 32,
        challenge: 'legendary',
        template: `A wary #citizenName named Ether seeks company to recover a valued family heirloom from the cultists of Xoth-Vhatyng.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 33,
        challenge: 'legendary',
        template: `A frantic sage named Mionesil seeks soldiers to hunt down and kill Nabura the Wyrm Princess.`,
        encounter: 34,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 34,
        challenge: 'legendary',
        template: `A priest named Coprosis wants guardians to protect him from the assassins of Shiva the Destroyer.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 35,
        challenge: 'legendary',
        template: `A man requests to join the party for protection from a secret, powerful entity. However, he has stolen a magic item from that being.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 36,
        challenge: 'legendary',
        template: `Slavers have been sighted capturing peasants and adventurers of various races and auctioning them off to all manner of sinister, demonic beasts.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 37,
        challenge: 'legendary',
        template: `A local sage has convinced the townmaster that a massive meteor will strike the city, but he has ulterior motives for evacuating the overly-trusting townspeople.`,
        encounter: 39,
        loot: {
            item: {
                itemType: 'spell',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 38,
        challenge: 'legendary',
        template: `The adventuring party has caught word of a cooper's guild master who plans to poison the barrels of a local winery due to a disagreement with the owner. He is under the control of an entity.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 0,
            research: 2,
        },
    },
    {
        id: 39,
        challenge: 'legendary',
        template: `Dark gnomes are flooding into cities and causing minor disturbances with the townspeople. Rumors begin to surface about the expanding drow empire. There is something sinister behind the plans.`,
        encounter: 'legendary',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['rare', 'epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 2,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 40,
        challenge: 'medium',
        template: `A group of fey creatures has infiltrated the staff of a local winery. Each night barrels from the storage house go missing without any evidence of forced entry.`,
        encounter: 14,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 41,
        challenge: 'easy',
        template: `A barbarian tribe has kidnapped the daughter of a local innkeeper. Only a highly trained tracker can follow their trail and save the young girl.`,
        encounter: 3,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 42,
        challenge: 'easy',
        template: `Ancient spirits and their dryad followers have been plaguing a local logging camp. Locals suspect the foreman has been making illegal deals on the side.`,
        encounter: 2,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 43,
        challenge: 'easy',
        template: `A kind treant requests that the players assist with the removal of an infestation within its roots.`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 0,
            research: 0,
        },
    },
    {
        id: 44,
        challenge: 'medium',
        template: `A dwarf and a centaur are nearing the end of an anger-filled drinking contest. Patrons begin taking bets on who will win and who will be the first to brawl.`,
        encounter: 21,
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 2,
            resources: 0,
            research: 1,
        },
    },
    {
        id: 45,
        challenge: 'easy',
        template: `A large cloister of flumphs has overrun a local mining facility. Though harmless, they signal a greater danger.`,
        encounter: 11,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 46,
        challenge: 'easy',
        template: `The owners of the local apothecary need a rare herb to make a special elixir. It is known to only grow in the Dread Forest and have asked the party to retrieve it.`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 47,
        challenge: 'medium',
        template: `A strange bag arrives in the post. It is an altered bag of holding that contains a small pocket dimension with a creature inside. `,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 47,
        challenge: 'easy',
        template: `A local tavern is holding a Three Dragon Ante tourney with a special prize for the winner. Organizers are asking for guards to keep the peace.`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 48,
        challenge: 'easy',
        template: `As an act of protest, a local activist has freed the town's sheep from their pen. They fled into the forest shortly after.`,
        encounter: 'easy',
        loot: {
            item: {
                itemType: 'shield',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 49,
        challenge: 'legendary',
        template: `A group of dragons seeks to create a den within an inactive volcano. An eruption could cause widespread devastation to the neighboring towns.`,
        encounter: 33,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 1,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 50,
        challenge: 'medium',
        template: `A growing number of villagers have been found dead with evidence of a new powerful drug. The party must find the elusive alchemist responsible before their product spreads.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 51,
        challenge: 'legendary',
        template: `A dwarf seeks company to find a library of a renowned mad mage. Once found, it is discovered he is an ancient dragon who covets knowledge over wealth.`,
        encounter: 33,
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['epic', 'legendary'],
            },
            money: 50,
        },
        world_tendency: {
            happiness: 1,
            resources: 2,
            research: 2,
        },
    },
    {
        id: 52,
        challenge: 'medium',
        template: `An airship has crashed in a remote forest outside of town. Strange and otherworldly people have entered town seeking materials to repair the damages, and guards to protect them.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 53,
        challenge: 'medium',
        template: `Miners are returning home mindless and unresponsive. Those who retain their wits cannot remember the days prior.`,
        encounter: 'medium',
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare', 'epic'],
            },
            money: 30,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 1,
        },
    },
    {
        id: 54,
        challenge: 'easy',
        template: `A bag of devouring has gained sentience, gorging itself on anything it sees. The owner must be destroyed to stop it.`,
        encounter: 5,
        loot: {
            item: {
                itemType: 'armor',
                rarity: ['basic', 'rare'],
            },
            money: 20,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 0,
        },
    },
    {
        id: 55,
        challenge: 'hard',
        template: `A college has opened its doors in the local city, preaching the wonders of science over magic. Soon after, mages of all kinds begin to vanish.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 2,
        },
    },
    {
        id: 55,
        challenge: 'hard',
        template: `A blacksmith has asked the party to retrieve a recently fallen meteor. However, the players find it has worshipers.`,
        encounter: 'hard',
        loot: {
            item: {
                itemType: 'weapon',
                rarity: ['basic', 'rare'],
            },
            money: 40,
        },
        world_tendency: {
            happiness: 1,
            resources: 1,
            research: 2,
        },
    },
];
