import AuctionQuery from "./AuctionQuery";
import AuctionSeparator from "./AuctionSeparator";
import AuctionEstimatedValue from "./AuctionEstimatedValue";
import AuctionFinderConfig from "../config/AuctionFinderConfig";
/*
    This class can be improved in the future.
    It's the core algorithm to find the best flips.

    Potential improvements: (not just in this class)
    - Account for tier boosts
    - Upgrade flipping?
    - Better pet calculation
    - Master Stars 
    - etc...
*/
export default class AuctionFinder {
    static flips = [];
    static bestAuctions = [];
    static findAuctions(callback) {
        AuctionQuery.updateAuctions().then(combinedAuctions => {
            this.findAuctionsImpl(AuctionSeparator.separateAuctions(combinedAuctions));
            //sort flips by max profit
            this.flips.sort((a, b) => {return b.max_profit - a.max_profit;});
            console.log(this.flips);
            callback();
        });
    }
    static findAuctionsImpl(auctions) {
        this.flips = [];
        this.bestAuctions = [];
        let petAuctions = auctions.petAuctions;
        let commodityAuctions = auctions.commodityAuctions;
        let talismanAuctions = auctions.talismanAuctions;
        let upgradableAuctions = auctions.upgradableAuctions;
        
        this.findAuctionsCategory(petAuctions, AuctionEstimatedValue.getPetBaseValue);
        this.findAuctionsCategory(commodityAuctions, AuctionEstimatedValue.getCommodityBaseValue);
        this.findAuctionsCategory(talismanAuctions, AuctionEstimatedValue.getTalismanBaseValue);
        this.findAuctionsCategory(upgradableAuctions, AuctionEstimatedValue.getUpgradableBaseValue);
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
                continue;
            }
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
            let priceCeiling = 0;
            if(currentBudget > AuctionFinderConfig.budget){
                break;
            }
            //iterate over the remaining array
            for(let j = i + 1; j < auctionSort.length; j++){
                //check if the current auction's base value is greater than the next auction's base value
                if(currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue){
                    if(j != auctionSort.length - 1){
                        //check to see if it's worth it
                        if(auctionSort[j].auctionCost < priceCeiling){
                            optimalFlipPriceIndex = j;
                            priceCeiling = Math.max(priceCeiling, 
                                auctionSort[j].auctionCost - auctionSort[j].auctionBaseValue + currentAuction.auctionBaseValue);         
                        }
                        continue; //keep moving
                    }
                    //we are worth more than all the other auctions
                    this.bestAuctions.push(currentAuction);
                    break;
                } 
                //time to compare
                buyoutCount--; //attempt a buyout
                if(AuctionFinderConfig.considerBuyoutBudget){
                    currentBudget += auctionSort[j].auctionCost;
                    if(currentBudget > AuctionFinderConfig.budget){
                        buyoutCount = 0; //buyout failed
                    } 
                }
                //buyout finished!
                if(buyoutCount <= 0){
                    //no more buyouts left, time to calculate how much profit we could make
                    if(!currentAuction.auctionData.bin){
                        //AH prices are volatile, we don't want to restrict ourselves
                        this.flips.push({
                            auction: currentAuction,
                            min_profit: (0.98*auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost),
                            max_profit: (0.98*auctionSort[optimalFlipPriceIndex+1].auctionCost - currentAuction.auctionCost)
                        });
                        break;
                    }
                    if(maxValue < currentAuction.auctionBaseValue){ 
                        //this auction is not a fake (hopefully), since you could just flip the cheaper auction otherwise
                        maxValue = currentAuction.auctionBaseValue;
                        this.flips.push({
                            auction: currentAuction,
                            min_profit: (0.98*auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost),
                            max_profit: (0.98*auctionSort[optimalFlipPriceIndex+1].auctionCost - currentAuction.auctionCost)
                        });
                        break;
                    } 
                }
            }   
        }
        //all flips have been calculated
    }
}