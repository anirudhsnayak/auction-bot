import AuctionFinderConfig from "../config/AuctionFinderConfig";

export default class AuctionEstimatedValue{
    static getPetBaseValue(auctionData){
        //TODO: implement
        return 0;
    }
    static getUpgradableBaseValue(auctionData){
        return 0;
    }
    static getTalismanBaseValue(auctionData){
        return this.getLoreValue(auctionData);
    }
    static getCommodityBaseValue(auctionData){
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
        
    }
}
