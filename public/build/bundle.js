
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\layouts\app\AuctionHeader.svelte generated by Svelte v3.44.3 */

    const file$3 = "src\\layouts\\app\\AuctionHeader.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Skyblock Auction Flipper";
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "Hopefully this doesn't break. Keep in mind that this will cache the entire Skyblock\r\n        Auction House (about 60mb) to your personal device every time you refresh, so if you have a limited data plan, I suggest that you don't use this tool. \r\n        Due to API limits, refreshing may take up to 1 minute. The displayed flips are not guaranteed to always make profit, as this algorithm cannot take\r\n        every factor into account, and is still in development. Use common sense.";
    			attr_dev(h1, "class", "title svelte-ljigq1");
    			add_location(h1, file$3, 3, 4, 57);
    			attr_dev(div0, "class", "intro svelte-ljigq1");
    			add_location(div0, file$3, 4, 4, 110);
    			attr_dev(div1, "class", "main svelte-ljigq1");
    			add_location(div1, file$3, 2, 0, 31);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AuctionHeader', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AuctionHeader> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class AuctionHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionHeader",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    var _a;
    //update this to suit your needs
    //TODO: Create more config buttons on the UI if possible
    class AuctionFinderConfig {
        static initialize() {
            let m = 1000000;
            let k = 1000;
            this.petLoreValueTable = { "Minos Relic": 30 * m, "Dwarf Turtle Shelmet": 2 * m };
            this.loreValueTable = { "§k": 5 * m, "Rejuvenate V": 500 * k, "Legion I": 1 * m, "Legion II": 2 * m,
                "Legion III": 4 * m, "Legion IV": 7 * m, "Legion V": 13 * m, "Wisdom I": 100 * k,
                "Wisdom II": 300 * k, "Wisdom III": 600 * k, "Wisdom IV": 1.5 * m, "Wisdom V": 2 * m,
                "Growth VI": 2.1 * m, "Protection VI": 2.1 * m, "Soul Eater I": 1.19 * m,
                "Soul Eater II": 2.7 * m, "Soul Eater III": 5.54 * m, "Soul Eater IV": 11.4 * m, "Soul Eater V": 21.7 * m,
                "Ultimate Wise I": 100 * k, "Ultimate Wise II": 270 * k, "Ultimate Wise III": 600 * k,
                "Ultimate Wise IV": 1.4 * m, "Ultimate Wise V": 2.5 * m, "§e(+20)": 300 * k, "One For All": 8 * m, "Enriched with": 2 * m };
            this.loreValueTable = Object.assign({}, this.loreValueTable, this.petLoreValueTable);
            this.nameValueTable = { "Withered": 2.1 * m, "Ancient": 600 * k, "Necrotic": 300 * k };
            //not really sure if these have a purpose but they're here just in case
            this.loreOverrideTable = {}; //{"Growth VI": 0, "Protection VI":0};
            this.nameOverrideTable = {};
            return 0;
        }
        static updateConfig(params) {
            if (params.budget != NaN) {
                this.budget = params.budget;
            }
            if (params.maxAuctionDisplayCount != NaN) {
                this.maxAuctionDisplayCount = params.maxAuctionDisplayCount;
            }
        }
    }
    _a = AuctionFinderConfig;
    AuctionFinderConfig.init = _a.initialize();
    AuctionFinderConfig.maxPageQueries = 100;
    AuctionFinderConfig.maxAuctionDisplayCount = 30;
    AuctionFinderConfig.budget = 1000000;
    AuctionFinderConfig.buyoutMax = 1;
    AuctionFinderConfig.acceptRawAuctions = true; //needs more testing
    AuctionFinderConfig.considerBuyoutBudget = false; //needs more testing
    //starred items go before non-starred items
    //basically more specific names go before less specific names
    AuctionFinderConfig.commodityWatchlist = ["Krampus Helmet", "Ultimate Carrot Candy Upgrade", "Jumbo Backpack Upgrade", "Enrichment", "Chimera I", "Pristine V", "Pristine I", "Soul Eater I",
        "Autopet Rules", "French Bread", "Pioneer Pickaxe", "Gorilla Monkey", "XX-Large Storage", "Tier Boost", "Beacon V", "Beacon IV", "Beacon III", "Beacon II",
        "Infinityboom TNT", "Flycatcher", "Pumpkin Launcher", "Lucky Clover", "Lesser Soulflow Engine", "Ancient Rose", "Reforge Anvil", "Exp Share", "Exp Share Core", "Enchanted Hopper",
        "Soul Esoward", "Large Storage", "Weird Tuba", "Ultimate Carrot Candy", "Twilight Tiger Skin", "Spirit Skin", "Radiant Enderman Skin", "Void Conqueror Skin",
        "Judgement Core", "Jungle Heart", "Plasmaflux Power Orb", "Warden Heart", "Plasma Nucleus", "Icicle Skin", "Neon Blue Ender Dragon Skin", "Exceedingly Rare Ender Artifact Upgrader",
        "Null Blade", "Overflux Power Orb", "!LEGENDARY Griffin Upgrade Stone", "Black Widow Skin", "Reinforced Skin", "Pufferfish Skin", "Golden Monkey Skin", "Royal Pigeon", "Neon Red Ender Dragon Skin",
        "Shard of the Shredded", "Vampire Fang", "Scythe Shard", "Pastel Ender Dragon Skin", "Reaper Gem", "Washed-up Souvenir", "Wood Singularity", "Tesselated Ender Pearl", "Corleonite", "Diamante\u0027s Handle",
        "Necron\u0027s Handle", "Grown-up Baby Yeti Skin", "Wither Blood", "Precursor Gear", "Block Zapper", "Builder\u0027s Wand", "Overflux Capacitor", "Snowglobe Skin",
        "First Master Star", "Second Master Star", "Third Master Star", "Fourth Master Star", "Soulflow Engine", "Minos Relic", "Enderpack Skin", "Watcher Guardian Skin", "Braided Griffin Feather",
        "Fossilized Silverfish Skin", "Silex", "Purple Egged Skin", "Green Egged Skin", "Orca Blue Whale Skin", "Zombie Skeleton Horse Skin", "Mauve Skin", "Admiral Skin", "Dragon Horn", "Null Edge", "Crimson Skin",
        "Dwarf Turtle Shelmet", "Deep Sea Orb", "Monochrome Elephant Skin", "Dragon Claw", "Dragon Scale", "Recall Potion", "Spirit Bone", "Spirit Wing", "Personal Harp", "Lucky Dice", "Sadan\u0027s Brooch",
        "Cool Rock Skin", "Laughing Rock Skin", "Thinking Rock Skin", "Summoning Ring", "Blue Elephant Skin", "Perfectly-Cut Fuel Tank", "Amber-polished Drill Engine", "Derpy Rock Skin", "Embarrassed Rock Skin",
        "Smiling Rock Skin", "Pink Elephant Skin", "Gemstone Mixture", "Mithril Plate", "Golden Plate", "Gemstone Fuel Tank", "Orange Elephant Skin", "Neon Red Sheep Skin", "Neon Blue Sheep Skin", "Titanium-plated Drill Engine",
        "Jaderald", "Purple Elephant Skin", "Red Elephant Skin", "Puppy Skin", "Green Elephant Skin", "Warped Stone", "Mana Flux Power Orb", "White Sheep Skin", "Pink Sheep Skin", "Black Sheep Skin", "Red Sheep Skin", "Purple Sheep Skin",
        "Light Blue Sheep Skin", "Onyx Black Cat Skin", "Light Green Sheep Skin", "Warden Heart"];
    AuctionFinderConfig.talismanWatchlist = ["Personal Compactor 7000", "Personal Compactor 6000", "Bat Artifact", "Golden Jerry Artifact", "Hegemony Artifact", "Candy Relic", "Reaper Orb", "Scarf\u0027s Grimoire", "Treasure Artifact", "Razor-sharp Shark Tooth Necklace",
        "!MYTHIC Beastmaster Crest", "!LEGENDARY Beastmaster Crest", "!EPIC Beastmaster Crest", "Wither Relic", "Auto Recombobulator", "Titanium Relic", "Seal of the Family", "Ender Artifact", "Wither Artifact", "Ender Relic",
        "Spider Artifact", "Treasure Ring", "Catacombs Expert Ring", "Red Claw Artifact", "Spiked Atrocity", "Experience Artifact", "Soulflow Supercell", "Tarantula Talisman", "Hunter Ring", "Purple Jerry Talisman", "Bait Ring",
        "Survivor Cube", "Zombie Artifact", "Speed Artifact", "Devour Ring", "Wolf Ring", "Intimidation Artifact", "Frozen Chicken", "Bits Talisman", "Eternal Hoof", "Soulflow Battery", "Bat Person Artifact", "Blue Jerry Talisman",
        "Titanium Ring", "Sea Creature Artifact", "Personal Compactor 5000", "Mineral Talisman", "Red Claw Ring", "Scarf\u0027s Studies", "Scarf\u0027s Thesis", "Fish Affinity Talisman", "Potion Affinity Artifact", "Feather Artifact",
        "Haste Ring", "Crab Hat of Celebration", "Blood God Crest", "Potato Talisman", "Handy Blood Chalice", "Pocket Espresso Machine", "Jungle Amulet", "Hunter Talisman", "Wolf Paw"];
    AuctionFinderConfig.upgradableWatchlist = ["Storm\u0027s Boots ✪✪✪✪✪", "Necron\u0027s Boots ✪✪✪✪✪", "Goldor\u0027s Boots ✪✪✪✪✪",
        "Storm\u0027s Leggings ✪✪✪✪✪", "Necron\u0027s Leggings ✪✪✪✪✪", "Goldor\u0027s Leggings ✪✪✪✪✪",
        "Storm\u0027s Chestplate ✪✪✪✪✪", "Necron\u0027s Chestplate ✪✪✪✪✪", "Goldor\u0027s Chestplate ✪✪✪✪✪",
        "Livid Dagger ✪✪✪✪✪", "Flower of Truth ✪✪✪✪✪", "Reaper Mask ✪✪✪✪✪",
        "Axe of the Shredded ✪✪✪✪✪", "Shadow Assassin Chestplate ✪✪✪✪✪",
        "Rod of the Sea", "Juju Shortbow ✪✪✪✪✪", "Wand of Atonement", "Vorpal Katana", "Wither Goggles ✪✪✪✪✪",
        "Warden Helmet", "Atomsplit Katana", "Aspect of the End", "Aspect of the Dragons"];
    AuctionFinderConfig.petWatchlist = ["!LEGENDARY Baby Yeti", "!EPIC Baby Yeti", "!LEGENDARY Squid", "!LEGENDARY Flying Fish", "!LEGENDARY Lion", "!LEGENDARY Elephant",
        "!LEGENDARY Tiger", "!LEGENDARY Black Cat", "!EPIC Tiger", "!LEGENDARY Blue Whale", "!LEGENDARY Rabbit"]; //fill in the rest of the pets
    AuctionFinderConfig.petRarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    AuctionFinderConfig.petMultiplierTable = { "!LEGENDARY Wolf": 7, "!LEGENDARY Sheep": 3, "!LEGENDARY Rabbit": 5, "!LEGENDARY Blue Whale": 24, "!LEGENDARY Dolphin": 20,
        "!EPIC Dolphin": 9, "!EPIC Tiger": 10, "LEGENDARY Tiger": 13, "!LEGENDARY Spider": 34, "!LEGENDARY Tarantula": 19,
        "!LEGENDARY Elephant": 8, "!MYTHIC Bat": 2, "!LEGENDARY Bat": 5, "!LEGENDARY Ender Dragon": 13, "!LEGENDARY Black Cat": 26,
        "!LEGENDARY Baby Yeti": 22, "!EPIC Baby Yeti": 7, "!LEGENDARY Squid": 10, "!LEGENDARY Flying Fish": 18, "!LEGENDARY Lion": 24
    };
    AuctionFinderConfig.auctionConsiderationTime = 5 * 60 * 1000; //ms

    class AuctionQuery {
        static registerProgressCallback(callback) {
            AuctionQuery.progressCallback = callback;
        }
        static sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        static async updateAuctions() {
            let combinedAuctions = [];
            let response = await fetch('https://api.hypixel.net/skyblock/auctions?page=0');
            let data = await response.json();
            let totalPages = data["totalPages"];
            totalPages = Math.min(totalPages, AuctionFinderConfig.maxPageQueries);
            console.log("Querying " + totalPages + " Pages");
            for (let i = 0; i < totalPages; i++) {
                console.log("Loading Page " + (i + 1) + " of " + totalPages);
                let response = await fetch('https://api.hypixel.net/skyblock/auctions?page=' + String(i));
                let data = await response.json();
                for (let auction of data["auctions"]) {
                    combinedAuctions.push(auction);
                }
                //iterate over the auctions, deleting ["item_bytes"] from each one
                for (let j = 0; j < combinedAuctions[i].length; j++) {
                    delete combinedAuctions[i][j].item_bytes;
                } //saves so much memory
                AuctionQuery.progressCallback((i + 1) / totalPages);
                await AuctionQuery.sleep(AuctionQuery.timeDelay);
            }
            //console.log(combinedAuctions); //rip internet
            return combinedAuctions;
        }
    }
    AuctionQuery.timeDelay = 100; //just to be safe :)

    class AuctionSeparator {
        //TODO: Simplify a lot
        static separateAuctions(auctions) {
            this.commodityAuctions = {};
            this.upgradableAuctions = {};
            this.talismanAuctions = {};
            this.petAuctions = {};
            this.otherAuctions = [];
            for (let auction of auctions) {
                let exit = false;
                if (this.checkPet(auction)) {
                    for (let petType of AuctionFinderConfig.petWatchlist) {
                        if (auction.item_name.includes(petType)) {
                            if (petType in this.petAuctions) {
                                this.petAuctions[petType].push(auction);
                            }
                            else {
                                this.petAuctions[petType] = [auction];
                            }
                            break;
                        }
                    }
                    continue;
                }
                for (let commodityType of AuctionFinderConfig.commodityWatchlist) {
                    if (this.identifyAuction(auction, commodityType)) {
                        if (commodityType in this.commodityAuctions) {
                            this.commodityAuctions[commodityType].push(auction);
                        }
                        else {
                            this.commodityAuctions[commodityType] = [auction];
                        }
                        exit = true;
                        break;
                    }
                }
                if (exit) {
                    continue;
                }
                for (let talismanType of AuctionFinderConfig.talismanWatchlist) {
                    if (this.identifyAuction(auction, talismanType)) {
                        if (talismanType in this.talismanAuctions) {
                            this.talismanAuctions[talismanType].push(auction);
                        }
                        else {
                            this.talismanAuctions[talismanType] = [auction];
                        }
                        exit = true;
                        break;
                    }
                }
                if (exit) {
                    continue;
                }
                for (let upgradableType of AuctionFinderConfig.upgradableWatchlist) {
                    if (this.identifyAuction(auction, upgradableType)) {
                        if (upgradableType in this.upgradableAuctions) {
                            this.upgradableAuctions[upgradableType].push(auction);
                        }
                        else {
                            this.upgradableAuctions[upgradableType] = [auction];
                        }
                        exit = true;
                        break;
                    }
                }
                if (exit) {
                    continue;
                }
                this.otherAuctions.push(auction);
            }
            return {
                commodityAuctions: this.commodityAuctions,
                upgradableAuctions: this.upgradableAuctions,
                talismanAuctions: this.talismanAuctions,
                petAuctions: this.petAuctions,
                otherAuctions: this.otherAuctions
            };
        }
        static checkPet(auction) {
            return auction.item_name.includes("Lvl");
        }
        /* TODO: make sure to add a check for tier boost/recomb? */
        static identifyAuction(auction, itemType) {
            let itemName = itemType;
            if (itemType.startsWith("!")) {
                let spaceIndex = itemType.indexOf(" ");
                let rarity = itemType.substring(1, spaceIndex);
                if (rarity != auction.tier) {
                    return false;
                }
                itemName = itemName.substring(spaceIndex + 1);
            }
            return auction.item_name.includes(itemName);
        }
    }
    AuctionSeparator.commodityAuctions = {};
    AuctionSeparator.upgradableAuctions = {};
    AuctionSeparator.talismanAuctions = {};
    AuctionSeparator.petAuctions = {};
    AuctionSeparator.otherAuctions = [];

    class AuctionEstimatedValue {
        static getPetBaseValue(auctionData, auctionType) {
            //TODO: implement
            return AuctionEstimatedValue.getLoreValue(auctionData) +
                AuctionEstimatedValue.getPetLevelValue(auctionData, auctionType);
        }
        static getUpgradableBaseValue(auctionData, auctionType) {
            return AuctionEstimatedValue.getLoreValue(auctionData) +
                AuctionEstimatedValue.getNameValue(auctionData);
        }
        static getTalismanBaseValue(auctionData, auctionType) {
            return AuctionEstimatedValue.getLoreValue(auctionData);
        }
        static getCommodityBaseValue(auctionData, auctionType) {
            return 0; //what do you expect me to do
        }
        static getLoreValue(auctionData) {
            let loreValue = 0;
            for (let key in AuctionFinderConfig.loreValueTable) {
                if (auctionData.item_lore.includes(key)) {
                    if (key in AuctionFinderConfig.loreOverrideTable) {
                        loreValue += AuctionFinderConfig.loreOverrideTable[key];
                    }
                    else {
                        loreValue += AuctionFinderConfig.loreValueTable[key];
                    }
                }
            }
            return loreValue;
        }
        static getNameValue(auctionData) {
            let nameValue = 0;
            for (let key in AuctionFinderConfig.nameValueTable) {
                if (auctionData.item_name.includes(key)) {
                    if (key in AuctionFinderConfig.nameOverrideTable) {
                        nameValue += AuctionFinderConfig.nameOverrideTable[key];
                    }
                    else {
                        nameValue += AuctionFinderConfig.nameValueTable[key];
                    }
                }
            }
            return nameValue;
        }
        static getPetLevelValue(auctionData, auctionType) {
            //we're trying to compare a pet's level value to its item value, albeit unsuccessfully
            let level = 0;
            let levelRegex = /\[Lvl (\d+)\]/;
            let levelMatch = levelRegex.exec(auctionData.item_name);
            if (levelMatch) {
                level = parseInt(levelMatch[1]);
            }
            return AuctionFinderConfig.petMultiplierTable[auctionType] * Math.pow(2, level / 5);
        }
    }

    /*
        This class can be improved in the future.
        It's the core algorithm to find the best flips.

        Potential improvements: (not just in this class)
        - Stacked Items
        - Account for tier boosts
        - Upgrade flipping?
        - Better pet calculation
        - Master Stars
        - etc...
    */
    class AuctionFinder {
        static findAuctions(callback) {
            AuctionQuery.updateAuctions().then(combinedAuctions => {
                this.findAuctionsImpl(AuctionSeparator.separateAuctions(combinedAuctions));
                //sort flips by max profit
                this.flips.sort((a, b) => { return b.max_profit - a.max_profit; });
                console.log(this.flips);
                callback();
            });
        }
        static findAuctionsImpl(auctions) {
            this.flips = [];
            this.bestAuctions = [];
            let petAuctions = auctions.petAuctions;
            let commodityAuctions = auctions.commodityAuctions;
            let talismanAuctions = auctions.talismanAuctions;
            let upgradableAuctions = auctions.upgradableAuctions;
            this.findAuctionsCategory(petAuctions, AuctionEstimatedValue.getPetBaseValue);
            this.findAuctionsCategory(commodityAuctions, AuctionEstimatedValue.getCommodityBaseValue);
            this.findAuctionsCategory(talismanAuctions, AuctionEstimatedValue.getTalismanBaseValue);
            this.findAuctionsCategory(upgradableAuctions, AuctionEstimatedValue.getUpgradableBaseValue);
        }
        static findAuctionsCategory(auctions, valueFunction) {
            for (let key in auctions) {
                this.findFlips(this.filterAuctions(key, auctions[key], valueFunction));
            }
        }
        static filterAuctions(auctionTypeParam, auctionListing, valueFunction) {
            let auctions = [];
            for (let auction of auctionListing) {
                if (auction.bin) {
                    auctions.push({
                        auctionType: auctionTypeParam,
                        auctionData: auction,
                        auctionCost: auction.starting_bid,
                        auctionBaseValue: valueFunction(auction, auctionTypeParam)
                    });
                }
                else {
                    if (AuctionFinderConfig.acceptRawAuctions) {
                        let currentUnixTime = new Date().getTime();
                        if (auction.end - currentUnixTime <= AuctionFinderConfig.auctionConsiderationTime) {
                            auctions.push({
                                auctionType: auctionTypeParam,
                                auctionData: auction,
                                auctionCost: Math.max(auction.starting_bid, auction.highest_bid_amount),
                                auctionBaseValue: valueFunction(auction, auctionTypeParam)
                            });
                        }
                    }
                }
            }
            return auctions;
        }
        static findFlips(filteredAuctions) {
            let maxValue = -1;
            //console.log(filteredAuctions);
            let auctionSort = filteredAuctions.sort((a, b) => { return a.auctionCost - b.auctionCost; });
            for (let i = 0; i < auctionSort.length; i++) {
                let buyoutCount = AuctionFinderConfig.buyoutMax;
                let currentAuction = auctionSort[i];
                let currentBudget = currentAuction.auctionCost;
                let optimalFlipPriceIndex = i;
                let priceCeiling = 0;
                if (currentBudget > AuctionFinderConfig.budget) {
                    break; //clearly everything after this exceeds our budget
                }
                //iterate over the remaining array
                for (let j = i + 1; j < auctionSort.length; j++) {
                    if (!auctionSort[j].auctionData.bin) {
                        continue; //skip non-bin auctions
                    }
                    //check if the current auction's base value is greater than the next auction's base value
                    if (currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue) {
                        //check to see if it's worth it
                        if (auctionSort[j].auctionCost < priceCeiling) {
                            optimalFlipPriceIndex = j;
                            priceCeiling = Math.max(priceCeiling, auctionSort[j].auctionCost - auctionSort[j].auctionBaseValue + currentAuction.auctionBaseValue);
                        }
                        continue; //keep moving
                    }
                    buyoutCount--; //attempt a buyout
                    if (AuctionFinderConfig.considerBuyoutBudget) {
                        currentBudget += auctionSort[j].auctionCost;
                        if (currentBudget > AuctionFinderConfig.budget) {
                            buyoutCount = 0; //buyout failed
                        }
                    }
                    if (buyoutCount <= 0) { //buyout finished!
                        break; //no more buyouts left, time to calculate how much profit we could make
                    }
                }
                if (optimalFlipPriceIndex == auctionSort.length - 1) { //we are worth more than all the other auctions
                    this.bestAuctions.push(currentAuction);
                    continue;
                }
                let min_profit_ = 0.98 * auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost;
                let max_profit_ = 0.98 * auctionSort[optimalFlipPriceIndex + 1].auctionCost - currentAuction.auctionCost;
                if (maxValue < currentAuction.auctionBaseValue) { //this auction is not a fake (hopefully), since you could just flip the cheaper auction otherwise
                    if (currentAuction.auctionData.bin) {
                        maxValue = currentAuction.auctionBaseValue; //only update if bin
                        if (max_profit_ < 0) {
                            continue;
                        } //we lose money
                        this.flips.push({
                            auction: currentAuction,
                            min_profit: min_profit_,
                            max_profit: max_profit_
                        });
                    }
                    else {
                        if (max_profit_ < 0) {
                            continue;
                        } //we lose money
                        this.flips.push({
                            auction: currentAuction,
                            min_profit: min_profit_,
                            max_profit: max_profit_
                        });
                    }
                }
            }
            //all flips have been calculated
        }
    }
    AuctionFinder.flips = [];
    AuctionFinder.bestAuctions = [];

    class AuctionDisplayManager {
        static registerAuctionRenderCallback(callback) {
            this.auctionRenderCallback = callback;
        }
        static updateAuctionRender() {
            this.auctionRenderCallback();
        }
    }

    /* src\layouts\app\AuctionConfig.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$2 = "src\\layouts\\app\\AuctionConfig.svelte";

    // (56:52) {:else}
    function create_else_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Refreshing...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(56:52) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:31) {#if active}
    function create_if_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Refresh");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(56:31) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div4;
    	let div0;
    	let t1;
    	let div3;
    	let div1;
    	let t2;
    	let input0;
    	let t3;
    	let div2;
    	let t4;
    	let input1;
    	let t5;
    	let div5;
    	let button;
    	let p;
    	let button_class_value;
    	let t6;
    	let div6;
    	let div6_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*active*/ ctx[0]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			div0.textContent = "Configuration:";
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text("Budget: ");
    			input0 = element("input");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Max Flips Displayed: ");
    			input1 = element("input");
    			t5 = space();
    			div5 = element("div");
    			button = element("button");
    			p = element("p");
    			if_block.c();
    			t6 = space();
    			div6 = element("div");
    			attr_dev(div0, "class", "config-title svelte-4jsfz0");
    			add_location(div0, file$2, 43, 4, 1443);
    			attr_dev(input0, "class", "input budgetInput svelte-4jsfz0");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 46, 20, 1573);
    			attr_dev(div1, "class", "budget");
    			add_location(div1, file$2, 45, 8, 1531);
    			attr_dev(input1, "class", "input maxDisplayInput svelte-4jsfz0");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 49, 33, 1733);
    			attr_dev(div2, "class", "maxDisplay");
    			add_location(div2, file$2, 48, 8, 1674);
    			attr_dev(div3, "class", "config-menu svelte-4jsfz0");
    			add_location(div3, file$2, 44, 4, 1496);
    			attr_dev(div4, "class", "config svelte-4jsfz0");
    			add_location(div4, file$2, 42, 0, 1417);
    			attr_dev(p, "class", "refreshText svelte-4jsfz0");
    			add_location(p, file$2, 55, 8, 1975);
    			attr_dev(button, "class", button_class_value = "refreshButton " + getActiveClass(/*active*/ ctx[0]) + " svelte-4jsfz0");
    			add_location(button, file$2, 54, 4, 1884);
    			attr_dev(div5, "class", "button-container svelte-4jsfz0");
    			add_location(div5, file$2, 53, 0, 1848);
    			attr_dev(div6, "class", div6_class_value = "progressBar " + getActiveClass(/*active*/ ctx[0]) + " svelte-4jsfz0");
    			set_style(div6, "width", /*loadingPercent*/ ctx[1] + "%");
    			add_location(div6, file$2, 58, 0, 2074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div1, input0);
    			set_input_value(input0, /*budgetInput*/ ctx[2]);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div2, input1);
    			set_input_value(input1, /*maxDisplay*/ ctx[3]);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, button);
    			append_dev(button, p);
    			if_block.m(p, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div6, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[6]),
    					listen_dev(button, "click", /*queryAuction*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*budgetInput*/ 4 && input0.value !== /*budgetInput*/ ctx[2]) {
    				set_input_value(input0, /*budgetInput*/ ctx[2]);
    			}

    			if (dirty & /*maxDisplay*/ 8 && input1.value !== /*maxDisplay*/ ctx[3]) {
    				set_input_value(input1, /*maxDisplay*/ ctx[3]);
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(p, null);
    				}
    			}

    			if (dirty & /*active*/ 1 && button_class_value !== (button_class_value = "refreshButton " + getActiveClass(/*active*/ ctx[0]) + " svelte-4jsfz0")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*active*/ 1 && div6_class_value !== (div6_class_value = "progressBar " + getActiveClass(/*active*/ ctx[0]) + " svelte-4jsfz0")) {
    				attr_dev(div6, "class", div6_class_value);
    			}

    			if (dirty & /*loadingPercent*/ 2) {
    				set_style(div6, "width", /*loadingPercent*/ ctx[1] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div5);
    			if_block.d();
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function cleanIntInput(input) {
    	//remove all commas
    	let cleanedInput = input.replace(/,/g, "");

    	//convert to int
    	cleanedInput = parseInt(cleanedInput);

    	return cleanedInput;
    }

    function getActiveClass(check) {
    	return check ? "active" : "inactive";
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AuctionConfig', slots, []);
    	let active = true;
    	let loadingPercent = 0;
    	let budgetInput = "1,000,000";
    	let maxDisplay = "10";

    	function queryAuction() {
    		if (!active) {
    			return;
    		}

    		$$invalidate(0, active = false);

    		AuctionFinderConfig.updateConfig({
    			budget: cleanIntInput(budgetInput),
    			maxAuctionDisplayCount: cleanIntInput(maxDisplay)
    		});

    		console.log("Refreshing...");
    		AuctionFinder.findAuctions(renderAuctions);
    	}

    	function renderAuctions() {
    		$$invalidate(0, active = true);
    		console.log("Refreshed!");
    		AuctionDisplayManager.updateAuctionRender();

    		setTimeout(
    			() => {
    				$$invalidate(1, loadingPercent = 0);
    			},
    			500
    		);
    	}

    	function updateProgress(fractionPagesLoaded) {
    		$$invalidate(1, loadingPercent = Math.round(fractionPagesLoaded * 100));
    	}

    	AuctionQuery.registerProgressCallback(updateProgress);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AuctionConfig> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		budgetInput = this.value;
    		$$invalidate(2, budgetInput);
    	}

    	function input1_input_handler() {
    		maxDisplay = this.value;
    		$$invalidate(3, maxDisplay);
    	}

    	$$self.$capture_state = () => ({
    		AuctionFinder,
    		AuctionQuery,
    		AuctionFinderConfig,
    		AuctionDisplayManager,
    		active,
    		loadingPercent,
    		budgetInput,
    		maxDisplay,
    		cleanIntInput,
    		queryAuction,
    		renderAuctions,
    		updateProgress,
    		getActiveClass
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('loadingPercent' in $$props) $$invalidate(1, loadingPercent = $$props.loadingPercent);
    		if ('budgetInput' in $$props) $$invalidate(2, budgetInput = $$props.budgetInput);
    		if ('maxDisplay' in $$props) $$invalidate(3, maxDisplay = $$props.maxDisplay);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		loadingPercent,
    		budgetInput,
    		maxDisplay,
    		queryAuction,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class AuctionConfig extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionConfig",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\layouts\page\content\AuctionMenu.svelte generated by Svelte v3.44.3 */
    const file$1 = "src\\layouts\\page\\content\\AuctionMenu.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (13:0) {#if flips.length == 0}
    function create_if_block_1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No flips currently found; refresh to update.";
    			add_location(p, file$1, 14, 4, 775);
    			attr_dev(div, "class", "refreshMessage svelte-1djekzq");
    			add_location(div, file$1, 13, 0, 741);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(13:0) {#if flips.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (28:20) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "AUCTION";
    			attr_dev(div, "class", "auctionType auction svelte-1djekzq");
    			add_location(div, file$1, 28, 20, 1274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(28:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:20) {#if flip.auction.auctionData.bin}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "BIN";
    			attr_dev(div, "class", "auctionType bin svelte-1djekzq");
    			add_location(div, file$1, 24, 20, 1137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:20) {#if flip.auction.auctionData.bin}",
    		ctx
    	});

    	return block;
    }

    // (18:0) {#each flips as flip, i}
    function create_each_block(ctx) {
    	let div4;
    	let div3;
    	let div2;
    	let div0;
    	let t0_value = /*flip*/ ctx[4].auction.auctionData.item_name + "";
    	let t0;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let t4_value = Math.round(/*flip*/ ctx[4].min_profit).toLocaleString("en-US") + "";
    	let t4;
    	let t5;
    	let br;
    	let t6;
    	let t7_value = Math.round(/*flip*/ ctx[4].max_profit).toLocaleString("en-US") + "";
    	let t7;
    	let t8;
    	let t9;
    	let button;
    	let t11;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*flip*/ ctx[4].auction.auctionData.bin) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*i*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Minimum Expected Profit: ");
    			t4 = text(t4_value);
    			t5 = text(" coins ");
    			br = element("br");
    			t6 = text("\r\n                    Maximum Expected Profit: ");
    			t7 = text(t7_value);
    			t8 = text(" coins");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Copy Auction";
    			t11 = space();
    			attr_dev(div0, "class", "name svelte-1djekzq");
    			add_location(div0, file$1, 21, 16, 983);
    			add_location(br, file$1, 34, 105, 1564);
    			attr_dev(div1, "class", "profit svelte-1djekzq");
    			add_location(div1, file$1, 33, 16, 1437);
    			attr_dev(div2, "class", "itemData svelte-1djekzq");
    			add_location(div2, file$1, 20, 12, 943);
    			attr_dev(button, "class", "copy svelte-1djekzq");
    			add_location(button, file$1, 38, 12, 1732);
    			attr_dev(div3, "class", "auctionBox svelte-1djekzq");
    			add_location(div3, file$1, 19, 8, 905);
    			attr_dev(div4, "class", "auctions svelte-1djekzq");
    			add_location(div4, file$1, 18, 4, 873);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			if_block.m(div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, br);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div3, t9);
    			append_dev(div3, button);
    			append_dev(div4, t11);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*flips*/ 1 && t0_value !== (t0_value = /*flip*/ ctx[4].auction.auctionData.item_name + "")) set_data_dev(t0, t0_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (dirty & /*flips*/ 1 && t4_value !== (t4_value = Math.round(/*flip*/ ctx[4].min_profit).toLocaleString("en-US") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*flips*/ 1 && t7_value !== (t7_value = Math.round(/*flip*/ ctx[4].max_profit).toLocaleString("en-US") + "")) set_data_dev(t7, t7_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:0) {#each flips as flip, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let each_1_anchor;
    	let if_block = /*flips*/ ctx[0].length == 0 && create_if_block_1(ctx);
    	let each_value = /*flips*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*flips*/ ctx[0].length == 0) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*copyAuction, Math, flips*/ 3) {
    				each_value = /*flips*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AuctionMenu', slots, []);
    	let flips = []; //[{auction: {auctionData: {bin: true, item_name: "Aspect of the End", uuid: "lol"}}, min_profit: 5, max_profit: 100000}];

    	function callback() {
    		$$invalidate(0, flips = AuctionFinder.flips.slice(0, AuctionFinderConfig.maxAuctionDisplayCount));
    	}

    	function copyAuction(i) {
    		navigator.clipboard.writeText("/viewauction " + flips[i].auction.auctionData.uuid);
    	}

    	AuctionDisplayManager.registerAuctionRenderCallback(callback);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AuctionMenu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => copyAuction(i);

    	$$self.$capture_state = () => ({
    		AuctionFinder,
    		AuctionFinderConfig,
    		AuctionDisplayManager,
    		flips,
    		callback,
    		copyAuction
    	});

    	$$self.$inject_state = $$props => {
    		if ('flips' in $$props) $$invalidate(0, flips = $$props.flips);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [flips, copyAuction, click_handler];
    }

    class AuctionMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuctionMenu",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div;
    	let auctionheader;
    	let t0;
    	let auctionconfig;
    	let t1;
    	let auctionmenu;
    	let current;
    	auctionheader = new AuctionHeader({ $$inline: true });
    	auctionconfig = new AuctionConfig({ $$inline: true });
    	auctionmenu = new AuctionMenu({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(auctionheader.$$.fragment);
    			t0 = space();
    			create_component(auctionconfig.$$.fragment);
    			t1 = space();
    			create_component(auctionmenu.$$.fragment);
    			attr_dev(div, "class", "content svelte-1v8lf31");
    			add_location(div, file, 7, 0, 221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(auctionheader, div, null);
    			append_dev(div, t0);
    			mount_component(auctionconfig, div, null);
    			append_dev(div, t1);
    			mount_component(auctionmenu, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auctionheader.$$.fragment, local);
    			transition_in(auctionconfig.$$.fragment, local);
    			transition_in(auctionmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auctionheader.$$.fragment, local);
    			transition_out(auctionconfig.$$.fragment, local);
    			transition_out(auctionmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(auctionheader);
    			destroy_component(auctionconfig);
    			destroy_component(auctionmenu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		AuctionHeader,
    		AuctionConfig,
    		AuctionMenu
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
