'use strict';

// ! function(t) {
//     var e = {};
//
//     function n(r) {
//         if (e[r]) return e[r].exports;
//         var o = e[r] = {
//             i: r,
//             l: !1,
//             exports: {}
//         };
//         return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
//     }
//     n.m = t, n.c = e, n.d = function(t, e, r) {
//         n.o(t, e) || Object.defineProperty(t, e, {
//             enumerable: !0,
//             get: r
//         })
//     }, n.r = function(t) {
//         "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
//             value: "Module"
//         }), Object.defineProperty(t, "__esModule", {
//             value: !0
//         })
//     }, n.t = function(t, e) {
//         if (1 & e && (t = n(t)), 8 & e) return t;
//         if (4 & e && "object" == typeof t && t && t.__esModule) return t;
//         var r = Object.create(null);
//         if (n.r(r), Object.defineProperty(r, "default", {
//             enumerable: !0,
//             value: t
//         }), 2 & e && "string" != typeof t)
//             for (var o in t) n.d(r, o, function(e) {
//                 return t[e]
//             }.bind(null, o));
//         return r
//     }, n.n = function(t) {
//         var e = t && t.__esModule ? function() {
//             return t.default
//         } : function() {
//             return t
//         };
//         return n.d(e, "a", e), e
//     }, n.o = function(t, e) {
//         return Object.prototype.hasOwnProperty.call(t, e)
//     }, n.p = "", n(n.s = 59)
// }([function(t, e, n) {
//     (function(e) {
//         var n = function(t) {
//             return t && t.Math == Math && t
//         };
//         t.exports = n("object" == typeof globalThis && globalThis) || n("object" == typeof window && window) || n("object" == typeof self && self) || n("object" == typeof e && e) || Function("return this")()
//     }).call(this, n(32))
// }, function(t, e) {
//     t.exports = function(t) {
//         try {
//             return !!t()
//         } catch (t) {
//             return !0
//         }
//     }
// }, function(t, e) {
//     var n = {}.hasOwnProperty;
//     t.exports = function(t, e) {
//         return n.call(t, e)
//     }
// }, function(t, e, n) {
//     var r = n(1);
//     t.exports = !r((function() {
//         return 7 != Object.defineProperty({}, "a", {
//             get: function() {
//                 return 7
//             }
//         }).a
//     }))
// }, function(t, e) {
//     t.exports = function(t) {
//         return "object" == typeof t ? null !== t : "function" == typeof t
//     }
// }, function(t, e, n) {
//     var r = n(3),
//         o = n(18),
//         i = n(13);
//     t.exports = r ? function(t, e, n) {
//         return o.f(t, e, i(1, n))
//     } : function(t, e, n) {
//         return t[e] = n, t
//     }
// }, function(t, e, n) {
//     var r = n(4);
//     t.exports = function(t) {
//         if (!r(t)) throw TypeError(String(t) + " is not an object");
//         return t
//     }
// }, function(t, e, n) {
//     var r = n(14),
//         o = n(8);
//     t.exports = function(t) {
//         return r(o(t))
//     }
// }, function(t, e) {
//     t.exports = function(t) {
//         if (null == t) throw TypeError("Can't call method on " + t);
//         return t
//     }
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(5);
//     t.exports = function(t, e) {
//         try {
//             o(r, t, e)
//         } catch (n) {
//             r[t] = e
//         }
//         return e
//     }
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(11).f,
//         i = n(5),
//         c = n(19),
//         s = n(9),
//         a = n(38),
//         u = n(46);
//     t.exports = function(t, e) {
//         var n, l, f, p, h, m = t.target,
//             d = t.global,
//             v = t.stat;
//         if (n = d ? r : v ? r[m] || s(m, {}) : (r[m] || {}).prototype)
//             for (l in e) {
//                 if (p = e[l], f = t.noTargetGet ? (h = o(n, l)) && h.value : n[l], !u(d ? l : m + (v ? "." : "#") + l, t.forced) && void 0 !== f) {
//                     if (typeof p == typeof f) continue;
//                     a(p, f)
//                 }(t.sham || f && f.sham) && i(p, "sham", !0), c(n, l, p, t)
//             }
//     }
// }, function(t, e, n) {
//     var r = n(3),
//         o = n(12),
//         i = n(13),
//         c = n(7),
//         s = n(16),
//         a = n(2),
//         u = n(17),
//         l = Object.getOwnPropertyDescriptor;
//     e.f = r ? l : function(t, e) {
//         if (t = c(t), e = s(e, !0), u) try {
//             return l(t, e)
//         } catch (t) {}
//         if (a(t, e)) return i(!o.f.call(t, e), t[e])
//     }
// }, function(t, e, n) {
//     "use strict";
//     var r = {}.propertyIsEnumerable,
//         o = Object.getOwnPropertyDescriptor,
//         i = o && !r.call({
//             1: 2
//         }, 1);
//     e.f = i ? function(t) {
//         var e = o(this, t);
//         return !!e && e.enumerable
//     } : r
// }, function(t, e) {
//     t.exports = function(t, e) {
//         return {
//             enumerable: !(1 & t),
//             configurable: !(2 & t),
//             writable: !(4 & t),
//             value: e
//         }
//     }
// }, function(t, e, n) {
//     var r = n(1),
//         o = n(15),
//         i = "".split;
//     t.exports = r((function() {
//         return !Object("z").propertyIsEnumerable(0)
//     })) ? function(t) {
//         return "String" == o(t) ? i.call(t, "") : Object(t)
//     } : Object
// }, function(t, e) {
//     var n = {}.toString;
//     t.exports = function(t) {
//         return n.call(t).slice(8, -1)
//     }
// }, function(t, e, n) {
//     var r = n(4);
//     t.exports = function(t, e) {
//         if (!r(t)) return t;
//         var n, o;
//         if (e && "function" == typeof(n = t.toString) && !r(o = n.call(t))) return o;
//         if ("function" == typeof(n = t.valueOf) && !r(o = n.call(t))) return o;
//         if (!e && "function" == typeof(n = t.toString) && !r(o = n.call(t))) return o;
//         throw TypeError("Can't convert object to primitive value")
//     }
// }, function(t, e, n) {
//     var r = n(3),
//         o = n(1),
//         i = n(33);
//     t.exports = !r && !o((function() {
//         return 7 != Object.defineProperty(i("div"), "a", {
//             get: function() {
//                 return 7
//             }
//         }).a
//     }))
// }, function(t, e, n) {
//     var r = n(3),
//         o = n(17),
//         i = n(6),
//         c = n(16),
//         s = Object.defineProperty;
//     e.f = r ? s : function(t, e, n) {
//         if (i(t), e = c(e, !0), i(n), o) try {
//             return s(t, e, n)
//         } catch (t) {}
//         if ("get" in n || "set" in n) throw TypeError("Accessors not supported");
//         return "value" in n && (t[e] = n.value), t
//     }
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(5),
//         i = n(2),
//         c = n(9),
//         s = n(20),
//         a = n(34),
//         u = a.get,
//         l = a.enforce,
//         f = String(String).split("String");
//     (t.exports = function(t, e, n, s) {
//         var a = !!s && !!s.unsafe,
//             u = !!s && !!s.enumerable,
//             p = !!s && !!s.noTargetGet;
//         "function" == typeof n && ("string" != typeof e || i(n, "name") || o(n, "name", e), l(n).source = f.join("string" == typeof e ? e : "")), t !== r ? (a ? !p && t[e] && (u = !0) : delete t[e], u ? t[e] = n : o(t, e, n)) : u ? t[e] = n : c(e, n)
//     })(Function.prototype, "toString", (function() {
//         return "function" == typeof this && u(this).source || s(this)
//     }))
// }, function(t, e, n) {
//     var r = n(21),
//         o = Function.toString;
//     "function" != typeof r.inspectSource && (r.inspectSource = function(t) {
//         return o.call(t)
//     }), t.exports = r.inspectSource
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(9),
//         i = r["__core-js_shared__"] || o("__core-js_shared__", {});
//     t.exports = i
// }, function(t, e, n) {
//     var r = n(37),
//         o = n(21);
//     (t.exports = function(t, e) {
//         return o[t] || (o[t] = void 0 !== e ? e : {})
//     })("versions", []).push({
//         version: "3.6.1",
//         mode: r ? "pure" : "global",
//         copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
//     })
// }, function(t, e) {
//     var n = 0,
//         r = Math.random();
//     t.exports = function(t) {
//         return "Symbol(" + String(void 0 === t ? "" : t) + ")_" + (++n + r).toString(36)
//     }
// }, function(t, e) {
//     t.exports = {}
// }, function(t, e, n) {
//     var r = n(2),
//         o = n(7),
//         i = n(43).indexOf,
//         c = n(24);
//     t.exports = function(t, e) {
//         var n, s = o(t),
//             a = 0,
//             u = [];
//         for (n in s) !r(c, n) && r(s, n) && u.push(n);
//         for (; e.length > a;) r(s, n = e[a++]) && (~i(u, n) || u.push(n));
//         return u
//     }
// }, function(t, e) {
//     var n = Math.ceil,
//         r = Math.floor;
//     t.exports = function(t) {
//         return isNaN(t = +t) ? 0 : (t > 0 ? r : n)(t)
//     }
// }, function(t, e) {
//     t.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
// }, function(t, e) {
//     e.f = Object.getOwnPropertySymbols
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(22),
//         i = n(2),
//         c = n(23),
//         s = n(30),
//         a = n(55),
//         u = o("wks"),
//         l = r.Symbol,
//         f = a ? l : l && l.withoutSetter || c;
//     t.exports = function(t) {
//         return i(u, t) || (s && i(l, t) ? u[t] = l[t] : u[t] = f("Symbol." + t)), u[t]
//     }
// }, function(t, e, n) {
//     var r = n(1);
//     t.exports = !!Object.getOwnPropertySymbols && !r((function() {
//         return !String(Symbol())
//     }))
// }, function(t, e, n) {
//     var r = n(10),
//         o = n(47);
//     r({
//         target: "Object",
//         stat: !0,
//         forced: Object.assign !== o
//     }, {
//         assign: o
//     })
// }, function(t, e) {
//     var n;
//     n = function() {
//         return this
//     }();
//     try {
//         n = n || new Function("return this")()
//     } catch (t) {
//         "object" == typeof window && (n = window)
//     }
//     t.exports = n
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(4),
//         i = r.document,
//         c = o(i) && o(i.createElement);
//     t.exports = function(t) {
//         return c ? i.createElement(t) : {}
//     }
// }, function(t, e, n) {
//     var r, o, i, c = n(35),
//         s = n(0),
//         a = n(4),
//         u = n(5),
//         l = n(2),
//         f = n(36),
//         p = n(24),
//         h = s.WeakMap;
//     if (c) {
//         var m = new h,
//             d = m.get,
//             v = m.has,
//             g = m.set;
//         r = function(t, e) {
//             return g.call(m, t, e), e
//         }, o = function(t) {
//             return d.call(m, t) || {}
//         }, i = function(t) {
//             return v.call(m, t)
//         }
//     } else {
//         var E = f("state");
//         p[E] = !0, r = function(t, e) {
//             return u(t, E, e), e
//         }, o = function(t) {
//             return l(t, E) ? t[E] : {}
//         }, i = function(t) {
//             return l(t, E)
//         }
//     }
//     t.exports = {
//         set: r,
//         get: o,
//         has: i,
//         enforce: function(t) {
//             return i(t) ? o(t) : r(t, {})
//         },
//         getterFor: function(t) {
//             return function(e) {
//                 var n;
//                 if (!a(e) || (n = o(e)).type !== t) throw TypeError("Incompatible receiver, " + t + " required");
//                 return n
//             }
//         }
//     }
// }, function(t, e, n) {
//     var r = n(0),
//         o = n(20),
//         i = r.WeakMap;
//     t.exports = "function" == typeof i && /native code/.test(o(i))
// }, function(t, e, n) {
//     var r = n(22),
//         o = n(23),
//         i = r("keys");
//     t.exports = function(t) {
//         return i[t] || (i[t] = o(t))
//     }
// }, function(t, e) {
//     t.exports = !1
// }, function(t, e, n) {
//     var r = n(2),
//         o = n(39),
//         i = n(11),
//         c = n(18);
//     t.exports = function(t, e) {
//         for (var n = o(e), s = c.f, a = i.f, u = 0; u < n.length; u++) {
//             var l = n[u];
//             r(t, l) || s(t, l, a(e, l))
//         }
//     }
// }, function(t, e, n) {
//     var r = n(40),
//         o = n(42),
//         i = n(28),
//         c = n(6);
//     t.exports = r("Reflect", "ownKeys") || function(t) {
//         var e = o.f(c(t)),
//             n = i.f;
//         return n ? e.concat(n(t)) : e
//     }
// }, function(t, e, n) {
//     var r = n(41),
//         o = n(0),
//         i = function(t) {
//             return "function" == typeof t ? t : void 0
//         };
//     t.exports = function(t, e) {
//         return arguments.length < 2 ? i(r[t]) || i(o[t]) : r[t] && r[t][e] || o[t] && o[t][e]
//     }
// }, function(t, e, n) {
//     var r = n(0);
//     t.exports = r
// }, function(t, e, n) {
//     var r = n(25),
//         o = n(27).concat("length", "prototype");
//     e.f = Object.getOwnPropertyNames || function(t) {
//         return r(t, o)
//     }
// }, function(t, e, n) {
//     var r = n(7),
//         o = n(44),
//         i = n(45),
//         c = function(t) {
//             return function(e, n, c) {
//                 var s, a = r(e),
//                     u = o(a.length),
//                     l = i(c, u);
//                 if (t && n != n) {
//                     for (; u > l;)
//                         if ((s = a[l++]) != s) return !0
//                 } else
//                     for (; u > l; l++)
//                         if ((t || l in a) && a[l] === n) return t || l || 0; return !t && -1
//             }
//         };
//     t.exports = {
//         includes: c(!0),
//         indexOf: c(!1)
//     }
// }, function(t, e, n) {
//     var r = n(26),
//         o = Math.min;
//     t.exports = function(t) {
//         return t > 0 ? o(r(t), 9007199254740991) : 0
//     }
// }, function(t, e, n) {
//     var r = n(26),
//         o = Math.max,
//         i = Math.min;
//     t.exports = function(t, e) {
//         var n = r(t);
//         return n < 0 ? o(n + e, 0) : i(n, e)
//     }
// }, function(t, e, n) {
//     var r = n(1),
//         o = /#|\.prototype\./,
//         i = function(t, e) {
//             var n = s[c(t)];
//             return n == u || n != a && ("function" == typeof e ? r(e) : !!e)
//         },
//         c = i.normalize = function(t) {
//             return String(t).replace(o, ".").toLowerCase()
//         },
//         s = i.data = {},
//         a = i.NATIVE = "N",
//         u = i.POLYFILL = "P";
//     t.exports = i
// }, function(t, e, n) {
//     "use strict";
//     var r = n(3),
//         o = n(1),
//         i = n(48),
//         c = n(28),
//         s = n(12),
//         a = n(49),
//         u = n(14),
//         l = Object.assign,
//         f = Object.defineProperty;
//     t.exports = !l || o((function() {
//         if (r && 1 !== l({
//             b: 1
//         }, l(f({}, "a", {
//             enumerable: !0,
//             get: function() {
//                 f(this, "b", {
//                     value: 3,
//                     enumerable: !1
//                 })
//             }
//         }), {
//             b: 2
//         })).b) return !0;
//         var t = {},
//             e = {},
//             n = Symbol();
//         return t[n] = 7, "abcdefghijklmnopqrst".split("").forEach((function(t) {
//             e[t] = t
//         })), 7 != l({}, t)[n] || "abcdefghijklmnopqrst" != i(l({}, e)).join("")
//     })) ? function(t, e) {
//         for (var n = a(t), o = arguments.length, l = 1, f = c.f, p = s.f; o > l;)
//             for (var h, m = u(arguments[l++]), d = f ? i(m).concat(f(m)) : i(m), v = d.length, g = 0; v > g;) h = d[g++], r && !p.call(m, h) || (n[h] = m[h]);
//         return n
//     } : l
// }, function(t, e, n) {
//     var r = n(25),
//         o = n(27);
//     t.exports = Object.keys || function(t) {
//         return r(t, o)
//     }
// }, function(t, e, n) {
//     var r = n(8);
//     t.exports = function(t) {
//         return Object(r(t))
//     }
// }, function(t, e, n) {
//     "use strict";
//     var r = n(19),
//         o = n(6),
//         i = n(1),
//         c = n(51),
//         s = RegExp.prototype,
//         a = s.toString,
//         u = i((function() {
//             return "/a/b" != a.call({
//                 source: "a",
//                 flags: "b"
//             })
//         })),
//         l = "toString" != a.name;
//     (u || l) && r(RegExp.prototype, "toString", (function() {
//         var t = o(this),
//             e = String(t.source),
//             n = t.flags;
//         return "/" + e + "/" + String(void 0 === n && t instanceof RegExp && !("flags" in s) ? c.call(t) : n)
//     }), {
//         unsafe: !0
//     })
// }, function(t, e, n) {
//     "use strict";
//     var r = n(6);
//     t.exports = function() {
//         var t = r(this),
//             e = "";
//         return t.global && (e += "g"), t.ignoreCase && (e += "i"), t.multiline && (e += "m"), t.dotAll && (e += "s"), t.unicode && (e += "u"), t.sticky && (e += "y"), e
//     }
// }, function(t, e, n) {
//     "use strict";
//     var r = n(10),
//         o = n(53),
//         i = n(8);
//     r({
//         target: "String",
//         proto: !0,
//         forced: !n(56)("includes")
//     }, {
//         includes: function(t) {
//             return !!~String(i(this)).indexOf(o(t), arguments.length > 1 ? arguments[1] : void 0)
//         }
//     })
// }, function(t, e, n) {
//     var r = n(54);
//     t.exports = function(t) {
//         if (r(t)) throw TypeError("The method doesn't accept regular expressions");
//         return t
//     }
// }, function(t, e, n) {
//     var r = n(4),
//         o = n(15),
//         i = n(29)("match");
//     t.exports = function(t) {
//         var e;
//         return r(t) && (void 0 !== (e = t[i]) ? !!e : "RegExp" == o(t))
//     }
// }, function(t, e, n) {
//     var r = n(30);
//     t.exports = r && !Symbol.sham && "symbol" == typeof Symbol.iterator
// }, function(t, e, n) {
//     var r = n(29)("match");
//     t.exports = function(t) {
//         var e = /./;
//         try {
//             "/./" [t](e)
//         } catch (n) {
//             try {
//                 return e[r] = !1, "/./" [t](e)
//             } catch (t) {}
//         }
//         return !1
//     }
// }, function(t, e, n) {}, , function(t, e, n) {
//     "use strict";
//     n.r(e);
//     var r, o, i;
//     n(31), n(50), n(52), n(57);
//
//     function c(t, e, n) {
//         const r = [];
//         for (; t && null !== t.parentElement && (void 0 === n || r.length < n);) t instanceof HTMLElement && t.matches(e) && r.push(t), t = t.parentElement;
//         return r
//     }
//
//     function s(t, e) {
//         const n = c(t, e, 1);
//         return n.length ? n[0] : null
//     }! function(t) {
//         t[t.Backward = -1] = "Backward", t[t.Forward = 1] = "Forward"
//     }(r || (r = {})),
//         function(t) {
//             t.Left = "left", t.Right = "right"
//         }(o || (o = {})),
//         function(t) {
//             t.Back = "back", t.Close = "close", t.Forward = "forward", t.Navigate = "navigate", t.Open = "open"
//         }(i || (i = {}));
//     const a = {
//         backLinkAfter: "",
//         backLinkBefore: "",
//         keyClose: "",
//         keyOpen: "",
//         position: "right",
//         showBackLink: !0,
//         submenuLinkAfter: "",
//         submenuLinkBefore: ""
//     };
//     class u {
//         constructor(t, e) {
//             if (this.level = 0, this.isOpen = !1, this.isAnimating = !1, this.lastAction = null, null === t) throw new Error("Argument `elem` must be a valid HTML node");
//             this.options = Object.assign({}, a, e), this.menuElem = t, this.wrapperElem = document.createElement("div"), this.wrapperElem.classList.add(u.CLASS_NAMES.wrapper);
//             const n = this.menuElem.querySelector("ul");
//             n && function(t, e) {
//                 if (null === t.parentElement) throw Error("`elem` has no parentElement");
//                 t.parentElement.insertBefore(e, t), e.appendChild(t)
//             }(n, this.wrapperElem), this.initMenu(), this.initSubmenus(), this.initEventHandlers(), this.menuElem._slideMenu = this
//         }
//         toggle(t, e = !0) {
//             let n;
//             if (void 0 === t) return this.isOpen ? this.close(e) : this.open(e);
//             if (n = t ? 0 : this.options.position === o.Left ? "-100%" : "100%", this.isOpen = t, e) this.moveSlider(this.menuElem, n);
//             else {
//                 const t = this.moveSlider.bind(this, this.menuElem, n);
//                 this.runWithoutAnimation(t)
//             }
//         }
//         open(t = !0) {
//             this.triggerEvent(i.Open), this.toggle(!0, t)
//         }
//         close(t = !0) {
//             this.triggerEvent(i.Close), this.toggle(!1, t)
//         }
//         back() {
//             this.navigate(r.Backward)
//         }
//         destroy() {
//             const {
//                 submenuLinkAfter: t,
//                 submenuLinkBefore: e,
//                 showBackLink: n
//             } = this.options;
//             if (t || e) {
//                 Array.from(this.wrapperElem.querySelectorAll(".".concat(u.CLASS_NAMES.decorator))).forEach(t => {
//                     t.parentElement && t.parentElement.removeChild(t)
//                 })
//             }
//             if (n) {
//                 Array.from(this.wrapperElem.querySelectorAll(".".concat(u.CLASS_NAMES.control))).forEach(t => {
//                     const e = s(t, "li");
//                     e && e.parentElement && e.parentElement.removeChild(e)
//                 })
//             }! function(t) {
//                 const e = t.parentElement;
//                 if (null === e) throw Error("`elem` has no parentElement");
//                 for (; t.firstChild;) e.insertBefore(t.firstChild, t);
//                 e.removeChild(t)
//             }(this.wrapperElem), this.menuElem.style.cssText = "", this.menuElem.querySelectorAll("ul").forEach(t => t.style.cssText = ""), delete this.menuElem._slideMenu
//         }
//         navigateTo(t) {
//             if (this.triggerEvent(i.Navigate), "string" == typeof t) {
//                 const e = document.querySelector(t);
//                 if (!(e instanceof HTMLElement)) throw new Error("Invalid parameter `target`. A valid query selector is required.");
//                 t = e
//             }
//             Array.from(this.wrapperElem.querySelectorAll(".".concat(u.CLASS_NAMES.active))).forEach(t => {
//                 t.style.display = "none", t.classList.remove(u.CLASS_NAMES.active)
//             });
//             const e = c(t, "ul"),
//                 n = e.length - 1;
//             n >= 0 && n !== this.level && (this.level = n, this.moveSlider(this.wrapperElem, 100 * -this.level)), e.forEach(t => {
//                 t.style.display = "block", t.classList.add(u.CLASS_NAMES.active)
//             })
//         }
//         initEventHandlers() {
//             Array.from(this.menuElem.querySelectorAll("a")).forEach(t => t.addEventListener("click", t => {
//                 const e = t.target,
//                     n = e.matches("a") ? e : s(e, "a");
//                 n && this.navigate(r.Forward, n)
//             })), this.menuElem.addEventListener("transitionend", this.onTransitionEnd.bind(this)), this.wrapperElem.addEventListener("transitionend", this.onTransitionEnd.bind(this)), this.initKeybindings(), this.initSubmenuVisibility()
//         }
//         onTransitionEnd(t) {
//             t.target !== this.menuElem && t.target !== this.wrapperElem || (this.isAnimating = !1, this.lastAction && (this.triggerEvent(this.lastAction, !0), this.lastAction = null))
//         }
//         initKeybindings() {
//             document.addEventListener("keydown", t => {
//                 switch (t.key) {
//                     case this.options.keyClose:
//                         this.close();
//                         break;
//                     case this.options.keyOpen:
//                         this.open();
//                         break;
//                     default:
//                         return
//                 }
//                 t.preventDefault()
//             })
//         }
//         initSubmenuVisibility() {
//             this.menuElem.addEventListener("sm.back-after", () => {
//                 const t = ".".concat(u.CLASS_NAMES.active, " ").repeat(this.level + 1),
//                     e = this.menuElem.querySelector("ul ".concat(t));
//                 e && (e.style.display = "none", e.classList.remove(u.CLASS_NAMES.active))
//             })
//         }
//         triggerEvent(t, e = !1) {
//             this.lastAction = t;
//             const n = "sm.".concat(t).concat(e ? "-after" : ""),
//                 r = new CustomEvent(n);
//             this.menuElem.dispatchEvent(r)
//         }
//         navigate(t = r.Forward, e) {
//             if (this.isAnimating || t === r.Backward && 0 === this.level) return;
//             const n = -100 * (this.level + t);
//             if (e && null !== e.parentElement && t === r.Forward) {
//                 const t = e.parentElement.querySelector("ul");
//                 if (!t) return;
//                 t.classList.add(u.CLASS_NAMES.active), t.style.display = "block"
//             }
//             const o = t === r.Forward ? i.Forward : i.Back;
//             this.triggerEvent(o), this.level = this.level + t, this.moveSlider(this.wrapperElem, n)
//         }
//         moveSlider(t, e) {
//             e.toString().includes("%") || (e += "%"), t.style.transform = "translateX(".concat(e, ")"), this.isAnimating = !0
//         }
//         initMenu() {
//             this.runWithoutAnimation(() => {
//                 switch (this.options.position) {
//                     case o.Left:
//                         Object.assign(this.menuElem.style, {
//                             left: 0,
//                             right: "auto",
//                             transform: "translateX(-100%)"
//                         });
//                         break;
//                     default:
//                         Object.assign(this.menuElem.style, {
//                             left: "auto",
//                             right: 0
//                         })
//                 }
//                 this.menuElem.style.display = "block"
//             })
//         }
//         runWithoutAnimation(t) {
//             const e = [this.menuElem, this.wrapperElem];
//             e.forEach(t => t.style.transition = "none"), t(), this.menuElem.offsetHeight, e.forEach(t => t.style.removeProperty("transition")), this.isAnimating = !1
//         }
//         initSubmenus() {
//             this.menuElem.querySelectorAll("a").forEach(t => {
//                 if (null === t.parentElement) return;
//                 const e = t.parentElement.querySelector("ul");
//                 if (!e) return;
//                 t.addEventListener("click", t => {
//                     t.preventDefault()
//                 });
//                 const n = t.textContent;
//                 if (this.addLinkDecorators(t), this.options.showBackLink) {
//                     const {
//                         backLinkBefore: t,
//                         backLinkAfter: r
//                     } = this.options, o = document.createElement("a");
//                     o.innerHTML = t + n + r, o.classList.add(u.CLASS_NAMES.backlink, u.CLASS_NAMES.control), o.setAttribute("data-action", i.Back);
//                     const c = document.createElement("li");
//                     c.appendChild(o), e.insertBefore(c, e.firstChild)
//                 }
//             })
//         }
//         addLinkDecorators(t) {
//             const {
//                 submenuLinkBefore: e,
//                 submenuLinkAfter: n
//             } = this.options;
//             if (e) {
//                 const n = document.createElement("span");
//                 n.classList.add(u.CLASS_NAMES.decorator), n.innerHTML = e, t.insertBefore(n, t.firstChild)
//             }
//             if (n) {
//                 const e = document.createElement("span");
//                 e.classList.add(u.CLASS_NAMES.decorator), e.innerHTML = n, t.appendChild(e)
//             }
//             return t
//         }
//     }
//     u.NAMESPACE = "slide-menu", u.CLASS_NAMES = {
//         active: "".concat(u.NAMESPACE, "__submenu--active"),
//         backlink: "".concat(u.NAMESPACE, "__backlink"),
//         control: "".concat(u.NAMESPACE, "__control"),
//         decorator: "".concat(u.NAMESPACE, "__decorator"),
//         wrapper: "".concat(u.NAMESPACE, "__slider")
//     }, document.addEventListener("click", t => {
//         if (!(t.target instanceof HTMLElement)) return;
//         const e = t.target.className.includes(u.CLASS_NAMES.control) ? t.target : s(t.target, ".".concat(u.CLASS_NAMES.control));
//         if (!e || !e.className.includes(u.CLASS_NAMES.control)) return;
//         const n = e.getAttribute("data-target"),
//             r = n && "this" !== n ? document.getElementById(n) : s(e, ".".concat(u.NAMESPACE));
//         if (!r) throw new Error("Unable to find menu ".concat(n));
//         const o = r._slideMenu,
//             i = e.getAttribute("data-action"),
//             c = e.getAttribute("data-arg");
//         o && i && "function" == typeof o[i] && (c ? o[i](c) : o[i]())
//     }), window.SlideMenu = u
// }]);

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

