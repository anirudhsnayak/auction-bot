export default class AuctionDisplayManager{
    static auctionRenderCallback;
    static registerAuctionRenderCallback(callback){
        this.auctionRenderCallback = callback;
    }
    static updateAuctionRender(){
        this.auctionRenderCallback();
    }
}