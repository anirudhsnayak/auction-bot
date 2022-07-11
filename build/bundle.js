var app=function(){"use strict";function t(){}function e(t){return t()}function i(){return Object.create(null)}function n(t){t.forEach(e)}function a(t){return"function"==typeof t}function o(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function r(t,e){t.appendChild(e)}function s(t,e,i){t.insertBefore(e,i||null)}function l(t){t.parentNode.removeChild(t)}function u(t){return document.createElement(t)}function c(t){return document.createTextNode(t)}function d(){return c(" ")}function f(t,e,i,n){return t.addEventListener(e,i,n),()=>t.removeEventListener(e,i,n)}function h(t,e,i){null==i?t.removeAttribute(e):t.getAttribute(e)!==i&&t.setAttribute(e,i)}function p(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function m(t,e,i,n){t.style.setProperty(e,i,n?"important":"")}let g;function A(t){g=t}const S=[],b=[],y=[],E=[],k=Promise.resolve();let C=!1;function R(t){y.push(t)}const v=new Set;let B=0;function T(){const t=g;do{for(;B<S.length;){const t=S[B];B++,A(t),L(t.$$)}for(A(null),S.length=0,B=0;b.length;)b.pop()();for(let t=0;t<y.length;t+=1){const e=y[t];v.has(e)||(v.add(e),e())}y.length=0}while(S.length);for(;E.length;)E.pop()();C=!1,v.clear(),A(t)}function L(t){if(null!==t.fragment){t.update(),n(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}const D=new Set;function x(t,e){t&&t.i&&(D.delete(t),t.i(e))}function P(t,e,i,n){if(t&&t.o){if(D.has(t))return;D.add(t),undefined.c.push((()=>{D.delete(t),n&&(i&&t.d(1),n())})),t.o(e)}}function I(t){t&&t.c()}function $(t,i,o,r){const{fragment:s,on_mount:l,on_destroy:u,after_update:c}=t.$$;s&&s.m(i,o),r||R((()=>{const i=l.map(e).filter(a);u?u.push(...i):n(i),t.$$.on_mount=[]})),c.forEach(R)}function N(t,e){const i=t.$$;null!==i.fragment&&(n(i.on_destroy),i.fragment&&i.fragment.d(e),i.on_destroy=i.fragment=null,i.ctx=[])}function V(t,e){-1===t.$$.dirty[0]&&(S.push(t),C||(C=!0,k.then(T)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function G(e,a,o,r,s,u,c,d=[-1]){const f=g;A(e);const h=e.$$={fragment:null,ctx:null,props:u,update:t,not_equal:s,bound:i(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(a.context||(f?f.$$.context:[])),callbacks:i(),dirty:d,skip_bound:!1,root:a.target||f.$$.root};c&&c(h.root);let p=!1;if(h.ctx=o?o(e,a.props||{},((t,i,...n)=>{const a=n.length?n[0]:i;return h.ctx&&s(h.ctx[t],h.ctx[t]=a)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](a),p&&V(e,t)),i})):[],h.update(),p=!0,n(h.before_update),h.fragment=!!r&&r(h.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);h.fragment&&h.fragment.l(t),t.forEach(l)}else h.fragment&&h.fragment.c();a.intro&&x(e.$$.fragment),$(e,a.target,a.anchor,a.customElement),T()}A(f)}class w{$destroy(){N(this,1),this.$destroy=t}$on(t,e){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(e),()=>{const t=i.indexOf(e);-1!==t&&i.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function _(e){let i;return{c(){i=u("div"),i.innerHTML='<h1 class="title svelte-l477x7">Skyblock Auction Flipper</h1> \n    <div class="intro svelte-l477x7">Hopefully this doesn&#39;t break. Keep in mind that this will download the entire Skyblock\n        Auction House (about 50mb) to your personal device every time you refresh, so if you have a limited data plan, I suggest that you don&#39;t use this tool. \n        Due to API limits, refreshing may take up to 1 minute.</div>',h(i,"class","main svelte-l477x7")},m(t,e){s(t,i,e)},p:t,i:t,o:t,d(t){t&&l(i)}}}class W extends w{constructor(t){super(),G(this,t,null,_,o,{})}}var M;class Y{static initialize(){let t=1e6,e=1e3;return this.petLoreValueTable={"Minos Relic":30*t,"Dwarf Turtle Shelmet":2*t},this.loreValueTable={"§k":5*t,"Rejuvenate V":500*e,"Legion I":1*t,"Legion II":2*t,"Legion III":4*t,"Legion IV":7*t,"Legion V":13*t,"Wisdom I":100*e,"Wisdom II":300*e,"Wisdom III":600*e,"Wisdom IV":1.5*t,"Wisdom V":2*t,"Growth VI":2.1*t,"Protection VI":2.1*t,"Soul Eater I":1.19*t,"Soul Eater II":2.7*t,"Soul Eater III":5.54*t,"Soul Eater IV":11.4*t,"Soul Eater V":21.7*t,"Ultimate Wise I":100*e,"Ultimate Wise II":270*e,"Ultimate Wise III":600*e,"Ultimate Wise IV":1.4*t,"Ultimate Wise V":2.5*t,"§e(+20)":300*e,"One For All":8*t,"Enriched with":2*t},this.loreValueTable=Object.assign({},this.loreValueTable,this.petLoreValueTable),this.nameValueTable={Withered:2.1*t,Ancient:600*e,Necrotic:300*e},this.loreOverrideTable={},this.nameOverrideTable={},0}}M=Y,Y.init=M.initialize(),Y.maxPageQueries=100,Y.maxAuctionDisplayCount=30,Y.budget=1e6,Y.buyoutMax=1,Y.acceptRawAuctions=!0,Y.considerBuyoutBudget=!1,Y.commodityWatchlist=["Krampus Helmet","Ultimate Carrot Candy Upgrade","Jumbo Backpack Upgrade","Enrichment","Chimera I","Pristine V","Pristine I","Soul Eater I","Autopet Rules","French Bread","Pioneer Pickaxe","Gorilla Monkey","XX-Large Storage","Tier Boost","Beacon V","Beacon IV","Beacon III","Beacon II","Infinityboom TNT","Flycatcher","Pumpkin Launcher","Lucky Clover","Lesser Soulflow Engine","Ancient Rose","Reforge Anvil","Exp Share","Exp Share Core","Enchanted Hopper","Soul Esoward","Large Storage","Weird Tuba","Ultimate Carrot Candy","Twilight Tiger Skin","Spirit Skin","Radiant Enderman Skin","Void Conqueror Skin","Judgement Core","Jungle Heart","Plasmaflux Power Orb","Warden Heart","Plasma Nucleus","Icicle Skin","Neon Blue Ender Dragon Skin","Exceedingly Rare Ender Artifact Upgrader","Null Blade","Overflux Power Orb","!LEGENDARY Griffin Upgrade Stone","Black Widow Skin","Reinforced Skin","Pufferfish Skin","Golden Monkey Skin","Royal Pigeon","Neon Red Ender Dragon Skin","Shard of the Shredded","Vampire Fang","Scythe Shard","Pastel Ender Dragon Skin","Reaper Gem","Washed-up Souvenir","Wood Singularity","Tesselated Ender Pearl","Corleonite","Diamante's Handle","Necron's Handle","Grown-up Baby Yeti Skin","Wither Blood","Precursor Gear","Block Zapper","Builder's Wand","Overflux Capacitor","Snowglobe Skin","First Master Star","Second Master Star","Third Master Star","Fourth Master Star","Soulflow Engine","Minos Relic","Enderpack Skin","Watcher Guardian Skin","Braided Griffin Feather","Fossilized Silverfish Skin","Silex","Purple Egged Skin","Green Egged Skin","Orca Blue Whale Skin","Zombie Skeleton Horse Skin","Mauve Skin","Admiral Skin","Dragon Horn","Null Edge","Crimson Skin","Dwarf Turtle Shelmet","Deep Sea Orb","Monochrome Elephant Skin","Dragon Claw","Dragon Scale","Recall Potion","Spirit Bone","Spirit Wing","Personal Harp","Lucky Dice","Sadan's Brooch","Cool Rock Skin","Laughing Rock Skin","Thinking Rock Skin","Summoning Ring","Blue Elephant Skin","Perfectly-Cut Fuel Tank","Amber-polished Drill Engine","Derpy Rock Skin","Embarrassed Rock Skin","Smiling Rock Skin","Pink Elephant Skin","Gemstone Mixture","Mithril Plate","Golden Plate","Gemstone Fuel Tank","Orange Elephant Skin","Neon Red Sheep Skin","Neon Blue Sheep Skin","Titanium-plated Drill Engine","Jaderald","Purple Elephant Skin","Red Elephant Skin","Puppy Skin","Green Elephant Skin","Warped Stone","Mana Flux Power Orb","White Sheep Skin","Pink Sheep Skin","Black Sheep Skin","Red Sheep Skin","Purple Sheep Skin","Light Blue Sheep Skin","Onyx Black Cat Skin","Light Green Sheep Skin","Warden Heart"],Y.talismanWatchlist=["Personal Compactor 7000","Personal Compactor 6000","Bat Artifact","Golden Jerry Artifact","Hegemony Artifact","Candy Relic","Reaper Orb","Scarf's Grimoire","Treasure Artifact","Razor-sharp Shark Tooth Necklace","!MYTHIC Beastmaster Crest","!LEGENDARY Beastmaster Crest","!EPIC Beastmaster Crest","Wither Relic","Auto Recombobulator","Titanium Relic","Seal of the Family","Ender Artifact","Wither Artifact","Ender Relic","Spider Artifact","Treasure Ring","Catacombs Expert Ring","Red Claw Artifact","Spiked Atrocity","Experience Artifact","Soulflow Supercell","Tarantula Talisman","Hunter Ring","Purple Jerry Talisman","Bait Ring","Survivor Cube","Zombie Artifact","Speed Artifact","Devour Ring","Wolf Ring","Intimidation Artifact","Frozen Chicken","Bits Talisman","Eternal Hoof","Soulflow Battery","Bat Person Artifact","Blue Jerry Talisman","Titanium Ring","Sea Creature Artifact","Personal Compactor 5000","Mineral Talisman","Red Claw Ring","Scarf's Studies","Scarf's Thesis","Fish Affinity Talisman","Potion Affinity Artifact","Feather Artifact","Haste Ring","Crab Hat of Celebration","Blood God Crest","Potato Talisman","Handy Blood Chalice","Pocket Espresso Machine","Jungle Amulet","Hunter Talisman","Wolf Paw"],Y.upgradableWatchlist=["Storm's Boots ✪✪✪✪✪","Necron's Boots ✪✪✪✪✪","Goldor's Boots ✪✪✪✪✪","Storm's Leggings ✪✪✪✪✪","Necron's Leggings ✪✪✪✪✪","Goldor's Leggings ✪✪✪✪✪","Storm's Chestplate ✪✪✪✪✪","Necron's Chestplate ✪✪✪✪✪","Goldor's Chestplate ✪✪✪✪✪","Livid Dagger ✪✪✪✪✪","Flower of Truth ✪✪✪✪✪","Reaper Mask ✪✪✪✪✪","Axe of the Shredded ✪✪✪✪✪","Shadow Assassin Chestplate ✪✪✪✪✪","Rod of the Sea","Juju Shortbow ✪✪✪✪✪","Wand of Atonement","Vorpal Katana","Wither Goggles ✪✪✪✪✪","Warden Helmet","Atomsplit Katana","Aspect of the End","Aspect of the Dragons"],Y.petWatchlist=["!LEGENDARY Baby Yeti","!EPIC Baby Yeti","!LEGENDARY Squid","!LEGENDARY Flying Fish","!LEGENDARY Lion","!LEGENDARY Elephant","!LEGENDARY Tiger","!LEGENDARY Black Cat","!EPIC Tiger","!LEGENDARY Blue Whale","!LEGENDARY Rabbit"],Y.petRarities=["COMMON","UNCOMMON","RARE","EPIC","LEGENDARY","MYTHIC"],Y.petMultiplierTable={"!LEGENDARY Wolf":7,"!LEGENDARY Sheep":3,"!LEGENDARY Rabbit":5,"!LEGENDARY Blue Whale":24,"!LEGENDARY Dolphin":20,"!EPIC Dolphin":9,"!EPIC Tiger":10,"LEGENDARY Tiger":13,"!LEGENDARY Spider":34,"!LEGENDARY Tarantula":19,"!LEGENDARY Elephant":8,"!MYTHIC Bat":2,"!LEGENDARY Bat":5,"!LEGENDARY Ender Dragon":13,"!LEGENDARY Black Cat":26,"!LEGENDARY Baby Yeti":22,"!EPIC Baby Yeti":7,"!LEGENDARY Squid":10,"!LEGENDARY Flying Fish":18,"!LEGENDARY Lion":24},Y.auctionConsiderationTime=3e5;class O{static registerProgressCallback(t){O.progressCallback=t}static sleep(t){return new Promise((e=>setTimeout(e,t)))}static async updateAuctions(){let t=[],e=await fetch("https://api.hypixel.net/skyblock/auctions?page=0"),i=(await e.json()).totalPages;i=Math.min(i,Y.maxPageQueries),console.log("Querying "+i+" Pages");for(let e=0;e<i;e++){console.log("Loading Page "+(e+1)+" of "+i);let n=await fetch("https://api.hypixel.net/skyblock/auctions?page="+String(e)),a=await n.json();for(let e of a.auctions)t.push(e);for(let i=0;i<t[e].length;i++)delete t[e][i].item_bytes;O.progressCallback((e+1)/i),await O.sleep(O.timeDelay)}return t}}O.timeDelay=100;class H{static separateAuctions(t){this.commodityAuctions={},this.upgradableAuctions={},this.talismanAuctions={},this.petAuctions={},this.otherAuctions=[];for(let e of t){let t=!1;if(this.checkPet(e)){for(let t of Y.petWatchlist)if(e.item_name.includes(t)){t in this.petAuctions?this.petAuctions[t].push(e):this.petAuctions[t]=[e];break}}else{for(let i of Y.commodityWatchlist)if(this.identifyAuction(e,i)){i in this.commodityAuctions?this.commodityAuctions[i].push(e):this.commodityAuctions[i]=[e],t=!0;break}if(!t){for(let i of Y.talismanWatchlist)if(this.identifyAuction(e,i)){i in this.talismanAuctions?this.talismanAuctions[i].push(e):this.talismanAuctions[i]=[e],t=!0;break}if(!t){for(let i of Y.upgradableWatchlist)if(this.identifyAuction(e,i)){i in this.upgradableAuctions?this.upgradableAuctions[i].push(e):this.upgradableAuctions[i]=[e],t=!0;break}t||this.otherAuctions.push(e)}}}}return{commodityAuctions:this.commodityAuctions,upgradableAuctions:this.upgradableAuctions,talismanAuctions:this.talismanAuctions,petAuctions:this.petAuctions,otherAuctions:this.otherAuctions}}static checkPet(t){return t.item_name.includes("Lvl")}static identifyAuction(t,e){let i=e;if(e.startsWith("!")){let n=e.indexOf(" ");if(e.substring(1,n)!=t.tier)return!1;i=i.substring(n+1)}return t.item_name.includes(i)}}H.commodityAuctions={},H.upgradableAuctions={},H.talismanAuctions={},H.petAuctions={},H.otherAuctions=[];class F{static getPetBaseValue(t,e){return F.getLoreValue(t)+F.getPetLevelValue(t,e)}static getUpgradableBaseValue(t,e){return F.getLoreValue(t)+F.getNameValue(t)}static getTalismanBaseValue(t,e){return F.getLoreValue(t)}static getCommodityBaseValue(t,e){return 0}static getLoreValue(t){let e=0;for(let i in Y.loreValueTable)t.item_lore.includes(i)&&(i in Y.loreOverrideTable?e+=Y.loreOverrideTable[i]:e+=Y.loreValueTable[i]);return e}static getNameValue(t){let e=0;for(let i in Y.nameValueTable)t.item_name.includes(i)&&(i in Y.nameOverrideTable?e+=Y.nameOverrideTable[i]:e+=Y.nameValueTable[i]);return e}static getPetLevelValue(t,e){let i=0,n=/\[Lvl (\d+)\]/.exec(t.item_name);return n&&(i=parseInt(n[1])),Y.petMultiplierTable[e]*Math.pow(2,i/5)}}class U{static findAuctions(t){O.updateAuctions().then((e=>{this.findAuctionsImpl(H.separateAuctions(e)),this.flips.sort(((t,e)=>e.max_profit-t.max_profit)),console.log(this.flips),t()}))}static findAuctionsImpl(t){this.flips=[],this.bestAuctions=[];let e=t.petAuctions,i=t.commodityAuctions,n=t.talismanAuctions,a=t.upgradableAuctions;this.findAuctionsCategory(e,F.getPetBaseValue),this.findAuctionsCategory(i,F.getCommodityBaseValue),this.findAuctionsCategory(n,F.getTalismanBaseValue),this.findAuctionsCategory(a,F.getUpgradableBaseValue)}static findAuctionsCategory(t,e){for(let i in t)this.findFlips(this.filterAuctions(i,t[i],e))}static filterAuctions(t,e,i){let n=[];for(let a of e)if(a.bin)n.push({auctionType:t,auctionData:a,auctionCost:a.starting_bid,auctionBaseValue:i(a,t)});else if(Y.acceptRawAuctions){let e=(new Date).getTime();a.end-e<=Y.auctionConsiderationTime&&n.push({auctionType:t,auctionData:a,auctionCost:Math.max(a.starting_bid,a.highest_bid_amount),auctionBaseValue:i(a,t)})}return n}static findFlips(t){let e=-1,i=t.sort(((t,e)=>t.auctionCost-e.auctionCost));for(let t=0;t<i.length;t++){let n=Y.buyoutMax,a=i[t],o=a.auctionCost,r=t,s=0;if(o>Y.budget)break;for(let e=t+1;e<i.length;e++)if(i[e].auctionData.bin)if(a.auctionBaseValue>i[e].auctionBaseValue)i[e].auctionCost<s&&(r=e,s=Math.max(s,i[e].auctionCost-i[e].auctionBaseValue+a.auctionBaseValue));else if(n--,Y.considerBuyoutBudget&&(o+=i[e].auctionCost,o>Y.budget&&(n=0)),n<=0)break;if(r==i.length-1){this.bestAuctions.push(a);continue}let l=.98*i[r].auctionCost-a.auctionCost,u=.98*i[r+1].auctionCost-a.auctionCost;if(a.auctionData.bin){if(e<a.auctionBaseValue){if(e=a.auctionBaseValue,u<0)continue;this.flips.push({auction:a,min_profit:l,max_profit:u})}}else{if(u<0)continue;this.flips.push({auction:a,min_profit:l,max_profit:u})}}}}U.flips=[],U.bestAuctions=[];class J{static registerAuctionRenderCallback(t){this.auctionRenderCallback=t}static updateAuctionRender(){this.auctionRenderCallback()}}function j(t){let e;return{c(){e=c("Refreshing...")},m(t,i){s(t,e,i)},d(t){t&&l(e)}}}function z(t){let e;return{c(){e=c("Refresh")},m(t,i){s(t,e,i)},d(t){t&&l(e)}}}function q(e){let i,n,a,o,c,p,g,A,S;function b(t,e){return"active"===t[0]?z:j}let y=b(e),E=y(e);return{c(){i=u("div"),n=u("button"),a=u("p"),E.c(),c=d(),p=u("div"),h(a,"class","refreshText svelte-pu7g36"),h(n,"class",o="refreshButton "+e[0]+" svelte-pu7g36"),h(i,"class","button-container svelte-pu7g36"),h(p,"class",g="progressBar "+e[0]+" svelte-pu7g36"),m(p,"width",e[1]+"%")},m(t,o){s(t,i,o),r(i,n),r(n,a),E.m(a,null),s(t,c,o),s(t,p,o),A||(S=f(n,"click",e[2]),A=!0)},p(t,[e]){y!==(y=b(t))&&(E.d(1),E=y(t),E&&(E.c(),E.m(a,null))),1&e&&o!==(o="refreshButton "+t[0]+" svelte-pu7g36")&&h(n,"class",o),1&e&&g!==(g="progressBar "+t[0]+" svelte-pu7g36")&&h(p,"class",g),2&e&&m(p,"width",t[1]+"%")},i:t,o:t,d(t){t&&l(i),E.d(),t&&l(c),t&&l(p),A=!1,S()}}}function K(t,e,i){let n="active",a=0;function o(){i(0,n="active"),console.log("Refreshed!"),J.updateAuctionRender(),setTimeout((()=>{i(1,a=0)}),500)}return O.registerProgressCallback((function(t){i(1,a=Math.round(100*t))})),[n,a,function(){"inactive"!==n&&(i(0,n="inactive"),console.log("Refreshing..."),U.findAuctions(o))}]}class Q extends w{constructor(t){super(),G(this,t,K,q,o,{})}}function Z(t,e,i){const n=t.slice();return n[4]=e[i],n[6]=i,n}function X(t){let e;return{c(){e=u("div"),e.textContent="AUCTION",h(e,"class","auctionType auction svelte-10vy5yn")},m(t,i){s(t,e,i)},d(t){t&&l(e)}}}function tt(t){let e;return{c(){e=u("div"),e.textContent="BIN",h(e,"class","auctionType bin svelte-10vy5yn")},m(t,i){s(t,e,i)},d(t){t&&l(e)}}}function et(t){let e,i,n,a,o,m,g,A,S,b,y,E,k,C,R,v,B,T,L,D,x=t[4].auction.auctionData.item_name+"",P=Math.round(t[4].min_profit).toLocaleString("en-US")+"",I=Math.round(t[4].max_profit).toLocaleString("en-US")+"";function $(t,e){return t[4].auction.auctionData.bin?tt:X}let N=$(t),V=N(t);function G(){return t[2](t[6])}return{c(){e=u("div"),i=u("div"),n=u("div"),a=u("div"),o=c(x),m=d(),V.c(),g=d(),A=u("div"),S=c("Minimum Expected Profit: "),b=c(P),y=c(" coins "),E=u("br"),k=c("\r\n                    Maximum Expected Profit: "),C=c(I),R=c(" coins"),v=d(),B=u("button"),B.textContent="Copy Auction",T=d(),h(a,"class","name svelte-10vy5yn"),h(A,"class","profit svelte-10vy5yn"),h(n,"class","itemData svelte-10vy5yn"),h(B,"class","copy svelte-10vy5yn"),h(i,"class","auctionBox svelte-10vy5yn"),h(e,"class","auctions svelte-10vy5yn")},m(t,l){s(t,e,l),r(e,i),r(i,n),r(n,a),r(a,o),r(a,m),V.m(a,null),r(n,g),r(n,A),r(A,S),r(A,b),r(A,y),r(A,E),r(A,k),r(A,C),r(A,R),r(i,v),r(i,B),r(e,T),L||(D=f(B,"click",G),L=!0)},p(e,i){t=e,1&i&&x!==(x=t[4].auction.auctionData.item_name+"")&&p(o,x),N!==(N=$(t))&&(V.d(1),V=N(t),V&&(V.c(),V.m(a,null))),1&i&&P!==(P=Math.round(t[4].min_profit).toLocaleString("en-US")+"")&&p(b,P),1&i&&I!==(I=Math.round(t[4].max_profit).toLocaleString("en-US")+"")&&p(C,I)},d(t){t&&l(e),V.d(),L=!1,D()}}}function it(e){let i,n=e[0],a=[];for(let t=0;t<n.length;t+=1)a[t]=et(Z(e,n,t));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();i=c("")},m(t,e){for(let i=0;i<a.length;i+=1)a[i].m(t,e);s(t,i,e)},p(t,[e]){if(3&e){let o;for(n=t[0],o=0;o<n.length;o+=1){const r=Z(t,n,o);a[o]?a[o].p(r,e):(a[o]=et(r),a[o].c(),a[o].m(i.parentNode,i))}for(;o<a.length;o+=1)a[o].d(1);a.length=n.length}},i:t,o:t,d(t){!function(t,e){for(let i=0;i<t.length;i+=1)t[i]&&t[i].d(e)}(a,t),t&&l(i)}}}function nt(t,e,i){let n=[{auction:{auctionData:{bin:!0,item_name:"Aspect of the End",uuid:"lol"}},min_profit:5,max_profit:1e5}];function a(t){navigator.clipboard.writeText("/viewauction "+n[t].auction.auctionData.uuid)}J.registerAuctionRenderCallback((function(){i(0,n=U.flips.slice(0,Y.maxAuctionDisplayCount))}));return[n,a,t=>a(t)]}class at extends w{constructor(t){super(),G(this,t,nt,it,o,{})}}function ot(e){let i,n,a,o,c,f,p;return n=new W({}),o=new Q({}),f=new at({}),{c(){i=u("div"),I(n.$$.fragment),a=d(),I(o.$$.fragment),c=d(),I(f.$$.fragment),h(i,"class","content svelte-1v8lf31")},m(t,e){s(t,i,e),$(n,i,null),r(i,a),$(o,i,null),r(i,c),$(f,i,null),p=!0},p:t,i(t){p||(x(n.$$.fragment,t),x(o.$$.fragment,t),x(f.$$.fragment,t),p=!0)},o(t){P(n.$$.fragment,t),P(o.$$.fragment,t),P(f.$$.fragment,t),p=!1},d(t){t&&l(i),N(n),N(o),N(f)}}}return new class extends w{constructor(t){super(),G(this,t,null,ot,o,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map