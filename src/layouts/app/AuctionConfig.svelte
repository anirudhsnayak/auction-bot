<script lang="ts">
import AuctionFinder from "../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionQuery from "../../scripts/app/AuctionFinder/AuctionQuery";
import AuctionFinderConfig from "../../scripts/app/config/AuctionFinderConfig";
import AuctionDisplayManager from "../../scripts/app/render/AuctionDisplayManager";
let active = true;
let loadingPercent = 0;
let budgetInput = "1,000,000"; 
let maxDisplay = "10";
function cleanIntInput(input){
    //remove all commas
    let cleanedInput = input.replace(/,/g, "");
    //convert to int
    cleanedInput = parseInt(cleanedInput);
    return cleanedInput;
}
function queryAuction(){
    if(!active){return;}
    active = false;
    AuctionFinderConfig.updateConfig({
        budget: cleanIntInput(budgetInput),
        maxAuctionDisplayCount: cleanIntInput(maxDisplay)
    });
    console.log("Refreshing...")
    AuctionFinder.findAuctions(renderAuctions);
}
function renderAuctions(){
    active = true;
    console.log("Refreshed!");
    AuctionDisplayManager.updateAuctionRender();
    setTimeout(()=>{loadingPercent = 0;}, 500);
}
function updateProgress(fractionPagesLoaded){
    loadingPercent = Math.round(fractionPagesLoaded * 100);
}
function getActiveClass(check){
    return check ? "active" : "inactive";
}
AuctionQuery.registerProgressCallback(updateProgress);
</script>

<div class="config">
    <div class="config-title">Configuration:</div> 
    <div class="config-menu">
        <div class="budget">
            Budget: <input class ="input budgetInput" type="text" bind:value="{budgetInput}"/> 
        </div>
        <div class="maxDisplay">
            Max Flips Displayed: <input class ="input maxDisplayInput" type="text" bind:value="{maxDisplay}"/>
        </div>
    </div>
</div>
<div class="button-container">
    <button class="refreshButton {getActiveClass(active)}" on:click="{queryAuction}">
        <p class="refreshText">{#if active} Refresh {:else} Refreshing...{/if}</p>
    </button>
</div>
<div class="progressBar {getActiveClass(active)}" style="width: {loadingPercent}%"></div>

<style lang="scss">
    .config{
        font-size: 1.5rem;
        margin-left: 1rem;
    }
    .config-title{
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    .config-menu{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 0.5rem;
    }
    .input{
        height: 2.5rem;
        border: 0.25rem solid white;
        border-radius: 0.25rem;
        margin-left: 0.25rem;
        padding: 0.25rem;
        margin-right: 1rem;
    }
    .budgetInput{
        width: 11rem;
    }
    .maxDisplayInput{
        width: 3rem;
    }
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
        height: 3.5rem;
        background: darkcyan;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
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
        font-size: 1.75rem;
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