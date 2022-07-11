<script lang="ts">
import AuctionFinder from "../../scripts/app/AuctionFinder/AuctionFinder";


function callback(){
    console.log("Refreshed!");
}

function queryAuction(){
    console.log("Refreshing...")
    AuctionFinder.findAuctions(callback);
}
</script>


<button class="refreshButton">
<p class="refreshText" on:click="{queryAuction}">Refresh</p>
</button>


<style lang="scss">
    //Style for button
    .refreshButton{
        height: 5rem;
        background: rgb(83, 152, 175);
        padding-left: 3rem;
        padding-right: 3rem;
        margin-left: 0.5rem;
        border-radius: 1.5rem;
        border: 1.5px solid white;
    }
    .refreshButton:hover{
        background: rgb(21, 128, 163);
        cursor: pointer;
    }
    .refreshText{ 
        font-family: "Helvetica";
        font-size: 3rem;
        color: white;
    }
</style>