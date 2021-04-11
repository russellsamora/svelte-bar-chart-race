var app = (function () {
  "use strict";
  function a() {}
  const e = (a) => a;
  function n(a, e) {
    for (const n in e) a[n] = e[n];
    return a;
  }
  function r(a) {
    return a();
  }
  function u() {
    return Object.create(null);
  }
  function l(a) {
    a.forEach(r);
  }
  function t(a) {
    return "function" == typeof a;
  }
  function v(a, e) {
    return a != a
      ? e == e
      : a !== e || (a && "object" == typeof a) || "function" == typeof a;
  }
  function m(e, n, r) {
    e.$$.on_destroy.push(
      (function (e, ...n) {
        if (null == e) return a;
        const r = e.subscribe(...n);
        return r.unsubscribe ? () => r.unsubscribe() : r;
      })(n, r)
    );
  }
  const k = "undefined" != typeof window;
  let c = k ? () => window.performance.now() : () => Date.now(),
    i = k ? (a) => requestAnimationFrame(a) : a;
  const o = new Set();
  function s(a) {
    o.forEach((e) => {
      e.c(a) || (o.delete(e), e.f());
    }),
      0 !== o.size && i(s);
  }
  function p(a) {
    let e;
    return (
      0 === o.size && i(s),
      {
        promise: new Promise((n) => {
          o.add((e = { c: a, f: n }));
        }),
        abort() {
          o.delete(e);
        },
      }
    );
  }
  function f(a, e) {
    a.appendChild(e);
  }
  function h(a, e, n) {
    a.insertBefore(e, n || null);
  }
  function b(a) {
    a.parentNode.removeChild(a);
  }
  function y(a) {
    return document.createElement(a);
  }
  function g(a) {
    return document.createTextNode(a);
  }
  function d() {
    return g(" ");
  }
  function j() {
    return g("");
  }
  function w(a, e, n, r) {
    return a.addEventListener(e, n, r), () => a.removeEventListener(e, n, r);
  }
  function $(a, e, n) {
    null == n
      ? a.removeAttribute(e)
      : a.getAttribute(e) !== n && a.setAttribute(e, n);
  }
  function M(a, e) {
    (e = "" + e), a.wholeText !== e && (a.data = e);
  }
  function x(a, e, n, r) {
    a.style.setProperty(e, n, r ? "important" : "");
  }
  let C;
  function T() {
    if (void 0 === C) {
      C = !1;
      try {
        "undefined" != typeof window && window.parent && window.parent.document;
      } catch (a) {
        C = !0;
      }
    }
    return C;
  }
  function D(a, e) {
    const n = document.createEvent("CustomEvent");
    return n.initCustomEvent(a, !1, !1, e), n;
  }
  const N = new Set();
  let F,
    U = 0;
  function E(a, e, n, r, u, l, t, v = 0) {
    const m = 16.666 / r;
    let k = "{\n";
    for (let a = 0; a <= 1; a += m) {
      const r = e + (n - e) * l(a);
      k += 100 * a + `%{${t(r, 1 - r)}}\n`;
    }
    const c = k + `100% {${t(n, 1 - n)}}\n}`,
      i = `__svelte_${(function (a) {
        let e = 5381,
          n = a.length;
        for (; n--; ) e = ((e << 5) - e) ^ a.charCodeAt(n);
        return e >>> 0;
      })(c)}_${v}`,
      o = a.ownerDocument;
    N.add(o);
    const s =
        o.__svelte_stylesheet ||
        (o.__svelte_stylesheet = o.head.appendChild(y("style")).sheet),
      p = o.__svelte_rules || (o.__svelte_rules = {});
    p[i] ||
      ((p[i] = !0), s.insertRule(`@keyframes ${i} ${c}`, s.cssRules.length));
    const f = a.style.animation || "";
    return (
      (a.style.animation = `${
        f ? `${f}, ` : ""
      }${i} ${r}ms linear ${u}ms 1 both`),
      (U += 1),
      i
    );
  }
  function A(a, e) {
    const n = (a.style.animation || "").split(", "),
      r = n.filter(
        e ? (a) => a.indexOf(e) < 0 : (a) => -1 === a.indexOf("__svelte")
      ),
      u = n.length - r.length;
    u &&
      ((a.style.animation = r.join(", ")),
      (U -= u),
      U ||
        i(() => {
          U ||
            (N.forEach((a) => {
              const e = a.__svelte_stylesheet;
              let n = e.cssRules.length;
              for (; n--; ) e.deleteRule(n);
              a.__svelte_rules = {};
            }),
            N.clear());
        }));
  }
  function _(a) {
    F = a;
  }
  function S() {
    if (!F) throw new Error("Function called outside component initialization");
    return F;
  }
  function H(a) {
    return S().$$.context.get(a);
  }
  const Y = [],
    z = [],
    L = [],
    O = [],
    q = Promise.resolve();
  let R = !1;
  function P(a) {
    L.push(a);
  }
  let W = !1;
  const B = new Set();
  function V() {
    if (!W) {
      W = !0;
      do {
        for (let a = 0; a < Y.length; a += 1) {
          const e = Y[a];
          _(e), Z(e.$$);
        }
        for (_(null), Y.length = 0; z.length; ) z.pop()();
        for (let a = 0; a < L.length; a += 1) {
          const e = L[a];
          B.has(e) || (B.add(e), e());
        }
        L.length = 0;
      } while (Y.length);
      for (; O.length; ) O.pop()();
      (R = !1), (W = !1), B.clear();
    }
  }
  function Z(a) {
    if (null !== a.fragment) {
      a.update(), l(a.before_update);
      const e = a.dirty;
      (a.dirty = [-1]),
        a.fragment && a.fragment.p(a.ctx, e),
        a.after_update.forEach(P);
    }
  }
  let I;
  function X(a, e, n) {
    a.dispatchEvent(D(`${e ? "intro" : "outro"}${n}`));
  }
  const K = new Set();
  let G;
  function J() {
    G = { r: 0, c: [], p: G };
  }
  function Q() {
    G.r || l(G.c), (G = G.p);
  }
  function aa(a, e) {
    a && a.i && (K.delete(a), a.i(e));
  }
  function ea(a, e, n, r) {
    if (a && a.o) {
      if (K.has(a)) return;
      K.add(a),
        G.c.push(() => {
          K.delete(a), r && (n && a.d(1), r());
        }),
        a.o(e);
    }
  }
  const na = { duration: 0 };
  function ra(n, r, u, v) {
    let m = r(n, u),
      k = v ? 0 : 1,
      i = null,
      o = null,
      s = null;
    function f() {
      s && A(n, s);
    }
    function h(a, e) {
      const n = a.b - k;
      return (
        (e *= Math.abs(n)),
        {
          a: k,
          b: a.b,
          d: n,
          duration: e,
          start: a.start,
          end: a.start + e,
          group: a.group,
        }
      );
    }
    function b(r) {
      const {
          delay: u = 0,
          duration: t = 300,
          easing: v = e,
          tick: b = a,
          css: y,
        } = m || na,
        g = { start: c() + u, b: r };
      r || ((g.group = G), (G.r += 1)),
        i || o
          ? (o = g)
          : (y && (f(), (s = E(n, k, r, t, u, v, y))),
            r && b(0, 1),
            (i = h(g, t)),
            P(() => X(n, r, "start")),
            p((a) => {
              if (
                (o &&
                  a > o.start &&
                  ((i = h(o, t)),
                  (o = null),
                  X(n, i.b, "start"),
                  y && (f(), (s = E(n, k, i.b, i.duration, 0, v, m.css)))),
                i)
              )
                if (a >= i.end)
                  b((k = i.b), 1 - k),
                    X(n, i.b, "end"),
                    o || (i.b ? f() : --i.group.r || l(i.group.c)),
                    (i = null);
                else if (a >= i.start) {
                  const e = a - i.start;
                  (k = i.a + i.d * v(e / i.duration)), b(k, 1 - k);
                }
              return !(!i && !o);
            }));
    }
    return {
      run(a) {
        t(m)
          ? (I ||
              ((I = Promise.resolve()),
              I.then(() => {
                I = null;
              })),
            I).then(() => {
              (m = m()), b(a);
            })
          : b(a);
      },
      end() {
        f(), (i = o = null);
      },
    };
  }
  function ua(a, e) {
    ea(a, 1, 1, () => {
      e.delete(a.key);
    });
  }
  function la(a, e, n, r, u, l, t, v, m, k, c, i) {
    let o = a.length,
      s = l.length,
      p = o;
    const f = {};
    for (; p--; ) f[a[p].key] = p;
    const h = [],
      b = new Map(),
      y = new Map();
    for (p = s; p--; ) {
      const a = i(u, l, p),
        v = n(a);
      let m = t.get(v);
      m ? r && m.p(a, e) : ((m = k(v, a)), m.c()),
        b.set(v, (h[p] = m)),
        v in f && y.set(v, Math.abs(p - f[v]));
    }
    const g = new Set(),
      d = new Set();
    function j(a) {
      aa(a, 1), a.m(v, c), t.set(a.key, a), (c = a.first), s--;
    }
    for (; o && s; ) {
      const e = h[s - 1],
        n = a[o - 1],
        r = e.key,
        u = n.key;
      e === n
        ? ((c = e.first), o--, s--)
        : b.has(u)
        ? !t.has(r) || g.has(r)
          ? j(e)
          : d.has(u)
          ? o--
          : y.get(r) > y.get(u)
          ? (d.add(r), j(e))
          : (g.add(u), o--)
        : (m(n, t), o--);
    }
    for (; o--; ) {
      const e = a[o];
      b.has(e.key) || m(e, t);
    }
    for (; s; ) j(h[s - 1]);
    return h;
  }
  function ta(a) {
    a && a.c();
  }
  function va(a, e, n, u) {
    const { fragment: v, on_mount: m, on_destroy: k, after_update: c } = a.$$;
    v && v.m(e, n),
      u ||
        P(() => {
          const e = m.map(r).filter(t);
          k ? k.push(...e) : l(e), (a.$$.on_mount = []);
        }),
      c.forEach(P);
  }
  function ma(a, e) {
    const n = a.$$;
    null !== n.fragment &&
      (l(n.on_destroy),
      n.fragment && n.fragment.d(e),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []));
  }
  function ka(a, e) {
    -1 === a.$$.dirty[0] &&
      (Y.push(a), R || ((R = !0), q.then(V)), a.$$.dirty.fill(0)),
      (a.$$.dirty[(e / 31) | 0] |= 1 << e % 31);
  }
  function ca(e, n, r, t, v, m, k = [-1]) {
    const c = F;
    _(e);
    const i = (e.$$ = {
      fragment: null,
      ctx: null,
      props: m,
      update: a,
      not_equal: v,
      bound: u(),
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(c ? c.$$.context : n.context || []),
      callbacks: u(),
      dirty: k,
      skip_bound: !1,
    });
    let o = !1;
    if (
      ((i.ctx = r
        ? r(e, n.props || {}, (a, n, ...r) => {
            const u = r.length ? r[0] : n;
            return (
              i.ctx &&
                v(i.ctx[a], (i.ctx[a] = u)) &&
                (!i.skip_bound && i.bound[a] && i.bound[a](u), o && ka(e, a)),
              n
            );
          })
        : []),
      i.update(),
      (o = !0),
      l(i.before_update),
      (i.fragment = !!t && t(i.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const a = (function (a) {
          return Array.from(a.childNodes);
        })(n.target);
        i.fragment && i.fragment.l(a), a.forEach(b);
      } else i.fragment && i.fragment.c();
      n.intro && aa(e.$$.fragment),
        va(e, n.target, n.anchor, n.customElement),
        V();
    }
    _(c);
  }
  class ia {
    $destroy() {
      ma(this, 1), (this.$destroy = a);
    }
    $on(a, e) {
      const n = this.$$.callbacks[a] || (this.$$.callbacks[a] = []);
      return (
        n.push(e),
        () => {
          const a = n.indexOf(e);
          -1 !== a && n.splice(a, 1);
        }
      );
    }
    $set(a) {
      var e;
      this.$$set &&
        ((e = a), 0 !== Object.keys(e).length) &&
        ((this.$$.skip_bound = !0), this.$$set(a), (this.$$.skip_bound = !1));
    }
  }
  function oa(a, e) {
    return a < e ? -1 : a > e ? 1 : a >= e ? 0 : NaN;
  }
  function sa(a) {
    let e = a,
      n = a;
    function r(a, e, r, u) {
      for (null == r && (r = 0), null == u && (u = a.length); r < u; ) {
        const l = (r + u) >>> 1;
        n(a[l], e) < 0 ? (r = l + 1) : (u = l);
      }
      return r;
    }
    return (
      1 === a.length &&
        ((e = (e, n) => a(e) - n),
        (n = (function (a) {
          return (e, n) => oa(a(e), n);
        })(a))),
      {
        left: r,
        center: function (a, n, u, l) {
          null == u && (u = 0), null == l && (l = a.length);
          const t = r(a, n, u, l - 1);
          return t > u && e(a[t - 1], n) > -e(a[t], n) ? t - 1 : t;
        },
        right: function (a, e, r, u) {
          for (null == r && (r = 0), null == u && (u = a.length); r < u; ) {
            const l = (r + u) >>> 1;
            n(a[l], e) > 0 ? (u = l) : (r = l + 1);
          }
          return r;
        },
      }
    );
  }
  const pa = sa(oa).right;
  sa(function (a) {
    return null === a ? NaN : +a;
  }).center;
  var fa = Math.sqrt(50),
    ha = Math.sqrt(10),
    ba = Math.sqrt(2);
  function ya(a, e, n) {
    var r = (e - a) / Math.max(0, n),
      u = Math.floor(Math.log(r) / Math.LN10),
      l = r / Math.pow(10, u);
    return u >= 0
      ? (l >= fa ? 10 : l >= ha ? 5 : l >= ba ? 2 : 1) * Math.pow(10, u)
      : -Math.pow(10, -u) / (l >= fa ? 10 : l >= ha ? 5 : l >= ba ? 2 : 1);
  }
  var ga = { value: () => {} };
  function da() {
    for (var a, e = 0, n = arguments.length, r = {}; e < n; ++e) {
      if (!(a = arguments[e] + "") || a in r || /[\s.]/.test(a))
        throw new Error("illegal type: " + a);
      r[a] = [];
    }
    return new ja(r);
  }
  function ja(a) {
    this._ = a;
  }
  function wa(a, e) {
    return a
      .trim()
      .split(/^|\s+/)
      .map(function (a) {
        var n = "",
          r = a.indexOf(".");
        if (
          (r >= 0 && ((n = a.slice(r + 1)), (a = a.slice(0, r))),
          a && !e.hasOwnProperty(a))
        )
          throw new Error("unknown type: " + a);
        return { type: a, name: n };
      });
  }
  function $a(a, e) {
    for (var n, r = 0, u = a.length; r < u; ++r)
      if ((n = a[r]).name === e) return n.value;
  }
  function Ma(a, e, n) {
    for (var r = 0, u = a.length; r < u; ++r)
      if (a[r].name === e) {
        (a[r] = ga), (a = a.slice(0, r).concat(a.slice(r + 1)));
        break;
      }
    return null != n && a.push({ name: e, value: n }), a;
  }
  function xa(a, e, n) {
    (a.prototype = e.prototype = n), (n.constructor = a);
  }
  function Ca(a, e) {
    var n = Object.create(a.prototype);
    for (var r in e) n[r] = e[r];
    return n;
  }
  function Ta() {}
  ja.prototype = da.prototype = {
    constructor: ja,
    on: function (a, e) {
      var n,
        r = this._,
        u = wa(a + "", r),
        l = -1,
        t = u.length;
      if (!(arguments.length < 2)) {
        if (null != e && "function" != typeof e)
          throw new Error("invalid callback: " + e);
        for (; ++l < t; )
          if ((n = (a = u[l]).type)) r[n] = Ma(r[n], a.name, e);
          else if (null == e) for (n in r) r[n] = Ma(r[n], a.name, null);
        return this;
      }
      for (; ++l < t; )
        if ((n = (a = u[l]).type) && (n = $a(r[n], a.name))) return n;
    },
    copy: function () {
      var a = {},
        e = this._;
      for (var n in e) a[n] = e[n].slice();
      return new ja(a);
    },
    call: function (a, e) {
      if ((n = arguments.length - 2) > 0)
        for (var n, r, u = new Array(n), l = 0; l < n; ++l)
          u[l] = arguments[l + 2];
      if (!this._.hasOwnProperty(a)) throw new Error("unknown type: " + a);
      for (l = 0, n = (r = this._[a]).length; l < n; ++l)
        r[l].value.apply(e, u);
    },
    apply: function (a, e, n) {
      if (!this._.hasOwnProperty(a)) throw new Error("unknown type: " + a);
      for (var r = this._[a], u = 0, l = r.length; u < l; ++u)
        r[u].value.apply(e, n);
    },
  };
  var Da = 0.7,
    Na = 1 / Da,
    Fa = "\\s*([+-]?\\d+)\\s*",
    Ua = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
    Ea = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
    Aa = /^#([0-9a-f]{3,8})$/,
    _a = new RegExp("^rgb\\(" + [Fa, Fa, Fa] + "\\)$"),
    Sa = new RegExp("^rgb\\(" + [Ea, Ea, Ea] + "\\)$"),
    Ha = new RegExp("^rgba\\(" + [Fa, Fa, Fa, Ua] + "\\)$"),
    Ya = new RegExp("^rgba\\(" + [Ea, Ea, Ea, Ua] + "\\)$"),
    za = new RegExp("^hsl\\(" + [Ua, Ea, Ea] + "\\)$"),
    La = new RegExp("^hsla\\(" + [Ua, Ea, Ea, Ua] + "\\)$"),
    Oa = {
      aliceblue: 15792383,
      antiquewhite: 16444375,
      aqua: 65535,
      aquamarine: 8388564,
      azure: 15794175,
      beige: 16119260,
      bisque: 16770244,
      black: 0,
      blanchedalmond: 16772045,
      blue: 255,
      blueviolet: 9055202,
      brown: 10824234,
      burlywood: 14596231,
      cadetblue: 6266528,
      chartreuse: 8388352,
      chocolate: 13789470,
      coral: 16744272,
      cornflowerblue: 6591981,
      cornsilk: 16775388,
      crimson: 14423100,
      cyan: 65535,
      darkblue: 139,
      darkcyan: 35723,
      darkgoldenrod: 12092939,
      darkgray: 11119017,
      darkgreen: 25600,
      darkgrey: 11119017,
      darkkhaki: 12433259,
      darkmagenta: 9109643,
      darkolivegreen: 5597999,
      darkorange: 16747520,
      darkorchid: 10040012,
      darkred: 9109504,
      darksalmon: 15308410,
      darkseagreen: 9419919,
      darkslateblue: 4734347,
      darkslategray: 3100495,
      darkslategrey: 3100495,
      darkturquoise: 52945,
      darkviolet: 9699539,
      deeppink: 16716947,
      deepskyblue: 49151,
      dimgray: 6908265,
      dimgrey: 6908265,
      dodgerblue: 2003199,
      firebrick: 11674146,
      floralwhite: 16775920,
      forestgreen: 2263842,
      fuchsia: 16711935,
      gainsboro: 14474460,
      ghostwhite: 16316671,
      gold: 16766720,
      goldenrod: 14329120,
      gray: 8421504,
      green: 32768,
      greenyellow: 11403055,
      grey: 8421504,
      honeydew: 15794160,
      hotpink: 16738740,
      indianred: 13458524,
      indigo: 4915330,
      ivory: 16777200,
      khaki: 15787660,
      lavender: 15132410,
      lavenderblush: 16773365,
      lawngreen: 8190976,
      lemonchiffon: 16775885,
      lightblue: 11393254,
      lightcoral: 15761536,
      lightcyan: 14745599,
      lightgoldenrodyellow: 16448210,
      lightgray: 13882323,
      lightgreen: 9498256,
      lightgrey: 13882323,
      lightpink: 16758465,
      lightsalmon: 16752762,
      lightseagreen: 2142890,
      lightskyblue: 8900346,
      lightslategray: 7833753,
      lightslategrey: 7833753,
      lightsteelblue: 11584734,
      lightyellow: 16777184,
      lime: 65280,
      limegreen: 3329330,
      linen: 16445670,
      magenta: 16711935,
      maroon: 8388608,
      mediumaquamarine: 6737322,
      mediumblue: 205,
      mediumorchid: 12211667,
      mediumpurple: 9662683,
      mediumseagreen: 3978097,
      mediumslateblue: 8087790,
      mediumspringgreen: 64154,
      mediumturquoise: 4772300,
      mediumvioletred: 13047173,
      midnightblue: 1644912,
      mintcream: 16121850,
      mistyrose: 16770273,
      moccasin: 16770229,
      navajowhite: 16768685,
      navy: 128,
      oldlace: 16643558,
      olive: 8421376,
      olivedrab: 7048739,
      orange: 16753920,
      orangered: 16729344,
      orchid: 14315734,
      palegoldenrod: 15657130,
      palegreen: 10025880,
      paleturquoise: 11529966,
      palevioletred: 14381203,
      papayawhip: 16773077,
      peachpuff: 16767673,
      peru: 13468991,
      pink: 16761035,
      plum: 14524637,
      powderblue: 11591910,
      purple: 8388736,
      rebeccapurple: 6697881,
      red: 16711680,
      rosybrown: 12357519,
      royalblue: 4286945,
      saddlebrown: 9127187,
      salmon: 16416882,
      sandybrown: 16032864,
      seagreen: 3050327,
      seashell: 16774638,
      sienna: 10506797,
      silver: 12632256,
      skyblue: 8900331,
      slateblue: 6970061,
      slategray: 7372944,
      slategrey: 7372944,
      snow: 16775930,
      springgreen: 65407,
      steelblue: 4620980,
      tan: 13808780,
      teal: 32896,
      thistle: 14204888,
      tomato: 16737095,
      turquoise: 4251856,
      violet: 15631086,
      wheat: 16113331,
      white: 16777215,
      whitesmoke: 16119285,
      yellow: 16776960,
      yellowgreen: 10145074,
    };
  function qa() {
    return this.rgb().formatHex();
  }
  function Ra() {
    return this.rgb().formatRgb();
  }
  function Pa(a) {
    var e, n;
    return (
      (a = (a + "").trim().toLowerCase()),
      (e = Aa.exec(a))
        ? ((n = e[1].length),
          (e = parseInt(e[1], 16)),
          6 === n
            ? Wa(e)
            : 3 === n
            ? new Ia(
                ((e >> 8) & 15) | ((e >> 4) & 240),
                ((e >> 4) & 15) | (240 & e),
                ((15 & e) << 4) | (15 & e),
                1
              )
            : 8 === n
            ? Ba(
                (e >> 24) & 255,
                (e >> 16) & 255,
                (e >> 8) & 255,
                (255 & e) / 255
              )
            : 4 === n
            ? Ba(
                ((e >> 12) & 15) | ((e >> 8) & 240),
                ((e >> 8) & 15) | ((e >> 4) & 240),
                ((e >> 4) & 15) | (240 & e),
                (((15 & e) << 4) | (15 & e)) / 255
              )
            : null)
        : (e = _a.exec(a))
        ? new Ia(e[1], e[2], e[3], 1)
        : (e = Sa.exec(a))
        ? new Ia((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, 1)
        : (e = Ha.exec(a))
        ? Ba(e[1], e[2], e[3], e[4])
        : (e = Ya.exec(a))
        ? Ba((255 * e[1]) / 100, (255 * e[2]) / 100, (255 * e[3]) / 100, e[4])
        : (e = za.exec(a))
        ? Ja(e[1], e[2] / 100, e[3] / 100, 1)
        : (e = La.exec(a))
        ? Ja(e[1], e[2] / 100, e[3] / 100, e[4])
        : Oa.hasOwnProperty(a)
        ? Wa(Oa[a])
        : "transparent" === a
        ? new Ia(NaN, NaN, NaN, 0)
        : null
    );
  }
  function Wa(a) {
    return new Ia((a >> 16) & 255, (a >> 8) & 255, 255 & a, 1);
  }
  function Ba(a, e, n, r) {
    return r <= 0 && (a = e = n = NaN), new Ia(a, e, n, r);
  }
  function Va(a) {
    return (
      a instanceof Ta || (a = Pa(a)),
      a ? new Ia((a = a.rgb()).r, a.g, a.b, a.opacity) : new Ia()
    );
  }
  function Za(a, e, n, r) {
    return 1 === arguments.length ? Va(a) : new Ia(a, e, n, null == r ? 1 : r);
  }
  function Ia(a, e, n, r) {
    (this.r = +a), (this.g = +e), (this.b = +n), (this.opacity = +r);
  }
  function Xa() {
    return "#" + Ga(this.r) + Ga(this.g) + Ga(this.b);
  }
  function Ka() {
    var a = this.opacity;
    return (
      (1 === (a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a)))
        ? "rgb("
        : "rgba(") +
      Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
      ", " +
      Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
      (1 === a ? ")" : ", " + a + ")")
    );
  }
  function Ga(a) {
    return (
      ((a = Math.max(0, Math.min(255, Math.round(a) || 0))) < 16 ? "0" : "") +
      a.toString(16)
    );
  }
  function Ja(a, e, n, r) {
    return (
      r <= 0
        ? (a = e = n = NaN)
        : n <= 0 || n >= 1
        ? (a = e = NaN)
        : e <= 0 && (a = NaN),
      new ae(a, e, n, r)
    );
  }
  function Qa(a) {
    if (a instanceof ae) return new ae(a.h, a.s, a.l, a.opacity);
    if ((a instanceof Ta || (a = Pa(a)), !a)) return new ae();
    if (a instanceof ae) return a;
    var e = (a = a.rgb()).r / 255,
      n = a.g / 255,
      r = a.b / 255,
      u = Math.min(e, n, r),
      l = Math.max(e, n, r),
      t = NaN,
      v = l - u,
      m = (l + u) / 2;
    return (
      v
        ? ((t =
            e === l
              ? (n - r) / v + 6 * (n < r)
              : n === l
              ? (r - e) / v + 2
              : (e - n) / v + 4),
          (v /= m < 0.5 ? l + u : 2 - l - u),
          (t *= 60))
        : (v = m > 0 && m < 1 ? 0 : t),
      new ae(t, v, m, a.opacity)
    );
  }
  function ae(a, e, n, r) {
    (this.h = +a), (this.s = +e), (this.l = +n), (this.opacity = +r);
  }
  function ee(a, e, n) {
    return (
      255 *
      (a < 60
        ? e + ((n - e) * a) / 60
        : a < 180
        ? n
        : a < 240
        ? e + ((n - e) * (240 - a)) / 60
        : e)
    );
  }
  xa(Ta, Pa, {
    copy: function (a) {
      return Object.assign(new this.constructor(), this, a);
    },
    displayable: function () {
      return this.rgb().displayable();
    },
    hex: qa,
    formatHex: qa,
    formatHsl: function () {
      return Qa(this).formatHsl();
    },
    formatRgb: Ra,
    toString: Ra,
  }),
    xa(
      Ia,
      Za,
      Ca(Ta, {
        brighter: function (a) {
          return (
            (a = null == a ? Na : Math.pow(Na, a)),
            new Ia(this.r * a, this.g * a, this.b * a, this.opacity)
          );
        },
        darker: function (a) {
          return (
            (a = null == a ? Da : Math.pow(Da, a)),
            new Ia(this.r * a, this.g * a, this.b * a, this.opacity)
          );
        },
        rgb: function () {
          return this;
        },
        displayable: function () {
          return (
            -0.5 <= this.r &&
            this.r < 255.5 &&
            -0.5 <= this.g &&
            this.g < 255.5 &&
            -0.5 <= this.b &&
            this.b < 255.5 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        hex: Xa,
        formatHex: Xa,
        formatRgb: Ka,
        toString: Ka,
      })
    ),
    xa(
      ae,
      function (a, e, n, r) {
        return 1 === arguments.length
          ? Qa(a)
          : new ae(a, e, n, null == r ? 1 : r);
      },
      Ca(Ta, {
        brighter: function (a) {
          return (
            (a = null == a ? Na : Math.pow(Na, a)),
            new ae(this.h, this.s, this.l * a, this.opacity)
          );
        },
        darker: function (a) {
          return (
            (a = null == a ? Da : Math.pow(Da, a)),
            new ae(this.h, this.s, this.l * a, this.opacity)
          );
        },
        rgb: function () {
          var a = (this.h % 360) + 360 * (this.h < 0),
            e = isNaN(a) || isNaN(this.s) ? 0 : this.s,
            n = this.l,
            r = n + (n < 0.5 ? n : 1 - n) * e,
            u = 2 * n - r;
          return new Ia(
            ee(a >= 240 ? a - 240 : a + 120, u, r),
            ee(a, u, r),
            ee(a < 120 ? a + 240 : a - 120, u, r),
            this.opacity
          );
        },
        displayable: function () {
          return (
            ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
            0 <= this.l &&
            this.l <= 1 &&
            0 <= this.opacity &&
            this.opacity <= 1
          );
        },
        formatHsl: function () {
          var a = this.opacity;
          return (
            (1 === (a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a)))
              ? "hsl("
              : "hsla(") +
            (this.h || 0) +
            ", " +
            100 * (this.s || 0) +
            "%, " +
            100 * (this.l || 0) +
            "%" +
            (1 === a ? ")" : ", " + a + ")")
          );
        },
      })
    );
  var ne = (a) => () => a;
  function re(a) {
    return 1 == (a = +a)
      ? ue
      : function (e, n) {
          return n - e
            ? (function (a, e, n) {
                return (
                  (a = Math.pow(a, n)),
                  (e = Math.pow(e, n) - a),
                  (n = 1 / n),
                  function (r) {
                    return Math.pow(a + r * e, n);
                  }
                );
              })(e, n, a)
            : ne(isNaN(e) ? n : e);
        };
  }
  function ue(a, e) {
    var n = e - a;
    return n
      ? (function (a, e) {
          return function (n) {
            return a + n * e;
          };
        })(a, n)
      : ne(isNaN(a) ? e : a);
  }
  var le = (function a(e) {
    var n = re(e);
    function r(a, e) {
      var r = n((a = Za(a)).r, (e = Za(e)).r),
        u = n(a.g, e.g),
        l = n(a.b, e.b),
        t = ue(a.opacity, e.opacity);
      return function (e) {
        return (
          (a.r = r(e)), (a.g = u(e)), (a.b = l(e)), (a.opacity = t(e)), a + ""
        );
      };
    }
    return (r.gamma = a), r;
  })(1);
  function te(a, e) {
    e || (e = []);
    var n,
      r = a ? Math.min(e.length, a.length) : 0,
      u = e.slice();
    return function (l) {
      for (n = 0; n < r; ++n) u[n] = a[n] * (1 - l) + e[n] * l;
      return u;
    };
  }
  function ve(a, e) {
    var n,
      r = e ? e.length : 0,
      u = a ? Math.min(r, a.length) : 0,
      l = new Array(u),
      t = new Array(r);
    for (n = 0; n < u; ++n) l[n] = pe(a[n], e[n]);
    for (; n < r; ++n) t[n] = e[n];
    return function (a) {
      for (n = 0; n < u; ++n) t[n] = l[n](a);
      return t;
    };
  }
  function me(a, e) {
    var n = new Date();
    return (
      (a = +a),
      (e = +e),
      function (r) {
        return n.setTime(a * (1 - r) + e * r), n;
      }
    );
  }
  function ke(a, e) {
    return (
      (a = +a),
      (e = +e),
      function (n) {
        return a * (1 - n) + e * n;
      }
    );
  }
  function ce(a, e) {
    var n,
      r = {},
      u = {};
    for (n in ((null !== a && "object" == typeof a) || (a = {}),
    (null !== e && "object" == typeof e) || (e = {}),
    e))
      n in a ? (r[n] = pe(a[n], e[n])) : (u[n] = e[n]);
    return function (a) {
      for (n in r) u[n] = r[n](a);
      return u;
    };
  }
  var ie = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
    oe = new RegExp(ie.source, "g");
  function se(a, e) {
    var n,
      r,
      u,
      l = (ie.lastIndex = oe.lastIndex = 0),
      t = -1,
      v = [],
      m = [];
    for (a += "", e += ""; (n = ie.exec(a)) && (r = oe.exec(e)); )
      (u = r.index) > l &&
        ((u = e.slice(l, u)), v[t] ? (v[t] += u) : (v[++t] = u)),
        (n = n[0]) === (r = r[0])
          ? v[t]
            ? (v[t] += r)
            : (v[++t] = r)
          : ((v[++t] = null), m.push({ i: t, x: ke(n, r) })),
        (l = oe.lastIndex);
    return (
      l < e.length && ((u = e.slice(l)), v[t] ? (v[t] += u) : (v[++t] = u)),
      v.length < 2
        ? m[0]
          ? (function (a) {
              return function (e) {
                return a(e) + "";
              };
            })(m[0].x)
          : (function (a) {
              return function () {
                return a;
              };
            })(e)
        : ((e = m.length),
          function (a) {
            for (var n, r = 0; r < e; ++r) v[(n = m[r]).i] = n.x(a);
            return v.join("");
          })
    );
  }
  function pe(a, e) {
    var n,
      r,
      u = typeof e;
    return null == e || "boolean" === u
      ? ne(e)
      : ("number" === u
          ? ke
          : "string" === u
          ? (n = Pa(e))
            ? ((e = n), le)
            : se
          : e instanceof Pa
          ? le
          : e instanceof Date
          ? me
          : ((r = e),
            !ArrayBuffer.isView(r) || r instanceof DataView
              ? Array.isArray(e)
                ? ve
                : ("function" != typeof e.valueOf &&
                    "function" != typeof e.toString) ||
                  isNaN(e)
                ? ce
                : ke
              : te))(a, e);
  }
  function fe(a, e) {
    return (
      (a = +a),
      (e = +e),
      function (n) {
        return Math.round(a * (1 - n) + e * n);
      }
    );
  }
  function he(a, e) {
    if (
      (n = (a = e ? a.toExponential(e - 1) : a.toExponential()).indexOf("e")) <
      0
    )
      return null;
    var n,
      r = a.slice(0, n);
    return [r.length > 1 ? r[0] + r.slice(2) : r, +a.slice(n + 1)];
  }
  function be(a) {
    return (a = he(Math.abs(a))) ? a[1] : NaN;
  }
  da("start", "end", "cancel", "interrupt");
  var ye,
    ge = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;
  function de(a) {
    if (!(e = ge.exec(a))) throw new Error("invalid format: " + a);
    var e;
    return new je({
      fill: e[1],
      align: e[2],
      sign: e[3],
      symbol: e[4],
      zero: e[5],
      width: e[6],
      comma: e[7],
      precision: e[8] && e[8].slice(1),
      trim: e[9],
      type: e[10],
    });
  }
  function je(a) {
    (this.fill = void 0 === a.fill ? " " : a.fill + ""),
      (this.align = void 0 === a.align ? ">" : a.align + ""),
      (this.sign = void 0 === a.sign ? "-" : a.sign + ""),
      (this.symbol = void 0 === a.symbol ? "" : a.symbol + ""),
      (this.zero = !!a.zero),
      (this.width = void 0 === a.width ? void 0 : +a.width),
      (this.comma = !!a.comma),
      (this.precision = void 0 === a.precision ? void 0 : +a.precision),
      (this.trim = !!a.trim),
      (this.type = void 0 === a.type ? "" : a.type + "");
  }
  function we(a, e) {
    var n = he(a, e);
    if (!n) return a + "";
    var r = n[0],
      u = n[1];
    return u < 0
      ? "0." + new Array(-u).join("0") + r
      : r.length > u + 1
      ? r.slice(0, u + 1) + "." + r.slice(u + 1)
      : r + new Array(u - r.length + 2).join("0");
  }
  (de.prototype = je.prototype),
    (je.prototype.toString = function () {
      return (
        this.fill +
        this.align +
        this.sign +
        this.symbol +
        (this.zero ? "0" : "") +
        (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) +
        (this.comma ? "," : "") +
        (void 0 === this.precision
          ? ""
          : "." + Math.max(0, 0 | this.precision)) +
        (this.trim ? "~" : "") +
        this.type
      );
    });
  var $e = {
    "%": (a, e) => (100 * a).toFixed(e),
    b: (a) => Math.round(a).toString(2),
    c: (a) => a + "",
    d: function (a) {
      return Math.abs((a = Math.round(a))) >= 1e21
        ? a.toLocaleString("en").replace(/,/g, "")
        : a.toString(10);
    },
    e: (a, e) => a.toExponential(e),
    f: (a, e) => a.toFixed(e),
    g: (a, e) => a.toPrecision(e),
    o: (a) => Math.round(a).toString(8),
    p: (a, e) => we(100 * a, e),
    r: we,
    s: function (a, e) {
      var n = he(a, e);
      if (!n) return a + "";
      var r = n[0],
        u = n[1],
        l = u - (ye = 3 * Math.max(-8, Math.min(8, Math.floor(u / 3)))) + 1,
        t = r.length;
      return l === t
        ? r
        : l > t
        ? r + new Array(l - t + 1).join("0")
        : l > 0
        ? r.slice(0, l) + "." + r.slice(l)
        : "0." + new Array(1 - l).join("0") + he(a, Math.max(0, e + l - 1))[0];
    },
    X: (a) => Math.round(a).toString(16).toUpperCase(),
    x: (a) => Math.round(a).toString(16),
  };
  function Me(a) {
    return a;
  }
  var xe,
    Ce,
    Te,
    De = Array.prototype.map,
    Ne = [
      "y",
      "z",
      "a",
      "f",
      "p",
      "n",
      "µ",
      "m",
      "",
      "k",
      "M",
      "G",
      "T",
      "P",
      "E",
      "Z",
      "Y",
    ];
  function Fe(a) {
    var e,
      n,
      r =
        void 0 === a.grouping || void 0 === a.thousands
          ? Me
          : ((e = De.call(a.grouping, Number)),
            (n = a.thousands + ""),
            function (a, r) {
              for (
                var u = a.length, l = [], t = 0, v = e[0], m = 0;
                u > 0 &&
                v > 0 &&
                (m + v + 1 > r && (v = Math.max(1, r - m)),
                l.push(a.substring((u -= v), u + v)),
                !((m += v + 1) > r));

              )
                v = e[(t = (t + 1) % e.length)];
              return l.reverse().join(n);
            }),
      u = void 0 === a.currency ? "" : a.currency[0] + "",
      l = void 0 === a.currency ? "" : a.currency[1] + "",
      t = void 0 === a.decimal ? "." : a.decimal + "",
      v =
        void 0 === a.numerals
          ? Me
          : (function (a) {
              return function (e) {
                return e.replace(/[0-9]/g, function (e) {
                  return a[+e];
                });
              };
            })(De.call(a.numerals, String)),
      m = void 0 === a.percent ? "%" : a.percent + "",
      k = void 0 === a.minus ? "−" : a.minus + "",
      c = void 0 === a.nan ? "NaN" : a.nan + "";
    function i(a) {
      var e = (a = de(a)).fill,
        n = a.align,
        i = a.sign,
        o = a.symbol,
        s = a.zero,
        p = a.width,
        f = a.comma,
        h = a.precision,
        b = a.trim,
        y = a.type;
      "n" === y
        ? ((f = !0), (y = "g"))
        : $e[y] || (void 0 === h && (h = 12), (b = !0), (y = "g")),
        (s || ("0" === e && "=" === n)) && ((s = !0), (e = "0"), (n = "="));
      var g =
          "$" === o
            ? u
            : "#" === o && /[boxX]/.test(y)
            ? "0" + y.toLowerCase()
            : "",
        d = "$" === o ? l : /[%p]/.test(y) ? m : "",
        j = $e[y],
        w = /[defgprs%]/.test(y);
      function $(a) {
        var u,
          l,
          m,
          o = g,
          $ = d;
        if ("c" === y) ($ = j(a) + $), (a = "");
        else {
          var M = (a = +a) < 0 || 1 / a < 0;
          if (
            ((a = isNaN(a) ? c : j(Math.abs(a), h)),
            b &&
              (a = (function (a) {
                a: for (var e, n = a.length, r = 1, u = -1; r < n; ++r)
                  switch (a[r]) {
                    case ".":
                      u = e = r;
                      break;
                    case "0":
                      0 === u && (u = r), (e = r);
                      break;
                    default:
                      if (!+a[r]) break a;
                      u > 0 && (u = 0);
                  }
                return u > 0 ? a.slice(0, u) + a.slice(e + 1) : a;
              })(a)),
            M && 0 == +a && "+" !== i && (M = !1),
            (o =
              (M ? ("(" === i ? i : k) : "-" === i || "(" === i ? "" : i) + o),
            ($ =
              ("s" === y ? Ne[8 + ye / 3] : "") +
              $ +
              (M && "(" === i ? ")" : "")),
            w)
          )
            for (u = -1, l = a.length; ++u < l; )
              if (48 > (m = a.charCodeAt(u)) || m > 57) {
                ($ = (46 === m ? t + a.slice(u + 1) : a.slice(u)) + $),
                  (a = a.slice(0, u));
                break;
              }
        }
        f && !s && (a = r(a, 1 / 0));
        var x = o.length + a.length + $.length,
          C = x < p ? new Array(p - x + 1).join(e) : "";
        switch (
          (f &&
            s &&
            ((a = r(C + a, C.length ? p - $.length : 1 / 0)), (C = "")),
          n)
        ) {
          case "<":
            a = o + a + $ + C;
            break;
          case "=":
            a = o + C + a + $;
            break;
          case "^":
            a = C.slice(0, (x = C.length >> 1)) + o + a + $ + C.slice(x);
            break;
          default:
            a = C + o + a + $;
        }
        return v(a);
      }
      return (
        (h =
          void 0 === h
            ? 6
            : /[gprs]/.test(y)
            ? Math.max(1, Math.min(21, h))
            : Math.max(0, Math.min(20, h))),
        ($.toString = function () {
          return a + "";
        }),
        $
      );
    }
    return {
      format: i,
      formatPrefix: function (a, e) {
        var n = i((((a = de(a)).type = "f"), a)),
          r = 3 * Math.max(-8, Math.min(8, Math.floor(be(e) / 3))),
          u = Math.pow(10, -r),
          l = Ne[8 + r / 3];
        return function (a) {
          return n(u * a) + l;
        };
      },
    };
  }
  function Ue(a, e) {
    switch (arguments.length) {
      case 0:
        break;
      case 1:
        this.range(a);
        break;
      default:
        this.range(e).domain(a);
    }
    return this;
  }
  function Ee(a) {
    return +a;
  }
  (xe = Fe({ thousands: ",", grouping: [3], currency: ["$", ""] })),
    (Ce = xe.format),
    (Te = xe.formatPrefix);
  var Ae = [0, 1];
  function _e(a) {
    return a;
  }
  function Se(a, e) {
    return (e -= a = +a)
      ? function (n) {
          return (n - a) / e;
        }
      : ((n = isNaN(e) ? NaN : 0.5),
        function () {
          return n;
        });
    var n;
  }
  function He(a, e, n) {
    var r = a[0],
      u = a[1],
      l = e[0],
      t = e[1];
    return (
      u < r ? ((r = Se(u, r)), (l = n(t, l))) : ((r = Se(r, u)), (l = n(l, t))),
      function (a) {
        return l(r(a));
      }
    );
  }
  function Ye(a, e, n) {
    var r = Math.min(a.length, e.length) - 1,
      u = new Array(r),
      l = new Array(r),
      t = -1;
    for (
      a[r] < a[0] && ((a = a.slice().reverse()), (e = e.slice().reverse()));
      ++t < r;

    )
      (u[t] = Se(a[t], a[t + 1])), (l[t] = n(e[t], e[t + 1]));
    return function (e) {
      var n = pa(a, e, 1, r) - 1;
      return l[n](u[n](e));
    };
  }
  function ze(a, e) {
    return e
      .domain(a.domain())
      .range(a.range())
      .interpolate(a.interpolate())
      .clamp(a.clamp())
      .unknown(a.unknown());
  }
  function Le() {
    var a,
      e,
      n,
      r,
      u,
      l,
      t = Ae,
      v = Ae,
      m = pe,
      k = _e;
    function c() {
      var a,
        e,
        n,
        m = Math.min(t.length, v.length);
      return (
        k !== _e &&
          ((a = t[0]),
          (e = t[m - 1]),
          a > e && ((n = a), (a = e), (e = n)),
          (k = function (n) {
            return Math.max(a, Math.min(e, n));
          })),
        (r = m > 2 ? Ye : He),
        (u = l = null),
        i
      );
    }
    function i(e) {
      return null == e || isNaN((e = +e))
        ? n
        : (u || (u = r(t.map(a), v, m)))(a(k(e)));
    }
    return (
      (i.invert = function (n) {
        return k(e((l || (l = r(v, t.map(a), ke)))(n)));
      }),
      (i.domain = function (a) {
        return arguments.length ? ((t = Array.from(a, Ee)), c()) : t.slice();
      }),
      (i.range = function (a) {
        return arguments.length ? ((v = Array.from(a)), c()) : v.slice();
      }),
      (i.rangeRound = function (a) {
        return (v = Array.from(a)), (m = fe), c();
      }),
      (i.clamp = function (a) {
        return arguments.length ? ((k = !!a || _e), c()) : k !== _e;
      }),
      (i.interpolate = function (a) {
        return arguments.length ? ((m = a), c()) : m;
      }),
      (i.unknown = function (a) {
        return arguments.length ? ((n = a), i) : n;
      }),
      function (n, r) {
        return (a = n), (e = r), c();
      }
    );
  }
  function Oe() {
    return Le()(_e, _e);
  }
  function qe(a, e, n, r) {
    var u,
      l = (function (a, e, n) {
        var r = Math.abs(e - a) / Math.max(0, n),
          u = Math.pow(10, Math.floor(Math.log(r) / Math.LN10)),
          l = r / u;
        return (
          l >= fa ? (u *= 10) : l >= ha ? (u *= 5) : l >= ba && (u *= 2),
          e < a ? -u : u
        );
      })(a, e, n);
    switch ((r = de(null == r ? ",f" : r)).type) {
      case "s":
        var t = Math.max(Math.abs(a), Math.abs(e));
        return (
          null != r.precision ||
            isNaN(
              (u = (function (a, e) {
                return Math.max(
                  0,
                  3 * Math.max(-8, Math.min(8, Math.floor(be(e) / 3))) -
                    be(Math.abs(a))
                );
              })(l, t))
            ) ||
            (r.precision = u),
          Te(r, t)
        );
      case "":
      case "e":
      case "g":
      case "p":
      case "r":
        null != r.precision ||
          isNaN(
            (u = (function (a, e) {
              return (
                (a = Math.abs(a)),
                (e = Math.abs(e) - a),
                Math.max(0, be(e) - be(a)) + 1
              );
            })(l, Math.max(Math.abs(a), Math.abs(e))))
          ) ||
          (r.precision = u - ("e" === r.type));
        break;
      case "f":
      case "%":
        null != r.precision ||
          isNaN(
            (u = (function (a) {
              return Math.max(0, -be(Math.abs(a)));
            })(l))
          ) ||
          (r.precision = u - 2 * ("%" === r.type));
    }
    return Ce(r);
  }
  function Re(a) {
    var e = a.domain;
    return (
      (a.ticks = function (a) {
        var n = e();
        return (function (a, e, n) {
          var r,
            u,
            l,
            t,
            v = -1;
          if (((n = +n), (a = +a) == (e = +e) && n > 0)) return [a];
          if (
            ((r = e < a) && ((u = a), (a = e), (e = u)),
            0 === (t = ya(a, e, n)) || !isFinite(t))
          )
            return [];
          if (t > 0) {
            let n = Math.round(a / t),
              r = Math.round(e / t);
            for (
              n * t < a && ++n,
                r * t > e && --r,
                l = new Array((u = r - n + 1));
              ++v < u;

            )
              l[v] = (n + v) * t;
          } else {
            t = -t;
            let n = Math.round(a * t),
              r = Math.round(e * t);
            for (
              n / t < a && ++n,
                r / t > e && --r,
                l = new Array((u = r - n + 1));
              ++v < u;

            )
              l[v] = (n + v) / t;
          }
          return r && l.reverse(), l;
        })(n[0], n[n.length - 1], null == a ? 10 : a);
      }),
      (a.tickFormat = function (a, n) {
        var r = e();
        return qe(r[0], r[r.length - 1], null == a ? 10 : a, n);
      }),
      (a.nice = function (n) {
        null == n && (n = 10);
        var r,
          u,
          l = e(),
          t = 0,
          v = l.length - 1,
          m = l[t],
          k = l[v],
          c = 10;
        for (
          k < m && ((u = m), (m = k), (k = u), (u = t), (t = v), (v = u));
          c-- > 0;

        ) {
          if ((u = ya(m, k, n)) === r) return (l[t] = m), (l[v] = k), e(l);
          if (u > 0) (m = Math.floor(m / u) * u), (k = Math.ceil(k / u) * u);
          else {
            if (!(u < 0)) break;
            (m = Math.ceil(m * u) / u), (k = Math.floor(k * u) / u);
          }
          r = u;
        }
        return a;
      }),
      a
    );
  }
  function Pe() {
    var a = Oe();
    return (
      (a.copy = function () {
        return ze(a, Pe());
      }),
      Ue.apply(a, arguments),
      Re(a)
    );
  }
  var We = new Date(),
    Be = new Date();
  function Ve(a, e, n, r) {
    function u(e) {
      return a((e = 0 === arguments.length ? new Date() : new Date(+e))), e;
    }
    return (
      (u.floor = function (e) {
        return a((e = new Date(+e))), e;
      }),
      (u.ceil = function (n) {
        return a((n = new Date(n - 1))), e(n, 1), a(n), n;
      }),
      (u.round = function (a) {
        var e = u(a),
          n = u.ceil(a);
        return a - e < n - a ? e : n;
      }),
      (u.offset = function (a, n) {
        return e((a = new Date(+a)), null == n ? 1 : Math.floor(n)), a;
      }),
      (u.range = function (n, r, l) {
        var t,
          v = [];
        if (
          ((n = u.ceil(n)),
          (l = null == l ? 1 : Math.floor(l)),
          !(n < r && l > 0))
        )
          return v;
        do {
          v.push((t = new Date(+n))), e(n, l), a(n);
        } while (t < n && n < r);
        return v;
      }),
      (u.filter = function (n) {
        return Ve(
          function (e) {
            if (e >= e) for (; a(e), !n(e); ) e.setTime(e - 1);
          },
          function (a, r) {
            if (a >= a)
              if (r < 0) for (; ++r <= 0; ) for (; e(a, -1), !n(a); );
              else for (; --r >= 0; ) for (; e(a, 1), !n(a); );
          }
        );
      }),
      n &&
        ((u.count = function (e, r) {
          return (
            We.setTime(+e), Be.setTime(+r), a(We), a(Be), Math.floor(n(We, Be))
          );
        }),
        (u.every = function (a) {
          return (
            (a = Math.floor(a)),
            isFinite(a) && a > 0
              ? a > 1
                ? u.filter(
                    r
                      ? function (e) {
                          return r(e) % a == 0;
                        }
                      : function (e) {
                          return u.count(0, e) % a == 0;
                        }
                  )
                : u
              : null
          );
        })),
      u
    );
  }
  const Ze = 6e4,
    Ie = 864e5,
    Xe = 6048e5;
  var Ke = Ve(
    (a) => a.setHours(0, 0, 0, 0),
    (a, e) => a.setDate(a.getDate() + e),
    (a, e) =>
      (e - a - (e.getTimezoneOffset() - a.getTimezoneOffset()) * Ze) / Ie,
    (a) => a.getDate() - 1
  );
  function Ge(a) {
    return Ve(
      function (e) {
        e.setDate(e.getDate() - ((e.getDay() + 7 - a) % 7)),
          e.setHours(0, 0, 0, 0);
      },
      function (a, e) {
        a.setDate(a.getDate() + 7 * e);
      },
      function (a, e) {
        return (
          (e - a - (e.getTimezoneOffset() - a.getTimezoneOffset()) * Ze) / Xe
        );
      }
    );
  }
  var Je = Ge(0),
    Qe = Ge(1);
  Ge(2), Ge(3);
  var an = Ge(4);
  Ge(5), Ge(6);
  var en = Ve(
    function (a) {
      a.setMonth(0, 1), a.setHours(0, 0, 0, 0);
    },
    function (a, e) {
      a.setFullYear(a.getFullYear() + e);
    },
    function (a, e) {
      return e.getFullYear() - a.getFullYear();
    },
    function (a) {
      return a.getFullYear();
    }
  );
  en.every = function (a) {
    return isFinite((a = Math.floor(a))) && a > 0
      ? Ve(
          function (e) {
            e.setFullYear(Math.floor(e.getFullYear() / a) * a),
              e.setMonth(0, 1),
              e.setHours(0, 0, 0, 0);
          },
          function (e, n) {
            e.setFullYear(e.getFullYear() + n * a);
          }
        )
      : null;
  };
  var nn = Ve(
    function (a) {
      a.setUTCHours(0, 0, 0, 0);
    },
    function (a, e) {
      a.setUTCDate(a.getUTCDate() + e);
    },
    function (a, e) {
      return (e - a) / Ie;
    },
    function (a) {
      return a.getUTCDate() - 1;
    }
  );
  function rn(a) {
    return Ve(
      function (e) {
        e.setUTCDate(e.getUTCDate() - ((e.getUTCDay() + 7 - a) % 7)),
          e.setUTCHours(0, 0, 0, 0);
      },
      function (a, e) {
        a.setUTCDate(a.getUTCDate() + 7 * e);
      },
      function (a, e) {
        return (e - a) / Xe;
      }
    );
  }
  var un = rn(0),
    ln = rn(1);
  rn(2), rn(3);
  var tn = rn(4);
  rn(5), rn(6);
  var vn = Ve(
    function (a) {
      a.setUTCMonth(0, 1), a.setUTCHours(0, 0, 0, 0);
    },
    function (a, e) {
      a.setUTCFullYear(a.getUTCFullYear() + e);
    },
    function (a, e) {
      return e.getUTCFullYear() - a.getUTCFullYear();
    },
    function (a) {
      return a.getUTCFullYear();
    }
  );
  function mn(a) {
    if (0 <= a.y && a.y < 100) {
      var e = new Date(-1, a.m, a.d, a.H, a.M, a.S, a.L);
      return e.setFullYear(a.y), e;
    }
    return new Date(a.y, a.m, a.d, a.H, a.M, a.S, a.L);
  }
  function kn(a) {
    if (0 <= a.y && a.y < 100) {
      var e = new Date(Date.UTC(-1, a.m, a.d, a.H, a.M, a.S, a.L));
      return e.setUTCFullYear(a.y), e;
    }
    return new Date(Date.UTC(a.y, a.m, a.d, a.H, a.M, a.S, a.L));
  }
  function cn(a, e, n) {
    return { y: a, m: e, d: n, H: 0, M: 0, S: 0, L: 0 };
  }
  vn.every = function (a) {
    return isFinite((a = Math.floor(a))) && a > 0
      ? Ve(
          function (e) {
            e.setUTCFullYear(Math.floor(e.getUTCFullYear() / a) * a),
              e.setUTCMonth(0, 1),
              e.setUTCHours(0, 0, 0, 0);
          },
          function (e, n) {
            e.setUTCFullYear(e.getUTCFullYear() + n * a);
          }
        )
      : null;
  };
  var on,
    sn,
    pn = { "-": "", _: " ", 0: "0" },
    fn = /^\s*\d+/,
    hn = /^%/,
    bn = /[\\^$*+?|[\]().{}]/g;
  function yn(a, e, n) {
    var r = a < 0 ? "-" : "",
      u = (r ? -a : a) + "",
      l = u.length;
    return r + (l < n ? new Array(n - l + 1).join(e) + u : u);
  }
  function gn(a) {
    return a.replace(bn, "\\$&");
  }
  function dn(a) {
    return new RegExp("^(?:" + a.map(gn).join("|") + ")", "i");
  }
  function jn(a) {
    return new Map(a.map((a, e) => [a.toLowerCase(), e]));
  }
  function wn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 1));
    return r ? ((a.w = +r[0]), n + r[0].length) : -1;
  }
  function $n(a, e, n) {
    var r = fn.exec(e.slice(n, n + 1));
    return r ? ((a.u = +r[0]), n + r[0].length) : -1;
  }
  function Mn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.U = +r[0]), n + r[0].length) : -1;
  }
  function xn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.V = +r[0]), n + r[0].length) : -1;
  }
  function Cn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.W = +r[0]), n + r[0].length) : -1;
  }
  function Tn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 4));
    return r ? ((a.y = +r[0]), n + r[0].length) : -1;
  }
  function Dn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r
      ? ((a.y = +r[0] + (+r[0] > 68 ? 1900 : 2e3)), n + r[0].length)
      : -1;
  }
  function Nn(a, e, n) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(n, n + 6));
    return r
      ? ((a.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), n + r[0].length)
      : -1;
  }
  function Fn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 1));
    return r ? ((a.q = 3 * r[0] - 3), n + r[0].length) : -1;
  }
  function Un(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.m = r[0] - 1), n + r[0].length) : -1;
  }
  function En(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.d = +r[0]), n + r[0].length) : -1;
  }
  function An(a, e, n) {
    var r = fn.exec(e.slice(n, n + 3));
    return r ? ((a.m = 0), (a.d = +r[0]), n + r[0].length) : -1;
  }
  function _n(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.H = +r[0]), n + r[0].length) : -1;
  }
  function Sn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.M = +r[0]), n + r[0].length) : -1;
  }
  function Hn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 2));
    return r ? ((a.S = +r[0]), n + r[0].length) : -1;
  }
  function Yn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 3));
    return r ? ((a.L = +r[0]), n + r[0].length) : -1;
  }
  function zn(a, e, n) {
    var r = fn.exec(e.slice(n, n + 6));
    return r ? ((a.L = Math.floor(r[0] / 1e3)), n + r[0].length) : -1;
  }
  function Ln(a, e, n) {
    var r = hn.exec(e.slice(n, n + 1));
    return r ? n + r[0].length : -1;
  }
  function On(a, e, n) {
    var r = fn.exec(e.slice(n));
    return r ? ((a.Q = +r[0]), n + r[0].length) : -1;
  }
  function qn(a, e, n) {
    var r = fn.exec(e.slice(n));
    return r ? ((a.s = +r[0]), n + r[0].length) : -1;
  }
  function Rn(a, e) {
    return yn(a.getDate(), e, 2);
  }
  function Pn(a, e) {
    return yn(a.getHours(), e, 2);
  }
  function Wn(a, e) {
    return yn(a.getHours() % 12 || 12, e, 2);
  }
  function Bn(a, e) {
    return yn(1 + Ke.count(en(a), a), e, 3);
  }
  function Vn(a, e) {
    return yn(a.getMilliseconds(), e, 3);
  }
  function Zn(a, e) {
    return Vn(a, e) + "000";
  }
  function In(a, e) {
    return yn(a.getMonth() + 1, e, 2);
  }
  function Xn(a, e) {
    return yn(a.getMinutes(), e, 2);
  }
  function Kn(a, e) {
    return yn(a.getSeconds(), e, 2);
  }
  function Gn(a) {
    var e = a.getDay();
    return 0 === e ? 7 : e;
  }
  function Jn(a, e) {
    return yn(Je.count(en(a) - 1, a), e, 2);
  }
  function Qn(a) {
    var e = a.getDay();
    return e >= 4 || 0 === e ? an(a) : an.ceil(a);
  }
  function ar(a, e) {
    return (a = Qn(a)), yn(an.count(en(a), a) + (4 === en(a).getDay()), e, 2);
  }
  function er(a) {
    return a.getDay();
  }
  function nr(a, e) {
    return yn(Qe.count(en(a) - 1, a), e, 2);
  }
  function rr(a, e) {
    return yn(a.getFullYear() % 100, e, 2);
  }
  function ur(a, e) {
    return yn((a = Qn(a)).getFullYear() % 100, e, 2);
  }
  function lr(a, e) {
    return yn(a.getFullYear() % 1e4, e, 4);
  }
  function tr(a, e) {
    var n = a.getDay();
    return yn(
      (a = n >= 4 || 0 === n ? an(a) : an.ceil(a)).getFullYear() % 1e4,
      e,
      4
    );
  }
  function vr(a) {
    var e = a.getTimezoneOffset();
    return (
      (e > 0 ? "-" : ((e *= -1), "+")) +
      yn((e / 60) | 0, "0", 2) +
      yn(e % 60, "0", 2)
    );
  }
  function mr(a, e) {
    return yn(a.getUTCDate(), e, 2);
  }
  function kr(a, e) {
    return yn(a.getUTCHours(), e, 2);
  }
  function cr(a, e) {
    return yn(a.getUTCHours() % 12 || 12, e, 2);
  }
  function ir(a, e) {
    return yn(1 + nn.count(vn(a), a), e, 3);
  }
  function or(a, e) {
    return yn(a.getUTCMilliseconds(), e, 3);
  }
  function sr(a, e) {
    return or(a, e) + "000";
  }
  function pr(a, e) {
    return yn(a.getUTCMonth() + 1, e, 2);
  }
  function fr(a, e) {
    return yn(a.getUTCMinutes(), e, 2);
  }
  function hr(a, e) {
    return yn(a.getUTCSeconds(), e, 2);
  }
  function br(a) {
    var e = a.getUTCDay();
    return 0 === e ? 7 : e;
  }
  function yr(a, e) {
    return yn(un.count(vn(a) - 1, a), e, 2);
  }
  function gr(a) {
    var e = a.getUTCDay();
    return e >= 4 || 0 === e ? tn(a) : tn.ceil(a);
  }
  function dr(a, e) {
    return (
      (a = gr(a)), yn(tn.count(vn(a), a) + (4 === vn(a).getUTCDay()), e, 2)
    );
  }
  function jr(a) {
    return a.getUTCDay();
  }
  function wr(a, e) {
    return yn(ln.count(vn(a) - 1, a), e, 2);
  }
  function $r(a, e) {
    return yn(a.getUTCFullYear() % 100, e, 2);
  }
  function Mr(a, e) {
    return yn((a = gr(a)).getUTCFullYear() % 100, e, 2);
  }
  function xr(a, e) {
    return yn(a.getUTCFullYear() % 1e4, e, 4);
  }
  function Cr(a, e) {
    var n = a.getUTCDay();
    return yn(
      (a = n >= 4 || 0 === n ? tn(a) : tn.ceil(a)).getUTCFullYear() % 1e4,
      e,
      4
    );
  }
  function Tr() {
    return "+0000";
  }
  function Dr() {
    return "%";
  }
  function Nr(a) {
    return +a;
  }
  function Fr(a) {
    return Math.floor(+a / 1e3);
  }
  !(function (a) {
    (on = (function (a) {
      var e = a.dateTime,
        n = a.date,
        r = a.time,
        u = a.periods,
        l = a.days,
        t = a.shortDays,
        v = a.months,
        m = a.shortMonths,
        k = dn(u),
        c = jn(u),
        i = dn(l),
        o = jn(l),
        s = dn(t),
        p = jn(t),
        f = dn(v),
        h = jn(v),
        b = dn(m),
        y = jn(m),
        g = {
          a: function (a) {
            return t[a.getDay()];
          },
          A: function (a) {
            return l[a.getDay()];
          },
          b: function (a) {
            return m[a.getMonth()];
          },
          B: function (a) {
            return v[a.getMonth()];
          },
          c: null,
          d: Rn,
          e: Rn,
          f: Zn,
          g: ur,
          G: tr,
          H: Pn,
          I: Wn,
          j: Bn,
          L: Vn,
          m: In,
          M: Xn,
          p: function (a) {
            return u[+(a.getHours() >= 12)];
          },
          q: function (a) {
            return 1 + ~~(a.getMonth() / 3);
          },
          Q: Nr,
          s: Fr,
          S: Kn,
          u: Gn,
          U: Jn,
          V: ar,
          w: er,
          W: nr,
          x: null,
          X: null,
          y: rr,
          Y: lr,
          Z: vr,
          "%": Dr,
        },
        d = {
          a: function (a) {
            return t[a.getUTCDay()];
          },
          A: function (a) {
            return l[a.getUTCDay()];
          },
          b: function (a) {
            return m[a.getUTCMonth()];
          },
          B: function (a) {
            return v[a.getUTCMonth()];
          },
          c: null,
          d: mr,
          e: mr,
          f: sr,
          g: Mr,
          G: Cr,
          H: kr,
          I: cr,
          j: ir,
          L: or,
          m: pr,
          M: fr,
          p: function (a) {
            return u[+(a.getUTCHours() >= 12)];
          },
          q: function (a) {
            return 1 + ~~(a.getUTCMonth() / 3);
          },
          Q: Nr,
          s: Fr,
          S: hr,
          u: br,
          U: yr,
          V: dr,
          w: jr,
          W: wr,
          x: null,
          X: null,
          y: $r,
          Y: xr,
          Z: Tr,
          "%": Dr,
        },
        j = {
          a: function (a, e, n) {
            var r = s.exec(e.slice(n));
            return r
              ? ((a.w = p.get(r[0].toLowerCase())), n + r[0].length)
              : -1;
          },
          A: function (a, e, n) {
            var r = i.exec(e.slice(n));
            return r
              ? ((a.w = o.get(r[0].toLowerCase())), n + r[0].length)
              : -1;
          },
          b: function (a, e, n) {
            var r = b.exec(e.slice(n));
            return r
              ? ((a.m = y.get(r[0].toLowerCase())), n + r[0].length)
              : -1;
          },
          B: function (a, e, n) {
            var r = f.exec(e.slice(n));
            return r
              ? ((a.m = h.get(r[0].toLowerCase())), n + r[0].length)
              : -1;
          },
          c: function (a, n, r) {
            return M(a, e, n, r);
          },
          d: En,
          e: En,
          f: zn,
          g: Dn,
          G: Tn,
          H: _n,
          I: _n,
          j: An,
          L: Yn,
          m: Un,
          M: Sn,
          p: function (a, e, n) {
            var r = k.exec(e.slice(n));
            return r
              ? ((a.p = c.get(r[0].toLowerCase())), n + r[0].length)
              : -1;
          },
          q: Fn,
          Q: On,
          s: qn,
          S: Hn,
          u: $n,
          U: Mn,
          V: xn,
          w: wn,
          W: Cn,
          x: function (a, e, r) {
            return M(a, n, e, r);
          },
          X: function (a, e, n) {
            return M(a, r, e, n);
          },
          y: Dn,
          Y: Tn,
          Z: Nn,
          "%": Ln,
        };
      function w(a, e) {
        return function (n) {
          var r,
            u,
            l,
            t = [],
            v = -1,
            m = 0,
            k = a.length;
          for (n instanceof Date || (n = new Date(+n)); ++v < k; )
            37 === a.charCodeAt(v) &&
              (t.push(a.slice(m, v)),
              null != (u = pn[(r = a.charAt(++v))])
                ? (r = a.charAt(++v))
                : (u = "e" === r ? " " : "0"),
              (l = e[r]) && (r = l(n, u)),
              t.push(r),
              (m = v + 1));
          return t.push(a.slice(m, v)), t.join("");
        };
      }
      function $(a, e) {
        return function (n) {
          var r,
            u,
            l = cn(1900, void 0, 1);
          if (M(l, a, (n += ""), 0) != n.length) return null;
          if ("Q" in l) return new Date(l.Q);
          if ("s" in l) return new Date(1e3 * l.s + ("L" in l ? l.L : 0));
          if (
            (e && !("Z" in l) && (l.Z = 0),
            "p" in l && (l.H = (l.H % 12) + 12 * l.p),
            void 0 === l.m && (l.m = "q" in l ? l.q : 0),
            "V" in l)
          ) {
            if (l.V < 1 || l.V > 53) return null;
            "w" in l || (l.w = 1),
              "Z" in l
                ? ((u = (r = kn(cn(l.y, 0, 1))).getUTCDay()),
                  (r = u > 4 || 0 === u ? ln.ceil(r) : ln(r)),
                  (r = nn.offset(r, 7 * (l.V - 1))),
                  (l.y = r.getUTCFullYear()),
                  (l.m = r.getUTCMonth()),
                  (l.d = r.getUTCDate() + ((l.w + 6) % 7)))
                : ((u = (r = mn(cn(l.y, 0, 1))).getDay()),
                  (r = u > 4 || 0 === u ? Qe.ceil(r) : Qe(r)),
                  (r = Ke.offset(r, 7 * (l.V - 1))),
                  (l.y = r.getFullYear()),
                  (l.m = r.getMonth()),
                  (l.d = r.getDate() + ((l.w + 6) % 7)));
          } else
            ("W" in l || "U" in l) &&
              ("w" in l || (l.w = "u" in l ? l.u % 7 : "W" in l ? 1 : 0),
              (u =
                "Z" in l
                  ? kn(cn(l.y, 0, 1)).getUTCDay()
                  : mn(cn(l.y, 0, 1)).getDay()),
              (l.m = 0),
              (l.d =
                "W" in l
                  ? ((l.w + 6) % 7) + 7 * l.W - ((u + 5) % 7)
                  : l.w + 7 * l.U - ((u + 6) % 7)));
          return "Z" in l
            ? ((l.H += (l.Z / 100) | 0), (l.M += l.Z % 100), kn(l))
            : mn(l);
        };
      }
      function M(a, e, n, r) {
        for (var u, l, t = 0, v = e.length, m = n.length; t < v; ) {
          if (r >= m) return -1;
          if (37 === (u = e.charCodeAt(t++))) {
            if (
              ((u = e.charAt(t++)),
              !(l = j[u in pn ? e.charAt(t++) : u]) || (r = l(a, n, r)) < 0)
            )
              return -1;
          } else if (u != n.charCodeAt(r++)) return -1;
        }
        return r;
      }
      return (
        (g.x = w(n, g)),
        (g.X = w(r, g)),
        (g.c = w(e, g)),
        (d.x = w(n, d)),
        (d.X = w(r, d)),
        (d.c = w(e, d)),
        {
          format: function (a) {
            var e = w((a += ""), g);
            return (
              (e.toString = function () {
                return a;
              }),
              e
            );
          },
          parse: function (a) {
            var e = $((a += ""), !1);
            return (
              (e.toString = function () {
                return a;
              }),
              e
            );
          },
          utcFormat: function (a) {
            var e = w((a += ""), d);
            return (
              (e.toString = function () {
                return a;
              }),
              e
            );
          },
          utcParse: function (a) {
            var e = $((a += ""), !0);
            return (
              (e.toString = function () {
                return a;
              }),
              e
            );
          },
        }
      );
    })(a)).format,
      (sn = on.parse),
      on.utcFormat,
      on.utcParse;
  })({
    dateTime: "%x, %X",
    date: "%-m/%-d/%Y",
    time: "%-I:%M:%S %p",
    periods: ["AM", "PM"],
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  });
  const Ur = [];
  function Er(e, n = a) {
    let r;
    const u = [];
    function l(a) {
      if (v(e, a) && ((e = a), r)) {
        const a = !Ur.length;
        for (let a = 0; a < u.length; a += 1) {
          const n = u[a];
          n[1](), Ur.push(n, e);
        }
        if (a) {
          for (let a = 0; a < Ur.length; a += 2) Ur[a][0](Ur[a + 1]);
          Ur.length = 0;
        }
      }
    }
    return {
      set: l,
      update: function (a) {
        l(a(e));
      },
      subscribe: function (t, v = a) {
        const m = [t, v];
        return (
          u.push(m),
          1 === u.length && (r = n(l) || a),
          t(e),
          () => {
            const a = u.indexOf(m);
            -1 !== a && u.splice(a, 1), 0 === u.length && (r(), (r = null));
          }
        );
      },
    };
  }
  function Ar(a) {
    return "[object Date]" === Object.prototype.toString.call(a);
  }
  function _r(a, e) {
    if (a === e || a != a) return () => a;
    const n = typeof a;
    if (n !== typeof e || Array.isArray(a) !== Array.isArray(e))
      throw new Error("Cannot interpolate values of different type");
    if (Array.isArray(a)) {
      const n = e.map((e, n) => _r(a[n], e));
      return (a) => n.map((e) => e(a));
    }
    if ("object" === n) {
      if (!a || !e) throw new Error("Object cannot be null");
      if (Ar(a) && Ar(e)) {
        a = a.getTime();
        const n = (e = e.getTime()) - a;
        return (e) => new Date(a + e * n);
      }
      const n = Object.keys(e),
        r = {};
      return (
        n.forEach((n) => {
          r[n] = _r(a[n], e[n]);
        }),
        (a) => {
          const e = {};
          return (
            n.forEach((n) => {
              e[n] = r[n](a);
            }),
            e
          );
        }
      );
    }
    if ("number" === n) {
      const n = e - a;
      return (e) => a + e * n;
    }
    throw new Error(`Cannot interpolate ${n} values`);
  }
  function Sr(a, r = {}) {
    const u = Er(a);
    let l,
      t = a;
    function v(v, m) {
      if (null == a) return u.set((a = v)), Promise.resolve();
      t = v;
      let k = l,
        i = !1,
        {
          delay: o = 0,
          duration: s = 400,
          easing: f = e,
          interpolate: h = _r,
        } = n(n({}, r), m);
      if (0 === s)
        return k && (k.abort(), (k = null)), u.set((a = t)), Promise.resolve();
      const b = c() + o;
      let y;
      return (
        (l = p((e) => {
          if (e < b) return !0;
          i ||
            ((y = h(a, v)), "function" == typeof s && (s = s(a, v)), (i = !0)),
            k && (k.abort(), (k = null));
          const n = e - b;
          return n > s ? (u.set((a = v)), !1) : (u.set((a = y(f(n / s)))), !0);
        })),
        l.promise
      );
    }
    return { set: v, update: (e, n) => v(e(t, a), n), subscribe: u.subscribe };
  }
  let Hr, Yr;
  const zr = Er(0),
    Lr = (a) => {
      Yr || (Yr = a);
      const e = Math.round(a - Yr);
      (Yr = a),
        zr.update((a) => a + e),
        (Hr = window.requestAnimationFrame(Lr));
    },
    Or = {
      start() {
        "undefined" != typeof window &&
          (Hr || ((Yr = null), (Hr = window.requestAnimationFrame(Lr))));
      },
      stop() {
        "undefined" != typeof window &&
          Hr &&
          (window.cancelAnimationFrame(Hr), (Hr = null));
      },
      toggle() {
        Hr ? Or.stop() : Or.start();
      },
      set(a) {
        "number" == typeof a && zr.set(a);
      },
      reset() {
        Or.set(0);
      },
    };
  function qr(e) {
    let n, r, u, t, v, m, k, c;
    return {
      c() {
        (n = y("div")),
          (r = y("button")),
          (r.textContent = "play"),
          (u = d()),
          (t = y("button")),
          (t.textContent = "pause"),
          (v = d()),
          (m = y("button")),
          (m.textContent = "reset"),
          $(r, "class", "svelte-13ailmo"),
          $(t, "class", "svelte-13ailmo"),
          $(m, "class", "svelte-13ailmo"),
          $(n, "class", "svelte-13ailmo");
      },
      m(a, l) {
        h(a, n, l),
          f(n, r),
          f(n, u),
          f(n, t),
          f(n, v),
          f(n, m),
          k ||
            ((c = [
              w(r, "click", e[6]),
              w(t, "click", e[7]),
              w(m, "click", e[1]),
            ]),
            (k = !0));
      },
      p: a,
      i: a,
      o: a,
      d(a) {
        a && b(n), (k = !1), l(c);
      },
    };
  }
  function Rr(a, e, n) {
    let r;
    m(a, zr, (a) => n(5, (r = a)));
    let { currentKeyframe: u = 0 } = e,
      { keyframeCount: l = 0 } = e,
      { duration: t = 1e3 } = e,
      { isEnabled: v = !1 } = e;
    const k = (function () {
      const a = S();
      return (e, n) => {
        const r = a.$$.callbacks[e];
        if (r) {
          const u = D(e, n);
          r.slice().forEach((e) => {
            e.call(a, u);
          });
        }
      };
    })();
    return (
      (a.$$set = (a) => {
        "currentKeyframe" in a && n(2, (u = a.currentKeyframe)),
          "keyframeCount" in a && n(3, (l = a.keyframeCount)),
          "duration" in a && n(4, (t = a.duration)),
          "isEnabled" in a && n(0, (v = a.isEnabled));
      }),
      (a.$$.update = () => {
        49 & a.$$.dirty && v && n(2, (u = Math.floor(r / t))),
          12 & a.$$.dirty && u === l && k("end"),
          1 & a.$$.dirty && (v ? Or.start() : Or.stop());
      }),
      [
        v,
        () => {
          n(2, (u = 0)), Or.reset();
        },
        u,
        l,
        t,
        r,
        () => n(0, (v = !0)),
        () => n(0, (v = !1)),
      ]
    );
  }
  class Pr extends ia {
    constructor(a) {
      super(),
        ca(this, a, Rr, qr, v, {
          currentKeyframe: 2,
          keyframeCount: 3,
          duration: 4,
          isEnabled: 0,
        });
    }
  }
  function Wr(e) {
    let n, r;
    return {
      c() {
        (n = y("div")),
          $(n, "style", (r = e[1] + " " + e[2] + " " + e[0] + " " + e[3])),
          $(n, "class", "svelte-18ofpc0");
      },
      m(a, e) {
        h(a, n, e);
      },
      p(a, [e]) {
        15 & e &&
          r !== (r = a[1] + " " + a[2] + " " + a[0] + " " + a[3]) &&
          $(n, "style", r);
      },
      i: a,
      o: a,
      d(a) {
        a && b(n);
      },
    };
  }
  function Br(a, e, n) {
    let r, u, l, t, v, k, c;
    const { scales: i, dimensions: o } = H("Chart");
    m(a, i, (a) => n(9, (k = a))), m(a, o, (a) => n(11, (c = a)));
    let { value: s } = e,
      { rank: p } = e,
      { fill: f } = e;
    return (
      (a.$$set = (a) => {
        "value" in a && n(6, (s = a.value)),
          "rank" in a && n(7, (p = a.rank)),
          "fill" in a && n(8, (f = a.fill));
      }),
      (a.$$.update = () => {
        576 & a.$$.dirty && n(0, (r = k.x(s) || 0)),
          2688 & a.$$.dirty && n(10, (u = (k.y(p) || 0) + c.barMargin / 2)),
          256 & a.$$.dirty && n(1, (l = `--bar-color: ${f}88;`)),
          1024 & a.$$.dirty && n(2, (t = `transform: translateY(${u}px);`)),
          1 & a.$$.dirty && n(0, (r = `width: ${r - 4}px;`)),
          2048 & a.$$.dirty && n(3, (v = `height: ${c.barHeight || 0}px;`));
      }),
      [r, l, t, v, i, o, s, p, f, k, u, c]
    );
  }
  class Vr extends ia {
    constructor(a) {
      super(), ca(this, a, Br, Wr, v, { value: 6, rank: 7, fill: 8 });
    }
  }
  var Zr = [
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
    "#7EFFF5",
    "#4e79a7",
    "#f28e2c",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc949",
    "#af7aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ab",
  ];
  function Ir(a, e, n) {
    const r = a.slice();
    return (r[4] = e[n].value), (r[5] = e[n].rank), (r[7] = n), r;
  }
  function Xr(a) {
    let e, n;
    return (
      (e = new Vr({
        props: { value: a[4], rank: a[5], fill: Zr[a[7] % a[3]] },
      })),
      {
        c() {
          ta(e.$$.fragment);
        },
        m(a, r) {
          va(e, a, r), (n = !0);
        },
        p(a, n) {
          const r = {};
          2 & n && (r.value = a[4]),
            2 & n && (r.rank = a[5]),
            2 & n && (r.fill = Zr[a[7] % a[3]]),
            e.$set(r);
        },
        i(a) {
          n || (aa(e.$$.fragment, a), (n = !0));
        },
        o(a) {
          ea(e.$$.fragment, a), (n = !1);
        },
        d(a) {
          ma(e, a);
        },
      }
    );
  }
  function Kr(a, e) {
    let n,
      r,
      u,
      l = e[5] < e[0] && Xr(e);
    return {
      key: a,
      first: null,
      c() {
        (n = j()), l && l.c(), (r = j()), (this.first = n);
      },
      m(a, e) {
        h(a, n, e), l && l.m(a, e), h(a, r, e), (u = !0);
      },
      p(a, n) {
        (e = a)[5] < e[0]
          ? l
            ? (l.p(e, n), 3 & n && aa(l, 1))
            : ((l = Xr(e)), l.c(), aa(l, 1), l.m(r.parentNode, r))
          : l &&
            (J(),
            ea(l, 1, 1, () => {
              l = null;
            }),
            Q());
      },
      i(a) {
        u || (aa(l), (u = !0));
      },
      o(a) {
        ea(l), (u = !1);
      },
      d(a) {
        a && b(n), l && l.d(a), a && b(r);
      },
    };
  }
  function Gr(a) {
    let e,
      n,
      r = [],
      u = new Map(),
      l = a[1];
    const t = (a) => a[7];
    for (let e = 0; e < l.length; e += 1) {
      let n = Ir(a, l, e),
        v = t(n);
      u.set(v, (r[e] = Kr(v, n)));
    }
    return {
      c() {
        for (let a = 0; a < r.length; a += 1) r[a].c();
        e = j();
      },
      m(a, u) {
        for (let e = 0; e < r.length; e += 1) r[e].m(a, u);
        h(a, e, u), (n = !0);
      },
      p(a, [n]) {
        11 & n &&
          ((l = a[1]),
          J(),
          (r = la(r, n, t, 1, a, l, u, e.parentNode, ua, Kr, e, Ir)),
          Q());
      },
      i(a) {
        if (!n) {
          for (let a = 0; a < l.length; a += 1) aa(r[a]);
          n = !0;
        }
      },
      o(a) {
        for (let a = 0; a < r.length; a += 1) ea(r[a]);
        n = !1;
      },
      d(a) {
        for (let e = 0; e < r.length; e += 1) r[e].d(a);
        a && b(e);
      },
    };
  }
  function Jr(a, e, n) {
    let r;
    const { data: u } = H("Chart");
    m(a, u, (a) => n(1, (r = a)));
    const l = Zr.length;
    let { barCount: t } = e;
    return (
      (a.$$set = (a) => {
        "barCount" in a && n(0, (t = a.barCount));
      }),
      [t, r, u, l]
    );
  }
  class Qr extends ia {
    constructor(a) {
      super(), ca(this, a, Jr, Gr, v, { barCount: 0 });
    }
  }
  function au(a, { delay: n = 0, duration: r = 400, easing: u = e } = {}) {
    const l = +getComputedStyle(a).opacity;
    return {
      delay: n,
      duration: r,
      easing: u,
      css: (a) => "opacity: " + a * l,
    };
  }
  function eu(a) {
    let e, n, r, u, l, t, v;
    return {
      c() {
        (e = y("div")),
          (n = y("div")),
          (r = d()),
          (u = y("p")),
          (l = g(a[1])),
          $(n, "class", "line svelte-rmzpe0"),
          $(u, "class", "value svelte-rmzpe0"),
          $(e, "class", "tick svelte-rmzpe0"),
          x(e, "transform", "translate(" + a[0] + "px, 0)");
      },
      m(a, t) {
        h(a, e, t), f(e, n), f(e, r), f(e, u), f(u, l), (v = !0);
      },
      p(n, [r]) {
        (a = n),
          (!v || 2 & r) && M(l, a[1]),
          (!v || 1 & r) && x(e, "transform", "translate(" + a[0] + "px, 0)");
      },
      i(a) {
        v ||
          (P(() => {
            t || (t = ra(e, au, { duration: nu }, !0)), t.run(1);
          }),
          (v = !0));
      },
      o(a) {
        t || (t = ra(e, au, { duration: nu }, !1)), t.run(0), (v = !1);
      },
      d(a) {
        a && b(e), a && t && t.end();
      },
    };
  }
  const nu = 250;
  function ru(a, e, n) {
    let r,
      { value: u } = e,
      { x: l } = e;
    return (
      (a.$$set = (a) => {
        "value" in a && n(2, (u = a.value)), "x" in a && n(0, (l = a.x));
      }),
      (a.$$.update = () => {
        var e;
        4 & a.$$.dirty && n(1, ((e = u), (r = Ce(",.0f")(100 * e) + "%")));
      }),
      [l, r, u]
    );
  }
  class uu extends ia {
    constructor(a) {
      super(), ca(this, a, ru, eu, v, { value: 2, x: 0 });
    }
  }
  function lu(a, e, n) {
    const r = a.slice();
    return (r[4] = e[n]), r;
  }
  function tu(a, e) {
    let n, r, u;
    return (
      (r = new uu({ props: { x: e[0].x(e[4]), value: e[4] } })),
      {
        key: a,
        first: null,
        c() {
          (n = j()), ta(r.$$.fragment), (this.first = n);
        },
        m(a, e) {
          h(a, n, e), va(r, a, e), (u = !0);
        },
        p(a, n) {
          e = a;
          const u = {};
          3 & n && (u.x = e[0].x(e[4])), 2 & n && (u.value = e[4]), r.$set(u);
        },
        i(a) {
          u || (aa(r.$$.fragment, a), (u = !0));
        },
        o(a) {
          ea(r.$$.fragment, a), (u = !1);
        },
        d(a) {
          a && b(n), ma(r, a);
        },
      }
    );
  }
  function vu(a) {
    let e,
      n,
      r = [],
      u = new Map(),
      l = a[1];
    const t = (a) => a[4];
    for (let e = 0; e < l.length; e += 1) {
      let n = lu(a, l, e),
        v = t(n);
      u.set(v, (r[e] = tu(v, n)));
    }
    return {
      c() {
        for (let a = 0; a < r.length; a += 1) r[a].c();
        e = j();
      },
      m(a, u) {
        for (let e = 0; e < r.length; e += 1) r[e].m(a, u);
        h(a, e, u), (n = !0);
      },
      p(a, [n]) {
        3 & n &&
          ((l = a[1]),
          J(),
          (r = la(r, n, t, 1, a, l, u, e.parentNode, ua, tu, e, lu)),
          Q());
      },
      i(a) {
        if (!n) {
          for (let a = 0; a < l.length; a += 1) aa(r[a]);
          n = !0;
        }
      },
      o(a) {
        for (let a = 0; a < r.length; a += 1) ea(r[a]);
        n = !1;
      },
      d(a) {
        for (let e = 0; e < r.length; e += 1) r[e].d(a);
        a && b(e);
      },
    };
  }
  function mu(a, e, n) {
    let r, u;
    const { scales: l, dimensions: t } = H("Chart");
    return (
      m(a, l, (a) => n(0, (u = a))),
      (a.$$.update = () => {
        1 & a.$$.dirty && n(1, (r = u.x.ticks(5).slice(1)));
      }),
      [u, r, l]
    );
  }
  class ku extends ia {
    constructor(a) {
      super(), ca(this, a, mu, vu, v, {});
    }
  }
  function cu(e) {
    let n,
      r,
      u,
      l,
      t,
      v,
      m,
      k = e[5][e[1]] + "",
      c = e[8](e[0]) + "";
    return {
      c() {
        (n = y("div")),
          (r = y("div")),
          (u = y("p")),
          (l = g(k)),
          (t = d()),
          (v = y("p")),
          (m = g(c)),
          $(u, "class", "name svelte-14uk05u"),
          $(v, "class", "value svelte-14uk05u"),
          $(r, "class", "inner svelte-14uk05u"),
          $(n, "class", "label svelte-14uk05u"),
          x(n, "height", e[4] + "px"),
          x(n, "transform", "translate(" + e[2] + "px, " + e[3] + "px)");
      },
      m(a, e) {
        h(a, n, e), f(n, r), f(r, u), f(u, l), f(r, t), f(r, v), f(v, m);
      },
      p(a, [e]) {
        2 & e && k !== (k = a[5][a[1]] + "") && M(l, k),
          1 & e && c !== (c = a[8](a[0]) + "") && M(m, c),
          16 & e && x(n, "height", a[4] + "px"),
          12 & e &&
            x(n, "transform", "translate(" + a[2] + "px, " + a[3] + "px)");
      },
      i: a,
      o: a,
      d(a) {
        a && b(n);
      },
    };
  }
  function iu(a, e, n) {
    let r,
      u,
      l,
      t,
      v,
      { value: k } = e,
      { rank: c } = e,
      { i: i } = e;
    const { names: o, scales: s, dimensions: p } = H("Chart");
    m(a, s, (a) => n(10, (t = a))), m(a, p, (a) => n(11, (v = a)));
    return (
      (a.$$set = (a) => {
        "value" in a && n(0, (k = a.value)),
          "rank" in a && n(9, (c = a.rank)),
          "i" in a && n(1, (i = a.i));
      }),
      (a.$$.update = () => {
        1025 & a.$$.dirty && n(2, (r = t.x(k))),
          3584 & a.$$.dirty && n(3, (u = t.y(c) + v.barMargin / 2)),
          2048 & a.$$.dirty && n(4, (l = v.barHeight));
      }),
      [k, i, r, u, l, o, s, p, (a) => Ce(",.1f")(100 * a) + "%", c, t, v]
    );
  }
  class ou extends ia {
    constructor(a) {
      super(), ca(this, a, iu, cu, v, { value: 0, rank: 9, i: 1 });
    }
  }
  function su(a, e, n) {
    const r = a.slice();
    return (r[3] = e[n].value), (r[4] = e[n].rank), (r[6] = n), r;
  }
  function pu(a) {
    let e, n;
    return (
      (e = new ou({ props: { value: a[3], rank: a[4], i: a[6] } })),
      {
        c() {
          ta(e.$$.fragment);
        },
        m(a, r) {
          va(e, a, r), (n = !0);
        },
        p(a, n) {
          const r = {};
          2 & n && (r.value = a[3]),
            2 & n && (r.rank = a[4]),
            2 & n && (r.i = a[6]),
            e.$set(r);
        },
        i(a) {
          n || (aa(e.$$.fragment, a), (n = !0));
        },
        o(a) {
          ea(e.$$.fragment, a), (n = !1);
        },
        d(a) {
          ma(e, a);
        },
      }
    );
  }
  function fu(a, e) {
    let n,
      r,
      u,
      l = e[4] < e[0] && pu(e);
    return {
      key: a,
      first: null,
      c() {
        (n = j()), l && l.c(), (r = j()), (this.first = n);
      },
      m(a, e) {
        h(a, n, e), l && l.m(a, e), h(a, r, e), (u = !0);
      },
      p(a, n) {
        (e = a)[4] < e[0]
          ? l
            ? (l.p(e, n), 3 & n && aa(l, 1))
            : ((l = pu(e)), l.c(), aa(l, 1), l.m(r.parentNode, r))
          : l &&
            (J(),
            ea(l, 1, 1, () => {
              l = null;
            }),
            Q());
      },
      i(a) {
        u || (aa(l), (u = !0));
      },
      o(a) {
        ea(l), (u = !1);
      },
      d(a) {
        a && b(n), l && l.d(a), a && b(r);
      },
    };
  }
  function hu(a) {
    let e,
      n,
      r = [],
      u = new Map(),
      l = a[1];
    const t = (a) => a[6];
    for (let e = 0; e < l.length; e += 1) {
      let n = su(a, l, e),
        v = t(n);
      u.set(v, (r[e] = fu(v, n)));
    }
    return {
      c() {
        for (let a = 0; a < r.length; a += 1) r[a].c();
        e = j();
      },
      m(a, u) {
        for (let e = 0; e < r.length; e += 1) r[e].m(a, u);
        h(a, e, u), (n = !0);
      },
      p(a, [n]) {
        3 & n &&
          ((l = a[1]),
          J(),
          (r = la(r, n, t, 1, a, l, u, e.parentNode, ua, fu, e, su)),
          Q());
      },
      i(a) {
        if (!n) {
          for (let a = 0; a < l.length; a += 1) aa(r[a]);
          n = !0;
        }
      },
      o(a) {
        for (let a = 0; a < r.length; a += 1) ea(r[a]);
        n = !1;
      },
      d(a) {
        for (let e = 0; e < r.length; e += 1) r[e].d(a);
        a && b(e);
      },
    };
  }
  function bu(a, e, n) {
    let r;
    const { data: u } = H("Chart");
    m(a, u, (a) => n(1, (r = a)));
    let { maxRank: l = 10 } = e;
    return (
      (a.$$set = (a) => {
        "maxRank" in a && n(0, (l = a.maxRank));
      }),
      [l, r, u]
    );
  }
  class yu extends ia {
    constructor(a) {
      super(), ca(this, a, bu, hu, v, { maxRank: 0 });
    }
  }
  function gu(a) {
    let e, n;
    return {
      c() {
        (e = y("p")), (n = g(a[1])), $(e, "class", "svelte-1kyb6o1");
      },
      m(a, r) {
        h(a, e, r), f(e, n);
      },
      p(a, e) {
        2 & e && M(n, a[1]);
      },
      d(a) {
        a && b(e);
      },
    };
  }
  function du(e) {
    let n,
      r = e[0] && gu(e);
    return {
      c() {
        r && r.c(), (n = j());
      },
      m(a, e) {
        r && r.m(a, e), h(a, n, e);
      },
      p(a, [e]) {
        a[0]
          ? r
            ? r.p(a, e)
            : ((r = gu(a)), r.c(), r.m(n.parentNode, n))
          : r && (r.d(1), (r = null));
      },
      i: a,
      o: a,
      d(a) {
        r && r.d(a), a && b(n);
      },
    };
  }
  function ju(a, e, n) {
    let r,
      { date: u } = e;
    return (
      (a.$$set = (a) => {
        "date" in a && n(0, (u = a.date));
      }),
      (a.$$.update = () => {
        1 & a.$$.dirty && n(1, (r = sn("%m-%d-%Y")(u).getFullYear()));
      }),
      [u, r]
    );
  }
  class wu extends ia {
    constructor(a) {
      super(), ca(this, a, ju, du, v, { date: 0 });
    }
  }
  var $u = [
    [
      "09-01-2008",
      [
        { name: "c#", value: 0.11864528654634, rank: 0 },
        { name: "java", value: 0.0816854821313, rank: 1 },
        { name: "c++", value: 0.05414539440569, rank: 2 },
        { name: "javascript", value: 0.04594808369884999, rank: 3 },
        { name: "python", value: 0.03890127274034, rank: 4 },
        { name: "php", value: 0.03458689868411, rank: 5 },
        { name: "c", value: 0.023009994966559998, rank: 6 },
        { name: "ruby", value: 0.02078090170417, rank: 7 },
        { name: "vb.net", value: 0.01524412166534, rank: 8 },
        { name: "perl", value: 0.00941971668943, rank: 9 },
        { name: "objective-c", value: 0.00366721794779, rank: 10 },
        { name: "assembly", value: 0.00201337455957, rank: 11 },
        { name: "r", value: 0.00043143740562, rank: 12 },
        { name: "swift", value: 0, rank: 13 },
      ],
    ],
    [
      "10-01-2008",
      [
        { name: "c#", value: 0.12488548618059334, rank: 0 },
        { name: "java", value: 0.07991017939480166, rank: 1 },
        { name: "c++", value: 0.053776178952778336, rank: 2 },
        { name: "javascript", value: 0.046558408183239995, rank: 3 },
        { name: "python", value: 0.03870330993409166, rank: 4 },
        { name: "php", value: 0.036243352154815, rank: 5 },
        { name: "c", value: 0.022720920049386664, rank: 6 },
        { name: "ruby", value: 0.020032394886096667, rank: 7 },
        { name: "vb.net", value: 0.015928498070575, rank: 8 },
        { name: "perl", value: 0.008985117842105001, rank: 9 },
        { name: "objective-c", value: 0.005441903658896666, rank: 10 },
        { name: "assembly", value: 0.0018752649911050001, rank: 11 },
        { name: "r", value: 0.0003924399810383333, rank: 12 },
        { name: "swift", value: 8227202421666666e-21, rank: 13 },
      ],
    ],
    [
      "11-01-2008",
      [
        { name: "c#", value: 0.13112568581484668, rank: 0 },
        { name: "java", value: 0.07813487665830333, rank: 1 },
        { name: "c++", value: 0.05340696349986667, rank: 2 },
        { name: "javascript", value: 0.04716873266763, rank: 3 },
        { name: "python", value: 0.038505347127843335, rank: 4 },
        { name: "php", value: 0.03789980562552, rank: 5 },
        { name: "c", value: 0.022431845132213333, rank: 6 },
        { name: "ruby", value: 0.019283888068023333, rank: 7 },
        { name: "vb.net", value: 0.01661287447581, rank: 8 },
        { name: "perl", value: 0.008550518994780001, rank: 9 },
        { name: "objective-c", value: 0.0072165893700033325, rank: 10 },
        { name: "assembly", value: 0.0017371554226400002, rank: 11 },
        { name: "r", value: 0.0003534425564566667, rank: 12 },
        { name: "swift", value: 1645440484333333e-20, rank: 13 },
      ],
    ],
    [
      "12-01-2008",
      [
        { name: "c#", value: 0.1373658854491, rank: 0 },
        { name: "java", value: 0.07635957392180501, rank: 1 },
        { name: "c++", value: 0.053037748046955005, rank: 2 },
        { name: "javascript", value: 0.047779057152019994, rank: 3 },
        { name: "php", value: 0.039556259096225, rank: 4 },
        { name: "python", value: 0.038307384321595, rank: 5 },
        { name: "c", value: 0.02214277021504, rank: 6 },
        { name: "ruby", value: 0.018535381249950002, rank: 7 },
        { name: "vb.net", value: 0.017297250881045, rank: 8 },
        { name: "objective-c", value: 0.008991275081109999, rank: 9 },
        { name: "perl", value: 0.008115920147455, rank: 10 },
        { name: "assembly", value: 0.0015990458541750002, rank: 11 },
        { name: "r", value: 0.000314445131875, rank: 12 },
        { name: "swift", value: 24681607265e-15, rank: 13 },
      ],
    ],
    [
      "01-01-2009",
      [
        { name: "c#", value: 0.14360608508335335, rank: 0 },
        { name: "java", value: 0.07458427118530667, rank: 1 },
        { name: "c++", value: 0.05266853259404333, rank: 2 },
        { name: "javascript", value: 0.048389381636409996, rank: 3 },
        { name: "php", value: 0.041212712566929995, rank: 4 },
        { name: "python", value: 0.038109421515346666, rank: 5 },
        { name: "c", value: 0.021853695297866665, rank: 6 },
        { name: "vb.net", value: 0.01798162728628, rank: 7 },
        { name: "ruby", value: 0.017786874431876668, rank: 8 },
        { name: "objective-c", value: 0.010765960792216665, rank: 9 },
        { name: "perl", value: 0.00768132130013, rank: 10 },
        { name: "assembly", value: 0.0014609362857100003, rank: 11 },
        { name: "r", value: 0.00027544770729333334, rank: 12 },
        { name: "swift", value: 3290880968666666e-20, rank: 13 },
      ],
    ],
    [
      "02-01-2009",
      [
        { name: "c#", value: 0.1498462847176067, rank: 0 },
        { name: "java", value: 0.07280896844880833, rank: 1 },
        { name: "c++", value: 0.05229931714113167, rank: 2 },
        { name: "javascript", value: 0.0489997061208, rank: 3 },
        { name: "php", value: 0.04286916603763499, rank: 4 },
        { name: "python", value: 0.03791145870909834, rank: 5 },
        { name: "c", value: 0.021564620380693334, rank: 6 },
        { name: "vb.net", value: 0.018666003691515002, rank: 7 },
        { name: "ruby", value: 0.017038367613803333, rank: 8 },
        { name: "objective-c", value: 0.012540646503323332, rank: 9 },
        { name: "perl", value: 0.007246722452805001, rank: 10 },
        { name: "assembly", value: 0.001322826717245, rank: 11 },
        { name: "r", value: 0.00023645028271166666, rank: 12 },
        { name: "swift", value: 4113601210833334e-20, rank: 13 },
      ],
    ],
    [
      "03-01-2009",
      [
        { name: "c#", value: 0.15608648435186, rank: 0 },
        { name: "java", value: 0.07103366571231, rank: 1 },
        { name: "c++", value: 0.05193010168822, rank: 2 },
        { name: "javascript", value: 0.04961003060519, rank: 3 },
        { name: "php", value: 0.04452561950833999, rank: 4 },
        { name: "python", value: 0.03771349590285, rank: 5 },
        { name: "c", value: 0.02127554546352, rank: 6 },
        { name: "vb.net", value: 0.01935038009675, rank: 7 },
        { name: "ruby", value: 0.01628986079573, rank: 8 },
        { name: "objective-c", value: 0.014315332214429998, rank: 9 },
        { name: "perl", value: 0.00681212360548, rank: 10 },
        { name: "assembly", value: 0.00118471714878, rank: 11 },
        { name: "r", value: 0.00019745285813, rank: 12 },
        { name: "swift", value: 4936321453e-14, rank: 13 },
      ],
    ],
    [
      "04-01-2009",
      [
        { name: "c#", value: 0.15224844198815668, rank: 0 },
        { name: "java", value: 0.07072358178659667, rank: 1 },
        { name: "c++", value: 0.050733437177901665, rank: 2 },
        { name: "javascript", value: 0.05028254499079833, rank: 3 },
        { name: "php", value: 0.04865392129541332, rank: 4 },
        { name: "python", value: 0.037368103786788336, rank: 5 },
        { name: "c", value: 0.020653865959525, rank: 6 },
        { name: "vb.net", value: 0.018565583699250002, rank: 7 },
        { name: "ruby", value: 0.016004961942336665, rank: 8 },
        { name: "objective-c", value: 0.015459934112666666, rank: 9 },
        { name: "perl", value: 0.00695039542904, rank: 10 },
        { name: "assembly", value: 0.0013031234785850002, rank: 11 },
        { name: "r", value: 0.0008675854667499999, rank: 12 },
        { name: "swift", value: 5641952120166667e-20, rank: 13 },
      ],
    ],
    [
      "05-01-2009",
      [
        { name: "c#", value: 0.14841039962445335, rank: 0 },
        { name: "java", value: 0.07041349786088333, rank: 1 },
        { name: "php", value: 0.05278222308248666, rank: 2 },
        { name: "javascript", value: 0.05095505937640667, rank: 3 },
        { name: "c++", value: 0.049536772667583336, rank: 4 },
        { name: "python", value: 0.03702271167072667, rank: 5 },
        { name: "c", value: 0.02003218645553, rank: 6 },
        { name: "vb.net", value: 0.01778078730175, rank: 7 },
        { name: "objective-c", value: 0.016604536010903333, rank: 8 },
        { name: "ruby", value: 0.01572006308894333, rank: 9 },
        { name: "perl", value: 0.007088667252600001, rank: 10 },
        { name: "r", value: 0.00153771807537, rank: 11 },
        { name: "assembly", value: 0.00142152980839, rank: 12 },
        { name: "swift", value: 6347582787333333e-20, rank: 13 },
      ],
    ],
    [
      "06-01-2009",
      [
        { name: "c#", value: 0.14457235726075002, rank: 0 },
        { name: "java", value: 0.07010341393517, rank: 1 },
        { name: "php", value: 0.05691052486956, rank: 2 },
        { name: "javascript", value: 0.051627573762014996, rank: 3 },
        { name: "c++", value: 0.048340108157265, rank: 4 },
        { name: "python", value: 0.036677319554665, rank: 5 },
        { name: "c", value: 0.019410506951534998, rank: 6 },
        { name: "objective-c", value: 0.017749137909139998, rank: 7 },
        { name: "vb.net", value: 0.01699599090425, rank: 8 },
        { name: "ruby", value: 0.015435164235549999, rank: 9 },
        { name: "perl", value: 0.00722693907616, rank: 10 },
        { name: "r", value: 0.00220785068399, rank: 11 },
        { name: "assembly", value: 0.0015399361381950001, rank: 12 },
        { name: "swift", value: 70532134545e-15, rank: 13 },
      ],
    ],
    [
      "07-01-2009",
      [
        { name: "c#", value: 0.14073431489704666, rank: 0 },
        { name: "java", value: 0.06979333000945667, rank: 1 },
        { name: "php", value: 0.06103882665663333, rank: 2 },
        { name: "javascript", value: 0.052300088147623325, rank: 3 },
        { name: "c++", value: 0.04714344364694666, rank: 4 },
        { name: "python", value: 0.036331927438603334, rank: 5 },
        { name: "objective-c", value: 0.018893739807376665, rank: 6 },
        { name: "c", value: 0.01878882744754, rank: 7 },
        { name: "vb.net", value: 0.01621119450675, rank: 8 },
        { name: "ruby", value: 0.015150265382156665, rank: 9 },
        { name: "perl", value: 0.00736521089972, rank: 10 },
        { name: "r", value: 0.00287798329261, rank: 11 },
        { name: "assembly", value: 0.001658342468, rank: 12 },
        { name: "swift", value: 7758844121666667e-20, rank: 13 },
      ],
    ],
    [
      "08-01-2009",
      [
        { name: "c#", value: 0.13689627253334333, rank: 0 },
        { name: "java", value: 0.06948324608374333, rank: 1 },
        { name: "php", value: 0.06516712844370666, rank: 2 },
        { name: "javascript", value: 0.05297260253323166, rank: 3 },
        { name: "c++", value: 0.045946779136628334, rank: 4 },
        { name: "python", value: 0.03598653532254167, rank: 5 },
        { name: "objective-c", value: 0.020038341705613333, rank: 6 },
        { name: "c", value: 0.018167147943545, rank: 7 },
        { name: "vb.net", value: 0.015426398109250002, rank: 8 },
        { name: "ruby", value: 0.014865366528763333, rank: 9 },
        { name: "perl", value: 0.007503482723280001, rank: 10 },
        { name: "r", value: 0.00354811590123, rank: 11 },
        { name: "assembly", value: 0.0017767487978050003, rank: 12 },
        { name: "swift", value: 8464474788833333e-20, rank: 13 },
      ],
    ],
    [
      "09-01-2009",
      [
        { name: "c#", value: 0.13305823016964, rank: 0 },
        { name: "php", value: 0.06929543023078, rank: 1 },
        { name: "java", value: 0.06917316215803, rank: 2 },
        { name: "javascript", value: 0.05364511691883999, rank: 3 },
        { name: "c++", value: 0.04475011462631, rank: 4 },
        { name: "python", value: 0.03564114320648, rank: 5 },
        { name: "objective-c", value: 0.02118294360385, rank: 6 },
        { name: "c", value: 0.01754546843955, rank: 7 },
        { name: "vb.net", value: 0.014641601711750002, rank: 8 },
        { name: "ruby", value: 0.01458046767537, rank: 9 },
        { name: "perl", value: 0.007641754546840001, rank: 10 },
        { name: "r", value: 0.00421824850985, rank: 11 },
        { name: "assembly", value: 0.0018951551276100002, rank: 12 },
        { name: "swift", value: 9170105456e-14, rank: 13 },
      ],
    ],
    [
      "10-01-2009",
      [
        { name: "c#", value: 0.13026842697176666, rank: 0 },
        { name: "java", value: 0.07192964895767166, rank: 1 },
        { name: "php", value: 0.06979895159402666, rank: 2 },
        { name: "javascript", value: 0.05429635913337333, rank: 3 },
        { name: "c++", value: 0.04512991084357666, rank: 4 },
        { name: "python", value: 0.036356954316791666, rank: 5 },
        { name: "objective-c", value: 0.021282415290148335, rank: 6 },
        { name: "c", value: 0.018206213002478332, rank: 7 },
        { name: "ruby", value: 0.014386189509748333, rank: 8 },
        { name: "vb.net", value: 0.014360037995918335, rank: 9 },
        { name: "perl", value: 0.007627372343440001, rank: 10 },
        { name: "r", value: 0.003961724576395, rank: 11 },
        { name: "assembly", value: 0.00197441572843, rank: 12 },
        { name: "swift", value: 7641754546666666e-20, rank: 13 },
      ],
    ],
    [
      "11-01-2009",
      [
        { name: "c#", value: 0.12747862377389332, rank: 0 },
        { name: "java", value: 0.07468613575731334, rank: 1 },
        { name: "php", value: 0.07030247295727333, rank: 2 },
        { name: "javascript", value: 0.05494760134790666, rank: 3 },
        { name: "c++", value: 0.045509707060843334, rank: 4 },
        { name: "python", value: 0.03707276542710333, rank: 5 },
        { name: "objective-c", value: 0.021381886976446666, rank: 6 },
        { name: "c", value: 0.018866957565406666, rank: 7 },
        { name: "ruby", value: 0.014191911344126666, rank: 8 },
        { name: "vb.net", value: 0.014078474280086668, rank: 9 },
        { name: "perl", value: 0.0076129901400400005, rank: 10 },
        { name: "r", value: 0.0037052006429400004, rank: 11 },
        { name: "assembly", value: 0.00205367632925, rank: 12 },
        { name: "swift", value: 6113403637333334e-20, rank: 13 },
      ],
    ],
    [
      "12-01-2009",
      [
        { name: "c#", value: 0.12468882057602, rank: 0 },
        { name: "java", value: 0.077442622556955, rank: 1 },
        { name: "php", value: 0.07080599432052, rank: 2 },
        { name: "javascript", value: 0.05559884356244, rank: 3 },
        { name: "c++", value: 0.04588950327811, rank: 4 },
        { name: "python", value: 0.037788576537415, rank: 5 },
        { name: "objective-c", value: 0.021481358662745, rank: 6 },
        { name: "c", value: 0.019527702128335, rank: 7 },
        { name: "ruby", value: 0.013997633178504998, rank: 8 },
        { name: "vb.net", value: 0.013796910564255001, rank: 9 },
        { name: "perl", value: 0.00759860793664, rank: 10 },
        { name: "r", value: 0.003448676709485, rank: 11 },
        { name: "assembly", value: 0.0021329369300700004, rank: 12 },
        { name: "swift", value: 4585052728e-14, rank: 13 },
      ],
    ],
    [
      "01-01-2010",
      [
        { name: "c#", value: 0.12189901737814667, rank: 0 },
        { name: "java", value: 0.08019910935659666, rank: 1 },
        { name: "php", value: 0.07130951568376666, rank: 2 },
        { name: "javascript", value: 0.05625008577697334, rank: 3 },
        { name: "c++", value: 0.04626929949537666, rank: 4 },
        { name: "python", value: 0.038504387647726665, rank: 5 },
        { name: "objective-c", value: 0.021580830349043335, rank: 6 },
        { name: "c", value: 0.020188446691263334, rank: 7 },
        { name: "ruby", value: 0.013803355012883331, rank: 8 },
        { name: "vb.net", value: 0.013515346848423334, rank: 9 },
        { name: "perl", value: 0.007584225733240001, rank: 10 },
        { name: "r", value: 0.0031921527760300004, rank: 11 },
        { name: "assembly", value: 0.0022121975308900003, rank: 12 },
        { name: "swift", value: 3056701818666667e-20, rank: 13 },
      ],
    ],
    [
      "02-01-2010",
      [
        { name: "c#", value: 0.11910921418027334, rank: 0 },
        { name: "java", value: 0.08295559615623833, rank: 1 },
        { name: "php", value: 0.07181303704701333, rank: 2 },
        { name: "javascript", value: 0.05690132799150667, rank: 3 },
        { name: "c++", value: 0.046649095712643335, rank: 4 },
        { name: "python", value: 0.03922019875803833, rank: 5 },
        { name: "objective-c", value: 0.021680302035341666, rank: 6 },
        { name: "c", value: 0.020849191254191667, rank: 7 },
        { name: "ruby", value: 0.013609076847261665, rank: 8 },
        { name: "vb.net", value: 0.013233783132591668, rank: 9 },
        { name: "perl", value: 0.007569843529840001, rank: 10 },
        { name: "r", value: 0.0029356288425750002, rank: 11 },
        { name: "assembly", value: 0.0022914581317100002, rank: 12 },
        { name: "swift", value: 15283509093333336e-21, rank: 13 },
      ],
    ],
    [
      "03-01-2010",
      [
        { name: "c#", value: 0.1163194109824, rank: 0 },
        { name: "java", value: 0.08571208295588, rank: 1 },
        { name: "php", value: 0.07231655841026, rank: 2 },
        { name: "javascript", value: 0.05755257020604001, rank: 3 },
        { name: "c++", value: 0.04702889192991, rank: 4 },
        { name: "python", value: 0.03993600986835, rank: 5 },
        { name: "objective-c", value: 0.02177977372164, rank: 6 },
        { name: "c", value: 0.02150993581712, rank: 7 },
        { name: "ruby", value: 0.013414798681639998, rank: 8 },
        { name: "vb.net", value: 0.01295221941676, rank: 9 },
        { name: "perl", value: 0.00755546132644, rank: 10 },
        { name: "r", value: 0.0026791049091200005, rank: 11 },
        { name: "assembly", value: 0.00237071873253, rank: 12 },
        { name: "swift", value: 0, rank: 13 },
      ],
    ],
    [
      "04-01-2010",
      [
        { name: "c#", value: 0.11447958630944834, rank: 0 },
        { name: "java", value: 0.08436485639892, rank: 1 },
        { name: "php", value: 0.07313890005396666, rank: 2 },
        { name: "javascript", value: 0.058917600179918345, rank: 3 },
        { name: "c++", value: 0.04670373071491833, rank: 4 },
        { name: "python", value: 0.039450412204246665, rank: 5 },
        { name: "objective-c", value: 0.022670755736665, rank: 6 },
        { name: "c", value: 0.021700619997968334, rank: 7 },
        { name: "ruby", value: 0.013746347271633331, rank: 8 },
        { name: "vb.net", value: 0.012410096264366666, rank: 9 },
        { name: "perl", value: 0.007556602244095, rank: 10 },
        { name: "r", value: 0.0028792194577600006, rank: 11 },
        { name: "assembly", value: 0.002296174994276667, rank: 12 },
        { name: "swift", value: 5479932486666666e-21, rank: 13 },
      ],
    ],
    [
      "05-01-2010",
      [
        { name: "c#", value: 0.11263976163649667, rank: 0 },
        { name: "java", value: 0.08301762984196, rank: 1 },
        { name: "php", value: 0.07396124169767333, rank: 2 },
        { name: "javascript", value: 0.060282630153796674, rank: 3 },
        { name: "c++", value: 0.046378569499926664, rank: 4 },
        { name: "python", value: 0.03896481454014333, rank: 5 },
        { name: "objective-c", value: 0.02356173775169, rank: 6 },
        { name: "c", value: 0.021891304178816667, rank: 7 },
        { name: "ruby", value: 0.014077895861626666, rank: 8 },
        { name: "vb.net", value: 0.011867973111973334, rank: 9 },
        { name: "perl", value: 0.00755774316175, rank: 10 },
        { name: "r", value: 0.0030793340064000003, rank: 11 },
        { name: "assembly", value: 0.0022216312560233336, rank: 12 },
        { name: "swift", value: 10959864973333332e-21, rank: 13 },
      ],
    ],
    [
      "06-01-2010",
      [
        { name: "c#", value: 0.11079993696354501, rank: 0 },
        { name: "java", value: 0.081670403285, rank: 1 },
        { name: "php", value: 0.07478358334138, rank: 2 },
        { name: "javascript", value: 0.061647660127675, rank: 3 },
        { name: "c++", value: 0.046053408284934996, rank: 4 },
        { name: "python", value: 0.03847921687604, rank: 5 },
        { name: "objective-c", value: 0.024452719766715002, rank: 6 },
        { name: "c", value: 0.022081988359665003, rank: 7 },
        { name: "ruby", value: 0.014409444451619999, rank: 8 },
        { name: "vb.net", value: 0.011325849959580001, rank: 9 },
        { name: "perl", value: 0.007558884079405, rank: 10 },
        { name: "r", value: 0.00327944855504, rank: 11 },
        { name: "assembly", value: 0.0021470875177700003, rank: 12 },
        { name: "swift", value: 1643979746e-14, rank: 13 },
      ],
    ],
    [
      "07-01-2010",
      [
        { name: "c#", value: 0.10896011229059334, rank: 0 },
        { name: "java", value: 0.08032317672804, rank: 1 },
        { name: "php", value: 0.07560592498508666, rank: 2 },
        { name: "javascript", value: 0.06301269010155333, rank: 3 },
        { name: "c++", value: 0.045728247069943335, rank: 4 },
        { name: "python", value: 0.03799361921193666, rank: 5 },
        { name: "objective-c", value: 0.02534370178174, rank: 6 },
        { name: "c", value: 0.022272672540513336, rank: 7 },
        { name: "ruby", value: 0.014740993041613332, rank: 8 },
        { name: "vb.net", value: 0.010783726807186667, rank: 9 },
        { name: "perl", value: 0.00756002499706, rank: 10 },
        { name: "r", value: 0.00347956310368, rank: 11 },
        { name: "assembly", value: 0.0020725437795166665, rank: 12 },
        { name: "swift", value: 21919729946666664e-21, rank: 13 },
      ],
    ],
    [
      "08-01-2010",
      [
        { name: "c#", value: 0.10712028761764167, rank: 0 },
        { name: "java", value: 0.07897595017108, rank: 1 },
        { name: "php", value: 0.07642826662879333, rank: 2 },
        { name: "javascript", value: 0.06437772007543167, rank: 3 },
        { name: "c++", value: 0.04540308585495167, rank: 4 },
        { name: "python", value: 0.03750802154783333, rank: 5 },
        { name: "objective-c", value: 0.026234683796765, rank: 6 },
        { name: "c", value: 0.02246335672136167, rank: 7 },
        { name: "ruby", value: 0.015072541631606666, rank: 8 },
        { name: "vb.net", value: 0.010241603654793333, rank: 9 },
        { name: "perl", value: 0.007561165914715, rank: 10 },
        { name: "r", value: 0.0036796776523200002, rank: 11 },
        { name: "assembly", value: 0.0019980000412633332, rank: 12 },
        { name: "swift", value: 27399662433333332e-21, rank: 13 },
      ],
    ],
    [
      "09-01-2010",
      [
        { name: "c#", value: 0.10528046294469, rank: 0 },
        { name: "java", value: 0.07762872361412, rank: 1 },
        { name: "php", value: 0.0772506082725, rank: 2 },
        { name: "javascript", value: 0.06574275004931, rank: 3 },
        { name: "c++", value: 0.04507792463996, rank: 4 },
        { name: "python", value: 0.03702242388373, rank: 5 },
        { name: "objective-c", value: 0.02712566581179, rank: 6 },
        { name: "c", value: 0.02265404090221, rank: 7 },
        { name: "ruby", value: 0.0154040902216, rank: 8 },
        { name: "vb.net", value: 0.0096994805024, rank: 9 },
        { name: "perl", value: 0.00756230683237, rank: 10 },
        { name: "r", value: 0.00387979220096, rank: 11 },
        { name: "assembly", value: 0.00192345630301, rank: 12 },
        { name: "swift", value: 3287959492e-14, rank: 13 },
      ],
    ],
    [
      "10-01-2010",
      [
        { name: "c#", value: 0.10431047682421334, rank: 0 },
        { name: "java", value: 0.07875919923758, rank: 1 },
        { name: "php", value: 0.07784526297836333, rank: 2 },
        { name: "javascript", value: 0.06601761007174667, rank: 3 },
        { name: "c++", value: 0.04449887567702, rank: 4 },
        { name: "python", value: 0.03707431732593833, rank: 5 },
        { name: "objective-c", value: 0.02766251538938, rank: 6 },
        { name: "c", value: 0.022376854559203335, rank: 7 },
        { name: "ruby", value: 0.015555575622598333, rank: 8 },
        { name: "vb.net", value: 0.009565900657538333, rank: 9 },
        { name: "perl", value: 0.007303859881871666, rank: 10 },
        { name: "r", value: 0.003933189362996667, rank: 11 },
        { name: "assembly", value: 0.001921376948105, rank: 12 },
        { name: "swift", value: 3237617330166667e-20, rank: 13 },
      ],
    ],
    [
      "11-01-2010",
      [
        { name: "c#", value: 0.10334049070373667, rank: 0 },
        { name: "java", value: 0.07988967486104, rank: 1 },
        { name: "php", value: 0.07843991768422666, rank: 2 },
        { name: "javascript", value: 0.06629247009418333, rank: 3 },
        { name: "c++", value: 0.04391982671408, rank: 4 },
        { name: "python", value: 0.037126210768146664, rank: 5 },
        { name: "objective-c", value: 0.02819936496697, rank: 6 },
        { name: "c", value: 0.022099668216196668, rank: 7 },
        { name: "ruby", value: 0.015707061023596668, rank: 8 },
        { name: "vb.net", value: 0.009432320812676667, rank: 9 },
        { name: "perl", value: 0.0070454129313733335, rank: 10 },
        { name: "r", value: 0.003986586525033333, rank: 11 },
        { name: "assembly", value: 0.0019192975932, rank: 12 },
        { name: "swift", value: 3187275168333333e-20, rank: 13 },
      ],
    ],
    [
      "12-01-2010",
      [
        { name: "c#", value: 0.10237050458326, rank: 0 },
        { name: "java", value: 0.08102015048450001, rank: 1 },
        { name: "php", value: 0.07903457239009, rank: 2 },
        { name: "javascript", value: 0.06656733011662, rank: 3 },
        { name: "c++", value: 0.04334077775114, rank: 4 },
        { name: "python", value: 0.037178104210355, rank: 5 },
        { name: "objective-c", value: 0.02873621454456, rank: 6 },
        { name: "c", value: 0.02182248187319, rank: 7 },
        { name: "ruby", value: 0.015858546424595, rank: 8 },
        { name: "vb.net", value: 0.009298740967815, rank: 9 },
        { name: "perl", value: 0.006786965980875, rank: 10 },
        { name: "r", value: 0.00403998368707, rank: 11 },
        { name: "assembly", value: 0.001917218238295, rank: 12 },
        { name: "swift", value: 31369330065e-15, rank: 13 },
      ],
    ],
    [
      "01-01-2011",
      [
        { name: "c#", value: 0.10140051846278333, rank: 0 },
        { name: "java", value: 0.08215062610796, rank: 1 },
        { name: "php", value: 0.07962922709595334, rank: 2 },
        { name: "javascript", value: 0.06684219013905666, rank: 3 },
        { name: "c++", value: 0.042761728788200004, rank: 4 },
        { name: "python", value: 0.03722999765256333, rank: 5 },
        { name: "objective-c", value: 0.02927306412215, rank: 6 },
        { name: "c", value: 0.021545295530183334, rank: 7 },
        { name: "ruby", value: 0.016010031825593334, rank: 8 },
        { name: "vb.net", value: 0.009165161122953333, rank: 9 },
        { name: "perl", value: 0.0065285190303766664, rank: 10 },
        { name: "r", value: 0.004093380849106667, rank: 11 },
        { name: "assembly", value: 0.00191513888339, rank: 12 },
        { name: "swift", value: 30865908446666664e-21, rank: 13 },
      ],
    ],
    [
      "02-01-2011",
      [
        { name: "c#", value: 0.10043053234230667, rank: 0 },
        { name: "java", value: 0.08328110173142, rank: 1 },
        { name: "php", value: 0.08022388180181667, rank: 2 },
        { name: "javascript", value: 0.06711705016149333, rank: 3 },
        { name: "c++", value: 0.04218267982526, rank: 4 },
        { name: "python", value: 0.03728189109477166, rank: 5 },
        { name: "objective-c", value: 0.029809913699740002, rank: 6 },
        { name: "c", value: 0.021268109187176667, rank: 7 },
        { name: "ruby", value: 0.016161517226591666, rank: 8 },
        { name: "vb.net", value: 0.009031581278091666, rank: 9 },
        { name: "perl", value: 0.006270072079878333, rank: 10 },
        { name: "r", value: 0.004146778011143334, rank: 11 },
        { name: "assembly", value: 0.001913059528485, rank: 12 },
        { name: "swift", value: 30362486828333334e-21, rank: 13 },
      ],
    ],
    [
      "03-01-2011",
      [
        { name: "c#", value: 0.09946054622183001, rank: 0 },
        { name: "java", value: 0.08441157735488, rank: 1 },
        { name: "php", value: 0.08081853650768, rank: 2 },
        { name: "javascript", value: 0.06739191018393, rank: 3 },
        { name: "c++", value: 0.04160363086232, rank: 4 },
        { name: "python", value: 0.03733378453698, rank: 5 },
        { name: "objective-c", value: 0.03034676327733, rank: 6 },
        { name: "c", value: 0.02099092284417, rank: 7 },
        { name: "ruby", value: 0.01631300262759, rank: 8 },
        { name: "vb.net", value: 0.00889800143323, rank: 9 },
        { name: "perl", value: 0.00601162512938, rank: 10 },
        { name: "r", value: 0.00420017517318, rank: 11 },
        { name: "assembly", value: 0.00191098017358, rank: 12 },
        { name: "swift", value: 2985906521e-14, rank: 13 },
      ],
    ],
    [
      "04-01-2011",
      [
        { name: "c#", value: 0.09812159385526834, rank: 0 },
        { name: "java", value: 0.08399661768016001, rank: 1 },
        { name: "php", value: 0.08059982862565668, rank: 2 },
        { name: "javascript", value: 0.069579536770075, rank: 3 },
        { name: "c++", value: 0.04112910787935334, rank: 4 },
        { name: "python", value: 0.036875373957364996, rank: 5 },
        { name: "objective-c", value: 0.030691181342538336, rank: 6 },
        { name: "c", value: 0.020629679053401666, rank: 7 },
        { name: "ruby", value: 0.0161308027595, rank: 8 },
        { name: "vb.net", value: 0.008806058496098333, rank: 9 },
        { name: "perl", value: 0.00582795660884, rank: 10 },
        { name: "r", value: 0.0045017072349033335, rank: 11 },
        { name: "assembly", value: 0.0018461468683, rank: 12 },
        { name: "swift", value: 34701782353333334e-21, rank: 13 },
      ],
    ],
    [
      "05-01-2011",
      [
        { name: "c#", value: 0.09678264148870667, rank: 0 },
        { name: "java", value: 0.08358165800544, rank: 1 },
        { name: "php", value: 0.08038112074363334, rank: 2 },
        { name: "javascript", value: 0.07176716335622, rank: 3 },
        { name: "c++", value: 0.04065458489638667, rank: 4 },
        { name: "python", value: 0.036416963377749995, rank: 5 },
        { name: "objective-c", value: 0.031035599407746667, rank: 6 },
        { name: "c", value: 0.020268435262633333, rank: 7 },
        { name: "ruby", value: 0.01594860289141, rank: 8 },
        { name: "vb.net", value: 0.008714115558966666, rank: 9 },
        { name: "perl", value: 0.0056442880883, rank: 10 },
        { name: "r", value: 0.004803239296626667, rank: 11 },
        { name: "assembly", value: 0.00178131356302, rank: 12 },
        { name: "swift", value: 3954449949666667e-20, rank: 13 },
      ],
    ],
    [
      "06-01-2011",
      [
        { name: "c#", value: 0.09544368912214501, rank: 0 },
        { name: "java", value: 0.08316669833072, rank: 1 },
        { name: "php", value: 0.08016241286161, rank: 2 },
        { name: "javascript", value: 0.07395478994236501, rank: 3 },
        { name: "c++", value: 0.04018006191342, rank: 4 },
        { name: "python", value: 0.03595855279813499, rank: 5 },
        { name: "objective-c", value: 0.031380017472955, rank: 6 },
        { name: "c", value: 0.019907191471865, rank: 7 },
        { name: "ruby", value: 0.01576640302332, rank: 8 },
        { name: "vb.net", value: 0.008622172621835001, rank: 9 },
        { name: "perl", value: 0.00546061956776, rank: 10 },
        { name: "r", value: 0.00510477135835, rank: 11 },
        { name: "assembly", value: 0.00171648025774, rank: 12 },
        { name: "swift", value: 4438721664e-14, rank: 13 },
      ],
    ],
    [
      "07-01-2011",
      [
        { name: "c#", value: 0.09410473675558334, rank: 0 },
        { name: "java", value: 0.08275173865600001, rank: 1 },
        { name: "php", value: 0.07994370497958667, rank: 2 },
        { name: "javascript", value: 0.07614241652851, rank: 3 },
        { name: "c++", value: 0.03970553893045334, rank: 4 },
        { name: "python", value: 0.03550014221852, rank: 5 },
        { name: "objective-c", value: 0.03172443553816333, rank: 6 },
        { name: "c", value: 0.019545947681096666, rank: 7 },
        { name: "ruby", value: 0.01558420315523, rank: 8 },
        { name: "vb.net", value: 0.008530229684703334, rank: 9 },
        { name: "r", value: 0.005406303420073333, rank: 10 },
        { name: "perl", value: 0.00527695104722, rank: 11 },
        { name: "assembly", value: 0.0016516469524599999, rank: 12 },
        { name: "swift", value: 4922993378333333e-20, rank: 13 },
      ],
    ],
    [
      "08-01-2011",
      [
        { name: "c#", value: 0.09276578438902167, rank: 0 },
        { name: "java", value: 0.08233677898128, rank: 1 },
        { name: "php", value: 0.07972499709756334, rank: 2 },
        { name: "javascript", value: 0.07833004311465501, rank: 3 },
        { name: "c++", value: 0.03923101594748667, rank: 4 },
        { name: "python", value: 0.035041731638905, rank: 5 },
        { name: "objective-c", value: 0.032068853603371666, rank: 6 },
        { name: "c", value: 0.019184703890328333, rank: 7 },
        { name: "ruby", value: 0.01540200328714, rank: 8 },
        { name: "vb.net", value: 0.008438286747571667, rank: 9 },
        { name: "r", value: 0.0057078354817966664, rank: 10 },
        { name: "perl", value: 0.005093282526679999, rank: 11 },
        { name: "assembly", value: 0.00158681364718, rank: 12 },
        { name: "swift", value: 5407265092666667e-20, rank: 13 },
      ],
    ],
    [
      "09-01-2011",
      [
        { name: "c#", value: 0.09142683202246, rank: 0 },
        { name: "java", value: 0.08192181930656, rank: 1 },
        { name: "javascript", value: 0.08051766970080002, rank: 2 },
        { name: "php", value: 0.07950628921554, rank: 3 },
        { name: "c++", value: 0.03875649296452, rank: 4 },
        { name: "python", value: 0.03458332105929, rank: 5 },
        { name: "objective-c", value: 0.03241327166858, rank: 6 },
        { name: "c", value: 0.01882346009956, rank: 7 },
        { name: "ruby", value: 0.01521980341905, rank: 8 },
        { name: "vb.net", value: 0.00834634381044, rank: 9 },
        { name: "r", value: 0.00600936754352, rank: 10 },
        { name: "perl", value: 0.00490961400614, rank: 11 },
        { name: "assembly", value: 0.0015219803418999999, rank: 12 },
        { name: "swift", value: 5891536807e-14, rank: 13 },
      ],
    ],
    [
      "10-01-2011",
      [
        { name: "c#", value: 0.09068693771758, rank: 0 },
        { name: "java", value: 0.08377124565924333, rank: 1 },
        { name: "javascript", value: 0.08048093728846835, rank: 2 },
        { name: "php", value: 0.07990407965673166, rank: 3 },
        { name: "c++", value: 0.03884617258402167, rank: 4 },
        { name: "python", value: 0.03512129942833, rank: 5 },
        { name: "objective-c", value: 0.03180582144663333, rank: 6 },
        { name: "c", value: 0.019106230384736664, rank: 7 },
        { name: "ruby", value: 0.015423925240245, rank: 8 },
        { name: "vb.net", value: 0.008266354167281668, rank: 9 },
        { name: "r", value: 0.006117843570533333, rank: 10 },
        { name: "perl", value: 0.004850515611228333, rank: 11 },
        { name: "assembly", value: 0.00159421091243, rank: 12 },
        { name: "swift", value: 54090683518333335e-21, rank: 13 },
      ],
    ],
    [
      "11-01-2011",
      [
        { name: "c#", value: 0.0899470434127, rank: 0 },
        { name: "java", value: 0.08562067201192668, rank: 1 },
        { name: "javascript", value: 0.08044420487613668, rank: 2 },
        { name: "php", value: 0.08030187009792333, rank: 3 },
        { name: "c++", value: 0.03893585220352334, rank: 4 },
        { name: "python", value: 0.03565927779737, rank: 5 },
        { name: "objective-c", value: 0.031198371224686668, rank: 6 },
        { name: "c", value: 0.019389000669913333, rank: 7 },
        { name: "ruby", value: 0.01562804706144, rank: 8 },
        { name: "vb.net", value: 0.008186364524123333, rank: 9 },
        { name: "r", value: 0.006226319597546667, rank: 10 },
        { name: "perl", value: 0.004791417216316666, rank: 11 },
        { name: "assembly", value: 0.00166644148296, rank: 12 },
        { name: "swift", value: 4926599896666667e-20, rank: 13 },
      ],
    ],
    [
      "12-01-2011",
      [
        { name: "c#", value: 0.08920714910782, rank: 0 },
        { name: "java", value: 0.08747009836461, rank: 1 },
        { name: "php", value: 0.080699660539115, rank: 2 },
        { name: "javascript", value: 0.080407472463805, rank: 3 },
        { name: "c++", value: 0.039025531823025, rank: 4 },
        { name: "python", value: 0.036197256166409994, rank: 5 },
        { name: "objective-c", value: 0.030590921002740003, rank: 6 },
        { name: "c", value: 0.01967177095509, rank: 7 },
        { name: "ruby", value: 0.015832168882635, rank: 8 },
        { name: "vb.net", value: 0.008106374880965, rank: 9 },
        { name: "r", value: 0.00633479562456, rank: 10 },
        { name: "perl", value: 0.004732318821405, rank: 11 },
        { name: "assembly", value: 0.0017386720534899999, rank: 12 },
        { name: "swift", value: 44441314415e-15, rank: 13 },
      ],
    ],
    [
      "01-01-2012",
      [
        { name: "java", value: 0.08931952471729333, rank: 0 },
        { name: "c#", value: 0.08846725480294, rank: 1 },
        { name: "php", value: 0.08109745098030666, rank: 2 },
        { name: "javascript", value: 0.08037074005147334, rank: 3 },
        { name: "c++", value: 0.039115211442526665, rank: 4 },
        { name: "python", value: 0.036735234535449995, rank: 5 },
        { name: "objective-c", value: 0.029983470780793334, rank: 6 },
        { name: "c", value: 0.019954541240266663, rank: 7 },
        { name: "ruby", value: 0.01603629070383, rank: 8 },
        { name: "vb.net", value: 0.008026385237806667, rank: 9 },
        { name: "r", value: 0.006443271651573333, rank: 10 },
        { name: "perl", value: 0.004673220426493333, rank: 11 },
        { name: "assembly", value: 0.00181090262402, rank: 12 },
        { name: "swift", value: 3961662986333333e-20, rank: 13 },
      ],
    ],
    [
      "02-01-2012",
      [
        { name: "java", value: 0.09116895106997668, rank: 0 },
        { name: "c#", value: 0.08772736049806, rank: 1 },
        { name: "php", value: 0.08149524142149833, rank: 2 },
        { name: "javascript", value: 0.08033400763914167, rank: 3 },
        { name: "c++", value: 0.03920489106202833, rank: 4 },
        { name: "python", value: 0.03727321290449, rank: 5 },
        { name: "objective-c", value: 0.02937602055884667, rank: 6 },
        { name: "c", value: 0.020237311525443332, rank: 7 },
        { name: "ruby", value: 0.016240412525025002, rank: 8 },
        { name: "vb.net", value: 0.007946395594648333, rank: 9 },
        { name: "r", value: 0.006551747678586667, rank: 10 },
        { name: "perl", value: 0.004614122031581666, rank: 11 },
        { name: "assembly", value: 0.0018831331945500002, rank: 12 },
        { name: "swift", value: 3479194531166667e-20, rank: 13 },
      ],
    ],
    [
      "03-01-2012",
      [
        { name: "java", value: 0.09301837742266, rank: 0 },
        { name: "c#", value: 0.08698746619318, rank: 1 },
        { name: "php", value: 0.08189303186269, rank: 2 },
        { name: "javascript", value: 0.08029727522681, rank: 3 },
        { name: "c++", value: 0.03929457068153, rank: 4 },
        { name: "python", value: 0.03781119127353, rank: 5 },
        { name: "objective-c", value: 0.028768570336900005, rank: 6 },
        { name: "c", value: 0.020520081810619997, rank: 7 },
        { name: "ruby", value: 0.01644453434622, rank: 8 },
        { name: "vb.net", value: 0.00786640595149, rank: 9 },
        { name: "r", value: 0.0066602237056, rank: 10 },
        { name: "perl", value: 0.00455502363667, rank: 11 },
        { name: "assembly", value: 0.00195536376508, rank: 12 },
        { name: "swift", value: 2996726076e-14, rank: 13 },
      ],
    ],
    [
      "04-01-2012",
      [
        { name: "java", value: 0.09222930678812334, rank: 0 },
        { name: "c#", value: 0.08676337986298333, rank: 1 },
        { name: "php", value: 0.08217903830016166, rank: 2 },
        { name: "javascript", value: 0.08104149820193, rank: 3 },
        { name: "c++", value: 0.038960945181199996, rank: 4 },
        { name: "python", value: 0.03815990384444833, rank: 5 },
        { name: "objective-c", value: 0.028264177545335004, rank: 6 },
        { name: "c", value: 0.02030393153131333, rank: 7 },
        { name: "ruby", value: 0.016182883310898333, rank: 8 },
        { name: "vb.net", value: 0.007973234393123333, rank: 9 },
        { name: "r", value: 0.0068909267123483334, rank: 10 },
        { name: "perl", value: 0.00463571298644, rank: 11 },
        { name: "assembly", value: 0.0019140609037400001, rank: 12 },
        { name: "swift", value: 33826662616666666e-21, rank: 13 },
      ],
    ],
    [
      "05-01-2012",
      [
        { name: "java", value: 0.09144023615358667, rank: 0 },
        { name: "c#", value: 0.08653929353278667, rank: 1 },
        { name: "php", value: 0.08246504473763333, rank: 2 },
        { name: "javascript", value: 0.08178572117705, rank: 3 },
        { name: "c++", value: 0.03862731968087, rank: 4 },
        { name: "python", value: 0.03850861641536667, rank: 5 },
        { name: "objective-c", value: 0.027759784753770004, rank: 6 },
        { name: "c", value: 0.020087781252006665, rank: 7 },
        { name: "ruby", value: 0.015921232275576666, rank: 8 },
        { name: "vb.net", value: 0.008080062834756666, rank: 9 },
        { name: "r", value: 0.007121629719096667, rank: 10 },
        { name: "perl", value: 0.00471640233621, rank: 11 },
        { name: "assembly", value: 0.0018727580424000002, rank: 12 },
        { name: "swift", value: 37686064473333334e-21, rank: 13 },
      ],
    ],
    [
      "06-01-2012",
      [
        { name: "java", value: 0.09065116551905, rank: 0 },
        { name: "c#", value: 0.08631520720258999, rank: 1 },
        { name: "php", value: 0.082751051175105, rank: 2 },
        { name: "javascript", value: 0.08252994415216999, rank: 3 },
        { name: "python", value: 0.038857328986284995, rank: 4 },
        { name: "c++", value: 0.03829369418054, rank: 5 },
        { name: "objective-c", value: 0.027255391962205004, rank: 6 },
        { name: "c", value: 0.019871630972699998, rank: 7 },
        { name: "ruby", value: 0.015659581240255002, rank: 8 },
        { name: "vb.net", value: 0.00818689127639, rank: 9 },
        { name: "r", value: 0.007352332725845, rank: 10 },
        { name: "perl", value: 0.00479709168598, rank: 11 },
        { name: "assembly", value: 0.00183145518106, rank: 12 },
        { name: "swift", value: 4154546633e-14, rank: 13 },
      ],
    ],
    [
      "07-01-2012",
      [
        { name: "java", value: 0.08986209488451334, rank: 0 },
        { name: "c#", value: 0.08609112087239332, rank: 1 },
        { name: "javascript", value: 0.08327416712729, rank: 2 },
        { name: "php", value: 0.08303705761257667, rank: 3 },
        { name: "python", value: 0.03920604155720333, rank: 4 },
        { name: "c++", value: 0.03796006868021, rank: 5 },
        { name: "objective-c", value: 0.026750999170640003, rank: 6 },
        { name: "c", value: 0.019655480693393332, rank: 7 },
        { name: "ruby", value: 0.015397930204933333, rank: 8 },
        { name: "vb.net", value: 0.008293719718023333, rank: 9 },
        { name: "r", value: 0.007583035732593333, rank: 10 },
        { name: "perl", value: 0.0048777810357500005, rank: 11 },
        { name: "assembly", value: 0.00179015231972, rank: 12 },
        { name: "swift", value: 4540486818666667e-20, rank: 13 },
      ],
    ],
    [
      "08-01-2012",
      [
        { name: "java", value: 0.08907302424997667, rank: 0 },
        { name: "c#", value: 0.08586703454219666, rank: 1 },
        { name: "javascript", value: 0.08401839010241, rank: 2 },
        { name: "php", value: 0.08332306405004833, rank: 3 },
        { name: "python", value: 0.039554754128121664, rank: 4 },
        { name: "c++", value: 0.037626443179879995, rank: 5 },
        { name: "objective-c", value: 0.026246606379075003, rank: 6 },
        { name: "c", value: 0.019439330414086665, rank: 7 },
        { name: "ruby", value: 0.015136279169611667, rank: 8 },
        { name: "vb.net", value: 0.008400548159656665, rank: 9 },
        { name: "r", value: 0.007813738739341667, rank: 10 },
        { name: "perl", value: 0.00495847038552, rank: 11 },
        { name: "assembly", value: 0.00174884945838, rank: 12 },
        { name: "swift", value: 4926427004333334e-20, rank: 13 },
      ],
    ],
    [
      "09-01-2012",
      [
        { name: "java", value: 0.08828395361544, rank: 0 },
        { name: "c#", value: 0.08564294821199998, rank: 1 },
        { name: "javascript", value: 0.08476261307753, rank: 2 },
        { name: "php", value: 0.08360907048752, rank: 3 },
        { name: "python", value: 0.03990346669904, rank: 4 },
        { name: "c++", value: 0.03729281767955, rank: 5 },
        { name: "objective-c", value: 0.025742213587510002, rank: 6 },
        { name: "c", value: 0.01922318013478, rank: 7 },
        { name: "ruby", value: 0.01487462813429, rank: 8 },
        { name: "vb.net", value: 0.00850737660129, rank: 9 },
        { name: "r", value: 0.00804444174609, rank: 10 },
        { name: "perl", value: 0.00503915973529, rank: 11 },
        { name: "assembly", value: 0.00170754659704, rank: 12 },
        { name: "swift", value: 531236719e-13, rank: 13 },
      ],
    ],
    [
      "10-01-2012",
      [
        { name: "java", value: 0.08891530131264834, rank: 0 },
        { name: "javascript", value: 0.08537801541920667, rank: 1 },
        { name: "c#", value: 0.08508603737771832, rank: 2 },
        { name: "php", value: 0.08332661854742333, rank: 3 },
        { name: "python", value: 0.040606325752, rank: 4 },
        { name: "c++", value: 0.03799936273079333, rank: 5 },
        { name: "objective-c", value: 0.02570828661745667, rank: 6 },
        { name: "c", value: 0.019334911727491667, rank: 7 },
        { name: "ruby", value: 0.014862718989266667, rank: 8 },
        { name: "r", value: 0.008485243904896666, rank: 9 },
        { name: "vb.net", value: 0.008444415758858332, rank: 10 },
        { name: "perl", value: 0.0050207352981633336, rank: 11 },
        { name: "assembly", value: 0.0017744490079033334, rank: 12 },
        { name: "swift", value: 4908470617666667e-20, rank: 13 },
      ],
    ],
    [
      "11-01-2012",
      [
        { name: "java", value: 0.08954664900985666, rank: 0 },
        { name: "javascript", value: 0.08599341776088333, rank: 1 },
        { name: "c#", value: 0.08452912654343665, rank: 2 },
        { name: "php", value: 0.08304416660732666, rank: 3 },
        { name: "python", value: 0.04130918480496, rank: 4 },
        { name: "c++", value: 0.03870590778203666, rank: 5 },
        { name: "objective-c", value: 0.025674359647403337, rank: 6 },
        { name: "c", value: 0.019446643320203332, rank: 7 },
        { name: "ruby", value: 0.014850809844243333, rank: 8 },
        { name: "r", value: 0.008926046063703333, rank: 9 },
        { name: "vb.net", value: 0.008381454916426665, rank: 10 },
        { name: "perl", value: 0.005002310861036667, rank: 11 },
        { name: "assembly", value: 0.0018413514187666667, rank: 12 },
        { name: "swift", value: 4504574045333333e-20, rank: 13 },
      ],
    ],
    [
      "12-01-2012",
      [
        { name: "java", value: 0.090177996707065, rank: 0 },
        { name: "javascript", value: 0.08660882010255999, rank: 1 },
        { name: "c#", value: 0.083972215709155, rank: 2 },
        { name: "php", value: 0.08276171466723001, rank: 3 },
        { name: "python", value: 0.04201204385792, rank: 4 },
        { name: "c++", value: 0.03941245283328, rank: 5 },
        { name: "objective-c", value: 0.025640432677350004, rank: 6 },
        { name: "c", value: 0.019558374912914997, rank: 7 },
        { name: "ruby", value: 0.01483890069922, rank: 8 },
        { name: "r", value: 0.00936684822251, rank: 9 },
        { name: "vb.net", value: 0.008318494073995, rank: 10 },
        { name: "perl", value: 0.004983886423910001, rank: 11 },
        { name: "assembly", value: 0.00190825382963, rank: 12 },
        { name: "swift", value: 4100677473e-14, rank: 13 },
      ],
    ],
    [
      "01-01-2013",
      [
        { name: "java", value: 0.09080934440427334, rank: 0 },
        { name: "javascript", value: 0.08722422244423667, rank: 1 },
        { name: "c#", value: 0.08341530487487334, rank: 2 },
        { name: "php", value: 0.08247926272713334, rank: 3 },
        { name: "python", value: 0.04271490291088, rank: 4 },
        { name: "c++", value: 0.04011899788452333, rank: 5 },
        { name: "objective-c", value: 0.02560650570729667, rank: 6 },
        { name: "c", value: 0.019670106505626665, rank: 7 },
        { name: "ruby", value: 0.014826991554196667, rank: 8 },
        { name: "r", value: 0.009807650381316667, rank: 9 },
        { name: "vb.net", value: 0.008255533231563333, rank: 10 },
        { name: "perl", value: 0.004965461986783334, rank: 11 },
        { name: "assembly", value: 0.001975156240493333, rank: 12 },
        { name: "swift", value: 3696780900666667e-20, rank: 13 },
      ],
    ],
    [
      "02-01-2013",
      [
        { name: "java", value: 0.09144069210148166, rank: 0 },
        { name: "javascript", value: 0.08783962478591334, rank: 1 },
        { name: "c#", value: 0.08285839404059167, rank: 2 },
        { name: "php", value: 0.08219681078703667, rank: 3 },
        { name: "python", value: 0.04341776196384001, rank: 4 },
        { name: "c++", value: 0.040825542935766665, rank: 5 },
        { name: "objective-c", value: 0.025572578737243338, rank: 6 },
        { name: "c", value: 0.019781838098338334, rank: 7 },
        { name: "ruby", value: 0.014815082409173333, rank: 8 },
        { name: "r", value: 0.010248452540123333, rank: 9 },
        { name: "vb.net", value: 0.008192572389131667, rank: 10 },
        { name: "perl", value: 0.004947037549656667, rank: 11 },
        { name: "assembly", value: 0.0020420586513566668, rank: 12 },
        { name: "swift", value: 32928843283333334e-21, rank: 13 },
      ],
    ],
    [
      "03-01-2013",
      [
        { name: "java", value: 0.09207203979869, rank: 0 },
        { name: "javascript", value: 0.08845502712759, rank: 1 },
        { name: "c#", value: 0.08230148320631, rank: 2 },
        { name: "php", value: 0.08191435884694, rank: 3 },
        { name: "python", value: 0.044120621016800005, rank: 4 },
        { name: "c++", value: 0.04153208798701, rank: 5 },
        { name: "objective-c", value: 0.025538651767190005, rank: 6 },
        { name: "c", value: 0.01989356969105, rank: 7 },
        { name: "ruby", value: 0.01480317326415, rank: 8 },
        { name: "r", value: 0.01068925469893, rank: 9 },
        { name: "vb.net", value: 0.0081296115467, rank: 10 },
        { name: "perl", value: 0.00492861311253, rank: 11 },
        { name: "assembly", value: 0.00210896106222, rank: 12 },
        { name: "swift", value: 2888987756e-14, rank: 13 },
      ],
    ],
    [
      "04-01-2013",
      [
        { name: "java", value: 0.09315193437062166, rank: 0 },
        { name: "javascript", value: 0.091599030384685, rank: 1 },
        { name: "php", value: 0.08270361239567667, rank: 2 },
        { name: "c#", value: 0.08246465234535166, rank: 3 },
        { name: "python", value: 0.044800161454445, rank: 4 },
        { name: "c++", value: 0.041227064750106665, rank: 5 },
        { name: "objective-c", value: 0.025267500460485003, rank: 6 },
        { name: "c", value: 0.02000270810043, rank: 7 },
        { name: "ruby", value: 0.014747279843398332, rank: 8 },
        { name: "r", value: 0.010635677919249999, rank: 9 },
        { name: "vb.net", value: 0.008362754231539999, rank: 10 },
        { name: "perl", value: 0.004799571525666667, rank: 11 },
        { name: "assembly", value: 0.0020513324182916664, rank: 12 },
        { name: "swift", value: 34138763255e-15, rank: 13 },
      ],
    ],
    [
      "05-01-2013",
      [
        { name: "javascript", value: 0.09474303364178, rank: 0 },
        { name: "java", value: 0.09423182894255333, rank: 1 },
        { name: "php", value: 0.08349286594441332, rank: 2 },
        { name: "c#", value: 0.08262782148439334, rank: 3 },
        { name: "python", value: 0.04547970189209, rank: 4 },
        { name: "c++", value: 0.04092204151320333, rank: 5 },
        { name: "objective-c", value: 0.024996349153780004, rank: 6 },
        { name: "c", value: 0.02011184650981, rank: 7 },
        { name: "ruby", value: 0.014691386422646667, rank: 8 },
        { name: "r", value: 0.01058210113957, rank: 9 },
        { name: "vb.net", value: 0.00859589691638, rank: 10 },
        { name: "perl", value: 0.004670529938803333, rank: 11 },
        { name: "assembly", value: 0.0019937037743633333, rank: 12 },
        { name: "swift", value: 3938764895e-14, rank: 13 },
      ],
    ],
    [
      "06-01-2013",
      [
        { name: "javascript", value: 0.097887036898875, rank: 0 },
        { name: "java", value: 0.095311723514485, rank: 1 },
        { name: "php", value: 0.08428211949315, rank: 2 },
        { name: "c#", value: 0.08279099062343499, rank: 3 },
        { name: "python", value: 0.046159242329735006, rank: 4 },
        { name: "c++", value: 0.0406170182763, rank: 5 },
        { name: "objective-c", value: 0.024725197847075005, rank: 6 },
        { name: "c", value: 0.02022098491919, rank: 7 },
        { name: "ruby", value: 0.014635493001895001, rank: 8 },
        { name: "r", value: 0.01052852435989, rank: 9 },
        { name: "vb.net", value: 0.00882903960122, rank: 10 },
        { name: "perl", value: 0.0045414883519399995, rank: 11 },
        { name: "assembly", value: 0.001936075130435, rank: 12 },
        { name: "swift", value: 44636534644999995e-21, rank: 13 },
      ],
    ],
    [
      "07-01-2013",
      [
        { name: "javascript", value: 0.10103104015597, rank: 0 },
        { name: "java", value: 0.09639161808641668, rank: 1 },
        { name: "php", value: 0.08507137304188667, rank: 2 },
        { name: "c#", value: 0.08295415976247665, rank: 3 },
        { name: "python", value: 0.04683878276738, rank: 4 },
        { name: "c++", value: 0.04031199503939666, rank: 5 },
        { name: "objective-c", value: 0.024454046540370002, rank: 6 },
        { name: "c", value: 0.02033012332857, rank: 7 },
        { name: "ruby", value: 0.014579599581143333, rank: 8 },
        { name: "r", value: 0.01047494758021, rank: 9 },
        { name: "vb.net", value: 0.009062182286059999, rank: 10 },
        { name: "perl", value: 0.0044124467650766665, rank: 11 },
        { name: "assembly", value: 0.0018784464865066667, rank: 12 },
        { name: "swift", value: 4988542034e-14, rank: 13 },
      ],
    ],
    [
      "08-01-2013",
      [
        { name: "javascript", value: 0.104175043413065, rank: 0 },
        { name: "java", value: 0.09747151265834834, rank: 1 },
        { name: "php", value: 0.08586062659062332, rank: 2 },
        { name: "c#", value: 0.08311732890151832, rank: 3 },
        { name: "python", value: 0.047518323205025, rank: 4 },
        { name: "c++", value: 0.04000697180249333, rank: 5 },
        { name: "objective-c", value: 0.024182895233665, rank: 6 },
        { name: "c", value: 0.02043926173795, rank: 7 },
        { name: "ruby", value: 0.014523706160391666, rank: 8 },
        { name: "r", value: 0.01042137080053, rank: 9 },
        { name: "vb.net", value: 0.0092953249709, rank: 10 },
        { name: "perl", value: 0.0042834051782133335, rank: 11 },
        { name: "assembly", value: 0.0018208178425783335, rank: 12 },
        { name: "swift", value: 55134306035e-15, rank: 13 },
      ],
    ],
    [
      "09-01-2013",
      [
        { name: "javascript", value: 0.10731904667016, rank: 0 },
        { name: "java", value: 0.09855140723028001, rank: 1 },
        { name: "php", value: 0.08664988013936, rank: 2 },
        { name: "c#", value: 0.08328049804055998, rank: 3 },
        { name: "python", value: 0.04819786364267, rank: 4 },
        { name: "c++", value: 0.03970194856559, rank: 5 },
        { name: "objective-c", value: 0.02391174392696, rank: 6 },
        { name: "c", value: 0.02054840014733, rank: 7 },
        { name: "ruby", value: 0.01446781273964, rank: 8 },
        { name: "r", value: 0.01036779402085, rank: 9 },
        { name: "vb.net", value: 0.00952846765574, rank: 10 },
        { name: "perl", value: 0.00415436359135, rank: 11 },
        { name: "assembly", value: 0.0017631891986500002, rank: 12 },
        { name: "swift", value: 6038319173e-14, rank: 13 },
      ],
    ],
    [
      "10-01-2013",
      [
        { name: "javascript", value: 0.10766795008134167, rank: 0 },
        { name: "java", value: 0.09981427276797668, rank: 1 },
        { name: "php", value: 0.08702896899708167, rank: 2 },
        { name: "c#", value: 0.08241630792132332, rank: 3 },
        { name: "python", value: 0.049347996444230005, rank: 4 },
        { name: "c++", value: 0.04005715501744166, rank: 5 },
        { name: "objective-c", value: 0.023957455798763336, rank: 6 },
        { name: "c", value: 0.020793540281928334, rank: 7 },
        { name: "ruby", value: 0.014426319587131666, rank: 8 },
        { name: "r", value: 0.010899693593401667, rank: 9 },
        { name: "vb.net", value: 0.009518924845353332, rank: 10 },
        { name: "perl", value: 0.004191450307756667, rank: 11 },
        { name: "assembly", value: 0.0018328608929116669, rank: 12 },
        { name: "swift", value: 5352936229666667e-20, rank: 13 },
      ],
    ],
    [
      "11-01-2013",
      [
        { name: "javascript", value: 0.10801685349252334, rank: 0 },
        { name: "java", value: 0.10107713830567334, rank: 1 },
        { name: "php", value: 0.08740805785480332, rank: 2 },
        { name: "c#", value: 0.08155211780208665, rank: 3 },
        { name: "python", value: 0.05049812924579, rank: 4 },
        { name: "c++", value: 0.040412361469293334, rank: 5 },
        { name: "objective-c", value: 0.024003167670566667, rank: 6 },
        { name: "c", value: 0.021038680416526668, rank: 7 },
        { name: "ruby", value: 0.014384826434623334, rank: 8 },
        { name: "r", value: 0.011431593165953333, rank: 9 },
        { name: "vb.net", value: 0.009509382034966667, rank: 10 },
        { name: "perl", value: 0.004228537024163333, rank: 11 },
        { name: "assembly", value: 0.0019025325871733334, rank: 12 },
        { name: "swift", value: 46675532863333335e-21, rank: 13 },
      ],
    ],
    [
      "12-01-2013",
      [
        { name: "javascript", value: 0.10836575690370501, rank: 0 },
        { name: "java", value: 0.10234000384337, rank: 1 },
        { name: "php", value: 0.087787146712525, rank: 2 },
        { name: "c#", value: 0.08068792768284999, rank: 3 },
        { name: "python", value: 0.05164826204735, rank: 4 },
        { name: "c++", value: 0.040767567921145, rank: 5 },
        { name: "objective-c", value: 0.024048879542370002, rank: 6 },
        { name: "c", value: 0.021283820551125, rank: 7 },
        { name: "ruby", value: 0.014343333282115001, rank: 8 },
        { name: "r", value: 0.011963492738505, rank: 9 },
        { name: "vb.net", value: 0.00949983922458, rank: 10 },
        { name: "perl", value: 0.00426562374057, rank: 11 },
        { name: "assembly", value: 0.0019722042814350003, rank: 12 },
        { name: "swift", value: 3982170343e-14, rank: 13 },
      ],
    ],
    [
      "01-01-2014",
      [
        { name: "javascript", value: 0.10871466031488666, rank: 0 },
        { name: "java", value: 0.10360286938106666, rank: 1 },
        { name: "php", value: 0.08816623557024666, rank: 2 },
        { name: "c#", value: 0.07982373756361333, rank: 3 },
        { name: "python", value: 0.05279839484891, rank: 4 },
        { name: "c++", value: 0.04112277437299666, rank: 5 },
        { name: "objective-c", value: 0.024094591414173337, rank: 6 },
        { name: "c", value: 0.021528960685723332, rank: 7 },
        { name: "ruby", value: 0.014301840129606667, rank: 8 },
        { name: "r", value: 0.012495392311056668, rank: 9 },
        { name: "vb.net", value: 0.009490296414193333, rank: 10 },
        { name: "perl", value: 0.004302710456976667, rank: 11 },
        { name: "assembly", value: 0.0020418759756966665, rank: 12 },
        { name: "swift", value: 3296787399666667e-20, rank: 13 },
      ],
    ],
    [
      "02-01-2014",
      [
        { name: "javascript", value: 0.10906356372606833, rank: 0 },
        { name: "java", value: 0.10486573491876333, rank: 1 },
        { name: "php", value: 0.08854532442796832, rank: 2 },
        { name: "c#", value: 0.07895954744437667, rank: 3 },
        { name: "python", value: 0.05394852765047001, rank: 4 },
        { name: "c++", value: 0.04147798082484833, rank: 5 },
        { name: "objective-c", value: 0.024140303285976668, rank: 6 },
        { name: "c", value: 0.021774100820321666, rank: 7 },
        { name: "ruby", value: 0.014260346977098333, rank: 8 },
        { name: "r", value: 0.013027291883608334, rank: 9 },
        { name: "vb.net", value: 0.009480753603806668, rank: 10 },
        { name: "perl", value: 0.004339797173383333, rank: 11 },
        { name: "assembly", value: 0.0021115476699583332, rank: 12 },
        { name: "swift", value: 26114044563333337e-21, rank: 13 },
      ],
    ],
    [
      "03-01-2014",
      [
        { name: "javascript", value: 0.10941246713725, rank: 0 },
        { name: "java", value: 0.10612860045646, rank: 1 },
        { name: "php", value: 0.08892441328569, rank: 2 },
        { name: "c#", value: 0.07809535732514, rank: 3 },
        { name: "python", value: 0.055098660452030004, rank: 4 },
        { name: "c++", value: 0.0418331872767, rank: 5 },
        { name: "objective-c", value: 0.024186015157780003, rank: 6 },
        { name: "c", value: 0.02201924095492, rank: 7 },
        { name: "ruby", value: 0.01421885382459, rank: 8 },
        { name: "r", value: 0.01355919145616, rank: 9 },
        { name: "vb.net", value: 0.00947121079342, rank: 10 },
        { name: "perl", value: 0.00437688388979, rank: 11 },
        { name: "assembly", value: 0.00218121936422, rank: 12 },
        { name: "swift", value: 1926021513e-14, rank: 13 },
      ],
    ],
    [
      "04-01-2014",
      [
        { name: "javascript", value: 0.10944243279729833, rank: 0 },
        { name: "java", value: 0.10527341683358667, rank: 1 },
        { name: "php", value: 0.08762264829528667, rank: 2 },
        { name: "c#", value: 0.077489433397625, rank: 3 },
        { name: "python", value: 0.05474939099789167, rank: 4 },
        { name: "c++", value: 0.04110314150324666, rank: 5 },
        { name: "objective-c", value: 0.023930037995876667, rank: 6 },
        { name: "c", value: 0.021602037002056665, rank: 7 },
        { name: "ruby", value: 0.014140378769785002, rank: 8 },
        { name: "r", value: 0.013679058807465, rank: 9 },
        { name: "vb.net", value: 0.009205596936133334, rank: 10 },
        { name: "perl", value: 0.00433048393542, rank: 11 },
        { name: "assembly", value: 0.00210497850714, rank: 12 },
        { name: "swift", value: 0.0019306851831416667, rank: 13 },
      ],
    ],
    [
      "05-01-2014",
      [
        { name: "javascript", value: 0.10947239845734667, rank: 0 },
        { name: "java", value: 0.10441823321071332, rank: 1 },
        { name: "php", value: 0.08632088330488333, rank: 2 },
        { name: "c#", value: 0.07688350947011, rank: 3 },
        { name: "python", value: 0.05440012154375334, rank: 4 },
        { name: "c++", value: 0.040373095729793335, rank: 5 },
        { name: "objective-c", value: 0.023674060833973335, rank: 6 },
        { name: "c", value: 0.021184833049193334, rank: 7 },
        { name: "ruby", value: 0.014061903714980001, rank: 8 },
        { name: "r", value: 0.01379892615877, rank: 9 },
        { name: "vb.net", value: 0.008939983078846667, rank: 10 },
        { name: "perl", value: 0.00428408398105, rank: 11 },
        { name: "swift", value: 0.003842110151153333, rank: 12 },
        { name: "assembly", value: 0.00202873765006, rank: 13 },
      ],
    ],
    [
      "06-01-2014",
      [
        { name: "javascript", value: 0.109502364117395, rank: 0 },
        { name: "java", value: 0.10356304958783999, rank: 1 },
        { name: "php", value: 0.08501911831448, rank: 2 },
        { name: "c#", value: 0.076277585542595, rank: 3 },
        { name: "python", value: 0.054050852089615006, rank: 4 },
        { name: "c++", value: 0.03964304995634, rank: 5 },
        { name: "objective-c", value: 0.023418083672070003, rank: 6 },
        { name: "c", value: 0.020767629096330002, rank: 7 },
        { name: "ruby", value: 0.013983428660175, rank: 8 },
        { name: "r", value: 0.013918793510075, rank: 9 },
        { name: "vb.net", value: 0.00867436922156, rank: 10 },
        { name: "swift", value: 0.005753535119165, rank: 11 },
        { name: "perl", value: 0.0042376840266800005, rank: 12 },
        { name: "assembly", value: 0.00195249679298, rank: 13 },
      ],
    ],
    [
      "07-01-2014",
      [
        { name: "javascript", value: 0.10953232977744333, rank: 0 },
        { name: "java", value: 0.10270786596496666, rank: 1 },
        { name: "php", value: 0.08371735332407668, rank: 2 },
        { name: "c#", value: 0.07567166161508, rank: 3 },
        { name: "python", value: 0.05370158263547667, rank: 4 },
        { name: "c++", value: 0.038913004182886665, rank: 5 },
        { name: "objective-c", value: 0.023162106510166668, rank: 6 },
        { name: "c", value: 0.020350425143466667, rank: 7 },
        { name: "r", value: 0.01403866086138, rank: 8 },
        { name: "ruby", value: 0.013904953605370002, rank: 9 },
        { name: "vb.net", value: 0.008408755364273332, rank: 10 },
        { name: "swift", value: 0.007664960087176666, rank: 11 },
        { name: "perl", value: 0.00419128407231, rank: 12 },
        { name: "assembly", value: 0.0018762559359000001, rank: 13 },
      ],
    ],
    [
      "08-01-2014",
      [
        { name: "javascript", value: 0.10956229543749167, rank: 0 },
        { name: "java", value: 0.10185268234209331, rank: 1 },
        { name: "php", value: 0.08241558833367334, rank: 2 },
        { name: "c#", value: 0.075065737687565, rank: 3 },
        { name: "python", value: 0.05335231318133833, rank: 4 },
        { name: "c++", value: 0.03818295840943334, rank: 5 },
        { name: "objective-c", value: 0.022906129348263332, rank: 6 },
        { name: "c", value: 0.019933221190603333, rank: 7 },
        { name: "r", value: 0.014158528212685, rank: 8 },
        { name: "ruby", value: 0.013826478550565003, rank: 9 },
        { name: "swift", value: 0.009576385055188335, rank: 10 },
        { name: "vb.net", value: 0.008143141506986666, rank: 11 },
        { name: "perl", value: 0.0041448841179399995, rank: 12 },
        { name: "assembly", value: 0.0018000150788199999, rank: 13 },
      ],
    ],
    [
      "09-01-2014",
      [
        { name: "javascript", value: 0.10959226109754, rank: 0 },
        { name: "java", value: 0.10099749871921998, rank: 1 },
        { name: "php", value: 0.08111382334327001, rank: 2 },
        { name: "c#", value: 0.07445981376005, rank: 3 },
        { name: "python", value: 0.0530030437272, rank: 4 },
        { name: "c++", value: 0.03745291263598, rank: 5 },
        { name: "objective-c", value: 0.02265015218636, rank: 6 },
        { name: "c", value: 0.01951601723774, rank: 7 },
        { name: "r", value: 0.01427839556399, rank: 8 },
        { name: "ruby", value: 0.013748003495760002, rank: 9 },
        { name: "swift", value: 0.0114878100232, rank: 10 },
        { name: "vb.net", value: 0.0078775276497, rank: 11 },
        { name: "perl", value: 0.00409848416357, rank: 12 },
        { name: "assembly", value: 0.00172377422174, rank: 13 },
      ],
    ],
    [
      "10-01-2014",
      [
        { name: "javascript", value: 0.10946742589281999, rank: 0 },
        { name: "java", value: 0.10162793573006665, rank: 1 },
        { name: "php", value: 0.08083392575154334, rank: 2 },
        { name: "c#", value: 0.07375753903152499, rank: 3 },
        { name: "python", value: 0.05441860913535167, rank: 4 },
        { name: "c++", value: 0.03773254943395833, rank: 5 },
        { name: "objective-c", value: 0.021774091049875, rank: 6 },
        { name: "c", value: 0.019717095481183333, rank: 7 },
        { name: "r", value: 0.015041555840405, rank: 8 },
        { name: "ruby", value: 0.013628250924276669, rank: 9 },
        { name: "swift", value: 0.012748650416003333, rank: 10 },
        { name: "vb.net", value: 0.007774562890284999, rank: 11 },
        { name: "perl", value: 0.003980754330611667, rank: 12 },
        { name: "assembly", value: 0.0017790353482066666, rank: 13 },
      ],
    ],
    [
      "11-01-2014",
      [
        { name: "javascript", value: 0.1093425906881, rank: 0 },
        { name: "java", value: 0.10225837274091332, rank: 1 },
        { name: "php", value: 0.08055402815981667, rank: 2 },
        { name: "c#", value: 0.073055264303, rank: 3 },
        { name: "python", value: 0.05583417454350333, rank: 4 },
        { name: "c++", value: 0.03801218623193667, rank: 5 },
        { name: "objective-c", value: 0.02089802991339, rank: 6 },
        { name: "c", value: 0.01991817372462667, rank: 7 },
        { name: "r", value: 0.01580471611682, rank: 8 },
        { name: "swift", value: 0.014009490808806667, rank: 9 },
        { name: "ruby", value: 0.013508498352793335, rank: 10 },
        { name: "vb.net", value: 0.00767159813087, rank: 11 },
        { name: "perl", value: 0.0038630244976533335, rank: 12 },
        { name: "assembly", value: 0.0018342964746733334, rank: 13 },
      ],
    ],
    [
      "12-01-2014",
      [
        { name: "javascript", value: 0.10921775548338, rank: 0 },
        { name: "java", value: 0.10288880975175999, rank: 1 },
        { name: "php", value: 0.08027413056809, rank: 2 },
        { name: "c#", value: 0.072352989574475, rank: 3 },
        { name: "python", value: 0.057249739951655, rank: 4 },
        { name: "c++", value: 0.038291823029915004, rank: 5 },
        { name: "c", value: 0.02011925196807, rank: 6 },
        { name: "objective-c", value: 0.020021968776905, rank: 7 },
        { name: "r", value: 0.016567876393235002, rank: 8 },
        { name: "swift", value: 0.015270331201610001, rank: 9 },
        { name: "ruby", value: 0.013388745781310002, rank: 10 },
        { name: "vb.net", value: 0.0075686333714549995, rank: 11 },
        { name: "perl", value: 0.003745294664695, rank: 12 },
        { name: "assembly", value: 0.00188955760114, rank: 13 },
      ],
    ],
    [
      "01-01-2015",
      [
        { name: "javascript", value: 0.10909292027866, rank: 0 },
        { name: "java", value: 0.10351924676260667, rank: 1 },
        { name: "php", value: 0.07999423297636334, rank: 2 },
        { name: "c#", value: 0.07165071484595, rank: 3 },
        { name: "python", value: 0.058665305359806665, rank: 4 },
        { name: "c++", value: 0.03857145982789333, rank: 5 },
        { name: "c", value: 0.020320330211513332, rank: 6 },
        { name: "objective-c", value: 0.01914590764042, rank: 7 },
        { name: "r", value: 0.01733103666965, rank: 8 },
        { name: "swift", value: 0.016531171594413335, rank: 9 },
        { name: "ruby", value: 0.013268993209826668, rank: 10 },
        { name: "vb.net", value: 0.007465668612039999, rank: 11 },
        { name: "perl", value: 0.0036275648317366667, rank: 12 },
        { name: "assembly", value: 0.0019448187276066666, rank: 13 },
      ],
    ],
    [
      "02-01-2015",
      [
        { name: "javascript", value: 0.10896808507393999, rank: 0 },
        { name: "java", value: 0.10414968377345334, rank: 1 },
        { name: "php", value: 0.07971433538463667, rank: 2 },
        { name: "c#", value: 0.07094844011742499, rank: 3 },
        { name: "python", value: 0.06008087076795833, rank: 4 },
        { name: "c++", value: 0.03885109662587166, rank: 5 },
        { name: "c", value: 0.020521408454956667, rank: 6 },
        { name: "objective-c", value: 0.018269846503934997, rank: 7 },
        { name: "r", value: 0.018094196946065, rank: 8 },
        { name: "swift", value: 0.017792011987216666, rank: 9 },
        { name: "ruby", value: 0.013149240638343334, rank: 10 },
        { name: "vb.net", value: 0.007362703852625, rank: 11 },
        { name: "perl", value: 0.0035098349987783333, rank: 12 },
        { name: "assembly", value: 0.0020000798540733334, rank: 13 },
      ],
    ],
    [
      "03-01-2015",
      [
        { name: "javascript", value: 0.10884324986921999, rank: 0 },
        { name: "java", value: 0.1047801207843, rank: 1 },
        { name: "php", value: 0.07943443779291, rank: 2 },
        { name: "c#", value: 0.0702461653889, rank: 3 },
        { name: "python", value: 0.061496436176109996, rank: 4 },
        { name: "c++", value: 0.03913073342385, rank: 5 },
        { name: "c", value: 0.0207224866984, rank: 6 },
        { name: "swift", value: 0.01905285238002, rank: 7 },
        { name: "r", value: 0.01885735722248, rank: 8 },
        { name: "objective-c", value: 0.01739378536745, rank: 9 },
        { name: "ruby", value: 0.01302948806686, rank: 10 },
        { name: "vb.net", value: 0.00725973909321, rank: 11 },
        { name: "perl", value: 0.0033921051658200004, rank: 12 },
        { name: "assembly", value: 0.00205534098054, rank: 13 },
      ],
    ],
    [
      "04-01-2015",
      [
        { name: "javascript", value: 0.11090124650041833, rank: 0 },
        { name: "java", value: 0.10331379112977333, rank: 1 },
        { name: "php", value: 0.07898733288046833, rank: 2 },
        { name: "c#", value: 0.0707248409585, rank: 3 },
        { name: "python", value: 0.06159776854338166, rank: 4 },
        { name: "c++", value: 0.03818647616544333, rank: 5 },
        { name: "c", value: 0.020177117456621665, rank: 6 },
        { name: "swift", value: 0.020175900190100002, rank: 7 },
        { name: "r", value: 0.018854533670933336, rank: 8 },
        { name: "objective-c", value: 0.017209182200421665, rank: 9 },
        { name: "ruby", value: 0.012896973931545, rank: 10 },
        { name: "vb.net", value: 0.007219538454708333, rank: 11 },
        { name: "perl", value: 0.0032835430329983335, rank: 12 },
        { name: "assembly", value: 0.0019548350847466665, rank: 13 },
      ],
    ],
    [
      "05-01-2015",
      [
        { name: "javascript", value: 0.11295924313161666, rank: 0 },
        { name: "java", value: 0.10184746147524668, rank: 1 },
        { name: "php", value: 0.07854022796802666, rank: 2 },
        { name: "c#", value: 0.0712035165281, rank: 3 },
        { name: "python", value: 0.06169910091065333, rank: 4 },
        { name: "c++", value: 0.03724221890703667, rank: 5 },
        { name: "swift", value: 0.02129894800018, rank: 6 },
        { name: "c", value: 0.01963174821484333, rank: 7 },
        { name: "r", value: 0.018851710119386668, rank: 8 },
        { name: "objective-c", value: 0.01702457903339333, rank: 9 },
        { name: "ruby", value: 0.012764459796230001, rank: 10 },
        { name: "vb.net", value: 0.0071793378162066665, rank: 11 },
        { name: "perl", value: 0.003174980900176667, rank: 12 },
        { name: "assembly", value: 0.0018543291889533333, rank: 13 },
      ],
    ],
    [
      "06-01-2015",
      [
        { name: "javascript", value: 0.115017239762815, rank: 0 },
        { name: "java", value: 0.10038113182072, rank: 1 },
        { name: "php", value: 0.078093123055585, rank: 2 },
        { name: "c#", value: 0.07168219209769999, rank: 3 },
        { name: "python", value: 0.061800433277925, rank: 4 },
        { name: "c++", value: 0.03629796164863, rank: 5 },
        { name: "swift", value: 0.022421995810259998, rank: 6 },
        { name: "c", value: 0.019086378973064998, rank: 7 },
        { name: "r", value: 0.01884888656784, rank: 8 },
        { name: "objective-c", value: 0.016839975866365, rank: 9 },
        { name: "ruby", value: 0.012631945660915, rank: 10 },
        { name: "vb.net", value: 0.007139137177705, rank: 11 },
        { name: "perl", value: 0.0030664187673550003, rank: 12 },
        { name: "assembly", value: 0.00175382329316, rank: 13 },
      ],
    ],
    [
      "07-01-2015",
      [
        { name: "javascript", value: 0.11707523639401332, rank: 0 },
        { name: "java", value: 0.09891480216619333, rank: 1 },
        { name: "php", value: 0.07764601814314334, rank: 2 },
        { name: "c#", value: 0.0721608676673, rank: 3 },
        { name: "python", value: 0.061901765645196664, rank: 4 },
        { name: "c++", value: 0.03535370439022333, rank: 5 },
        { name: "swift", value: 0.02354504362034, rank: 6 },
        { name: "r", value: 0.018846063016293334, rank: 7 },
        { name: "c", value: 0.018541009731286667, rank: 8 },
        { name: "objective-c", value: 0.016655372699336667, rank: 9 },
        { name: "ruby", value: 0.0124994315256, rank: 10 },
        { name: "vb.net", value: 0.007098936539203333, rank: 11 },
        { name: "perl", value: 0.0029578566345333335, rank: 12 },
        { name: "assembly", value: 0.0016533173973666665, rank: 13 },
      ],
    ],
    [
      "08-01-2015",
      [
        { name: "javascript", value: 0.11913323302521166, rank: 0 },
        { name: "java", value: 0.09744847251166668, rank: 1 },
        { name: "php", value: 0.07719891323070167, rank: 2 },
        { name: "c#", value: 0.0726395432369, rank: 3 },
        { name: "python", value: 0.06200309801246833, rank: 4 },
        { name: "c++", value: 0.03440944713181667, rank: 5 },
        { name: "swift", value: 0.02466809143042, rank: 6 },
        { name: "r", value: 0.01884323946474667, rank: 7 },
        { name: "c", value: 0.017995640489508333, rank: 8 },
        { name: "objective-c", value: 0.016470769532308333, rank: 9 },
        { name: "ruby", value: 0.012366917390285, rank: 10 },
        { name: "vb.net", value: 0.007058735900701666, rank: 11 },
        { name: "perl", value: 0.0028492945017116666, rank: 12 },
        { name: "assembly", value: 0.001552811501573333, rank: 13 },
      ],
    ],
    [
      "09-01-2015",
      [
        { name: "javascript", value: 0.12119122965641, rank: 0 },
        { name: "java", value: 0.09598214285714, rank: 1 },
        { name: "php", value: 0.07675180831826, rank: 2 },
        { name: "c#", value: 0.0731182188065, rank: 3 },
        { name: "python", value: 0.06210443037974, rank: 4 },
        { name: "c++", value: 0.03346518987341, rank: 5 },
        { name: "swift", value: 0.0257911392405, rank: 6 },
        { name: "r", value: 0.0188404159132, rank: 7 },
        { name: "c", value: 0.01745027124773, rank: 8 },
        { name: "objective-c", value: 0.01628616636528, rank: 9 },
        { name: "ruby", value: 0.01223440325497, rank: 10 },
        { name: "vb.net", value: 0.0070185352622, rank: 11 },
        { name: "perl", value: 0.00274073236889, rank: 12 },
        { name: "assembly", value: 0.0014523056057799998, rank: 13 },
      ],
    ],
    [
      "10-01-2015",
      [
        { name: "javascript", value: 0.12106271275265999, rank: 0 },
        { name: "java", value: 0.09657569360540834, rank: 1 },
        { name: "php", value: 0.07659695159254501, rank: 2 },
        { name: "c#", value: 0.07227830510900167, rank: 3 },
        { name: "python", value: 0.06347437157296666, rank: 4 },
        { name: "c++", value: 0.03374134516078833, rank: 5 },
        { name: "swift", value: 0.025723004644049998, rank: 6 },
        { name: "r", value: 0.01906752636298, rank: 7 },
        { name: "c", value: 0.017418423904204998, rank: 8 },
        { name: "objective-c", value: 0.015468702575893332, rank: 9 },
        { name: "ruby", value: 0.012078095985598333, rank: 10 },
        { name: "vb.net", value: 0.006929869456601666, rank: 11 },
        { name: "perl", value: 0.0026756308897000003, rank: 12 },
        { name: "assembly", value: 0.0015720040415399998, rank: 13 },
      ],
    ],
    [
      "11-01-2015",
      [
        { name: "javascript", value: 0.12093419584890999, rank: 0 },
        { name: "java", value: 0.09716924435367666, rank: 1 },
        { name: "php", value: 0.07644209486683, rank: 2 },
        { name: "c#", value: 0.07143839141150334, rank: 3 },
        { name: "python", value: 0.06484431276619333, rank: 4 },
        { name: "c++", value: 0.03401750044816667, rank: 5 },
        { name: "swift", value: 0.0256548700476, rank: 6 },
        { name: "r", value: 0.01929463681276, rank: 7 },
        { name: "c", value: 0.01738657656068, rank: 8 },
        { name: "objective-c", value: 0.014651238786506666, rank: 9 },
        { name: "ruby", value: 0.011921788716226666, rank: 10 },
        { name: "vb.net", value: 0.0068412036510033325, rank: 11 },
        { name: "perl", value: 0.00261052941051, rank: 12 },
        { name: "assembly", value: 0.0016917024772999999, rank: 13 },
      ],
    ],
    [
      "12-01-2015",
      [
        { name: "javascript", value: 0.12080567894515999, rank: 0 },
        { name: "java", value: 0.097762795101945, rank: 1 },
        { name: "php", value: 0.076287238141115, rank: 2 },
        { name: "c#", value: 0.070598477714005, rank: 3 },
        { name: "python", value: 0.06621425395942, rank: 4 },
        { name: "c++", value: 0.034293655735545006, rank: 5 },
        { name: "swift", value: 0.02558673545115, rank: 6 },
        { name: "r", value: 0.01952174726254, rank: 7 },
        { name: "c", value: 0.017354729217155, rank: 8 },
        { name: "objective-c", value: 0.01383377499712, rank: 9 },
        { name: "ruby", value: 0.011765481446854999, rank: 10 },
        { name: "vb.net", value: 0.006752537845404999, rank: 11 },
        { name: "perl", value: 0.00254542793132, rank: 12 },
        { name: "assembly", value: 0.00181140091306, rank: 13 },
      ],
    ],
    [
      "01-01-2016",
      [
        { name: "javascript", value: 0.12067716204140999, rank: 0 },
        { name: "java", value: 0.09835634585021333, rank: 1 },
        { name: "php", value: 0.0761323814154, rank: 2 },
        { name: "c#", value: 0.06975856401650667, rank: 3 },
        { name: "python", value: 0.06758419515264666, rank: 4 },
        { name: "c++", value: 0.034569811022923336, rank: 5 },
        { name: "swift", value: 0.025518600854699997, rank: 6 },
        { name: "r", value: 0.01974885771232, rank: 7 },
        { name: "c", value: 0.01732288187363, rank: 8 },
        { name: "objective-c", value: 0.013016311207733333, rank: 9 },
        { name: "ruby", value: 0.011609174177483333, rank: 10 },
        { name: "vb.net", value: 0.006663872039806666, rank: 11 },
        { name: "perl", value: 0.0024803264521300003, rank: 12 },
        { name: "assembly", value: 0.0019310993488200002, rank: 13 },
      ],
    ],
    [
      "02-01-2016",
      [
        { name: "javascript", value: 0.12054864513765999, rank: 0 },
        { name: "java", value: 0.09894989659848165, rank: 1 },
        { name: "php", value: 0.075977524689685, rank: 2 },
        { name: "python", value: 0.06895413634587333, rank: 3 },
        { name: "c#", value: 0.06891865031900833, rank: 4 },
        { name: "c++", value: 0.034845966310301665, rank: 5 },
        { name: "swift", value: 0.02545046625825, rank: 6 },
        { name: "r", value: 0.019975968162099997, rank: 7 },
        { name: "c", value: 0.017291034530105, rank: 8 },
        { name: "objective-c", value: 0.012198847418346667, rank: 9 },
        { name: "ruby", value: 0.011452866908111667, rank: 10 },
        { name: "vb.net", value: 0.0065752062342083325, rank: 11 },
        { name: "perl", value: 0.00241522497294, rank: 12 },
        { name: "assembly", value: 0.00205079778458, rank: 13 },
      ],
    ],
    [
      "03-01-2016",
      [
        { name: "javascript", value: 0.12042012823390999, rank: 0 },
        { name: "java", value: 0.09954344734674998, rank: 1 },
        { name: "php", value: 0.07582266796397, rank: 2 },
        { name: "python", value: 0.0703240775391, rank: 3 },
        { name: "c#", value: 0.06807873662151, rank: 4 },
        { name: "c++", value: 0.03512212159768, rank: 5 },
        { name: "swift", value: 0.025382331661799998, rank: 6 },
        { name: "r", value: 0.020203078611879997, rank: 7 },
        { name: "c", value: 0.01725918718658, rank: 8 },
        { name: "objective-c", value: 0.01138138362896, rank: 9 },
        { name: "ruby", value: 0.01129655963874, rank: 10 },
        { name: "vb.net", value: 0.006486540428609999, rank: 11 },
        { name: "perl", value: 0.00235012349375, rank: 12 },
        { name: "assembly", value: 0.00217049622034, rank: 13 },
      ],
    ],
    [
      "04-01-2016",
      [
        { name: "javascript", value: 0.12039090696652832, rank: 0 },
        { name: "java", value: 0.09734548178338331, rank: 1 },
        { name: "php", value: 0.07512800577844833, rank: 2 },
        { name: "python", value: 0.07071127937835, rank: 3 },
        { name: "c#", value: 0.06762242369027, rank: 4 },
        { name: "c++", value: 0.034310693314688334, rank: 5 },
        { name: "swift", value: 0.02592794381894833, rank: 6 },
        { name: "r", value: 0.020069170114986663, rank: 7 },
        { name: "c", value: 0.016846520291268333, rank: 8 },
        { name: "ruby", value: 0.011301098219065, rank: 9 },
        { name: "objective-c", value: 0.011128041448375, rank: 10 },
        { name: "vb.net", value: 0.006348120727958332, rank: 11 },
        { name: "perl", value: 0.0024155775357116668, rank: 12 },
        { name: "assembly", value: 0.002135695867771667, rank: 13 },
      ],
    ],
    [
      "05-01-2016",
      [
        { name: "javascript", value: 0.12036168569914665, rank: 0 },
        { name: "java", value: 0.09514751622001666, rank: 1 },
        { name: "php", value: 0.07443334359292667, rank: 2 },
        { name: "python", value: 0.0710984812176, rank: 3 },
        { name: "c#", value: 0.06716611075902999, rank: 4 },
        { name: "c++", value: 0.033499265031696666, rank: 5 },
        { name: "swift", value: 0.026473555976096665, rank: 6 },
        { name: "r", value: 0.019935261618093333, rank: 7 },
        { name: "c", value: 0.01643385339595667, rank: 8 },
        { name: "ruby", value: 0.01130563679939, rank: 9 },
        { name: "objective-c", value: 0.01087469926779, rank: 10 },
        { name: "vb.net", value: 0.006209701027306666, rank: 11 },
        { name: "perl", value: 0.0024810315776733335, rank: 12 },
        { name: "assembly", value: 0.0021008955152033333, rank: 13 },
      ],
    ],
    [
      "06-01-2016",
      [
        { name: "javascript", value: 0.12033246443176498, rank: 0 },
        { name: "java", value: 0.09294955065664999, rank: 1 },
        { name: "php", value: 0.073738681407405, rank: 2 },
        { name: "python", value: 0.07148568305684999, rank: 3 },
        { name: "c#", value: 0.06670979782778999, rank: 4 },
        { name: "c++", value: 0.032687836748705, rank: 5 },
        { name: "swift", value: 0.027019168133244998, rank: 6 },
        { name: "r", value: 0.0198013531212, rank: 7 },
        { name: "c", value: 0.016021186500645, rank: 8 },
        { name: "ruby", value: 0.011310175379715, rank: 9 },
        { name: "objective-c", value: 0.010621357087205, rank: 10 },
        { name: "vb.net", value: 0.0060712813266549995, rank: 11 },
        { name: "perl", value: 0.002546485619635, rank: 12 },
        { name: "assembly", value: 0.002066095162635, rank: 13 },
      ],
    ],
    [
      "07-01-2016",
      [
        { name: "javascript", value: 0.12030324316438333, rank: 0 },
        { name: "java", value: 0.09075158509328332, rank: 1 },
        { name: "php", value: 0.07304401922188333, rank: 2 },
        { name: "python", value: 0.0718728848961, rank: 3 },
        { name: "c#", value: 0.06625348489655, rank: 4 },
        { name: "c++", value: 0.03187640846571333, rank: 5 },
        { name: "swift", value: 0.02756478029039333, rank: 6 },
        { name: "r", value: 0.019667444624306665, rank: 7 },
        { name: "c", value: 0.015608519605333333, rank: 8 },
        { name: "ruby", value: 0.01131471396004, rank: 9 },
        { name: "objective-c", value: 0.01036801490662, rank: 10 },
        { name: "vb.net", value: 0.005932861626003333, rank: 11 },
        { name: "perl", value: 0.0026119396615966665, rank: 12 },
        { name: "assembly", value: 0.002031294810066667, rank: 13 },
      ],
    ],
    [
      "08-01-2016",
      [
        { name: "javascript", value: 0.12027402189700166, rank: 0 },
        { name: "java", value: 0.08855361952991667, rank: 1 },
        { name: "php", value: 0.07234935703636167, rank: 2 },
        { name: "python", value: 0.07226008673535, rank: 3 },
        { name: "c#", value: 0.06579717196531, rank: 4 },
        { name: "c++", value: 0.031064980182721667, rank: 5 },
        { name: "swift", value: 0.028110392447541665, rank: 6 },
        { name: "r", value: 0.019533536127413334, rank: 7 },
        { name: "c", value: 0.015195852710021666, rank: 8 },
        { name: "ruby", value: 0.011319252540365, rank: 9 },
        { name: "objective-c", value: 0.010114672726035, rank: 10 },
        { name: "vb.net", value: 0.005794441925351667, rank: 11 },
        { name: "perl", value: 0.0026773937035583333, rank: 12 },
        { name: "assembly", value: 0.001996494457498333, rank: 13 },
      ],
    ],
    [
      "09-01-2016",
      [
        { name: "javascript", value: 0.12024480062962, rank: 0 },
        { name: "java", value: 0.08635565396655, rank: 1 },
        { name: "python", value: 0.0726472885746, rank: 2 },
        { name: "php", value: 0.07165469485084, rank: 3 },
        { name: "c#", value: 0.06534085903407, rank: 4 },
        { name: "c++", value: 0.03025355189973, rank: 5 },
        { name: "swift", value: 0.02865600460469, rank: 6 },
        { name: "r", value: 0.01939962763052, rank: 7 },
        { name: "c", value: 0.01478318581471, rank: 8 },
        { name: "ruby", value: 0.01132379112069, rank: 9 },
        { name: "objective-c", value: 0.00986133054545, rank: 10 },
        { name: "vb.net", value: 0.0056560222247, rank: 11 },
        { name: "perl", value: 0.00274284774552, rank: 12 },
        { name: "assembly", value: 0.00196169410493, rank: 13 },
      ],
    ],
    [
      "10-01-2016",
      [
        { name: "javascript", value: 0.11998876390611499, rank: 0 },
        { name: "java", value: 0.08642107716592, rank: 1 },
        { name: "python", value: 0.07483738732239, rank: 2 },
        { name: "php", value: 0.07147523534733166, rank: 3 },
        { name: "c#", value: 0.06530090884110833, rank: 4 },
        { name: "c++", value: 0.030411316590693332, rank: 5 },
        { name: "swift", value: 0.027733756306793332, rank: 6 },
        { name: "r", value: 0.020005937555988333, rank: 7 },
        { name: "c", value: 0.014798460565783333, rank: 8 },
        { name: "ruby", value: 0.010929477820769999, rank: 9 },
        { name: "objective-c", value: 0.00942650162388, rank: 10 },
        { name: "vb.net", value: 0.005593637946896666, rank: 11 },
        { name: "perl", value: 0.0026324858245616667, rank: 12 },
        { name: "assembly", value: 0.00194567947445, rank: 13 },
      ],
    ],
    [
      "11-01-2016",
      [
        { name: "javascript", value: 0.11973272718261, rank: 0 },
        { name: "java", value: 0.08648650036529, rank: 1 },
        { name: "python", value: 0.07702748607017999, rank: 2 },
        { name: "php", value: 0.07129577584382334, rank: 3 },
        { name: "c#", value: 0.06526095864814667, rank: 4 },
        { name: "c++", value: 0.030569081281656665, rank: 5 },
        { name: "swift", value: 0.026811508008896666, rank: 6 },
        { name: "r", value: 0.020612247481456666, rank: 7 },
        { name: "c", value: 0.014813735316856667, rank: 8 },
        { name: "ruby", value: 0.01053516452085, rank: 9 },
        { name: "objective-c", value: 0.00899167270231, rank: 10 },
        { name: "vb.net", value: 0.0055312536690933336, rank: 11 },
        { name: "perl", value: 0.0025221239036033335, rank: 12 },
        { name: "assembly", value: 0.00192966484397, rank: 13 },
      ],
    ],
    [
      "12-01-2016",
      [
        { name: "javascript", value: 0.119476690459105, rank: 0 },
        { name: "java", value: 0.08655192356465999, rank: 1 },
        { name: "python", value: 0.07921758481797, rank: 2 },
        { name: "php", value: 0.071116316340315, rank: 3 },
        { name: "c#", value: 0.065221008455185, rank: 4 },
        { name: "c++", value: 0.03072684597262, rank: 5 },
        { name: "swift", value: 0.025889259711, rank: 6 },
        { name: "r", value: 0.021218557406925, rank: 7 },
        { name: "c", value: 0.01482901006793, rank: 8 },
        { name: "ruby", value: 0.01014085122093, rank: 9 },
        { name: "objective-c", value: 0.00855684378074, rank: 10 },
        { name: "vb.net", value: 0.00546886939129, rank: 11 },
        { name: "perl", value: 0.002411761982645, rank: 12 },
        { name: "assembly", value: 0.0019136502134900002, rank: 13 },
      ],
    ],
    [
      "01-01-2017",
      [
        { name: "javascript", value: 0.1192206537356, rank: 0 },
        { name: "java", value: 0.08661734676402999, rank: 1 },
        { name: "python", value: 0.08140768356576, rank: 2 },
        { name: "php", value: 0.07093685683680666, rank: 3 },
        { name: "c#", value: 0.06518105826222333, rank: 4 },
        { name: "c++", value: 0.030884610663583334, rank: 5 },
        { name: "swift", value: 0.024967011413103334, rank: 6 },
        { name: "r", value: 0.021824867332393333, rank: 7 },
        { name: "c", value: 0.014844284819003333, rank: 8 },
        { name: "ruby", value: 0.009746537921009999, rank: 9 },
        { name: "objective-c", value: 0.00812201485917, rank: 10 },
        { name: "vb.net", value: 0.005406485113486666, rank: 11 },
        { name: "perl", value: 0.0023014000616866665, rank: 12 },
        { name: "assembly", value: 0.0018976355830100002, rank: 13 },
      ],
    ],
    [
      "02-01-2017",
      [
        { name: "javascript", value: 0.11896461701209499, rank: 0 },
        { name: "java", value: 0.08668276996339999, rank: 1 },
        { name: "python", value: 0.08359778231355, rank: 2 },
        { name: "php", value: 0.07075739733329833, rank: 3 },
        { name: "c#", value: 0.06514110806926167, rank: 4 },
        { name: "c++", value: 0.031042375354546667, rank: 5 },
        { name: "swift", value: 0.024044763115206667, rank: 6 },
        { name: "r", value: 0.022431177257861666, rank: 7 },
        { name: "c", value: 0.014859559570076668, rank: 8 },
        { name: "ruby", value: 0.009352224621089998, rank: 9 },
        { name: "objective-c", value: 0.0076871859376, rank: 10 },
        { name: "vb.net", value: 0.005344100835683333, rank: 11 },
        { name: "perl", value: 0.0021910381407283333, rank: 12 },
        { name: "assembly", value: 0.0018816209525300003, rank: 13 },
      ],
    ],
    [
      "03-01-2017",
      [
        { name: "javascript", value: 0.11870858028859, rank: 0 },
        { name: "java", value: 0.08674819316277, rank: 1 },
        { name: "python", value: 0.08578788106134, rank: 2 },
        { name: "php", value: 0.07057793782979, rank: 3 },
        { name: "c#", value: 0.0651011578763, rank: 4 },
        { name: "c++", value: 0.03120014004551, rank: 5 },
        { name: "swift", value: 0.02312251481731, rank: 6 },
        { name: "r", value: 0.02303748718333, rank: 7 },
        { name: "c", value: 0.01487483432115, rank: 8 },
        { name: "ruby", value: 0.00895791132117, rank: 9 },
        { name: "objective-c", value: 0.00725235701603, rank: 10 },
        { name: "vb.net", value: 0.00528171655788, rank: 11 },
        { name: "perl", value: 0.00208067621977, rank: 12 },
        { name: "assembly", value: 0.0018656063220500003, rank: 13 },
      ],
    ],
    [
      "04-01-2017",
      [
        { name: "javascript", value: 0.11862510096707499, rank: 0 },
        { name: "python", value: 0.08752510683970166, rank: 1 },
        { name: "java", value: 0.08552866121351832, rank: 2 },
        { name: "php", value: 0.06993234558689666, rank: 3 },
        { name: "c#", value: 0.064514532908985, rank: 4 },
        { name: "c++", value: 0.030643332076835, rank: 5 },
        { name: "r", value: 0.023575853977121666, rank: 6 },
        { name: "swift", value: 0.023187673425158335, rank: 7 },
        { name: "c", value: 0.01457793395853, rank: 8 },
        { name: "ruby", value: 0.008732199566775, rank: 9 },
        { name: "objective-c", value: 0.006967921878166666, rank: 10 },
        { name: "vb.net", value: 0.005176508594433333, rank: 11 },
        { name: "perl", value: 0.002056155269975, rank: 12 },
        { name: "assembly", value: 0.001791961897156667, rank: 13 },
      ],
    ],
    [
      "05-01-2017",
      [
        { name: "javascript", value: 0.11854162164556, rank: 0 },
        { name: "python", value: 0.08926233261806334, rank: 1 },
        { name: "java", value: 0.08430912926426666, rank: 2 },
        { name: "php", value: 0.06928675334400333, rank: 3 },
        { name: "c#", value: 0.06392790794167, rank: 4 },
        { name: "c++", value: 0.030086524108159998, rank: 5 },
        { name: "r", value: 0.024114220770913332, rank: 6 },
        { name: "swift", value: 0.023252832033006668, rank: 7 },
        { name: "c", value: 0.01428103359591, rank: 8 },
        { name: "ruby", value: 0.00850648781238, rank: 9 },
        { name: "objective-c", value: 0.006683486740303333, rank: 10 },
        { name: "vb.net", value: 0.0050713006309866665, rank: 11 },
        { name: "perl", value: 0.0020316343201799997, rank: 12 },
        { name: "assembly", value: 0.0017183174722633335, rank: 13 },
      ],
    ],
    [
      "06-01-2017",
      [
        { name: "javascript", value: 0.118458142324045, rank: 0 },
        { name: "python", value: 0.090999558396425, rank: 1 },
        { name: "java", value: 0.083089597315015, rank: 2 },
        { name: "php", value: 0.06864116110110999, rank: 3 },
        { name: "c#", value: 0.063341282974355, rank: 4 },
        { name: "c++", value: 0.029529716139484997, rank: 5 },
        { name: "r", value: 0.024652587564705, rank: 6 },
        { name: "swift", value: 0.023317990640855, rank: 7 },
        { name: "c", value: 0.013984133233290001, rank: 8 },
        { name: "ruby", value: 0.008280776057985, rank: 9 },
        { name: "objective-c", value: 0.00639905160244, rank: 10 },
        { name: "vb.net", value: 0.00496609266754, rank: 11 },
        { name: "perl", value: 0.002007113370385, rank: 12 },
        { name: "assembly", value: 0.00164467304737, rank: 13 },
      ],
    ],
    [
      "07-01-2017",
      [
        { name: "javascript", value: 0.11837466300253, rank: 0 },
        { name: "python", value: 0.09273678417478666, rank: 1 },
        { name: "java", value: 0.08187006536576333, rank: 2 },
        { name: "php", value: 0.06799556885821666, rank: 3 },
        { name: "c#", value: 0.06275465800704, rank: 4 },
        { name: "c++", value: 0.02897290817081, rank: 5 },
        { name: "r", value: 0.025190954358496668, rank: 6 },
        { name: "swift", value: 0.023383149248703335, rank: 7 },
        { name: "c", value: 0.01368723287067, rank: 8 },
        { name: "ruby", value: 0.008055064303590001, rank: 9 },
        { name: "objective-c", value: 0.006114616464576666, rank: 10 },
        { name: "vb.net", value: 0.004860884704093333, rank: 11 },
        { name: "perl", value: 0.00198259242059, rank: 12 },
        { name: "assembly", value: 0.0015710286224766667, rank: 13 },
      ],
    ],
    [
      "08-01-2017",
      [
        { name: "javascript", value: 0.11829118368101499, rank: 0 },
        { name: "python", value: 0.09447400995314834, rank: 1 },
        { name: "java", value: 0.08065053341651165, rank: 2 },
        { name: "php", value: 0.06734997661532333, rank: 3 },
        { name: "c#", value: 0.062168033039725, rank: 4 },
        { name: "c++", value: 0.028416100202135, rank: 5 },
        { name: "r", value: 0.025729321152288334, rank: 6 },
        { name: "swift", value: 0.023448307856551668, rank: 7 },
        { name: "c", value: 0.01339033250805, rank: 8 },
        { name: "ruby", value: 0.007829352549195, rank: 9 },
        { name: "objective-c", value: 0.005830181326713332, rank: 10 },
        { name: "vb.net", value: 0.004755676740646667, rank: 11 },
        { name: "perl", value: 0.001958071470795, rank: 12 },
        { name: "assembly", value: 0.0014973841975833334, rank: 13 },
      ],
    ],
    [
      "09-01-2017",
      [
        { name: "javascript", value: 0.1182077043595, rank: 0 },
        { name: "python", value: 0.09621123573151, rank: 1 },
        { name: "java", value: 0.07943100146726, rank: 2 },
        { name: "php", value: 0.06670438437243, rank: 3 },
        { name: "c#", value: 0.06158140807241, rank: 4 },
        { name: "c++", value: 0.02785929223346, rank: 5 },
        { name: "r", value: 0.02626768794608, rank: 6 },
        { name: "swift", value: 0.0235134664644, rank: 7 },
        { name: "c", value: 0.01309343214543, rank: 8 },
        { name: "ruby", value: 0.007603640794800001, rank: 9 },
        { name: "objective-c", value: 0.005545746188849999, rank: 10 },
        { name: "vb.net", value: 0.0046504687772, rank: 11 },
        { name: "perl", value: 0.001933550521, rank: 12 },
        { name: "assembly", value: 0.00142373977269, rank: 13 },
      ],
    ],
    [
      "10-01-2017",
      [
        { name: "javascript", value: 0.11715863951515833, rank: 0 },
        { name: "python", value: 0.097606475174535, rank: 1 },
        { name: "java", value: 0.07940262687977166, rank: 2 },
        { name: "php", value: 0.06519788554938666, rank: 3 },
        { name: "c#", value: 0.060865560193463335, rank: 4 },
        { name: "c++", value: 0.028269380024414998, rank: 5 },
        { name: "r", value: 0.02685362132734, rank: 6 },
        { name: "swift", value: 0.023549525683413335, rank: 7 },
        { name: "c", value: 0.013320721929533333, rank: 8 },
        { name: "ruby", value: 0.007370549780556668, rank: 9 },
        { name: "objective-c", value: 0.005205612726344999, rank: 10 },
        { name: "vb.net", value: 0.004530502463783333, rank: 11 },
        { name: "perl", value: 0.0018931651374416666, rank: 12 },
        { name: "assembly", value: 0.0014955381748549999, rank: 13 },
      ],
    ],
    [
      "11-01-2017",
      [
        { name: "javascript", value: 0.11610957467081666, rank: 0 },
        { name: "python", value: 0.09900171461756, rank: 1 },
        { name: "java", value: 0.07937425229228333, rank: 2 },
        { name: "php", value: 0.06369138672634334, rank: 3 },
        { name: "c#", value: 0.060149712314516664, rank: 4 },
        { name: "c++", value: 0.028679467815369997, rank: 5 },
        { name: "r", value: 0.0274395547086, rank: 6 },
        { name: "swift", value: 0.023585584902426668, rank: 7 },
        { name: "c", value: 0.013548011713636666, rank: 8 },
        { name: "ruby", value: 0.007137458766313334, rank: 9 },
        { name: "objective-c", value: 0.004865479263839999, rank: 10 },
        { name: "vb.net", value: 0.004410536150366667, rank: 11 },
        { name: "perl", value: 0.0018527797538833333, rank: 12 },
        { name: "assembly", value: 0.00156733657702, rank: 13 },
      ],
    ],
    [
      "12-01-2017",
      [
        { name: "javascript", value: 0.115060509826475, rank: 0 },
        { name: "python", value: 0.10039695406058499, rank: 1 },
        { name: "java", value: 0.079345877704795, rank: 2 },
        { name: "php", value: 0.0621848879033, rank: 3 },
        { name: "c#", value: 0.05943386443557, rank: 4 },
        { name: "c++", value: 0.029089555606324997, rank: 5 },
        { name: "r", value: 0.028025488089860003, rank: 6 },
        { name: "swift", value: 0.02362164412144, rank: 7 },
        { name: "c", value: 0.013775301497739999, rank: 8 },
        { name: "ruby", value: 0.006904367752070001, rank: 9 },
        { name: "objective-c", value: 0.004525345801334999, rank: 10 },
        { name: "vb.net", value: 0.00429056983695, rank: 11 },
        { name: "perl", value: 0.001812394370325, rank: 12 },
        { name: "assembly", value: 0.001639134979185, rank: 13 },
      ],
    ],
    [
      "01-01-2018",
      [
        { name: "javascript", value: 0.11401144498213334, rank: 0 },
        { name: "python", value: 0.10179219350361, rank: 1 },
        { name: "java", value: 0.07931750311730666, rank: 2 },
        { name: "php", value: 0.06067838908025667, rank: 3 },
        { name: "c#", value: 0.058718016556623336, rank: 4 },
        { name: "c++", value: 0.029499643397279996, rank: 5 },
        { name: "r", value: 0.028611421471120002, rank: 6 },
        { name: "swift", value: 0.023657703340453334, rank: 7 },
        { name: "c", value: 0.014002591281843333, rank: 8 },
        { name: "ruby", value: 0.006671276737826667, rank: 9 },
        { name: "objective-c", value: 0.0041852123388299994, rank: 10 },
        { name: "vb.net", value: 0.004170603523533333, rank: 11 },
        { name: "perl", value: 0.0017720089867666667, rank: 12 },
        { name: "assembly", value: 0.00171093338135, rank: 13 },
      ],
    ],
    [
      "02-01-2018",
      [
        { name: "javascript", value: 0.11296238013779167, rank: 0 },
        { name: "python", value: 0.103187432946635, rank: 1 },
        { name: "java", value: 0.07928912852981833, rank: 2 },
        { name: "php", value: 0.05917189025721333, rank: 3 },
        { name: "c#", value: 0.058002168677676665, rank: 4 },
        { name: "c++", value: 0.029909731188234995, rank: 5 },
        { name: "r", value: 0.02919735485238, rank: 6 },
        { name: "swift", value: 0.023693762559466668, rank: 7 },
        { name: "c", value: 0.014229881065946666, rank: 8 },
        { name: "ruby", value: 0.006438185723583334, rank: 9 },
        { name: "vb.net", value: 0.004050637210116666, rank: 10 },
        { name: "objective-c", value: 0.0038450788763249996, rank: 11 },
        { name: "assembly", value: 0.0017827317835150001, rank: 12 },
        { name: "perl", value: 0.0017316236032083334, rank: 13 },
      ],
    ],
    [
      "03-01-2018",
      [
        { name: "javascript", value: 0.11191331529345, rank: 0 },
        { name: "python", value: 0.10458267238966, rank: 1 },
        { name: "java", value: 0.07926075394233, rank: 2 },
        { name: "php", value: 0.05766539143417, rank: 3 },
        { name: "c#", value: 0.05728632079873, rank: 4 },
        { name: "c++", value: 0.030319818979189995, rank: 5 },
        { name: "r", value: 0.02978328823364, rank: 6 },
        { name: "swift", value: 0.02372982177848, rank: 7 },
        { name: "c", value: 0.01445717085005, rank: 8 },
        { name: "ruby", value: 0.00620509470934, rank: 9 },
        { name: "vb.net", value: 0.0039306708967, rank: 10 },
        { name: "objective-c", value: 0.00350494541382, rank: 11 },
        { name: "assembly", value: 0.00185453018568, rank: 12 },
        { name: "perl", value: 0.00169123821965, rank: 13 },
      ],
    ],
    [
      "04-01-2018",
      [
        { name: "javascript", value: 0.11196364185724, rank: 0 },
        { name: "python", value: 0.105900133422825, rank: 1 },
        { name: "java", value: 0.078666705030845, rank: 2 },
        { name: "c#", value: 0.05754464316970167, rank: 3 },
        { name: "php", value: 0.05708358881238, rank: 4 },
        { name: "c++", value: 0.02965835741194166, rank: 5 },
        { name: "r", value: 0.029233347236533334, rank: 6 },
        { name: "swift", value: 0.023443248832073334, rank: 7 },
        { name: "c", value: 0.014208670363726666, rank: 8 },
        { name: "ruby", value: 0.006080451486605, rank: 9 },
        { name: "vb.net", value: 0.003953642674448333, rank: 10 },
        { name: "objective-c", value: 0.0034046348003350002, rank: 11 },
        { name: "assembly", value: 0.0018513354495066667, rank: 12 },
        { name: "perl", value: 0.0016501255671416666, rank: 13 },
      ],
    ],
    [
      "05-01-2018",
      [
        { name: "javascript", value: 0.11201396842103, rank: 0 },
        { name: "python", value: 0.10721759445599, rank: 1 },
        { name: "java", value: 0.07807265611936, rank: 2 },
        { name: "c#", value: 0.05780296554067333, rank: 3 },
        { name: "php", value: 0.05650178619059, rank: 4 },
        { name: "c++", value: 0.02899689584469333, rank: 5 },
        { name: "r", value: 0.028683406239426668, rank: 6 },
        { name: "swift", value: 0.023156675885666667, rank: 7 },
        { name: "c", value: 0.013960169877403332, rank: 8 },
        { name: "ruby", value: 0.0059558082638700004, rank: 9 },
        { name: "vb.net", value: 0.003976614452196666, rank: 10 },
        { name: "objective-c", value: 0.0033043241868500003, rank: 11 },
        { name: "assembly", value: 0.0018481407133333334, rank: 12 },
        { name: "perl", value: 0.0016090129146333334, rank: 13 },
      ],
    ],
    [
      "06-01-2018",
      [
        { name: "javascript", value: 0.11206429498482, rank: 0 },
        { name: "python", value: 0.108535055489155, rank: 1 },
        { name: "java", value: 0.077478607207875, rank: 2 },
        { name: "c#", value: 0.058061287911645, rank: 3 },
        { name: "php", value: 0.0559199835688, rank: 4 },
        { name: "c++", value: 0.028335434277444997, rank: 5 },
        { name: "r", value: 0.02813346524232, rank: 6 },
        { name: "swift", value: 0.02287010293926, rank: 7 },
        { name: "c", value: 0.01371166939108, rank: 8 },
        { name: "ruby", value: 0.005831165041135, rank: 9 },
        { name: "vb.net", value: 0.003999586229945, rank: 10 },
        { name: "objective-c", value: 0.003204013573365, rank: 11 },
        { name: "assembly", value: 0.0018449459771600002, rank: 12 },
        { name: "perl", value: 0.0015679002621250002, rank: 13 },
      ],
    ],
    [
      "07-01-2018",
      [
        { name: "javascript", value: 0.11211462154861, rank: 0 },
        { name: "python", value: 0.10985251652232, rank: 1 },
        { name: "java", value: 0.07688455829639, rank: 2 },
        { name: "c#", value: 0.05831961028261667, rank: 3 },
        { name: "php", value: 0.055338180947010006, rank: 4 },
        { name: "c++", value: 0.027673972710196663, rank: 5 },
        { name: "r", value: 0.027583524245213334, rank: 6 },
        { name: "swift", value: 0.022583529992853336, rank: 7 },
        { name: "c", value: 0.013463168904756666, rank: 8 },
        { name: "ruby", value: 0.0057065218184, rank: 9 },
        { name: "vb.net", value: 0.004022558007693334, rank: 10 },
        { name: "objective-c", value: 0.00310370295988, rank: 11 },
        { name: "assembly", value: 0.0018417512409866668, rank: 12 },
        { name: "perl", value: 0.0015267876096166668, rank: 13 },
      ],
    ],
    [
      "08-01-2018",
      [
        { name: "javascript", value: 0.11216494811239999, rank: 0 },
        { name: "python", value: 0.111169977555485, rank: 1 },
        { name: "java", value: 0.076290509384905, rank: 2 },
        { name: "c#", value: 0.05857793265358833, rank: 3 },
        { name: "php", value: 0.054756378325220005, rank: 4 },
        { name: "r", value: 0.027033583248106667, rank: 5 },
        { name: "c++", value: 0.027012511142948333, rank: 6 },
        { name: "swift", value: 0.02229695704644667, rank: 7 },
        { name: "c", value: 0.013214668418433332, rank: 8 },
        { name: "ruby", value: 0.005581878595665, rank: 9 },
        { name: "vb.net", value: 0.0040455297854416665, rank: 10 },
        { name: "objective-c", value: 0.003003392346395, rank: 11 },
        { name: "assembly", value: 0.0018385565048133334, rank: 12 },
        { name: "perl", value: 0.0014856749571083333, rank: 13 },
      ],
    ],
    [
      "09-01-2018",
      [
        { name: "python", value: 0.11248743858865, rank: 0 },
        { name: "javascript", value: 0.11221527467619, rank: 1 },
        { name: "java", value: 0.07569646047342, rank: 2 },
        { name: "c#", value: 0.05883625502456, rank: 3 },
        { name: "php", value: 0.054174575703430004, rank: 4 },
        { name: "r", value: 0.026483642251, rank: 5 },
        { name: "c++", value: 0.0263510495757, rank: 6 },
        { name: "swift", value: 0.02201038410004, rank: 7 },
        { name: "c", value: 0.01296616793211, rank: 8 },
        { name: "ruby", value: 0.00545723537293, rank: 9 },
        { name: "vb.net", value: 0.00406850156319, rank: 10 },
        { name: "objective-c", value: 0.00290308173291, rank: 11 },
        { name: "assembly", value: 0.0018353617686400002, rank: 12 },
        { name: "perl", value: 0.0014445623046, rank: 13 },
      ],
    ],
    [
      "10-01-2018",
      [
        { name: "python", value: 0.11463322481584834, rank: 0 },
        { name: "javascript", value: 0.11171522818916332, rank: 1 },
        { name: "java", value: 0.07580267255346501, rank: 2 },
        { name: "c#", value: 0.05845563337065833, rank: 3 },
        { name: "php", value: 0.053385568335370004, rank: 4 },
        { name: "r", value: 0.026798542810278332, rank: 5 },
        { name: "c++", value: 0.026638096369113334, rank: 6 },
        { name: "swift", value: 0.021432800476991667, rank: 7 },
        { name: "c", value: 0.013320458723916666, rank: 8 },
        { name: "ruby", value: 0.005432272463271667, rank: 9 },
        { name: "vb.net", value: 0.004037719699346667, rank: 10 },
        { name: "objective-c", value: 0.002734560218255, rank: 11 },
        { name: "assembly", value: 0.001825020698935, rank: 12 },
        { name: "perl", value: 0.0014473205777750001, rank: 13 },
      ],
    ],
    [
      "11-01-2018",
      [
        { name: "python", value: 0.11677901104304667, rank: 0 },
        { name: "javascript", value: 0.11121518170213666, rank: 1 },
        { name: "java", value: 0.07590888463351, rank: 2 },
        { name: "c#", value: 0.058075011716756664, rank: 3 },
        { name: "php", value: 0.05259656096731, rank: 4 },
        { name: "r", value: 0.027113443369556667, rank: 5 },
        { name: "c++", value: 0.026925143162526668, rank: 6 },
        { name: "swift", value: 0.020855216853943336, rank: 7 },
        { name: "c", value: 0.013674749515723332, rank: 8 },
        { name: "ruby", value: 0.005407309553613333, rank: 9 },
        { name: "vb.net", value: 0.0040069378355033335, rank: 10 },
        { name: "objective-c", value: 0.0025660387036, rank: 11 },
        { name: "assembly", value: 0.0018146796292300002, rank: 12 },
        { name: "perl", value: 0.0014500788509500002, rank: 13 },
      ],
    ],
    [
      "12-01-2018",
      [
        { name: "python", value: 0.11892479727024499, rank: 0 },
        { name: "javascript", value: 0.11071513521511, rank: 1 },
        { name: "java", value: 0.076015096713555, rank: 2 },
        { name: "c#", value: 0.057694390062855, rank: 3 },
        { name: "php", value: 0.05180755359925, rank: 4 },
        { name: "r", value: 0.027428343928835, rank: 5 },
        { name: "c++", value: 0.02721218995594, rank: 6 },
        { name: "swift", value: 0.020277633230895, rank: 7 },
        { name: "c", value: 0.01402904030753, rank: 8 },
        { name: "ruby", value: 0.005382346643955, rank: 9 },
        { name: "vb.net", value: 0.00397615597166, rank: 10 },
        { name: "objective-c", value: 0.0023975171889450003, rank: 11 },
        { name: "assembly", value: 0.001804338559525, rank: 12 },
        { name: "perl", value: 0.001452837124125, rank: 13 },
      ],
    ],
    [
      "01-01-2019",
      [
        { name: "python", value: 0.12107058349744333, rank: 0 },
        { name: "javascript", value: 0.11021508872808333, rank: 1 },
        { name: "java", value: 0.0761213087936, rank: 2 },
        { name: "c#", value: 0.05731376840895333, rank: 3 },
        { name: "php", value: 0.05101854623119, rank: 4 },
        { name: "r", value: 0.02774324448811333, rank: 5 },
        { name: "c++", value: 0.027499236749353333, rank: 6 },
        { name: "swift", value: 0.019700049607846666, rank: 7 },
        { name: "c", value: 0.014383331099336667, rank: 8 },
        { name: "ruby", value: 0.005357383734296667, rank: 9 },
        { name: "vb.net", value: 0.003945374107816667, rank: 10 },
        { name: "objective-c", value: 0.0022289956742900002, rank: 11 },
        { name: "assembly", value: 0.00179399748982, rank: 12 },
        { name: "perl", value: 0.0014555953973, rank: 13 },
      ],
    ],
    [
      "02-01-2019",
      [
        { name: "python", value: 0.12321636972464167, rank: 0 },
        { name: "javascript", value: 0.10971504224105666, rank: 1 },
        { name: "java", value: 0.07622752087364501, rank: 2 },
        { name: "c#", value: 0.056933146755051664, rank: 3 },
        { name: "php", value: 0.05022953886313, rank: 4 },
        { name: "r", value: 0.028058145047391667, rank: 5 },
        { name: "c++", value: 0.027786283542766667, rank: 6 },
        { name: "swift", value: 0.019122465984798335, rank: 7 },
        { name: "c", value: 0.014737621891143332, rank: 8 },
        { name: "ruby", value: 0.005332420824638333, rank: 9 },
        { name: "vb.net", value: 0.0039145922439733334, rank: 10 },
        { name: "objective-c", value: 0.002060474159635, rank: 11 },
        { name: "assembly", value: 0.001783656420115, rank: 12 },
        { name: "perl", value: 0.001458353670475, rank: 13 },
      ],
    ],
    [
      "03-01-2019",
      [
        { name: "python", value: 0.12536215595184, rank: 0 },
        { name: "javascript", value: 0.10921499575403, rank: 1 },
        { name: "java", value: 0.07633373295369, rank: 2 },
        { name: "c#", value: 0.05655252510115, rank: 3 },
        { name: "php", value: 0.04944053149507, rank: 4 },
        { name: "r", value: 0.02837304560667, rank: 5 },
        { name: "c++", value: 0.02807333033618, rank: 6 },
        { name: "swift", value: 0.01854488236175, rank: 7 },
        { name: "c", value: 0.01509191268295, rank: 8 },
        { name: "ruby", value: 0.00530745791498, rank: 9 },
        { name: "vb.net", value: 0.00388381038013, rank: 10 },
        { name: "objective-c", value: 0.00189195264498, rank: 11 },
        { name: "assembly", value: 0.00177331535041, rank: 12 },
        { name: "perl", value: 0.0014611119436500001, rank: 13 },
      ],
    ],
    [
      "04-01-2019",
      [
        { name: "python", value: 0.12534420833057, rank: 0 },
        { name: "javascript", value: 0.10942254445275333, rank: 1 },
        { name: "java", value: 0.07563615744332834, rank: 2 },
        { name: "c#", value: 0.056840456251564996, rank: 3 },
        { name: "php", value: 0.048182297440106665, rank: 4 },
        { name: "r", value: 0.028515579313638333, rank: 5 },
        { name: "c++", value: 0.02810780619629167, rank: 6 },
        { name: "swift", value: 0.01860692715302, rank: 7 },
        { name: "c", value: 0.015076587778023332, rank: 8 },
        { name: "ruby", value: 0.00531092449625, rank: 9 },
        { name: "vb.net", value: 0.0038073058799033333, rank: 10 },
        { name: "objective-c", value: 0.0018828488939533334, rank: 11 },
        { name: "assembly", value: 0.0017558120863499999, rank: 12 },
        { name: "perl", value: 0.0014613457514583335, rank: 13 },
      ],
    ],
    [
      "05-01-2019",
      [
        { name: "python", value: 0.1253262607093, rank: 0 },
        { name: "javascript", value: 0.10963009315147666, rank: 1 },
        { name: "java", value: 0.07493858193296667, rank: 2 },
        { name: "c#", value: 0.05712838740198, rank: 3 },
        { name: "php", value: 0.046924063385143336, rank: 4 },
        { name: "r", value: 0.028658113020606668, rank: 5 },
        { name: "c++", value: 0.028142282056403334, rank: 6 },
        { name: "swift", value: 0.01866897194429, rank: 7 },
        { name: "c", value: 0.015061262873096667, rank: 8 },
        { name: "ruby", value: 0.00531439107752, rank: 9 },
        { name: "vb.net", value: 0.0037308013796766666, rank: 10 },
        { name: "objective-c", value: 0.0018737451429266668, rank: 11 },
        { name: "assembly", value: 0.00173830882229, rank: 12 },
        { name: "perl", value: 0.0014615795592666668, rank: 13 },
      ],
    ],
    [
      "06-01-2019",
      [
        { name: "python", value: 0.12530831308803, rank: 0 },
        { name: "javascript", value: 0.10983764185020001, rank: 1 },
        { name: "java", value: 0.074241006422605, rank: 2 },
        { name: "c#", value: 0.057416318552395, rank: 3 },
        { name: "php", value: 0.04566582933018, rank: 4 },
        { name: "r", value: 0.028800646727575, rank: 5 },
        { name: "c++", value: 0.028176757916515003, rank: 6 },
        { name: "swift", value: 0.018731016735559998, rank: 7 },
        { name: "c", value: 0.015045937968170001, rank: 8 },
        { name: "ruby", value: 0.0053178576587900005, rank: 9 },
        { name: "vb.net", value: 0.0036542968794500003, rank: 10 },
        { name: "objective-c", value: 0.0018646413919, rank: 11 },
        { name: "assembly", value: 0.0017208055582300001, rank: 12 },
        { name: "perl", value: 0.001461813367075, rank: 13 },
      ],
    ],
    [
      "07-01-2019",
      [
        { name: "python", value: 0.12529036546676, rank: 0 },
        { name: "javascript", value: 0.11004519054892334, rank: 1 },
        { name: "java", value: 0.07354343091224334, rank: 2 },
        { name: "c#", value: 0.05770424970281, rank: 3 },
        { name: "php", value: 0.04440759527521666, rank: 4 },
        { name: "r", value: 0.028943180434543334, rank: 5 },
        { name: "c++", value: 0.02821123377662667, rank: 6 },
        { name: "swift", value: 0.01879306152683, rank: 7 },
        { name: "c", value: 0.015030613063243334, rank: 8 },
        { name: "ruby", value: 0.00532132424006, rank: 9 },
        { name: "vb.net", value: 0.0035777923792233335, rank: 10 },
        { name: "objective-c", value: 0.0018555376408733333, rank: 11 },
        { name: "assembly", value: 0.00170330229417, rank: 12 },
        { name: "perl", value: 0.0014620471748833332, rank: 13 },
      ],
    ],
    [
      "08-01-2019",
      [
        { name: "python", value: 0.12527241784549, rank: 0 },
        { name: "javascript", value: 0.11025273924764667, rank: 1 },
        { name: "java", value: 0.07284585540188167, rank: 2 },
        { name: "c#", value: 0.057992180853225, rank: 3 },
        { name: "php", value: 0.043149361220253334, rank: 4 },
        { name: "r", value: 0.02908571414151167, rank: 5 },
        { name: "c++", value: 0.028245709636738336, rank: 6 },
        { name: "swift", value: 0.0188551063181, rank: 7 },
        { name: "c", value: 0.015015288158316667, rank: 8 },
        { name: "ruby", value: 0.00532479082133, rank: 9 },
        { name: "vb.net", value: 0.0035012878789966667, rank: 10 },
        { name: "objective-c", value: 0.0018464338898466668, rank: 11 },
        { name: "assembly", value: 0.00168579903011, rank: 12 },
        { name: "perl", value: 0.0014622809826916666, rank: 13 },
      ],
    ],
    [
      "09-01-2019",
      [
        { name: "python", value: 0.12525447022422, rank: 0 },
        { name: "javascript", value: 0.11046028794637, rank: 1 },
        { name: "java", value: 0.07214827989152, rank: 2 },
        { name: "c#", value: 0.05828011200364, rank: 3 },
        { name: "php", value: 0.04189112716529, rank: 4 },
        { name: "r", value: 0.029228247848480004, rank: 5 },
        { name: "c++", value: 0.028280185496850005, rank: 6 },
        { name: "swift", value: 0.01891715110937, rank: 7 },
        { name: "c", value: 0.014999963253390002, rank: 8 },
        { name: "ruby", value: 0.0053282574026, rank: 9 },
        { name: "vb.net", value: 0.00342478337877, rank: 10 },
        { name: "objective-c", value: 0.00183733013882, rank: 11 },
        { name: "assembly", value: 0.00166829576605, rank: 12 },
        { name: "perl", value: 0.0014625147905, rank: 13 },
      ],
    ],
    [
      "10-01-2019",
      [
        { name: "python", value: 0.12857077276517, rank: 0 },
        { name: "javascript", value: 0.11074341997368001, rank: 1 },
        { name: "java", value: 0.07206467177440334, rank: 2 },
        { name: "c#", value: 0.05674725352515833, rank: 3 },
        { name: "php", value: 0.041000097497571664, rank: 4 },
        { name: "r", value: 0.029709236284768337, rank: 5 },
        { name: "c++", value: 0.028370782411808338, rank: 6 },
        { name: "swift", value: 0.01889830063700833, rank: 7 },
        { name: "c", value: 0.015052908970463335, rank: 8 },
        { name: "ruby", value: 0.005170757123091667, rank: 9 },
        { name: "vb.net", value: 0.0034043678525433334, rank: 10 },
        { name: "objective-c", value: 0.00180134982505, rank: 11 },
        { name: "assembly", value: 0.0016931543877016669, rank: 12 },
        { name: "perl", value: 0.0014207009360783333, rank: 13 },
      ],
    ],
    [
      "11-01-2019",
      [
        { name: "python", value: 0.13188707530612, rank: 0 },
        { name: "javascript", value: 0.11102655200099, rank: 1 },
        { name: "java", value: 0.07198106365728667, rank: 2 },
        { name: "c#", value: 0.05521439504667667, rank: 3 },
        { name: "php", value: 0.04010906782985333, rank: 4 },
        { name: "r", value: 0.03019022472105667, rank: 5 },
        { name: "c++", value: 0.02846137932676667, rank: 6 },
        { name: "swift", value: 0.018879450164646667, rank: 7 },
        { name: "c", value: 0.015105854687536667, rank: 8 },
        { name: "ruby", value: 0.005013256843583333, rank: 9 },
        { name: "vb.net", value: 0.0033839523263166664, rank: 10 },
        { name: "objective-c", value: 0.00176536951128, rank: 11 },
        { name: "assembly", value: 0.0017180130093533334, rank: 12 },
        { name: "perl", value: 0.0013788870816566665, rank: 13 },
      ],
    ],
    [
      "12-01-2019",
      [
        { name: "python", value: 0.13520337784707, rank: 0 },
        { name: "javascript", value: 0.1113096840283, rank: 1 },
        { name: "java", value: 0.07189745554017, rank: 2 },
        { name: "c#", value: 0.053681536568195, rank: 3 },
        { name: "php", value: 0.039218038162135, rank: 4 },
        { name: "r", value: 0.030671213157345, rank: 5 },
        { name: "c++", value: 0.028551976241725, rank: 6 },
        { name: "swift", value: 0.018860599692285, rank: 7 },
        { name: "c", value: 0.01515880040461, rank: 8 },
        { name: "ruby", value: 0.0048557565640749995, rank: 9 },
        { name: "vb.net", value: 0.0033635368000899998, rank: 10 },
        { name: "assembly", value: 0.001742871631005, rank: 11 },
        { name: "objective-c", value: 0.0017293891975100001, rank: 12 },
        { name: "perl", value: 0.001337073227235, rank: 13 },
      ],
    ],
    [
      "01-01-2020",
      [
        { name: "python", value: 0.13851968038802, rank: 0 },
        { name: "javascript", value: 0.11159281605561, rank: 1 },
        { name: "java", value: 0.07181384742305334, rank: 2 },
        { name: "c#", value: 0.05214867808971333, rank: 3 },
        { name: "php", value: 0.03832700849441667, rank: 4 },
        { name: "r", value: 0.031152201593633334, rank: 5 },
        { name: "c++", value: 0.028642573156683334, rank: 6 },
        { name: "swift", value: 0.01884174921992333, rank: 7 },
        { name: "c", value: 0.015211746121683333, rank: 8 },
        { name: "ruby", value: 0.004698256284566667, rank: 9 },
        { name: "vb.net", value: 0.003343121273863333, rank: 10 },
        { name: "assembly", value: 0.0017677302526566668, rank: 11 },
        { name: "objective-c", value: 0.00169340888374, rank: 12 },
        { name: "perl", value: 0.0012952593728133334, rank: 13 },
      ],
    ],
    [
      "02-01-2020",
      [
        { name: "python", value: 0.14183598292897, rank: 0 },
        { name: "javascript", value: 0.11187594808292001, rank: 1 },
        { name: "java", value: 0.07173023930593667, rank: 2 },
        { name: "c#", value: 0.05061581961123167, rank: 3 },
        { name: "php", value: 0.037435978826698336, rank: 4 },
        { name: "r", value: 0.03163319002992167, rank: 5 },
        { name: "c++", value: 0.028733170071641667, rank: 6 },
        { name: "swift", value: 0.018822898747561666, rank: 7 },
        { name: "c", value: 0.015264691838756665, rank: 8 },
        { name: "ruby", value: 0.004540756005058334, rank: 9 },
        { name: "vb.net", value: 0.003322705747636666, rank: 10 },
        { name: "assembly", value: 0.0017925888743083335, rank: 11 },
        { name: "objective-c", value: 0.0016574285699699999, rank: 12 },
        { name: "perl", value: 0.0012534455183916666, rank: 13 },
      ],
    ],
    [
      "03-01-2020",
      [
        { name: "python", value: 0.14515228546992, rank: 0 },
        { name: "javascript", value: 0.11215908011023, rank: 1 },
        { name: "java", value: 0.07164663118882, rank: 2 },
        { name: "c#", value: 0.04908296113275, rank: 3 },
        { name: "php", value: 0.03654494915898, rank: 4 },
        { name: "r", value: 0.03211417846621, rank: 5 },
        { name: "c++", value: 0.0288237669866, rank: 6 },
        { name: "swift", value: 0.0188040482752, rank: 7 },
        { name: "c", value: 0.015317637555829999, rank: 8 },
        { name: "ruby", value: 0.00438325572555, rank: 9 },
        { name: "vb.net", value: 0.0033022902214099995, rank: 10 },
        { name: "assembly", value: 0.00181744749596, rank: 11 },
        { name: "objective-c", value: 0.0016214482562, rank: 12 },
        { name: "perl", value: 0.00121163166397, rank: 13 },
      ],
    ],
    [
      "04-01-2020",
      [
        { name: "python", value: 0.14582406891733668, rank: 0 },
        { name: "javascript", value: 0.11280674524036166, rank: 1 },
        { name: "java", value: 0.07036046361331333, rank: 2 },
        { name: "c#", value: 0.048129174350865, rank: 3 },
        { name: "php", value: 0.03604838728395667, rank: 4 },
        { name: "r", value: 0.03207690970198, rank: 5 },
        { name: "c++", value: 0.028215255570815, rank: 6 },
        { name: "swift", value: 0.018659718908171665, rank: 7 },
        { name: "c", value: 0.015027746128696666, rank: 8 },
        { name: "ruby", value: 0.0042189701259150005, rank: 9 },
        { name: "vb.net", value: 0.0032082799982866665, rank: 10 },
        { name: "assembly", value: 0.0018184572469866667, rank: 11 },
        { name: "objective-c", value: 0.0016412651096033332, rank: 12 },
        { name: "perl", value: 0.0011750163444883333, rank: 13 },
      ],
    ],
    [
      "05-01-2020",
      [
        { name: "python", value: 0.14649585236475335, rank: 0 },
        { name: "javascript", value: 0.11345441037049332, rank: 1 },
        { name: "java", value: 0.06907429603780667, rank: 2 },
        { name: "c#", value: 0.04717538756898, rank: 3 },
        { name: "php", value: 0.035551825408933334, rank: 4 },
        { name: "r", value: 0.032039640937750004, rank: 5 },
        { name: "c++", value: 0.027606744155030002, rank: 6 },
        { name: "swift", value: 0.01851538954114333, rank: 7 },
        { name: "c", value: 0.014737854701563332, rank: 8 },
        { name: "ruby", value: 0.00405468452628, rank: 9 },
        { name: "vb.net", value: 0.003114269775163333, rank: 10 },
        { name: "assembly", value: 0.0018194669980133335, rank: 11 },
        { name: "objective-c", value: 0.0016610819630066666, rank: 12 },
        { name: "perl", value: 0.0011384010250066667, rank: 13 },
      ],
    ],
    [
      "06-01-2020",
      [
        { name: "python", value: 0.14716763581217002, rank: 0 },
        { name: "javascript", value: 0.11410207550062498, rank: 1 },
        { name: "java", value: 0.0677881284623, rank: 2 },
        { name: "c#", value: 0.046221600787095, rank: 3 },
        { name: "php", value: 0.03505526353391, rank: 4 },
        { name: "r", value: 0.032002372173520005, rank: 5 },
        { name: "c++", value: 0.026998232739245002, rank: 6 },
        { name: "swift", value: 0.018371060174115002, rank: 7 },
        { name: "c", value: 0.014447963274429999, rank: 8 },
        { name: "ruby", value: 0.003890398926645, rank: 9 },
        { name: "vb.net", value: 0.0030202595520399996, rank: 10 },
        { name: "assembly", value: 0.00182047674904, rank: 11 },
        { name: "objective-c", value: 0.00168089881641, rank: 12 },
        { name: "perl", value: 0.001101785705525, rank: 13 },
      ],
    ],
    [
      "07-01-2020",
      [
        { name: "python", value: 0.14783941925958666, rank: 0 },
        { name: "javascript", value: 0.11474974063075666, rank: 1 },
        { name: "java", value: 0.06650196088679333, rank: 2 },
        { name: "c#", value: 0.045267814005209996, rank: 3 },
        { name: "php", value: 0.03455870165888667, rank: 4 },
        { name: "r", value: 0.03196510340929, rank: 5 },
        { name: "c++", value: 0.02638972132346, rank: 6 },
        { name: "swift", value: 0.01822673080708667, rank: 7 },
        { name: "c", value: 0.014158071847296666, rank: 8 },
        { name: "ruby", value: 0.0037261133270100003, rank: 9 },
        { name: "vb.net", value: 0.0029262493289166666, rank: 10 },
        { name: "assembly", value: 0.0018214865000666667, rank: 11 },
        { name: "objective-c", value: 0.0017007156698133333, rank: 12 },
        { name: "perl", value: 0.0010651703860433332, rank: 13 },
      ],
    ],
    [
      "08-01-2020",
      [
        { name: "python", value: 0.14851120270700333, rank: 0 },
        { name: "javascript", value: 0.11539740576088832, rank: 1 },
        { name: "java", value: 0.06521579331128666, rank: 2 },
        { name: "c#", value: 0.044314027223324996, rank: 3 },
        { name: "php", value: 0.034062139783863334, rank: 4 },
        { name: "r", value: 0.03192783464506, rank: 5 },
        { name: "c++", value: 0.025781209907675, rank: 6 },
        { name: "swift", value: 0.018082401440058335, rank: 7 },
        { name: "c", value: 0.013868180420163332, rank: 8 },
        { name: "ruby", value: 0.0035618277273749997, rank: 9 },
        { name: "vb.net", value: 0.0028322391057933336, rank: 10 },
        { name: "assembly", value: 0.0018224962510933335, rank: 11 },
        { name: "objective-c", value: 0.0017205325232166665, rank: 12 },
        { name: "perl", value: 0.0010285550665616666, rank: 13 },
      ],
    ],
    [
      "09-01-2020",
      [
        { name: "python", value: 0.14918298615442, rank: 0 },
        { name: "javascript", value: 0.11604507089101998, rank: 1 },
        { name: "java", value: 0.06392962573578, rank: 2 },
        { name: "c#", value: 0.04336024044144, rank: 3 },
        { name: "php", value: 0.03356557790884, rank: 4 },
        { name: "r", value: 0.03189056588083, rank: 5 },
        { name: "c++", value: 0.02517269849189, rank: 6 },
        { name: "swift", value: 0.01793807207303, rank: 7 },
        { name: "c", value: 0.01357828899303, rank: 8 },
        { name: "ruby", value: 0.00339754212774, rank: 9 },
        { name: "vb.net", value: 0.00273822888267, rank: 10 },
        { name: "assembly", value: 0.00182350600212, rank: 11 },
        { name: "objective-c", value: 0.00174034937662, rank: 12 },
        { name: "perl", value: 0.00099193974708, rank: 13 },
      ],
    ],
  ];
  function Mu(a) {
    let e, n, r, u, l, t, v, m, k, c, i, o, s, p, g, j, M;
    function x(e) {
      a[17](e);
    }
    let C = { keyframeCount: $u.length, duration: Cu, isEnabled: a[3] };
    return (
      void 0 !== a[2] && (C.currentKeyframe = a[2]),
      (e = new Pr({ props: C })),
      z.push(() =>
        (function (a, e, n) {
          const r = a.$$.props[e];
          void 0 !== r && ((a.$$.bound[r] = n), n(a.$$.ctx[r]));
        })(e, "currentKeyframe", x)
      ),
      e.$on("end", a[18]),
      (t = new Qr({ props: { barCount: Tu } })),
      (k = new ku({})),
      (o = new yu({ props: { barCount: Tu } })),
      (g = new wu({ props: { date: a[4] } })),
      {
        c() {
          ta(e.$$.fragment),
            (r = d()),
            (u = y("figure")),
            (l = y("div")),
            ta(t.$$.fragment),
            (v = d()),
            (m = y("div")),
            ta(k.$$.fragment),
            (c = d()),
            (i = y("div")),
            ta(o.$$.fragment),
            (s = d()),
            (p = y("div")),
            ta(g.$$.fragment),
            $(l, "class", "bars svelte-1mz8sbt"),
            $(m, "class", "axis svelte-1mz8sbt"),
            $(i, "class", "labels svelte-1mz8sbt"),
            $(p, "class", "ticker svelte-1mz8sbt"),
            $(u, "class", "svelte-1mz8sbt"),
            P(() => a[19].call(u));
        },
        m(n, d) {
          va(e, n, d),
            h(n, r, d),
            h(n, u, d),
            f(u, l),
            va(t, l, null),
            f(u, v),
            f(u, m),
            va(k, m, null),
            f(u, c),
            f(u, i),
            va(o, i, null),
            f(u, s),
            f(u, p),
            va(g, p, null),
            (j = (function (a, e) {
              "static" === getComputedStyle(a).position &&
                (a.style.position = "relative");
              const n = y("iframe");
              n.setAttribute(
                "style",
                "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"
              ),
                n.setAttribute("aria-hidden", "true"),
                (n.tabIndex = -1);
              const r = T();
              let u;
              return (
                r
                  ? ((n.src =
                      "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>"),
                    (u = w(window, "message", (a) => {
                      a.source === n.contentWindow && e();
                    })))
                  : ((n.src = "about:blank"),
                    (n.onload = () => {
                      u = w(n.contentWindow, "resize", e);
                    })),
                f(a, n),
                () => {
                  (r || (u && n.contentWindow)) && u(), b(n);
                }
              );
            })(u, a[19].bind(u))),
            (M = !0);
        },
        p(a, r) {
          const u = {};
          var l;
          8 & r && (u.isEnabled = a[3]),
            !n &&
              4 & r &&
              ((n = !0),
              (u.currentKeyframe = a[2]),
              (l = () => (n = !1)),
              O.push(l)),
            e.$set(u);
          const t = {};
          16 & r && (t.date = a[4]), g.$set(t);
        },
        i(a) {
          M ||
            (aa(e.$$.fragment, a),
            aa(t.$$.fragment, a),
            aa(k.$$.fragment, a),
            aa(o.$$.fragment, a),
            aa(g.$$.fragment, a),
            (M = !0));
        },
        o(a) {
          ea(e.$$.fragment, a),
            ea(t.$$.fragment, a),
            ea(k.$$.fragment, a),
            ea(o.$$.fragment, a),
            ea(g.$$.fragment, a),
            (M = !1);
        },
        d(a) {
          ma(e, a), a && b(r), a && b(u), ma(t), ma(k), ma(o), ma(g), j();
        },
      }
    );
  }
  function xu(a) {
    let e,
      n,
      r = $u && Mu(a);
    return {
      c() {
        r && r.c(), (e = j());
      },
      m(a, u) {
        r && r.m(a, u), h(a, e, u), (n = !0);
      },
      p(a, [e]) {
        $u && r.p(a, e);
      },
      i(a) {
        n || (aa(r), (n = !0));
      },
      o(a) {
        ea(r), (n = !1);
      },
      d(a) {
        r && r.d(a), a && b(e);
      },
    };
  }
  const Cu = 300,
    Tu = 8;
  function Du(a, e, n) {
    let r, u, l, t, v, k, c, i, o, s, p;
    const f = $u.length,
      h = $u[0][1].map((a) => a.name),
      b = Er({});
    m(a, b, (a) => n(15, (p = a)));
    const y = Er({}),
      g = Sr(null, { duration: Cu }),
      d = Sr(null, { duration: Cu });
    m(a, d, (a) => n(14, (s = a)));
    let j = 0,
      w = 0,
      $ = 0,
      M = !1;
    return (
      (a.$$.update = () => {
        var e, m;
        1 & a.$$.dirty && n(7, (r = j)),
          2 & a.$$.dirty && n(8, (u = w)),
          256 & a.$$.dirty && n(9, (l = u / Tu - 4)),
          4 & a.$$.dirty && n(3, (M = $ < f)),
          4 & a.$$.dirty && n(10, (t = Math.min($, f - 1))),
          1024 & a.$$.dirty && n(11, (v = $u[t])),
          2048 & a.$$.dirty && n(4, (k = v[0])),
          2048 & a.$$.dirty && n(12, (c = v[1])),
          4096 & a.$$.dirty &&
            n(13, (i = h.map((a) => ({ ...c.find((e) => e.name == a) })))),
          8192 & a.$$.dirty && g.set(i),
          896 & a.$$.dirty &&
            b.set({ width: r, height: u, barHeight: l, barMargin: 4 }),
          4096 & a.$$.dirty && d.set(Math.max(...c.map((a) => a.value))),
          49152 & a.$$.dirty &&
            y.set({
              x: Pe().domain([0, s]).range([0, p.width]),
              y: Pe().domain([0, Tu]).range([0, p.height]),
            }),
          65536 & a.$$.dirty &&
            ((e = "Chart"), (m = o), S().$$.context.set(e, m));
      }),
      n(16, (o = { dimensions: b, scales: y, data: g, names: h })),
      [
        j,
        w,
        $,
        M,
        k,
        b,
        d,
        r,
        u,
        l,
        t,
        v,
        c,
        i,
        s,
        p,
        o,
        function (a) {
          ($ = a), n(2, $);
        },
        () => n(3, (M = !1)),
        function () {
          (j = this.offsetWidth), (w = this.offsetHeight), n(0, j), n(1, w);
        },
      ]
    );
  }
  class Nu extends ia {
    constructor(a) {
      super(), ca(this, a, Du, xu, v, {});
    }
  }
  function Fu(e) {
    let n, r, u, l, t, v, m;
    return (
      (l = new Nu({})),
      {
        c() {
          (n = y("main")),
            (r = y("section")),
            (r.innerHTML =
              '<h1 class="svelte-fe6u4g">Languages on Stack Overflow</h1> \n    <p class="svelte-fe6u4g">% of questions by programming language</p>'),
            (u = d()),
            ta(l.$$.fragment),
            (t = d()),
            (v = y("section")),
            (v.innerHTML =
              '<p class="svelte-fe6u4g">Data from <a href="https://insights.stackoverflow.com/trends?tags=java%2Cc%2Cc%2B%2B%2Cpython%2Cc%23%2Cvb.net[…]mbly%2Cphp%2Cperl%2Cruby%2Cvb%2Cswift%2Cr%2Cobjective-c">Stack Overflow</a>. This visualization was created for the\n      <a href="https://sveltesummit.com/">Svelte Summit 2021</a>\n      talk entitled\n      <strong>Declarative Data Visualization: Creating a bar chart race</strong>\n      by <a href="https://twitter.com/wattenberger">Amelia Wattenberger</a> and\n      <a href="https://twitter.com/codenberg">Russell Goldenberg</a>. View the\n      source code on\n      <a href="https://github.com/russellgoldenberg/svelte-bar-chart-race">Github</a>.</p>'),
            $(r, "class", "intro svelte-fe6u4g"),
            $(v, "class", "outro svelte-fe6u4g"),
            $(n, "class", "svelte-fe6u4g");
        },
        m(a, e) {
          h(a, n, e),
            f(n, r),
            f(n, u),
            va(l, n, null),
            f(n, t),
            f(n, v),
            (m = !0);
        },
        p: a,
        i(a) {
          m || (aa(l.$$.fragment, a), (m = !0));
        },
        o(a) {
          ea(l.$$.fragment, a), (m = !1);
        },
        d(a) {
          a && b(n), ma(l);
        },
      }
    );
  }
  return new (class extends ia {
    constructor(a) {
      super(), ca(this, a, null, Fu, v, {});
    }
  })({ target: document.body });
})();
//# sourceMappingURL=bundle.js.map
