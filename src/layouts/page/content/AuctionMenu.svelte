<script lang="ts">
import AuctionFinder from "../../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionFinderConfig from "../../../scripts/app/config/AuctionFinderConfig";
import AuctionDisplayManager from "../../../scripts/app/render/AuctionDisplayManager";
let flips = [{auction: {auctionData: {item_name: "Aspect of the End", uuid: "lol"}}, min_profit: 5, max_profit: 100000}];
function callback(){
    flips = AuctionFinder.flips.slice(0, AuctionFinderConfig.maxAuctionDisplayCount);
}
function copyAuction(i){
    navigator.clipboard.writeText("/viewauction " + flips[i].auction.auctionData.uuid);
}
AuctionDisplayManager.registerAuctionRenderCallback(callback);
</script>
    
{#each flips as flip, i}
    <div class="auctions">
        <div class="auctionBox">
            <div class="itemData">
                <div class="name">
                    {flip.auction.auctionData.item_name}
                </div>
                <div class="profit">
                    Minimum Expected Profit: {Math.round(flip.min_profit).toLocaleString("en-US")} coins <br>
                    Maximum Expected Profit: {Math.round(flip.max_profit).toLocaleString("en-US")} coins
                </div>
            </div>
            <button class="copy" on:click="{() => copyAuction(i)}">
                Copy Auction
            </button>
        </div>
    </div>
{/each}

<style lang="scss"> 
    .name{
        font-size: 1.6rem;
    }
    .profit{
        font-size: 1.1rem;
    }
    .auctions{
        flex-direction: column;
        border: 0.1rem solid white;
        border-radius: 1rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        margin-left: 1rem;
        margin-right: 1rem;
    }
    .auctionBox{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-left: 2rem;
        margin-right: 2rem;
    }
    .itemData{
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }
    .copy{
        margin-left: 2rem;
        margin-top: 0.5rem;
        max-width: 20rem;
        flex: 1 1 auto;
        background-color: rgb(100, 181, 100);
        color: white;
        border-radius: 0.5rem;
    }
    .copy:hover{
        background-color: rgb(76, 135, 76);
        cursor: pointer;
    }
    .copy:active{
        background-color: rgb(51, 135, 51);
    }
</style>