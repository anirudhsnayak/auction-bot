import AuctionFinderConfig from "../config/AuctionFinderConfig";

export default class AuctionQuery {
    static timeDelay = 100; //just to be safe :)
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async updateAuctions(){
        let combinedAuctions = [];
        let response = await fetch('https://api.hypixel.net/skyblock/auctions?page=0');
        let data = await response.json();
        let totalPages = data["totalPages"];
        totalPages = Math.min(totalPages, AuctionFinderConfig.maxPageQueries);
        console.log("Querying " + totalPages + " Pages");
        for(let i = 0; i<totalPages; i++){
            console.log("Loading Page " + (i+1) + " of " + totalPages);
            let response = await fetch('https://api.hypixel.net/skyblock/auctions?page='+String(i))
            let data = await response.json()
            for(let auction of data["auctions"]){
                combinedAuctions.push(auction);
            }
            //iterate over the auctions, deleting ["item_bytes"] from each one
            for(let j = 0; j<combinedAuctions[i].length; j++){
                delete combinedAuctions[i][j].item_bytes;
            } //saves so much memory
            await AuctionQuery.sleep(AuctionQuery.timeDelay); 
        }
        //console.log(combinedAuctions); //rip internet
        return combinedAuctions;
    }
    // static queryAuctionPage(page){
    //     fetch('https://api.hypixel.net/skyblock/auctions?page='+String(page))
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log(data)
    //         }
    //     )
    // }        
}  