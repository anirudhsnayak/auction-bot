<script lang="ts">
import AuctionFinder from "../../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionFinderConfig from "../../../scripts/app/config/AuctionFinderConfig";
import AuctionDisplayManager from "../../../scripts/app/render/AuctionDisplayManager";
import AuctionConfig from "../../app/AuctionConfig.svelte";
let flips = []; //[{auction: {auctionData: {bin: true, item_name: "Aspect of the End", uuid: "lol"}}, min_profit: 5, max_profit: 100000}];
function callback(){
    flips = AuctionFinder.queriedFlips.slice(0, AuctionFinderConfig.maxAuctionDisplayCount);
}
function copyAuction(i){
    navigator.clipboard.writeText("/viewauction " + flips[i].auction.auctionData.uuid);
}
function blacklistAuction(i){
    AuctionFinder.blacklistUUID(flips[i].auction.auctionData.uuid);
    flips.splice(i, 1); 
    flips = flips; //force update
}
AuctionDisplayManager.registerAuctionRenderCallback(callback);
</script>
{#if flips.length == 0}
<div class="refreshMessage">
    <p>No flips currently found; refresh to update.</p>
</div>
{/if}
{#each flips as flip, i}
    <div class="auctions">
        <div class="auctionBox">
            <div class="delete">
                <button class = "deleteButton" on:click="{()=>{blacklistAuction(i)}}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20"  height="20" style="fill:white;" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                </button>
            </div>
            <div class="itemData">
                <div class="name">
                    {flip.auction.auctionData.item_name}
                    {#if flip.auction.auctionData.bin}
                    <div class="auctionType bin">
                        BIN
                    </div>
                    {:else}
                    <div class="auctionType auction">
                        AUCTION
                    </div>
                    {/if}
                </div>
                <div class="profit">
                    Price: {Math.round(flip.auction.auctionCost).toLocaleString("en-US")} coins <br>
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
    .refreshMessage{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        text-align: center;
    }
    .delete{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        border: none;
        margin: 0;
    }
    .deleteButton{
        height: 90%;
        width: 75%;
        border: none;
        background: rgb(247, 45, 86);
        margin: 0;
    }
    .deleteButton:hover{
        background: rgb(215, 43, 77);
        cursor: pointer;
    }
    .deleteButton:active{
        background: rgb(192, 12, 48);
    }
    .name{
        display: flex;
        flex-direction: row;
        align-items: center;
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
        display: grid;
        grid-template-columns: 3.5rem max-content auto minmax(5rem, 20rem);
        grid-template-areas: "delete itemdata empty copy";
        margin-left: 0.5rem;
        margin-right: 2rem;
    }
    .itemData{
        grid-area: itemdata;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }
    .copy{
        grid-area: copy;
        margin-left: 2rem;
        margin-top: 0.5rem;
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
    .auctionType{
        margin-left: 0.75rem;
        border: 1.75px solid white;
        border-radius: 0.5rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        font-size: 1.2rem;
    }
    .bin{
        background: green;
    }
    .auction{
        background: crimson;
    }
</style>