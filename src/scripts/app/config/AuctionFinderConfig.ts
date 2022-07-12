//update this to suit your needs
//TODO: Create more config buttons on the UI if possible
export default class AuctionFinderConfig {
    static init = this.initialize();
    static maxPageQueries = 100;
    static maxAuctionDisplayCount = 30;
    static budget = 1000000;
    static buyoutMax = 1;
    static acceptRawAuctions = true; //needs more testing
    static considerBuyoutBudget = false; //needs more testing
    static profitCriteria = 0;
    static sortCriteria = "Profit";
    static shownItems = {
        pets: true,
        commodities: true,
        talismans: true,
        upgradables: true
    }
    //starred items go before non-starred items
    //basically more specific names go before less specific names
    static commodityWatchlist = ["Krampus Helmet", "Ultimate Carrot Candy Upgrade", "Jumbo Backpack Upgrade", "Enrichment", "Chimera I", "Pristine V", "Pristine I", "Soul Eater I",
                      "Autopet Rules", "French Bread", "Pioneer Pickaxe",  "Gorilla Monkey", "XX-Large Storage", "Tier Boost", "Beacon V", "Beacon IV", "Beacon III", "Beacon II", 
                      "Infinityboom TNT", "Flycatcher", "Pumpkin Launcher", "Lucky Clover", "Lesser Soulflow Engine", "Ancient Rose", "Reforge Anvil", "Exp Share", "Exp Share Core", "Enchanted Hopper", 
                      "Soul Esoward", "Large Storage", "Weird Tuba", "Ultimate Carrot Candy", "Twilight Tiger Skin", "Spirit Skin", "Radiant Enderman Skin", "Void Conqueror Skin",
                      "Judgement Core", "Jungle Heart", "Plasmaflux Power Orb", "Warden Heart", "Plasma Nucleus", "Icicle Skin", "Neon Blue Ender Dragon Skin", "Exceedingly Rare Ender Artifact Upgrader",
                      "Null Blade", "Overflux Power Orb", "!LEGENDARY Griffin Upgrade Stone", "Black Widow Skin", "Reinforced Skin", "Pufferfish Skin", "Golden Monkey Skin", "Royal Pigeon", "Neon Red Ender Dragon Skin",
                      "Shard of the Shredded", "Vampire Fang", "Scythe Shard", "Pastel Ender Dragon Skin", "Reaper Gem", "Washed-up Souvenir", "Wood Singularity", "Tesselated Ender Pearl", "Corleonite", "Diamante\u0027s Handle",
                      "Necron\u0027s Handle", "Grown-up Baby Yeti Skin", "Wither Blood", "Precursor Gear", "Block Zapper", "Builder\u0027s Wand", "Overflux Capacitor", "Snowglobe Skin",
                      "First Master Star", "Second Master Star", "Third Master Star", "Fourth Master Star", "Soulflow Engine", "Minos Relic", "Enderpack Skin", "Watcher Guardian Skin", "Braided Griffin Feather",
                      "Fossilized Silverfish Skin", "Silex", "Purple Egged Skin", "Green Egged Skin", "Orca Blue Whale Skin", "Zombie Skeleton Horse Skin", "Mauve Skin", "Admiral Skin", "Dragon Horn", "Null Edge", "Crimson Skin",
                      "Dwarf Turtle Shelmet", "Deep Sea Orb", "Monochrome Elephant Skin", "Dragon Claw", "Dragon Scale", "Recall Potion", "Spirit Bone", "Spirit Wing", "Personal Harp", "Lucky Dice", "Sadan\u0027s Brooch",
                      "Cool Rock Skin", "Laughing Rock Skin", "Thinking Rock Skin", "Summoning Ring", "Blue Elephant Skin", "Perfectly-Cut Fuel Tank", "Amber-polished Drill Engine", "Derpy Rock Skin", "Embarrassed Rock Skin",
                      "Smiling Rock Skin", "Pink Elephant Skin", "Gemstone Mixture", "Mithril Plate", "Golden Plate", "Gemstone Fuel Tank", "Orange Elephant Skin", "Neon Red Sheep Skin", "Neon Blue Sheep Skin", "Titanium-plated Drill Engine", 
                      "Jaderald", "Purple Elephant Skin", "Red Elephant Skin", "Puppy Skin", "Green Elephant Skin", "Warped Stone", "Mana Flux Power Orb", "White Sheep Skin", "Pink Sheep Skin", "Black Sheep Skin", "Red Sheep Skin", "Purple Sheep Skin",
                      "Light Blue Sheep Skin", "Onyx Black Cat Skin", "Light Green Sheep Skin", "Warden Heart"];
    static talismanWatchlist = ["Personal Compactor 7000", "Personal Compactor 6000", "Bat Artifact", "Golden Jerry Artifact", "Hegemony Artifact", "Candy Relic", "Reaper Orb", "Scarf\u0027s Grimoire", "Treasure Artifact", "Razor-sharp Shark Tooth Necklace", 
                     "!MYTHIC Beastmaster Crest", "!LEGENDARY Beastmaster Crest", "!EPIC Beastmaster Crest", "Wither Relic", "Auto Recombobulator", "Titanium Relic", "Seal of the Family", "Ender Artifact", "Wither Artifact", "Ender Relic", 
                     "Spider Artifact", "Treasure Ring", "Catacombs Expert Ring", "Red Claw Artifact", "Spiked Atrocity", "Experience Artifact", "Soulflow Supercell", "Tarantula Talisman", "Hunter Ring", "Purple Jerry Talisman", "Bait Ring",
                     "Survivor Cube", "Zombie Artifact", "Speed Artifact", "Devour Ring", "Wolf Ring", "Intimidation Artifact", "Frozen Chicken", "Bits Talisman", "Eternal Hoof", "Soulflow Battery", "Bat Person Artifact", "Blue Jerry Talisman",
                     "Titanium Ring", "Sea Creature Artifact", "Personal Compactor 5000", "Mineral Talisman", "Red Claw Ring", "Scarf\u0027s Studies",  "Scarf\u0027s Thesis", "Fish Affinity Talisman", "Potion Affinity Artifact", "Feather Artifact",
                     "Haste Ring", "Crab Hat of Celebration", "Blood God Crest", "Potato Talisman", "Handy Blood Chalice", "Pocket Espresso Machine", "Jungle Amulet", "Hunter Talisman", "Wolf Paw"];
    static upgradableWatchlist = ["Storm\u0027s Boots ✪✪✪✪✪", "Necron\u0027s Boots ✪✪✪✪✪", "Goldor\u0027s Boots ✪✪✪✪✪", 
                     "Storm\u0027s Leggings ✪✪✪✪✪", "Necron\u0027s Leggings ✪✪✪✪✪", "Goldor\u0027s Leggings ✪✪✪✪✪",
                     "Storm\u0027s Chestplate ✪✪✪✪✪", "Necron\u0027s Chestplate ✪✪✪✪✪", "Goldor\u0027s Chestplate ✪✪✪✪✪",
                     "Livid Dagger ✪✪✪✪✪", "Flower of Truth ✪✪✪✪✪", "Reaper Mask ✪✪✪✪✪",  
                      "Axe of the Shredded ✪✪✪✪✪",  "Shadow Assassin Chestplate ✪✪✪✪✪",  "Necron\u0027s Blade",
                      "Rod of the Sea", "Juju Shortbow ✪✪✪✪✪", "Wand of Atonement", "Vorpal Katana", "Wither Goggles ✪✪✪✪✪",
                      "Warden Helmet", "Atomsplit Katana", "Aspect of the End", "Aspect of the Dragons", "Frozen Scythe", "Revenant Falchion",
                      "Golem Sword", "Raider Axe", "Twilight Dagger", "Explosive Bow", "Magma Bow", "Slime Bow", "Scorpion Bow", "Hurricane Bow",
                      "Runaan\u0027s Bow", "Death Bow", "Spider Queen\u0027s Stinger", "Venom\u0027s Touch", "Souls Rebound", "Mosquito Bow",
                      "Ornate Zombie Sword", "Recluse Fang", "Edible Mace", "Voidedge Katana", "Tactician\u0027s Sword", "Blade of the Volcano",
                      "Ragnarock Axe", "Fire Freeze Staff", "Ember Rod", "Fire Fury Staff", "Scorpion Foil", "Shaman Sword", "Aspect of the Void",
                     "Reaper Falchion", "Emerald Blade", "Ink Wand", "Kindlebane Dagger", "Mawdredge Dagger", "Leaping Sword", "Vorpal Katana",
                    "Sword of Revelations", "Enrager", "Pooch Sword", "Ghoul Buster", "Soul Whip", "Pyrochaos Dagger", "Deathripper Dagger",
                    "Yeti Sword", "Silk-Edge Sword", "Florid Zombie Sword", "Gemstone Gauntlet", "Daedalus Axe", "Phantom Rod", "Pigman Sword",
                    "Atomsplit Katana", "Reaper Scythe", "Bonzo\u0027s Staff", "Adaptive Blade", "Spirit Sceptre", "Ice Spray Wand", "Livid Dagger",
                    "Shadow Fury", "Fel Sword", "Wither Cloak Sword", "Necromancer Sword", "Giant\u0027s Sword", "Hyperion", "Astraea", "Scylla",
                    "Valkyrie", "Dark Claymore", "Spirit Bow", "Bonemerang", "Last Breath", "Terminator", "Voodoo Doll",
                    "Shimmering Light Hood", "Shimmering Light Tunic", "Shimmering Light Trousers", "Shimmering Light Slippers",
                    "Rampart Helmet", "Rampart Chestplate", "Rampart Leggings", "Rampart Boots", "Helmet of the Pack", "Chestplate of the Pack",
                    "Leggings of the Pack", "Boots of the Pack", "Armor of Magma Helmet", "Armor of Magma Chestplate", "Armor of Magma Leggings",
                    "Armor of Magma Boots", "Emerald Helmet", "Emerald Chestplate", "Emerald Leggings", "Emerald Boots", 
                    "Crystal Helmet", "Crystal Chestplate", "Crystal Leggings", "Crystal Boots", 
                    "Zombie Chestplate", "Zombie Leggings", "Zombie Boots",
                    "Revenant Chestplate", "Revenant Leggings", "Revenant Boots",
                    "Reaper Chestplate", "Reaper Leggings", "Reaper Boots",
                    "Blaze Helmet", "Blaze Chestplate", "Blaze Leggings", "Blaze Boots",
                    "Cheap Tuxedo Jacket", "Cheap Tuxedo Pants", "Cheap Tuxedo Oxfords",
                    "Fancy Tuxedo Jacket", "Fancy Tuxedo Pants", "Fancy Tuxedo Oxfords",
                    "Elegant Tuxedo Jacket", "Elegant Tuxedo Pants", "Elegant Tuxedo Oxfords",
                    "Ender Helmet", "Ender Chestplate", "Ender Leggings", "Ender Boots",
                    "Speedster Helmet", "Speedster Chestplate", "Speedster Leggings", "Speedster Boots",
                    "Sponge Helmet", "Sponge Chestplate", "Sponge Leggings", "Spongy Shoes",
                    "Mastiff Helmet", "Mastiff Chestplate", "Mastiff Leggings", "Mastiff Boots",
                    "Tarantula Helmet", "Tarantula Chestplate", "Tarantula Leggings", "Tarantula Boots",
                    "Spooky Helmet", "Spooky Chestplate", "Spooky Leggings", "Spooky Boots",
                    "Snow Suit Helmet", "Snow Suit Chestplate", "Snow Suit Leggings", "Snow Suit Boots",
                    "Mineral Helmet", "Mineral Chestplate", "Mineral Leggings", "Mineral Boots",
                    "Glacite Helmet", "Glacite Chestplate", "Glacite Leggings", "Glacite Boots",
                    "Helmet of the Rising Sun", "Chestplate of the Rising Sun", "Leggings of the Rising Sun", "Boots of the Rising Sun",
                    "Great Spook Helmet", "Great Spook Chestplate", "Great Spook Leggings", "Great Spook Boots",
                    "Berserker Helmet", "Berserker Chestplate", "Berserker Leggings", "Berserker Boots",
                    "Shark Scale Helmet", "Shark Scale Chestplate", "Shark Scale Leggings", "Shark Scale Boots",
                    "Bat Person Helmet", "Bat Person Chestplate", "Bat Person Leggings", "Bat Person Boots",
                    "Diver\u0027s Mask", "Diver\u0027s Shirt", "Diver\u0027s Trunks", "Diver\u0027s Boots",
                    "Werewolf Helmet", "Werewolf Chestplate", "Werewolf Leggings", "Werewolf Boots",
                    "Frozen Blaze Helmet", "Frozen Blaze Chestplate", "Frozen Blaze Leggings", "Frozen Blaze Boots",
                    "Young Dragon Helmet", "Young Dragon Chestplate", "Young Dragon Leggings", "Young Dragon Boots",
                    "Old Dragon Helmet", "Old Dragon Chestplate", "Old Dragon Leggings", "Old Dragon Boots",
                    "Wise Dragon Helmet", "Wise Dragon Chestplate", "Wise Dragon Leggings", "Wise Dragon Boots",
                    "Protector Dragon Helmet", "Protector Dragon Chestplate", "Protector Dragon Leggings", "Protector Dragon Boots",
                    "Strong Dragon Helmet", "Strong Dragon Chestplate", "Strong Dragon Leggings", "Strong Dragon Boots",
                    "Unstable Dragon Helmet", "Unstable Dragon Chestplate", "Unstable Dragon Leggings", "Unstable Dragon Boots",
                    "Superior Dragon Helmet", "Superior Dragon Chestplate", "Superior Dragon Leggings", "Superior Dragon Boots",
                    "Holy Dragon Helmet", "Holy Dragon Chestplate", "Holy Dragon Leggings", "Holy Dragon Boots",
                    "Sorrow Helmet", "Sorrow Chestplate", "Sorrow Leggings", "Sorrow Boots",
                    "Final Destination Helmet", "Final Destination Chestplate", "Final Destination Leggings", "Final Destination Boots",
                    "Helmet of Divan", "Chestplate of Divan", "Leggings of Divan", "Boots of Divan",
                    "Magma Lord Helmet", "Magma Lord Chestplate", "Magma Lord Leggings", "Magma Lord Boots",
                    "Infernal Crimson Helmet", "Infernal Crimson Chestplate", "Infernal Crimson Leggings", "Infernal Crimson Boots",
                    "Fiery Crimson Helmet", "Fiery Crimson Chestplate", "Fiery Crimson Leggings", "Fiery Crimson Boots",
                    "Burning Crimson Helmet", "Burning Crimson Chestplate", "Burning Crimson Leggings", "Burning Crimson Boots",
                    "Hot Crimson Helmet", "Hot Crimson Chestplate", "Hot Crimson Leggings", "Hot Crimson Boots",
                    "Crimson Helmet", "Crimson Chestplate", "Crimson Leggings", "Crimson Boots",
                    "Infernal Aurora Helmet", "Infernal Aurora Chestplate", "Infernal Aurora Leggings", "Infernal Aurora Boots",
                    "Fiery Aurora Helmet", "Fiery Aurora Chestplate", "Fiery Aurora Leggings", "Fiery Aurora Boots",
                    "Burning Aurora Helmet", "Burning Aurora Chestplate", "Burning Aurora Leggings", "Burning Aurora Boots",
                    "Hot Aurora Helmet", "Hot Aurora Chestplate", "Hot Aurora Leggings", "Hot Aurora Boots",
                    "Aurora Helmet", "Aurora Chestplate", "Aurora Leggings", "Aurora Boots",
                    "Infernal Fervor Helmet", "Infernal Fervor Chestplate", "Infernal Fervor Leggings", "Infernal Fervor Boots",
                    "Fiery Fervor Helmet", "Fiery Fervor Chestplate", "Fiery Fervor Leggings", "Fiery Fervor Boots",
                    "Burning Fervor Helmet", "Burning Fervor Chestplate", "Burning Fervor Leggings", "Burning Fervor Boots",
                    "Hot Fervor Helmet", "Hot Fervor Chestplate", "Hot Fervor Leggings", "Hot Fervor Boots",
                    "Fervor Helmet", "Fervor Chestplate", "Fervor Leggings", "Fervor Boots",
                    "Infernal Hollow Helmet", "Infernal Hollow Chestplate", "Infernal Hollow Leggings", "Infernal Hollow Boots",
                    "Fiery Hollow Helmet", "Fiery Hollow Chestplate", "Fiery Hollow Leggings", "Fiery Hollow Boots",
                    "Burning Hollow Helmet", "Burning Hollow Chestplate", "Burning Hollow Leggings", "Burning Hollow Boots",
                    "Hot Hollow Helmet", "Hot Hollow Chestplate", "Hot Hollow Leggings", "Hot Hollow Boots",
                    "Hollow Helmet", "Hollow Chestplate", "Hollow Leggings", "Hollow Boots",
                    "Infernal Terror Helmet", "Infernal Terror Chestplate", "Infernal Terror Leggings", "Infernal Terror Boots",
                    "Fiery Terror Helmet", "Fiery Terror Chestplate", "Fiery Terror Leggings", "Fiery Terror Boots",
                    "Burning Terror Helmet", "Burning Terror Chestplate", "Burning Terror Leggings", "Burning Terror Boots",
                    "Hot Terror Helmet", "Hot Terror Chestplate", "Hot Terror Leggings", "Hot Terror Boots",
                    "Terror Helmet", "Terror Chestplate", "Terror Leggings", "Terror Boots",
                    "Adaptive Helmet", "Adaptive Chestplate", "Adaptive Leggings", "Adaptive Boots",
                    "Shadow Assassin Helmet", "Shadow Assassin Chestplate", "Shadow Assassin Leggings", "Shadow Assassin Boots",
                    "Necromancer Lord Helmet", "Necromancer Lord Chestplate", "Necromancer Lord Leggings", "Necromancer Lord Boots",
                    "Goldor\u0027s Helmet", "Goldor\u0027s Chestplate", "Goldor\u0027s Leggings", "Goldor\u0027s Boots",
                    "Storm\u0027s Helmet", "Storm\u0027s Chestplate", "Storm\u0027s Leggings", "Storm\u0027s Boots",
                    "Necron\u0027s Helmet", "Necron\u0027s Chestplate", "Necron\u0027s Leggings", "Necron\u0027s Boots",
                    "Maxor\u0027s Helmet", "Maxor\u0027s Chestplate", "Maxor\u0027s Leggings", "Maxor\u0027s Boots",
                    "Wither Helmet", "Wither Chestplate", "Wither Leggings", "Wither Boots",
                    "Skeleton\u0027s Helmet", "Taurus Helmet", "Witch Mask", "Vampire Mask", "Vampire Witch Mask",
                    "Zombie's Heart", "Reaper Mask", "Revived Heart", "Spirit Mask", "Crown of Greed", "Warden Helmet",
                    "Mender Helmet", "Mender Fedora", "Mender Crown", "Dark Goggles", "Shadow Goggles", "Wither Goggles",
                    "Bonzo's Mask", "Precursor Eye", "Crystallized Heart", "Golden Bonzo Head", "Diamond Bonzo Head", 
                    "Golden Scarf Head", "Diamond Scarf Head", "Golden Professor Head", "Diamond Professor Head",
                    "Golden Thorn Head", "Diamond Thorn Head", "Golden Livid Head", "Diamond Livid Head",
                    "Golden Sadan Head", "Diamond Sadan Head", "Golden Necron Head", "Diamond Necron Head",
                    "Guardian Chestplate", "Flaming Chestplate", "Obsidian Chestplate", "Mithril Coat",
                    "Stone Chestplate", "Metal Chestplate", "Steel Chestplate", "Creeper Pants", "Moogma Leggings", "Stereo Pants",
                    "Farmer Boots", "Spider\u0027s Boots", "Spirit Boots", "Rancher\u0027s Boots", "Slug Boots"
                ]; //add midas weapons
    static petWatchlist = ["!LEGENDARY Baby Yeti", "!EPIC Baby Yeti", "!LEGENDARY Squid", "!LEGENDARY Flying Fish", "!LEGENDARY Lion", "!LEGENDARY Elephant",
                      "!LEGENDARY Tiger", "!LEGENDARY Black Cat", "!EPIC Tiger", "!LEGENDARY Blue Whale", "!LEGENDARY Rabbit"]; //fill in the rest of the pets
    static petRarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    static petMultiplierTable = {"!LEGENDARY Wolf":7, "!LEGENDARY Sheep":3, "!LEGENDARY Rabbit":5, "!LEGENDARY Blue Whale":24, "!LEGENDARY Dolphin":20, 
                      "!EPIC Dolphin":9, "!EPIC Tiger":10, "LEGENDARY Tiger": 13, "!LEGENDARY Spider": 34, "!LEGENDARY Tarantula": 19,
                      "!LEGENDARY Elephant": 8, "!MYTHIC Bat":2, "!LEGENDARY Bat":5, "!LEGENDARY Ender Dragon":13, "!LEGENDARY Black Cat": 26,
                      "!LEGENDARY Baby Yeti": 22, "!EPIC Baby Yeti":7, "!LEGENDARY Squid":10, "!LEGENDARY Flying Fish": 18, "!LEGENDARY Lion": 24
                      } ;
    static petLoreValueTable;
    static loreValueTable;
    static loreOverrideTable;
    static nameValueTable;
    static nameOverrideTable;
    static initialize() {
        let m = 1000000;
        let k = 1000;
        this.petLoreValueTable = {"Minos Relic": 30*m, "Dwarf Turtle Shelmet": 2*m};
        this.loreValueTable = {"§k":5*m, "Rejuvenate V":500*k, "Legion I":1*m, "Legion II":2*m, 
                      "Legion III":4*m,"Legion IV":7*m, "Legion V":13*m, "Wisdom I":100*k,
                      "Wisdom II":300*k, "Wisdom III":600*k, "Wisdom IV": 1.5*m, "Wisdom V": 2*m,
                      "Growth VI": 2.1*m, "Protection VI": 2.1*m, "Soul Eater I": 1.19*m, 
                      "Soul Eater II": 2.7*m, "Soul Eater III": 5.54*m, "Soul Eater IV": 11.4 *m, "Soul Eater V": 21.7*m,
                      "Ultimate Wise I": 100*k, "Ultimate Wise II": 270*k, "Ultimate Wise III": 600*k, 
                      "Ultimate Wise IV": 1.4*m, "Ultimate Wise V": 2.5*m, "§e(+20)": 300*k, "One For All": 8*m, "Enriched with": 2*m};
        this.loreValueTable = Object.assign({}, this.loreValueTable, this.petLoreValueTable);
        this.nameValueTable = {"Withered": 2.1*m, "Ancient": 600*k, "Necrotic": 300*k};

        //not really sure if these have a purpose but they're here just in case
        this.loreOverrideTable = {}; //{"Growth VI": 0, "Protection VI":0};
        this.nameOverrideTable = {};
        return 0;
    }   
    static auctionConsiderationTime = 5*60*1000; //ms
    static updateConfig(params){
        if(params.budget != NaN) {this.budget = params.budget;}
        if(params.maxAuctionDisplayCount != NaN) {this.maxAuctionDisplayCount = params.maxAuctionDisplayCount;}
        if(params.profitCriteria != NaN) {this.profitCriteria = params.profitCriteria;}
        this.sortCriteria = params.sortCriteria;
        this.shownItems = params.shownItems;
    }
}