var uq = (function (exports) {
    'use strict';

    function toggleMegaMenu(toggle) {
        const target = this.nav.querySelectorAll(`.${this.level1Class}`);
        const ariaExpanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.classList.toggle(`${this.navClass}-toggle--close`);
        toggle.setAttribute('aria-expanded', !ariaExpanded);

        target.forEach((el) => {
            el.classList.toggle(this.openModifier);
            el.setAttribute('aria-expanded', !ariaExpanded);
        });
    }
    /**
     * Main Navigation
     * @file Drop down navigation handler.
     */

    var MainNavigation = /*#__PURE__*/ (function () {
        function MainNavigation(nav, navClass) {
            _classCallCheck(this, MainNavigation);

            this.nav = nav;
            this.navClass = navClass;
            this.toggleClass = 'jsNavToggle';
            this.openModifier = ''.concat(this.navClass, '__list--open');
            this.hideModifier = ''.concat(this.navClass, '__list--hidden');
            this.levelOpenModifier = ''.concat(this.navClass, '__list-item--open');
            this.level1Class = ''.concat(this.navClass, '__list--level-1');
            this.level2Class = ''.concat(this.navClass, '__list--level-2');
            this.reverseClass = ''.concat(this.navClass, '__list--reverse');
            this.subNavClass = ''.concat(this.navClass, '__list-item--has-subnav');
            this.subToggleClass = ''.concat(this.navClass, '__sub-toggle');
            this.init = this.init.bind(this);
            this.handleToggle = this.handleToggle.bind(this);
            this.handleMobileToggle = this.handleMobileToggle.bind(this);
            this.setOrientation = this.setOrientation.bind(this);
            this.handleKeyPress = this.handleKeyPress.bind(this);
            this.init();
        }

        _createClass(MainNavigation, [
            {
                key: 'init',
                value: function init() {
                    var _this = this;

                    var mobileToggle = document
                        .querySelector('uq-site-header')
                        .shadowRoot.querySelector('.'.concat(this.toggleClass));
                    var subNavItems = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    var subNavLinks = this.nav.querySelectorAll('.'.concat(this.subNavClass, ' > a'));
                    var subNavL2Items = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass),
                    );
                    var subNavL2Links = this.nav.querySelectorAll(
                        '.'.concat(this.level2Class, ' .').concat(this.subNavClass, ' > a'),
                    );
                    var navLinks = this.nav.querySelectorAll('li > a');
                    var subNavToggles = this.nav.querySelectorAll('.'.concat(this.subToggleClass));
                    mobileToggle.addEventListener('click', this.handleMobileToggle);
                    subNavItems.forEach(function (item) {
                        _this.setOrientation(item);

                        item.addEventListener('mouseenter', _this.handleToggle);
                        item.addEventListener('mouseleave', _this.handleToggle);
                    });
                    subNavLinks.forEach(function (item) {
                        if (window.matchMedia('(min-width: 1024px)').matches) {
                            item.addEventListener('touchend', _this.handleToggle);
                        }
                    });
                    subNavL2Items.forEach(function (item) {
                        _this.setOrientation(item);

                        item.addEventListener('mouseenter', _this.handleToggle);
                        item.addEventListener('mouseleave', _this.handleToggle);
                    });
                    subNavL2Links.forEach(function (item) {
                        item.addEventListener('touchend', _this.handleToggle);
                    });
                    navLinks.forEach(function (item) {
                        item.addEventListener('keydown', _this.handleKeyPress);
                    });
                    subNavToggles.forEach(function (item) {
                        item.addEventListener('click', _this.handleToggle);
                    });
                },
            },
            {
                key: 'handleMobileToggle',
                value: function handleMobileToggle(event) {
                    // this handles the click on the invisible site header menu button that toggles the mobile megamenu display
                    var _this2 = this;
                    console.log('handleMobileToggle: class=', this.navClass);

                    var toggle = event.target;
                    var target = this.nav.querySelectorAll('.'.concat(this.level1Class));
                    var ariaExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    var ariaPressed = toggle.getAttribute('aria-pressed') === 'true';
                    toggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                    toggle.setAttribute('aria-expanded', !ariaExpanded);
                    toggle.setAttribute('aria-pressed', !ariaPressed);
                    target.forEach(function (el) {
                        el.classList.toggle(_this2.openModifier);
                        el.setAttribute('aria-expanded', !ariaExpanded);
                        el.setAttribute('aria-pressed', !ariaPressed);
                    });
                },
            },
            {
                key: 'handleToggle',
                value: function handleToggle(event) {
                    if (
                        (event.type === 'mouseenter' || event.type === 'mouseleave') &&
                        window.matchMedia('(max-width: 1024px)').matches
                    ) {
                        return;
                    }

                    var menuItem = event.target;

                    if (menuItem.tagName !== 'LI') {
                        menuItem = menuItem.parentElement;
                    }

                    var subNav = menuItem.querySelector('ul');

                    if (subNav.classList.contains(this.openModifier)) {
                        console.log('*** menu item close clicked');
                        this.closeLevel(subNav, menuItem);
                        this.unhideAllLevels();
                    } else {
                        if (event.type === 'touchend') {
                            event.preventDefault();
                        }

                        console.log('*** menu item open clicked', menuItem);
                        this.closeAllLevels();
                        this.hideAllLevels();
                        this.openLevel(subNav, menuItem);
                        this.unhideLevel(menuItem);
                    }
                },
            },
            {
                key: 'openLevel',
                value: function openLevel(subNav, menuItem) {
                    console.log('toggle::openLevel', subNav, menuItem);
                    subNav.classList.add(this.openModifier);
                    menuItem.classList.add(this.levelOpenModifier);
                    menuItem.querySelector('a').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-expanded', 'true');
                    menuItem.querySelector('button').setAttribute('aria-pressed', 'true');
                },
            },
            {
                key: 'closeLevel',
                value: function closeLevel(subNav, menuItem) {
                    // console.log('toggle::closeLevel', subNav, menuItem);
                    subNav.classList.remove(this.openModifier);
                    this.setOrientation(menuItem);
                    menuItem.classList.remove(this.levelOpenModifier);
                    menuItem.querySelector('a').setAttribute('aria-expanded', 'false');
                    menuItem.querySelector('button').setAttribute('aria-expanded', 'false');
                    menuItem.querySelector('button').setAttribute('aria-pressed', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-expanded', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-pressed', 'false');
                },
            },
            {
                key: 'closeNav',
                value: function closeNav(menuItem) {
                    menuItem.classList.remove(this.openModifier);
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-expanded', 'false');
                    menuItem.parentNode.querySelector('ul').setAttribute('aria-pressed', 'false');
                },
            },
            {
                key: 'closeAllLevels',
                value: function closeAllLevels() {
                    var _this3 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    // console.log('closeAllLevels:: _this3.level2Class=', _this3.level2Class);
                    levels.forEach(function (level) {
                        var item = level.querySelector('.'.concat(_this3.level2Class));
                        // console.log('closeAllLevels:: item=', item);

                        _this3.closeLevel(item, level);
                    });
                },
            },
            {
                key: 'hideAllLevels',
                value: function hideAllLevels() {
                    var _this4 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    var nosubnavlinks = this.nav.querySelectorAll('.'.concat(this.subNavClass, ' > a'));
                    console.log('hideAllLevels:: nosubnavlinks=', nosubnavlinks);
                    levels.forEach(function (level) {
                        var item = level.querySelector('.'.concat(_this4.level2Class));
                        console.log('hideAllLevels:: item=', item);

                        _this4.hideLevel(level);
                    });
                    // nosubnavlinks.forEach(function (level) {
                    //     var item = level.querySelector('.'.concat(_this4.level2Class));
                    //     console.log('hideAllLevels:: item=', item);
                    //
                    //     _this4.hideLevel(level);
                    // });
                },
            },
            {
                key: 'hideLevel',
                value: function hideLevel(level) {
                    !level.classList.contains(this.hideModifier) && level.classList.add(this.hideModifier);
                },
            },
            {
                key: 'unhideAllLevels',
                value: function hideAllLevels() {
                    var _this5 = this;

                    var levels = this.nav.querySelectorAll('.'.concat(this.subNavClass));
                    var nosubnavlinks = this.nav.querySelectorAll('.'.concat(this.subNavClass, ' > a'));
                    console.log('hideAllLevels:: nosubnavlinks=', nosubnavlinks);
                    levels.forEach(function (level) {
                        var item = level.querySelector('.'.concat(_this5.level2Class));
                        console.log('hideAllLevels:: item=', item);

                        _this5.unhideLevel(level);
                    });
                    // nosubnavlinks.forEach(function (level) {
                    //     var item = level.querySelector('.'.concat(_this5.level2Class));
                    //     console.log('hideAllLevels:: item=', item);
                    //
                    //     _this5.unhideLevel(level);
                    // });
                },
            },
            {
                key: 'unhideLevel',
                value: function unhideLevel(level) {
                    !!level.classList.contains(this.hideModifier) && level.classList.remove(this.hideModifier);
                },
            },
            {
                key: 'setOrientation',
                value: function setOrientation(item) {
                    var subNav = item.querySelector('.'.concat(this.level2Class));
                    var reverseClass = this.reverseClass;
                    var subNavRight = 0;

                    if (subNav && subNav.getBoundingClientRect()) {
                        subNavRight = subNav.getBoundingClientRect().right;
                    }

                    if (window.innerWidth < subNavRight) {
                        subNav.classList.add(reverseClass);
                    }
                },
            },
            {
                key: 'handleKeyPress',
                value: function handleKeyPress(event) {
                    var parent = event.currentTarget.parentNode;
                    var nav = parent.parentNode;
                    var mobileToggle = document
                        .querySelector('uq-site-header')
                        .shadowRoot.querySelector('.'.concat(this.toggleClass));

                    if (parent === nav.firstElementChild) {
                        // If we shift tab past the first child, toggle this level.
                        if (event.key === 'Tab' && event.shiftKey === true) {
                            if (nav.classList.contains(this.level2Class)) {
                                this.closeLevel(nav, nav.parentNode, subNav);
                                nav.parentNode.classList.remove(this.levelOpenModifier);
                            } else {
                                this.closeNav(nav);
                                mobileToggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                                mobileToggle.setAttribute('aria-expanded', 'false');
                                mobileToggle.setAttribute('aria-pressed', 'false');
                            }
                        }
                    } else if (parent === nav.lastElementChild) {
                        // If we tab past the last child, toggle this level.
                        if (event.key === 'Tab' && event.shiftKey === false) {
                            if (nav.classList.contains(this.level2Class)) {
                                this.closeLevel(nav, nav.parentNode);
                                nav.parentNode.classList.remove(this.levelOpenModifier);
                            } else {
                                this.closeNav(nav);
                                mobileToggle.classList.toggle(''.concat(this.navClass, '-toggle--close'));
                                mobileToggle.setAttribute('aria-expanded', 'false');
                                mobileToggle.setAttribute('aria-pressed', 'false');
                            }
                        }
                    } // Toggle nav on Space (32) or any Arrow key (37-40).

                    switch (event.keyCode) {
                        case 32:
                        case 37:
                        case 38:
                        case 39:
                        case 40:
                            event.preventDefault();
                            this.handleToggle(event);
                            break;
                    }
                },
            },
        ]);

        return MainNavigation;
    })();

    function createCommonjsModule(fn, basedir, module) {
        return (
            (module = {
                path: basedir,
                exports: {},
                require: function require(path, base) {
                    return commonjsRequire(path, base === undefined || base === null ? module.path : base);
                },
            }),
            fn(module, module.exports),
            module.exports
        );
    }

    function commonjsRequire() {
        throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    // per https://stackoverflow.com/questions/34849001/check-if-css-selector-is-valid/42149818
    const isSelectorValid = ((dummyElement) => (selector) => {
        try {
            dummyElement.querySelector(selector);
        } catch {
            return false;
        }
        return true;
    })(document.createDocumentFragment());

    var ready = createCommonjsModule(function (module) {
        /*!
         * domready (c) Dustin Diaz 2014 - License MIT
         */
        !(function (name, definition) {
            module.exports = definition();
        })('domready', function () {
            var fns = [],
                _listener,
                doc = document,
                hack = doc.documentElement.doScroll,
                domContentLoaded = 'DOMContentLoaded',
                loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);

            if (!loaded)
                doc.addEventListener(
                    domContentLoaded,
                    (_listener = function listener() {
                        doc.removeEventListener(domContentLoaded, _listener);
                        loaded = 1;

                        while ((_listener = fns.shift())) {
                            _listener();
                        }
                    }),
                );
            return function (fn) {
                loaded ? setTimeout(fn, 0) : fns.push(fn);
            };
        });
    });
    /**
     * @file
     * UQ Accordion JS (instantiates an object that controls "accordion" nodes for
     * the entire document). You need to make sure your accordion HTML is correctly
     * formatted and the accompanying SCSS/CSS is loaded as well.
     */

    // var accordion = /*#__PURE__*/ (function () {
    //     /**
    //      * @constructor
    //      * @param {String} [className] - Class name of accordion wrappers (optional;
    //      * default: "accordion").
    //      */
    //     function accordion(className) {
    //         _classCallCheck(this, accordion);
    //
    //         if (!className) {
    //             className = 'uq-accordion';
    //         } else {
    //             className = className;
    //         }
    //
    //         this.className = className;
    //         this.init();
    //     }
    //
    //     _createClass(
    //         accordion,
    //         [
    //             {
    //                 key: 'slideContentUp',
    //                 value:
    //                     /**
    //                      * Method to hide accordion content
    //                      * @method
    //                      * @param {HTMLElement} el - 'Toggler' HTML element.
    //                      */
    //                     function slideContentUp(el) {
    //                         var _this5 = this;
    //
    //                         var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
    //                         el.classList.remove(''.concat(this.className, '__toggle--active'));
    //                         el.parentNode.classList.remove(''.concat(this.className, '__item--is-open'));
    //                         el.setAttribute('aria-expanded', 'false');
    //                         content.style.height = '0px';
    //                         content.addEventListener(
    //                             'transitionend',
    //                             function () {
    //                                 content.classList.remove(''.concat(_this5.className, '__content--active'));
    //                             },
    //                             {
    //                                 once: true,
    //                             },
    //                         );
    //                         content.setAttribute('aria-hidden', 'true');
    //                     },
    //                 /**
    //                  * Method to show accordion content
    //                  * @method
    //                  * @param {HTMLElement} el - 'Toggler' HTML element.
    //                  */
    //             },
    //             {
    //                 key: 'slideContentDown',
    //                 value: function slideContentDown(el) {
    //                     var content = accordion.getNextSibling(el, '.'.concat(this.className, '__content'));
    //                     el.classList.add(''.concat(this.className, '__toggle--active'));
    //                     el.parentNode.classList.add(''.concat(this.className, '__item--is-open'));
    //                     el.setAttribute('aria-expanded', 'true');
    //                     content.classList.add(''.concat(this.className, '__content--active'));
    //                     content.style.height = 'auto';
    //                     var height = content.clientHeight + 'px';
    //                     content.style.height = '0px';
    //                     setTimeout(function () {
    //                         content.style.height = height;
    //                     }, 0);
    //                     content.setAttribute('aria-hidden', 'false');
    //                 },
    //                 /**
    //                  * Method to hide all other accordion content except for passed element.
    //                  * @method
    //                  * @param {HTMLElement} el - Excluded 'Toggler' HTML element.
    //                  * @param {HTMLElement[]} togglers - List of 'toggler' elements.
    //                  */
    //             },
    //             {
    //                 key: 'slideUpOthers',
    //                 value: function slideUpOthers(el, togglers) {
    //                     for (var i = 0; i < togglers.length; i++) {
    //                         if (togglers[i] !== el) {
    //                             if (togglers[i].classList.contains(''.concat(this.className, '__toggle--active'))) {
    //                                 this.slideContentUp(togglers[i]);
    //                             }
    //                         }
    //                     }
    //                 },
    //                 /**
    //                  * Click handler for 'togglers'
    //                  * @method
    //                  * @param {HTMLElement[]} togglers - List of 'toggler' elements.
    //                  */
    //             },
    //             {
    //                 key: 'handleToggle',
    //                 value: function handleToggle(togglers) {
    //                     var _this6 = this;
    //
    //                     return function (e) {
    //                         e.preventDefault();
    //                         var toggle = e.target.closest('.'.concat(_this6.className, '__toggle'));
    //
    //                         if (toggle.classList.contains(''.concat(_this6.className, '__toggle--active'))) {
    //                             _this6.slideContentUp(toggle);
    //                         } else {
    //                             if (
    //                                 toggle
    //                                     .closest('.'.concat(_this6.className))
    //                                     .classList.contains(''.concat(_this6.className, '--is-manual'))
    //                             ) {
    //                                 _this6.slideContentDown(toggle);
    //                             } else {
    //                                 _this6.slideContentDown(toggle);
    //
    //                                 _this6.slideUpOthers(toggle, togglers);
    //                             }
    //                         }
    //                     };
    //                 },
    //                 /**
    //                  * Initialise accordion behavior
    //                  * @method
    //                  */
    //             },
    //             {
    //                 key: 'init',
    //                 value: function init() {
    //                     var _this7 = this;
    //
    //                     if (window.location.hash) {
    //                         this.hash = window.location.hash;
    //                     } // Scroll to hash (param string) selected accordion
    //
    //                     if (this.hash && this.hash !== '') {
    //                         let selectors = ''.concat(this.hash, '.').concat(this.className, '__content');
    //                         // on uqlapp we get weird errors like
    //                         // "Failed to execute 'querySelector' on 'DocumentFragment': '#/membership.accordion__content' is not a valid selector."
    //                         // where #/membership is a vital part of the url
    //                         // note: uqlapp does not display the megamenu
    //                         selectors = selectors.replace('#/membership.', '');
    //                         if (!isSelectorValid(selectors)) {
    //                             console.log(
    //                                 'selector ',
    //                                 selectors,
    //                                 ' has probably caused the uqsiteheader to silently fail',
    //                             );
    //                         }
    //                         var hashSelectedContent =
    //                             isSelectorValid(selectors) &&
    //                             document.querySelector('uq-site-header').shadowRoot.querySelector(selectors);
    //
    //                         if (hashSelectedContent) {
    //                             // Only apply classes on load when linking directly to an accordion item.
    //                             var hashSelected = accordion.getPrevSibling(
    //                                 hashSelectedContent,
    //                                 '.'.concat(this.className, '__toggle'),
    //                             );
    //                             this.slideContentDown(hashSelected); // Scroll to top of selected item.
    //
    //                             window.scrollTo(0, hashSelected.getBoundingClientRect().top);
    //                         }
    //                     }
    //
    //                     var accordions = document
    //                         .querySelector('uq-site-header')
    //                         .shadowRoot.querySelectorAll('.'.concat(this.className));
    //                     console.log('accordions=', this.className, accordions);
    //                     accordions.forEach(function (el) {
    //                         var togglers = el.querySelectorAll('.'.concat(_this7.className, '__toggle'));
    //                         togglers.forEach(function (el) {
    //                             el.addEventListener('click', _this7.handleToggle(togglers));
    //                         });
    //                     }); // wrap contents of uq-accordion__content in a wrapper to apply padding and prevent animation jump
    //
    //                     var accordionContents = document
    //                         .querySelector('uq-site-header')
    //                         .shadowRoot.querySelectorAll('.'.concat(this.className, '__content'));
    //                     var accordionName = this.className;
    //                     accordionContents.forEach(function (accordionContent) {
    //                         var innerContent = accordionContent.innerHTML;
    //                         accordionContent.innerHTML = '';
    //                         var contentWrapper =
    //                             '<div class ="' + accordionName + '__content-wrapper">'.concat(innerContent, '</div>');
    //                         accordionContent.innerHTML = contentWrapper;
    //                     });
    //                 },
    //             },
    //         ],
    //         [
    //             {
    //                 key: 'getNextSibling',
    //                 value:
    //                     /**
    //                      * Method to replace jQuery's .next() method.
    //                      * See: https://gomakethings.com/finding-the-next-and-previous-sibling-elements-that-match-a-selector-with-vanilla-js/
    //                      * @static
    //                      * @param {HTMLElement} el - HTML element.
    //                      * @param {String} selector - CSS selector string.
    //                      */
    //                     function getNextSibling(el, selector) {
    //                         // Get the next sibling element
    //                         var sibling = el.nextElementSibling; // If there's no selector, return the first sibling
    //
    //                         if (!selector) {
    //                             return sibling;
    //                         } // If the sibling matches our selector, use it
    //                         // If not, jump to the next sibling and continue the loop
    //
    //                         while (sibling) {
    //                             if (sibling.matches(selector)) {
    //                                 return sibling;
    //                             }
    //
    //                             sibling = sibling.nextElementSibling;
    //                         }
    //                     },
    //                 /**
    //                  * Method to get previous sibling element.
    //                  * @static
    //                  * @param {HTMLElement} el - HTML element.
    //                  * @param {String} selector - CSS selector string.
    //                  */
    //             },
    //             {
    //                 key: 'getPrevSibling',
    //                 value: function getPrevSibling(el, selector) {
    //                     // Get the next sibling element
    //                     var sibling = el.previousElementSibling; // If there's no selector, return the first sibling
    //
    //                     if (!selector) {
    //                         return sibling;
    //                     } // If the sibling matches our selector, use it
    //                     // If not, jump to the next sibling and continue the loop
    //
    //                     while (sibling) {
    //                         if (sibling.matches(selector)) {
    //                             return sibling;
    //                         }
    //
    //                         sibling = sibling.previousElementSibling;
    //                     }
    //                 },
    //             },
    //         ],
    //     );
    //
    //     return accordion;
    // })();
    /**
     * Equaliser script extracted and modified from Equalizer
     * (https://github.com/skrajewski/Equalizer).
     * A simple way to keep elements at equal height!
     *
     */

    var gridMenuEqualiser = (function () {
        /**
         * Initial equalizer
         *
         * @param {(String|NodeList)} [blocks="grid-menu--equalised"] - selector
         * string or list of DOM nodes.
         * @constructor
         */
        function gridMenuEqualiser(blocks) {
            if (!blocks) {
                blocks = '.grid-menu--equalised';
            }

            if (!(this instanceof gridMenuEqualiser)) {
                return new gridMenuEqualiser(blocks);
            }

            if (typeof blocks === 'string') {
                this.blocks = document.querySelector('uq-header').shadowRoot.querySelectorAll(blocks);
                return;
            }

            this.blocks = blocks;
        }
        /**
         * Recalculate height of blocks
         */

        gridMenuEqualiser.prototype.align = function () {
            var maxHeight = 0,
                max = this.blocks.length,
                i;

            for (i = 0; i < max; i++) {
                this.blocks[i].style.minHeight = '';
                maxHeight = Math.max(maxHeight, this.blocks[i].clientHeight);
            }

            for (i = 0; i < max; i++) {
                this.blocks[i].style.minHeight = maxHeight + 'px';
            }
        };

        return gridMenuEqualiser;
    })();

    // exports.accordion = accordion;
    exports.gridMenuEqualiser = gridMenuEqualiser;
    exports.siteHeaderNavigation = MainNavigation;
    return exports;
})({});
