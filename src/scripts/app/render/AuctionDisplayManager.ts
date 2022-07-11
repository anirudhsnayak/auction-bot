export default class AuctionDisplayManager{
    static callback;
    static registerAuctionRenderCallback(callbackParam){
        this.callback = callbackParam;
    }
    static updateAuctionRender(){
        this.callback();
    }
}