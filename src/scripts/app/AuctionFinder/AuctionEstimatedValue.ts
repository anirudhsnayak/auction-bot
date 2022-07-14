import AuctionFinderConfig from "../config/AuctionFinderConfig";

export default class AuctionEstimatedValue{
    static getPetBaseValue(auctionData, auctionType){
        //TODO: implement
        return AuctionEstimatedValue.getLoreValue(auctionData) + 
        AuctionEstimatedValue.getPetLevelValue(auctionData, auctionType);
    }
    static getUpgradableBaseValue(auctionData, auctionType){
        return AuctionEstimatedValue.getLoreValue(auctionData) + 
        AuctionEstimatedValue.getNameValue(auctionData) + AuctionEstimatedValue.getEnchantmentValue(auctionData);
    }
    static getTalismanBaseValue(auctionData, auctionType){
        return AuctionEstimatedValue.getLoreValue(auctionData);
    }
    static getCommodityBaseValue(auctionData, auctionType){
        return 0; //what do you expect me to do
    }
    static getLoreValue(auctionData){
        let loreValue = 0; 
        for(let key in AuctionFinderConfig.loreValueTable){
            if(auctionData.item_lore.includes(key)){
                if(key in AuctionFinderConfig.loreOverrideTable){
                    loreValue += AuctionFinderConfig.loreOverrideTable[key];
                } else {
                    loreValue += AuctionFinderConfig.loreValueTable[key];
                }
            }
        }
        return loreValue;
    }
    static getEnchantmentValue(auctionData){
        let enchantValue = 0;
        for(let key in AuctionFinderConfig.enchantValueTable){
            if(auctionData.item_lore.includes(key)){
                enchantValue += this.getEnchantValue(auctionData.item_lore, key, AuctionFinderConfig.enchantValueTable[key]);
            }
        }
        return enchantValue;
    }
    static getEnchantValue(auctionLore, enchant, baseEnchantValue){
        let enchantPosition = auctionLore.indexOf(enchant);
        if(enchantPosition == -1){return 0;}
        let romanNumeral = auctionLore.substring(enchantPosition+enchant.length+1, auctionLore.indexOf("§", enchantPosition+enchant.length+1));
        return baseEnchantValue*Math.pow(2, AuctionEstimatedValue.getRomanNumeralValue(romanNumeral)-1);
    }
    static getRomanNumeralValue(romanNumeral){
        //returns roman numeral values between 0 and 10
        //too lazy to implement this properly
        switch(romanNumeral){
            case "I":    return 1;
            case "II":   return 2;
            case "III":  return 3;
            case "IV":   return 4;
            case "V":    return 5;
            case "VI":   return 6;
            case "VII":  return 7;
            case "VIII": return 8;
            case "IX":   return 9;
            case "X":    return 10;
            default:     return 0;
        }
    }

    static getNameValue(auctionData){
        let nameValue = 0;
        for(let key in AuctionFinderConfig.nameValueTable){
            if(auctionData.item_name.includes(key)){
                if(key in AuctionFinderConfig.nameOverrideTable){
                    nameValue += AuctionFinderConfig.nameOverrideTable[key];
                } else {
                    nameValue += AuctionFinderConfig.nameValueTable[key];
                }
            }
        }
        return nameValue;
    }
    static getPetLevelValue(auctionData, auctionType){
        //we're trying to compare a pet's level value to its item value, albeit unsuccessfully
        let level = 0;
        let levelRegex = /\[Lvl (\d+)\]/;
        let levelMatch = levelRegex.exec(auctionData.item_name);
        if(levelMatch){level = parseInt(levelMatch[1]);}
        return AuctionFinderConfig.petMultiplierTable[auctionType]*Math.pow(2, level/5);
    }
}
