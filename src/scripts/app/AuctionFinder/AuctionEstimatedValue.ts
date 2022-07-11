import AuctionFinderConfig from "../config/AuctionFinderConfig";

export default class AuctionEstimatedValue{
    static getPetBaseValue(auctionData, auctionType){
        //TODO: implement
        return this.getLoreValue(auctionData) + this.getPetLevelValue(auctionData, auctionType);
    }
    static getUpgradableBaseValue(auctionData, auctionType){
        return this.getLoreValue(auctionData) + this.getNameValue(auctionData);
    }
    static getTalismanBaseValue(auctionData, auctionType){
        return this.getLoreValue(auctionData);
    }
    static getCommodityBaseValue(auctionData, auctionType){
        return 0; //what do you expect me to do
    }
    static getLoreValue(auctionData){
        let loreValue = 0; 
        for(let key of AuctionFinderConfig.loreValueTable){
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
    static getNameValue(auctionData){
        let nameValue = 0;
        for(let key of AuctionFinderConfig.nameValueTable){
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
