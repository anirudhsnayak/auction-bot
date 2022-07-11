import AuctionFinderConfig from "../config/AuctionFinderConfig";
export default class AuctionSeparator{
    static commodityAuctions = {};
    static upgradableAuctions = {};
    static talismanAuctions = {};
    static petAuctions = {};
    static otherAuctions = [];
    //TODO: Simplify a lot
    static separateAuctions(auctions){ 
        for(let auction of auctions){
           let exit = false;
           if(this.checkPet(auction)){
                for(let petType of AuctionFinderConfig.petWatchlist){
                    if(auction.item_name.includes(petType)){
                        if(petType in this.petAuctions){
                            this.petAuctions[petType].push(auction);
                        } else {
                            this.petAuctions[petType] = [auction];
                        }
                        break;
                    }
                }
                continue;
            }
            for(let commodityType of AuctionFinderConfig.commodityWatchlist){
                if(this.identifyAuction(auction, commodityType)){
                    if(commodityType in this.commodityAuctions){
                        this.commodityAuctions[commodityType].push(auction);
                    } else {
                        this.commodityAuctions[commodityType] = [auction];
                    }
                    exit = true;
                    break;
                }
            }
            if(exit){continue;}
            for(let talismanType of AuctionFinderConfig.talismanWatchlist){
                if(this.identifyAuction(auction, talismanType)){
                    if(talismanType in this.talismanAuctions){
                        this.talismanAuctions[talismanType].push(auction);
                    } else {
                        this.talismanAuctions[talismanType] = [auction];
                    }
                    exit = true;
                    break;
                }
            }
            if(exit){ continue; }
            for(let upgradableType of AuctionFinderConfig.upgradableWatchlist){
                if(this.identifyAuction(auction, upgradableType)){
                    if(upgradableType in this.upgradableAuctions){
                        this.upgradableAuctions[upgradableType].push(auction);
                    } else {
                        this.upgradableAuctions[upgradableType] = [auction]; 
                    } 
                    exit = true;
                    break;
                }
            }
            if(exit){ continue; }
            this.otherAuctions.push(auction);
        }
        return {
            commodityAuctions: this.commodityAuctions,
            upgradableAuctions: this.upgradableAuctions,
            talismanAuctions: this.talismanAuctions,
            petAuctions: this.petAuctions,
            otherAuctions: this.otherAuctions
        }
    }
    static checkPet(auction){
        return auction.item_name.includes("Lvl");
    }
    /* TODO: make sure to add a check for tier boost/recomb? */
    static identifyAuction(auction, itemType){
        let itemName = itemType;
        if(itemType.startsWith("!")){
            let spaceIndex = itemType.indexOf(" ");
            let rarity = itemType.substring(1, spaceIndex);
            if(rarity != auction.tier){
                return false;
            }
            itemName = itemName.substring(spaceIndex+1);
        }
        return auction.item_name.includes(itemName);
    }
}