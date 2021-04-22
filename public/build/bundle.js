
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity$2 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch$1(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity$2, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch$1(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch$1(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch$1(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
            this.$destroy = noop$1;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
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

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending(f(d), x);
    }

    function number$1(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$1).center;

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    var noop = {value: () => {}};

    function dispatch() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant = x => () => x;

    function linear$1(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear$1(a, d) : constant(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    dispatch("start", "end", "cancel", "interrupt");

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$1(x) {
      return x;
    }

    var map = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale$1(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$1 : formatGroup(map.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$1 : formatNumerals(map.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale$1;
    var format;
    var formatPrefix;

    defaultLocale$1({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      format = locale$1.format;
      formatPrefix = locale$1.formatPrefix;
      return locale$1;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity(x) {
      return x;
    }

    function normalize(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity, rescale()) : clamp !== identity;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity, identity);
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    var t0 = new Date,
        t1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
      }

      interval.floor = function(date) {
        return floori(date = new Date(+date)), date;
      };

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0.setTime(+start), t1.setTime(+end);
          floori(t0), floori(t1);
          return Math.floor(count(t0, t1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    var durationMinute = 6e4;
    var durationDay = 864e5;
    var durationWeek = 6048e5;

    var day = newInterval(
      date => date.setHours(0, 0, 0, 0),
      (date, step) => date.setDate(date.getDate() + step),
      (start, end) => (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay,
      date => date.getDate() - 1
    );

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    weekday(2);
    weekday(3);
    var thursday = weekday(4);
    weekday(5);
    weekday(6);

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    utcWeekday(2);
    utcWeekday(3);
    var utcThursday = utcWeekday(4);
    utcWeekday(5);
    utcWeekday(6);

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newDate(y, m, d) {
      return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "g": formatYearISO,
        "G": formatFullYearISO,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "q": formatQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "g": formatUTCYearISO,
        "G": formatUTCFullYearISO,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "q": formatUTCQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "g": parseYear,
        "G": parseFullYear,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "q": parseQuarter,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, Z) {
        return function(string) {
          var d = newDate(1900, undefined, 1),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day$1;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);
          if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

          // If this is utcParse, never use the local timezone.
          if (Z && !("Z" in d)) d.Z = 0;

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // If the month was not specified, inherit from the quarter.
          if (d.m === undefined) d.m = "q" in d ? d.q : 0;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
              week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
              week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
              week = day.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return localDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", false);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier += "", true);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      return new Map(names.map((name, i) => [name.toLowerCase(), i]));
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseQuarter(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.s = +n[0], i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + day.count(year(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(year(d) - 1, d), p, 2);
    }

    function dISO(d) {
      var day = d.getDay();
      return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    }

    function formatWeekNumberISO(d, p) {
      d = dISO(d);
      return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(year(d) - 1, d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatYearISO(d, p) {
      d = dISO(d);
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatFullYearISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
    }

    function UTCdISO(d) {
      var day = d.getUTCDay();
      return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    }

    function formatUTCWeekNumberISO(d, p) {
      d = UTCdISO(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCYearISO(d, p) {
      d = UTCdISO(d);
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCFullYearISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale;
    var timeParse;

    defaultLocale({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      locale.format;
      timeParse = locale.parse;
      locale.utcFormat;
      locale.utcParse;
      return locale;
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity$2, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    let req;
    let prev;
    const elapsed = writable(0);

    const tick = (timestamp) => {
    	if (!prev) prev = timestamp;
    	const diff = Math.round(timestamp - prev);
    	prev = timestamp;
    	elapsed.update(e => e + diff);
    	req = window.requestAnimationFrame(tick);
    };

    const timer = {
    	start() {
    		if (typeof window === "undefined")  return;
    		else if (!req) {
    			prev = null;
    			req = window.requestAnimationFrame(tick);
    		}
    	},
    	stop() {
    		if (typeof window === "undefined")  return;
    		else if (req) {
    			window.cancelAnimationFrame(req);
    			req = null;
    		}
    	},
    	toggle() {
    		req ? timer.stop() : timer.start();	
    	},
    	set(val) {
    		if (typeof val === "number") elapsed.set(val);
    	},
    	reset() {
    		timer.set(0);
    	}
    };

    /* src/Timer.svelte generated by Svelte v3.37.0 */
    const file$6 = "src/Timer.svelte";

    function create_fragment$9(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "play";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "pause";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "reset";
    			attr_dev(button0, "class", "svelte-13ailmo");
    			add_location(button0, file$6, 23, 2, 556);
    			attr_dev(button1, "class", "svelte-13ailmo");
    			add_location(button1, file$6, 24, 2, 618);
    			attr_dev(button2, "class", "svelte-13ailmo");
    			add_location(button2, file$6, 25, 2, 682);
    			attr_dev(div, "class", "svelte-13ailmo");
    			add_location(div, file$6, 22, 0, 548);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);
    			append_dev(div, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*onReset*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $elapsed;
    	validate_store(elapsed, "elapsed");
    	component_subscribe($$self, elapsed, $$value => $$invalidate(5, $elapsed = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Timer", slots, []);
    	let { currentKeyframe = 0 } = $$props;
    	let { keyframeCount = 0 } = $$props;
    	let { duration = 1000 } = $$props;
    	let { isEnabled = false } = $$props;
    	const dispatch = createEventDispatcher();

    	const onReset = () => {
    		$$invalidate(2, currentKeyframe = 0);
    		timer.reset();
    	};

    	const writable_props = ["currentKeyframe", "keyframeCount", "duration", "isEnabled"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Timer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, isEnabled = true);
    	const click_handler_1 = () => $$invalidate(0, isEnabled = false);

    	$$self.$$set = $$props => {
    		if ("currentKeyframe" in $$props) $$invalidate(2, currentKeyframe = $$props.currentKeyframe);
    		if ("keyframeCount" in $$props) $$invalidate(3, keyframeCount = $$props.keyframeCount);
    		if ("duration" in $$props) $$invalidate(4, duration = $$props.duration);
    		if ("isEnabled" in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		timer,
    		elapsed,
    		currentKeyframe,
    		keyframeCount,
    		duration,
    		isEnabled,
    		dispatch,
    		onReset,
    		$elapsed
    	});

    	$$self.$inject_state = $$props => {
    		if ("currentKeyframe" in $$props) $$invalidate(2, currentKeyframe = $$props.currentKeyframe);
    		if ("keyframeCount" in $$props) $$invalidate(3, keyframeCount = $$props.keyframeCount);
    		if ("duration" in $$props) $$invalidate(4, duration = $$props.duration);
    		if ("isEnabled" in $$props) $$invalidate(0, isEnabled = $$props.isEnabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isEnabled, $elapsed, duration*/ 49) {
    			if (isEnabled) $$invalidate(2, currentKeyframe = Math.floor($elapsed / duration));
    		}

    		if ($$self.$$.dirty & /*currentKeyframe, keyframeCount*/ 12) {
    			if (currentKeyframe === keyframeCount) dispatch("end");
    		}

    		if ($$self.$$.dirty & /*isEnabled*/ 1) {
    			isEnabled ? timer.start() : timer.stop();
    		}
    	};

    	return [
    		isEnabled,
    		onReset,
    		currentKeyframe,
    		keyframeCount,
    		duration,
    		$elapsed,
    		click_handler,
    		click_handler_1
    	];
    }

    class Timer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			currentKeyframe: 2,
    			keyframeCount: 3,
    			duration: 4,
    			isEnabled: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Timer",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get currentKeyframe() {
    		throw new Error("<Timer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentKeyframe(value) {
    		throw new Error("<Timer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keyframeCount() {
    		throw new Error("<Timer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keyframeCount(value) {
    		throw new Error("<Timer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Timer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Timer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isEnabled() {
    		throw new Error("<Timer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isEnabled(value) {
    		throw new Error("<Timer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Chart.Bar.svelte generated by Svelte v3.37.0 */
    const file$5 = "src/Chart.Bar.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "style", div_style_value = "" + (/*barColor*/ ctx[0] + " " + /*transform*/ ctx[1] + " " + /*width*/ ctx[2] + " " + /*height*/ ctx[3]));
    			attr_dev(div, "class", "svelte-18ofpc0");
    			add_location(div, file$5, 19, 0, 490);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*barColor, transform, width, height*/ 15 && div_style_value !== (div_style_value = "" + (/*barColor*/ ctx[0] + " " + /*transform*/ ctx[1] + " " + /*width*/ ctx[2] + " " + /*height*/ ctx[3]))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const borderWidth = 4;

    function instance$8($$self, $$props, $$invalidate) {
    	let w;
    	let y;
    	let barColor;
    	let transform;
    	let width;
    	let height;
    	let $scales;
    	let $dimensions;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Bar", slots, []);
    	const { scales, dimensions } = getContext("Chart");
    	validate_store(scales, "scales");
    	component_subscribe($$self, scales, value => $$invalidate(10, $scales = value));
    	validate_store(dimensions, "dimensions");
    	component_subscribe($$self, dimensions, value => $$invalidate(12, $dimensions = value));
    	let { value } = $$props;
    	let { rank } = $$props;
    	let { fill } = $$props;
    	const writable_props = ["value", "rank", "fill"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Bar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(6, value = $$props.value);
    		if ("rank" in $$props) $$invalidate(7, rank = $$props.rank);
    		if ("fill" in $$props) $$invalidate(8, fill = $$props.fill);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		scales,
    		dimensions,
    		value,
    		rank,
    		fill,
    		borderWidth,
    		w,
    		$scales,
    		y,
    		$dimensions,
    		barColor,
    		transform,
    		width,
    		height
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(6, value = $$props.value);
    		if ("rank" in $$props) $$invalidate(7, rank = $$props.rank);
    		if ("fill" in $$props) $$invalidate(8, fill = $$props.fill);
    		if ("w" in $$props) $$invalidate(9, w = $$props.w);
    		if ("y" in $$props) $$invalidate(11, y = $$props.y);
    		if ("barColor" in $$props) $$invalidate(0, barColor = $$props.barColor);
    		if ("transform" in $$props) $$invalidate(1, transform = $$props.transform);
    		if ("width" in $$props) $$invalidate(2, width = $$props.width);
    		if ("height" in $$props) $$invalidate(3, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$scales, value*/ 1088) {
    			$$invalidate(9, w = $scales.x(value) || 0);
    		}

    		if ($$self.$$.dirty & /*$scales, rank, $dimensions*/ 5248) {
    			$$invalidate(11, y = ($scales.y(rank) || 0) + $dimensions.barMargin / 2);
    		}

    		if ($$self.$$.dirty & /*fill*/ 256) {
    			$$invalidate(0, barColor = `--bar-color: ${fill}88;`);
    		}

    		if ($$self.$$.dirty & /*y*/ 2048) {
    			$$invalidate(1, transform = `transform: translateY(${y}px);`);
    		}

    		if ($$self.$$.dirty & /*w*/ 512) {
    			$$invalidate(2, width = `width: ${w - borderWidth}px;`);
    		}

    		if ($$self.$$.dirty & /*$dimensions*/ 4096) {
    			$$invalidate(3, height = `height: ${$dimensions.barHeight || 0}px;`);
    		}
    	};

    	return [
    		barColor,
    		transform,
    		width,
    		height,
    		scales,
    		dimensions,
    		value,
    		rank,
    		fill,
    		w,
    		$scales,
    		y,
    		$dimensions
    	];
    }

    class Chart_Bar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { value: 6, rank: 7, fill: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Bar",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[6] === undefined && !("value" in props)) {
    			console.warn("<Chart_Bar> was created without expected prop 'value'");
    		}

    		if (/*rank*/ ctx[7] === undefined && !("rank" in props)) {
    			console.warn("<Chart_Bar> was created without expected prop 'rank'");
    		}

    		if (/*fill*/ ctx[8] === undefined && !("fill" in props)) {
    			console.warn("<Chart_Bar> was created without expected prop 'fill'");
    		}
    	}

    	get value() {
    		throw new Error("<Chart_Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Chart_Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rank() {
    		throw new Error("<Chart_Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rank(value) {
    		throw new Error("<Chart_Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Chart_Bar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Chart_Bar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var colors = [
    	"#FFDE6B",
    	"#EF89EE",
    	"#F79F1E",
    	"#02B8FF",
    	"#9F84EC",
    	"#15CBC4",
    	"#0092FD",
    	"#F63A57",
    	"#A2CB39",
    	"#FF6E2F",
    	"#FEB8B9",
    	"#af7aa1",
    	"#7EFFF5"
    ];

    /* src/Chart.Bars.svelte generated by Svelte v3.37.0 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i].value;
    	child_ctx[5] = list[i].rank;
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (13:2) {#if rank < barCount}
    function create_if_block$3(ctx) {
    	let bar;
    	let current;

    	bar = new Chart_Bar({
    			props: {
    				value: /*value*/ ctx[4],
    				rank: /*rank*/ ctx[5],
    				fill: colors[/*i*/ ctx[7] % /*colorCount*/ ctx[3]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bar_changes = {};
    			if (dirty & /*$data*/ 2) bar_changes.value = /*value*/ ctx[4];
    			if (dirty & /*$data*/ 2) bar_changes.rank = /*rank*/ ctx[5];
    			if (dirty & /*$data*/ 2) bar_changes.fill = colors[/*i*/ ctx[7] % /*colorCount*/ ctx[3]];
    			bar.$set(bar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(13:2) {#if rank < barCount}",
    		ctx
    	});

    	return block;
    }

    // (12:0) {#each $data as { value, rank }
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*rank*/ ctx[5] < /*barCount*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*rank*/ ctx[5] < /*barCount*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$data, barCount*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(12:0) {#each $data as { value, rank }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*$data*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$data, colors, colorCount, barCount*/ 11) {
    				each_value = /*$data*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Bars", slots, []);
    	const { data } = getContext("Chart");
    	validate_store(data, "data");
    	component_subscribe($$self, data, value => $$invalidate(1, $data = value));
    	const colorCount = colors.length;
    	let { barCount } = $$props;
    	const writable_props = ["barCount"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Bars> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("barCount" in $$props) $$invalidate(0, barCount = $$props.barCount);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Bar: Chart_Bar,
    		colors,
    		data,
    		colorCount,
    		barCount,
    		$data
    	});

    	$$self.$inject_state = $$props => {
    		if ("barCount" in $$props) $$invalidate(0, barCount = $$props.barCount);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [barCount, $data, data, colorCount];
    }

    class Chart_Bars extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { barCount: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Bars",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*barCount*/ ctx[0] === undefined && !("barCount" in props)) {
    			console.warn("<Chart_Bars> was created without expected prop 'barCount'");
    		}
    	}

    	get barCount() {
    		throw new Error("<Chart_Bars>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set barCount(value) {
    		throw new Error("<Chart_Bars>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity$2 } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/Chart.Tick.svelte generated by Svelte v3.37.0 */
    const file$4 = "src/Chart.Tick.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let p;
    	let t1;
    	let div1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			p = element("p");
    			t1 = text(/*formattedValue*/ ctx[1]);
    			attr_dev(div0, "class", "line svelte-rmzpe0");
    			add_location(div0, file$4, 17, 2, 362);
    			attr_dev(p, "class", "value svelte-rmzpe0");
    			add_location(p, file$4, 18, 2, 389);
    			attr_dev(div1, "class", "tick svelte-rmzpe0");
    			set_style(div1, "transform", "translate(" + /*x*/ ctx[0] + "px, 0)");
    			add_location(div1, file$4, 12, 0, 261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, p);
    			append_dev(p, t1);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*formattedValue*/ 2) set_data_dev(t1, /*formattedValue*/ ctx[1]);

    			if (!current || dirty & /*x*/ 1) {
    				set_style(div1, "transform", "translate(" + /*x*/ ctx[0] + "px, 0)");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: duration$1 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: duration$1 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const duration$1 = 250;

    function instance$6($$self, $$props, $$invalidate) {
    	let formattedValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Tick", slots, []);
    	let { value } = $$props;
    	let { x } = $$props;
    	const formatNumber = d => format(",.0f")(d * 100) + "%";
    	const writable_props = ["value", "x"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Tick> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    	};

    	$$self.$capture_state = () => ({
    		format,
    		fade,
    		value,
    		x,
    		duration: duration$1,
    		formatNumber,
    		formattedValue
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("formattedValue" in $$props) $$invalidate(1, formattedValue = $$props.formattedValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			$$invalidate(1, formattedValue = formatNumber(value));
    		}
    	};

    	return [x, formattedValue, value];
    }

    class Chart_Tick extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { value: 2, x: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Tick",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[2] === undefined && !("value" in props)) {
    			console.warn("<Chart_Tick> was created without expected prop 'value'");
    		}

    		if (/*x*/ ctx[0] === undefined && !("x" in props)) {
    			console.warn("<Chart_Tick> was created without expected prop 'x'");
    		}
    	}

    	get value() {
    		throw new Error("<Chart_Tick>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Chart_Tick>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Chart_Tick>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Chart_Tick>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Chart.Axis.svelte generated by Svelte v3.37.0 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (9:0) {#each ticks as value (value)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let tick_1;
    	let current;

    	tick_1 = new Chart_Tick({
    			props: {
    				x: /*$scales*/ ctx[0].x(/*value*/ ctx[3]),
    				value: /*value*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(tick_1.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(tick_1, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tick_1_changes = {};
    			if (dirty & /*$scales, ticks*/ 3) tick_1_changes.x = /*$scales*/ ctx[0].x(/*value*/ ctx[3]);
    			if (dirty & /*ticks*/ 2) tick_1_changes.value = /*value*/ ctx[3];
    			tick_1.$set(tick_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tick_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tick_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(tick_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(9:0) {#each ticks as value (value)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*ticks*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*value*/ ctx[3];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$scales, ticks*/ 3) {
    				each_value = /*ticks*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let ticks;
    	let $scales;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Axis", slots, []);
    	const { scales } = getContext("Chart");
    	validate_store(scales, "scales");
    	component_subscribe($$self, scales, value => $$invalidate(0, $scales = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Axis> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getContext, Tick: Chart_Tick, scales, ticks, $scales });

    	$$self.$inject_state = $$props => {
    		if ("ticks" in $$props) $$invalidate(1, ticks = $$props.ticks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$scales*/ 1) {
    			$$invalidate(1, ticks = $scales.x.ticks(5).slice(1)); // don't need to show 0
    		}
    	};

    	return [$scales, ticks, scales];
    }

    class Chart_Axis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Axis",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Chart.Label.svelte generated by Svelte v3.37.0 */
    const file$3 = "src/Chart.Label.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*names*/ ctx[5][/*i*/ ctx[1]] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*formatNumber*/ ctx[8](/*value*/ ctx[0]) + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			attr_dev(p0, "class", "name svelte-14uk05u");
    			add_location(p0, file$3, 21, 4, 503);
    			attr_dev(p1, "class", "value svelte-14uk05u");
    			add_location(p1, file$3, 22, 4, 538);
    			attr_dev(div0, "class", "inner svelte-14uk05u");
    			add_location(div0, file$3, 20, 2, 479);
    			attr_dev(div1, "class", "label svelte-14uk05u");
    			set_style(div1, "height", /*height*/ ctx[4] + "px");
    			set_style(div1, "transform", "translate(" + /*x*/ ctx[2] + "px, " + /*y*/ ctx[3] + "px)");
    			add_location(div1, file$3, 16, 0, 388);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*i*/ 2 && t0_value !== (t0_value = /*names*/ ctx[5][/*i*/ ctx[1]] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*value*/ 1 && t2_value !== (t2_value = /*formatNumber*/ ctx[8](/*value*/ ctx[0]) + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*height*/ 16) {
    				set_style(div1, "height", /*height*/ ctx[4] + "px");
    			}

    			if (dirty & /*x, y*/ 12) {
    				set_style(div1, "transform", "translate(" + /*x*/ ctx[2] + "px, " + /*y*/ ctx[3] + "px)");
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let x;
    	let y;
    	let height;
    	let $scales;
    	let $dimensions;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Label", slots, []);
    	let { value } = $$props;
    	let { rank } = $$props;
    	let { i } = $$props;
    	const { names, scales, dimensions } = getContext("Chart");
    	validate_store(scales, "scales");
    	component_subscribe($$self, scales, value => $$invalidate(10, $scales = value));
    	validate_store(dimensions, "dimensions");
    	component_subscribe($$self, dimensions, value => $$invalidate(11, $dimensions = value));
    	const formatNumber = d => format(",.1f")(d * 100) + "%";
    	const writable_props = ["value", "rank", "i"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Label> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("rank" in $$props) $$invalidate(9, rank = $$props.rank);
    		if ("i" in $$props) $$invalidate(1, i = $$props.i);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		format,
    		value,
    		rank,
    		i,
    		names,
    		scales,
    		dimensions,
    		formatNumber,
    		x,
    		$scales,
    		y,
    		$dimensions,
    		height
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("rank" in $$props) $$invalidate(9, rank = $$props.rank);
    		if ("i" in $$props) $$invalidate(1, i = $$props.i);
    		if ("x" in $$props) $$invalidate(2, x = $$props.x);
    		if ("y" in $$props) $$invalidate(3, y = $$props.y);
    		if ("height" in $$props) $$invalidate(4, height = $$props.height);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$scales, value*/ 1025) {
    			$$invalidate(2, x = $scales.x(value));
    		}

    		if ($$self.$$.dirty & /*$scales, rank, $dimensions*/ 3584) {
    			$$invalidate(3, y = $scales.y(rank) + $dimensions.barMargin / 2);
    		}

    		if ($$self.$$.dirty & /*$dimensions*/ 2048) {
    			$$invalidate(4, height = $dimensions.barHeight);
    		}
    	};

    	return [
    		value,
    		i,
    		x,
    		y,
    		height,
    		names,
    		scales,
    		dimensions,
    		formatNumber,
    		rank,
    		$scales,
    		$dimensions
    	];
    }

    class Chart_Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { value: 0, rank: 9, i: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Label",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[0] === undefined && !("value" in props)) {
    			console.warn("<Chart_Label> was created without expected prop 'value'");
    		}

    		if (/*rank*/ ctx[9] === undefined && !("rank" in props)) {
    			console.warn("<Chart_Label> was created without expected prop 'rank'");
    		}

    		if (/*i*/ ctx[1] === undefined && !("i" in props)) {
    			console.warn("<Chart_Label> was created without expected prop 'i'");
    		}
    	}

    	get value() {
    		throw new Error("<Chart_Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Chart_Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rank() {
    		throw new Error("<Chart_Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rank(value) {
    		throw new Error("<Chart_Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get i() {
    		throw new Error("<Chart_Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set i(value) {
    		throw new Error("<Chart_Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Chart.Labels.svelte generated by Svelte v3.37.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].value;
    	child_ctx[4] = list[i].rank;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (10:2) {#if rank < maxRank}
    function create_if_block$2(ctx) {
    	let label;
    	let current;

    	label = new Chart_Label({
    			props: {
    				value: /*value*/ ctx[3],
    				rank: /*rank*/ ctx[4],
    				i: /*i*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = {};
    			if (dirty & /*$data*/ 2) label_changes.value = /*value*/ ctx[3];
    			if (dirty & /*$data*/ 2) label_changes.rank = /*rank*/ ctx[4];
    			if (dirty & /*$data*/ 2) label_changes.i = /*i*/ ctx[6];
    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(10:2) {#if rank < maxRank}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#each $data as { value, rank }
    function create_each_block(key_1, ctx) {
    	let first;
    	let if_block_anchor;
    	let current;
    	let if_block = /*rank*/ ctx[4] < /*maxRank*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*rank*/ ctx[4] < /*maxRank*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$data, maxRank*/ 3) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(9:0) {#each $data as { value, rank }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*$data*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*i*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$data, maxRank*/ 3) {
    				each_value = /*$data*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let $data;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Labels", slots, []);
    	const { data } = getContext("Chart");
    	validate_store(data, "data");
    	component_subscribe($$self, data, value => $$invalidate(1, $data = value));
    	let { maxRank = 10 } = $$props;
    	const writable_props = ["maxRank"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Labels> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("maxRank" in $$props) $$invalidate(0, maxRank = $$props.maxRank);
    	};

    	$$self.$capture_state = () => ({ getContext, Label: Chart_Label, data, maxRank, $data });

    	$$self.$inject_state = $$props => {
    		if ("maxRank" in $$props) $$invalidate(0, maxRank = $$props.maxRank);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [maxRank, $data, data];
    }

    class Chart_Labels extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { maxRank: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Labels",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get maxRank() {
    		throw new Error("<Chart_Labels>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxRank(value) {
    		throw new Error("<Chart_Labels>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Chart.Ticker.svelte generated by Svelte v3.37.0 */
    const file$2 = "src/Chart.Ticker.svelte";

    // (8:0) {#if date}
    function create_if_block$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*year*/ ctx[1]);
    			attr_dev(p, "class", "svelte-1kyb6o1");
    			add_location(p, file$2, 8, 2, 142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*year*/ 2) set_data_dev(t, /*year*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(8:0) {#if date}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*date*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*date*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let year;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart_Ticker", slots, []);
    	let { date } = $$props;
    	const writable_props = ["date"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart_Ticker> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    	};

    	$$self.$capture_state = () => ({ timeParse, date, year });

    	$$self.$inject_state = $$props => {
    		if ("date" in $$props) $$invalidate(0, date = $$props.date);
    		if ("year" in $$props) $$invalidate(1, year = $$props.year);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*date*/ 1) {
    			$$invalidate(1, year = timeParse("%m-%d-%Y")(date).getFullYear());
    		}
    	};

    	return [date, year];
    }

    class Chart_Ticker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { date: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_Ticker",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*date*/ ctx[0] === undefined && !("date" in props)) {
    			console.warn("<Chart_Ticker> was created without expected prop 'date'");
    		}
    	}

    	get date() {
    		throw new Error("<Chart_Ticker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set date(value) {
    		throw new Error("<Chart_Ticker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var keyframes = [
    	[
    		"09-01-2008",
    		[
    			{
    				name: "c#",
    				value: 0.11864528654634,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.0816854821313,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.05414539440569,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.04594808369884999,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.03890127274034,
    				rank: 4
    			},
    			{
    				name: "php",
    				value: 0.03458689868411,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.023009994966559998,
    				rank: 6
    			},
    			{
    				name: "ruby",
    				value: 0.02078090170417,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.01524412166534,
    				rank: 8
    			},
    			{
    				name: "perl",
    				value: 0.00941971668943,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00366721794779,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.00201337455957,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.00043143740562,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2008",
    		[
    			{
    				name: "c#",
    				value: 0.12488548618059334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07991017939480166,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.053776178952778336,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.046558408183239995,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.03870330993409166,
    				rank: 4
    			},
    			{
    				name: "php",
    				value: 0.036243352154815,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.022720920049386664,
    				rank: 6
    			},
    			{
    				name: "ruby",
    				value: 0.020032394886096667,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.015928498070575,
    				rank: 8
    			},
    			{
    				name: "perl",
    				value: 0.008985117842105001,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.005441903658896666,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0018752649911050001,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.0003924399810383333,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000008227202421666666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2008",
    		[
    			{
    				name: "c#",
    				value: 0.13112568581484668,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07813487665830333,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.05340696349986667,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.04716873266763,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.038505347127843335,
    				rank: 4
    			},
    			{
    				name: "php",
    				value: 0.03789980562552,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.022431845132213333,
    				rank: 6
    			},
    			{
    				name: "ruby",
    				value: 0.019283888068023333,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.01661287447581,
    				rank: 8
    			},
    			{
    				name: "perl",
    				value: 0.008550518994780001,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.0072165893700033325,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0017371554226400002,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.0003534425564566667,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00001645440484333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2008",
    		[
    			{
    				name: "c#",
    				value: 0.1373658854491,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07635957392180501,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.053037748046955005,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.047779057152019994,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.039556259096225,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.038307384321595,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.02214277021504,
    				rank: 6
    			},
    			{
    				name: "ruby",
    				value: 0.018535381249950002,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.017297250881045,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.008991275081109999,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.008115920147455,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0015990458541750002,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.000314445131875,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000024681607265,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.14360608508335335,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07458427118530667,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.05266853259404333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.048389381636409996,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.041212712566929995,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.038109421515346666,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.021853695297866665,
    				rank: 6
    			},
    			{
    				name: "vb.net",
    				value: 0.01798162728628,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.017786874431876668,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.010765960792216665,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00768132130013,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0014609362857100003,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.00027544770729333334,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003290880968666666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.1498462847176067,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07280896844880833,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.05229931714113167,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.0489997061208,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04286916603763499,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03791145870909834,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.021564620380693334,
    				rank: 6
    			},
    			{
    				name: "vb.net",
    				value: 0.018666003691515002,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.017038367613803333,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.012540646503323332,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007246722452805001,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.001322826717245,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.00023645028271166666,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004113601210833334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.15608648435186,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07103366571231,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.05193010168822,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.04961003060519,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04452561950833999,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03771349590285,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.02127554546352,
    				rank: 6
    			},
    			{
    				name: "vb.net",
    				value: 0.01935038009675,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01628986079573,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.014315332214429998,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00681212360548,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.00118471714878,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.00019745285813,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004936321453,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.15224844198815668,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07072358178659667,
    				rank: 1
    			},
    			{
    				name: "c++",
    				value: 0.050733437177901665,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05028254499079833,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04865392129541332,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.037368103786788336,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.020653865959525,
    				rank: 6
    			},
    			{
    				name: "vb.net",
    				value: 0.018565583699250002,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.016004961942336665,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.015459934112666666,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00695039542904,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0013031234785850002,
    				rank: 11
    			},
    			{
    				name: "r",
    				value: 0.0008675854667499999,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00005641952120166667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.14841039962445335,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07041349786088333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.05278222308248666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05095505937640667,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.049536772667583336,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03702271167072667,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.02003218645553,
    				rank: 6
    			},
    			{
    				name: "vb.net",
    				value: 0.01778078730175,
    				rank: 7
    			},
    			{
    				name: "objective-c",
    				value: 0.016604536010903333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01572006308894333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007088667252600001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00153771807537,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00142152980839,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00006347582787333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.14457235726075002,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07010341393517,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.05691052486956,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.051627573762014996,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.048340108157265,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036677319554665,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.019410506951534998,
    				rank: 6
    			},
    			{
    				name: "objective-c",
    				value: 0.017749137909139998,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.01699599090425,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.015435164235549999,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00722693907616,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00220785068399,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0015399361381950001,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000070532134545,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.14073431489704666,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.06979333000945667,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.06103882665663333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.052300088147623325,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04714344364694666,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036331927438603334,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.018893739807376665,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01878882744754,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.01621119450675,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.015150265382156665,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00736521089972,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00287798329261,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001658342468,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00007758844121666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.13689627253334333,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.06948324608374333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.06516712844370666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05297260253323166,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.045946779136628334,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03598653532254167,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.020038341705613333,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.018167147943545,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.015426398109250002,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.014865366528763333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007503482723280001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00354811590123,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017767487978050003,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00008464474788833333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.13305823016964,
    				rank: 0
    			},
    			{
    				name: "php",
    				value: 0.06929543023078,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.06917316215803,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05364511691883999,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04475011462631,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03564114320648,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02118294360385,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01754546843955,
    				rank: 7
    			},
    			{
    				name: "vb.net",
    				value: 0.014641601711750002,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01458046767537,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007641754546840001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00421824850985,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018951551276100002,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00009170105456,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.13026842697176666,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07192964895767166,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.06979895159402666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05429635913337333,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04512991084357666,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036356954316791666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021282415290148335,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.018206213002478332,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014386189509748333,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.014360037995918335,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007627372343440001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.003961724576395,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00197441572843,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00007641754546666666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.12747862377389332,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07468613575731334,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07030247295727333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05494760134790666,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.045509707060843334,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03707276542710333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021381886976446666,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.018866957565406666,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014191911344126666,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.014078474280086668,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.0076129901400400005,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0037052006429400004,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00205367632925,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00006113403637333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2009",
    		[
    			{
    				name: "c#",
    				value: 0.12468882057602,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.077442622556955,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07080599432052,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05559884356244,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04588950327811,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.037788576537415,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021481358662745,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019527702128335,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013997633178504998,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.013796910564255001,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00759860793664,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.003448676709485,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0021329369300700004,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004585052728,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.12189901737814667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08019910935659666,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07130951568376666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05625008577697334,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04626929949537666,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.038504387647726665,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021580830349043335,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020188446691263334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013803355012883331,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.013515346848423334,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007584225733240001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0031921527760300004,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0022121975308900003,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003056701818666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.11910921418027334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08295559615623833,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07181303704701333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05690132799150667,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.046649095712643335,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03922019875803833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021680302035341666,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020849191254191667,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013609076847261665,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.013233783132591668,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007569843529840001,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0029356288425750002,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0022914581317100002,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000015283509093333336,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.1163194109824,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08571208295588,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07231655841026,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.05755257020604001,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04702889192991,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03993600986835,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02177977372164,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02150993581712,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013414798681639998,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.01295221941676,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00755546132644,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0026791049091200005,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00237071873253,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.11447958630944834,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08436485639892,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07313890005396666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.058917600179918345,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04670373071491833,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.039450412204246665,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.022670755736665,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021700619997968334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013746347271633331,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.012410096264366666,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007556602244095,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0028792194577600006,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.002296174994276667,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000005479932486666666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.11263976163649667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08301762984196,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07396124169767333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.060282630153796674,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.046378569499926664,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03896481454014333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02356173775169,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021891304178816667,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014077895861626666,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.011867973111973334,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00755774316175,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0030793340064000003,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0022216312560233336,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000010959864973333332,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.11079993696354501,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.081670403285,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07478358334138,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.061647660127675,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.046053408284934996,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03847921687604,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024452719766715002,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.022081988359665003,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014409444451619999,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.011325849959580001,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007558884079405,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00327944855504,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0021470875177700003,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00001643979746,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10896011229059334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08032317672804,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07560592498508666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06301269010155333,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.045728247069943335,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03799361921193666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02534370178174,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.022272672540513336,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014740993041613332,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.010783726807186667,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00756002499706,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00347956310368,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0020725437795166665,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000021919729946666664,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10712028761764167,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07897595017108,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07642826662879333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06437772007543167,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04540308585495167,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03750802154783333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.026234683796765,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02246335672136167,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015072541631606666,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.010241603654793333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007561165914715,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0036796776523200002,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019980000412633332,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000027399662433333332,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10528046294469,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07762872361412,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.0772506082725,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06574275004931,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04507792463996,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03702242388373,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02712566581179,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02265404090221,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.0154040902216,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.0096994805024,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00756230683237,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00387979220096,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00192345630301,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003287959492,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10431047682421334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07875919923758,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07784526297836333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06601761007174667,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04449887567702,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03707431732593833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02766251538938,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.022376854559203335,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015555575622598333,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.009565900657538333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.007303859881871666,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.003933189362996667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001921376948105,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003237617330166667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10334049070373667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.07988967486104,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07843991768422666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06629247009418333,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04391982671408,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.037126210768146664,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02819936496697,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.022099668216196668,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015707061023596668,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.009432320812676667,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.0070454129313733335,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.003986586525033333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019192975932,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003187275168333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2010",
    		[
    			{
    				name: "c#",
    				value: 0.10237050458326,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08102015048450001,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07903457239009,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06656733011662,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04334077775114,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.037178104210355,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02873621454456,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02182248187319,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015858546424595,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.009298740967815,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.006786965980875,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00403998368707,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001917218238295,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000031369330065,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.10140051846278333,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08215062610796,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07962922709595334,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06684219013905666,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.042761728788200004,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03722999765256333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02927306412215,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021545295530183334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.016010031825593334,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.009165161122953333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.0065285190303766664,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.004093380849106667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00191513888339,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000030865908446666664,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.10043053234230667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08328110173142,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08022388180181667,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06711705016149333,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04218267982526,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03728189109477166,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.029809913699740002,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021268109187176667,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.016161517226591666,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.009031581278091666,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.006270072079878333,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.004146778011143334,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001913059528485,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000030362486828333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09946054622183001,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08441157735488,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08081853650768,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.06739191018393,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04160363086232,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03733378453698,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.03034676327733,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02099092284417,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01631300262759,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.00889800143323,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00601162512938,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00420017517318,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00191098017358,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00002985906521,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09812159385526834,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08399661768016001,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08059982862565668,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.069579536770075,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04112910787935334,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036875373957364996,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.030691181342538336,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020629679053401666,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.0161308027595,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008806058496098333,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00582795660884,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.0045017072349033335,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018461468683,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000034701782353333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09678264148870667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08358165800544,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08038112074363334,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.07176716335622,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04065458489638667,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036416963377749995,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.031035599407746667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020268435262633333,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01594860289141,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008714115558966666,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.0056442880883,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.004803239296626667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00178131356302,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003954449949666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09544368912214501,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08316669833072,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08016241286161,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.07395478994236501,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.04018006191342,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03595855279813499,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.031380017472955,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019907191471865,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01576640302332,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008622172621835001,
    				rank: 9
    			},
    			{
    				name: "perl",
    				value: 0.00546061956776,
    				rank: 10
    			},
    			{
    				name: "r",
    				value: 0.00510477135835,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00171648025774,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004438721664,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09410473675558334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08275173865600001,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07994370497958667,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.07614241652851,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03970553893045334,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03550014221852,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.03172443553816333,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019545947681096666,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01558420315523,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008530229684703334,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.005406303420073333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00527695104722,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0016516469524599999,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004922993378333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09276578438902167,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08233677898128,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07972499709756334,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.07833004311465501,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03923101594748667,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.035041731638905,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.032068853603371666,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019184703890328333,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01540200328714,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008438286747571667,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.0057078354817966664,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.005093282526679999,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00158681364718,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00005407265092666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09142683202246,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08192181930656,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08051766970080002,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07950628921554,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03875649296452,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03458332105929,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.03241327166858,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01882346009956,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01521980341905,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.00834634381044,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.00600936754352,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00490961400614,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0015219803418999999,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00005891536807,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.09068693771758,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08377124565924333,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08048093728846835,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07990407965673166,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03884617258402167,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03512129942833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.03180582144663333,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019106230384736664,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015423925240245,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008266354167281668,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.006117843570533333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004850515611228333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00159421091243,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000054090683518333335,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.0899470434127,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08562067201192668,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08044420487613668,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08030187009792333,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03893585220352334,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03565927779737,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.031198371224686668,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019389000669913333,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01562804706144,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008186364524123333,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.006226319597546667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004791417216316666,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00166644148296,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004926599896666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2011",
    		[
    			{
    				name: "c#",
    				value: 0.08920714910782,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08747009836461,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.080699660539115,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.080407472463805,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.039025531823025,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036197256166409994,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.030590921002740003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01967177095509,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015832168882635,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008106374880965,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.00633479562456,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004732318821405,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017386720534899999,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000044441314415,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08931952471729333,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08846725480294,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08109745098030666,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08037074005147334,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.039115211442526665,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.036735234535449995,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.029983470780793334,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019954541240266663,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01603629070383,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008026385237806667,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.006443271651573333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004673220426493333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00181090262402,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003961662986333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.09116895106997668,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08772736049806,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08149524142149833,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08033400763914167,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03920489106202833,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03727321290449,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02937602055884667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020237311525443332,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.016240412525025002,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.007946395594648333,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.006551747678586667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004614122031581666,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018831331945500002,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003479194531166667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.09301837742266,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08698746619318,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08189303186269,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08029727522681,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03929457068153,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03781119127353,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.028768570336900005,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020520081810619997,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01644453434622,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.00786640595149,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.0066602237056,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00455502363667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00195536376508,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00002996726076,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.09222930678812334,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08676337986298333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08217903830016166,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08104149820193,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.038960945181199996,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03815990384444833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.028264177545335004,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02030393153131333,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.016182883310898333,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.007973234393123333,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.0068909267123483334,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00463571298644,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019140609037400001,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000033826662616666666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.09144023615358667,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08653929353278667,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08246504473763333,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08178572117705,
    				rank: 3
    			},
    			{
    				name: "c++",
    				value: 0.03862731968087,
    				rank: 4
    			},
    			{
    				name: "python",
    				value: 0.03850861641536667,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.027759784753770004,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020087781252006665,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015921232275576666,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008080062834756666,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.007121629719096667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00471640233621,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018727580424000002,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000037686064473333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.09065116551905,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08631520720258999,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.082751051175105,
    				rank: 2
    			},
    			{
    				name: "javascript",
    				value: 0.08252994415216999,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.038857328986284995,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03829369418054,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.027255391962205004,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019871630972699998,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015659581240255002,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.00818689127639,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.007352332725845,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00479709168598,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00183145518106,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004154546633,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08986209488451334,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08609112087239332,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08327416712729,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08303705761257667,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.03920604155720333,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03796006868021,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.026750999170640003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019655480693393332,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015397930204933333,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008293719718023333,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.007583035732593333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.0048777810357500005,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00179015231972,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004540486818666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08907302424997667,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08586703454219666,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08401839010241,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08332306405004833,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.039554754128121664,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.037626443179879995,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.026246606379075003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019439330414086665,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.015136279169611667,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.008400548159656665,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.007813738739341667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00495847038552,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00174884945838,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004926427004333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08828395361544,
    				rank: 0
    			},
    			{
    				name: "c#",
    				value: 0.08564294821199998,
    				rank: 1
    			},
    			{
    				name: "javascript",
    				value: 0.08476261307753,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08360907048752,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.03990346669904,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03729281767955,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025742213587510002,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01922318013478,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01487462813429,
    				rank: 8
    			},
    			{
    				name: "vb.net",
    				value: 0.00850737660129,
    				rank: 9
    			},
    			{
    				name: "r",
    				value: 0.00804444174609,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00503915973529,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00170754659704,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.0000531236719,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08891530131264834,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08537801541920667,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.08508603737771832,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08332661854742333,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.040606325752,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03799936273079333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02570828661745667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019334911727491667,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014862718989266667,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.008485243904896666,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008444415758858332,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.0050207352981633336,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017744490079033334,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004908470617666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.08954664900985666,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08599341776088333,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.08452912654343665,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08304416660732666,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04130918480496,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03870590778203666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025674359647403337,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019446643320203332,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014850809844243333,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.008926046063703333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008381454916426665,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.005002310861036667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018413514187666667,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004504574045333333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2012",
    		[
    			{
    				name: "java",
    				value: 0.090177996707065,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08660882010255999,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.083972215709155,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08276171466723001,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04201204385792,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03941245283328,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025640432677350004,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019558374912914997,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01483890069922,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.00936684822251,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008318494073995,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004983886423910001,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00190825382963,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004100677473,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2013",
    		[
    			{
    				name: "java",
    				value: 0.09080934440427334,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08722422244423667,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.08341530487487334,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08247926272713334,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04271490291088,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04011899788452333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02560650570729667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019670106505626665,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014826991554196667,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.009807650381316667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008255533231563333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004965461986783334,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001975156240493333,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003696780900666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2013",
    		[
    			{
    				name: "java",
    				value: 0.09144069210148166,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08783962478591334,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.08285839404059167,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08219681078703667,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04341776196384001,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.040825542935766665,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025572578737243338,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019781838098338334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014815082409173333,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.010248452540123333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008192572389131667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004947037549656667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0020420586513566668,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000032928843283333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2013",
    		[
    			{
    				name: "java",
    				value: 0.09207203979869,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.08845502712759,
    				rank: 1
    			},
    			{
    				name: "c#",
    				value: 0.08230148320631,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.08191435884694,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.044120621016800005,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04153208798701,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025538651767190005,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01989356969105,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01480317326415,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01068925469893,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0081296115467,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00492861311253,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00210896106222,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00002888987756,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2013",
    		[
    			{
    				name: "java",
    				value: 0.09315193437062166,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.091599030384685,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08270361239567667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08246465234535166,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.044800161454445,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.041227064750106665,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.025267500460485003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02000270810043,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014747279843398332,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.010635677919249999,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008362754231539999,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004799571525666667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0020513324182916664,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000034138763255,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.09474303364178,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09423182894255333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08349286594441332,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08262782148439334,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04547970189209,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04092204151320333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024996349153780004,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02011184650981,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014691386422646667,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01058210113957,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00859589691638,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004670529938803333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019937037743633333,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003938764895,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.097887036898875,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.095311723514485,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08428211949315,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08279099062343499,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.046159242329735006,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.0406170182763,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024725197847075005,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02022098491919,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014635493001895001,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01052852435989,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00882903960122,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.0045414883519399995,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001936075130435,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000044636534644999995,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.10103104015597,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09639161808641668,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08507137304188667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08295415976247665,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04683878276738,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04031199503939666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024454046540370002,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02033012332857,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014579599581143333,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01047494758021,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009062182286059999,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.0044124467650766665,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018784464865066667,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00004988542034,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.104175043413065,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09747151265834834,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08586062659062332,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08311732890151832,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.047518323205025,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04000697180249333,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024182895233665,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02043926173795,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014523706160391666,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01042137080053,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0092953249709,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.0042834051782133335,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018208178425783335,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000055134306035,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.10731904667016,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09855140723028001,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08664988013936,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08328049804055998,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.04819786364267,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03970194856559,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02391174392696,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02054840014733,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01446781273964,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01036779402085,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00952846765574,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00415436359135,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017631891986500002,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00006038319173,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.10766795008134167,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09981427276797668,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08702896899708167,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08241630792132332,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.049347996444230005,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04005715501744166,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.023957455798763336,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020793540281928334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014426319587131666,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.010899693593401667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009518924845353332,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004191450307756667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018328608929116669,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00005352936229666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.10801685349252334,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10107713830567334,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08740805785480332,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08155211780208665,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05049812924579,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.040412361469293334,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024003167670566667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021038680416526668,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014384826434623334,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.011431593165953333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009509382034966667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004228537024163333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019025325871733334,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000046675532863333335,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2013",
    		[
    			{
    				name: "javascript",
    				value: 0.10836575690370501,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10234000384337,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.087787146712525,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.08068792768284999,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05164826204735,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.040767567921145,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024048879542370002,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021283820551125,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014343333282115001,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.011963492738505,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00949983922458,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00426562374057,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0019722042814350003,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003982170343,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10871466031488666,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10360286938106666,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08816623557024666,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07982373756361333,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05279839484891,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04112277437299666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024094591414173337,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021528960685723332,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014301840129606667,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.012495392311056668,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009490296414193333,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004302710456976667,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0020418759756966665,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00003296787399666667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10906356372606833,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10486573491876333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08854532442796832,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07895954744437667,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05394852765047001,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04147798082484833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024140303285976668,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021774100820321666,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014260346977098333,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.013027291883608334,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009480753603806668,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.004339797173383333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0021115476699583332,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.000026114044563333337,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10941246713725,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10612860045646,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08892441328569,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07809535732514,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.055098660452030004,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.0418331872767,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.024186015157780003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.02201924095492,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.01421885382459,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01355919145616,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00947121079342,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00437688388979,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00218121936422,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.00001926021513,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10944243279729833,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10527341683358667,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08762264829528667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.077489433397625,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05474939099789167,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.04110314150324666,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.023930037995876667,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021602037002056665,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014140378769785002,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.013679058807465,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.009205596936133334,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00433048393542,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00210497850714,
    				rank: 12
    			},
    			{
    				name: "swift",
    				value: 0.0019306851831416667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10947239845734667,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10441823321071332,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08632088330488333,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07688350947011,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05440012154375334,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.040373095729793335,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.023674060833973335,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.021184833049193334,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.014061903714980001,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.01379892615877,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008939983078846667,
    				rank: 10
    			},
    			{
    				name: "perl",
    				value: 0.00428408398105,
    				rank: 11
    			},
    			{
    				name: "swift",
    				value: 0.003842110151153333,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00202873765006,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.109502364117395,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10356304958783999,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08501911831448,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.076277585542595,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.054050852089615006,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03964304995634,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.023418083672070003,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020767629096330002,
    				rank: 7
    			},
    			{
    				name: "ruby",
    				value: 0.013983428660175,
    				rank: 8
    			},
    			{
    				name: "r",
    				value: 0.013918793510075,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00867436922156,
    				rank: 10
    			},
    			{
    				name: "swift",
    				value: 0.005753535119165,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0042376840266800005,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00195249679298,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10953232977744333,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10270786596496666,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08371735332407668,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07567166161508,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05370158263547667,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.038913004182886665,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.023162106510166668,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.020350425143466667,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01403866086138,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.013904953605370002,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.008408755364273332,
    				rank: 10
    			},
    			{
    				name: "swift",
    				value: 0.007664960087176666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00419128407231,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018762559359000001,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10956229543749167,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10185268234209331,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08241558833367334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.075065737687565,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05335231318133833,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03818295840943334,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.022906129348263332,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019933221190603333,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.014158528212685,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.013826478550565003,
    				rank: 9
    			},
    			{
    				name: "swift",
    				value: 0.009576385055188335,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.008143141506986666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0041448841179399995,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018000150788199999,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10959226109754,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10099749871921998,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08111382334327001,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07445981376005,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.0530030437272,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03745291263598,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02265015218636,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01951601723774,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01427839556399,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.013748003495760002,
    				rank: 9
    			},
    			{
    				name: "swift",
    				value: 0.0114878100232,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0078775276497,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00409848416357,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00172377422174,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10946742589281999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10162793573006665,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08083392575154334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07375753903152499,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05441860913535167,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03773254943395833,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.021774091049875,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019717095481183333,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.015041555840405,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.013628250924276669,
    				rank: 9
    			},
    			{
    				name: "swift",
    				value: 0.012748650416003333,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007774562890284999,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.003980754330611667,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0017790353482066666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.1093425906881,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10225837274091332,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08055402815981667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.073055264303,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.05583417454350333,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03801218623193667,
    				rank: 5
    			},
    			{
    				name: "objective-c",
    				value: 0.02089802991339,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01991817372462667,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01580471611682,
    				rank: 8
    			},
    			{
    				name: "swift",
    				value: 0.014009490808806667,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.013508498352793335,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00767159813087,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0038630244976533335,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018342964746733334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2014",
    		[
    			{
    				name: "javascript",
    				value: 0.10921775548338,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10288880975175999,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.08027413056809,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.072352989574475,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.057249739951655,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.038291823029915004,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.02011925196807,
    				rank: 6
    			},
    			{
    				name: "objective-c",
    				value: 0.020021968776905,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.016567876393235002,
    				rank: 8
    			},
    			{
    				name: "swift",
    				value: 0.015270331201610001,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.013388745781310002,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0075686333714549995,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.003745294664695,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00188955760114,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.10909292027866,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10351924676260667,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07999423297636334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07165071484595,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.058665305359806665,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03857145982789333,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.020320330211513332,
    				rank: 6
    			},
    			{
    				name: "objective-c",
    				value: 0.01914590764042,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01733103666965,
    				rank: 8
    			},
    			{
    				name: "swift",
    				value: 0.016531171594413335,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.013268993209826668,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007465668612039999,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0036275648317366667,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0019448187276066666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.10896808507393999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10414968377345334,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07971433538463667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07094844011742499,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06008087076795833,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03885109662587166,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.020521408454956667,
    				rank: 6
    			},
    			{
    				name: "objective-c",
    				value: 0.018269846503934997,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.018094196946065,
    				rank: 8
    			},
    			{
    				name: "swift",
    				value: 0.017792011987216666,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.013149240638343334,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007362703852625,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0035098349987783333,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0020000798540733334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.10884324986921999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.1047801207843,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07943443779291,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0702461653889,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.061496436176109996,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03913073342385,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.0207224866984,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01905285238002,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01885735722248,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.01739378536745,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.01302948806686,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00725973909321,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0033921051658200004,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00205534098054,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.11090124650041833,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10331379112977333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07898733288046833,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0707248409585,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06159776854338166,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03818647616544333,
    				rank: 5
    			},
    			{
    				name: "c",
    				value: 0.020177117456621665,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.020175900190100002,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.018854533670933336,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.017209182200421665,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.012896973931545,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007219538454708333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0032835430329983335,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0019548350847466665,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.11295924313161666,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10184746147524668,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07854022796802666,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0712035165281,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06169910091065333,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03724221890703667,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02129894800018,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.01963174821484333,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.018851710119386668,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.01702457903339333,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.012764459796230001,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0071793378162066665,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.003174980900176667,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018543291889533333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.115017239762815,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.10038113182072,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.078093123055585,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07168219209769999,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.061800433277925,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03629796164863,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.022421995810259998,
    				rank: 6
    			},
    			{
    				name: "c",
    				value: 0.019086378973064998,
    				rank: 7
    			},
    			{
    				name: "r",
    				value: 0.01884888656784,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.016839975866365,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.012631945660915,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007139137177705,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0030664187673550003,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00175382329316,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.11707523639401332,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09891480216619333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07764601814314334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0721608676673,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.061901765645196664,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03535370439022333,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02354504362034,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.018846063016293334,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.018541009731286667,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.016655372699336667,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.0124994315256,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007098936539203333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0029578566345333335,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0016533173973666665,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.11913323302521166,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09744847251166668,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07719891323070167,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0726395432369,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06200309801246833,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03440944713181667,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02466809143042,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01884323946474667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.017995640489508333,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.016470769532308333,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.012366917390285,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.007058735900701666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0028492945017116666,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.001552811501573333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.12119122965641,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09598214285714,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07675180831826,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.0731182188065,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06210443037974,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03346518987341,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.0257911392405,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.0188404159132,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01745027124773,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.01628616636528,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.01223440325497,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0070185352622,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00274073236889,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0014523056057799998,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.12106271275265999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09657569360540834,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07659695159254501,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07227830510900167,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06347437157296666,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03374134516078833,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.025723004644049998,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01906752636298,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.017418423904204998,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.015468702575893332,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.012078095985598333,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006929869456601666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0026756308897000003,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0015720040415399998,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.12093419584890999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09716924435367666,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07644209486683,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.07143839141150334,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06484431276619333,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03401750044816667,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.0256548700476,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01929463681276,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01738657656068,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.014651238786506666,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.011921788716226666,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0068412036510033325,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00261052941051,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0016917024772999999,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2015",
    		[
    			{
    				name: "javascript",
    				value: 0.12080567894515999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.097762795101945,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.076287238141115,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.070598477714005,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06621425395942,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.034293655735545006,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02558673545115,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01952174726254,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.017354729217155,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.01383377499712,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.011765481446854999,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006752537845404999,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00254542793132,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00181140091306,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12067716204140999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09835634585021333,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.0761323814154,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.06975856401650667,
    				rank: 3
    			},
    			{
    				name: "python",
    				value: 0.06758419515264666,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.034569811022923336,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.025518600854699997,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01974885771232,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01732288187363,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.013016311207733333,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.011609174177483333,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006663872039806666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0024803264521300003,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0019310993488200002,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12054864513765999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09894989659848165,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.075977524689685,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.06895413634587333,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06891865031900833,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.034845966310301665,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02545046625825,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.019975968162099997,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.017291034530105,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.012198847418346667,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.011452866908111667,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0065752062342083325,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00241522497294,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00205079778458,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12042012823390999,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09954344734674998,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07582266796397,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.0703240775391,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06807873662151,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03512212159768,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.025382331661799998,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.020203078611879997,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01725918718658,
    				rank: 8
    			},
    			{
    				name: "objective-c",
    				value: 0.01138138362896,
    				rank: 9
    			},
    			{
    				name: "ruby",
    				value: 0.01129655963874,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006486540428609999,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00235012349375,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00217049622034,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12039090696652832,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09734548178338331,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07512800577844833,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.07071127937835,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06762242369027,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.034310693314688334,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02592794381894833,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.020069170114986663,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.016846520291268333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.011301098219065,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.011128041448375,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006348120727958332,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0024155775357116668,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.002135695867771667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12036168569914665,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09514751622001666,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07443334359292667,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.0710984812176,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06716611075902999,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.033499265031696666,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.026473555976096665,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.019935261618093333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01643385339595667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01130563679939,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.01087469926779,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.006209701027306666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0024810315776733335,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0021008955152033333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12033246443176498,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09294955065664999,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.073738681407405,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.07148568305684999,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06670979782778999,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.032687836748705,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.027019168133244998,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.0198013531212,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.016021186500645,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.011310175379715,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.010621357087205,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0060712813266549995,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.002546485619635,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.002066095162635,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12030324316438333,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.09075158509328332,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07304401922188333,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.0718728848961,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06625348489655,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03187640846571333,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02756478029039333,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.019667444624306665,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015608519605333333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01131471396004,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.01036801490662,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005932861626003333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0026119396615966665,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.002031294810066667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12027402189700166,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08855361952991667,
    				rank: 1
    			},
    			{
    				name: "php",
    				value: 0.07234935703636167,
    				rank: 2
    			},
    			{
    				name: "python",
    				value: 0.07226008673535,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06579717196531,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.031064980182721667,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.028110392447541665,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.019533536127413334,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015195852710021666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.011319252540365,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.010114672726035,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005794441925351667,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0026773937035583333,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.001996494457498333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.12024480062962,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08635565396655,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.0726472885746,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07165469485084,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06534085903407,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03025355189973,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02865600460469,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.01939962763052,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01478318581471,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01132379112069,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00986133054545,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0056560222247,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00274284774552,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00196169410493,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.11998876390611499,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08642107716592,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.07483738732239,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07147523534733166,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06530090884110833,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030411316590693332,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.027733756306793332,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.020005937555988333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014798460565783333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.010929477820769999,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00942650162388,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005593637946896666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0026324858245616667,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00194567947445,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.11973272718261,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08648650036529,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.07702748607017999,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07129577584382334,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06526095864814667,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030569081281656665,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.026811508008896666,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.020612247481456666,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014813735316856667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01053516452085,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00899167270231,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0055312536690933336,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0025221239036033335,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00192966484397,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2016",
    		[
    			{
    				name: "javascript",
    				value: 0.119476690459105,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08655192356465999,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.07921758481797,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.071116316340315,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.065221008455185,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03072684597262,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.025889259711,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.021218557406925,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01482901006793,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.01014085122093,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00855684378074,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00546886939129,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.002411761982645,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0019136502134900002,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.1192206537356,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08661734676402999,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.08140768356576,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07093685683680666,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06518105826222333,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030884610663583334,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.024967011413103334,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.021824867332393333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014844284819003333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.009746537921009999,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00812201485917,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005406485113486666,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0023014000616866665,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018976355830100002,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11896461701209499,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08668276996339999,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.08359778231355,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07075739733329833,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06514110806926167,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.031042375354546667,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.024044763115206667,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.022431177257861666,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014859559570076668,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.009352224621089998,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.0076871859376,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005344100835683333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0021910381407283333,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018816209525300003,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11870858028859,
    				rank: 0
    			},
    			{
    				name: "java",
    				value: 0.08674819316277,
    				rank: 1
    			},
    			{
    				name: "python",
    				value: 0.08578788106134,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.07057793782979,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.0651011578763,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.03120014004551,
    				rank: 5
    			},
    			{
    				name: "swift",
    				value: 0.02312251481731,
    				rank: 6
    			},
    			{
    				name: "r",
    				value: 0.02303748718333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01487483432115,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00895791132117,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00725235701603,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00528171655788,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00208067621977,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0018656063220500003,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11862510096707499,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.08752510683970166,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.08552866121351832,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06993234558689666,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.064514532908985,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030643332076835,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.023575853977121666,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023187673425158335,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01457793395853,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.008732199566775,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.006967921878166666,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.005176508594433333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.002056155269975,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.001791961897156667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11854162164556,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.08926233261806334,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.08430912926426666,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06928675334400333,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06392790794167,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030086524108159998,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.024114220770913332,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023252832033006668,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01428103359591,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00850648781238,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.006683486740303333,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0050713006309866665,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0020316343201799997,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0017183174722633335,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.118458142324045,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.090999558396425,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.083089597315015,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06864116110110999,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.063341282974355,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.029529716139484997,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.024652587564705,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023317990640855,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013984133233290001,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.008280776057985,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.00639905160244,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00496609266754,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.002007113370385,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00164467304737,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11837466300253,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.09273678417478666,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.08187006536576333,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06799556885821666,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06275465800704,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.02897290817081,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.025190954358496668,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023383149248703335,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01368723287067,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.008055064303590001,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.006114616464576666,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.004860884704093333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.00198259242059,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0015710286224766667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11829118368101499,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.09447400995314834,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.08065053341651165,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06734997661532333,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.062168033039725,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.028416100202135,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.025729321152288334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023448307856551668,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01339033250805,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.007829352549195,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.005830181326713332,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.004755676740646667,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.001958071470795,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0014973841975833334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.1182077043595,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.09621123573151,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07943100146726,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06670438437243,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.06158140807241,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.02785929223346,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.02626768794608,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.0235134664644,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01309343214543,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.007603640794800001,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.005545746188849999,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.0046504687772,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.001933550521,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00142373977269,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11715863951515833,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.097606475174535,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07940262687977166,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06519788554938666,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.060865560193463335,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.028269380024414998,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.02685362132734,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023549525683413335,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013320721929533333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.007370549780556668,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.005205612726344999,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.004530502463783333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0018931651374416666,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.0014955381748549999,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.11610957467081666,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.09900171461756,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07937425229228333,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06369138672634334,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.060149712314516664,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.028679467815369997,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.0274395547086,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023585584902426668,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013548011713636666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.007137458766313334,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.004865479263839999,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.004410536150366667,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0018527797538833333,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00156733657702,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2017",
    		[
    			{
    				name: "javascript",
    				value: 0.115060509826475,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.10039695406058499,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.079345877704795,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.0621848879033,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.05943386443557,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.029089555606324997,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.028025488089860003,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.02362164412144,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013775301497739999,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.006904367752070001,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.004525345801334999,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.00429056983695,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.001812394370325,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.001639134979185,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11401144498213334,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.10179219350361,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07931750311730666,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.06067838908025667,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.058718016556623336,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.029499643397279996,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.028611421471120002,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023657703340453334,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014002591281843333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.006671276737826667,
    				rank: 9
    			},
    			{
    				name: "objective-c",
    				value: 0.0041852123388299994,
    				rank: 10
    			},
    			{
    				name: "vb.net",
    				value: 0.004170603523533333,
    				rank: 11
    			},
    			{
    				name: "perl",
    				value: 0.0017720089867666667,
    				rank: 12
    			},
    			{
    				name: "assembly",
    				value: 0.00171093338135,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11296238013779167,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.103187432946635,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07928912852981833,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.05917189025721333,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.058002168677676665,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.029909731188234995,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.02919735485238,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023693762559466668,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014229881065946666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.006438185723583334,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.004050637210116666,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0038450788763249996,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017827317835150001,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0017316236032083334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11191331529345,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.10458267238966,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07926075394233,
    				rank: 2
    			},
    			{
    				name: "php",
    				value: 0.05766539143417,
    				rank: 3
    			},
    			{
    				name: "c#",
    				value: 0.05728632079873,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.030319818979189995,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.02978328823364,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.02372982177848,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01445717085005,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00620509470934,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0039306708967,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00350494541382,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00185453018568,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.00169123821965,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11196364185724,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.105900133422825,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.078666705030845,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05754464316970167,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05708358881238,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.02965835741194166,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.029233347236533334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023443248832073334,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014208670363726666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.006080451486605,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003953642674448333,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0034046348003350002,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018513354495066667,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0016501255671416666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11201396842103,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.10721759445599,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07807265611936,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05780296554067333,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05650178619059,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.02899689584469333,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.028683406239426668,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.023156675885666667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013960169877403332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0059558082638700004,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003976614452196666,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0033043241868500003,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018481407133333334,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0016090129146333334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11206429498482,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.108535055489155,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.077478607207875,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.058061287911645,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.0559199835688,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.028335434277444997,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.02813346524232,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.02287010293926,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01371166939108,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005831165041135,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003999586229945,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.003204013573365,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018449459771600002,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0015679002621250002,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11211462154861,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.10985251652232,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07688455829639,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05831961028261667,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.055338180947010006,
    				rank: 4
    			},
    			{
    				name: "c++",
    				value: 0.027673972710196663,
    				rank: 5
    			},
    			{
    				name: "r",
    				value: 0.027583524245213334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.022583529992853336,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013463168904756666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0057065218184,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.004022558007693334,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00310370295988,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018417512409866668,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0015267876096166668,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2018",
    		[
    			{
    				name: "javascript",
    				value: 0.11216494811239999,
    				rank: 0
    			},
    			{
    				name: "python",
    				value: 0.111169977555485,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.076290509384905,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05857793265358833,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.054756378325220005,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.027033583248106667,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.027012511142948333,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.02229695704644667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013214668418433332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005581878595665,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0040455297854416665,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.003003392346395,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018385565048133334,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014856749571083333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2018",
    		[
    			{
    				name: "python",
    				value: 0.11248743858865,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11221527467619,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07569646047342,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05883625502456,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.054174575703430004,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.026483642251,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.0263510495757,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.02201038410004,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01296616793211,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00545723537293,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00406850156319,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00290308173291,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018353617686400002,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014445623046,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2018",
    		[
    			{
    				name: "python",
    				value: 0.11463322481584834,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11171522818916332,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07580267255346501,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05845563337065833,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.053385568335370004,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.026798542810278332,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.026638096369113334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.021432800476991667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013320458723916666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005432272463271667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.004037719699346667,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.002734560218255,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001825020698935,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014473205777750001,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2018",
    		[
    			{
    				name: "python",
    				value: 0.11677901104304667,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11121518170213666,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07590888463351,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.058075011716756664,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05259656096731,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.027113443369556667,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.026925143162526668,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.020855216853943336,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013674749515723332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005407309553613333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0040069378355033335,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0025660387036,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0018146796292300002,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014500788509500002,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2018",
    		[
    			{
    				name: "python",
    				value: 0.11892479727024499,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11071513521511,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.076015096713555,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.057694390062855,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05180755359925,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.027428343928835,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02721218995594,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.020277633230895,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01402904030753,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005382346643955,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00397615597166,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0023975171889450003,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001804338559525,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.001452837124125,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12107058349744333,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11021508872808333,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.0761213087936,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05731376840895333,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05101854623119,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.02774324448811333,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.027499236749353333,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.019700049607846666,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014383331099336667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005357383734296667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003945374107816667,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0022289956742900002,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00179399748982,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014555953973,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12321636972464167,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.10971504224105666,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07622752087364501,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.056933146755051664,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.05022953886313,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.028058145047391667,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.027786283542766667,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.019122465984798335,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014737621891143332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005332420824638333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0039145922439733334,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.002060474159635,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.001783656420115,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.001458353670475,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12536215595184,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.10921499575403,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07633373295369,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05655252510115,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04944053149507,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.02837304560667,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02807333033618,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01854488236175,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01509191268295,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00530745791498,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00388381038013,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00189195264498,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00177331535041,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014611119436500001,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12534420833057,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.10942254445275333,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07563615744332834,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.056840456251564996,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.048182297440106665,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.028515579313638333,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02810780619629167,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01860692715302,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015076587778023332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00531092449625,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0038073058799033333,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0018828488939533334,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017558120863499999,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014613457514583335,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.1253262607093,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.10963009315147666,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07493858193296667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05712838740198,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.046924063385143336,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.028658113020606668,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028142282056403334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01866897194429,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015061262873096667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00531439107752,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0037308013796766666,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0018737451429266668,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00173830882229,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014615795592666668,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12530831308803,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.10983764185020001,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.074241006422605,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.057416318552395,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04566582933018,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.028800646727575,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028176757916515003,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018731016735559998,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015045937968170001,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0053178576587900005,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0036542968794500003,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0018646413919,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017208055582300001,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.001461813367075,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12529036546676,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11004519054892334,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07354343091224334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05770424970281,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04440759527521666,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.028943180434543334,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02821123377662667,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01879306152683,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015030613063243334,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00532132424006,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0035777923792233335,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0018555376408733333,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00170330229417,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014620471748833332,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12527241784549,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11025273924764667,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07284585540188167,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.057992180853225,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.043149361220253334,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.02908571414151167,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028245709636738336,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.0188551063181,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015015288158316667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00532479082133,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0035012878789966667,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.0018464338898466668,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00168579903011,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014622809826916666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12525447022422,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11046028794637,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07214827989152,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05828011200364,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04189112716529,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.029228247848480004,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028280185496850005,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01891715110937,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014999963253390002,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0053282574026,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00342478337877,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00183733013882,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.00166829576605,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014625147905,
    				rank: 13
    			}
    		]
    	],
    	[
    		"10-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.12857077276517,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11074341997368001,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07206467177440334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05674725352515833,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.041000097497571664,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.029709236284768337,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028370782411808338,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01889830063700833,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015052908970463335,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005170757123091667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0034043678525433334,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00180134982505,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0016931543877016669,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0014207009360783333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"11-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.13188707530612,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11102655200099,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07198106365728667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05521439504667667,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.04010906782985333,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03019022472105667,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02846137932676667,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018879450164646667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015105854687536667,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.005013256843583333,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0033839523263166664,
    				rank: 10
    			},
    			{
    				name: "objective-c",
    				value: 0.00176536951128,
    				rank: 11
    			},
    			{
    				name: "assembly",
    				value: 0.0017180130093533334,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0013788870816566665,
    				rank: 13
    			}
    		]
    	],
    	[
    		"12-01-2019",
    		[
    			{
    				name: "python",
    				value: 0.13520337784707,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.1113096840283,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07189745554017,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.053681536568195,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.039218038162135,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.030671213157345,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028551976241725,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018860599692285,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01515880040461,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0048557565640749995,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0033635368000899998,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.001742871631005,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0017293891975100001,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.001337073227235,
    				rank: 13
    			}
    		]
    	],
    	[
    		"01-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.13851968038802,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11159281605561,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07181384742305334,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05214867808971333,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03832700849441667,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.031152201593633334,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028642573156683334,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01884174921992333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015211746121683333,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.004698256284566667,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003343121273863333,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0017677302526566668,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.00169340888374,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0012952593728133334,
    				rank: 13
    			}
    		]
    	],
    	[
    		"02-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14183598292897,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11187594808292001,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07173023930593667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.05061581961123167,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.037435978826698336,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03163319002992167,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028733170071641667,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018822898747561666,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015264691838756665,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.004540756005058334,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003322705747636666,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0017925888743083335,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0016574285699699999,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0012534455183916666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"03-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14515228546992,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11215908011023,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07164663118882,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.04908296113275,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03654494915898,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03211417846621,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.0288237669866,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.0188040482752,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015317637555829999,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00438325572555,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0033022902214099995,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.00181744749596,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0016214482562,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.00121163166397,
    				rank: 13
    			}
    		]
    	],
    	[
    		"04-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14582406891733668,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11280674524036166,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.07036046361331333,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.048129174350865,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03604838728395667,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03207690970198,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.028215255570815,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018659718908171665,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.015027746128696666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0042189701259150005,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0032082799982866665,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0018184572469866667,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0016412651096033332,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0011750163444883333,
    				rank: 13
    			}
    		]
    	],
    	[
    		"05-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14649585236475335,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11345441037049332,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.06907429603780667,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.04717538756898,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.035551825408933334,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.032039640937750004,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.027606744155030002,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01851538954114333,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014737854701563332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00405468452628,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.003114269775163333,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0018194669980133335,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0016610819630066666,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0011384010250066667,
    				rank: 13
    			}
    		]
    	],
    	[
    		"06-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14716763581217002,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11410207550062498,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.0677881284623,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.046221600787095,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03505526353391,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.032002372173520005,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.026998232739245002,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018371060174115002,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014447963274429999,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.003890398926645,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0030202595520399996,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.00182047674904,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.00168089881641,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.001101785705525,
    				rank: 13
    			}
    		]
    	],
    	[
    		"07-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14783941925958666,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11474974063075666,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.06650196088679333,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.045267814005209996,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03455870165888667,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03196510340929,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02638972132346,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01822673080708667,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.014158071847296666,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0037261133270100003,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0029262493289166666,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0018214865000666667,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0017007156698133333,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0010651703860433332,
    				rank: 13
    			}
    		]
    	],
    	[
    		"08-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14851120270700333,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11539740576088832,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.06521579331128666,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.044314027223324996,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.034062139783863334,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03192783464506,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.025781209907675,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.018082401440058335,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.013868180420163332,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.0035618277273749997,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.0028322391057933336,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.0018224962510933335,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.0017205325232166665,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.0010285550665616666,
    				rank: 13
    			}
    		]
    	],
    	[
    		"09-01-2020",
    		[
    			{
    				name: "python",
    				value: 0.14918298615442,
    				rank: 0
    			},
    			{
    				name: "javascript",
    				value: 0.11604507089101998,
    				rank: 1
    			},
    			{
    				name: "java",
    				value: 0.06392962573578,
    				rank: 2
    			},
    			{
    				name: "c#",
    				value: 0.04336024044144,
    				rank: 3
    			},
    			{
    				name: "php",
    				value: 0.03356557790884,
    				rank: 4
    			},
    			{
    				name: "r",
    				value: 0.03189056588083,
    				rank: 5
    			},
    			{
    				name: "c++",
    				value: 0.02517269849189,
    				rank: 6
    			},
    			{
    				name: "swift",
    				value: 0.01793807207303,
    				rank: 7
    			},
    			{
    				name: "c",
    				value: 0.01357828899303,
    				rank: 8
    			},
    			{
    				name: "ruby",
    				value: 0.00339754212774,
    				rank: 9
    			},
    			{
    				name: "vb.net",
    				value: 0.00273822888267,
    				rank: 10
    			},
    			{
    				name: "assembly",
    				value: 0.00182350600212,
    				rank: 11
    			},
    			{
    				name: "objective-c",
    				value: 0.00174034937662,
    				rank: 12
    			},
    			{
    				name: "perl",
    				value: 0.00099193974708,
    				rank: 13
    			}
    		]
    	]
    ];

    /* src/Chart.svelte generated by Svelte v3.37.0 */
    const file$1 = "src/Chart.svelte";

    // (63:0) {#if keyframes}
    function create_if_block(ctx) {
    	let timer;
    	let updating_currentKeyframe;
    	let t0;
    	let figure;
    	let div0;
    	let bars;
    	let t1;
    	let div1;
    	let axis;
    	let t2;
    	let div2;
    	let labels;
    	let t3;
    	let div3;
    	let ticker;
    	let figure_resize_listener;
    	let current;

    	function timer_currentKeyframe_binding(value) {
    		/*timer_currentKeyframe_binding*/ ctx[17](value);
    	}

    	let timer_props = {
    		keyframeCount: keyframes.length,
    		duration,
    		isEnabled: /*isEnabled*/ ctx[3]
    	};

    	if (/*currentKeyframe*/ ctx[2] !== void 0) {
    		timer_props.currentKeyframe = /*currentKeyframe*/ ctx[2];
    	}

    	timer = new Timer({ props: timer_props, $$inline: true });
    	binding_callbacks.push(() => bind(timer, "currentKeyframe", timer_currentKeyframe_binding));
    	timer.$on("end", /*end_handler*/ ctx[18]);
    	bars = new Chart_Bars({ props: { barCount }, $$inline: true });
    	axis = new Chart_Axis({ $$inline: true });
    	labels = new Chart_Labels({ props: { barCount }, $$inline: true });

    	ticker = new Chart_Ticker({
    			props: { date: /*keyframeDate*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(timer.$$.fragment);
    			t0 = space();
    			figure = element("figure");
    			div0 = element("div");
    			create_component(bars.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(axis.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(labels.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			create_component(ticker.$$.fragment);
    			attr_dev(div0, "class", "bars svelte-1mz8sbt");
    			add_location(div0, file$1, 71, 4, 2173);
    			attr_dev(div1, "class", "axis svelte-1mz8sbt");
    			add_location(div1, file$1, 75, 4, 2245);
    			attr_dev(div2, "class", "labels svelte-1mz8sbt");
    			add_location(div2, file$1, 79, 4, 2295);
    			attr_dev(div3, "class", "ticker svelte-1mz8sbt");
    			add_location(div3, file$1, 83, 4, 2371);
    			attr_dev(figure, "class", "svelte-1mz8sbt");
    			add_render_callback(() => /*figure_elementresize_handler*/ ctx[19].call(figure));
    			add_location(figure, file$1, 70, 2, 2092);
    		},
    		m: function mount(target, anchor) {
    			mount_component(timer, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, figure, anchor);
    			append_dev(figure, div0);
    			mount_component(bars, div0, null);
    			append_dev(figure, t1);
    			append_dev(figure, div1);
    			mount_component(axis, div1, null);
    			append_dev(figure, t2);
    			append_dev(figure, div2);
    			mount_component(labels, div2, null);
    			append_dev(figure, t3);
    			append_dev(figure, div3);
    			mount_component(ticker, div3, null);
    			figure_resize_listener = add_resize_listener(figure, /*figure_elementresize_handler*/ ctx[19].bind(figure));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const timer_changes = {};
    			if (dirty & /*isEnabled*/ 8) timer_changes.isEnabled = /*isEnabled*/ ctx[3];

    			if (!updating_currentKeyframe && dirty & /*currentKeyframe*/ 4) {
    				updating_currentKeyframe = true;
    				timer_changes.currentKeyframe = /*currentKeyframe*/ ctx[2];
    				add_flush_callback(() => updating_currentKeyframe = false);
    			}

    			timer.$set(timer_changes);
    			const ticker_changes = {};
    			if (dirty & /*keyframeDate*/ 16) ticker_changes.date = /*keyframeDate*/ ctx[4];
    			ticker.$set(ticker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timer.$$.fragment, local);
    			transition_in(bars.$$.fragment, local);
    			transition_in(axis.$$.fragment, local);
    			transition_in(labels.$$.fragment, local);
    			transition_in(ticker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timer.$$.fragment, local);
    			transition_out(bars.$$.fragment, local);
    			transition_out(axis.$$.fragment, local);
    			transition_out(labels.$$.fragment, local);
    			transition_out(ticker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(timer, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(figure);
    			destroy_component(bars);
    			destroy_component(axis);
    			destroy_component(labels);
    			destroy_component(ticker);
    			figure_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(63:0) {#if keyframes}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = keyframes && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (keyframes) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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

    const duration = 300; // ms between keyframes
    const barCount = 8; // how many bars to show
    const barMargin = 4; // space between bars

    function instance$1($$self, $$props, $$invalidate) {
    	let width;
    	let height;
    	let barHeight;
    	let frameIndex;
    	let frame;
    	let keyframeDate;
    	let keyframeData;
    	let currentData;
    	let chartContext;
    	let $xMax;
    	let $dimensions;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chart", slots, []);
    	const keyframeCount = keyframes.length; // number of keyframes
    	const names = keyframes[0][1].map(d => d.name); // all data names/labels
    	const dimensions = writable({});
    	validate_store(dimensions, "dimensions");
    	component_subscribe($$self, dimensions, value => $$invalidate(15, $dimensions = value));
    	const scales = writable({});
    	const data = tweened(null, { duration });
    	const xMax = tweened(null, { duration });
    	validate_store(xMax, "xMax");
    	component_subscribe($$self, xMax, value => $$invalidate(14, $xMax = value));
    	let figureWidth = 0;
    	let figureHeight = 0;
    	let currentKeyframe = 0;
    	let isEnabled = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	function timer_currentKeyframe_binding(value) {
    		currentKeyframe = value;
    		$$invalidate(2, currentKeyframe);
    	}

    	const end_handler = () => $$invalidate(3, isEnabled = false);

    	function figure_elementresize_handler() {
    		figureWidth = this.offsetWidth;
    		figureHeight = this.offsetHeight;
    		$$invalidate(0, figureWidth);
    		$$invalidate(1, figureHeight);
    	}

    	$$self.$capture_state = () => ({
    		scaleLinear: linear,
    		setContext,
    		writable,
    		tweened,
    		Timer,
    		Bars: Chart_Bars,
    		Axis: Chart_Axis,
    		Labels: Chart_Labels,
    		Ticker: Chart_Ticker,
    		keyframes,
    		duration,
    		barCount,
    		barMargin,
    		keyframeCount,
    		names,
    		dimensions,
    		scales,
    		data,
    		xMax,
    		figureWidth,
    		figureHeight,
    		currentKeyframe,
    		isEnabled,
    		width,
    		height,
    		barHeight,
    		frameIndex,
    		frame,
    		keyframeDate,
    		keyframeData,
    		currentData,
    		$xMax,
    		$dimensions,
    		chartContext
    	});

    	$$self.$inject_state = $$props => {
    		if ("figureWidth" in $$props) $$invalidate(0, figureWidth = $$props.figureWidth);
    		if ("figureHeight" in $$props) $$invalidate(1, figureHeight = $$props.figureHeight);
    		if ("currentKeyframe" in $$props) $$invalidate(2, currentKeyframe = $$props.currentKeyframe);
    		if ("isEnabled" in $$props) $$invalidate(3, isEnabled = $$props.isEnabled);
    		if ("width" in $$props) $$invalidate(7, width = $$props.width);
    		if ("height" in $$props) $$invalidate(8, height = $$props.height);
    		if ("barHeight" in $$props) $$invalidate(9, barHeight = $$props.barHeight);
    		if ("frameIndex" in $$props) $$invalidate(10, frameIndex = $$props.frameIndex);
    		if ("frame" in $$props) $$invalidate(11, frame = $$props.frame);
    		if ("keyframeDate" in $$props) $$invalidate(4, keyframeDate = $$props.keyframeDate);
    		if ("keyframeData" in $$props) $$invalidate(12, keyframeData = $$props.keyframeData);
    		if ("currentData" in $$props) $$invalidate(13, currentData = $$props.currentData);
    		if ("chartContext" in $$props) $$invalidate(16, chartContext = $$props.chartContext);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*figureWidth*/ 1) {
    			// update dimensions
    			$$invalidate(7, width = figureWidth);
    		}

    		if ($$self.$$.dirty & /*figureHeight*/ 2) {
    			$$invalidate(8, height = figureHeight);
    		}

    		if ($$self.$$.dirty & /*height*/ 256) {
    			$$invalidate(9, barHeight = height / barCount - barMargin);
    		}

    		if ($$self.$$.dirty & /*currentKeyframe*/ 4) {
    			// update data
    			$$invalidate(3, isEnabled = currentKeyframe < keyframeCount);
    		}

    		if ($$self.$$.dirty & /*currentKeyframe*/ 4) {
    			$$invalidate(10, frameIndex = Math.min(currentKeyframe, keyframeCount - 1));
    		}

    		if ($$self.$$.dirty & /*frameIndex*/ 1024) {
    			$$invalidate(11, frame = keyframes[frameIndex]);
    		}

    		if ($$self.$$.dirty & /*frame*/ 2048) {
    			$$invalidate(4, keyframeDate = frame[0]);
    		}

    		if ($$self.$$.dirty & /*frame*/ 2048) {
    			$$invalidate(12, keyframeData = frame[1]);
    		}

    		if ($$self.$$.dirty & /*keyframeData*/ 4096) {
    			$$invalidate(13, currentData = names.map(name => ({
    				...keyframeData.find(d => d.name == name)
    			})));
    		}

    		if ($$self.$$.dirty & /*currentData*/ 8192) {
    			// update stores and context
    			data.set(currentData);
    		}

    		if ($$self.$$.dirty & /*width, height, barHeight*/ 896) {
    			dimensions.set({ width, height, barHeight, barMargin });
    		}

    		if ($$self.$$.dirty & /*keyframeData*/ 4096) {
    			xMax.set(Math.max(...keyframeData.map(d => d.value)));
    		}

    		if ($$self.$$.dirty & /*$xMax, $dimensions*/ 49152) {
    			scales.set({
    				x: linear().domain([0, $xMax]).range([0, $dimensions.width]),
    				y: linear().domain([0, barCount]).range([0, $dimensions.height])
    			});
    		}

    		if ($$self.$$.dirty & /*chartContext*/ 65536) {
    			setContext("Chart", chartContext);
    		}
    	};

    	$$invalidate(16, chartContext = { dimensions, scales, data, names });

    	return [
    		figureWidth,
    		figureHeight,
    		currentKeyframe,
    		isEnabled,
    		keyframeDate,
    		dimensions,
    		xMax,
    		width,
    		height,
    		barHeight,
    		frameIndex,
    		frame,
    		keyframeData,
    		currentData,
    		$xMax,
    		$dimensions,
    		chartContext,
    		timer_currentKeyframe_binding,
    		end_handler,
    		figure_elementresize_handler
    	];
    }

    class Chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let section0;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let chart;
    	let t4;
    	let section1;
    	let p1;
    	let t5;
    	let a0;
    	let t7;
    	let a1;
    	let t9;
    	let strong;
    	let t11;
    	let a2;
    	let t13;
    	let a3;
    	let t15;
    	let a4;
    	let t17;
    	let current;
    	chart = new Chart({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			section0 = element("section");
    			h1 = element("h1");
    			h1.textContent = "Languages on Stack Overflow";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "% of questions by programming language";
    			t3 = space();
    			create_component(chart.$$.fragment);
    			t4 = space();
    			section1 = element("section");
    			p1 = element("p");
    			t5 = text("Data from ");
    			a0 = element("a");
    			a0.textContent = "Stack Overflow";
    			t7 = text(". This visualization was created for the\n      ");
    			a1 = element("a");
    			a1.textContent = "Svelte Summit 2021";
    			t9 = text("\n      talk entitled\n      ");
    			strong = element("strong");
    			strong.textContent = "Declarative Data Visualization: Creating a bar chart race";
    			t11 = text("\n      by ");
    			a2 = element("a");
    			a2.textContent = "Amelia Wattenberger";
    			t13 = text(" and\n      ");
    			a3 = element("a");
    			a3.textContent = "Russell Goldenberg";
    			t15 = text(". View the\n      source code on\n      ");
    			a4 = element("a");
    			a4.textContent = "Github";
    			t17 = text(".");
    			attr_dev(h1, "class", "svelte-fe6u4g");
    			add_location(h1, file, 6, 4, 95);
    			attr_dev(p0, "class", "svelte-fe6u4g");
    			add_location(p0, file, 7, 4, 136);
    			attr_dev(section0, "class", "intro svelte-fe6u4g");
    			add_location(section0, file, 5, 2, 67);
    			attr_dev(a0, "href", "https://insights.stackoverflow.com/trends?tags=java%2Cc%2Cc%2B%2B%2Cpython%2Cc%23%2Cvb.net[…]mbly%2Cphp%2Cperl%2Cruby%2Cvb%2Cswift%2Cr%2Cobjective-c");
    			add_location(a0, file, 14, 16, 259);
    			attr_dev(a1, "href", "https://sveltesummit.com/");
    			add_location(a1, file, 18, 6, 507);
    			add_location(strong, file, 20, 6, 592);
    			attr_dev(a2, "href", "https://twitter.com/wattenberger");
    			add_location(a2, file, 21, 9, 676);
    			attr_dev(a3, "href", "https://twitter.com/codenberg");
    			add_location(a3, file, 22, 6, 753);
    			attr_dev(a4, "href", "https://github.com/russellgoldenberg/svelte-bar-chart-race");
    			add_location(a4, file, 24, 6, 853);
    			attr_dev(p1, "class", "svelte-fe6u4g");
    			add_location(p1, file, 13, 4, 239);
    			attr_dev(section1, "class", "outro svelte-fe6u4g");
    			add_location(section1, file, 12, 2, 211);
    			attr_dev(main, "class", "svelte-fe6u4g");
    			add_location(main, file, 4, 0, 58);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, section0);
    			append_dev(section0, h1);
    			append_dev(section0, t1);
    			append_dev(section0, p0);
    			append_dev(main, t3);
    			mount_component(chart, main, null);
    			append_dev(main, t4);
    			append_dev(main, section1);
    			append_dev(section1, p1);
    			append_dev(p1, t5);
    			append_dev(p1, a0);
    			append_dev(p1, t7);
    			append_dev(p1, a1);
    			append_dev(p1, t9);
    			append_dev(p1, strong);
    			append_dev(p1, t11);
    			append_dev(p1, a2);
    			append_dev(p1, t13);
    			append_dev(p1, a3);
    			append_dev(p1, t15);
    			append_dev(p1, a4);
    			append_dev(p1, t17);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(chart);
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
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Chart });
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

}());
//# sourceMappingURL=bundle.js.map
