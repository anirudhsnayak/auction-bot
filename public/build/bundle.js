
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
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
    			div0.textContent = "Hopefully this doesn't break. Keep in mind that this will cache the entire Skyblock\r\n        Auction House (about 60mb) to your personal device every time you refresh, so if you have a limited data plan, I suggest that you don't use this tool. \r\n        Due to API limits, refreshing may take up to 1 minute. The displayed flips are not guaranteed to always make profit, as this algorithm cannot take\r\n        every factor into account, and is still in development. Use common sense. To edit a query without refreshing, click the query button to make queries on\r\n        the currently cached Auction House.";
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
            this.commodityWatchlist = this.commodityWatchlist.concat(this.skinWatchlist);
            this.petLoreValueTable = { "Minos Relic": 30 * m, "Dwarf Turtle Shelmet": 2 * m };
            this.loreValueTable = {
                "§k": 4 * m, "§e(+20)": 300 * k, "Enriched with": 2 * m,
                "Ender Slayer VI": 500 * k, "Experience IV": 200 * k,
                "Life Steal IV": 50 * k, "Smite VII": 2.5 * m, "Syphon IV": 100 * k, "Vampirism VI": 200 * k,
                "Power VI": 400 * k, "Fire Protection VII": 1 * m, "Blast Protection VII": 5 * m,
                "Rejuvenate V": 400 * k, "Respite IV": 100 * k, "Respite V": 250 * k,
                "Respite I": 50 * k, "Respite II": 10 * k, "Respite III": 10 * k,
                "True Protection I": 500 * k, "Fortune IV": 300 * k, "Harvesting VI": 200 * k,
                "Replenish I": 1 * m, "Blessing VI": 1 * m, "Caster VI": 400 * k, "Looting IV": 50 * k,
                "Luck of the Sea VI": 50 * k, "One For All": 4 * m, "Giant Killer VI": 100 * k
            };
            this.enchantValueTable = {
                "Dragon Hunter": 200 * k, "Overload": 700 * k, "Ferocious Mana": 200 * k, "Hardened Mana": 50 * k,
                "Mana Vampire": 250 * k, "Smarty Pants": 400 * k, "Sugar Rush": 100 * k, "Pristine": 1 * m,
                "Turbo-Wheat": 30 * k, "Turbo-Carrot": 50 * k, "Turbo-Potato": 100 * k, "Turbo-Cacti": 100 * k,
                "Turbo-Pumpkin": 100 * k, "Turbo-Melon": 50 * k, "Turbo-Mushrooms": 50 * k, "Turbo-Cocoa": 50 * k,
                "Turbo-Warts": 30 * k, "Charm": 100 * k, "Corruption": 30 * k, "Chimera": 100 * m, "Combo": 30 * k,
                "Duplex": 13 * m, "Fatal Tempo": 150 * m, "Flash": 2 * m, "Inferno": 45 * m, "Last Stand": 100 * k,
                "Legion": 1 * m, "Rend": 200 * k, "Soul Eater": 1 * m, "Swarm": 500 * k, "Ultimate Wise": 100 * k,
                "Wisdom": 125 * k
            };
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
            if (params.profitCriteria != NaN) {
                this.profitCriteria = params.profitCriteria;
            }
            this.sortCriteria = params.sortCriteria;
            this.shownItems = params.shownItems;
        }
    }
    _a = AuctionFinderConfig;
    AuctionFinderConfig.maxPageQueries = 100;
    AuctionFinderConfig.maxAuctionDisplayCount = 30;
    AuctionFinderConfig.minVolume = 4; // need at least 4 items to consider an item
    AuctionFinderConfig.budget = 5000000;
    AuctionFinderConfig.acceptRawAuctions = true; //needs more testing
    AuctionFinderConfig.profitCriteria = 0;
    AuctionFinderConfig.sortCriteria = "Efficiency";
    AuctionFinderConfig.shownItems = {
        pets: true,
        commodities: true,
        talismans: true,
        upgradables: true
    };
    //starred items go before non-starred items
    //basically more specific names go before less specific names
    AuctionFinderConfig.skinWatchlist = [
        "Twilight Tiger Skin", "Spirit Skin", "Radiant Enderman Skin", "Void Conqueror Skin", "Golden Monkey Skin", "Icicle Skin", "Neon Blue Ender Dragon Skin", "Black Widow Skin", "Reinforced Skin", "Pufferfish Skin",
        "Neon Red Ender Dragon Skin", "Purple Elephant Skin", "Red Elephant Skin", "Puppy Skin", "Green Elephant Skin", "Light Blue Sheep Skin", "Onyx Black Cat Skin", "Light Green Sheep Skin", "Blue Elephant Skin",
        "White Sheep Skin", "Pink Sheep Skin", "Black Sheep Skin", "Red Sheep Skin", "Purple Sheep Skin", "Smiling Rock Skin", "Pink Elephant Skin", "Cool Rock Skin", "Laughing Rock Skin", "Thinking Rock Skin",
        "Orange Elephant Skin", "Neon Red Sheep Skin", "Neon Blue Sheep Skin", "Derpy Rock Skin", "Embarrassed Rock Skin", "Crimson Skin", "Fossilized Silverfish Skin", "Pastel Ender Dragon Skin",
        "Purple Egged Skin", "Green Egged Skin", "Orca Blue Whale Skin", "Zombie Skeleton Horse Skin", "Mauve Skin", "Admiral Skin", "Enderpack Skin", "Watcher Guardian Skin", "Grown-up Baby Yeti Skin",
        "Snowglobe Skin", "Monochrome Elephant Skin"
    ];
    AuctionFinderConfig.commodityWatchlist = [
        "Mithril-Plated Drill Engine", "Titanium-Plated Drill Engine",
        "Krampus Helmet", "Ultimate Carrot Candy Upgrade", "Jumbo Backpack Upgrade", "Enrichment", "Chimera I", "Pristine V", "Pristine I", "Soul Eater I",
        "Autopet Rules", "French Bread", "Pioneer Pickaxe", "Gorilla Monkey", "XX-Large Storage", "X-Large Storage", "Tier Boost", "Beacon V", "Beacon IV", "Beacon III", "Beacon II", "Beacon I",
        "Infinityboom TNT", "Flycatcher", "Pumpkin Launcher", "Lucky Clover", "Lesser Soulflow Engine", "Ancient Rose", "Reforge Anvil", "Exp Share", "Exp Share Core", "Enchanted Hopper",
        "Soul Esoward", "Large Storage", "Weird Tuba", "Judgement Core", "Jungle Heart", "Plasmaflux Power Orb", "Warden Heart", "Plasma Nucleus", "Null Blade", "Overflux Power Orb",
        "!RARE Griffin Upgrade Stone", "!EPIC Griffin Upgrade Stone", "!LEGENDARY Griffin Upgrade Stone", "Royal Pigeon", "Shard of the Shredded", "Vampire Fang", "Scythe Shard", "Reaper Gem", "Washed-up Souvenir",
        "Wood Singularity", "Tesselated Ender Pearl", "Corleonite", "Diamante\u0027s Handle", "Necron\u0027s Handle", "Wither Blood", "Precursor Gear", "Block Zapper", "Builder\u0027s Wand", "Overflux Capacitor",
        "First Master Star", "Second Master Star", "Third Master Star", "Fourth Master Star", "Fifth Master Star", "Soulflow Engine", "Minos Relic", "Braided Griffin Feather",
        "Silex", "Dragon Horn", "Null Edge", "Dwarf Turtle Shelmet", "Deep Sea Orb", "Dragon Claw", "Dragon Scale", "Recall Potion", "Spirit Bone", "Spirit Wing", "Personal Harp", "Lucky Dice", "Sadan\u0027s Brooch",
        "Summoning Ring", "Perfectly-Cut Fuel Tank", "Amber-polished Drill Engine", "Gemstone Mixture", "Mithril Plate", "Golden Plate", "Gemstone Fuel Tank",
        "Titanium-plated Drill Engine", "Jaderald", "Warped Stone", "Mana Flux Power Orb", "Art of War", "Wood Singularity", "Ruby Power Scroll", "Sapphire Power Scroll", "Jasper Power Scroll", "Amethyst Power Scroll",
        "Amber Power Scroll", "Opal Power Scroll", "Warning Flare", "Alert Flare", "SOS Flare", "Scourge Cloak", "Ancient Cloak", "Annihilation Cloak", "Arachne Crystal", "Arachne Fragment", "Arachne\u0027s Keeper Fragment", "Archfiend Dice",
        "Ghast Cloak", "Vanquished Ghast Cloak", "Molten Cloak", "Destruction Cloak", "Dark Queen's Soul Drop", "Magma Necklace", "Vanquished Magma Necklace", "Delirium Necklace", "Lava Shell Necklace", "Molten Necklace",
        "Synthesizer v1", "Synthesizer v2", "Synthesizer v3", "Thunderbolt Necklace", "Molten Bracelet", "Glowstone Gauntlet", "Vanquished Glowstone Gauntlet", "Gauntlet of Contagion", "Flaming Fist", "Magma Lord Gauntlet",
        "Demonslayer Gauntlet", "Implosion Belt", "Scoville Belt", "Blaze Belt", "Vanquished Blaze Belt", "Molten Belt", "Diamond Magmafish", "Diamond the Fish", "Digested Mosquito", "Divan\u0027s Alloy", "Divan Fragment",
        "Dungeon Chest Key", "Emperor's Skull", "Empty Thunder Bottle", "Thunder in a Bottle", "Enderman Cortex Rewriter", "Exceedingly Rare Ender Artifact Upgrader", "Experiment the Fish", "Farming for Dummies",
        "Flake the Fish", "Fly Swatter", "Gabagool the Fish", "Game Breaker", "Game Annihilator", "Game Fixer", "Gemstone Chamber", "Gift the Fish", "Gloomlock Grimoire", "God Potion", "Gold Magmafish",
        "Golden Treat", "Goldor the Fish", "Great Carrot Candy", "Superb Carrot Candy", "Ultimate Carrot Candy", "Great Spook Staff", "Radiant Power Orb", "Lesser Orb of Healing", "Jingle Bells",
        "Atominizer", "Control Switch", "FTX 3070", "Electron Transmitter", "Robotron Reflector", "Synthetic Heart", "Superlite Motor", "Ruby-polished Drill Engine", "Sapphire-polished Drill Engine",
        "Jumbo Backpack", "Greater Backpack", "Large Backpack", "Medium Backpack", "Beheaded Horror", "Bigfoot\u0027s Lasso", "Blue Cheese Goblin Omelette", "Braided Griffin Feather", "Chill the Fish", "Chyme",
        "Clown Disc", "Cluck the Fish", "Pesto Goblin Omelette", "Sunny Side Goblin Omelette", "Spicy Goblin Omelette", "Goblin Omelette", "Wand of Mending", "Wand of Restoration", "Gyrokinetic Wand", "Etherwarp Conduit",
        "Wand of Strength", "Heat Core", "Helix", "High Class Archfiend Dice", "Hilt of True Ice", "Hologram", "Horseman\u0027s Candle", "Hunk of Ice", "Hunk of Blue Ice", "Hyper Catalyst Upgrade", "Inferno Fuel Block",
        "Inferno Minion Fuel", "Jolly Pink Rock", "Kat Flower", "Kelvin Inverter", "Kismet Feather", "L.A.S.R.\u0027s Eye", "Livid Fragment", "Lucky Clover Core", "Magma Core", "Magma Lord Fragment", "Mana Disintegrator",
        "Staff of the Volcano", "Mana Disintegrator", "Maxor the Fish", "Minion Storage X-pender", "Mithril-Infused Fuel Tank", "Titanium-Infused Fuel Tank", "Drill Engine", "Fuel Tank", "Implosion", "Wither Shield", "Shadow Warp",
        "Wither Impact", "Nope the Fish", "Null Blade", "Null Edge", "Oops the Fish", "Radioactive Vial", "Scorched Power Crystal", "Scythe Blade", "Shrimp the Fish", "Sinful Dice", "Spook the Fish", "Spooky Shard", "Storm the Fish",
        "Subzero Inverter", "Tactical Insertion", "Tier Boost Core", "Transmission Tuner", "Weak Wolf Catalyst", "Wilson\u0027s Engineering Plans", "Colossal Experience Bottle Upgrade", "Wither Catalyst", "Zog Anvil",
        "Serrated Claws", "Bigger Teeth", "Gold Claws", "Reinforced Scales", "All Skills Exp Super-Boost", "Textbook", "Saddle", "Jerry 3D Glasses", "Crochet Tiger Plushie", "Antique Remedies", "Flying Pig", "Quick Claw",
        "!RARE Wisp Upgrade Stone", "!EPIC Wisp Upgrade Stone", "!LEGENDARY Wisp Upgrade Stone", "!EPIC Foraging Exp Boost", "!UNCOMMON Fishing Exp Boost", "!RARE Fishing Exp Boost", "!EPIC Fishing Exp Boost"
    ];
    AuctionFinderConfig.talismanWatchlist = ["Personal Compactor 7000", "Personal Compactor 6000", "Bat Artifact", "Golden Jerry Artifact", "Hegemony Artifact", "Candy Relic", "Reaper Orb", "Scarf\u0027s Grimoire", "Treasure Artifact", "Razor-sharp Shark Tooth Necklace",
        "!MYTHIC Beastmaster Crest", "!LEGENDARY Beastmaster Crest", "!EPIC Beastmaster Crest", "!RARE Beastmaster Crest", "Wither Relic", "Auto Recombobulator", "Titanium Relic", "Seal of the Family", "Ender Artifact", "Wither Artifact", "Ender Relic",
        "Spider Artifact", "Treasure Ring", "Catacombs Expert Ring", "Red Claw Artifact", "Spiked Atrocity", "Experience Artifact", "Soulflow Supercell", "Tarantula Talisman", "Hunter Ring", "Purple Jerry Talisman", "Bait Ring",
        "Survivor Cube", "Zombie Artifact", "Speed Artifact", "Devour Ring", "Wolf Ring", "Intimidation Artifact", "Frozen Chicken", "Bits Talisman", "Eternal Hoof", "Soulflow Battery", "Bat Person Artifact", "Blue Jerry Talisman",
        "Titanium Ring", "Sea Creature Artifact", "Personal Compactor 5000", "Mineral Talisman", "Red Claw Ring", "Scarf\u0027s Studies", "Scarf\u0027s Thesis", "Fish Affinity Talisman", "Potion Affinity Artifact", "Feather Artifact",
        "Haste Ring", "Crab Hat of Celebration", "Blood God Crest", "Potato Talisman", "Handy Blood Chalice", "Pocket Espresso Machine", "Jungle Amulet", "Hunter Talisman", "Wolf Paw", "Personal Deletor 4000", "Personal Deletor 5000",
        "Personal Deletor 6000", "Personal Deletor 7000", "Titanium Artifact", "Talisman of Power", "Ring of Power", "Artifact of Power", "Bat Ring", "Intimidation Ring", "Jungle Amulet", "Bingo Talisman", "Bingo Ring", "Bingo Artifact",
        "Jacobus Register", "New Year Cake Bag", "Potato Talisman", "Dull Shark Tooth Necklace", "Honed Shark Tooth Necklace", "Sharp Shark Tooth Necklace", "Green Jerry Talisman", "Blue Jerry Talisman", "Purple Jerry Talisman",
        "Golden Jerry Artifact", "Bat Person Talisman", "Bat Person Ring", "Bat Talisman", "Spider Talisman", "Wolf Talisman", "Lucky Hoof", "Netherrack-Looking Sunshade", "Spider Ring", "Soulflow Pile", "Burststopper Talisman", "Burststopper Artifact",
        "Candy Ring", "Candy Artifact", "Farmer Orb", "Night Vision Charm", "Speed Ring", "Feather Ring", "Broken Piggy Bank", "Cracked Piggy Bank", "Piggy Bank", "Emerald Ring", "Personal Compactor 4000", "Treasure Talisman",
        "Master Skull - Tier 1", "Master Skull - Tier 2", "Master Skull - Tier 3", "Master Skull - Tier 4", "Master Skull - Tier 5", "Master Skull - Tier 6", "Master Skull - Tier 7", "Nether Artifact", "Blaze Talisman", "Pulse Ring"];
    AuctionFinderConfig.upgradableWatchlist = ["Storm\u0027s Boots ✪✪✪✪✪", "Necron\u0027s Boots ✪✪✪✪✪", "Goldor\u0027s Boots ✪✪✪✪✪",
        "Storm\u0027s Leggings ✪✪✪✪✪", "Necron\u0027s Leggings ✪✪✪✪✪", "Goldor\u0027s Leggings ✪✪✪✪✪",
        "Storm\u0027s Chestplate ✪✪✪✪✪", "Necron\u0027s Chestplate ✪✪✪✪✪", "Goldor\u0027s Chestplate ✪✪✪✪✪",
        "Livid Dagger ✪✪✪✪✪", "Flower of Truth ✪✪✪✪✪", "Reaper Mask ✪✪✪✪✪",
        "Axe of the Shredded ✪✪✪✪✪", "Shadow Assassin Chestplate ✪✪✪✪✪", "Necron\u0027s Blade",
        "Juju Shortbow ✪✪✪✪✪", "Wand of Atonement", "Vorpal Katana", "Wither Goggles ✪✪✪✪✪", "End Stone Sword",
        "Warden Helmet", "Atomsplit Katana", "Aspect of the End", "Aspect of the Dragons", "Frozen Scythe", "Revenant Falchion",
        "Golem Sword", "Raider Axe", "Twilight Dagger", "Explosive Bow", "Magma Bow", "Slime Bow", "Scorpion Bow", "Hurricane Bow",
        "Runaan\u0027s Bow", "Death Bow", "Spider Queen\u0027s Stinger", "Venom\u0027s Touch", "Souls Rebound", "Mosquito Bow",
        "Ornate Zombie Sword", "Recluse Fang", "Edible Mace", "Voidedge Katana", "Tactician\u0027s Sword", "Blade of the Volcano",
        "Ragnarock Axe", "Fire Freeze Staff", "Ember Rod", "Fire Fury Staff", "Scorpion Foil", "Shaman Sword", "Aspect of the Void",
        "Reaper Falchion", "Emerald Blade", "Ink Wand", "Kindlebane Dagger", "Mawdredge Dagger", "Leaping Sword", "Vorpal Katana",
        "Sword of Revelations", "Enrager", "Pooch Sword", "Ghoul Buster", "Soul Whip", "Pyrochaos Dagger", "Deathripper Dagger",
        "Yeti Sword", "Silk-Edge Sword", "Florid Zombie Sword", "Gemstone Gauntlet", "Daedalus Axe", "Phantom Rod", "Pigman Sword",
        "Atomsplit Katana", "Reaper Scythe", "Bonzo\u0027s Staff", "Adaptive Blade", "Spirit Sceptre", "Ice Spray Wand", "Livid Dagger",
        "Shadow Fury", "Fel Sword", "Wither Cloak Sword", "Necromancer Sword", "Giant\u0027s Sword", "Hyperion", "Astraea", "Scylla",
        "Aurora Staff", "Jungle Pickaxe", "Refined Mithril Pickaxe", "Titanium Pickaxe", "Refined Titanium Pickaxe", "Titanium Pickaxe",
        "Stonk", "Pickonimbus 2000", "Mithril Drill SX-R226", "Mithril Drill SX-R326", "Titanium Drill DR-X355", "Titanium Drill DR-X455",
        "Titanium Drill DR-X555", "Titanium Drill DR-X655", "Divan\u0027s Drill", "Ruby Drill TX-15", "Gemstone Drill LT-522",
        "Topaz Drill KGR-12", "Jasper Drill X", "Coco Chopper", "Melon Dicer", "Treecapitator", "Pumpkin Dicer", "Fungi Cutter", "Cactus Knife",
        "Euclid\u0027s Wheat Hoe", "Gauss Carrot Hoe", "Pythagorean Potato Hoe", "Turing Sugar Cane Hoe", "Newton Nether Warts Hoe",
        "Speedster Rod", "Winter Rod", "Challenging Rod", "Rod of Champions", "Rod of Legends", "Yeti Rod", "Auger Rod", "Rod of the Sea",
        "Magma Rod", "Inferno Rod", "Hellfire Rod", "Shredder", "Phantom Rod", "Fire Veil Wand",
        "Valkyrie", "Dark Claymore", "Spirit Bow", "Bonemerang", "Last Breath", "Terminator", "Voodoo Doll",
        "Shimmering Light Hood", "Shimmering Light Tunic", "Shimmering Light Trousers", "Shimmering Light Slippers",
        "Rampart Helmet", "Rampart Chestplate", "Rampart Leggings", "Rampart Boots", "Helmet of the Pack", "Chestplate of the Pack",
        "Leggings of the Pack", "Boots of the Pack", "Armor of Magma Helmet", "Armor of Magma Chestplate", "Armor of Magma Leggings",
        "Armor of Magma Boots", "Emerald Helmet", "Emerald Chestplate", "Emerald Leggings", "Emerald Boots",
        "Crystal Helmet", "Crystal Chestplate", "Crystal Leggings", "Crystal Boots",
        "Zombie Chestplate", "Zombie Leggings", "Zombie Boots",
        "Revenant Chestplate", "Revenant Leggings", "Revenant Boots",
        "Reaper Chestplate", "Reaper Leggings", "Reaper Boots",
        "Flamebreaker Helmet", "Flamebreaker Chestplate", "Flamebreaker Leggings", "Flamebreaker Boots",
        "Blaze Helmet", "Blaze Chestplate", "Blaze Leggings", "Blaze Boots",
        "Cheap Tuxedo Jacket", "Cheap Tuxedo Pants", "Cheap Tuxedo Oxfords",
        "Fancy Tuxedo Jacket", "Fancy Tuxedo Pants", "Fancy Tuxedo Oxfords",
        "Elegant Tuxedo Jacket", "Elegant Tuxedo Pants", "Elegant Tuxedo Oxfords",
        "Ender Helmet", "Ender Chestplate", "Ender Leggings", "Ender Boots",
        "Speedster Helmet", "Speedster Chestplate", "Speedster Leggings", "Speedster Boots",
        "Sponge Helmet", "Sponge Chestplate", "Sponge Leggings", "Spongy Shoes",
        "Mastiff Helmet", "Mastiff Chestplate", "Mastiff Leggings", "Mastiff Boots",
        "Tarantula Helmet", "Tarantula Chestplate", "Tarantula Leggings", "Tarantula Boots",
        "Spooky Helmet", "Spooky Chestplate", "Spooky Leggings", "Spooky Boots",
        "Snow Suit Helmet", "Snow Suit Chestplate", "Snow Suit Leggings", "Snow Suit Boots",
        "Mineral Helmet", "Mineral Chestplate", "Mineral Leggings", "Mineral Boots",
        "Glacite Helmet", "Glacite Chestplate", "Glacite Leggings", "Glacite Boots",
        "Helmet of the Rising Sun", "Chestplate of the Rising Sun", "Leggings of the Rising Sun", "Boots of the Rising Sun",
        "Great Spook Helmet", "Great Spook Chestplate", "Great Spook Leggings", "Great Spook Boots",
        "Berserker Helmet", "Berserker Chestplate", "Berserker Leggings", "Berserker Boots",
        "Shark Scale Helmet", "Shark Scale Chestplate", "Shark Scale Leggings", "Shark Scale Boots",
        "Bat Person Helmet", "Bat Person Chestplate", "Bat Person Leggings", "Bat Person Boots",
        "Diver\u0027s Mask", "Diver\u0027s Shirt", "Diver\u0027s Trunks", "Diver\u0027s Boots",
        "Werewolf Helmet", "Werewolf Chestplate", "Werewolf Leggings", "Werewolf Boots",
        "Frozen Blaze Helmet", "Frozen Blaze Chestplate", "Frozen Blaze Leggings", "Frozen Blaze Boots",
        "Young Dragon Helmet", "Young Dragon Chestplate", "Young Dragon Leggings", "Young Dragon Boots",
        "Old Dragon Helmet", "Old Dragon Chestplate", "Old Dragon Leggings", "Old Dragon Boots",
        "Wise Dragon Helmet", "Wise Dragon Chestplate", "Wise Dragon Leggings", "Wise Dragon Boots",
        "Protector Dragon Helmet", "Protector Dragon Chestplate", "Protector Dragon Leggings", "Protector Dragon Boots",
        "Strong Dragon Helmet", "Strong Dragon Chestplate", "Strong Dragon Leggings", "Strong Dragon Boots",
        "Unstable Dragon Helmet", "Unstable Dragon Chestplate", "Unstable Dragon Leggings", "Unstable Dragon Boots",
        "Superior Dragon Helmet", "Superior Dragon Chestplate", "Superior Dragon Leggings", "Superior Dragon Boots",
        "Holy Dragon Helmet", "Holy Dragon Chestplate", "Holy Dragon Leggings", "Holy Dragon Boots",
        "Sorrow Helmet", "Sorrow Chestplate", "Sorrow Leggings", "Sorrow Boots",
        "Final Destination Helmet", "Final Destination Chestplate", "Final Destination Leggings", "Final Destination Boots",
        "Helmet of Divan", "Chestplate of Divan", "Leggings of Divan", "Boots of Divan",
        "Magma Lord Helmet", "Magma Lord Chestplate", "Magma Lord Leggings", "Magma Lord Boots",
        "Infernal Crimson Helmet", "Infernal Crimson Chestplate", "Infernal Crimson Leggings", "Infernal Crimson Boots",
        "Fiery Crimson Helmet", "Fiery Crimson Chestplate", "Fiery Crimson Leggings", "Fiery Crimson Boots",
        "Burning Crimson Helmet", "Burning Crimson Chestplate", "Burning Crimson Leggings", "Burning Crimson Boots",
        "Hot Crimson Helmet", "Hot Crimson Chestplate", "Hot Crimson Leggings", "Hot Crimson Boots",
        "Crimson Helmet", "Crimson Chestplate", "Crimson Leggings", "Crimson Boots",
        "Infernal Aurora Helmet", "Infernal Aurora Chestplate", "Infernal Aurora Leggings", "Infernal Aurora Boots",
        "Fiery Aurora Helmet", "Fiery Aurora Chestplate", "Fiery Aurora Leggings", "Fiery Aurora Boots",
        "Burning Aurora Helmet", "Burning Aurora Chestplate", "Burning Aurora Leggings", "Burning Aurora Boots",
        "Hot Aurora Helmet", "Hot Aurora Chestplate", "Hot Aurora Leggings", "Hot Aurora Boots",
        "Aurora Helmet", "Aurora Chestplate", "Aurora Leggings", "Aurora Boots",
        "Infernal Fervor Helmet", "Infernal Fervor Chestplate", "Infernal Fervor Leggings", "Infernal Fervor Boots",
        "Fiery Fervor Helmet", "Fiery Fervor Chestplate", "Fiery Fervor Leggings", "Fiery Fervor Boots",
        "Burning Fervor Helmet", "Burning Fervor Chestplate", "Burning Fervor Leggings", "Burning Fervor Boots",
        "Hot Fervor Helmet", "Hot Fervor Chestplate", "Hot Fervor Leggings", "Hot Fervor Boots",
        "Fervor Helmet", "Fervor Chestplate", "Fervor Leggings", "Fervor Boots",
        "Infernal Hollow Helmet", "Infernal Hollow Chestplate", "Infernal Hollow Leggings", "Infernal Hollow Boots",
        "Fiery Hollow Helmet", "Fiery Hollow Chestplate", "Fiery Hollow Leggings", "Fiery Hollow Boots",
        "Burning Hollow Helmet", "Burning Hollow Chestplate", "Burning Hollow Leggings", "Burning Hollow Boots",
        "Hot Hollow Helmet", "Hot Hollow Chestplate", "Hot Hollow Leggings", "Hot Hollow Boots",
        "Hollow Helmet", "Hollow Chestplate", "Hollow Leggings", "Hollow Boots",
        "Infernal Terror Helmet", "Infernal Terror Chestplate", "Infernal Terror Leggings", "Infernal Terror Boots",
        "Fiery Terror Helmet", "Fiery Terror Chestplate", "Fiery Terror Leggings", "Fiery Terror Boots",
        "Burning Terror Helmet", "Burning Terror Chestplate", "Burning Terror Leggings", "Burning Terror Boots",
        "Hot Terror Helmet", "Hot Terror Chestplate", "Hot Terror Leggings", "Hot Terror Boots",
        "Terror Helmet", "Terror Chestplate", "Terror Leggings", "Terror Boots",
        "Adaptive Helmet", "Adaptive Chestplate", "Adaptive Leggings", "Adaptive Boots",
        "Shadow Assassin Helmet", "Shadow Assassin Chestplate", "Shadow Assassin Leggings", "Shadow Assassin Boots",
        "Necromancer Lord Helmet", "Necromancer Lord Chestplate", "Necromancer Lord Leggings", "Necromancer Lord Boots",
        "Goldor\u0027s Helmet", "Goldor\u0027s Chestplate", "Goldor\u0027s Leggings", "Goldor\u0027s Boots",
        "Storm\u0027s Helmet", "Storm\u0027s Chestplate", "Storm\u0027s Leggings", "Storm\u0027s Boots",
        "Necron\u0027s Helmet", "Necron\u0027s Chestplate", "Necron\u0027s Leggings", "Necron\u0027s Boots",
        "Maxor\u0027s Helmet", "Maxor\u0027s Chestplate", "Maxor\u0027s Leggings", "Maxor\u0027s Boots",
        "Wither Helmet", "Wither Chestplate", "Wither Leggings", "Wither Boots",
        "Skeleton\u0027s Helmet", "Taurus Helmet", "Witch Mask", "Vampire Mask", "Vampire Witch Mask",
        "Zombie's Heart", "Reaper Mask", "Revived Heart", "Spirit Mask", "Crown of Greed", "Warden Helmet",
        "Mender Helmet", "Mender Fedora", "Mender Crown", "Dark Goggles", "Shadow Goggles", "Wither Goggles",
        "Bonzo's Mask", "Precursor Eye", "Crystallized Heart", "Golden Bonzo Head", "Diamond Bonzo Head",
        "Golden Scarf Head", "Diamond Scarf Head", "Golden Professor Head", "Diamond Professor Head",
        "Golden Thorn Head", "Diamond Thorn Head", "Golden Livid Head", "Diamond Livid Head",
        "Golden Sadan Head", "Diamond Sadan Head", "Golden Necron Head", "Diamond Necron Head",
        "Guardian Chestplate", "Flaming Chestplate", "Obsidian Chestplate", "Mithril Coat",
        "Stone Chestplate", "Metal Chestplate", "Steel Chestplate", "Creeper Pants", "Moogma Leggings", "Stereo Pants",
        "Farmer Boots", "Spider\u0027s Boots", "Spirit Boots", "Rancher\u0027s Boots", "Slug Boots"]; //add midas weapons
    AuctionFinderConfig.petWatchlist = ["!LEGENDARY Baby Yeti", "!EPIC Baby Yeti", "!LEGENDARY Squid", "!LEGENDARY Flying Fish", "!LEGENDARY Lion", "!LEGENDARY Elephant",
        "!LEGENDARY Tiger", "!LEGENDARY Black Cat", "!EPIC Tiger", "!LEGENDARY Blue Whale", "!LEGENDARY Rabbit"]; //fill in the rest of the pets
    AuctionFinderConfig.petRarities = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "MYTHIC"];
    AuctionFinderConfig.petMultiplierTable = { "!LEGENDARY Wolf": 7, "!LEGENDARY Sheep": 3, "!LEGENDARY Rabbit": 5, "!LEGENDARY Blue Whale": 24, "!LEGENDARY Dolphin": 20,
        "!EPIC Dolphin": 9, "!EPIC Tiger": 10, "LEGENDARY Tiger": 13, "!LEGENDARY Spider": 34, "!LEGENDARY Tarantula": 19,
        "!LEGENDARY Elephant": 8, "!MYTHIC Bat": 2, "!LEGENDARY Bat": 5, "!LEGENDARY Ender Dragon": 13, "!LEGENDARY Black Cat": 26,
        "!LEGENDARY Baby Yeti": 22, "!EPIC Baby Yeti": 7, "!LEGENDARY Squid": 10, "!LEGENDARY Flying Fish": 18, "!LEGENDARY Lion": 24
    };
    AuctionFinderConfig.auctionConsiderationTime = 5 * 60 * 1000; //ms
    AuctionFinderConfig.init = _a.initialize();

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
                        if (this.identifyAuction(auction, petType)) {
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
                AuctionEstimatedValue.getNameValue(auctionData) + AuctionEstimatedValue.getEnchantmentValue(auctionData);
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
        static getEnchantmentValue(auctionData) {
            let enchantValue = 0;
            for (let key in AuctionFinderConfig.enchantValueTable) {
                if (auctionData.item_lore.includes(key)) {
                    enchantValue += this.getEnchantValue(auctionData.item_lore, key, AuctionFinderConfig.enchantValueTable[key]);
                }
            }
            return enchantValue;
        }
        static getEnchantValue(auctionLore, enchant, baseEnchantValue) {
            let enchantPosition = auctionLore.indexOf(enchant);
            if (enchantPosition == -1) {
                return 0;
            }
            let romanNumeral = auctionLore.substring(enchantPosition + enchant.length + 1, auctionLore.indexOf("§", enchantPosition + enchant.length + 1));
            return baseEnchantValue * Math.pow(2, AuctionEstimatedValue.getRomanNumeralValue(romanNumeral) - 1);
        }
        static getRomanNumeralValue(romanNumeral) {
            //returns roman numeral values between 0 and 10
            //too lazy to implement this properly
            switch (romanNumeral) {
                case "I": return 1;
                case "II": return 2;
                case "III": return 3;
                case "IV": return 4;
                case "V": return 5;
                case "VI": return 6;
                case "VII": return 7;
                case "VIII": return 8;
                case "IX": return 9;
                case "X": return 10;
                default: return 0;
            }
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
        - MAKE ANOTHER WATCHLIST FOR SKINS!!!!!!
        - ADD AN OPTION TO REMOVE FAKE FLIPS FROM THE DISPLAY LIST MANUALLY, (so that the list is less cluttered and less pointless)
        - DON'T RECALCULATE FLIPS FOR EACH QUERY. Cache the flip list, and then sort results based on query.
        - Add another identifier to the flip list (that identifies if the flip is the lowest bin)
        - Issue of deadlock, one flip references another
            - Add a buyout system to fix deadlock
        - Make the tax calculation actually accurate
        - Add perfect armor
        - Use historical prices as a better "price ceiling", if possible
        - Efficient separation while server is sending AH data
        - Figure out a way to deal with undervalued items bought from NPCs
        - Display Flip Results Separately (commodities tend to be more reliable than other items)
        - Sort using one name for an armor set (instead of listing all of them)
        - Sort using one name for a set of enchanted books (instead of listing all of them)
        - ALL weapons should be checked separately for 5 stars
        - Remove things that are in bazaar from check list
        - Deal with efficiency levels
        - Account for weapon/armor kills
            - Account for compact/cultivating/expertise enchant amt broken
        - Account for upgraded armor (like with scarf frags)
        - Add MORE items to the flip list
        - Stacked Items
        - Account for tier boosts
        - Upgrade flipping?
        - Better pet calculation
        - Master Stars
        - etc...
    */
    class AuctionFinder {
        static blacklistUUID(uuid) {
            this.blacklistedUUIDs.push(uuid);
        }
        static findAuctions(callback) {
            AuctionQuery.updateAuctions().then(combinedAuctions => {
                this.findAuctionsImpl(AuctionSeparator.separateAuctions(combinedAuctions));
                this.queryAuctions(callback);
            });
        }
        static compareFlips(a, b) {
            if (AuctionFinderConfig.sortCriteria === "Profit") {
                return b.max_profit - a.max_profit;
            }
            if (AuctionFinderConfig.sortCriteria === "Efficiency") {
                return (b.max_profit / b.auction.auctionCost) - (a.max_profit / a.auction.auctionCost);
            }
            return b.max_profit - a.max_profit;
        }
        static queryAuctions(callback) {
            //copy flips
            this.queriedFlips = [];
            for (let flip of this.flips) {
                if (this.checkFlipMatchesQuery(flip) && !this.blacklistedUUIDs.includes(flip.auction.auctionData.uuid)) {
                    this.queriedFlips.push(flip);
                }
            }
            this.queriedFlips.sort(this.compareFlips);
            console.log(this.queriedFlips);
            callback();
        }
        static checkFlipMatchesQuery(flip) {
            if (flip.auction.auctionCost > AuctionFinderConfig.budget) {
                return false;
            }
            if (flip.max_profit < AuctionFinderConfig.profitCriteria) {
                return false;
            }
            switch (flip.category) {
                case "Pet":
                    if (!AuctionFinderConfig.shownItems.pets) {
                        return false;
                    }
                    break;
                case "Commodity":
                    if (!AuctionFinderConfig.shownItems.commodities) {
                        return false;
                    }
                    break;
                case "Talisman":
                    if (!AuctionFinderConfig.shownItems.talismans) {
                        return false;
                    }
                    break;
                case "Upgradable":
                    if (!AuctionFinderConfig.shownItems.upgradables) {
                        return false;
                    }
                    break;
                default:
                    return false;
            }
            return true;
        }
        static findAuctionsImpl(auctions) {
            this.flips = [];
            this.bestAuctions = [];
            let petAuctions = auctions.petAuctions;
            let commodityAuctions = auctions.commodityAuctions;
            let talismanAuctions = auctions.talismanAuctions;
            let upgradableAuctions = auctions.upgradableAuctions;
            this.findAuctionsCategory(petAuctions, AuctionEstimatedValue.getPetBaseValue, "Pet");
            this.findAuctionsCategory(commodityAuctions, AuctionEstimatedValue.getCommodityBaseValue, "Commodity");
            this.findAuctionsCategory(talismanAuctions, AuctionEstimatedValue.getTalismanBaseValue, "Talisman");
            this.findAuctionsCategory(upgradableAuctions, AuctionEstimatedValue.getUpgradableBaseValue, "Upgradable");
        }
        static findAuctionsCategory(auctions, valueFunction, category) {
            for (let key in auctions) {
                this.findFlips(this.filterAuctions(key, auctions[key], valueFunction), category);
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
        static findFlips(filteredAuctions, category_) {
            if (filteredAuctions.length < AuctionFinderConfig.minVolume) {
                return;
            }
            let maxBaseValue = -1;
            let auctionSort = filteredAuctions.sort((a, b) => { return a.auctionCost - b.auctionCost; });
            let lowestRawCost = this.rawCostLeastBin(auctionSort);
            for (let i = 0; i < auctionSort.length; i++) {
                let currentAuction = auctionSort[i];
                let optimalFlipPriceIndex = i;
                // if(currentBudget > AuctionFinderConfig.budget){
                //     break; //clearly everything after this exceeds our budget
                // }
                if (maxBaseValue < currentAuction.auctionBaseValue) { //ensures our item is the best we can get
                    if (i == auctionSort.length - 1) {
                        this.bestAuctions.push(currentAuction); //to avoid out of bounds error
                        continue;
                    }
                    if (currentAuction.auctionData.bin) { //bins are used as reference
                        maxBaseValue = currentAuction.auctionBaseValue;
                    }
                }
                else {
                    continue;
                }
                let priceCeiling = lowestRawCost + currentAuction.auctionBaseValue; //using the lowest from last time
                if (currentAuction.auctionData.bin) { //bins are used as reference
                    lowestRawCost = Math.min(lowestRawCost, currentAuction.auctionCost - currentAuction.auctionBaseValue);
                }
                //iterate over the remaining array
                for (let j = i + 1; j < auctionSort.length; j++) {
                    if (!auctionSort[j].auctionData.bin) {
                        continue; //skip non-bin auctions
                    }
                    if (auctionSort[j].auctionCost > priceCeiling) {
                        //auctions can't be higher than the price ceiling
                        break; //clearly everything after this is more expensive 
                    }
                    if (currentAuction.auctionBaseValue > auctionSort[j].auctionBaseValue) {
                        let baseValueDifference = currentAuction.auctionBaseValue - auctionSort[j].auctionBaseValue;
                        priceCeiling = Math.min(priceCeiling, auctionSort[j].auctionCost + baseValueDifference);
                        optimalFlipPriceIndex = j;
                    }
                    else {
                        break; //unlikely that this auction is better than the one which is valued higher
                    }
                }
                if (optimalFlipPriceIndex == auctionSort.length - 1) { //we are worth more than all the other auctions
                    this.bestAuctions.push(currentAuction);
                    continue;
                }
                let min_profit_ = 0.98 * auctionSort[optimalFlipPriceIndex].auctionCost - currentAuction.auctionCost;
                let max_profit_ = 0.98 * auctionSort[optimalFlipPriceIndex + 1].auctionCost - currentAuction.auctionCost;
                //we can't make more than the raw price to make the item
                max_profit_ = Math.min(priceCeiling - currentAuction.auctionCost, max_profit_);
                // if(max_profit_ < AuctionFinderConfig.profitCriteria){continue;} //we don't fit the criteria
                this.flips.push({
                    auction: currentAuction,
                    min_profit: min_profit_,
                    max_profit: max_profit_,
                    category: category_
                });
            }
            //all flips have been calculated
        }
        static rawCostLeastBin(auctionSort) {
            for (let i = 0; i < auctionSort.length; i++) {
                if (auctionSort[i].auctionData.bin) {
                    return auctionSort[i].auctionCost - auctionSort[i].auctionBaseValue;
                }
            }
            return 0;
        }
    }
    AuctionFinder.flips = [];
    AuctionFinder.queriedFlips = [];
    AuctionFinder.bestAuctions = [];
    AuctionFinder.blacklistedUUIDs = [];

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

    // (105:51) {:else}
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
    		source: "(105:51) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:30) {#if active}
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
    		source: "(105:30) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div11;
    	let div0;
    	let t1;
    	let div10;
    	let div1;
    	let t2;
    	let input0;
    	let t3;
    	let div2;
    	let t4;
    	let input1;
    	let t5;
    	let div3;
    	let t6;
    	let input2;
    	let t7;
    	let div4;
    	let t8;
    	let select;
    	let option0;
    	let option1;
    	let t11;
    	let div5;
    	let span;
    	let t13;
    	let div6;
    	let t14;
    	let input3;
    	let t15;
    	let div7;
    	let t16;
    	let input4;
    	let t17;
    	let div8;
    	let t18;
    	let input5;
    	let t19;
    	let div9;
    	let t20;
    	let input6;
    	let t21;
    	let div12;
    	let button0;
    	let p0;
    	let t23;
    	let button1;
    	let p1;
    	let button1_class_value;
    	let t24;
    	let div13;
    	let div13_class_value;
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
    			div11 = element("div");
    			div0 = element("div");
    			div0.textContent = "Configuration:";
    			t1 = space();
    			div10 = element("div");
    			div1 = element("div");
    			t2 = text("Budget: ");
    			input0 = element("input");
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Min Profit: ");
    			input1 = element("input");
    			t5 = space();
    			div3 = element("div");
    			t6 = text("Max Flips Displayed: ");
    			input2 = element("input");
    			t7 = space();
    			div4 = element("div");
    			t8 = text("Sort Criteria: ");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Efficiency";
    			option1 = element("option");
    			option1.textContent = "Profit";
    			t11 = space();
    			div5 = element("div");
    			span = element("span");
    			span.textContent = "Show:";
    			t13 = space();
    			div6 = element("div");
    			t14 = text("Pets ");
    			input3 = element("input");
    			t15 = space();
    			div7 = element("div");
    			t16 = text("Commodities ");
    			input4 = element("input");
    			t17 = space();
    			div8 = element("div");
    			t18 = text("Talismans ");
    			input5 = element("input");
    			t19 = space();
    			div9 = element("div");
    			t20 = text("Upgradables ");
    			input6 = element("input");
    			t21 = space();
    			div12 = element("div");
    			button0 = element("button");
    			p0 = element("p");
    			p0.textContent = "Query";
    			t23 = space();
    			button1 = element("button");
    			p1 = element("p");
    			if_block.c();
    			t24 = space();
    			div13 = element("div");
    			attr_dev(div0, "class", "config-title svelte-u30qr");
    			add_location(div0, file$2, 65, 4, 2021);
    			attr_dev(input0, "class", "input budgetInput svelte-u30qr");
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$2, 68, 20, 2150);
    			attr_dev(div1, "class", "field svelte-u30qr");
    			add_location(div1, file$2, 67, 8, 2109);
    			attr_dev(input1, "class", "input profitCriteriaInput svelte-u30qr");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$2, 71, 24, 2296);
    			attr_dev(div2, "class", "field svelte-u30qr");
    			add_location(div2, file$2, 70, 8, 2251);
    			attr_dev(input2, "class", "input maxDisplayInput svelte-u30qr");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file$2, 74, 33, 2461);
    			attr_dev(div3, "class", "field svelte-u30qr");
    			add_location(div3, file$2, 73, 8, 2407);
    			option0.__value = "Efficiency";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 78, 16, 2701);
    			option1.__value = "Profit";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 79, 16, 2765);
    			attr_dev(select, "class", "input filterCriteriaInput svelte-u30qr");
    			if (/*sortCriteria*/ ctx[5] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[12].call(select));
    			add_location(select, file$2, 77, 27, 2612);
    			attr_dev(div4, "class", "field svelte-u30qr");
    			add_location(div4, file$2, 76, 8, 2564);
    			attr_dev(span, "class", "showTitle svelte-u30qr");
    			add_location(span, file$2, 83, 12, 2885);
    			attr_dev(div5, "class", "field svelte-u30qr");
    			add_location(div5, file$2, 82, 8, 2852);
    			attr_dev(input3, "type", "checkbox");
    			attr_dev(input3, "class", "check svelte-u30qr");
    			attr_dev(input3, "name", "showPets");
    			add_location(input3, file$2, 86, 17, 2985);
    			attr_dev(div6, "class", "field svelte-u30qr");
    			add_location(div6, file$2, 85, 8, 2947);
    			attr_dev(input4, "type", "checkbox");
    			attr_dev(input4, "class", "check svelte-u30qr");
    			attr_dev(input4, "name", "showCommodities");
    			add_location(input4, file$2, 89, 24, 3145);
    			attr_dev(div7, "class", "field svelte-u30qr");
    			add_location(div7, file$2, 88, 8, 3098);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "class", "check svelte-u30qr");
    			attr_dev(input5, "name", "showTalismans");
    			add_location(input5, file$2, 92, 22, 3315);
    			attr_dev(div8, "class", "field svelte-u30qr");
    			add_location(div8, file$2, 91, 8, 3272);
    			attr_dev(input6, "type", "checkbox");
    			attr_dev(input6, "class", "check svelte-u30qr");
    			attr_dev(input6, "name", "showUpgradables");
    			add_location(input6, file$2, 95, 24, 3491);
    			attr_dev(div9, "class", "field svelte-u30qr");
    			add_location(div9, file$2, 94, 8, 3442);
    			attr_dev(div10, "class", "config-menu svelte-u30qr");
    			add_location(div10, file$2, 66, 4, 2074);
    			attr_dev(div11, "class", "config svelte-u30qr");
    			add_location(div11, file$2, 64, 0, 1995);
    			attr_dev(p0, "class", "buttonText svelte-u30qr");
    			add_location(p0, file$2, 101, 8, 3737);
    			attr_dev(button0, "class", "button queryButton svelte-u30qr");
    			add_location(button0, file$2, 100, 4, 3666);
    			attr_dev(p1, "class", "buttonText svelte-u30qr");
    			add_location(p1, file$2, 104, 8, 3889);
    			attr_dev(button1, "class", button1_class_value = "button refreshButton " + getActiveClass(/*active*/ ctx[0]) + " svelte-u30qr");
    			add_location(button1, file$2, 103, 4, 3789);
    			attr_dev(div12, "class", "button-container svelte-u30qr");
    			add_location(div12, file$2, 99, 0, 3630);
    			attr_dev(div13, "class", div13_class_value = "progressBar " + getActiveClass(/*active*/ ctx[0]) + " svelte-u30qr");
    			set_style(div13, "width", /*loadingPercent*/ ctx[1] + "%");
    			add_location(div13, file$2, 107, 0, 3987);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div0);
    			append_dev(div11, t1);
    			append_dev(div11, div10);
    			append_dev(div10, div1);
    			append_dev(div1, t2);
    			append_dev(div1, input0);
    			set_input_value(input0, /*budgetInput*/ ctx[2]);
    			append_dev(div10, t3);
    			append_dev(div10, div2);
    			append_dev(div2, t4);
    			append_dev(div2, input1);
    			set_input_value(input1, /*profitCriteria*/ ctx[4]);
    			append_dev(div10, t5);
    			append_dev(div10, div3);
    			append_dev(div3, t6);
    			append_dev(div3, input2);
    			set_input_value(input2, /*maxDisplay*/ ctx[3]);
    			append_dev(div10, t7);
    			append_dev(div10, div4);
    			append_dev(div4, t8);
    			append_dev(div4, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			select_option(select, /*sortCriteria*/ ctx[5]);
    			append_dev(div10, t11);
    			append_dev(div10, div5);
    			append_dev(div5, span);
    			append_dev(div10, t13);
    			append_dev(div10, div6);
    			append_dev(div6, t14);
    			append_dev(div6, input3);
    			input3.checked = /*shownItems*/ ctx[6].pets;
    			append_dev(div10, t15);
    			append_dev(div10, div7);
    			append_dev(div7, t16);
    			append_dev(div7, input4);
    			input4.checked = /*shownItems*/ ctx[6].commodities;
    			append_dev(div10, t17);
    			append_dev(div10, div8);
    			append_dev(div8, t18);
    			append_dev(div8, input5);
    			input5.checked = /*shownItems*/ ctx[6].talismans;
    			append_dev(div10, t19);
    			append_dev(div10, div9);
    			append_dev(div9, t20);
    			append_dev(div9, input6);
    			input6.checked = /*shownItems*/ ctx[6].upgradables;
    			insert_dev(target, t21, anchor);
    			insert_dev(target, div12, anchor);
    			append_dev(div12, button0);
    			append_dev(button0, p0);
    			append_dev(div12, t23);
    			append_dev(div12, button1);
    			append_dev(button1, p1);
    			if_block.m(p1, null);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, div13, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[9]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[10]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[11]),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[12]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[13]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[14]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[15]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[16]),
    					listen_dev(button0, "click", /*queryAuction*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*refreshAuction*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*budgetInput*/ 4 && input0.value !== /*budgetInput*/ ctx[2]) {
    				set_input_value(input0, /*budgetInput*/ ctx[2]);
    			}

    			if (dirty & /*profitCriteria*/ 16 && input1.value !== /*profitCriteria*/ ctx[4]) {
    				set_input_value(input1, /*profitCriteria*/ ctx[4]);
    			}

    			if (dirty & /*maxDisplay*/ 8 && input2.value !== /*maxDisplay*/ ctx[3]) {
    				set_input_value(input2, /*maxDisplay*/ ctx[3]);
    			}

    			if (dirty & /*sortCriteria*/ 32) {
    				select_option(select, /*sortCriteria*/ ctx[5]);
    			}

    			if (dirty & /*shownItems*/ 64) {
    				input3.checked = /*shownItems*/ ctx[6].pets;
    			}

    			if (dirty & /*shownItems*/ 64) {
    				input4.checked = /*shownItems*/ ctx[6].commodities;
    			}

    			if (dirty & /*shownItems*/ 64) {
    				input5.checked = /*shownItems*/ ctx[6].talismans;
    			}

    			if (dirty & /*shownItems*/ 64) {
    				input6.checked = /*shownItems*/ ctx[6].upgradables;
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(p1, null);
    				}
    			}

    			if (dirty & /*active*/ 1 && button1_class_value !== (button1_class_value = "button refreshButton " + getActiveClass(/*active*/ ctx[0]) + " svelte-u30qr")) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (dirty & /*active*/ 1 && div13_class_value !== (div13_class_value = "progressBar " + getActiveClass(/*active*/ ctx[0]) + " svelte-u30qr")) {
    				attr_dev(div13, "class", div13_class_value);
    			}

    			if (dirty & /*loadingPercent*/ 2) {
    				set_style(div13, "width", /*loadingPercent*/ ctx[1] + "%");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(div12);
    			if_block.d();
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(div13);
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
    	let budgetInput = "5,000,000";
    	let maxDisplay = "20";
    	let profitCriteria = "100,000";
    	let sortCriteria = "Efficiency";

    	let shownItems = {
    		pets: true,
    		commodities: true,
    		talismans: true,
    		upgradables: true
    	};

    	function updateConfig() {
    		AuctionFinderConfig.updateConfig({
    			budget: cleanIntInput(budgetInput),
    			maxAuctionDisplayCount: cleanIntInput(maxDisplay),
    			profitCriteria: cleanIntInput(profitCriteria),
    			sortCriteria,
    			shownItems
    		});
    	}

    	function refreshAuction() {
    		if (!active) {
    			return;
    		}

    		$$invalidate(0, active = false);
    		updateConfig();
    		console.log("Refreshing...");
    		AuctionFinder.findAuctions(renderAuctions);
    	}

    	function queryAuction() {
    		updateConfig();
    		console.log("Querying...");

    		AuctionFinder.queryAuctions(() => {
    			console.log("Queried!");
    			AuctionDisplayManager.updateAuctionRender();
    		});
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
    		profitCriteria = this.value;
    		$$invalidate(4, profitCriteria);
    	}

    	function input2_input_handler() {
    		maxDisplay = this.value;
    		$$invalidate(3, maxDisplay);
    	}

    	function select_change_handler() {
    		sortCriteria = select_value(this);
    		$$invalidate(5, sortCriteria);
    	}

    	function input3_change_handler() {
    		shownItems.pets = this.checked;
    		$$invalidate(6, shownItems);
    	}

    	function input4_change_handler() {
    		shownItems.commodities = this.checked;
    		$$invalidate(6, shownItems);
    	}

    	function input5_change_handler() {
    		shownItems.talismans = this.checked;
    		$$invalidate(6, shownItems);
    	}

    	function input6_change_handler() {
    		shownItems.upgradables = this.checked;
    		$$invalidate(6, shownItems);
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
    		profitCriteria,
    		sortCriteria,
    		shownItems,
    		cleanIntInput,
    		updateConfig,
    		refreshAuction,
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
    		if ('profitCriteria' in $$props) $$invalidate(4, profitCriteria = $$props.profitCriteria);
    		if ('sortCriteria' in $$props) $$invalidate(5, sortCriteria = $$props.sortCriteria);
    		if ('shownItems' in $$props) $$invalidate(6, shownItems = $$props.shownItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		loadingPercent,
    		budgetInput,
    		maxDisplay,
    		profitCriteria,
    		sortCriteria,
    		shownItems,
    		refreshAuction,
    		queryAuction,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		select_change_handler,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler
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
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (19:0) {#if flips.length == 0}
    function create_if_block_1(ctx) {
    	let div;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "No flips currently found; refresh to update.";
    			add_location(p, file$1, 20, 4, 988);
    			attr_dev(div, "class", "refreshMessage svelte-1080m36");
    			add_location(div, file$1, 19, 0, 954);
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
    		source: "(19:0) {#if flips.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (39:20) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "AUCTION";
    			attr_dev(div, "class", "auctionType auction svelte-1080m36");
    			add_location(div, file$1, 39, 20, 1936);
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
    		source: "(39:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:20) {#if flip.auction.auctionData.bin}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "BIN";
    			attr_dev(div, "class", "auctionType bin svelte-1080m36");
    			add_location(div, file$1, 35, 20, 1799);
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
    		source: "(35:20) {#if flip.auction.auctionData.bin}",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#each flips as flip, i}
    function create_each_block(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let button0;
    	let svg;
    	let path;
    	let t0;
    	let div3;
    	let div1;
    	let t1_value = /*flip*/ ctx[6].auction.auctionData.item_name + "";
    	let t1;
    	let t2;
    	let t3;
    	let div2;
    	let t4;
    	let t5_value = Math.round(/*flip*/ ctx[6].auction.auctionCost).toLocaleString("en-US") + "";
    	let t5;
    	let t6;
    	let br0;
    	let t7;
    	let t8_value = Math.round(/*flip*/ ctx[6].min_profit).toLocaleString("en-US") + "";
    	let t8;
    	let t9;
    	let br1;
    	let t10;
    	let t11_value = Math.round(/*flip*/ ctx[6].max_profit).toLocaleString("en-US") + "";
    	let t11;
    	let t12;
    	let t13;
    	let button1;
    	let t15;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*i*/ ctx[8]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*flip*/ ctx[6].auction.auctionData.bin) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*i*/ ctx[8]);
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			div2 = element("div");
    			t4 = text("Price: ");
    			t5 = text(t5_value);
    			t6 = text(" coins ");
    			br0 = element("br");
    			t7 = text("\r\n                    Minimum Expected Profit: ");
    			t8 = text(t8_value);
    			t9 = text(" coins ");
    			br1 = element("br");
    			t10 = text("\r\n                    Maximum Expected Profit: ");
    			t11 = text(t11_value);
    			t12 = text(" coins");
    			t13 = space();
    			button1 = element("button");
    			button1.textContent = "Copy Auction";
    			t15 = space();
    			attr_dev(path, "d", "M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z");
    			add_location(path, file$1, 28, 120, 1386);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			set_style(svg, "fill", "white");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$1, 28, 16, 1282);
    			attr_dev(button0, "class", "deleteButton svelte-1080m36");
    			add_location(button0, file$1, 27, 16, 1194);
    			attr_dev(div0, "class", "delete svelte-1080m36");
    			add_location(div0, file$1, 26, 12, 1156);
    			attr_dev(div1, "class", "name svelte-1080m36");
    			add_location(div1, file$1, 32, 16, 1645);
    			add_location(br0, file$1, 45, 96, 2217);
    			add_location(br1, file$1, 46, 105, 2328);
    			attr_dev(div2, "class", "profit svelte-1080m36");
    			add_location(div2, file$1, 44, 16, 2099);
    			attr_dev(div3, "class", "itemData svelte-1080m36");
    			add_location(div3, file$1, 31, 12, 1605);
    			attr_dev(button1, "class", "copy svelte-1080m36");
    			add_location(button1, file$1, 50, 12, 2496);
    			attr_dev(div4, "class", "auctionBox svelte-1080m36");
    			add_location(div4, file$1, 25, 8, 1118);
    			attr_dev(div5, "class", "auctions svelte-1080m36");
    			add_location(div5, file$1, 24, 4, 1086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, button0);
    			append_dev(button0, svg);
    			append_dev(svg, path);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			if_block.m(div1, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div2, br0);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			append_dev(div2, t9);
    			append_dev(div2, br1);
    			append_dev(div2, t10);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			append_dev(div4, t13);
    			append_dev(div4, button1);
    			append_dev(div5, t15);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler, false, false, false),
    					listen_dev(button1, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*flips*/ 1 && t1_value !== (t1_value = /*flip*/ ctx[6].auction.auctionData.item_name + "")) set_data_dev(t1, t1_value);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			}

    			if (dirty & /*flips*/ 1 && t5_value !== (t5_value = Math.round(/*flip*/ ctx[6].auction.auctionCost).toLocaleString("en-US") + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*flips*/ 1 && t8_value !== (t8_value = Math.round(/*flip*/ ctx[6].min_profit).toLocaleString("en-US") + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*flips*/ 1 && t11_value !== (t11_value = Math.round(/*flip*/ ctx[6].max_profit).toLocaleString("en-US") + "")) set_data_dev(t11, t11_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(24:0) {#each flips as flip, i}",
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

    			if (dirty & /*copyAuction, Math, flips, blacklistAuction*/ 7) {
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
    		$$invalidate(0, flips = AuctionFinder.queriedFlips.slice(0, AuctionFinderConfig.maxAuctionDisplayCount));
    	}

    	function copyAuction(i) {
    		navigator.clipboard.writeText("/viewauction " + flips[i].auction.auctionData.uuid);
    	}

    	function blacklistAuction(i) {
    		AuctionFinder.blacklistUUID(flips[i].auction.auctionData.uuid);
    		flips.splice(i, 1);
    		$$invalidate(0, flips); //force update
    	}

    	AuctionDisplayManager.registerAuctionRenderCallback(callback);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AuctionMenu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => {
    		blacklistAuction(i);
    	};

    	const click_handler_1 = i => copyAuction(i);

    	$$self.$capture_state = () => ({
    		AuctionFinder,
    		AuctionFinderConfig,
    		AuctionDisplayManager,
    		flips,
    		callback,
    		copyAuction,
    		blacklistAuction
    	});

    	$$self.$inject_state = $$props => {
    		if ('flips' in $$props) $$invalidate(0, flips = $$props.flips);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [flips, copyAuction, blacklistAuction, click_handler, click_handler_1];
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
