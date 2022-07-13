import AuctionQuery from "./AuctionQuery";
import AuctionSeparator from "./AuctionSeparator";
import AuctionEstimatedValue from "./AuctionEstimatedValue";
import AuctionFinderConfig from "../config/AuctionFinderConfig";
/*
    This class can be improved in the future.
    It's the core algorithm to find the best flips.

    Potential improvements: (not just in this class)
    - MAKE ANOTHER WATCHLIST FOR SKINS!!!!!!
    - DON'T RECALCULATE FLIPS FOR EACH QUERY. Cache the flip list, and then sort results based on query.
    - Use historical prices as a better "price ceiling", if possible
    - Efficient separation while server is sending AH data
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
    static queriedFlips = [];
    static bestAuctions = [];
    static findAuctions(callback) {
        AuctionQuery.updateAuctions().then(combinedAuctions => {
            this.findAuctionsImpl(AuctionSeparator.separateAuctions(combinedAuctions));
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
        //copy flips
        this.queriedFlips = [];
        for(let flip of this.flips){
           if(this.checkFlipMatchesQuery(flip)){
               this.queriedFlips.push(flip);
           }
        }
        this.queriedFlips.sort(this.compareFlips);
        console.log(this.queriedFlips);
        callback();
    }
    static checkFlipMatchesQuery(flip){
        if(flip.auction.auctionCost > AuctionFinderConfig.budget){
            return false;
        }
        if(flip.max_profit < AuctionFinderConfig.profitCriteria){
            return false;
        }
        switch(flip.category){
            case "Pet":
                if(!AuctionFinderConfig.shownItems.pets){return false;}
                break;
            case "Commodity":
                if(!AuctionFinderConfig.shownItems.commodities){return false;}
                break;
            case "Talisman":
                if(!AuctionFinderConfig.shownItems.talismans){return false;}
                break;
            case "Upgradable":
                if(!AuctionFinderConfig.shownItems.upgradables){return false;}
                break;
            default:
                return false;
        }
        return true;
    }
    static findAuctionsImpl(auctions) {
        this.flips = [];
        this.bestAuctions = [];
        let petAuctions = auctions.petAuctions;
        let commodityAuctions = auctions.commodityAuctions;
        let talismanAuctions = auctions.talismanAuctions;
        let upgradableAuctions = auctions.upgradableAuctions;
        
        this.findAuctionsCategory(petAuctions, AuctionEstimatedValue.getPetBaseValue, "Pet");
        this.findAuctionsCategory(commodityAuctions, AuctionEstimatedValue.getCommodityBaseValue, "Commodity");
        this.findAuctionsCategory(talismanAuctions, AuctionEstimatedValue.getTalismanBaseValue, "Talisman");
        this.findAuctionsCategory(upgradableAuctions, AuctionEstimatedValue.getUpgradableBaseValue, "Upgradable");
    }
    static findAuctionsCategory(auctions, valueFunction, category){
        for(let key in auctions){
            this.findFlips(this.filterAuctions(key, auctions[key], valueFunction), category);
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
    static findFlips(filteredAuctions, category_){
        let maxValue = -1;
        //console.log(filteredAuctions);
        let auctionSort = filteredAuctions.sort((a, b) => {return a.auctionCost - b.auctionCost;});
        for(let i = 0; i < auctionSort.length; i++){ 
            let currentAuction = auctionSort[i];
            let optimalFlipPriceIndex = i;
            let priceCeiling;  
            // if(currentBudget > AuctionFinderConfig.budget){
            //     break; //clearly everything after this exceeds our budget
            // }
            if(maxValue < currentAuction.auctionBaseValue){  
                if(i == auctionSort.length - 1){
                    this.bestAuctions.push(currentAuction); //to avoid out of bounds error
                    continue;
                }
                if(currentAuction.auctionData.bin){ //bins are used as reference
                    maxValue = currentAuction.auctionBaseValue;
                }
            } else {
                continue;
            }
            if(i == 0){
                priceCeiling = auctionSort[i+1].auctionCost - auctionSort[i+1].auctionBaseValue + currentAuction.auctionBaseValue;
            } else {
                priceCeiling = auctionSort[i-1].auctionCost - auctionSort[i-1].auctionBaseValue + currentAuction.auctionBaseValue;
            } 
            //iterate over the remaining array
            for(let j = i + 1; j < auctionSort.length; j++){
                if(!auctionSort[j].auctionData.bin){
                    continue; //skip non-bin auctions
                }
                if(auctionSort[j].auctionCost > priceCeiling){
                    break; //clearly everything after this is more expensive 
                }
                if(currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue){
                    optimalFlipPriceIndex = j;
                } else {
                    break; //unlikely that this auction is better than the one which is valued higher
                }
            }   
            if(optimalFlipPriceIndex == auctionSort.length-1){  //we are worth more than all the other auctions
                this.bestAuctions.push(currentAuction);
                continue;
            }
            let min_profit_ = 0.98*auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost;
            let max_profit_ = 0.98*auctionSort[optimalFlipPriceIndex+1].auctionCost - currentAuction.auctionCost;
            max_profit_ = Math.min(priceCeiling-currentAuction.auctionCost, max_profit_); //ensure flips by one gap aren't overvalued
            // if(max_profit_ < AuctionFinderConfig.profitCriteria){continue;} //we don't fit the criteria
            this.flips.push({
                auction: currentAuction,
                min_profit: min_profit_,
                max_profit: max_profit_,
                category: category_
            });
        }
        //all flips have been calculated
    }
}