import AuctionQuery from "./AuctionQuery";
import AuctionSeparator from "./AuctionSeparator";
import AuctionEstimatedValue from "./AuctionEstimatedValue";
import AuctionFinderConfig from "../config/AuctionFinderConfig";
export default class AuctionFinder {
    static flips = [];
    static bestAuctions = [];
    static findAuctions(callback) {
        AuctionQuery.updateAuctions().then(combinedAuctions => {
            this.findAuctionsImpl(AuctionSeparator.separateAuctions(combinedAuctions));
            console.log(this.flips);
            callback();
        });
    }
    static findAuctionsImpl(auctions) {
        this.flips = [];
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
                    bin: true,
                    auctionType: auctionTypeParam,
                    uuid: auction.uuid, 
                    auctionCost: auction.starting_bid,
                    auctionBaseValue: valueFunction(auction)
                });
                continue;
            }
            let currentUnixTime = new Date().getTime();
            if(auction.end - currentUnixTime >= AuctionFinderConfig.auctionConsiderationTime){
                auctions.push({
                    bin: false,
                    auctionType: auctionTypeParam,
                    uuid: auction.uuid,
                    auctionCost: Math.max(auction.starting_bid, auction.highest_bid_amount),
                    auctionBaseValue: valueFunction(auction)
                });
            }
        }
        return auctions;
    }
    static findFlips(filteredAuctions){
        console.log(filteredAuctions);
        let auctionSort = filteredAuctions.sort((a, b) => {return a.auctionCost - b.auctionCost;});
        for(let i = 0; i < auctionSort.length; i++){
            let buyoutCount = AuctionFinderConfig.buyoutMax;
            let currentAuction = auctionSort[i];
            let currentBudget = currentAuction.auctionCost;
            let optimalFlipPriceIndex = i;
            //iterate over the remaining array
            for(let j = i + 1; j < auctionSort.length; j++){
                //check if the current auction's base value is greater than the next auction's base value
                if(currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue){
                    if(j != auctionSort.length - 1){
                        optimalFlipPriceIndex = j;
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
                    this.flips.push(
                        {
                            auction: currentAuction,
                            min_profit: (auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost) * 0.99,
                            max_profit: (auctionSort[optimalFlipPriceIndex+1].auctionCost - currentAuction.auctionCost) * 0.99
                        }
                    )
                    break;
                }
            }   
        }
        //all flips have been calculated
    }
}