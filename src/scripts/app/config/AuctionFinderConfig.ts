export default class AuctionFinderConfig {
    static budget = 1000000;
    static buyoutMax = 1;
    static acceptRawAuctions = true;
    static considerBuyoutBudget = false;
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
                      "Axe of the Shredded ✪✪✪✪✪",  "Shadow Assassin Chestplate ✪✪✪✪✪", 
                      "Rod of the Sea", "Juju Shortbow ✪✪✪✪✪", "Wand of Atonement", "Vorpal Katana", "Wither Goggles ✪✪✪✪✪",
                      "Warden Helmet", "Atomsplit Katana"];
    static petWatchlist = ["!LEGENDARY Baby Yeti", "!EPIC Baby Yeti", "!LEGENDARY Squid", "!LEGENDARY Flying Fish", "!LEGENDARY Lion", "!LEGENDARY Elephant",
                      "!LEGENDARY Tiger", "!LEGENDARY Black Cat", "!EPIC Tiger", "!LEGENDARY Blue Whale"]; //fill in the rest of the pets
    static petRarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    static petMultiplierTable = {"!LEGENDARY Wolf":7, "!LEGENDARY Sheep":3, "!LEGENDARY Blue Whale":24, "!LEGENDARY Dolphin":20, 
                      "!EPIC Dolphin":9, "!EPIC Tiger":10, "LEGENDARY Tiger": 13, "!LEGENDARY Spider": 34, "!LEGENDARY Tarantula": 19,
                      "!LEGENDARY Elephant": 8, "!MYTHIC Bat":2, "!LEGENDARY Bat":5, "!LEGENDARY Ender Dragon":13, "!LEGENDARY Black Cat": 26,
                      "!LEGENDARY Baby Yeti": 22, "!EPIC Baby Yeti":7, "!LEGENDARY Squid":10, "!LEGENDARY Flying Fish": 18, "!LEGENDARY Lion": 24
                      } ;
    static petLoreValueTable;
    static loreValueTable;
    static loreOverrideTable;
    static nameValueTable;
    static nameOverrideTable;
    static initValueTables() {
        let m = 1000000;
        let k = 1000;
        this.petLoreValueTable = {"Minos Relic": 30*m, "Dwarf Turtle Shelmet": 2*m};
        this.loreValueTable = {"§k":5*m, "Rejuvenate V":500*k, "Legion I":1*m, "Legion II":2*m, 
                      "Legion III":4*m,"Legion IV":7*m, "Legion V":13*m, "Wisdom I":100*k,
                      "Wisdom II":300*k, "Wisdom III":600*k, "Wisdom IV": 1.5*m, "Wisdom V": 2*m,
                      "Growth VI": 2.1*m, "Protection VI": 2.1*m, "Soul Eater I": 1.19*m, 
                      "Soul Eater II": 2.7*m, "Soul Eater III": 5.54*m, "Soul Eater IV": 11.4 *m, "Soul Eater V": 21.7*m,
                      "Ultimate Wise I": 100*k, "Ultimate Wise II": 270*k, "Ultimate Wise III": 600*k, 
                      "Ultimate Wise IV": 1.4*m, "Ultimate Wise V": 2.5*m, "§e(+20)": 300*k, "One For All": 8*m};
        this.loreValueTable = Object.assign({}, this.loreValueTable, this.petLoreValueTable);
        this.nameValueTable = {"Withered": 2.1*m, "Ancient": 600*k, "Necrotic": 300*k};

        //not really sure if these have a purpose but they're here just in case
        this.loreOverrideTable = {} //{"Growth VI": 0, "Protection VI":0};
        this.nameOverrideTable = {};
    }   
    static auctionConsiderationTime = 5*60; //seconds
}
