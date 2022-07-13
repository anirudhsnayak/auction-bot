import AuctionQuery from "./AuctionQuery";
import AuctionSeparator from "./AuctionSeparator";
import AuctionEstimatedValue from "./AuctionEstimatedValue";
import AuctionFinderConfig from "../config/AuctionFinderConfig";
/*
    This class can be improved in the future.
    It's the core algorithm to find the best flips.

    Potential improvements: (not just in this class)
    - MAKE ANOTHER WATCHLIST FOR SKINS!!!!!!
    - Figure out a way to deal with undervalued items bought from NPCs
    - Display Flip Results Separately (commodities tend to be more reliable than other items)
    - Sort using one name for an armor set (instead of listing all of them)
    - Sort using one name for a set of enchanted books (instead of listing all of them)
    - ALL weapons should be checked separately for 5 stars
    - Remove things that are in bazaar from check list
    - Account for weapon/armor kills
    - Account for upgraded armor (like with scarf frags)
    - Add MORE items to the flip list
    - Stacked Items
    - Account for tier boosts
    - Upgrade flipping?
    - Better pet calculation
    - Master Stars 
    - etc...
*/
export default class AuctionFinder {
    static flips = [];
    static bestAuctions = [];
    static cachedAuctions = {};
    static findAuctions(callback) {
        AuctionQuery.updateAuctions().then(combinedAuctions => {
            this.cachedAuctions = AuctionSeparator.separateAuctions(combinedAuctions);
            this.queryAuctions(callback);
        });
    }
    static compareFlips(a, b) {
        if(AuctionFinderConfig.sortCriteria === "Profit"){
            return b.max_profit - a.max_profit;
        }
        if(AuctionFinderConfig.sortCriteria === "Efficiency"){
            return (b.max_profit/b.auction.auctionCost) - (a.max_profit/a.auction.auctionCost);
        } 
        return b.max_profit - a.max_profit;
    }
    static queryAuctions(callback){
        this.findAuctionsImpl(this.cachedAuctions);
        //sort flips by max profit
        this.flips.sort(this.compareFlips);
        console.log(this.flips);
        callback();
    }
    static findAuctionsImpl(auctions) {
        this.flips = [];
        this.bestAuctions = [];
        let petAuctions = auctions.petAuctions;
        let commodityAuctions = auctions.commodityAuctions;
        let talismanAuctions = auctions.talismanAuctions;
        let upgradableAuctions = auctions.upgradableAuctions;
        
        if(AuctionFinderConfig.shownItems.pets){
            this.findAuctionsCategory(petAuctions, AuctionEstimatedValue.getPetBaseValue);
        }
        if(AuctionFinderConfig.shownItems.commodities){
            this.findAuctionsCategory(commodityAuctions, AuctionEstimatedValue.getCommodityBaseValue);
        }
        if(AuctionFinderConfig.shownItems.talismans){
            this.findAuctionsCategory(talismanAuctions, AuctionEstimatedValue.getTalismanBaseValue);
        }
        if(AuctionFinderConfig.shownItems.upgradables){
            this.findAuctionsCategory(upgradableAuctions, AuctionEstimatedValue.getUpgradableBaseValue);
        }
    }
    static findAuctionsCategory(auctions, valueFunction){
        for(let key in auctions){
            this.findFlips(this.filterAuctions(key, auctions[key], valueFunction));
        }
    }
    static filterAuctions(auctionTypeParam, auctionListing, valueFunction){
        let auctions = [];
        for(let auction of auctionListing){
            if(auction.bin){
                auctions.push({
                    auctionType: auctionTypeParam,
                    auctionData: auction,
                    auctionCost: auction.starting_bid,
                    auctionBaseValue: valueFunction(auction, auctionTypeParam)
                });
            } else {
                if(AuctionFinderConfig.acceptRawAuctions){
                    let currentUnixTime = new Date().getTime();
                    if(auction.end - currentUnixTime <= AuctionFinderConfig.auctionConsiderationTime){
                        auctions.push({
                            auctionType: auctionTypeParam,
                            auctionData: auction,
                            auctionCost: Math.max(auction.starting_bid, auction.highest_bid_amount),
                            auctionBaseValue: valueFunction(auction, auctionTypeParam)
                        });
                    }
                }
            }
        }
        return auctions;
    }
    static findFlips(filteredAuctions){
        let maxValue = -1;
        //console.log(filteredAuctions);
        let auctionSort = filteredAuctions.sort((a, b) => {return a.auctionCost - b.auctionCost;});
        for(let i = 0; i < auctionSort.length; i++){
            let buyoutCount = AuctionFinderConfig.buyoutMax;
            let currentAuction = auctionSort[i];
            let currentBudget = currentAuction.auctionCost;
            let optimalFlipPriceIndex = i;
            let priceCeiling = Number.MAX_SAFE_INTEGER;
            if(currentBudget > AuctionFinderConfig.budget){
                break; //clearly everything after this exceeds our budget
            }
            if(maxValue < currentAuction.auctionBaseValue){  
                if(currentAuction.auctionData.bin){ //bins are used as reference
                    maxValue = currentAuction.auctionBaseValue;
                }
            } else {
                continue;
            }
            //iterate over the remaining array
            for(let j = i + 1; j < auctionSort.length; j++){
                if(!auctionSort[j].auctionData.bin){
                    continue; //skip non-bin auctions
                }
                //check if the current auction's base value is greater than the next auction's base value
                if(currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue){
                    //check to see if it's worth it
                    if(auctionSort[j].auctionCost < priceCeiling){
                        optimalFlipPriceIndex = j;
                        priceCeiling = Math.min(priceCeiling, 
                            auctionSort[j].auctionCost - auctionSort[j].auctionBaseValue + currentAuction.auctionBaseValue);         
                    }
                    continue; //keep moving
                } 
                buyoutCount--; //attempt a buyout
                if(AuctionFinderConfig.considerBuyoutBudget){
                    currentBudget += auctionSort[j].auctionCost;
                    if(currentBudget > AuctionFinderConfig.budget){
                        buyoutCount = 0; //buyout failed
                    } 
                }
                if(buyoutCount <= 0){ //buyout finished!
                   break; //no more buyouts left, time to calculate how much profit we could make
                }
            }   
            if(optimalFlipPriceIndex == auctionSort.length-1){  //we are worth more than all the other auctions
                this.bestAuctions.push(currentAuction);
                continue;
            }
            let min_profit_ = 0.98*auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost;
            let max_profit_ = 0.98*auctionSort[optimalFlipPriceIndex+1].auctionCost - currentAuction.auctionCost;
            if(max_profit_ < AuctionFinderConfig.profitCriteria){continue;} //we don't fit the criteria
            this.flips.push({
                auction: currentAuction,
                min_profit: min_profit_,
                max_profit: max_profit_
            });
        }
        //all flips have been calculated
    }
}