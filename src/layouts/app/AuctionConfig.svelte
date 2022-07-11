<script lang="ts">
import AuctionFinder from "../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionQuery from "../../scripts/app/AuctionFinder/AuctionQuery";
import AuctionDisplayManager from "../../scripts/app/render/AuctionDisplayManager";
let active = "active";
let loadingPercent = 0; 
function queryAuction(){
    if(active === "inactive"){
        return;
    }
    active = "inactive";
    console.log("Refreshing...")
    AuctionFinder.findAuctions(renderAuctions);
}
function renderAuctions(){
    active = "active";
    console.log("Refreshed!");
    AuctionDisplayManager.updateAuctionRender();
    setTimeout(()=>{loadingPercent = 0;}, 500);
}
function updateProgress(fractionPagesLoaded){
    loadingPercent = Math.round(fractionPagesLoaded * 100);
    //loadingPercent = 100*((Math.round(fractionPagesLoaded*10)+1)/11);
}
AuctionQuery.registerProgressCallback(updateProgress);
</script>

<div class="button-container">
    <button class="refreshButton {active}" on:click="{queryAuction}">
        <p class="refreshText">
        {#if active==="active"}
            Refresh
        {:else}
            Refreshing...
        {/if}
        </p>
    </button>
</div>
<div class="progressBar {active}" style="width: {loadingPercent}%">

</div>

<style lang="scss">
    .refreshButton.inactive{
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
    .refreshButton.active:hover{
        background: rgb(21, 128, 163);
        cursor: pointer;
    }
    .refreshButton.active:active{
        background: rgb(0, 106, 106);
    }
    .refreshText{ 
        font-family: "Helvetica";
        font-size: 2rem;
        color: white;
    }
    .progressBar{
        background: lime;
        height: 10px;
        position: fixed;
        bottom: 0;
        margin-left: -1rem;
        transition: width 0s;
    }
    .progressBar.inactive{
        opacity: 100%;
        transition: opacity 0.5s, width 1.5s;
    }
    .progressBar.active{
        opacity: 0%; //might need to make its display hiddem
        transition: opacity 0.5s;
    }
</style>