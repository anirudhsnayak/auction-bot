<script lang="ts">
import AuctionFinder from "../../scripts/app/AuctionFinder/AuctionFinder";
import AuctionQuery from "../../scripts/app/AuctionFinder/AuctionQuery";
import AuctionFinderConfig from "../../scripts/app/config/AuctionFinderConfig";
import AuctionDisplayManager from "../../scripts/app/render/AuctionDisplayManager";
let active = true;
let loadingPercent = 0;
let budgetInput = "5,000,000"; 
let maxDisplay = "20";
let profitCriteria = "100,000";
let sortCriteria = "Efficiency";
let shownItems = {
    pets: true,
    commodities: true,
    talismans: true,
    upgradables: true
}
function cleanIntInput(input){
    //remove all commas
    let cleanedInput = input.replace(/,/g, "");
    //convert to int
    cleanedInput = parseInt(cleanedInput);
    return cleanedInput;
}
function updateConfig(){
    AuctionFinderConfig.updateConfig({
        budget: cleanIntInput(budgetInput),
        maxAuctionDisplayCount: cleanIntInput(maxDisplay),
        profitCriteria: cleanIntInput(profitCriteria),
        sortCriteria: sortCriteria,
        shownItems: shownItems
    });
}
function refreshAuction(){
    if(!active){return;}
    active = false;
    updateConfig();
    console.log("Refreshing...")
    AuctionFinder.findAuctions(renderAuctions);
}
function queryAuction(){
    updateConfig();
    console.log("Querying...")
    AuctionFinder.queryAuctions(() => {
        console.log("Queried!")
        AuctionDisplayManager.updateAuctionRender();
    });
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
        <div class="field">
            Budget: <input class ="input budgetInput" type="text" bind:value="{budgetInput}"/> 
        </div>
        <div class="field">
            Profit Criteria: <input class ="input profitCriteriaInput" type="text" bind:value="{profitCriteria}"/>
        </div>
        <div class="field">
            Max Flips Displayed: <input class ="input maxDisplayInput" type="text" bind:value="{maxDisplay}"/>
        </div>
        <div class="field">
            Sort Criteria: <select class ="input filterCriteriaInput" bind:value="{sortCriteria}">
                <option value="Efficiency">Efficiency</option>
                <option value="Profit">Profit</option>
            </select>
        </div>
        <div class="field">
            <span class="showTitle">Show:</span>
        </div>
        <div class="field">
            Pets <input type="checkbox" class="check" name="showPets" bind:checked="{shownItems.pets}"/>
        </div>
        <div class="field">  
            Commodities <input type="checkbox" class="check" name="showCommodities" bind:checked="{shownItems.commodities}"/>
        </div>
        <div class="field">
            Talismans <input type="checkbox" class="check" name="showTalismans" bind:checked="{shownItems.talismans}"/>
        </div>    
        <div class="field">    
            Upgradables <input type="checkbox" class="check" name="showUpgradables" bind:checked="{shownItems.upgradables}"/>
        </div>
    </div>
</div>
<div class="button-container">
    <button class="button queryButton" on:click="{queryAuction}">
        <p class="buttonText">Query</p>
    </button>
    <button class="button refreshButton {getActiveClass(active)}" on:click="{refreshAuction}">
        <p class="buttonText">{#if active} Refresh {:else} Refreshing...{/if}</p>
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
    .field{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .check{
        width: 2rem;
        height: 2rem;
        margin-bottom: 0rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
    .showTitle{
        margin-right: 0.5rem;
    }
    .input{
        height: auto;
        border: 0.25rem solid white;
        border-radius: 0.25rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        margin-right: 1rem;
        margin-bottom: 0rem;
    }
    .budgetInput{
        width: 11rem;
    }
    .maxDisplayInput{
        width: 3rem;
    }
    .profitCriteriaInput{
        width: 9rem;
    }

    .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    .button{
        height: 3.5rem;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        margin-left: 0.5rem;
        border-radius: 1.5rem;
        border: 1.5px solid white;
    }
    .button.inactive{
        background: rgb(188, 9, 9);
    }
    .queryButton{
        background: rgb(206, 137, 8);
    }
    .queryButton:hover{
        background: rgb(180, 117, 0);
        cursor: pointer;
    }
    .queryButton:active{
        background: rgb(158, 103, 0);
    }
    .refreshButton{
        background: darkcyan; 
    }
    .refreshButton.active:hover{
        background: rgb(21, 128, 163);
        cursor: pointer;
    }
    .refreshButton.active:active{
        background: rgb(0, 106, 106);
    }
    .buttonText{
        font-family: "Helvetica";
        font-size: 1.75rem;
        color: white;
    }

    //Progress Bar
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