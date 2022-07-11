export default class AuctionDisplayManager{
    static displayedAuctions = [];
    static clearAuctions(){
        this.displayedAuctions = [];
    }
    static appendAuction(auction){
        this.displayedAuctions.push(auction);
    }
}