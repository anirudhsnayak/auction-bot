<script lang="ts">
    import AuctionView from "../page/content/AuctionView.svelte";

</script>



<div class="auctionGrid">
    <AuctionView auctionName="lol">
    </AuctionView>
</div>




<style type="text/scss">
.auctionGrid{
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0.5rem;
}
</style>