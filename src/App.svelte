<script>
	import AuctionHeader from "./layouts/app/AuctionHeader.svelte";
	import AuctionConfig from "./layouts/app/AuctionConfig.svelte";
	import AuctionMenu from "./layouts/page/content/AuctionMenu.svelte";
</script>


<div class="content">
	<AuctionHeader></AuctionHeader>
	<AuctionConfig></AuctionConfig>
	<AuctionMenu></AuctionMenu>
</div>

<style type="text/scss">
	@import "./styles/pageSetup.scss";
	:global(body) {
		background: #292929;
	}
	.content{
		margin-left: 1rem;
		color: white;
	}
</style>

