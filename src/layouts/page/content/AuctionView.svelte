<script lang="ts">
import AuctionImageURL from "../../../scripts/app/AuctionImageURL";
import HypixelQuery from "../../../scripts/app/AuctionFinder/AuctionQuery";
export let auctionName = "none";
let imageURL = AuctionImageURL.getURL(auctionName);
let auctions = [];
//create a new Auction object
let sampleAuction = {"itemType":"pog"};
auctions.push(sampleAuction);
auctions.push(sampleAuction);
auctions.push(sampleAuction);
auctions.push(sampleAuction);

</script>



{#each auctions as auction, i}
    <div class=auctionBox>
        <div class="name">
            {auction.itemType}
        </div>
        <img class = "image" src="{AuctionImageURL.getURL(auction.itemType)}" alt="error">
        <div class="profit">
            {auction.profit}
        </div>
    </div>
{/each}

<style lang="scss"> 
    .name{
        font-size: 2.5rem;
    }
    .profit{

    }
    .image{
        pointer-events: none;
    }
    .auctionBox{
        border: 0.1rem solid white;
        border-radius: 1rem;
        flex: 0 1 200px;
        padding: 0.5rem;
        padding-top: 0.25rem;
    }
</style>