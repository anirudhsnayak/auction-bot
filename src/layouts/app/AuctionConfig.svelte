<script lang="ts">
import AuctionFinder from "../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionDisplayManager from "../../scripts/app/render/AuctionDisplayManager";
let active = "active";
function queryAuction(){
    active = "inactive";
    console.log("Refreshing...")
    AuctionFinder.findAuctions(callback);
}
function callback(){
    active = "active";
    console.log("Refreshed!");
    AuctionDisplayManager.updateAuctionRender();
}
</script>

<div class="button-container">
    <button class="refreshButton {active}">
        <p class="refreshText" on:click="{queryAuction}">
        {#if active==="active"}
            Refresh
        {:else}
            Refreshing...
        {/if}
        </p>
    </button>
</div>


<style lang="scss">
    .inactive.inactive{
        background: rgb(188, 9, 9);
    }
    .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    //Style for button
    .refreshButton{
        height: 4rem;
        background: darkcyan;
        padding-left: 4rem;
        padding-right: 4rem;
        margin-left: 0.5rem;
        border-radius: 1.5rem;
        border: 1.5px solid white;
    }
    .active:hover{
        background: rgb(21, 128, 163);
        cursor: pointer;
    }
    .active:active{
        background: rgb(0, 106, 106);
    }
    .refreshText{ 
        font-family: "Helvetica";
        font-size: 2rem;
        color: white;
    }
</style>