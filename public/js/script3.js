function ssc_init() {
    if (document.body) {
        var e = document.body,
            t = document.documentElement,
            n = window.innerHeight,
            i = e.scrollHeight;
        if (ssc_root = document.compatMode.indexOf("CSS") >= 0 ? t : e, ssc_activeElement = e, ssc_initdone = !0, top != self) ssc_frame = !0;
        else if (i > n && (e.offsetHeight <= n || t.offsetHeight <= n) && ssc_root.offsetHeight <= n) {
            var o = document.createElement("div");
            o.style.clear = "both", e.appendChild(o)
        }
        ssc_fixedback || (e.style.backgroundAttachment = "scroll", t.style.backgroundAttachment = "scroll"), ssc_keyboardsupport && ssc_addEvent("keydown", ssc_keydown)
    }
}

function ssc_scrollArray(e, t, n, i) {
    if (i || (i = 1e3), ssc_directionCheck(t, n), ssc_que.push({
            x: t,
            y: n,
            lastX: 0 > t ? .99 : -.99,
            lastY: 0 > n ? .99 : -.99,
            start: +new Date
        }), !ssc_pending) {
        var o = function() {
            for (var r = +new Date, s = 0, a = 0, l = 0; l < ssc_que.length; l++) {
                var c = ssc_que[l],
                    u = r - c.start,
                    d = u >= ssc_animtime,
                    f = d ? 1 : u / ssc_animtime;
                ssc_pulseAlgorithm && (f = ssc_pulse(f));
                var h = c.x * f - c.lastX >> 0,
                    p = c.y * f - c.lastY >> 0;
                s += h, a += p, c.lastX += h, c.lastY += p, d && (ssc_que.splice(l, 1), l--)
            }
            if (t) {
                var g = e.scrollLeft;
                e.scrollLeft += s, s && e.scrollLeft === g && (t = 0)
            }
            if (n) {
                var m = e.scrollTop;
                e.scrollTop += a, a && e.scrollTop === m && (n = 0)
            }
            t || n || (ssc_que = []), ssc_que.length ? setTimeout(o, i / ssc_framerate + 1) : ssc_pending = !1
        };
        setTimeout(o, 0), ssc_pending = !0
    }
}

function ssc_wheel(e) {
    ssc_initdone || ssc_init();
    var t = e.target,
        n = ssc_overflowingAncestor(t);
    if (!n || e.defaultPrevented || ssc_isNodeName(ssc_activeElement, "embed") || ssc_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) return !0;
    var i = e.wheelDeltaX || 0,
        o = e.wheelDeltaY || 0;
    i || o || (o = e.wheelDelta || 0), Math.abs(i) > 1.2 && (i *= ssc_stepsize / 120), Math.abs(o) > 1.2 && (o *= ssc_stepsize / 120), ssc_scrollArray(n, -i, -o), e.preventDefault()
}

function ssc_keydown(e) {
    var t = e.target,
        n = e.ctrlKey || e.altKey || e.metaKey;
    if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) return !0;
    if (ssc_isNodeName(t, "button") && e.keyCode === ssc_key.spacebar) return !0;
    var i = 0,
        o = 0,
        r = ssc_overflowingAncestor(ssc_activeElement),
        s = r.clientHeight;
    switch (r == document.body && (s = window.innerHeight), e.keyCode) {
        case ssc_key.up:
            o = -ssc_arrowscroll;
            break;
        case ssc_key.down:
            o = ssc_arrowscroll;
            break;
        case ssc_key.spacebar:
            o = -(e.shiftKey ? 1 : -1) * s * .9;
            break;
        case ssc_key.pageup:
            o = .9 * -s;
            break;
        case ssc_key.pagedown:
            o = .9 * s;
            break;
        case ssc_key.home:
            o = -r.scrollTop;
            break;
        case ssc_key.end:
            var a = r.scrollHeight - r.scrollTop - s;
            o = a > 0 ? a + 10 : 0;
            break;
        case ssc_key.left:
            i = -ssc_arrowscroll;
            break;
        case ssc_key.right:
            i = ssc_arrowscroll;
            break;
        default:
            return !0
    }
    ssc_scrollArray(r, i, o), e.preventDefault()
}

function ssc_mousedown(e) {
    ssc_activeElement = e.target
}

function ssc_setCache(e, t) {
    for (var n = e.length; n--;) ssc_cache[ssc_uniqueID(e[n])] = t;
    return t
}

function ssc_overflowingAncestor(e) {
    var t = [],
        n = ssc_root.scrollHeight;
    do {
        var i = ssc_cache[ssc_uniqueID(e)];
        if (i) return ssc_setCache(t, i);
        if (t.push(e), n === e.scrollHeight) {
            if (!ssc_frame || ssc_root.clientHeight + 10 < n) return ssc_setCache(t, document.body)
        } else if (e.clientHeight + 10 < e.scrollHeight && (overflow = getComputedStyle(e, "").getPropertyValue("overflow"), "scroll" === overflow || "auto" === overflow)) return ssc_setCache(t, e)
    } while (e = e.parentNode)
}

function ssc_addEvent(e, t, n) {
    window.addEventListener(e, t, n || !1)
}

function ssc_removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || !1)
}

function ssc_isNodeName(e, t) {
    return e.nodeName.toLowerCase() === t.toLowerCase()
}

function ssc_directionCheck(e, t) {
    e = e > 0 ? 1 : -1, t = t > 0 ? 1 : -1, (ssc_direction.x !== e || ssc_direction.y !== t) && (ssc_direction.x = e, ssc_direction.y = t, ssc_que = [])
}

function ssc_pulse_(e) {
    var t, n, i;
    return 1 > (e *= ssc_pulseScale) ? t = e - (1 - Math.exp(-e)) : (n = Math.exp(-1), e -= 1, i = 1 - Math.exp(-e), t = n + i * (1 - n)), t * ssc_pulseNormalize
}

function ssc_pulse(e) {
    return e >= 1 ? 1 : 0 >= e ? 0 : (1 == ssc_pulseNormalize && (ssc_pulseNormalize /= ssc_pulse_(1)), ssc_pulse_(e))
}

function loadGoogleMapsAPI() {
    var e = document.createElement("script"),
        t = document.getElementById("gmaps").getAttribute("data-maps-apikey");
    e.src = "https://maps.googleapis.com/maps/api/js?callback=loadMap&key=" + t, e.type = "text/javascript", document.getElementsByTagName("body")[0].appendChild(e)
}

function loadMap() {
    var e = $("#gmaps"),
        t = e.data("lat") || "40.6700",
        n = e.data("lon") || "-73.9400",
        i = {
            zoom: e.data("zoom") || "12",
            center: new google.maps.LatLng(t, n),
            scrollwheel: !1,
            styles: [{
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{
                    saturation: 36
                }, {
                    color: "#000000"
                }, {
                    lightness: 40
                }]
            }, {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{
                    visibility: "on"
                }, {
                    color: "#000000"
                }, {
                    lightness: 16
                }]
            }, {
                featureType: "all",
                elementType: "labels.icon",
                stylers: [{
                    visibility: "off"
                }]
            }, {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 20
                }]
            }, {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 17
                }, {
                    weight: 1.2
                }]
            }, {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 20
                }]
            }, {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 21
                }]
            }, {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 17
                }]
            }, {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 29
                }, {
                    weight: .2
                }]
            }, {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 18
                }]
            }, {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 16
                }]
            }, {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 19
                }]
            }, {
                featureType: "water",
                elementType: "geometry",
                stylers: [{
                    color: "#000000"
                }, {
                    lightness: 17
                }]
            }]
        },
        o = document.getElementById("gmaps"),
        r = new google.maps.Map(o, i);
    new google.maps.Marker({
        position: new google.maps.LatLng(t, n),
        map: r,
        title: "We are here!"
    })
}
if (function(e, t) {
        "use strict";
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e)
        } : t(e)
    }("undefined" != typeof window ? window : this, function(e, t) {
        "use strict";

        function n(e, t) {
            var n = (t = t || te).createElement("script");
            n.text = e, t.head.appendChild(n).parentNode.removeChild(n)
        }

        function i(e) {
            var t = !!e && "length" in e && e.length,
                n = pe.type(e);
            return "function" !== n && !pe.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
        }

        function o(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        }

        function r(e, t, n) {
            return pe.isFunction(t) ? pe.grep(e, function(e, i) {
                return !!t.call(e, i, e) !== n
            }) : t.nodeType ? pe.grep(e, function(e) {
                return e === t !== n
            }) : "string" != typeof t ? pe.grep(e, function(e) {
                return se.call(t, e) > -1 !== n
            }) : Ee.test(t) ? pe.filter(t, e, n) : (t = pe.filter(t, e), pe.grep(e, function(e) {
                return se.call(t, e) > -1 !== n && 1 === e.nodeType
            }))
        }

        function s(e, t) {
            for (;
                (e = e[t]) && 1 !== e.nodeType;);
            return e
        }

        function a(e) {
            var t = {};
            return pe.each(e.match(De) || [], function(e, n) {
                t[n] = !0
            }), t
        }

        function l(e) {
            return e
        }

        function c(e) {
            throw e
        }

        function u(e, t, n, i) {
            var o;
            try {
                e && pe.isFunction(o = e.promise) ? o.call(e).done(t).fail(n) : e && pe.isFunction(o = e.then) ? o.call(e, t, n) : t.apply(void 0, [e].slice(i))
            } catch (e) {
                n.apply(void 0, [e])
            }
        }

        function d() {
            te.removeEventListener("DOMContentLoaded", d), e.removeEventListener("load", d), pe.ready()
        }

        function f() {
            this.expando = pe.expando + f.uid++
        }

        function h(e) {
            return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Fe.test(e) ? JSON.parse(e) : e)
        }

        function p(e, t, n) {
            var i;
            if (void 0 === n && 1 === e.nodeType)
                if (i = "data-" + t.replace(Pe, "-$&").toLowerCase(), "string" == typeof(n = e.getAttribute(i))) {
                    try {
                        n = h(n)
                    } catch (e) {}
                    He.set(e, t, n)
                } else n = void 0;
            return n
        }

        function g(e, t, n, i) {
            var o, r = 1,
                s = 20,
                a = i ? function() {
                    return i.cur()
                } : function() {
                    return pe.css(e, t, "")
                },
                l = a(),
                c = n && n[3] || (pe.cssNumber[t] ? "" : "px"),
                u = (pe.cssNumber[t] || "px" !== c && +l) && Me.exec(pe.css(e, t));
            if (u && u[3] !== c) {
                c = c || u[3], n = n || [], u = +l || 1;
                do {
                    r = r || ".5", u /= r, pe.style(e, t, u + c)
                } while (r !== (r = a() / l) && 1 !== r && --s)
            }
            return n && (u = +u || +l || 0, o = n[1] ? u + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = u, i.end = o)), o
        }

        function m(e) {
            var t, n = e.ownerDocument,
                i = e.nodeName,
                o = ze[i];
            return o || (t = n.body.appendChild(n.createElement(i)), o = pe.css(t, "display"), t.parentNode.removeChild(t), "none" === o && (o = "block"), ze[i] = o, o)
        }

        function v(e, t) {
            for (var n, i, o = [], r = 0, s = e.length; r < s; r++)(i = e[r]).style && (n = i.style.display, t ? ("none" === n && (o[r] = $e.get(i, "display") || null, o[r] || (i.style.display = "")), "" === i.style.display && We(i) && (o[r] = m(i))) : "none" !== n && (o[r] = "none", $e.set(i, "display", n)));
            for (r = 0; r < s; r++) null != o[r] && (e[r].style.display = o[r]);
            return e
        }

        function y(e, t) {
            var n;
            return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && o(e, t) ? pe.merge([e], n) : n
        }

        function b(e, t) {
            for (var n = 0, i = e.length; n < i; n++) $e.set(e[n], "globalEval", !t || $e.get(t[n], "globalEval"))
        }

        function w(e, t, n, i, o) {
            for (var r, s, a, l, c, u, d = t.createDocumentFragment(), f = [], h = 0, p = e.length; h < p; h++)
                if ((r = e[h]) || 0 === r)
                    if ("object" === pe.type(r)) pe.merge(f, r.nodeType ? [r] : r);
                    else if (Ye.test(r)) {
                for (s = s || d.appendChild(t.createElement("div")), a = (Ue.exec(r) || ["", ""])[1].toLowerCase(), l = Xe[a] || Xe._default, s.innerHTML = l[1] + pe.htmlPrefilter(r) + l[2], u = l[0]; u--;) s = s.lastChild;
                pe.merge(f, s.childNodes), (s = d.firstChild).textContent = ""
            } else f.push(t.createTextNode(r));
            for (d.textContent = "", h = 0; r = f[h++];)
                if (i && pe.inArray(r, i) > -1) o && o.push(r);
                else if (c = pe.contains(r.ownerDocument, r), s = y(d.appendChild(r), "script"), c && b(s), n)
                for (u = 0; r = s[u++];) Ve.test(r.type || "") && n.push(r);
            return d
        }

        function T() {
            return !0
        }

        function C() {
            return !1
        }

        function _() {
            try {
                return te.activeElement
            } catch (e) {}
        }

        function E(e, t, n, i, o, r) {
            var s, a;
            if ("object" == typeof t) {
                "string" != typeof n && (i = i || n, n = void 0);
                for (a in t) E(e, a, n, i, t[a], r);
                return e
            }
            if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), !1 === o) o = C;
            else if (!o) return e;
            return 1 === r && (s = o, o = function(e) {
                return pe().off(e), s.apply(this, arguments)
            }, o.guid = s.guid || (s.guid = pe.guid++)), e.each(function() {
                pe.event.add(this, t, o, i, n)
            })
        }

        function S(e, t) {
            return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") ? pe(">tbody", e)[0] || e : e
        }

        function k(e) {
            return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
        }

        function x(e) {
            var t = nt.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e
        }

        function A(e, t) {
            var n, i, o, r, s, a, l, c;
            if (1 === t.nodeType) {
                if ($e.hasData(e) && (r = $e.access(e), s = $e.set(t, r), c = r.events)) {
                    delete s.handle, s.events = {};
                    for (o in c)
                        for (n = 0, i = c[o].length; n < i; n++) pe.event.add(t, o, c[o][n])
                }
                He.hasData(e) && (a = He.access(e), l = pe.extend({}, a), He.set(t, l))
            }
        }

        function D(e, t) {
            var n = t.nodeName.toLowerCase();
            "input" === n && Be.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }

        function O(e, t, i, o) {
            t = oe.apply([], t);
            var r, s, a, l, c, u, d = 0,
                f = e.length,
                h = f - 1,
                p = t[0],
                g = pe.isFunction(p);
            if (g || f > 1 && "string" == typeof p && !fe.checkClone && tt.test(p)) return e.each(function(n) {
                var r = e.eq(n);
                g && (t[0] = p.call(this, n, r.html())), O(r, t, i, o)
            });
            if (f && (r = w(t, e[0].ownerDocument, !1, e, o), s = r.firstChild, 1 === r.childNodes.length && (r = s), s || o)) {
                for (l = (a = pe.map(y(r, "script"), k)).length; d < f; d++) c = r, d !== h && (c = pe.clone(c, !0, !0), l && pe.merge(a, y(c, "script"))), i.call(e[d], c, d);
                if (l)
                    for (u = a[a.length - 1].ownerDocument, pe.map(a, x), d = 0; d < l; d++) c = a[d], Ve.test(c.type || "") && !$e.access(c, "globalEval") && pe.contains(u, c) && (c.src ? pe._evalUrl && pe._evalUrl(c.src) : n(c.textContent.replace(it, ""), u))
            }
            return e
        }

        function I(e, t, n) {
            for (var i, o = t ? pe.filter(t, e) : e, r = 0; null != (i = o[r]); r++) n || 1 !== i.nodeType || pe.cleanData(y(i)), i.parentNode && (n && pe.contains(i.ownerDocument, i) && b(y(i, "script")), i.parentNode.removeChild(i));
            return e
        }

        function N(e, t, n) {
            var i, o, r, s, a = e.style;
            return (n = n || st(e)) && ("" !== (s = n.getPropertyValue(t) || n[t]) || pe.contains(e.ownerDocument, e) || (s = pe.style(e, t)), !fe.pixelMarginRight() && rt.test(s) && ot.test(t) && (i = a.width, o = a.minWidth, r = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = o, a.maxWidth = r)), void 0 !== s ? s + "" : s
        }

        function L(e, t) {
            return {
                get: function() {
                    return e() ? void delete this.get : (this.get = t).apply(this, arguments)
                }
            }
        }

        function $(e) {
            if (e in ft) return e;
            for (var t = e[0].toUpperCase() + e.slice(1), n = dt.length; n--;)
                if ((e = dt[n] + t) in ft) return e
        }

        function H(e) {
            var t = pe.cssProps[e];
            return t || (t = pe.cssProps[e] = $(e) || e), t
        }

        function F(e, t, n) {
            var i = Me.exec(t);
            return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
        }

        function P(e, t, n, i, o) {
            var r, s = 0;
            for (r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0; r < 4; r += 2) "margin" === n && (s += pe.css(e, n + Re[r], !0, o)), i ? ("content" === n && (s -= pe.css(e, "padding" + Re[r], !0, o)), "margin" !== n && (s -= pe.css(e, "border" + Re[r] + "Width", !0, o))) : (s += pe.css(e, "padding" + Re[r], !0, o), "padding" !== n && (s += pe.css(e, "border" + Re[r] + "Width", !0, o)));
            return s
        }

        function j(e, t, n) {
            var i, o = st(e),
                r = N(e, t, o),
                s = "border-box" === pe.css(e, "boxSizing", !1, o);
            return rt.test(r) ? r : (i = s && (fe.boxSizingReliable() || r === e.style[t]), "auto" === r && (r = e["offset" + t[0].toUpperCase() + t.slice(1)]), (r = parseFloat(r) || 0) + P(e, t, n || (s ? "border" : "content"), i, o) + "px")
        }

        function M(e, t, n, i, o) {
            return new M.prototype.init(e, t, n, i, o)
        }

        function R() {
            pt && (!1 === te.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(R) : e.setTimeout(R, pe.fx.interval), pe.fx.tick())
        }

        function W() {
            return e.setTimeout(function() {
                ht = void 0
            }), ht = pe.now()
        }

        function q(e, t) {
            var n, i = 0,
                o = {
                    height: e
                };
            for (t = t ? 1 : 0; i < 4; i += 2 - t) n = Re[i], o["margin" + n] = o["padding" + n] = e;
            return t && (o.opacity = o.width = e), o
        }

        function z(e, t, n) {
            for (var i, o = (U.tweeners[t] || []).concat(U.tweeners["*"]), r = 0, s = o.length; r < s; r++)
                if (i = o[r].call(n, t, e)) return i
        }

        function B(e, t) {
            var n, i, o, r, s;
            for (n in e)
                if (i = pe.camelCase(n), o = t[i], r = e[n], Array.isArray(r) && (o = r[1], r = e[n] = r[0]), n !== i && (e[i] = r, delete e[n]), (s = pe.cssHooks[i]) && "expand" in s) {
                    r = s.expand(r), delete e[i];
                    for (n in r) n in e || (e[n] = r[n], t[n] = o)
                } else t[i] = o
        }

        function U(e, t, n) {
            var i, o, r = 0,
                s = U.prefilters.length,
                a = pe.Deferred().always(function() {
                    delete l.elem
                }),
                l = function() {
                    if (o) return !1;
                    for (var t = ht || W(), n = Math.max(0, c.startTime + c.duration - t), i = 1 - (n / c.duration || 0), r = 0, s = c.tweens.length; r < s; r++) c.tweens[r].run(i);
                    return a.notifyWith(e, [c, i, n]), i < 1 && s ? n : (s || a.notifyWith(e, [c, 1, 0]), a.resolveWith(e, [c]), !1)
                },
                c = a.promise({
                    elem: e,
                    props: pe.extend({}, t),
                    opts: pe.extend(!0, {
                        specialEasing: {},
                        easing: pe.easing._default
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: ht || W(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var i = pe.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                        return c.tweens.push(i), i
                    },
                    stop: function(t) {
                        var n = 0,
                            i = t ? c.tweens.length : 0;
                        if (o) return this;
                        for (o = !0; n < i; n++) c.tweens[n].run(1);
                        return t ? (a.notifyWith(e, [c, 1, 0]), a.resolveWith(e, [c, t])) : a.rejectWith(e, [c, t]), this
                    }
                }),
                u = c.props;
            for (B(u, c.opts.specialEasing); r < s; r++)
                if (i = U.prefilters[r].call(c, e, u, c.opts)) return pe.isFunction(i.stop) && (pe._queueHooks(c.elem, c.opts.queue).stop = pe.proxy(i.stop, i)), i;
            return pe.map(u, z, c), pe.isFunction(c.opts.start) && c.opts.start.call(e, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), pe.fx.timer(pe.extend(l, {
                elem: e,
                anim: c,
                queue: c.opts.queue
            })), c
        }

        function V(e) {
            return (e.match(De) || []).join(" ")
        }

        function X(e) {
            return e.getAttribute && e.getAttribute("class") || ""
        }

        function Y(e, t, n, i) {
            var o;
            if (Array.isArray(t)) pe.each(t, function(t, o) {
                n || kt.test(e) ? i(e, o) : Y(e + "[" + ("object" == typeof o && null != o ? t : "") + "]", o, n, i)
            });
            else if (n || "object" !== pe.type(t)) i(e, t);
            else
                for (o in t) Y(e + "[" + o + "]", t[o], n, i)
        }

        function G(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var i, o = 0,
                    r = t.toLowerCase().match(De) || [];
                if (pe.isFunction(n))
                    for (; i = r[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
            }
        }

        function K(e, t, n, i) {
            function o(a) {
                var l;
                return r[a] = !0, pe.each(e[a] || [], function(e, a) {
                    var c = a(t, n, i);
                    return "string" != typeof c || s || r[c] ? s ? !(l = c) : void 0 : (t.dataTypes.unshift(c), o(c), !1)
                }), l
            }
            var r = {},
                s = e === jt;
            return o(t.dataTypes[0]) || !r["*"] && o("*")
        }

        function Q(e, t) {
            var n, i, o = pe.ajaxSettings.flatOptions || {};
            for (n in t) void 0 !== t[n] && ((o[n] ? e : i || (i = {}))[n] = t[n]);
            return i && pe.extend(!0, e, i), e
        }

        function Z(e, t, n) {
            for (var i, o, r, s, a = e.contents, l = e.dataTypes;
                "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
            if (i)
                for (o in a)
                    if (a[o] && a[o].test(i)) {
                        l.unshift(o);
                        break
                    }
            if (l[0] in n) r = l[0];
            else {
                for (o in n) {
                    if (!l[0] || e.converters[o + " " + l[0]]) {
                        r = o;
                        break
                    }
                    s || (s = o)
                }
                r = r || s
            }
            if (r) return r !== l[0] && l.unshift(r), n[r]
        }

        function J(e, t, n, i) {
            var o, r, s, a, l, c = {},
                u = e.dataTypes.slice();
            if (u[1])
                for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
            for (r = u.shift(); r;)
                if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = u.shift())
                    if ("*" === r) r = l;
                    else if ("*" !== l && l !== r) {
                if (!(s = c[l + " " + r] || c["* " + r]))
                    for (o in c)
                        if ((a = o.split(" "))[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                            !0 === s ? s = c[o] : !0 !== c[o] && (r = a[0], u.unshift(a[1]));
                            break
                        }
                if (!0 !== s)
                    if (s && e.throws) t = s(t);
                    else try {
                        t = s(t)
                    } catch (e) {
                        return {
                            state: "parsererror",
                            error: s ? e : "No conversion from " + l + " to " + r
                        }
                    }
            }
            return {
                state: "success",
                data: t
            }
        }
        var ee = [],
            te = e.document,
            ne = Object.getPrototypeOf,
            ie = ee.slice,
            oe = ee.concat,
            re = ee.push,
            se = ee.indexOf,
            ae = {},
            le = ae.toString,
            ce = ae.hasOwnProperty,
            ue = ce.toString,
            de = ue.call(Object),
            fe = {},
            he = "3.2.1",
            pe = function(e, t) {
                return new pe.fn.init(e, t)
            },
            ge = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            me = /^-ms-/,
            ve = /-([a-z])/g,
            ye = function(e, t) {
                return t.toUpperCase()
            };
        pe.fn = pe.prototype = {
            jquery: he,
            constructor: pe,
            length: 0,
            toArray: function() {
                return ie.call(this)
            },
            get: function(e) {
                return null == e ? ie.call(this) : e < 0 ? this[e + this.length] : this[e]
            },
            pushStack: function(e) {
                var t = pe.merge(this.constructor(), e);
                return t.prevObject = this, t
            },
            each: function(e) {
                return pe.each(this, e)
            },
            map: function(e) {
                return this.pushStack(pe.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            slice: function() {
                return this.pushStack(ie.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length,
                    n = +e + (e < 0 ? t : 0);
                return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: re,
            sort: ee.sort,
            splice: ee.splice
        }, pe.extend = pe.fn.extend = function() {
            var e, t, n, i, o, r, s = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1;
            for ("boolean" == typeof s && (c = s, s = arguments[a] || {}, a++), "object" == typeof s || pe.isFunction(s) || (s = {}), a === l && (s = this, a--); a < l; a++)
                if (null != (e = arguments[a]))
                    for (t in e) n = s[t], i = e[t], s !== i && (c && i && (pe.isPlainObject(i) || (o = Array.isArray(i))) ? (o ? (o = !1, r = n && Array.isArray(n) ? n : []) : r = n && pe.isPlainObject(n) ? n : {}, s[t] = pe.extend(c, r, i)) : void 0 !== i && (s[t] = i));
            return s
        }, pe.extend({
            expando: "jQuery" + (he + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === pe.type(e)
            },
            isWindow: function(e) {
                return null != e && e === e.window
            },
            isNumeric: function(e) {
                var t = pe.type(e);
                return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
            },
            isPlainObject: function(e) {
                var t, n;
                return !(!e || "[object Object]" !== le.call(e) || (t = ne(e)) && ("function" != typeof(n = ce.call(t, "constructor") && t.constructor) || ue.call(n) !== de))
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? ae[le.call(e)] || "object" : typeof e
            },
            globalEval: function(e) {
                n(e)
            },
            camelCase: function(e) {
                return e.replace(me, "ms-").replace(ve, ye)
            },
            each: function(e, t) {
                var n, o = 0;
                if (i(e))
                    for (n = e.length; o < n && !1 !== t.call(e[o], o, e[o]); o++);
                else
                    for (o in e)
                        if (!1 === t.call(e[o], o, e[o])) break;
                return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(ge, "")
            },
            makeArray: function(e, t) {
                var n = t || [];
                return null != e && (i(Object(e)) ? pe.merge(n, "string" == typeof e ? [e] : e) : re.call(n, e)), n
            },
            inArray: function(e, t, n) {
                return null == t ? -1 : se.call(t, e, n)
            },
            merge: function(e, t) {
                for (var n = +t.length, i = 0, o = e.length; i < n; i++) e[o++] = t[i];
                return e.length = o, e
            },
            grep: function(e, t, n) {
                for (var i = [], o = 0, r = e.length, s = !n; o < r; o++) !t(e[o], o) !== s && i.push(e[o]);
                return i
            },
            map: function(e, t, n) {
                var o, r, s = 0,
                    a = [];
                if (i(e))
                    for (o = e.length; s < o; s++) null != (r = t(e[s], s, n)) && a.push(r);
                else
                    for (s in e) null != (r = t(e[s], s, n)) && a.push(r);
                return oe.apply([], a)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, i, o;
                if ("string" == typeof t && (n = e[t], t = e, e = n), pe.isFunction(e)) return i = ie.call(arguments, 2), o = function() {
                    return e.apply(t || this, i.concat(ie.call(arguments)))
                }, o.guid = e.guid = e.guid || pe.guid++, o
            },
            now: Date.now,
            support: fe
        }), "function" == typeof Symbol && (pe.fn[Symbol.iterator] = ee[Symbol.iterator]), pe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
            ae["[object " + t + "]"] = t.toLowerCase()
        });
        var be = function(e) {
            function t(e, t, n, i) {
                var o, r, s, a, l, u, f, h = t && t.ownerDocument,
                    p = t ? t.nodeType : 9;
                if (n = n || [], "string" != typeof e || !e || 1 !== p && 9 !== p && 11 !== p) return n;
                if (!i && ((t ? t.ownerDocument || t : M) !== I && O(t), t = t || I, L)) {
                    if (11 !== p && (l = ge.exec(e)))
                        if (o = l[1]) {
                            if (9 === p) {
                                if (!(s = t.getElementById(o))) return n;
                                if (s.id === o) return n.push(s), n
                            } else if (h && (s = h.getElementById(o)) && P(t, s) && s.id === o) return n.push(s), n
                        } else {
                            if (l[2]) return K.apply(n, t.getElementsByTagName(e)), n;
                            if ((o = l[3]) && w.getElementsByClassName && t.getElementsByClassName) return K.apply(n, t.getElementsByClassName(o)), n
                        }
                    if (w.qsa && !B[e + " "] && (!$ || !$.test(e))) {
                        if (1 !== p) h = t, f = e;
                        else if ("object" !== t.nodeName.toLowerCase()) {
                            for ((a = t.getAttribute("id")) ? a = a.replace(be, we) : t.setAttribute("id", a = j), r = (u = E(e)).length; r--;) u[r] = "#" + a + " " + d(u[r]);
                            f = u.join(","), h = me.test(e) && c(t.parentNode) || t
                        }
                        if (f) try {
                            return K.apply(n, h.querySelectorAll(f)), n
                        } catch (e) {} finally {
                            a === j && t.removeAttribute("id")
                        }
                    }
                }
                return k(e.replace(re, "$1"), t, n, i)
            }

            function n() {
                function e(n, i) {
                    return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = i
                }
                var t = [];
                return e
            }

            function i(e) {
                return e[j] = !0, e
            }

            function o(e) {
                var t = I.createElement("fieldset");
                try {
                    return !!e(t)
                } catch (e) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function r(e, t) {
                for (var n = e.split("|"), i = n.length; i--;) T.attrHandle[n[i]] = t
            }

            function s(e, t) {
                var n = t && e,
                    i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function a(e) {
                return function(t) {
                    return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Ce(t) === e : t.disabled === e : "label" in t && t.disabled === e
                }
            }

            function l(e) {
                return i(function(t) {
                    return t = +t, i(function(n, i) {
                        for (var o, r = e([], n.length, t), s = r.length; s--;) n[o = r[s]] && (n[o] = !(i[o] = n[o]))
                    })
                })
            }

            function c(e) {
                return e && void 0 !== e.getElementsByTagName && e
            }

            function u() {}

            function d(e) {
                for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
                return i
            }

            function f(e, t, n) {
                var i = t.dir,
                    o = t.next,
                    r = o || i,
                    s = n && "parentNode" === r,
                    a = W++;
                return t.first ? function(t, n, o) {
                    for (; t = t[i];)
                        if (1 === t.nodeType || s) return e(t, n, o);
                    return !1
                } : function(t, n, l) {
                    var c, u, d, f = [R, a];
                    if (l) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || s) && e(t, n, l)) return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || s)
                                if (d = t[j] || (t[j] = {}), u = d[t.uniqueID] || (d[t.uniqueID] = {}), o && o === t.nodeName.toLowerCase()) t = t[i] || t;
                                else {
                                    if ((c = u[r]) && c[0] === R && c[1] === a) return f[2] = c[2];
                                    if (u[r] = f, f[2] = e(t, n, l)) return !0
                                } return !1
                }
            }

            function h(e) {
                return e.length > 1 ? function(t, n, i) {
                    for (var o = e.length; o--;)
                        if (!e[o](t, n, i)) return !1;
                    return !0
                } : e[0]
            }

            function p(e, n, i) {
                for (var o = 0, r = n.length; o < r; o++) t(e, n[o], i);
                return i
            }

            function g(e, t, n, i, o) {
                for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)(r = e[a]) && (n && !n(r, i, o) || (s.push(r), c && t.push(a)));
                return s
            }

            function m(e, t, n, o, r, s) {
                return o && !o[j] && (o = m(o)), r && !r[j] && (r = m(r, s)), i(function(i, s, a, l) {
                    var c, u, d, f = [],
                        h = [],
                        m = s.length,
                        v = i || p(t || "*", a.nodeType ? [a] : a, []),
                        y = !e || !i && t ? v : g(v, f, e, a, l),
                        b = n ? r || (i ? e : m || o) ? [] : s : y;
                    if (n && n(y, b, a, l), o)
                        for (c = g(b, h), o(c, [], a, l), u = c.length; u--;)(d = c[u]) && (b[h[u]] = !(y[h[u]] = d));
                    if (i) {
                        if (r || e) {
                            if (r) {
                                for (c = [], u = b.length; u--;)(d = b[u]) && c.push(y[u] = d);
                                r(null, b = [], c, l)
                            }
                            for (u = b.length; u--;)(d = b[u]) && (c = r ? Z(i, d) : f[u]) > -1 && (i[c] = !(s[c] = d))
                        }
                    } else b = g(b === s ? b.splice(m, b.length) : b), r ? r(null, s, b, l) : K.apply(s, b)
                })
            }

            function v(e) {
                for (var t, n, i, o = e.length, r = T.relative[e[0].type], s = r || T.relative[" "], a = r ? 1 : 0, l = f(function(e) {
                        return e === t
                    }, s, !0), c = f(function(e) {
                        return Z(t, e) > -1
                    }, s, !0), u = [function(e, n, i) {
                        var o = !r && (i || n !== x) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i));
                        return t = null, o
                    }]; a < o; a++)
                    if (n = T.relative[e[a].type]) u = [f(h(u), n)];
                    else {
                        if ((n = T.filter[e[a].type].apply(null, e[a].matches))[j]) {
                            for (i = ++a; i < o && !T.relative[e[i].type]; i++);
                            return m(a > 1 && h(u), a > 1 && d(e.slice(0, a - 1).concat({
                                value: " " === e[a - 2].type ? "*" : ""
                            })).replace(re, "$1"), n, a < i && v(e.slice(a, i)), i < o && v(e = e.slice(i)), i < o && d(e))
                        }
                        u.push(n)
                    }
                return h(u)
            }

            function y(e, n) {
                var o = n.length > 0,
                    r = e.length > 0,
                    s = function(i, s, a, l, c) {
                        var u, d, f, h = 0,
                            p = "0",
                            m = i && [],
                            v = [],
                            y = x,
                            b = i || r && T.find.TAG("*", c),
                            w = R += null == y ? 1 : Math.random() || .1,
                            C = b.length;
                        for (c && (x = s === I || s || c); p !== C && null != (u = b[p]); p++) {
                            if (r && u) {
                                for (d = 0, s || u.ownerDocument === I || (O(u), a = !L); f = e[d++];)
                                    if (f(u, s || I, a)) {
                                        l.push(u);
                                        break
                                    }
                                c && (R = w)
                            }
                            o && ((u = !f && u) && h--, i && m.push(u))
                        }
                        if (h += p, o && p !== h) {
                            for (d = 0; f = n[d++];) f(m, v, s, a);
                            if (i) {
                                if (h > 0)
                                    for (; p--;) m[p] || v[p] || (v[p] = Y.call(l));
                                v = g(v)
                            }
                            K.apply(l, v), c && !i && v.length > 0 && h + n.length > 1 && t.uniqueSort(l)
                        }
                        return c && (R = w, x = y), m
                    };
                return o ? i(s) : s
            }
            var b, w, T, C, _, E, S, k, x, A, D, O, I, N, L, $, H, F, P, j = "sizzle" + 1 * new Date,
                M = e.document,
                R = 0,
                W = 0,
                q = n(),
                z = n(),
                B = n(),
                U = function(e, t) {
                    return e === t && (D = !0), 0
                },
                V = {}.hasOwnProperty,
                X = [],
                Y = X.pop,
                G = X.push,
                K = X.push,
                Q = X.slice,
                Z = function(e, t) {
                    for (var n = 0, i = e.length; n < i; n++)
                        if (e[n] === t) return n;
                    return -1
                },
                J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ee = "[\\x20\\t\\r\\n\\f]",
                te = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
                ne = "\\[" + ee + "*(" + te + ")(?:" + ee + "*([*^$|!~]?=)" + ee + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + te + "))|)" + ee + "*\\]",
                ie = ":(" + te + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ne + ")*)|.*)\\)|)",
                oe = new RegExp(ee + "+", "g"),
                re = new RegExp("^" + ee + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ee + "+$", "g"),
                se = new RegExp("^" + ee + "*," + ee + "*"),
                ae = new RegExp("^" + ee + "*([>+~]|" + ee + ")" + ee + "*"),
                le = new RegExp("=" + ee + "*([^\\]'\"]*?)" + ee + "*\\]", "g"),
                ce = new RegExp(ie),
                ue = new RegExp("^" + te + "$"),
                de = {
                    ID: new RegExp("^#(" + te + ")"),
                    CLASS: new RegExp("^\\.(" + te + ")"),
                    TAG: new RegExp("^(" + te + "|[*])"),
                    ATTR: new RegExp("^" + ne),
                    PSEUDO: new RegExp("^" + ie),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ee + "*(even|odd|(([+-]|)(\\d*)n|)" + ee + "*(?:([+-]|)" + ee + "*(\\d+)|))" + ee + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + J + ")$", "i"),
                    needsContext: new RegExp("^" + ee + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ee + "*((?:-\\d)?\\d*)" + ee + "*\\)|)(?=[^-]|$)", "i")
                },
                fe = /^(?:input|select|textarea|button)$/i,
                he = /^h\d$/i,
                pe = /^[^{]+\{\s*\[native \w/,
                ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                me = /[+~]/,
                ve = new RegExp("\\\\([\\da-f]{1,6}" + ee + "?|(" + ee + ")|.)", "ig"),
                ye = function(e, t, n) {
                    var i = "0x" + t - 65536;
                    return i !== i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                },
                be = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                we = function(e, t) {
                    return t ? "\0" === e ? "ï¿½" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
                },
                Te = function() {
                    O()
                },
                Ce = f(function(e) {
                    return !0 === e.disabled && ("form" in e || "label" in e)
                }, {
                    dir: "parentNode",
                    next: "legend"
                });
            try {
                K.apply(X = Q.call(M.childNodes), M.childNodes), X[M.childNodes.length].nodeType
            } catch (e) {
                K = {
                    apply: X.length ? function(e, t) {
                        G.apply(e, Q.call(t))
                    } : function(e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];);
                        e.length = n - 1
                    }
                }
            }
            w = t.support = {}, _ = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            }, O = t.setDocument = function(e) {
                var t, n, i = e ? e.ownerDocument || e : M;
                return i !== I && 9 === i.nodeType && i.documentElement ? (I = i, N = I.documentElement, L = !_(I), M !== I && (n = I.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)), w.attributes = o(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), w.getElementsByTagName = o(function(e) {
                    return e.appendChild(I.createComment("")), !e.getElementsByTagName("*").length
                }), w.getElementsByClassName = pe.test(I.getElementsByClassName), w.getById = o(function(e) {
                    return N.appendChild(e).id = j, !I.getElementsByName || !I.getElementsByName(j).length
                }), w.getById ? (T.filter.ID = function(e) {
                    var t = e.replace(ve, ye);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }, T.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && L) {
                        var n = t.getElementById(e);
                        return n ? [n] : []
                    }
                }) : (T.filter.ID = function(e) {
                    var t = e.replace(ve, ye);
                    return function(e) {
                        var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }, T.find.ID = function(e, t) {
                    if (void 0 !== t.getElementById && L) {
                        var n, i, o, r = t.getElementById(e);
                        if (r) {
                            if ((n = r.getAttributeNode("id")) && n.value === e) return [r];
                            for (o = t.getElementsByName(e), i = 0; r = o[i++];)
                                if ((n = r.getAttributeNode("id")) && n.value === e) return [r]
                        }
                        return []
                    }
                }), T.find.TAG = w.getElementsByTagName ? function(e, t) {
                    return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var n, i = [],
                        o = 0,
                        r = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = r[o++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return r
                }, T.find.CLASS = w.getElementsByClassName && function(e, t) {
                    if (void 0 !== t.getElementsByClassName && L) return t.getElementsByClassName(e)
                }, H = [], $ = [], (w.qsa = pe.test(I.querySelectorAll)) && (o(function(e) {
                    N.appendChild(e).innerHTML = "<a id='" + j + "'></a><select id='" + j + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && $.push("[*^$]=" + ee + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || $.push("\\[" + ee + "*(?:value|" + J + ")"), e.querySelectorAll("[id~=" + j + "-]").length || $.push("~="), e.querySelectorAll(":checked").length || $.push(":checked"), e.querySelectorAll("a#" + j + "+*").length || $.push(".#.+[+~]")
                }), o(function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = I.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && $.push("name" + ee + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && $.push(":enabled", ":disabled"), N.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && $.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), $.push(",.*:")
                })), (w.matchesSelector = pe.test(F = N.matches || N.webkitMatchesSelector || N.mozMatchesSelector || N.oMatchesSelector || N.msMatchesSelector)) && o(function(e) {
                    w.disconnectedMatch = F.call(e, "*"), F.call(e, "[s!='']:x"), H.push("!=", ie)
                }), $ = $.length && new RegExp($.join("|")), H = H.length && new RegExp(H.join("|")), t = pe.test(N.compareDocumentPosition), P = t || pe.test(N.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, U = t ? function(e, t) {
                    if (e === t) return D = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === I || e.ownerDocument === M && P(M, e) ? -1 : t === I || t.ownerDocument === M && P(M, t) ? 1 : A ? Z(A, e) - Z(A, t) : 0 : 4 & n ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return D = !0, 0;
                    var n, i = 0,
                        o = e.parentNode,
                        r = t.parentNode,
                        a = [e],
                        l = [t];
                    if (!o || !r) return e === I ? -1 : t === I ? 1 : o ? -1 : r ? 1 : A ? Z(A, e) - Z(A, t) : 0;
                    if (o === r) return s(e, t);
                    for (n = e; n = n.parentNode;) a.unshift(n);
                    for (n = t; n = n.parentNode;) l.unshift(n);
                    for (; a[i] === l[i];) i++;
                    return i ? s(a[i], l[i]) : a[i] === M ? -1 : l[i] === M ? 1 : 0
                }, I) : I
            }, t.matches = function(e, n) {
                return t(e, null, null, n)
            }, t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== I && O(e), n = n.replace(le, "='$1']"), w.matchesSelector && L && !B[n + " "] && (!H || !H.test(n)) && (!$ || !$.test(n))) try {
                    var i = F.call(e, n);
                    if (i || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (e) {}
                return t(n, I, null, [e]).length > 0
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== I && O(e), P(e, t)
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== I && O(e);
                var n = T.attrHandle[t.toLowerCase()],
                    i = n && V.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !L) : void 0;
                return void 0 !== i ? i : w.attributes || !L ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, t.escape = function(e) {
                return (e + "").replace(be, we)
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function(e) {
                var t, n = [],
                    i = 0,
                    o = 0;
                if (D = !w.detectDuplicates, A = !w.sortStable && e.slice(0), e.sort(U), D) {
                    for (; t = e[o++];) t === e[o] && (i = n.push(o));
                    for (; i--;) e.splice(n[i], 1)
                }
                return A = null, e
            }, C = t.getText = function(e) {
                var t, n = "",
                    i = 0,
                    o = e.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += C(e)
                    } else if (3 === o || 4 === o) return e.nodeValue
                } else
                    for (; t = e[i++];) n += C(t);
                return n
            }, (T = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: de,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(ve, ye), e[3] = (e[3] || e[4] || e[5] || "").replace(ve, ye), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return de.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ce.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(ve, ye).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = q[e + " "];
                        return t || (t = new RegExp("(^|" + ee + ")" + e + "(" + ee + "|$)")) && q(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, i) {
                        return function(o) {
                            var r = t.attr(o, e);
                            return null == r ? "!=" === n : !n || (r += "", "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r.replace(oe, " ") + " ").indexOf(i) > -1 : "|=" === n && (r === i || r.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(e, t, n, i, o) {
                        var r = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === i && 0 === o ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, l) {
                            var c, u, d, f, h, p, g = r !== s ? "nextSibling" : "previousSibling",
                                m = t.parentNode,
                                v = a && t.nodeName.toLowerCase(),
                                y = !l && !a,
                                b = !1;
                            if (m) {
                                if (r) {
                                    for (; g;) {
                                        for (f = t; f = f[g];)
                                            if (a ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                        p = g = "only" === e && !p && "nextSibling"
                                    }
                                    return !0
                                }
                                if (p = [s ? m.firstChild : m.lastChild], s && y) {
                                    for (b = (h = (c = (u = (d = (f = m)[j] || (f[j] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === R && c[1]) && c[2], f = h && m.childNodes[h]; f = ++h && f && f[g] || (b = h = 0) || p.pop();)
                                        if (1 === f.nodeType && ++b && f === t) {
                                            u[e] = [R, h, b];
                                            break
                                        }
                                } else if (y && (f = t, d = f[j] || (f[j] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), c = u[e] || [], h = c[0] === R && c[1], b = h), !1 === b)
                                    for (;
                                        (f = ++h && f && f[g] || (b = h = 0) || p.pop()) && ((a ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++b || (y && (d = f[j] || (f[j] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), u[e] = [R, b]), f !== t)););
                                return (b -= o) === i || b % i == 0 && b / i >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, n) {
                        var o, r = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return r[j] ? r(n) : r.length > 1 ? (o = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                            for (var i, o = r(e, n), s = o.length; s--;) i = Z(e, o[s]), e[i] = !(t[i] = o[s])
                        }) : function(e) {
                            return r(e, 0, o)
                        }) : r
                    }
                },
                pseudos: {
                    not: i(function(e) {
                        var t = [],
                            n = [],
                            o = S(e.replace(re, "$1"));
                        return o[j] ? i(function(e, t, n, i) {
                            for (var r, s = o(e, null, i, []), a = e.length; a--;)(r = s[a]) && (e[a] = !(t[a] = r))
                        }) : function(e, i, r) {
                            return t[0] = e, o(t, null, r, n), t[0] = null, !n.pop()
                        }
                    }),
                    has: i(function(e) {
                        return function(n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: i(function(e) {
                        return e = e.replace(ve, ye),
                            function(t) {
                                return (t.textContent || t.innerText || C(t)).indexOf(e) > -1
                            }
                    }),
                    lang: i(function(e) {
                        return ue.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(ve, ye).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = L ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === N
                    },
                    focus: function(e) {
                        return e === I.activeElement && (!I.hasFocus || I.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: a(!1),
                    disabled: a(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !T.pseudos.empty(e)
                    },
                    header: function(e) {
                        return he.test(e.nodeName)
                    },
                    input: function(e) {
                        return fe.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: l(function() {
                        return [0]
                    }),
                    last: l(function(e, t) {
                        return [t - 1]
                    }),
                    eq: l(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: l(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: l(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: l(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; --i >= 0;) e.push(i);
                        return e
                    }),
                    gt: l(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = T.pseudos.eq;
            for (b in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) T.pseudos[b] = function(e) {
                return function(t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e
                }
            }(b);
            for (b in {
                    submit: !0,
                    reset: !0
                }) T.pseudos[b] = function(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }(b);
            return u.prototype = T.filters = T.pseudos, T.setFilters = new u, E = t.tokenize = function(e, n) {
                var i, o, r, s, a, l, c, u = z[e + " "];
                if (u) return n ? 0 : u.slice(0);
                for (a = e, l = [], c = T.preFilter; a;) {
                    i && !(o = se.exec(a)) || (o && (a = a.slice(o[0].length) || a), l.push(r = [])), i = !1, (o = ae.exec(a)) && (i = o.shift(), r.push({
                        value: i,
                        type: o[0].replace(re, " ")
                    }), a = a.slice(i.length));
                    for (s in T.filter) !(o = de[s].exec(a)) || c[s] && !(o = c[s](o)) || (i = o.shift(), r.push({
                        value: i,
                        type: s,
                        matches: o
                    }), a = a.slice(i.length));
                    if (!i) break
                }
                return n ? a.length : a ? t.error(e) : z(e, l).slice(0)
            }, S = t.compile = function(e, t) {
                var n, i = [],
                    o = [],
                    r = B[e + " "];
                if (!r) {
                    for (t || (t = E(e)), n = t.length; n--;)(r = v(t[n]))[j] ? i.push(r) : o.push(r);
                    (r = B(e, y(o, i))).selector = e
                }
                return r
            }, k = t.select = function(e, t, n, i) {
                var o, r, s, a, l, u = "function" == typeof e && e,
                    f = !i && E(e = u.selector || e);
                if (n = n || [], 1 === f.length) {
                    if ((r = f[0] = f[0].slice(0)).length > 2 && "ID" === (s = r[0]).type && 9 === t.nodeType && L && T.relative[r[1].type]) {
                        if (!(t = (T.find.ID(s.matches[0].replace(ve, ye), t) || [])[0])) return n;
                        u && (t = t.parentNode), e = e.slice(r.shift().value.length)
                    }
                    for (o = de.needsContext.test(e) ? 0 : r.length; o-- && (s = r[o], !T.relative[a = s.type]);)
                        if ((l = T.find[a]) && (i = l(s.matches[0].replace(ve, ye), me.test(r[0].type) && c(t.parentNode) || t))) {
                            if (r.splice(o, 1), !(e = i.length && d(r))) return K.apply(n, i), n;
                            break
                        }
                }
                return (u || S(e, f))(i, t, !L, n, !t || me.test(e) && c(t.parentNode) || t), n
            }, w.sortStable = j.split("").sort(U).join("") === j, w.detectDuplicates = !!D, O(), w.sortDetached = o(function(e) {
                return 1 & e.compareDocumentPosition(I.createElement("fieldset"))
            }), o(function(e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
            }) || r("type|href|height|width", function(e, t, n) {
                if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }), w.attributes && o(function(e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
            }) || r("value", function(e, t, n) {
                if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
            }), o(function(e) {
                return null == e.getAttribute("disabled")
            }) || r(J, function(e, t, n) {
                var i;
                if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }), t
        }(e);
        pe.find = be, pe.expr = be.selectors, pe.expr[":"] = pe.expr.pseudos, pe.uniqueSort = pe.unique = be.uniqueSort, pe.text = be.getText, pe.isXMLDoc = be.isXML, pe.contains = be.contains, pe.escapeSelector = be.escape;
        var we = function(e, t, n) {
                for (var i = [], o = void 0 !== n;
                    (e = e[t]) && 9 !== e.nodeType;)
                    if (1 === e.nodeType) {
                        if (o && pe(e).is(n)) break;
                        i.push(e)
                    }
                return i
            },
            Te = function(e, t) {
                for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n
            },
            Ce = pe.expr.match.needsContext,
            _e = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
            Ee = /^.[^:#\[\.,]*$/;
        pe.filter = function(e, t, n) {
            var i = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? pe.find.matchesSelector(i, e) ? [i] : [] : pe.find.matches(e, pe.grep(t, function(e) {
                return 1 === e.nodeType
            }))
        }, pe.fn.extend({
            find: function(e) {
                var t, n, i = this.length,
                    o = this;
                if ("string" != typeof e) return this.pushStack(pe(e).filter(function() {
                    for (t = 0; t < i; t++)
                        if (pe.contains(o[t], this)) return !0
                }));
                for (n = this.pushStack([]), t = 0; t < i; t++) pe.find(e, o[t], n);
                return i > 1 ? pe.uniqueSort(n) : n
            },
            filter: function(e) {
                return this.pushStack(r(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(r(this, e || [], !0))
            },
            is: function(e) {
                return !!r(this, "string" == typeof e && Ce.test(e) ? pe(e) : e || [], !1).length
            }
        });
        var Se, ke = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
        (pe.fn.init = function(e, t, n) {
            var i, o;
            if (!e) return this;
            if (n = n || Se, "string" == typeof e) {
                if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : ke.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                if (i[1]) {
                    if (t = t instanceof pe ? t[0] : t, pe.merge(this, pe.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : te, !0)), _e.test(i[1]) && pe.isPlainObject(t))
                        for (i in t) pe.isFunction(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                    return this
                }
                return (o = te.getElementById(i[2])) && (this[0] = o, this.length = 1), this
            }
            return e.nodeType ? (this[0] = e, this.length = 1, this) : pe.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(pe) : pe.makeArray(e, this)
        }).prototype = pe.fn, Se = pe(te);
        var xe = /^(?:parents|prev(?:Until|All))/,
            Ae = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        pe.fn.extend({
            has: function(e) {
                var t = pe(e, this),
                    n = t.length;
                return this.filter(function() {
                    for (var e = 0; e < n; e++)
                        if (pe.contains(this, t[e])) return !0
                })
            },
            closest: function(e, t) {
                var n, i = 0,
                    o = this.length,
                    r = [],
                    s = "string" != typeof e && pe(e);
                if (!Ce.test(e))
                    for (; i < o; i++)
                        for (n = this[i]; n && n !== t; n = n.parentNode)
                            if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && pe.find.matchesSelector(n, e))) {
                                r.push(n);
                                break
                            }
                return this.pushStack(r.length > 1 ? pe.uniqueSort(r) : r)
            },
            index: function(e) {
                return e ? "string" == typeof e ? se.call(pe(e), this[0]) : se.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(pe.uniqueSort(pe.merge(this.get(), pe(e, t))))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }), pe.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return we(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return we(e, "parentNode", n)
            },
            next: function(e) {
                return s(e, "nextSibling")
            },
            prev: function(e) {
                return s(e, "previousSibling")
            },
            nextAll: function(e) {
                return we(e, "nextSibling")
            },
            prevAll: function(e) {
                return we(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return we(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return we(e, "previousSibling", n)
            },
            siblings: function(e) {
                return Te((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return Te(e.firstChild)
            },
            contents: function(e) {
                return o(e, "iframe") ? e.contentDocument : (o(e, "template") && (e = e.content || e), pe.merge([], e.childNodes))
            }
        }, function(e, t) {
            pe.fn[e] = function(n, i) {
                var o = pe.map(this, t, n);
                return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (o = pe.filter(i, o)), this.length > 1 && (Ae[e] || pe.uniqueSort(o), xe.test(e) && o.reverse()), this.pushStack(o)
            }
        });
        var De = /[^\x20\t\r\n\f]+/g;
        pe.Callbacks = function(e) {
            e = "string" == typeof e ? a(e) : pe.extend({}, e);
            var t, n, i, o, r = [],
                s = [],
                l = -1,
                c = function() {
                    for (o = o || e.once, i = t = !0; s.length; l = -1)
                        for (n = s.shift(); ++l < r.length;) !1 === r[l].apply(n[0], n[1]) && e.stopOnFalse && (l = r.length, n = !1);
                    e.memory || (n = !1), t = !1, o && (r = n ? [] : "")
                },
                u = {
                    add: function() {
                        return r && (n && !t && (l = r.length - 1, s.push(n)), function t(n) {
                            pe.each(n, function(n, i) {
                                pe.isFunction(i) ? e.unique && u.has(i) || r.push(i) : i && i.length && "string" !== pe.type(i) && t(i)
                            })
                        }(arguments), n && !t && c()), this
                    },
                    remove: function() {
                        return pe.each(arguments, function(e, t) {
                            for (var n;
                                (n = pe.inArray(t, r, n)) > -1;) r.splice(n, 1), n <= l && l--
                        }), this
                    },
                    has: function(e) {
                        return e ? pe.inArray(e, r) > -1 : r.length > 0
                    },
                    empty: function() {
                        return r && (r = []), this
                    },
                    disable: function() {
                        return o = s = [], r = n = "", this
                    },
                    disabled: function() {
                        return !r
                    },
                    lock: function() {
                        return o = s = [], n || t || (r = n = ""), this
                    },
                    locked: function() {
                        return !!o
                    },
                    fireWith: function(e, n) {
                        return o || (n = n || [], n = [e, n.slice ? n.slice() : n], s.push(n), t || c()), this
                    },
                    fire: function() {
                        return u.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i
                    }
                };
            return u
        }, pe.extend({
            Deferred: function(t) {
                var n = [
                        ["notify", "progress", pe.Callbacks("memory"), pe.Callbacks("memory"), 2],
                        ["resolve", "done", pe.Callbacks("once memory"), pe.Callbacks("once memory"), 0, "resolved"],
                        ["reject", "fail", pe.Callbacks("once memory"), pe.Callbacks("once memory"), 1, "rejected"]
                    ],
                    i = "pending",
                    o = {
                        state: function() {
                            return i
                        },
                        always: function() {
                            return r.done(arguments).fail(arguments), this
                        },
                        catch: function(e) {
                            return o.then(null, e)
                        },
                        pipe: function() {
                            var e = arguments;
                            return pe.Deferred(function(t) {
                                pe.each(n, function(n, i) {
                                    var o = pe.isFunction(e[i[4]]) && e[i[4]];
                                    r[i[1]](function() {
                                        var e = o && o.apply(this, arguments);
                                        e && pe.isFunction(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, o ? [e] : arguments)
                                    })
                                }), e = null
                            }).promise()
                        },
                        then: function(t, i, o) {
                            function r(t, n, i, o) {
                                return function() {
                                    var a = this,
                                        u = arguments,
                                        d = function() {
                                            var e, d;
                                            if (!(t < s)) {
                                                if ((e = i.apply(a, u)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                                d = e && ("object" == typeof e || "function" == typeof e) && e.then, pe.isFunction(d) ? o ? d.call(e, r(s, n, l, o), r(s, n, c, o)) : (s++, d.call(e, r(s, n, l, o), r(s, n, c, o), r(s, n, l, n.notifyWith))) : (i !== l && (a = void 0, u = [e]), (o || n.resolveWith)(a, u))
                                            }
                                        },
                                        f = o ? d : function() {
                                            try {
                                                d()
                                            } catch (e) {
                                                pe.Deferred.exceptionHook && pe.Deferred.exceptionHook(e, f.stackTrace), t + 1 >= s && (i !== c && (a = void 0, u = [e]), n.rejectWith(a, u))
                                            }
                                        };
                                    t ? f() : (pe.Deferred.getStackHook && (f.stackTrace = pe.Deferred.getStackHook()), e.setTimeout(f))
                                }
                            }
                            var s = 0;
                            return pe.Deferred(function(e) {
                                n[0][3].add(r(0, e, pe.isFunction(o) ? o : l, e.notifyWith)), n[1][3].add(r(0, e, pe.isFunction(t) ? t : l)), n[2][3].add(r(0, e, pe.isFunction(i) ? i : c))
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? pe.extend(e, o) : o
                        }
                    },
                    r = {};
                return pe.each(n, function(e, t) {
                    var s = t[2],
                        a = t[5];
                    o[t[1]] = s.add, a && s.add(function() {
                        i = a
                    }, n[3 - e][2].disable, n[0][2].lock), s.add(t[3].fire), r[t[0]] = function() {
                        return r[t[0] + "With"](this === r ? void 0 : this, arguments), this
                    }, r[t[0] + "With"] = s.fireWith
                }), o.promise(r), t && t.call(r, r), r
            },
            when: function(e) {
                var t = arguments.length,
                    n = t,
                    i = Array(n),
                    o = ie.call(arguments),
                    r = pe.Deferred(),
                    s = function(e) {
                        return function(n) {
                            i[e] = this, o[e] = arguments.length > 1 ? ie.call(arguments) : n, --t || r.resolveWith(i, o)
                        }
                    };
                if (t <= 1 && (u(e, r.done(s(n)).resolve, r.reject, !t), "pending" === r.state() || pe.isFunction(o[n] && o[n].then))) return r.then();
                for (; n--;) u(o[n], s(n), r.reject);
                return r.promise()
            }
        });
        var Oe = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
        pe.Deferred.exceptionHook = function(t, n) {
            e.console && e.console.warn && t && Oe.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
        }, pe.readyException = function(t) {
            e.setTimeout(function() {
                throw t
            })
        };
        var Ie = pe.Deferred();
        pe.fn.ready = function(e) {
            return Ie.then(e).catch(function(e) {
                pe.readyException(e)
            }), this
        }, pe.extend({
            isReady: !1,
            readyWait: 1,
            ready: function(e) {
                (!0 === e ? --pe.readyWait : pe.isReady) || (pe.isReady = !0, !0 !== e && --pe.readyWait > 0 || Ie.resolveWith(te, [pe]))
            }
        }), pe.ready.then = Ie.then, "complete" === te.readyState || "loading" !== te.readyState && !te.documentElement.doScroll ? e.setTimeout(pe.ready) : (te.addEventListener("DOMContentLoaded", d), e.addEventListener("load", d));
        var Ne = function(e, t, n, i, o, r, s) {
                var a = 0,
                    l = e.length,
                    c = null == n;
                if ("object" === pe.type(n)) {
                    o = !0;
                    for (a in n) Ne(e, t, a, n[a], !0, r, s)
                } else if (void 0 !== i && (o = !0, pe.isFunction(i) || (s = !0), c && (s ? (t.call(e, i), t = null) : (c = t, t = function(e, t, n) {
                        return c.call(pe(e), n)
                    })), t))
                    for (; a < l; a++) t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
                return o ? e : c ? t.call(e) : l ? t(e[0], n) : r
            },
            Le = function(e) {
                return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
            };
        f.uid = 1, f.prototype = {
            cache: function(e) {
                var t = e[this.expando];
                return t || (t = {}, Le(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0
                }))), t
            },
            set: function(e, t, n) {
                var i, o = this.cache(e);
                if ("string" == typeof t) o[pe.camelCase(t)] = n;
                else
                    for (i in t) o[pe.camelCase(i)] = t[i];
                return o
            },
            get: function(e, t) {
                return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][pe.camelCase(t)]
            },
            access: function(e, t, n) {
                return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
            },
            remove: function(e, t) {
                var n, i = e[this.expando];
                if (void 0 !== i) {
                    if (void 0 !== t) {
                        Array.isArray(t) ? t = t.map(pe.camelCase) : (t = pe.camelCase(t), t = t in i ? [t] : t.match(De) || []), n = t.length;
                        for (; n--;) delete i[t[n]]
                    }(void 0 === t || pe.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                }
            },
            hasData: function(e) {
                var t = e[this.expando];
                return void 0 !== t && !pe.isEmptyObject(t)
            }
        };
        var $e = new f,
            He = new f,
            Fe = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Pe = /[A-Z]/g;
        pe.extend({
            hasData: function(e) {
                return He.hasData(e) || $e.hasData(e)
            },
            data: function(e, t, n) {
                return He.access(e, t, n)
            },
            removeData: function(e, t) {
                He.remove(e, t)
            },
            _data: function(e, t, n) {
                return $e.access(e, t, n)
            },
            _removeData: function(e, t) {
                $e.remove(e, t)
            }
        }), pe.fn.extend({
            data: function(e, t) {
                var n, i, o, r = this[0],
                    s = r && r.attributes;
                if (void 0 === e) {
                    if (this.length && (o = He.get(r), 1 === r.nodeType && !$e.get(r, "hasDataAttrs"))) {
                        for (n = s.length; n--;) s[n] && 0 === (i = s[n].name).indexOf("data-") && (i = pe.camelCase(i.slice(5)), p(r, i, o[i]));
                        $e.set(r, "hasDataAttrs", !0)
                    }
                    return o
                }
                return "object" == typeof e ? this.each(function() {
                    He.set(this, e)
                }) : Ne(this, function(t) {
                    var n;
                    if (r && void 0 === t) {
                        if (void 0 !== (n = He.get(r, e))) return n;
                        if (void 0 !== (n = p(r, e))) return n
                    } else this.each(function() {
                        He.set(this, e, t)
                    })
                }, null, t, arguments.length > 1, null, !0)
            },
            removeData: function(e) {
                return this.each(function() {
                    He.remove(this, e)
                })
            }
        }), pe.extend({
            queue: function(e, t, n) {
                var i;
                if (e) return t = (t || "fx") + "queue", i = $e.get(e, t), n && (!i || Array.isArray(n) ? i = $e.access(e, t, pe.makeArray(n)) : i.push(n)), i || []
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = pe.queue(e, t),
                    i = n.length,
                    o = n.shift(),
                    r = pe._queueHooks(e, t);
                "inprogress" === o && (o = n.shift(), i--), o && ("fx" === t && n.unshift("inprogress"), delete r.stop, o.call(e, function() {
                    pe.dequeue(e, t)
                }, r)), !i && r && r.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return $e.get(e, n) || $e.access(e, n, {
                    empty: pe.Callbacks("once memory").add(function() {
                        $e.remove(e, [t + "queue", n])
                    })
                })
            }
        }), pe.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? pe.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                    var n = pe.queue(this, e, t);
                    pe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && pe.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    pe.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, i = 1,
                    o = pe.Deferred(),
                    r = this,
                    s = this.length,
                    a = function() {
                        --i || o.resolveWith(r, [r])
                    };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;)(n = $e.get(r[s], e + "queueHooks")) && n.empty && (i++, n.empty.add(a));
                return a(), o.promise(t)
            }
        });
        var je = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            Me = new RegExp("^(?:([+-])=|)(" + je + ")([a-z%]*)$", "i"),
            Re = ["Top", "Right", "Bottom", "Left"],
            We = function(e, t) {
                return "none" === (e = t || e).style.display || "" === e.style.display && pe.contains(e.ownerDocument, e) && "none" === pe.css(e, "display")
            },
            qe = function(e, t, n, i) {
                var o, r, s = {};
                for (r in t) s[r] = e.style[r], e.style[r] = t[r];
                o = n.apply(e, i || []);
                for (r in t) e.style[r] = s[r];
                return o
            },
            ze = {};
        pe.fn.extend({
            show: function() {
                return v(this, !0)
            },
            hide: function() {
                return v(this)
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                    We(this) ? pe(this).show() : pe(this).hide()
                })
            }
        });
        var Be = /^(?:checkbox|radio)$/i,
            Ue = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
            Ve = /^$|\/(?:java|ecma)script/i,
            Xe = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
        Xe.optgroup = Xe.option, Xe.tbody = Xe.tfoot = Xe.colgroup = Xe.caption = Xe.thead, Xe.th = Xe.td;
        var Ye = /<|&#?\w+;/;
        ! function() {
            var e = te.createDocumentFragment().appendChild(te.createElement("div")),
                t = te.createElement("input");
            t.setAttribute("type", "radio"), t.setAttribute("checked", "checked"), t.setAttribute("name", "t"), e.appendChild(t), fe.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, e.innerHTML = "<textarea>x</textarea>", fe.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue
        }();
        var Ge = te.documentElement,
            Ke = /^key/,
            Qe = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Ze = /^([^.]*)(?:\.(.+)|)/;
        pe.event = {
            global: {},
            add: function(e, t, n, i, o) {
                var r, s, a, l, c, u, d, f, h, p, g, m = $e.get(e);
                if (m)
                    for (n.handler && (r = n, n = r.handler, o = r.selector), o && pe.find.matchesSelector(Ge, o), n.guid || (n.guid = pe.guid++), (l = m.events) || (l = m.events = {}), (s = m.handle) || (s = m.handle = function(t) {
                            return void 0 !== pe && pe.event.triggered !== t.type ? pe.event.dispatch.apply(e, arguments) : void 0
                        }), c = (t = (t || "").match(De) || [""]).length; c--;) a = Ze.exec(t[c]) || [], h = g = a[1], p = (a[2] || "").split(".").sort(), h && (d = pe.event.special[h] || {}, h = (o ? d.delegateType : d.bindType) || h, d = pe.event.special[h] || {}, u = pe.extend({
                        type: h,
                        origType: g,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && pe.expr.match.needsContext.test(o),
                        namespace: p.join(".")
                    }, r), (f = l[h]) || (f = l[h] = [], f.delegateCount = 0, d.setup && !1 !== d.setup.call(e, i, p, s) || e.addEventListener && e.addEventListener(h, s)), d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), o ? f.splice(f.delegateCount++, 0, u) : f.push(u), pe.event.global[h] = !0)
            },
            remove: function(e, t, n, i, o) {
                var r, s, a, l, c, u, d, f, h, p, g, m = $e.hasData(e) && $e.get(e);
                if (m && (l = m.events)) {
                    for (c = (t = (t || "").match(De) || [""]).length; c--;)
                        if (a = Ze.exec(t[c]) || [], h = g = a[1], p = (a[2] || "").split(".").sort(), h) {
                            for (d = pe.event.special[h] || {}, f = l[h = (i ? d.delegateType : d.bindType) || h] || [], a = a[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = r = f.length; r--;) u = f[r], !o && g !== u.origType || n && n.guid !== u.guid || a && !a.test(u.namespace) || i && i !== u.selector && ("**" !== i || !u.selector) || (f.splice(r, 1), u.selector && f.delegateCount--, d.remove && d.remove.call(e, u));
                            s && !f.length && (d.teardown && !1 !== d.teardown.call(e, p, m.handle) || pe.removeEvent(e, h, m.handle), delete l[h])
                        } else
                            for (h in l) pe.event.remove(e, h + t[c], n, i, !0);
                    pe.isEmptyObject(l) && $e.remove(e, "handle events")
                }
            },
            dispatch: function(e) {
                var t, n, i, o, r, s, a = pe.event.fix(e),
                    l = new Array(arguments.length),
                    c = ($e.get(this, "events") || {})[a.type] || [],
                    u = pe.event.special[a.type] || {};
                for (l[0] = a, t = 1; t < arguments.length; t++) l[t] = arguments[t];
                if (a.delegateTarget = this, !u.preDispatch || !1 !== u.preDispatch.call(this, a)) {
                    for (s = pe.event.handlers.call(this, a, c), t = 0;
                        (o = s[t++]) && !a.isPropagationStopped();)
                        for (a.currentTarget = o.elem, n = 0;
                            (r = o.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !a.rnamespace.test(r.namespace) || (a.handleObj = r, a.data = r.data, void 0 !== (i = ((pe.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, l)) && !1 === (a.result = i) && (a.preventDefault(), a.stopPropagation()));
                    return u.postDispatch && u.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(e, t) {
                var n, i, o, r, s, a = [],
                    l = t.delegateCount,
                    c = e.target;
                if (l && c.nodeType && !("click" === e.type && e.button >= 1))
                    for (; c !== this; c = c.parentNode || this)
                        if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                            for (r = [], s = {}, n = 0; n < l; n++) i = t[n], o = i.selector + " ", void 0 === s[o] && (s[o] = i.needsContext ? pe(o, this).index(c) > -1 : pe.find(o, this, null, [c]).length), s[o] && r.push(i);
                            r.length && a.push({
                                elem: c,
                                handlers: r
                            })
                        }
                return c = this, l < t.length && a.push({
                    elem: c,
                    handlers: t.slice(l)
                }), a
            },
            addProp: function(e, t) {
                Object.defineProperty(pe.Event.prototype, e, {
                    enumerable: !0,
                    configurable: !0,
                    get: pe.isFunction(t) ? function() {
                        if (this.originalEvent) return t(this.originalEvent)
                    } : function() {
                        if (this.originalEvent) return this.originalEvent[e]
                    },
                    set: function(t) {
                        Object.defineProperty(this, e, {
                            enumerable: !0,
                            configurable: !0,
                            writable: !0,
                            value: t
                        })
                    }
                })
            },
            fix: function(e) {
                return e[pe.expando] ? e : new pe.Event(e)
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== _() && this.focus) return this.focus(), !1
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === _() && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if ("checkbox" === this.type && this.click && o(this, "input")) return this.click(), !1
                    },
                    _default: function(e) {
                        return o(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            }
        }, pe.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n)
        }, pe.Event = function(e, t) {
            return this instanceof pe.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? T : C, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && pe.extend(this, t), this.timeStamp = e && e.timeStamp || pe.now(), void(this[pe.expando] = !0)) : new pe.Event(e, t)
        }, pe.Event.prototype = {
            constructor: pe.Event,
            isDefaultPrevented: C,
            isPropagationStopped: C,
            isImmediatePropagationStopped: C,
            isSimulated: !1,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = T, e && !this.isSimulated && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = T, e && !this.isSimulated && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = T, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
            }
        }, pe.each({
            altKey: !0,
            bubbles: !0,
            cancelable: !0,
            changedTouches: !0,
            ctrlKey: !0,
            detail: !0,
            eventPhase: !0,
            metaKey: !0,
            pageX: !0,
            pageY: !0,
            shiftKey: !0,
            view: !0,
            char: !0,
            charCode: !0,
            key: !0,
            keyCode: !0,
            button: !0,
            buttons: !0,
            clientX: !0,
            clientY: !0,
            offsetX: !0,
            offsetY: !0,
            pointerId: !0,
            pointerType: !0,
            screenX: !0,
            screenY: !0,
            targetTouches: !0,
            toElement: !0,
            touches: !0,
            which: function(e) {
                var t = e.button;
                return null == e.which && Ke.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Qe.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
            }
        }, pe.event.addProp), pe.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            pe.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, i = this,
                        o = e.relatedTarget,
                        r = e.handleObj;
                    return o && (o === i || pe.contains(i, o)) || (e.type = r.origType, n = r.handler.apply(this, arguments), e.type = t), n
                }
            }
        }), pe.fn.extend({
            on: function(e, t, n, i) {
                return E(this, e, t, n, i)
            },
            one: function(e, t, n, i) {
                return E(this, e, t, n, i, 1)
            },
            off: function(e, t, n) {
                var i, o;
                if (e && e.preventDefault && e.handleObj) return i = e.handleObj, pe(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof e) {
                    for (o in e) this.off(o, t, e[o]);
                    return this
                }
                return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = C), this.each(function() {
                    pe.event.remove(this, e, n, t)
                })
            }
        });
        var Je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
            et = /<script|<style|<link/i,
            tt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            nt = /^true\/(.*)/,
            it = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
        pe.extend({
            htmlPrefilter: function(e) {
                return e.replace(Je, "<$1></$2>")
            },
            clone: function(e, t, n) {
                var i, o, r, s, a = e.cloneNode(!0),
                    l = pe.contains(e.ownerDocument, e);
                if (!(fe.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || pe.isXMLDoc(e)))
                    for (s = y(a), r = y(e), i = 0, o = r.length; i < o; i++) D(r[i], s[i]);
                if (t)
                    if (n)
                        for (r = r || y(e), s = s || y(a), i = 0, o = r.length; i < o; i++) A(r[i], s[i]);
                    else A(e, a);
                return (s = y(a, "script")).length > 0 && b(s, !l && y(e, "script")), a
            },
            cleanData: function(e) {
                for (var t, n, i, o = pe.event.special, r = 0; void 0 !== (n = e[r]); r++)
                    if (Le(n)) {
                        if (t = n[$e.expando]) {
                            if (t.events)
                                for (i in t.events) o[i] ? pe.event.remove(n, i) : pe.removeEvent(n, i, t.handle);
                            n[$e.expando] = void 0
                        }
                        n[He.expando] && (n[He.expando] = void 0)
                    }
            }
        }), pe.fn.extend({
            detach: function(e) {
                return I(this, e, !0)
            },
            remove: function(e) {
                return I(this, e)
            },
            text: function(e) {
                return Ne(this, function(e) {
                    return void 0 === e ? pe.text(this) : this.empty().each(function() {
                        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return O(this, arguments, function(e) {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || S(this, e).appendChild(e)
                })
            },
            prepend: function() {
                return O(this, arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = S(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return O(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return O(this, arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (pe.cleanData(y(e, !1)), e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = null != e && e, t = null == t ? e : t, this.map(function() {
                    return pe.clone(this, e, t)
                })
            },
            html: function(e) {
                return Ne(this, function(e) {
                    var t = this[0] || {},
                        n = 0,
                        i = this.length;
                    if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                    if ("string" == typeof e && !et.test(e) && !Xe[(Ue.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = pe.htmlPrefilter(e);
                        try {
                            for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (pe.cleanData(y(t, !1)), t.innerHTML = e);
                            t = 0
                        } catch (e) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = [];
                return O(this, arguments, function(t) {
                    var n = this.parentNode;
                    pe.inArray(this, e) < 0 && (pe.cleanData(y(this)), n && n.replaceChild(t, this))
                }, e)
            }
        }), pe.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            pe.fn[e] = function(e) {
                for (var n, i = [], o = pe(e), r = o.length - 1, s = 0; s <= r; s++) n = s === r ? this : this.clone(!0), pe(o[s])[t](n), re.apply(i, n.get());
                return this.pushStack(i)
            }
        });
        var ot = /^margin/,
            rt = new RegExp("^(" + je + ")(?!px)[a-z%]+$", "i"),
            st = function(t) {
                var n = t.ownerDocument.defaultView;
                return n && n.opener || (n = e), n.getComputedStyle(t)
            };
        ! function() {
            function t() {
                if (a) {
                    a.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", a.innerHTML = "", Ge.appendChild(s);
                    var t = e.getComputedStyle(a);
                    n = "1%" !== t.top, r = "2px" === t.marginLeft, i = "4px" === t.width, a.style.marginRight = "50%", o = "4px" === t.marginRight, Ge.removeChild(s), a = null
                }
            }
            var n, i, o, r, s = te.createElement("div"),
                a = te.createElement("div");
            a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", fe.clearCloneStyle = "content-box" === a.style.backgroundClip, s.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", s.appendChild(a), pe.extend(fe, {
                pixelPosition: function() {
                    return t(), n
                },
                boxSizingReliable: function() {
                    return t(), i
                },
                pixelMarginRight: function() {
                    return t(), o
                },
                reliableMarginLeft: function() {
                    return t(), r
                }
            }))
        }();
        var at = /^(none|table(?!-c[ea]).+)/,
            lt = /^--/,
            ct = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            ut = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            dt = ["Webkit", "Moz", "ms"],
            ft = te.createElement("div").style;
        pe.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = N(e, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                float: "cssFloat"
            },
            style: function(e, t, n, i) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var o, r, s, a = pe.camelCase(t),
                        l = lt.test(t),
                        c = e.style;
                    return l || (t = H(a)), s = pe.cssHooks[t] || pe.cssHooks[a], void 0 === n ? s && "get" in s && void 0 !== (o = s.get(e, !1, i)) ? o : c[t] : ("string" === (r = typeof n) && (o = Me.exec(n)) && o[1] && (n = g(e, t, o), r = "number"), void(null != n && n === n && ("number" === r && (n += o && o[3] || (pe.cssNumber[a] ? "" : "px")), fe.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"), s && "set" in s && void 0 === (n = s.set(e, n, i)) || (l ? c.setProperty(t, n) : c[t] = n))))
                }
            },
            css: function(e, t, n, i) {
                var o, r, s, a = pe.camelCase(t);
                return lt.test(t) || (t = H(a)), (s = pe.cssHooks[t] || pe.cssHooks[a]) && "get" in s && (o = s.get(e, !0, n)), void 0 === o && (o = N(e, t, i)), "normal" === o && t in ut && (o = ut[t]), "" === n || n ? (r = parseFloat(o), !0 === n || isFinite(r) ? r || 0 : o) : o
            }
        }), pe.each(["height", "width"], function(e, t) {
            pe.cssHooks[t] = {
                get: function(e, n, i) {
                    if (n) return !at.test(pe.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? j(e, t, i) : qe(e, ct, function() {
                        return j(e, t, i)
                    })
                },
                set: function(e, n, i) {
                    var o, r = i && st(e),
                        s = i && P(e, t, i, "border-box" === pe.css(e, "boxSizing", !1, r), r);
                    return s && (o = Me.exec(n)) && "px" !== (o[3] || "px") && (e.style[t] = n, n = pe.css(e, t)), F(0, n, s)
                }
            }
        }), pe.cssHooks.marginLeft = L(fe.reliableMarginLeft, function(e, t) {
            if (t) return (parseFloat(N(e, "marginLeft")) || e.getBoundingClientRect().left - qe(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
        }), pe.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            pe.cssHooks[e + t] = {
                expand: function(n) {
                    for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) o[e + Re[i] + t] = r[i] || r[i - 2] || r[0];
                    return o
                }
            }, ot.test(e) || (pe.cssHooks[e + t].set = F)
        }), pe.fn.extend({
            css: function(e, t) {
                return Ne(this, function(e, t, n) {
                    var i, o, r = {},
                        s = 0;
                    if (Array.isArray(t)) {
                        for (i = st(e), o = t.length; s < o; s++) r[t[s]] = pe.css(e, t[s], !1, i);
                        return r
                    }
                    return void 0 !== n ? pe.style(e, t, n) : pe.css(e, t)
                }, e, t, arguments.length > 1)
            }
        }), pe.Tween = M, M.prototype = {
            constructor: M,
            init: function(e, t, n, i, o, r) {
                this.elem = e, this.prop = n, this.easing = o || pe.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = r || (pe.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = M.propHooks[this.prop];
                return e && e.get ? e.get(this) : M.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = M.propHooks[this.prop];
                return this.options.duration ? this.pos = t = pe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : M.propHooks._default.set(this), this
            }
        }, M.prototype.init.prototype = M.prototype, M.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = pe.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
                },
                set: function(e) {
                    pe.fx.step[e.prop] ? pe.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[pe.cssProps[e.prop]] && !pe.cssHooks[e.prop] ? e.elem[e.prop] = e.now : pe.style(e.elem, e.prop, e.now + e.unit)
                }
            }
        }, M.propHooks.scrollTop = M.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, pe.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            },
            _default: "swing"
        }, pe.fx = M.prototype.init, pe.fx.step = {};
        var ht, pt, gt = /^(?:toggle|show|hide)$/,
            mt = /queueHooks$/;
        pe.Animation = pe.extend(U, {
                tweeners: {
                    "*": [function(e, t) {
                        var n = this.createTween(e, t);
                        return g(n.elem, e, Me.exec(t), n), n
                    }]
                },
                tweener: function(e, t) {
                    pe.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(De);
                    for (var n, i = 0, o = e.length; i < o; i++) n = e[i], U.tweeners[n] = U.tweeners[n] || [], U.tweeners[n].unshift(t)
                },
                prefilters: [function(e, t, n) {
                    var i, o, r, s, a, l, c, u, d = "width" in t || "height" in t,
                        f = this,
                        h = {},
                        p = e.style,
                        g = e.nodeType && We(e),
                        m = $e.get(e, "fxshow");
                    n.queue || (null == (s = pe._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function() {
                        s.unqueued || a()
                    }), s.unqueued++, f.always(function() {
                        f.always(function() {
                            s.unqueued--, pe.queue(e, "fx").length || s.empty.fire()
                        })
                    }));
                    for (i in t)
                        if (o = t[i], gt.test(o)) {
                            if (delete t[i], r = r || "toggle" === o, o === (g ? "hide" : "show")) {
                                if ("show" !== o || !m || void 0 === m[i]) continue;
                                g = !0
                            }
                            h[i] = m && m[i] || pe.style(e, i)
                        }
                    if ((l = !pe.isEmptyObject(t)) || !pe.isEmptyObject(h)) {
                        d && 1 === e.nodeType && (n.overflow = [p.overflow, p.overflowX, p.overflowY], null == (c = m && m.display) && (c = $e.get(e, "display")), "none" === (u = pe.css(e, "display")) && (c ? u = c : (v([e], !0), c = e.style.display || c, u = pe.css(e, "display"), v([e]))), ("inline" === u || "inline-block" === u && null != c) && "none" === pe.css(e, "float") && (l || (f.done(function() {
                            p.display = c
                        }), null == c && (u = p.display, c = "none" === u ? "" : u)), p.display = "inline-block")), n.overflow && (p.overflow = "hidden", f.always(function() {
                            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
                        })), l = !1;
                        for (i in h) l || (m ? "hidden" in m && (g = m.hidden) : m = $e.access(e, "fxshow", {
                            display: c
                        }), r && (m.hidden = !g), g && v([e], !0), f.done(function() {
                            g || v([e]), $e.remove(e, "fxshow");
                            for (i in h) pe.style(e, i, h[i])
                        })), l = z(g ? m[i] : 0, i, f), i in m || (m[i] = l.start, g && (l.end = l.start, l.start = 0))
                    }
                }],
                prefilter: function(e, t) {
                    t ? U.prefilters.unshift(e) : U.prefilters.push(e)
                }
            }), pe.speed = function(e, t, n) {
                var i = e && "object" == typeof e ? pe.extend({}, e) : {
                    complete: n || !n && t || pe.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !pe.isFunction(t) && t
                };
                return pe.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in pe.fx.speeds ? i.duration = pe.fx.speeds[i.duration] : i.duration = pe.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                    pe.isFunction(i.old) && i.old.call(this), i.queue && pe.dequeue(this, i.queue)
                }, i
            }, pe.fn.extend({
                fadeTo: function(e, t, n, i) {
                    return this.filter(We).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, i)
                },
                animate: function(e, t, n, i) {
                    var o = pe.isEmptyObject(e),
                        r = pe.speed(t, n, i),
                        s = function() {
                            var t = U(this, pe.extend({}, e), r);
                            (o || $e.get(this, "finish")) && t.stop(!0)
                        };
                    return s.finish = s, o || !1 === r.queue ? this.each(s) : this.queue(r.queue, s)
                },
                stop: function(e, t, n) {
                    var i = function(e) {
                        var t = e.stop;
                        delete e.stop, t(n)
                    };
                    return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
                        var t = !0,
                            o = null != e && e + "queueHooks",
                            r = pe.timers,
                            s = $e.get(this);
                        if (o) s[o] && s[o].stop && i(s[o]);
                        else
                            for (o in s) s[o] && s[o].stop && mt.test(o) && i(s[o]);
                        for (o = r.length; o--;) r[o].elem !== this || null != e && r[o].queue !== e || (r[o].anim.stop(n), t = !1, r.splice(o, 1));
                        !t && n || pe.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return !1 !== e && (e = e || "fx"), this.each(function() {
                        var t, n = $e.get(this),
                            i = n[e + "queue"],
                            o = n[e + "queueHooks"],
                            r = pe.timers,
                            s = i ? i.length : 0;
                        for (n.finish = !0, pe.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
                        for (t = 0; t < s; t++) i[t] && i[t].finish && i[t].finish.call(this);
                        delete n.finish
                    })
                }
            }), pe.each(["toggle", "show", "hide"], function(e, t) {
                var n = pe.fn[t];
                pe.fn[t] = function(e, i, o) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(q(t, !0), e, i, o)
                }
            }), pe.each({
                slideDown: q("show"),
                slideUp: q("hide"),
                slideToggle: q("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                pe.fn[e] = function(e, n, i) {
                    return this.animate(t, e, n, i)
                }
            }), pe.timers = [], pe.fx.tick = function() {
                var e, t = 0,
                    n = pe.timers;
                for (ht = pe.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
                n.length || pe.fx.stop(), ht = void 0
            }, pe.fx.timer = function(e) {
                pe.timers.push(e), pe.fx.start()
            }, pe.fx.interval = 13, pe.fx.start = function() {
                pt || (pt = !0, R())
            }, pe.fx.stop = function() {
                pt = null
            }, pe.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, pe.fn.delay = function(t, n) {
                return t = pe.fx ? pe.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function(n, i) {
                    var o = e.setTimeout(n, t);
                    i.stop = function() {
                        e.clearTimeout(o)
                    }
                })
            },
            function() {
                var e = te.createElement("input"),
                    t = te.createElement("select").appendChild(te.createElement("option"));
                e.type = "checkbox", fe.checkOn = "" !== e.value, fe.optSelected = t.selected, (e = te.createElement("input")).value = "t", e.type = "radio", fe.radioValue = "t" === e.value
            }();
        var vt, yt = pe.expr.attrHandle;
        pe.fn.extend({
            attr: function(e, t) {
                return Ne(this, pe.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    pe.removeAttr(this, e)
                })
            }
        }), pe.extend({
            attr: function(e, t, n) {
                var i, o, r = e.nodeType;
                if (3 !== r && 8 !== r && 2 !== r) return void 0 === e.getAttribute ? pe.prop(e, t, n) : (1 === r && pe.isXMLDoc(e) || (o = pe.attrHooks[t.toLowerCase()] || (pe.expr.match.bool.test(t) ? vt : void 0)), void 0 !== n ? null === n ? void pe.removeAttr(e, t) : o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : o && "get" in o && null !== (i = o.get(e, t)) ? i : null == (i = pe.find.attr(e, t)) ? void 0 : i)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!fe.radioValue && "radio" === t && o(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t
                        }
                    }
                }
            },
            removeAttr: function(e, t) {
                var n, i = 0,
                    o = t && t.match(De);
                if (o && 1 === e.nodeType)
                    for (; n = o[i++];) e.removeAttribute(n)
            }
        }), vt = {
            set: function(e, t, n) {
                return !1 === t ? pe.removeAttr(e, n) : e.setAttribute(n, n), n
            }
        }, pe.each(pe.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = yt[t] || pe.find.attr;
            yt[t] = function(e, t, i) {
                var o, r, s = t.toLowerCase();
                return i || (r = yt[s], yt[s] = o, o = null != n(e, t, i) ? s : null, yt[s] = r), o
            }
        });
        var bt = /^(?:input|select|textarea|button)$/i,
            wt = /^(?:a|area)$/i;
        pe.fn.extend({
            prop: function(e, t) {
                return Ne(this, pe.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return this.each(function() {
                    delete this[pe.propFix[e] || e]
                })
            }
        }), pe.extend({
            prop: function(e, t, n) {
                var i, o, r = e.nodeType;
                if (3 !== r && 8 !== r && 2 !== r) return 1 === r && pe.isXMLDoc(e) || (t = pe.propFix[t] || t, o = pe.propHooks[t]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(e, n, t)) ? i : e[t] = n : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        var t = pe.find.attr(e, "tabindex");
                        return t ? parseInt(t, 10) : bt.test(e.nodeName) || wt.test(e.nodeName) && e.href ? 0 : -1
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), fe.optSelected || (pe.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex, null
            },
            set: function(e) {
                var t = e.parentNode;
                t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
            }
        }), pe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            pe.propFix[this.toLowerCase()] = this
        }), pe.fn.extend({
            addClass: function(e) {
                var t, n, i, o, r, s, a, l = 0;
                if (pe.isFunction(e)) return this.each(function(t) {
                    pe(this).addClass(e.call(this, t, X(this)))
                });
                if ("string" == typeof e && e)
                    for (t = e.match(De) || []; n = this[l++];)
                        if (o = X(n), i = 1 === n.nodeType && " " + V(o) + " ") {
                            for (s = 0; r = t[s++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                            o !== (a = V(i)) && n.setAttribute("class", a)
                        }
                return this
            },
            removeClass: function(e) {
                var t, n, i, o, r, s, a, l = 0;
                if (pe.isFunction(e)) return this.each(function(t) {
                    pe(this).removeClass(e.call(this, t, X(this)))
                });
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof e && e)
                    for (t = e.match(De) || []; n = this[l++];)
                        if (o = X(n), i = 1 === n.nodeType && " " + V(o) + " ") {
                            for (s = 0; r = t[s++];)
                                for (; i.indexOf(" " + r + " ") > -1;) i = i.replace(" " + r + " ", " ");
                            o !== (a = V(i)) && n.setAttribute("class", a)
                        }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : pe.isFunction(e) ? this.each(function(n) {
                    pe(this).toggleClass(e.call(this, n, X(this), t), t)
                }) : this.each(function() {
                    var t, i, o, r;
                    if ("string" === n)
                        for (i = 0, o = pe(this), r = e.match(De) || []; t = r[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                    else void 0 !== e && "boolean" !== n || ((t = X(this)) && $e.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : $e.get(this, "__className__") || ""))
                })
            },
            hasClass: function(e) {
                var t, n, i = 0;
                for (t = " " + e + " "; n = this[i++];)
                    if (1 === n.nodeType && (" " + V(X(n)) + " ").indexOf(t) > -1) return !0;
                return !1
            }
        });
        var Tt = /\r/g;
        pe.fn.extend({
            val: function(e) {
                var t, n, i, o = this[0];
                return arguments.length ? (i = pe.isFunction(e), this.each(function(n) {
                    var o;
                    1 === this.nodeType && (null == (o = i ? e.call(this, n, pe(this).val()) : e) ? o = "" : "number" == typeof o ? o += "" : Array.isArray(o) && (o = pe.map(o, function(e) {
                        return null == e ? "" : e + ""
                    })), (t = pe.valHooks[this.type] || pe.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
                })) : o ? (t = pe.valHooks[o.type] || pe.valHooks[o.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(o, "value")) ? n : "string" == typeof(n = o.value) ? n.replace(Tt, "") : null == n ? "" : n : void 0
            }
        }), pe.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = pe.find.attr(e, "value");
                        return null != t ? t : V(pe.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        var t, n, i, r = e.options,
                            s = e.selectedIndex,
                            a = "select-one" === e.type,
                            l = a ? null : [],
                            c = a ? s + 1 : r.length;
                        for (i = s < 0 ? c : a ? s : 0; i < c; i++)
                            if (((n = r[i]).selected || i === s) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                                if (t = pe(n).val(), a) return t;
                                l.push(t)
                            }
                        return l
                    },
                    set: function(e, t) {
                        for (var n, i, o = e.options, r = pe.makeArray(t), s = o.length; s--;) i = o[s], (i.selected = pe.inArray(pe.valHooks.option.get(i), r) > -1) && (n = !0);
                        return n || (e.selectedIndex = -1), r
                    }
                }
            }
        }), pe.each(["radio", "checkbox"], function() {
            pe.valHooks[this] = {
                set: function(e, t) {
                    if (Array.isArray(t)) return e.checked = pe.inArray(pe(e).val(), t) > -1
                }
            }, fe.checkOn || (pe.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value
            })
        });
        var Ct = /^(?:focusinfocus|focusoutblur)$/;
        pe.extend(pe.event, {
            trigger: function(t, n, i, o) {
                var r, s, a, l, c, u, d, f = [i || te],
                    h = ce.call(t, "type") ? t.type : t,
                    p = ce.call(t, "namespace") ? t.namespace.split(".") : [];
                if (s = a = i = i || te, 3 !== i.nodeType && 8 !== i.nodeType && !Ct.test(h + pe.event.triggered) && (h.indexOf(".") > -1 && (p = h.split("."), h = p.shift(), p.sort()), c = h.indexOf(":") < 0 && "on" + h, t = t[pe.expando] ? t : new pe.Event(h, "object" == typeof t && t), t.isTrigger = o ? 2 : 3, t.namespace = p.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : pe.makeArray(n, [t]), d = pe.event.special[h] || {}, o || !d.trigger || !1 !== d.trigger.apply(i, n))) {
                    if (!o && !d.noBubble && !pe.isWindow(i)) {
                        for (l = d.delegateType || h, Ct.test(l + h) || (s = s.parentNode); s; s = s.parentNode) f.push(s), a = s;
                        a === (i.ownerDocument || te) && f.push(a.defaultView || a.parentWindow || e)
                    }
                    for (r = 0;
                        (s = f[r++]) && !t.isPropagationStopped();) t.type = r > 1 ? l : d.bindType || h, (u = ($e.get(s, "events") || {})[t.type] && $e.get(s, "handle")) && u.apply(s, n), (u = c && s[c]) && u.apply && Le(s) && (t.result = u.apply(s, n), !1 === t.result && t.preventDefault());
                    return t.type = h, o || t.isDefaultPrevented() || d._default && !1 !== d._default.apply(f.pop(), n) || !Le(i) || c && pe.isFunction(i[h]) && !pe.isWindow(i) && ((a = i[c]) && (i[c] = null), pe.event.triggered = h, i[h](), pe.event.triggered = void 0, a && (i[c] = a)), t.result
                }
            },
            simulate: function(e, t, n) {
                var i = pe.extend(new pe.Event, n, {
                    type: e,
                    isSimulated: !0
                });
                pe.event.trigger(i, null, t)
            }
        }), pe.fn.extend({
            trigger: function(e, t) {
                return this.each(function() {
                    pe.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                if (n) return pe.event.trigger(e, t, n, !0)
            }
        }), pe.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
            pe.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }), pe.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            }
        }), fe.focusin = "onfocusin" in e, fe.focusin || pe.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                pe.event.simulate(t, e.target, pe.event.fix(e))
            };
            pe.event.special[t] = {
                setup: function() {
                    var i = this.ownerDocument || this,
                        o = $e.access(i, t);
                    o || i.addEventListener(e, n, !0), $e.access(i, t, (o || 0) + 1)
                },
                teardown: function() {
                    var i = this.ownerDocument || this,
                        o = $e.access(i, t) - 1;
                    o ? $e.access(i, t, o) : (i.removeEventListener(e, n, !0), $e.remove(i, t))
                }
            }
        });
        var _t = e.location,
            Et = pe.now(),
            St = /\?/;
        pe.parseXML = function(t) {
            var n;
            if (!t || "string" != typeof t) return null;
            try {
                n = (new e.DOMParser).parseFromString(t, "text/xml")
            } catch (e) {
                n = void 0
            }
            return n && !n.getElementsByTagName("parsererror").length || pe.error("Invalid XML: " + t), n
        };
        var kt = /\[\]$/,
            xt = /\r?\n/g,
            At = /^(?:submit|button|image|reset|file)$/i,
            Dt = /^(?:input|select|textarea|keygen)/i;
        pe.param = function(e, t) {
            var n, i = [],
                o = function(e, t) {
                    var n = pe.isFunction(t) ? t() : t;
                    i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
                };
            if (Array.isArray(e) || e.jquery && !pe.isPlainObject(e)) pe.each(e, function() {
                o(this.name, this.value)
            });
            else
                for (n in e) Y(n, e[n], t, o);
            return i.join("&")
        }, pe.fn.extend({
            serialize: function() {
                return pe.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = pe.prop(this, "elements");
                    return e ? pe.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !pe(this).is(":disabled") && Dt.test(this.nodeName) && !At.test(e) && (this.checked || !Be.test(e))
                }).map(function(e, t) {
                    var n = pe(this).val();
                    return null == n ? null : Array.isArray(n) ? pe.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(xt, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(xt, "\r\n")
                    }
                }).get()
            }
        });
        var Ot = /%20/g,
            It = /#.*$/,
            Nt = /([?&])_=[^&]*/,
            Lt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            $t = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Ht = /^(?:GET|HEAD)$/,
            Ft = /^\/\//,
            Pt = {},
            jt = {},
            Mt = "*/".concat("*"),
            Rt = te.createElement("a");
        Rt.href = _t.href, pe.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: _t.href,
                type: "GET",
                isLocal: $t.test(_t.protocol),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Mt,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": JSON.parse,
                    "text xml": pe.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? Q(Q(e, pe.ajaxSettings), t) : Q(pe.ajaxSettings, e)
            },
            ajaxPrefilter: G(Pt),
            ajaxTransport: G(jt),
            ajax: function(t, n) {
                function i(t, n, i, a) {
                    var c, f, h, w, T, C = n;
                    u || (u = !0, l && e.clearTimeout(l), o = void 0, s = a || "", _.readyState = t > 0 ? 4 : 0, c = t >= 200 && t < 300 || 304 === t, i && (w = Z(p, _, i)), w = J(p, w, _, c), c ? (p.ifModified && ((T = _.getResponseHeader("Last-Modified")) && (pe.lastModified[r] = T), (T = _.getResponseHeader("etag")) && (pe.etag[r] = T)), 204 === t || "HEAD" === p.type ? C = "nocontent" : 304 === t ? C = "notmodified" : (C = w.state, f = w.data, h = w.error, c = !h)) : (h = C, !t && C || (C = "error", t < 0 && (t = 0))), _.status = t, _.statusText = (n || C) + "", c ? v.resolveWith(g, [f, C, _]) : v.rejectWith(g, [_, C, h]), _.statusCode(b), b = void 0, d && m.trigger(c ? "ajaxSuccess" : "ajaxError", [_, p, c ? f : h]), y.fireWith(g, [_, C]), d && (m.trigger("ajaxComplete", [_, p]), --pe.active || pe.event.trigger("ajaxStop")))
                }
                "object" == typeof t && (n = t, t = void 0), n = n || {};
                var o, r, s, a, l, c, u, d, f, h, p = pe.ajaxSetup({}, n),
                    g = p.context || p,
                    m = p.context && (g.nodeType || g.jquery) ? pe(g) : pe.event,
                    v = pe.Deferred(),
                    y = pe.Callbacks("once memory"),
                    b = p.statusCode || {},
                    w = {},
                    T = {},
                    C = "canceled",
                    _ = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (u) {
                                if (!a)
                                    for (a = {}; t = Lt.exec(s);) a[t[1].toLowerCase()] = t[2];
                                t = a[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return u ? s : null
                        },
                        setRequestHeader: function(e, t) {
                            return null == u && (e = T[e.toLowerCase()] = T[e.toLowerCase()] || e, w[e] = t), this
                        },
                        overrideMimeType: function(e) {
                            return null == u && (p.mimeType = e), this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (u) _.always(e[_.status]);
                                else
                                    for (t in e) b[t] = [b[t], e[t]];
                            return this
                        },
                        abort: function(e) {
                            var t = e || C;
                            return o && o.abort(t), i(0, t), this
                        }
                    };
                if (v.promise(_), p.url = ((t || p.url || _t.href) + "").replace(Ft, _t.protocol + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(De) || [""], null == p.crossDomain) {
                    c = te.createElement("a");
                    try {
                        c.href = p.url, c.href = c.href, p.crossDomain = Rt.protocol + "//" + Rt.host != c.protocol + "//" + c.host
                    } catch (e) {
                        p.crossDomain = !0
                    }
                }
                if (p.data && p.processData && "string" != typeof p.data && (p.data = pe.param(p.data, p.traditional)), K(Pt, p, n, _), u) return _;
                (d = pe.event && p.global) && 0 == pe.active++ && pe.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Ht.test(p.type), r = p.url.replace(It, ""), p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Ot, "+")) : (h = p.url.slice(r.length), p.data && (r += (St.test(r) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (r = r.replace(Nt, "$1"), h = (St.test(r) ? "&" : "?") + "_=" + Et++ + h), p.url = r + h), p.ifModified && (pe.lastModified[r] && _.setRequestHeader("If-Modified-Since", pe.lastModified[r]), pe.etag[r] && _.setRequestHeader("If-None-Match", pe.etag[r])), (p.data && p.hasContent && !1 !== p.contentType || n.contentType) && _.setRequestHeader("Content-Type", p.contentType), _.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Mt + "; q=0.01" : "") : p.accepts["*"]);
                for (f in p.headers) _.setRequestHeader(f, p.headers[f]);
                if (p.beforeSend && (!1 === p.beforeSend.call(g, _, p) || u)) return _.abort();
                if (C = "abort", y.add(p.complete), _.done(p.success), _.fail(p.error), o = K(jt, p, n, _)) {
                    if (_.readyState = 1, d && m.trigger("ajaxSend", [_, p]), u) return _;
                    p.async && p.timeout > 0 && (l = e.setTimeout(function() {
                        _.abort("timeout")
                    }, p.timeout));
                    try {
                        u = !1, o.send(w, i)
                    } catch (e) {
                        if (u) throw e;
                        i(-1, e)
                    }
                } else i(-1, "No Transport");
                return _
            },
            getJSON: function(e, t, n) {
                return pe.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return pe.get(e, void 0, t, "script")
            }
        }), pe.each(["get", "post"], function(e, t) {
            pe[t] = function(e, n, i, o) {
                return pe.isFunction(n) && (o = o || i, i = n, n = void 0), pe.ajax(pe.extend({
                    url: e,
                    type: t,
                    dataType: o,
                    data: n,
                    success: i
                }, pe.isPlainObject(e) && e))
            }
        }), pe._evalUrl = function(e) {
            return pe.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        }, pe.fn.extend({
            wrapAll: function(e) {
                var t;
                return this[0] && (pe.isFunction(e) && (e = e.call(this[0])), t = pe(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                    return e
                }).append(this)), this
            },
            wrapInner: function(e) {
                return pe.isFunction(e) ? this.each(function(t) {
                    pe(this).wrapInner(e.call(this, t))
                }) : this.each(function() {
                    var t = pe(this),
                        n = t.contents();
                    n.length ? n.wrapAll(e) : t.append(e)
                })
            },
            wrap: function(e) {
                var t = pe.isFunction(e);
                return this.each(function(n) {
                    pe(this).wrapAll(t ? e.call(this, n) : e)
                })
            },
            unwrap: function(e) {
                return this.parent(e).not("body").each(function() {
                    pe(this).replaceWith(this.childNodes)
                }), this
            }
        }), pe.expr.pseudos.hidden = function(e) {
            return !pe.expr.pseudos.visible(e)
        }, pe.expr.pseudos.visible = function(e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
        }, pe.ajaxSettings.xhr = function() {
            try {
                return new e.XMLHttpRequest
            } catch (e) {}
        };
        var Wt = {
                0: 200,
                1223: 204
            },
            qt = pe.ajaxSettings.xhr();
        fe.cors = !!qt && "withCredentials" in qt, fe.ajax = qt = !!qt, pe.ajaxTransport(function(t) {
            var n, i;
            if (fe.cors || qt && !t.crossDomain) return {
                send: function(o, r) {
                    var s, a = t.xhr();
                    if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                        for (s in t.xhrFields) a[s] = t.xhrFields[s];
                    t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
                    for (s in o) a.setRequestHeader(s, o[s]);
                    n = function(e) {
                        return function() {
                            n && (n = i = a.onload = a.onerror = a.onabort = a.onreadystatechange = null, "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? r(0, "error") : r(a.status, a.statusText) : r(Wt[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                                binary: a.response
                            } : {
                                text: a.responseText
                            }, a.getAllResponseHeaders()))
                        }
                    }, a.onload = n(), i = a.onerror = n("error"), void 0 !== a.onabort ? a.onabort = i : a.onreadystatechange = function() {
                        4 === a.readyState && e.setTimeout(function() {
                            n && i()
                        })
                    }, n = n("abort");
                    try {
                        a.send(t.hasContent && t.data || null)
                    } catch (e) {
                        if (n) throw e
                    }
                },
                abort: function() {
                    n && n()
                }
            }
        }), pe.ajaxPrefilter(function(e) {
            e.crossDomain && (e.contents.script = !1)
        }), pe.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(e) {
                    return pe.globalEval(e), e
                }
            }
        }), pe.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
        }), pe.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var t, n;
                return {
                    send: function(i, o) {
                        t = pe("<script>").prop({
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                            t.remove(), n = null, e && o("error" === e.type ? 404 : 200, e.type)
                        }), te.head.appendChild(t[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        });
        var zt = [],
            Bt = /(=)\?(?=&|$)|\?\?/;
        pe.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var e = zt.pop() || pe.expando + "_" + Et++;
                return this[e] = !0, e
            }
        }), pe.ajaxPrefilter("json jsonp", function(t, n, i) {
            var o, r, s, a = !1 !== t.jsonp && (Bt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Bt.test(t.data) && "data");
            if (a || "jsonp" === t.dataTypes[0]) return o = t.jsonpCallback = pe.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Bt, "$1" + o) : !1 !== t.jsonp && (t.url += (St.test(t.url) ? "&" : "?") + t.jsonp + "=" + o), t.converters["script json"] = function() {
                return s || pe.error(o + " was not called"), s[0]
            }, t.dataTypes[0] = "json", r = e[o], e[o] = function() {
                s = arguments
            }, i.always(function() {
                void 0 === r ? pe(e).removeProp(o) : e[o] = r, t[o] && (t.jsonpCallback = n.jsonpCallback, zt.push(o)), s && pe.isFunction(r) && r(s[0]), s = r = void 0
            }), "script"
        }), fe.createHTMLDocument = function() {
            var e = te.implementation.createHTMLDocument("").body;
            return e.innerHTML = "<form></form><form></form>", 2 === e.childNodes.length
        }(), pe.parseHTML = function(e, t, n) {
            if ("string" != typeof e) return [];
            "boolean" == typeof t && (n = t, t = !1);
            var i, o, r;
            return t || (fe.createHTMLDocument ? (t = te.implementation.createHTMLDocument(""), i = t.createElement("base"), i.href = te.location.href, t.head.appendChild(i)) : t = te), o = _e.exec(e), r = !n && [], o ? [t.createElement(o[1])] : (o = w([e], t, r), r && r.length && pe(r).remove(), pe.merge([], o.childNodes))
        }, pe.fn.load = function(e, t, n) {
            var i, o, r, s = this,
                a = e.indexOf(" ");
            return a > -1 && (i = V(e.slice(a)), e = e.slice(0, a)), pe.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (o = "POST"), s.length > 0 && pe.ajax({
                url: e,
                type: o || "GET",
                dataType: "html",
                data: t
            }).done(function(e) {
                r = arguments, s.html(i ? pe("<div>").append(pe.parseHTML(e)).find(i) : e)
            }).always(n && function(e, t) {
                s.each(function() {
                    n.apply(this, r || [e.responseText, t, e])
                })
            }), this
        }, pe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            pe.fn[t] = function(e) {
                return this.on(t, e)
            }
        }), pe.expr.pseudos.animated = function(e) {
            return pe.grep(pe.timers, function(t) {
                return e === t.elem
            }).length
        }, pe.offset = {
            setOffset: function(e, t, n) {
                var i, o, r, s, a, l, c = pe.css(e, "position"),
                    u = pe(e),
                    d = {};
                "static" === c && (e.style.position = "relative"), a = u.offset(), r = pe.css(e, "top"), l = pe.css(e, "left"), ("absolute" === c || "fixed" === c) && (r + l).indexOf("auto") > -1 ? (i = u.position(), s = i.top, o = i.left) : (s = parseFloat(r) || 0, o = parseFloat(l) || 0), pe.isFunction(t) && (t = t.call(e, n, pe.extend({}, a))), null != t.top && (d.top = t.top - a.top + s), null != t.left && (d.left = t.left - a.left + o), "using" in t ? t.using.call(e, d) : u.css(d)
            }
        }, pe.fn.extend({
            offset: function(e) {
                if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                    pe.offset.setOffset(this, e, t)
                });
                var t, n, i, o, r = this[0];
                return r ? r.getClientRects().length ? (i = r.getBoundingClientRect(), t = r.ownerDocument, n = t.documentElement, o = t.defaultView, {
                    top: i.top + o.pageYOffset - n.clientTop,
                    left: i.left + o.pageXOffset - n.clientLeft
                }) : {
                    top: 0,
                    left: 0
                } : void 0
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = this[0],
                        i = {
                            top: 0,
                            left: 0
                        };
                    return "fixed" === pe.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), o(e[0], "html") || (i = e.offset()), i = {
                        top: i.top + pe.css(e[0], "borderTopWidth", !0),
                        left: i.left + pe.css(e[0], "borderLeftWidth", !0)
                    }), {
                        top: t.top - i.top - pe.css(n, "marginTop", !0),
                        left: t.left - i.left - pe.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent; e && "static" === pe.css(e, "position");) e = e.offsetParent;
                    return e || Ge
                })
            }
        }), pe.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(e, t) {
            var n = "pageYOffset" === t;
            pe.fn[e] = function(i) {
                return Ne(this, function(e, i, o) {
                    var r;
                    return pe.isWindow(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === o ? r ? r[t] : e[i] : void(r ? r.scrollTo(n ? r.pageXOffset : o, n ? o : r.pageYOffset) : e[i] = o)
                }, e, i, arguments.length)
            }
        }), pe.each(["top", "left"], function(e, t) {
            pe.cssHooks[t] = L(fe.pixelPosition, function(e, n) {
                if (n) return n = N(e, t), rt.test(n) ? pe(e).position()[t] + "px" : n
            })
        }), pe.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            pe.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, i) {
                pe.fn[i] = function(o, r) {
                    var s = arguments.length && (n || "boolean" != typeof o),
                        a = n || (!0 === o || !0 === r ? "margin" : "border");
                    return Ne(this, function(t, n, o) {
                        var r;
                        return pe.isWindow(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (r = t.documentElement, Math.max(t.body["scroll" + e], r["scroll" + e], t.body["offset" + e], r["offset" + e], r["client" + e])) : void 0 === o ? pe.css(t, n, a) : pe.style(t, n, o, a)
                    }, t, s ? o : void 0, s)
                }
            })
        }), pe.fn.extend({
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, i) {
                return this.on(t, e, n, i)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        }), pe.holdReady = function(e) {
            e ? pe.readyWait++ : pe.ready(!0)
        }, pe.isArray = Array.isArray, pe.parseJSON = JSON.parse, pe.nodeName = o, "function" == typeof define && define.amd && define("jquery", [], function() {
            return pe
        });
        var Ut = e.jQuery,
            Vt = e.$;
        return pe.noConflict = function(t) {
            return e.$ === pe && (e.$ = Vt), t && e.jQuery === pe && (e.jQuery = Ut), pe
        }, t || (e.jQuery = e.$ = pe), pe
    }), function(e, t) {
        "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t(require, exports, module) : e.Tether = t()
    }(this, function(e, t, n) {
        "use strict";

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function o(e) {
            var t = e.getBoundingClientRect(),
                n = {};
            for (var i in t) n[i] = t[i];
            if (e.ownerDocument !== document) {
                var r = e.ownerDocument.defaultView.frameElement;
                if (r) {
                    var s = o(r);
                    n.top += s.top, n.bottom += s.top, n.left += s.left, n.right += s.left
                }
            }
            return n
        }

        function r(e) {
            var t = (getComputedStyle(e) || {}).position,
                n = [];
            if ("fixed" === t) return [e];
            for (var i = e;
                (i = i.parentNode) && i && 1 === i.nodeType;) {
                var o = void 0;
                try {
                    o = getComputedStyle(i)
                } catch (e) {}
                if (void 0 === o || null === o) return n.push(i), n;
                var r = o,
                    s = r.overflow,
                    a = r.overflowX,
                    l = r.overflowY;
                /(auto|scroll)/.test(s + l + a) && ("absolute" !== t || ["relative", "absolute", "fixed"].indexOf(o.position) >= 0) && n.push(i)
            }
            return n.push(e.ownerDocument.body), e.ownerDocument !== document && n.push(e.ownerDocument.defaultView), n
        }

        function s() {
            S && document.body.removeChild(S), S = null
        }

        function a(e) {
            var t = void 0;
            e === document ? (t = document, e = document.documentElement) : t = e.ownerDocument;
            var n = t.documentElement,
                i = o(e),
                r = A();
            return i.top -= r.top, i.left -= r.left, void 0 === i.width && (i.width = document.body.scrollWidth - i.left - i.right), void 0 === i.height && (i.height = document.body.scrollHeight - i.top - i.bottom), i.top = i.top - n.clientTop, i.left = i.left - n.clientLeft, i.right = t.body.clientWidth - i.width - i.left, i.bottom = t.body.clientHeight - i.height - i.top, i
        }

        function l(e) {
            return e.offsetParent || document.documentElement
        }

        function c() {
            if (D) return D;
            var e = document.createElement("div");
            e.style.width = "100%", e.style.height = "200px";
            var t = document.createElement("div");
            u(t.style, {
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                visibility: "hidden",
                width: "200px",
                height: "150px",
                overflow: "hidden"
            }), t.appendChild(e), document.body.appendChild(t);
            var n = e.offsetWidth;
            t.style.overflow = "scroll";
            var i = e.offsetWidth;
            n === i && (i = t.clientWidth), document.body.removeChild(t);
            var o = n - i;
            return D = {
                width: o,
                height: o
            }
        }

        function u() {
            var e = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
                t = [];
            return Array.prototype.push.apply(t, arguments), t.slice(1).forEach(function(t) {
                if (t)
                    for (var n in t)({}).hasOwnProperty.call(t, n) && (e[n] = t[n])
            }), e
        }

        function d(e, t) {
            if (void 0 !== e.classList) t.split(" ").forEach(function(t) {
                t.trim() && e.classList.remove(t)
            });
            else {
                var n = new RegExp("(^| )" + t.split(" ").join("|") + "( |$)", "gi"),
                    i = p(e).replace(n, " ");
                g(e, i)
            }
        }

        function f(e, t) {
            if (void 0 !== e.classList) t.split(" ").forEach(function(t) {
                t.trim() && e.classList.add(t)
            });
            else {
                d(e, t);
                var n = p(e) + " " + t;
                g(e, n)
            }
        }

        function h(e, t) {
            if (void 0 !== e.classList) return e.classList.contains(t);
            var n = p(e);
            return new RegExp("(^| )" + t + "( |$)", "gi").test(n)
        }

        function p(e) {
            return e.className instanceof e.ownerDocument.defaultView.SVGAnimatedString ? e.className.baseVal : e.className
        }

        function g(e, t) {
            e.setAttribute("class", t)
        }

        function m(e, t, n) {
            n.forEach(function(n) {
                -1 === t.indexOf(n) && h(e, n) && d(e, n)
            }), t.forEach(function(t) {
                h(e, t) || f(e, t)
            })
        }

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function v(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function y(e, t) {
            var n = arguments.length <= 2 || void 0 === arguments[2] ? 1 : arguments[2];
            return e + n >= t && t >= e - n
        }

        function b() {
            return "undefined" != typeof performance && void 0 !== performance.now ? performance.now() : +new Date
        }

        function w() {
            for (var e = {
                    top: 0,
                    left: 0
                }, t = arguments.length, n = Array(t), i = 0; i < t; i++) n[i] = arguments[i];
            return n.forEach(function(t) {
                var n = t.top,
                    i = t.left;
                "string" == typeof n && (n = parseFloat(n, 10)), "string" == typeof i && (i = parseFloat(i, 10)), e.top += n, e.left += i
            }), e
        }

        function T(e, t) {
            return "string" == typeof e.left && -1 !== e.left.indexOf("%") && (e.left = parseFloat(e.left, 10) / 100 * t.width), "string" == typeof e.top && -1 !== e.top.indexOf("%") && (e.top = parseFloat(e.top, 10) / 100 * t.height), e
        }

        function C(e, t) {
            return "scrollParent" === t ? t = e.scrollParents[0] : "window" === t && (t = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset]), t === document && (t = t.documentElement), void 0 !== t.nodeType && function() {
                var e = t,
                    n = a(t),
                    i = n,
                    o = getComputedStyle(t);
                if (t = [i.left, i.top, n.width + i.left, n.height + i.top], e.ownerDocument !== document) {
                    var r = e.ownerDocument.defaultView;
                    t[0] += r.pageXOffset, t[1] += r.pageYOffset, t[2] += r.pageXOffset, t[3] += r.pageYOffset
                }
                G.forEach(function(e, n) {
                    "Top" === (e = e[0].toUpperCase() + e.substr(1)) || "Left" === e ? t[n] += parseFloat(o["border" + e + "Width"]) : t[n] -= parseFloat(o["border" + e + "Width"])
                })
            }(), t
        }
        var _ = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            E = void 0;
        void 0 === E && (E = {
            modules: []
        });
        var S = null,
            k = function() {
                var e = 0;
                return function() {
                    return ++e
                }
            }(),
            x = {},
            A = function() {
                var e = S;
                e && document.body.contains(e) || ((e = document.createElement("div")).setAttribute("data-tether-id", k()), u(e.style, {
                    top: 0,
                    left: 0,
                    position: "absolute"
                }), document.body.appendChild(e), S = e);
                var t = e.getAttribute("data-tether-id");
                return void 0 === x[t] && (x[t] = o(e), I(function() {
                    delete x[t]
                })), x[t]
            },
            D = null,
            O = [],
            I = function(e) {
                O.push(e)
            },
            N = function() {
                for (var e = void 0; e = O.pop();) e()
            },
            L = function() {
                function e() {
                    i(this, e)
                }
                return _(e, [{
                    key: "on",
                    value: function(e, t, n) {
                        var i = !(arguments.length <= 3 || void 0 === arguments[3]) && arguments[3];
                        void 0 === this.bindings && (this.bindings = {}), void 0 === this.bindings[e] && (this.bindings[e] = []), this.bindings[e].push({
                            handler: t,
                            ctx: n,
                            once: i
                        })
                    }
                }, {
                    key: "once",
                    value: function(e, t, n) {
                        this.on(e, t, n, !0)
                    }
                }, {
                    key: "off",
                    value: function(e, t) {
                        if (void 0 !== this.bindings && void 0 !== this.bindings[e])
                            if (void 0 === t) delete this.bindings[e];
                            else
                                for (var n = 0; n < this.bindings[e].length;) this.bindings[e][n].handler === t ? this.bindings[e].splice(n, 1) : ++n
                    }
                }, {
                    key: "trigger",
                    value: function(e) {
                        if (void 0 !== this.bindings && this.bindings[e]) {
                            for (var t = 0, n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++) i[o - 1] = arguments[o];
                            for (; t < this.bindings[e].length;) {
                                var r = this.bindings[e][t],
                                    s = r.handler,
                                    a = r.ctx,
                                    l = r.once,
                                    c = a;
                                void 0 === c && (c = this), s.apply(c, i), l ? this.bindings[e].splice(t, 1) : ++t
                            }
                        }
                    }
                }]), e
            }();
        E.Utils = {
            getActualBoundingClientRect: o,
            getScrollParents: r,
            getBounds: a,
            getOffsetParent: l,
            extend: u,
            addClass: f,
            removeClass: d,
            hasClass: h,
            updateClasses: m,
            defer: I,
            flush: N,
            uniqueId: k,
            Evented: L,
            getScrollBarSize: c,
            removeUtilElements: s
        };
        var $ = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        o = !1,
                        r = void 0;
                    try {
                        for (var s, a = e[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (e) {
                        o = !0, r = e
                    } finally {
                        try {
                            !i && a.return && a.return()
                        } finally {
                            if (o) throw r
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            _ = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            H = function(e, t, n) {
                for (var i = !0; i;) {
                    var o = e,
                        r = t,
                        s = n;
                    i = !1, null === o && (o = Function.prototype);
                    var a = Object.getOwnPropertyDescriptor(o, r);
                    if (void 0 !== a) {
                        if ("value" in a) return a.value;
                        var l = a.get;
                        if (void 0 === l) return;
                        return l.call(s)
                    }
                    var c = Object.getPrototypeOf(o);
                    if (null === c) return;
                    e = c, t = r, n = s, i = !0, a = c = void 0
                }
            };
        if (void 0 === E) throw new Error("You must include the utils.js file before tether.js");
        var F = E.Utils,
            r = F.getScrollParents,
            a = F.getBounds,
            l = F.getOffsetParent,
            u = F.extend,
            f = F.addClass,
            d = F.removeClass,
            m = F.updateClasses,
            I = F.defer,
            N = F.flush,
            c = F.getScrollBarSize,
            s = F.removeUtilElements,
            P = function() {
                if ("undefined" == typeof document) return "";
                for (var e = document.createElement("div"), t = ["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"], n = 0; n < t.length; ++n) {
                    var i = t[n];
                    if (void 0 !== e.style[i]) return i
                }
            }(),
            j = [],
            M = function() {
                j.forEach(function(e) {
                    e.position(!1)
                }), N()
            };
        ! function() {
            var e = null,
                t = null,
                n = null,
                i = function i() {
                    return void 0 !== t && t > 16 ? (t = Math.min(t - 16, 250), void(n = setTimeout(i, 250))) : void(void 0 !== e && b() - e < 10 || (null != n && (clearTimeout(n), n = null), e = b(), M(), t = b() - e))
                };
            "undefined" != typeof window && void 0 !== window.addEventListener && ["resize", "scroll", "touchmove"].forEach(function(e) {
                window.addEventListener(e, i)
            })
        }();
        var R = {
                center: "center",
                left: "right",
                right: "left"
            },
            W = {
                middle: "middle",
                top: "bottom",
                bottom: "top"
            },
            q = {
                top: 0,
                left: 0,
                middle: "50%",
                center: "50%",
                bottom: "100%",
                right: "100%"
            },
            z = function(e, t) {
                var n = e.left,
                    i = e.top;
                return "auto" === n && (n = R[t.left]), "auto" === i && (i = W[t.top]), {
                    left: n,
                    top: i
                }
            },
            B = function(e) {
                var t = e.left,
                    n = e.top;
                return void 0 !== q[e.left] && (t = q[e.left]), void 0 !== q[e.top] && (n = q[e.top]), {
                    left: t,
                    top: n
                }
            },
            U = function(e) {
                var t = e.split(" "),
                    n = $(t, 2);
                return {
                    top: n[0],
                    left: n[1]
                }
            },
            V = U,
            X = function(e) {
                function t(e) {
                    var n = this;
                    i(this, t), H(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.position = this.position.bind(this), j.push(this), this.history = [], this.setOptions(e, !1), E.modules.forEach(function(e) {
                        void 0 !== e.initialize && e.initialize.call(n)
                    }), this.position()
                }
                return v(t, L), _(t, [{
                    key: "getClass",
                    value: function() {
                        var e = arguments.length <= 0 || void 0 === arguments[0] ? "" : arguments[0],
                            t = this.options.classes;
                        return void 0 !== t && t[e] ? this.options.classes[e] : this.options.classPrefix ? this.options.classPrefix + "-" + e : e
                    }
                }, {
                    key: "setOptions",
                    value: function(e) {
                        var t = this,
                            n = arguments.length <= 1 || void 0 === arguments[1] || arguments[1],
                            i = {
                                offset: "0 0",
                                targetOffset: "0 0",
                                targetAttachment: "auto auto",
                                classPrefix: "tether"
                            };
                        this.options = u(i, e);
                        var o = this.options,
                            s = o.element,
                            a = o.target,
                            l = o.targetModifier;
                        if (this.element = s, this.target = a, this.targetModifier = l, "viewport" === this.target ? (this.target = document.body, this.targetModifier = "visible") : "scroll-handle" === this.target && (this.target = document.body, this.targetModifier = "scroll-handle"), ["element", "target"].forEach(function(e) {
                                if (void 0 === t[e]) throw new Error("Tether Error: Both element and target must be defined");
                                void 0 !== t[e].jquery ? t[e] = t[e][0] : "string" == typeof t[e] && (t[e] = document.querySelector(t[e]))
                            }), f(this.element, this.getClass("element")), !1 !== this.options.addTargetClasses && f(this.target, this.getClass("target")), !this.options.attachment) throw new Error("Tether Error: You must provide an attachment");
                        this.targetAttachment = V(this.options.targetAttachment), this.attachment = V(this.options.attachment), this.offset = U(this.options.offset), this.targetOffset = U(this.options.targetOffset), void 0 !== this.scrollParents && this.disable(), "scroll-handle" === this.targetModifier ? this.scrollParents = [this.target] : this.scrollParents = r(this.target), !1 !== this.options.enabled && this.enable(n)
                    }
                }, {
                    key: "getTargetBounds",
                    value: function() {
                        if (void 0 === this.targetModifier) return a(this.target);
                        if ("visible" === this.targetModifier) return this.target === document.body ? {
                            top: pageYOffset,
                            left: pageXOffset,
                            height: innerHeight,
                            width: innerWidth
                        } : ((r = {
                            height: (e = a(this.target)).height,
                            width: e.width,
                            top: e.top,
                            left: e.left
                        }).height = Math.min(r.height, e.height - (pageYOffset - e.top)), r.height = Math.min(r.height, e.height - (e.top + e.height - (pageYOffset + innerHeight))), r.height = Math.min(innerHeight, r.height), r.height -= 2, r.width = Math.min(r.width, e.width - (pageXOffset - e.left)), r.width = Math.min(r.width, e.width - (e.left + e.width - (pageXOffset + innerWidth))), r.width = Math.min(innerWidth, r.width), r.width -= 2, r.top < pageYOffset && (r.top = pageYOffset), r.left < pageXOffset && (r.left = pageXOffset), r);
                        if ("scroll-handle" === this.targetModifier) {
                            var e = void 0,
                                t = this.target;
                            t === document.body ? (t = document.documentElement, e = {
                                left: pageXOffset,
                                top: pageYOffset,
                                height: innerHeight,
                                width: innerWidth
                            }) : e = a(t);
                            var n = getComputedStyle(t),
                                i = 0;
                            (t.scrollWidth > t.clientWidth || [n.overflow, n.overflowX].indexOf("scroll") >= 0 || this.target !== document.body) && (i = 15);
                            var o = e.height - parseFloat(n.borderTopWidth) - parseFloat(n.borderBottomWidth) - i,
                                r = {
                                    width: 15,
                                    height: .975 * o * (o / t.scrollHeight),
                                    left: e.left + e.width - parseFloat(n.borderLeftWidth) - 15
                                },
                                s = 0;
                            o < 408 && this.target === document.body && (s = -11e-5 * Math.pow(o, 2) - .00727 * o + 22.58), this.target !== document.body && (r.height = Math.max(r.height, 24));
                            var l = this.target.scrollTop / (t.scrollHeight - o);
                            return r.top = l * (o - r.height - s) + e.top + parseFloat(n.borderTopWidth), this.target === document.body && (r.height = Math.max(r.height, 24)), r
                        }
                    }
                }, {
                    key: "clearCache",
                    value: function() {
                        this._cache = {}
                    }
                }, {
                    key: "cache",
                    value: function(e, t) {
                        return void 0 === this._cache && (this._cache = {}), void 0 === this._cache[e] && (this._cache[e] = t.call(this)), this._cache[e]
                    }
                }, {
                    key: "enable",
                    value: function() {
                        var e = this,
                            t = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                        !1 !== this.options.addTargetClasses && f(this.target, this.getClass("enabled")), f(this.element, this.getClass("enabled")), this.enabled = !0, this.scrollParents.forEach(function(t) {
                            t !== e.target.ownerDocument && t.addEventListener("scroll", e.position)
                        }), t && this.position()
                    }
                }, {
                    key: "disable",
                    value: function() {
                        var e = this;
                        d(this.target, this.getClass("enabled")), d(this.element, this.getClass("enabled")), this.enabled = !1, void 0 !== this.scrollParents && this.scrollParents.forEach(function(t) {
                            t.removeEventListener("scroll", e.position)
                        })
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        var e = this;
                        this.disable(), j.forEach(function(t, n) {
                            t === e && j.splice(n, 1)
                        }), 0 === j.length && s()
                    }
                }, {
                    key: "updateAttachClasses",
                    value: function(e, t) {
                        var n = this;
                        e = e || this.attachment, t = t || this.targetAttachment;
                        var i = ["left", "top", "bottom", "right", "middle", "center"];
                        void 0 !== this._addAttachClasses && this._addAttachClasses.length && this._addAttachClasses.splice(0, this._addAttachClasses.length), void 0 === this._addAttachClasses && (this._addAttachClasses = []);
                        var o = this._addAttachClasses;
                        e.top && o.push(this.getClass("element-attached") + "-" + e.top), e.left && o.push(this.getClass("element-attached") + "-" + e.left), t.top && o.push(this.getClass("target-attached") + "-" + t.top), t.left && o.push(this.getClass("target-attached") + "-" + t.left);
                        var r = [];
                        i.forEach(function(e) {
                            r.push(n.getClass("element-attached") + "-" + e), r.push(n.getClass("target-attached") + "-" + e)
                        }), I(function() {
                            void 0 !== n._addAttachClasses && (m(n.element, n._addAttachClasses, r), !1 !== n.options.addTargetClasses && m(n.target, n._addAttachClasses, r), delete n._addAttachClasses)
                        })
                    }
                }, {
                    key: "position",
                    value: function() {
                        var e = this,
                            t = arguments.length <= 0 || void 0 === arguments[0] || arguments[0];
                        if (this.enabled) {
                            this.clearCache();
                            var n = z(this.targetAttachment, this.attachment);
                            this.updateAttachClasses(this.attachment, n);
                            var i = this.cache("element-bounds", function() {
                                    return a(e.element)
                                }),
                                o = i.width,
                                r = i.height;
                            if (0 === o && 0 === r && void 0 !== this.lastSize) {
                                var s = this.lastSize;
                                o = s.width, r = s.height
                            } else this.lastSize = {
                                width: o,
                                height: r
                            };
                            var u = this.cache("target-bounds", function() {
                                    return e.getTargetBounds()
                                }),
                                d = u,
                                f = T(B(this.attachment), {
                                    width: o,
                                    height: r
                                }),
                                h = T(B(n), d),
                                p = T(this.offset, {
                                    width: o,
                                    height: r
                                }),
                                g = T(this.targetOffset, d);
                            f = w(f, p), h = w(h, g);
                            for (var m = u.left + h.left - f.left, v = u.top + h.top - f.top, y = 0; y < E.modules.length; ++y) {
                                var b = E.modules[y].position.call(this, {
                                    left: m,
                                    top: v,
                                    targetAttachment: n,
                                    targetPos: u,
                                    elementPos: i,
                                    offset: f,
                                    targetOffset: h,
                                    manualOffset: p,
                                    manualTargetOffset: g,
                                    scrollbarSize: k,
                                    attachment: this.attachment
                                });
                                if (!1 === b) return !1;
                                void 0 !== b && "object" == typeof b && (v = b.top, m = b.left)
                            }
                            var C = {
                                    page: {
                                        top: v,
                                        left: m
                                    },
                                    viewport: {
                                        top: v - pageYOffset,
                                        bottom: pageYOffset - v - r + innerHeight,
                                        left: m - pageXOffset,
                                        right: pageXOffset - m - o + innerWidth
                                    }
                                },
                                _ = this.target.ownerDocument,
                                S = _.defaultView,
                                k = void 0;
                            return S.innerHeight > _.documentElement.clientHeight && (k = this.cache("scrollbar-size", c), C.viewport.bottom -= k.height), S.innerWidth > _.documentElement.clientWidth && (k = this.cache("scrollbar-size", c), C.viewport.right -= k.width), -1 !== ["", "static"].indexOf(_.body.style.position) && -1 !== ["", "static"].indexOf(_.body.parentElement.style.position) || (C.page.bottom = _.body.scrollHeight - v - r, C.page.right = _.body.scrollWidth - m - o), void 0 !== this.options.optimizations && !1 !== this.options.optimizations.moveElement && void 0 === this.targetModifier && function() {
                                var t = e.cache("target-offsetparent", function() {
                                        return l(e.target)
                                    }),
                                    n = e.cache("target-offsetparent-bounds", function() {
                                        return a(t)
                                    }),
                                    i = getComputedStyle(t),
                                    o = n,
                                    r = {};
                                if (["Top", "Left", "Bottom", "Right"].forEach(function(e) {
                                        r[e.toLowerCase()] = parseFloat(i["border" + e + "Width"])
                                    }), n.right = _.body.scrollWidth - n.left - o.width + r.right, n.bottom = _.body.scrollHeight - n.top - o.height + r.bottom, C.page.top >= n.top + r.top && C.page.bottom >= n.bottom && C.page.left >= n.left + r.left && C.page.right >= n.right) {
                                    var s = t.scrollTop,
                                        c = t.scrollLeft;
                                    C.offset = {
                                        top: C.page.top - n.top + s - r.top,
                                        left: C.page.left - n.left + c - r.left
                                    }
                                }
                            }(), this.move(C), this.history.unshift(C), this.history.length > 3 && this.history.pop(), t && N(), !0
                        }
                    }
                }, {
                    key: "move",
                    value: function(e) {
                        var t = this;
                        if (void 0 !== this.element.parentNode) {
                            var n = {};
                            for (var i in e) {
                                n[i] = {};
                                for (var o in e[i]) {
                                    for (var r = !1, s = 0; s < this.history.length; ++s) {
                                        var a = this.history[s];
                                        if (void 0 !== a[i] && !y(a[i][o], e[i][o])) {
                                            r = !0;
                                            break
                                        }
                                    }
                                    r || (n[i][o] = !0)
                                }
                            }
                            var c = {
                                    top: "",
                                    left: "",
                                    right: "",
                                    bottom: ""
                                },
                                d = function(e, n) {
                                    if (!1 !== (void 0 !== t.options.optimizations ? t.options.optimizations.gpu : null)) {
                                        var i = void 0,
                                            o = void 0;
                                        e.top ? (c.top = 0, i = n.top) : (c.bottom = 0, i = -n.bottom), e.left ? (c.left = 0, o = n.left) : (c.right = 0, o = -n.right), window.matchMedia && (window.matchMedia("only screen and (min-resolution: 1.3dppx)").matches || window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3)").matches || (o = Math.round(o), i = Math.round(i))), c[P] = "translateX(" + o + "px) translateY(" + i + "px)", "msTransform" !== P && (c[P] += " translateZ(0)")
                                    } else e.top ? c.top = n.top + "px" : c.bottom = n.bottom + "px", e.left ? c.left = n.left + "px" : c.right = n.right + "px"
                                },
                                f = !1;
                            if ((n.page.top || n.page.bottom) && (n.page.left || n.page.right) ? (c.position = "absolute", d(n.page, e.page)) : (n.viewport.top || n.viewport.bottom) && (n.viewport.left || n.viewport.right) ? (c.position = "fixed", d(n.viewport, e.viewport)) : void 0 !== n.offset && n.offset.top && n.offset.left ? function() {
                                    c.position = "absolute";
                                    var i = t.cache("target-offsetparent", function() {
                                        return l(t.target)
                                    });
                                    l(t.element) !== i && I(function() {
                                        t.element.parentNode.removeChild(t.element), i.appendChild(t.element)
                                    }), d(n.offset, e.offset), f = !0
                                }() : (c.position = "absolute", d({
                                    top: !0,
                                    left: !0
                                }, e.page)), !f)
                                if (this.options.bodyElement) this.options.bodyElement.appendChild(this.element);
                                else {
                                    for (var h = !0, p = this.element.parentNode; p && 1 === p.nodeType && "BODY" !== p.tagName;) {
                                        if ("static" !== getComputedStyle(p).position) {
                                            h = !1;
                                            break
                                        }
                                        p = p.parentNode
                                    }
                                    h || (this.element.parentNode.removeChild(this.element), this.element.ownerDocument.body.appendChild(this.element))
                                }
                            var g = {},
                                m = !1;
                            for (var o in c) {
                                var v = c[o];
                                this.element.style[o] !== v && (m = !0, g[o] = v)
                            }
                            m && I(function() {
                                u(t.element.style, g), t.trigger("repositioned")
                            })
                        }
                    }
                }]), t
            }();
        X.modules = [], E.position = M;
        var Y = u(X, E),
            $ = function() {
                function e(e, t) {
                    var n = [],
                        i = !0,
                        o = !1,
                        r = void 0;
                    try {
                        for (var s, a = e[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                    } catch (e) {
                        o = !0, r = e
                    } finally {
                        try {
                            !i && a.return && a.return()
                        } finally {
                            if (o) throw r
                        }
                    }
                    return n
                }
                return function(t, n) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, n);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            a = (F = E.Utils).getBounds,
            u = F.extend,
            m = F.updateClasses,
            I = F.defer,
            G = ["left", "top", "right", "bottom"];
        E.modules.push({
            position: function(e) {
                var t = this,
                    n = e.top,
                    i = e.left,
                    o = e.targetAttachment;
                if (!this.options.constraints) return !0;
                var r = this.cache("element-bounds", function() {
                        return a(t.element)
                    }),
                    s = r.height,
                    l = r.width;
                if (0 === l && 0 === s && void 0 !== this.lastSize) {
                    var c = this.lastSize;
                    l = c.width, s = c.height
                }
                var d = this.cache("target-bounds", function() {
                        return t.getTargetBounds()
                    }),
                    f = d.height,
                    h = d.width,
                    p = [this.getClass("pinned"), this.getClass("out-of-bounds")];
                this.options.constraints.forEach(function(e) {
                    var t = e.outOfBoundsClass,
                        n = e.pinnedClass;
                    t && p.push(t), n && p.push(n)
                }), p.forEach(function(e) {
                    ["left", "top", "right", "bottom"].forEach(function(t) {
                        p.push(e + "-" + t)
                    })
                });
                var g = [],
                    v = u({}, o),
                    y = u({}, this.attachment);
                return this.options.constraints.forEach(function(e) {
                    var r = e.to,
                        a = e.attachment,
                        c = e.pin;
                    void 0 === a && (a = "");
                    var u = void 0,
                        d = void 0;
                    if (a.indexOf(" ") >= 0) {
                        var p = a.split(" "),
                            m = $(p, 2);
                        d = m[0], u = m[1]
                    } else u = d = a;
                    var b = C(t, r);
                    "target" !== d && "both" !== d || (n < b[1] && "top" === v.top && (n += f, v.top = "bottom"), n + s > b[3] && "bottom" === v.top && (n -= f, v.top = "top")), "together" === d && ("top" === v.top && ("bottom" === y.top && n < b[1] ? (n += f, v.top = "bottom", n += s, y.top = "top") : "top" === y.top && n + s > b[3] && n - (s - f) >= b[1] && (n -= s - f, v.top = "bottom", y.top = "bottom")), "bottom" === v.top && ("top" === y.top && n + s > b[3] ? (n -= f, v.top = "top", n -= s, y.top = "bottom") : "bottom" === y.top && n < b[1] && n + (2 * s - f) <= b[3] && (n += s - f, v.top = "top", y.top = "top")), "middle" === v.top && (n + s > b[3] && "top" === y.top ? (n -= s, y.top = "bottom") : n < b[1] && "bottom" === y.top && (n += s, y.top = "top"))), "target" !== u && "both" !== u || (i < b[0] && "left" === v.left && (i += h, v.left = "right"), i + l > b[2] && "right" === v.left && (i -= h, v.left = "left")), "together" === u && (i < b[0] && "left" === v.left ? "right" === y.left ? (i += h, v.left = "right", i += l, y.left = "left") : "left" === y.left && (i += h, v.left = "right", i -= l, y.left = "right") : i + l > b[2] && "right" === v.left ? "left" === y.left ? (i -= h, v.left = "left", i -= l, y.left = "right") : "right" === y.left && (i -= h, v.left = "left", i += l, y.left = "left") : "center" === v.left && (i + l > b[2] && "left" === y.left ? (i -= l, y.left = "right") : i < b[0] && "right" === y.left && (i += l, y.left = "left"))), "element" !== d && "both" !== d || (n < b[1] && "bottom" === y.top && (n += s, y.top = "top"), n + s > b[3] && "top" === y.top && (n -= s, y.top = "bottom")), "element" !== u && "both" !== u || (i < b[0] && ("right" === y.left ? (i += l, y.left = "left") : "center" === y.left && (i += l / 2, y.left = "left")), i + l > b[2] && ("left" === y.left ? (i -= l, y.left = "right") : "center" === y.left && (i -= l / 2, y.left = "right"))), "string" == typeof c ? c = c.split(",").map(function(e) {
                        return e.trim()
                    }) : !0 === c && (c = ["top", "left", "right", "bottom"]), c = c || [];
                    var w = [],
                        T = [];
                    n < b[1] && (c.indexOf("top") >= 0 ? (n = b[1], w.push("top")) : T.push("top")), n + s > b[3] && (c.indexOf("bottom") >= 0 ? (n = b[3] - s, w.push("bottom")) : T.push("bottom")), i < b[0] && (c.indexOf("left") >= 0 ? (i = b[0], w.push("left")) : T.push("left")), i + l > b[2] && (c.indexOf("right") >= 0 ? (i = b[2] - l, w.push("right")) : T.push("right")), w.length && function() {
                        var e = void 0;
                        e = void 0 !== t.options.pinnedClass ? t.options.pinnedClass : t.getClass("pinned"), g.push(e), w.forEach(function(t) {
                            g.push(e + "-" + t)
                        })
                    }(), T.length && function() {
                        var e = void 0;
                        e = void 0 !== t.options.outOfBoundsClass ? t.options.outOfBoundsClass : t.getClass("out-of-bounds"), g.push(e), T.forEach(function(t) {
                            g.push(e + "-" + t)
                        })
                    }(), (w.indexOf("left") >= 0 || w.indexOf("right") >= 0) && (y.left = v.left = !1), (w.indexOf("top") >= 0 || w.indexOf("bottom") >= 0) && (y.top = v.top = !1), v.top === o.top && v.left === o.left && y.top === t.attachment.top && y.left === t.attachment.left || (t.updateAttachClasses(y, v), t.trigger("update", {
                        attachment: y,
                        targetAttachment: v
                    }))
                }), I(function() {
                    !1 !== t.options.addTargetClasses && m(t.target, g, p), m(t.element, g, p)
                }), {
                    top: n,
                    left: i
                }
            }
        });
        var a = (F = E.Utils).getBounds,
            m = F.updateClasses,
            I = F.defer;
        E.modules.push({
            position: function(e) {
                var t = this,
                    n = e.top,
                    i = e.left,
                    o = this.cache("element-bounds", function() {
                        return a(t.element)
                    }),
                    r = o.height,
                    s = o.width,
                    l = this.getTargetBounds(),
                    c = n + r,
                    u = i + s,
                    d = [];
                n <= l.bottom && c >= l.top && ["left", "right"].forEach(function(e) {
                    var t = l[e];
                    t !== i && t !== u || d.push(e)
                }), i <= l.right && u >= l.left && ["top", "bottom"].forEach(function(e) {
                    var t = l[e];
                    t !== n && t !== c || d.push(e)
                });
                var f = [],
                    h = [],
                    p = ["left", "top", "right", "bottom"];
                return f.push(this.getClass("abutted")), p.forEach(function(e) {
                    f.push(t.getClass("abutted") + "-" + e)
                }), d.length && h.push(this.getClass("abutted")), d.forEach(function(e) {
                    h.push(t.getClass("abutted") + "-" + e)
                }), I(function() {
                    !1 !== t.options.addTargetClasses && m(t.target, h, f), m(t.element, h, f)
                }), !0
            }
        });
        $ = function() {
            function e(e, t) {
                var n = [],
                    i = !0,
                    o = !1,
                    r = void 0;
                try {
                    for (var s, a = e[Symbol.iterator](); !(i = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); i = !0);
                } catch (e) {
                    o = !0, r = e
                } finally {
                    try {
                        !i && a.return && a.return()
                    } finally {
                        if (o) throw r
                    }
                }
                return n
            }
            return function(t, n) {
                if (Array.isArray(t)) return t;
                if (Symbol.iterator in Object(t)) return e(t, n);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
        }();
        return E.modules.push({
            position: function(e) {
                var t = e.top,
                    n = e.left;
                if (this.options.shift) {
                    var i = this.options.shift;
                    "function" == typeof this.options.shift && (i = this.options.shift.call(this, {
                        top: t,
                        left: n
                    }));
                    var o = void 0,
                        r = void 0;
                    if ("string" == typeof i) {
                        (i = i.split(" "))[1] = i[1] || i[0];
                        var s = $(i, 2);
                        o = s[0], r = s[1], o = parseFloat(o, 10), r = parseFloat(r, 10)
                    } else o = i.top, r = i.left;
                    return t += o, n += r, {
                        top: t,
                        left: n
                    }
                }
            }
        }), Y
    }), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript."); + function(e) {
    var t = jQuery.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 == t[0] && 9 == t[1] && t[2] < 1 || t[0] >= 4) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
}(),
function() {
    function e(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    }

    function t(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    }

    function n(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }
    var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        },
        o = function() {
            function e(e, t) {
                for (var n = 0; n < t.length; n++) {
                    var i = t[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                }
            }
            return function(t, n, i) {
                return n && e(t.prototype, n), i && e(t, i), t
            }
        }(),
        r = function(e) {
            function t(e) {
                return {}.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
            }

            function n(e) {
                return (e[0] || e).nodeType
            }

            function i() {
                return {
                    bindType: s.end,
                    delegateType: s.end,
                    handle: function(t) {
                        if (e(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
                    }
                }
            }

            function o() {
                if (window.QUnit) return !1;
                var e = document.createElement("bootstrap");
                for (var t in a)
                    if (void 0 !== e.style[t]) return {
                        end: a[t]
                    };
                return !1
            }

            function r(t) {
                var n = this,
                    i = !1;
                return e(this).one(l.TRANSITION_END, function() {
                    i = !0
                }), setTimeout(function() {
                    i || l.triggerTransitionEnd(n)
                }, t), this
            }
            var s = !1,
                a = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                },
                l = {
                    TRANSITION_END: "bsTransitionEnd",
                    getUID: function(e) {
                        do {
                            e += ~~(1e6 * Math.random())
                        } while (document.getElementById(e));
                        return e
                    },
                    getSelectorFromElement: function(e) {
                        var t = e.getAttribute("data-target");
                        return t || (t = e.getAttribute("href") || "", t = /^#[a-z]/i.test(t) ? t : null), t
                    },
                    reflow: function(e) {
                        return e.offsetHeight
                    },
                    triggerTransitionEnd: function(t) {
                        e(t).trigger(s.end)
                    },
                    supportsTransitionEnd: function() {
                        return Boolean(s)
                    },
                    typeCheckConfig: function(e, i, o) {
                        for (var r in o)
                            if (o.hasOwnProperty(r)) {
                                var s = o[r],
                                    a = i[r],
                                    l = a && n(a) ? "element" : t(a);
                                if (!new RegExp(s).test(l)) throw new Error(e.toUpperCase() + ': Option "' + r + '" provided type "' + l + '" but expected type "' + s + '".')
                            }
                    }
                };
            return s = o(), e.fn.emulateTransitionEnd = r, l.supportsTransitionEnd() && (e.event.special[l.TRANSITION_END] = i()), l
        }(jQuery),
        s = (function(e) {
            var t = "alert",
                i = "bs.alert",
                s = "." + i,
                a = e.fn[t],
                l = {
                    DISMISS: '[data-dismiss="alert"]'
                },
                c = {
                    CLOSE: "close" + s,
                    CLOSED: "closed" + s,
                    CLICK_DATA_API: "click" + s + ".data-api"
                },
                u = {
                    ALERT: "alert",
                    FADE: "fade",
                    SHOW: "show"
                },
                d = function() {
                    function t(e) {
                        n(this, t), this._element = e
                    }
                    return t.prototype.close = function(e) {
                        e = e || this._element;
                        var t = this._getRootElement(e);
                        this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
                    }, t.prototype.dispose = function() {
                        e.removeData(this._element, i), this._element = null
                    }, t.prototype._getRootElement = function(t) {
                        var n = r.getSelectorFromElement(t),
                            i = !1;
                        return n && (i = e(n)[0]), i || (i = e(t).closest("." + u.ALERT)[0]), i
                    }, t.prototype._triggerCloseEvent = function(t) {
                        var n = e.Event(c.CLOSE);
                        return e(t).trigger(n), n
                    }, t.prototype._removeElement = function(t) {
                        var n = this;
                        return e(t).removeClass(u.SHOW), r.supportsTransitionEnd() && e(t).hasClass(u.FADE) ? void e(t).one(r.TRANSITION_END, function(e) {
                            return n._destroyElement(t, e)
                        }).emulateTransitionEnd(150) : void this._destroyElement(t)
                    }, t.prototype._destroyElement = function(t) {
                        e(t).detach().trigger(c.CLOSED).remove()
                    }, t._jQueryInterface = function(n) {
                        return this.each(function() {
                            var o = e(this),
                                r = o.data(i);
                            r || (r = new t(this), o.data(i, r)), "close" === n && r[n](this)
                        })
                    }, t._handleDismiss = function(e) {
                        return function(t) {
                            t && t.preventDefault(), e.close(this)
                        }
                    }, o(t, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }]), t
                }();
            e(document).on(c.CLICK_DATA_API, l.DISMISS, d._handleDismiss(new d)), e.fn[t] = d._jQueryInterface, e.fn[t].Constructor = d, e.fn[t].noConflict = function() {
                return e.fn[t] = a, d._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "button",
                i = "bs.button",
                r = "." + i,
                s = ".data-api",
                a = e.fn[t],
                l = {
                    ACTIVE: "active",
                    BUTTON: "btn",
                    FOCUS: "focus"
                },
                c = {
                    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
                    DATA_TOGGLE: '[data-toggle="buttons"]',
                    INPUT: "input",
                    ACTIVE: ".active",
                    BUTTON: ".btn"
                },
                u = {
                    CLICK_DATA_API: "click" + r + s,
                    FOCUS_BLUR_DATA_API: "focus" + r + s + " blur" + r + s
                },
                d = function() {
                    function t(e) {
                        n(this, t), this._element = e
                    }
                    return t.prototype.toggle = function() {
                        var t = !0,
                            n = e(this._element).closest(c.DATA_TOGGLE)[0];
                        if (n) {
                            var i = e(this._element).find(c.INPUT)[0];
                            if (i) {
                                if ("radio" === i.type)
                                    if (i.checked && e(this._element).hasClass(l.ACTIVE)) t = !1;
                                    else {
                                        var o = e(n).find(c.ACTIVE)[0];
                                        o && e(o).removeClass(l.ACTIVE)
                                    }
                                t && (i.checked = !e(this._element).hasClass(l.ACTIVE), e(i).trigger("change")), i.focus()
                            }
                        }
                        this._element.setAttribute("aria-pressed", !e(this._element).hasClass(l.ACTIVE)), t && e(this._element).toggleClass(l.ACTIVE)
                    }, t.prototype.dispose = function() {
                        e.removeData(this._element, i), this._element = null
                    }, t._jQueryInterface = function(n) {
                        return this.each(function() {
                            var o = e(this).data(i);
                            o || (o = new t(this), e(this).data(i, o)), "toggle" === n && o[n]()
                        })
                    }, o(t, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }]), t
                }();
            e(document).on(u.CLICK_DATA_API, c.DATA_TOGGLE_CARROT, function(t) {
                t.preventDefault();
                var n = t.target;
                e(n).hasClass(l.BUTTON) || (n = e(n).closest(c.BUTTON)), d._jQueryInterface.call(e(n), "toggle")
            }).on(u.FOCUS_BLUR_DATA_API, c.DATA_TOGGLE_CARROT, function(t) {
                var n = e(t.target).closest(c.BUTTON)[0];
                e(n).toggleClass(l.FOCUS, /^focus(in)?$/.test(t.type))
            }), e.fn[t] = d._jQueryInterface, e.fn[t].Constructor = d, e.fn[t].noConflict = function() {
                return e.fn[t] = a, d._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "carousel",
                s = "bs.carousel",
                a = "." + s,
                l = ".data-api",
                c = e.fn[t],
                u = {
                    interval: 5e3,
                    keyboard: !0,
                    slide: !1,
                    pause: "hover",
                    wrap: !0
                },
                d = {
                    interval: "(number|boolean)",
                    keyboard: "boolean",
                    slide: "(boolean|string)",
                    pause: "(string|boolean)",
                    wrap: "boolean"
                },
                f = {
                    NEXT: "next",
                    PREV: "prev",
                    LEFT: "left",
                    RIGHT: "right"
                },
                h = {
                    SLIDE: "slide" + a,
                    SLID: "slid" + a,
                    KEYDOWN: "keydown" + a,
                    MOUSEENTER: "mouseenter" + a,
                    MOUSELEAVE: "mouseleave" + a,
                    LOAD_DATA_API: "load" + a + l,
                    CLICK_DATA_API: "click" + a + l
                },
                p = {
                    CAROUSEL: "carousel",
                    ACTIVE: "active",
                    SLIDE: "slide",
                    RIGHT: "carousel-item-right",
                    LEFT: "carousel-item-left",
                    NEXT: "carousel-item-next",
                    PREV: "carousel-item-prev",
                    ITEM: "carousel-item"
                },
                g = {
                    ACTIVE: ".active",
                    ACTIVE_ITEM: ".active.carousel-item",
                    ITEM: ".carousel-item",
                    NEXT_PREV: ".carousel-item-next, .carousel-item-prev",
                    INDICATORS: ".carousel-indicators",
                    DATA_SLIDE: "[data-slide], [data-slide-to]",
                    DATA_RIDE: '[data-ride="carousel"]'
                },
                m = function() {
                    function l(t, i) {
                        n(this, l), this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this._config = this._getConfig(i), this._element = e(t)[0], this._indicatorsElement = e(this._element).find(g.INDICATORS)[0], this._addEventListeners()
                    }
                    return l.prototype.next = function() {
                        if (this._isSliding) throw new Error("Carousel is sliding");
                        this._slide(f.NEXT)
                    }, l.prototype.nextWhenVisible = function() {
                        document.hidden || this.next()
                    }, l.prototype.prev = function() {
                        if (this._isSliding) throw new Error("Carousel is sliding");
                        this._slide(f.PREVIOUS)
                    }, l.prototype.pause = function(t) {
                        t || (this._isPaused = !0), e(this._element).find(g.NEXT_PREV)[0] && r.supportsTransitionEnd() && (r.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
                    }, l.prototype.cycle = function(e) {
                        e || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
                    }, l.prototype.to = function(t) {
                        var n = this;
                        this._activeElement = e(this._element).find(g.ACTIVE_ITEM)[0];
                        var i = this._getItemIndex(this._activeElement);
                        if (!(t > this._items.length - 1 || t < 0)) {
                            if (this._isSliding) return void e(this._element).one(h.SLID, function() {
                                return n.to(t)
                            });
                            if (i === t) return this.pause(), void this.cycle();
                            var o = t > i ? f.NEXT : f.PREVIOUS;
                            this._slide(o, this._items[t])
                        }
                    }, l.prototype.dispose = function() {
                        e(this._element).off(a), e.removeData(this._element, s), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
                    }, l.prototype._getConfig = function(n) {
                        return n = e.extend({}, u, n), r.typeCheckConfig(t, n, d), n
                    }, l.prototype._addEventListeners = function() {
                        var t = this;
                        this._config.keyboard && e(this._element).on(h.KEYDOWN, function(e) {
                            return t._keydown(e)
                        }), "hover" !== this._config.pause || "ontouchstart" in document.documentElement || e(this._element).on(h.MOUSEENTER, function(e) {
                            return t.pause(e)
                        }).on(h.MOUSELEAVE, function(e) {
                            return t.cycle(e)
                        })
                    }, l.prototype._keydown = function(e) {
                        if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
                            case 37:
                                e.preventDefault(), this.prev();
                                break;
                            case 39:
                                e.preventDefault(), this.next();
                                break;
                            default:
                                return
                        }
                    }, l.prototype._getItemIndex = function(t) {
                        return this._items = e.makeArray(e(t).parent().find(g.ITEM)), this._items.indexOf(t)
                    }, l.prototype._getItemByDirection = function(e, t) {
                        var n = e === f.NEXT,
                            i = e === f.PREVIOUS,
                            o = this._getItemIndex(t),
                            r = this._items.length - 1;
                        if ((i && 0 === o || n && o === r) && !this._config.wrap) return t;
                        var s = (o + (e === f.PREVIOUS ? -1 : 1)) % this._items.length;
                        return -1 === s ? this._items[this._items.length - 1] : this._items[s]
                    }, l.prototype._triggerSlideEvent = function(t, n) {
                        var i = e.Event(h.SLIDE, {
                            relatedTarget: t,
                            direction: n
                        });
                        return e(this._element).trigger(i), i
                    }, l.prototype._setActiveIndicatorElement = function(t) {
                        if (this._indicatorsElement) {
                            e(this._indicatorsElement).find(g.ACTIVE).removeClass(p.ACTIVE);
                            var n = this._indicatorsElement.children[this._getItemIndex(t)];
                            n && e(n).addClass(p.ACTIVE)
                        }
                    }, l.prototype._slide = function(t, n) {
                        var i = this,
                            o = e(this._element).find(g.ACTIVE_ITEM)[0],
                            s = n || o && this._getItemByDirection(t, o),
                            a = Boolean(this._interval),
                            l = void 0,
                            c = void 0,
                            u = void 0;
                        if (t === f.NEXT ? (l = p.LEFT, c = p.NEXT, u = f.LEFT) : (l = p.RIGHT, c = p.PREV, u = f.RIGHT), s && e(s).hasClass(p.ACTIVE)) this._isSliding = !1;
                        else if (!this._triggerSlideEvent(s, u).isDefaultPrevented() && o && s) {
                            this._isSliding = !0, a && this.pause(), this._setActiveIndicatorElement(s);
                            var d = e.Event(h.SLID, {
                                relatedTarget: s,
                                direction: u
                            });
                            r.supportsTransitionEnd() && e(this._element).hasClass(p.SLIDE) ? (e(s).addClass(c), r.reflow(s), e(o).addClass(l), e(s).addClass(l), e(o).one(r.TRANSITION_END, function() {
                                e(s).removeClass(l + " " + c).addClass(p.ACTIVE), e(o).removeClass(p.ACTIVE + " " + c + " " + l), i._isSliding = !1, setTimeout(function() {
                                    return e(i._element).trigger(d)
                                }, 0)
                            }).emulateTransitionEnd(600)) : (e(o).removeClass(p.ACTIVE), e(s).addClass(p.ACTIVE), this._isSliding = !1, e(this._element).trigger(d)), a && this.cycle()
                        }
                    }, l._jQueryInterface = function(t) {
                        return this.each(function() {
                            var n = e(this).data(s),
                                o = e.extend({}, u, e(this).data());
                            "object" === (void 0 === t ? "undefined" : i(t)) && e.extend(o, t);
                            var r = "string" == typeof t ? t : o.slide;
                            if (n || (n = new l(this, o), e(this).data(s, n)), "number" == typeof t) n.to(t);
                            else if ("string" == typeof r) {
                                if (void 0 === n[r]) throw new Error('No method named "' + r + '"');
                                n[r]()
                            } else o.interval && (n.pause(), n.cycle())
                        })
                    }, l._dataApiClickHandler = function(t) {
                        var n = r.getSelectorFromElement(this);
                        if (n) {
                            var i = e(n)[0];
                            if (i && e(i).hasClass(p.CAROUSEL)) {
                                var o = e.extend({}, e(i).data(), e(this).data()),
                                    a = this.getAttribute("data-slide-to");
                                a && (o.interval = !1), l._jQueryInterface.call(e(i), o), a && e(i).data(s).to(a), t.preventDefault()
                            }
                        }
                    }, o(l, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }, {
                        key: "Default",
                        get: function() {
                            return u
                        }
                    }]), l
                }();
            e(document).on(h.CLICK_DATA_API, g.DATA_SLIDE, m._dataApiClickHandler), e(window).on(h.LOAD_DATA_API, function() {
                e(g.DATA_RIDE).each(function() {
                    var t = e(this);
                    m._jQueryInterface.call(t, t.data())
                })
            }), e.fn[t] = m._jQueryInterface, e.fn[t].Constructor = m, e.fn[t].noConflict = function() {
                return e.fn[t] = c, m._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "collapse",
                s = "bs.collapse",
                a = "." + s,
                l = e.fn[t],
                c = {
                    toggle: !0,
                    parent: ""
                },
                u = {
                    toggle: "boolean",
                    parent: "string"
                },
                d = {
                    SHOW: "show" + a,
                    SHOWN: "shown" + a,
                    HIDE: "hide" + a,
                    HIDDEN: "hidden" + a,
                    CLICK_DATA_API: "click" + a + ".data-api"
                },
                f = {
                    SHOW: "show",
                    COLLAPSE: "collapse",
                    COLLAPSING: "collapsing",
                    COLLAPSED: "collapsed"
                },
                h = {
                    WIDTH: "width",
                    HEIGHT: "height"
                },
                p = {
                    ACTIVES: ".card > .show, .card > .collapsing",
                    DATA_TOGGLE: '[data-toggle="collapse"]'
                },
                g = function() {
                    function a(t, i) {
                        n(this, a), this._isTransitioning = !1, this._element = t, this._config = this._getConfig(i), this._triggerArray = e.makeArray(e('[data-toggle="collapse"][href="#' + t.id + '"],[data-toggle="collapse"][data-target="#' + t.id + '"]')), this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
                    }
                    return a.prototype.toggle = function() {
                        e(this._element).hasClass(f.SHOW) ? this.hide() : this.show()
                    }, a.prototype.show = function() {
                        var t = this;
                        if (this._isTransitioning) throw new Error("Collapse is transitioning");
                        if (!e(this._element).hasClass(f.SHOW)) {
                            var n = void 0,
                                i = void 0;
                            if (this._parent && ((n = e.makeArray(e(this._parent).find(p.ACTIVES))).length || (n = null)), !(n && (i = e(n).data(s)) && i._isTransitioning)) {
                                var o = e.Event(d.SHOW);
                                if (e(this._element).trigger(o), !o.isDefaultPrevented()) {
                                    n && (a._jQueryInterface.call(e(n), "hide"), i || e(n).data(s, null));
                                    var l = this._getDimension();
                                    e(this._element).removeClass(f.COLLAPSE).addClass(f.COLLAPSING), this._element.style[l] = 0, this._element.setAttribute("aria-expanded", !0), this._triggerArray.length && e(this._triggerArray).removeClass(f.COLLAPSED).attr("aria-expanded", !0), this.setTransitioning(!0);
                                    var c = function() {
                                        e(t._element).removeClass(f.COLLAPSING).addClass(f.COLLAPSE).addClass(f.SHOW), t._element.style[l] = "", t.setTransitioning(!1), e(t._element).trigger(d.SHOWN)
                                    };
                                    if (!r.supportsTransitionEnd()) return void c();
                                    var u = "scroll" + (l[0].toUpperCase() + l.slice(1));
                                    e(this._element).one(r.TRANSITION_END, c).emulateTransitionEnd(600), this._element.style[l] = this._element[u] + "px"
                                }
                            }
                        }
                    }, a.prototype.hide = function() {
                        var t = this;
                        if (this._isTransitioning) throw new Error("Collapse is transitioning");
                        if (e(this._element).hasClass(f.SHOW)) {
                            var n = e.Event(d.HIDE);
                            if (e(this._element).trigger(n), !n.isDefaultPrevented()) {
                                var i = this._getDimension(),
                                    o = i === h.WIDTH ? "offsetWidth" : "offsetHeight";
                                this._element.style[i] = this._element[o] + "px", r.reflow(this._element), e(this._element).addClass(f.COLLAPSING).removeClass(f.COLLAPSE).removeClass(f.SHOW), this._element.setAttribute("aria-expanded", !1), this._triggerArray.length && e(this._triggerArray).addClass(f.COLLAPSED).attr("aria-expanded", !1), this.setTransitioning(!0);
                                var s = function() {
                                    t.setTransitioning(!1), e(t._element).removeClass(f.COLLAPSING).addClass(f.COLLAPSE).trigger(d.HIDDEN)
                                };
                                return this._element.style[i] = "", r.supportsTransitionEnd() ? void e(this._element).one(r.TRANSITION_END, s).emulateTransitionEnd(600) : void s()
                            }
                        }
                    }, a.prototype.setTransitioning = function(e) {
                        this._isTransitioning = e
                    }, a.prototype.dispose = function() {
                        e.removeData(this._element, s), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
                    }, a.prototype._getConfig = function(n) {
                        return n = e.extend({}, c, n), n.toggle = Boolean(n.toggle), r.typeCheckConfig(t, n, u), n
                    }, a.prototype._getDimension = function() {
                        return e(this._element).hasClass(h.WIDTH) ? h.WIDTH : h.HEIGHT
                    }, a.prototype._getParent = function() {
                        var t = this,
                            n = e(this._config.parent)[0],
                            i = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]';
                        return e(n).find(i).each(function(e, n) {
                            t._addAriaAndCollapsedClass(a._getTargetFromElement(n), [n])
                        }), n
                    }, a.prototype._addAriaAndCollapsedClass = function(t, n) {
                        if (t) {
                            var i = e(t).hasClass(f.SHOW);
                            t.setAttribute("aria-expanded", i), n.length && e(n).toggleClass(f.COLLAPSED, !i).attr("aria-expanded", i)
                        }
                    }, a._getTargetFromElement = function(t) {
                        var n = r.getSelectorFromElement(t);
                        return n ? e(n)[0] : null
                    }, a._jQueryInterface = function(t) {
                        return this.each(function() {
                            var n = e(this),
                                o = n.data(s),
                                r = e.extend({}, c, n.data(), "object" === (void 0 === t ? "undefined" : i(t)) && t);
                            if (!o && r.toggle && /show|hide/.test(t) && (r.toggle = !1), o || (o = new a(this, r), n.data(s, o)), "string" == typeof t) {
                                if (void 0 === o[t]) throw new Error('No method named "' + t + '"');
                                o[t]()
                            }
                        })
                    }, o(a, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }, {
                        key: "Default",
                        get: function() {
                            return c
                        }
                    }]), a
                }();
            e(document).on(d.CLICK_DATA_API, p.DATA_TOGGLE, function(t) {
                t.preventDefault();
                var n = g._getTargetFromElement(this),
                    i = e(n).data(s) ? "toggle" : e(this).data();
                g._jQueryInterface.call(e(n), i)
            }), e.fn[t] = g._jQueryInterface, e.fn[t].Constructor = g, e.fn[t].noConflict = function() {
                return e.fn[t] = l, g._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "dropdown",
                i = "bs.dropdown",
                s = "." + i,
                a = ".data-api",
                l = e.fn[t],
                c = {
                    HIDE: "hide" + s,
                    HIDDEN: "hidden" + s,
                    SHOW: "show" + s,
                    SHOWN: "shown" + s,
                    CLICK: "click" + s,
                    CLICK_DATA_API: "click" + s + a,
                    FOCUSIN_DATA_API: "focusin" + s + a,
                    KEYDOWN_DATA_API: "keydown" + s + a
                },
                u = {
                    BACKDROP: "dropdown-backdrop",
                    DISABLED: "disabled",
                    SHOW: "show"
                },
                d = {
                    BACKDROP: ".dropdown-backdrop",
                    DATA_TOGGLE: '[data-toggle="dropdown"]',
                    FORM_CHILD: ".dropdown form",
                    ROLE_MENU: '[role="menu"]',
                    ROLE_LISTBOX: '[role="listbox"]',
                    NAVBAR_NAV: ".navbar-nav",
                    VISIBLE_ITEMS: '[role="menu"] li:not(.disabled) a, [role="listbox"] li:not(.disabled) a'
                },
                f = function() {
                    function t(e) {
                        n(this, t), this._element = e, this._addEventListeners()
                    }
                    return t.prototype.toggle = function() {
                        if (this.disabled || e(this).hasClass(u.DISABLED)) return !1;
                        var n = t._getParentFromElement(this),
                            i = e(n).hasClass(u.SHOW);
                        if (t._clearMenus(), i) return !1;
                        if ("ontouchstart" in document.documentElement && !e(n).closest(d.NAVBAR_NAV).length) {
                            var o = document.createElement("div");
                            o.className = u.BACKDROP, e(o).insertBefore(this), e(o).on("click", t._clearMenus)
                        }
                        var r = {
                                relatedTarget: this
                            },
                            s = e.Event(c.SHOW, r);
                        return e(n).trigger(s), !s.isDefaultPrevented() && (this.focus(), this.setAttribute("aria-expanded", !0), e(n).toggleClass(u.SHOW), e(n).trigger(e.Event(c.SHOWN, r)), !1)
                    }, t.prototype.dispose = function() {
                        e.removeData(this._element, i), e(this._element).off(s), this._element = null
                    }, t.prototype._addEventListeners = function() {
                        e(this._element).on(c.CLICK, this.toggle)
                    }, t._jQueryInterface = function(n) {
                        return this.each(function() {
                            var o = e(this).data(i);
                            if (o || (o = new t(this), e(this).data(i, o)), "string" == typeof n) {
                                if (void 0 === o[n]) throw new Error('No method named "' + n + '"');
                                o[n].call(this)
                            }
                        })
                    }, t._clearMenus = function(n) {
                        if (!n || 3 !== n.which) {
                            var i = e(d.BACKDROP)[0];
                            i && i.parentNode.removeChild(i);
                            for (var o = e.makeArray(e(d.DATA_TOGGLE)), r = 0; r < o.length; r++) {
                                var s = t._getParentFromElement(o[r]),
                                    a = {
                                        relatedTarget: o[r]
                                    };
                                if (e(s).hasClass(u.SHOW) && !(n && ("click" === n.type && /input|textarea/i.test(n.target.tagName) || "focusin" === n.type) && e.contains(s, n.target))) {
                                    var l = e.Event(c.HIDE, a);
                                    e(s).trigger(l), l.isDefaultPrevented() || (o[r].setAttribute("aria-expanded", "false"), e(s).removeClass(u.SHOW).trigger(e.Event(c.HIDDEN, a)))
                                }
                            }
                        }
                    }, t._getParentFromElement = function(t) {
                        var n = void 0,
                            i = r.getSelectorFromElement(t);
                        return i && (n = e(i)[0]), n || t.parentNode
                    }, t._dataApiKeydownHandler = function(n) {
                        if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName) && (n.preventDefault(), n.stopPropagation(), !this.disabled && !e(this).hasClass(u.DISABLED))) {
                            var i = t._getParentFromElement(this),
                                o = e(i).hasClass(u.SHOW);
                            if (!o && 27 !== n.which || o && 27 === n.which) {
                                if (27 === n.which) {
                                    var r = e(i).find(d.DATA_TOGGLE)[0];
                                    e(r).trigger("focus")
                                }
                                return void e(this).trigger("click")
                            }
                            var s = e(i).find(d.VISIBLE_ITEMS).get();
                            if (s.length) {
                                var a = s.indexOf(n.target);
                                38 === n.which && a > 0 && a--, 40 === n.which && a < s.length - 1 && a++, a < 0 && (a = 0), s[a].focus()
                            }
                        }
                    }, o(t, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }]), t
                }();
            e(document).on(c.KEYDOWN_DATA_API, d.DATA_TOGGLE, f._dataApiKeydownHandler).on(c.KEYDOWN_DATA_API, d.ROLE_MENU, f._dataApiKeydownHandler).on(c.KEYDOWN_DATA_API, d.ROLE_LISTBOX, f._dataApiKeydownHandler).on(c.CLICK_DATA_API + " " + c.FOCUSIN_DATA_API, f._clearMenus).on(c.CLICK_DATA_API, d.DATA_TOGGLE, f.prototype.toggle).on(c.CLICK_DATA_API, d.FORM_CHILD, function(e) {
                e.stopPropagation()
            }), e.fn[t] = f._jQueryInterface, e.fn[t].Constructor = f, e.fn[t].noConflict = function() {
                return e.fn[t] = l, f._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "modal",
                s = "bs.modal",
                a = "." + s,
                l = e.fn[t],
                c = {
                    backdrop: !0,
                    keyboard: !0,
                    focus: !0,
                    show: !0
                },
                u = {
                    backdrop: "(boolean|string)",
                    keyboard: "boolean",
                    focus: "boolean",
                    show: "boolean"
                },
                d = {
                    HIDE: "hide" + a,
                    HIDDEN: "hidden" + a,
                    SHOW: "show" + a,
                    SHOWN: "shown" + a,
                    FOCUSIN: "focusin" + a,
                    RESIZE: "resize" + a,
                    CLICK_DISMISS: "click.dismiss" + a,
                    KEYDOWN_DISMISS: "keydown.dismiss" + a,
                    MOUSEUP_DISMISS: "mouseup.dismiss" + a,
                    MOUSEDOWN_DISMISS: "mousedown.dismiss" + a,
                    CLICK_DATA_API: "click" + a + ".data-api"
                },
                f = {
                    SCROLLBAR_MEASURER: "modal-scrollbar-measure",
                    BACKDROP: "modal-backdrop",
                    OPEN: "modal-open",
                    FADE: "fade",
                    SHOW: "show"
                },
                h = {
                    DIALOG: ".modal-dialog",
                    DATA_TOGGLE: '[data-toggle="modal"]',
                    DATA_DISMISS: '[data-dismiss="modal"]',
                    FIXED_CONTENT: ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top"
                },
                p = function() {
                    function l(t, i) {
                        n(this, l), this._config = this._getConfig(i), this._element = t, this._dialog = e(t).find(h.DIALOG)[0], this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._originalBodyPadding = 0, this._scrollbarWidth = 0
                    }
                    return l.prototype.toggle = function(e) {
                        return this._isShown ? this.hide() : this.show(e)
                    }, l.prototype.show = function(t) {
                        var n = this;
                        if (this._isTransitioning) throw new Error("Modal is transitioning");
                        r.supportsTransitionEnd() && e(this._element).hasClass(f.FADE) && (this._isTransitioning = !0);
                        var i = e.Event(d.SHOW, {
                            relatedTarget: t
                        });
                        e(this._element).trigger(i), this._isShown || i.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), e(document.body).addClass(f.OPEN), this._setEscapeEvent(), this._setResizeEvent(), e(this._element).on(d.CLICK_DISMISS, h.DATA_DISMISS, function(e) {
                            return n.hide(e)
                        }), e(this._dialog).on(d.MOUSEDOWN_DISMISS, function() {
                            e(n._element).one(d.MOUSEUP_DISMISS, function(t) {
                                e(t.target).is(n._element) && (n._ignoreBackdropClick = !0)
                            })
                        }), this._showBackdrop(function() {
                            return n._showElement(t)
                        }))
                    }, l.prototype.hide = function(t) {
                        var n = this;
                        if (t && t.preventDefault(), this._isTransitioning) throw new Error("Modal is transitioning");
                        var i = r.supportsTransitionEnd() && e(this._element).hasClass(f.FADE);
                        i && (this._isTransitioning = !0);
                        var o = e.Event(d.HIDE);
                        e(this._element).trigger(o), this._isShown && !o.isDefaultPrevented() && (this._isShown = !1, this._setEscapeEvent(), this._setResizeEvent(), e(document).off(d.FOCUSIN), e(this._element).removeClass(f.SHOW), e(this._element).off(d.CLICK_DISMISS), e(this._dialog).off(d.MOUSEDOWN_DISMISS), i ? e(this._element).one(r.TRANSITION_END, function(e) {
                            return n._hideModal(e)
                        }).emulateTransitionEnd(300) : this._hideModal())
                    }, l.prototype.dispose = function() {
                        e.removeData(this._element, s), e(window, document, this._element, this._backdrop).off(a), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._originalBodyPadding = null, this._scrollbarWidth = null
                    }, l.prototype._getConfig = function(n) {
                        return n = e.extend({}, c, n), r.typeCheckConfig(t, n, u), n
                    }, l.prototype._showElement = function(t) {
                        var n = this,
                            i = r.supportsTransitionEnd() && e(this._element).hasClass(f.FADE);
                        this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.scrollTop = 0, i && r.reflow(this._element), e(this._element).addClass(f.SHOW), this._config.focus && this._enforceFocus();
                        var o = e.Event(d.SHOWN, {
                                relatedTarget: t
                            }),
                            s = function() {
                                n._config.focus && n._element.focus(), n._isTransitioning = !1, e(n._element).trigger(o)
                            };
                        i ? e(this._dialog).one(r.TRANSITION_END, s).emulateTransitionEnd(300) : s()
                    }, l.prototype._enforceFocus = function() {
                        var t = this;
                        e(document).off(d.FOCUSIN).on(d.FOCUSIN, function(n) {
                            document === n.target || t._element === n.target || e(t._element).has(n.target).length || t._element.focus()
                        })
                    }, l.prototype._setEscapeEvent = function() {
                        var t = this;
                        this._isShown && this._config.keyboard ? e(this._element).on(d.KEYDOWN_DISMISS, function(e) {
                            27 === e.which && t.hide()
                        }) : this._isShown || e(this._element).off(d.KEYDOWN_DISMISS)
                    }, l.prototype._setResizeEvent = function() {
                        var t = this;
                        this._isShown ? e(window).on(d.RESIZE, function(e) {
                            return t._handleUpdate(e)
                        }) : e(window).off(d.RESIZE)
                    }, l.prototype._hideModal = function() {
                        var t = this;
                        this._element.style.display = "none", this._element.setAttribute("aria-hidden", "true"), this._isTransitioning = !1, this._showBackdrop(function() {
                            e(document.body).removeClass(f.OPEN), t._resetAdjustments(), t._resetScrollbar(), e(t._element).trigger(d.HIDDEN)
                        })
                    }, l.prototype._removeBackdrop = function() {
                        this._backdrop && (e(this._backdrop).remove(), this._backdrop = null)
                    }, l.prototype._showBackdrop = function(t) {
                        var n = this,
                            i = e(this._element).hasClass(f.FADE) ? f.FADE : "";
                        if (this._isShown && this._config.backdrop) {
                            var o = r.supportsTransitionEnd() && i;
                            if (this._backdrop = document.createElement("div"), this._backdrop.className = f.BACKDROP, i && e(this._backdrop).addClass(i), e(this._backdrop).appendTo(document.body), e(this._element).on(d.CLICK_DISMISS, function(e) {
                                    return n._ignoreBackdropClick ? void(n._ignoreBackdropClick = !1) : void(e.target === e.currentTarget && ("static" === n._config.backdrop ? n._element.focus() : n.hide()))
                                }), o && r.reflow(this._backdrop), e(this._backdrop).addClass(f.SHOW), !t) return;
                            if (!o) return void t();
                            e(this._backdrop).one(r.TRANSITION_END, t).emulateTransitionEnd(150)
                        } else if (!this._isShown && this._backdrop) {
                            e(this._backdrop).removeClass(f.SHOW);
                            var s = function() {
                                n._removeBackdrop(), t && t()
                            };
                            r.supportsTransitionEnd() && e(this._element).hasClass(f.FADE) ? e(this._backdrop).one(r.TRANSITION_END, s).emulateTransitionEnd(150) : s()
                        } else t && t()
                    }, l.prototype._handleUpdate = function() {
                        this._adjustDialog()
                    }, l.prototype._adjustDialog = function() {
                        var e = this._element.scrollHeight > document.documentElement.clientHeight;
                        !this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
                    }, l.prototype._resetAdjustments = function() {
                        this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
                    }, l.prototype._checkScrollbar = function() {
                        this._isBodyOverflowing = document.body.clientWidth < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
                    }, l.prototype._setScrollbar = function() {
                        var t = parseInt(e(h.FIXED_CONTENT).css("padding-right") || 0, 10);
                        this._originalBodyPadding = document.body.style.paddingRight || "", this._isBodyOverflowing && (document.body.style.paddingRight = t + this._scrollbarWidth + "px")
                    }, l.prototype._resetScrollbar = function() {
                        document.body.style.paddingRight = this._originalBodyPadding
                    }, l.prototype._getScrollbarWidth = function() {
                        var e = document.createElement("div");
                        e.className = f.SCROLLBAR_MEASURER, document.body.appendChild(e);
                        var t = e.offsetWidth - e.clientWidth;
                        return document.body.removeChild(e), t
                    }, l._jQueryInterface = function(t, n) {
                        return this.each(function() {
                            var o = e(this).data(s),
                                r = e.extend({}, l.Default, e(this).data(), "object" === (void 0 === t ? "undefined" : i(t)) && t);
                            if (o || (o = new l(this, r), e(this).data(s, o)), "string" == typeof t) {
                                if (void 0 === o[t]) throw new Error('No method named "' + t + '"');
                                o[t](n)
                            } else r.show && o.show(n)
                        })
                    }, o(l, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }, {
                        key: "Default",
                        get: function() {
                            return c
                        }
                    }]), l
                }();
            e(document).on(d.CLICK_DATA_API, h.DATA_TOGGLE, function(t) {
                var n = this,
                    i = void 0,
                    o = r.getSelectorFromElement(this);
                o && (i = e(o)[0]);
                var a = e(i).data(s) ? "toggle" : e.extend({}, e(i).data(), e(this).data());
                "A" !== this.tagName && "AREA" !== this.tagName || t.preventDefault();
                var l = e(i).one(d.SHOW, function(t) {
                    t.isDefaultPrevented() || l.one(d.HIDDEN, function() {
                        e(n).is(":visible") && n.focus()
                    })
                });
                p._jQueryInterface.call(e(i), a, this)
            }), e.fn[t] = p._jQueryInterface, e.fn[t].Constructor = p, e.fn[t].noConflict = function() {
                return e.fn[t] = l, p._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "scrollspy",
                s = "bs.scrollspy",
                a = "." + s,
                l = e.fn[t],
                c = {
                    offset: 10,
                    method: "auto",
                    target: ""
                },
                u = {
                    offset: "number",
                    method: "string",
                    target: "(string|element)"
                },
                d = {
                    ACTIVATE: "activate" + a,
                    SCROLL: "scroll" + a,
                    LOAD_DATA_API: "load" + a + ".data-api"
                },
                f = {
                    DROPDOWN_ITEM: "dropdown-item",
                    DROPDOWN_MENU: "dropdown-menu",
                    NAV_LINK: "nav-link",
                    NAV: "nav",
                    ACTIVE: "active"
                },
                h = {
                    DATA_SPY: '[data-spy="scroll"]',
                    ACTIVE: ".active",
                    LIST_ITEM: ".list-item",
                    LI: "li",
                    LI_DROPDOWN: "li.dropdown",
                    NAV_LINKS: ".nav-link",
                    DROPDOWN: ".dropdown",
                    DROPDOWN_ITEMS: ".dropdown-item",
                    DROPDOWN_TOGGLE: ".dropdown-toggle"
                },
                p = {
                    OFFSET: "offset",
                    POSITION: "position"
                },
                g = function() {
                    function l(t, i) {
                        var o = this;
                        n(this, l), this._element = t, this._scrollElement = "BODY" === t.tagName ? window : t, this._config = this._getConfig(i), this._selector = this._config.target + " " + h.NAV_LINKS + "," + this._config.target + " " + h.DROPDOWN_ITEMS, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, e(this._scrollElement).on(d.SCROLL, function(e) {
                            return o._process(e)
                        }), this.refresh(), this._process()
                    }
                    return l.prototype.refresh = function() {
                        var t = this,
                            n = this._scrollElement !== this._scrollElement.window ? p.POSITION : p.OFFSET,
                            i = "auto" === this._config.method ? n : this._config.method,
                            o = i === p.POSITION ? this._getScrollTop() : 0;
                        this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), e.makeArray(e(this._selector)).map(function(t) {
                            var n = void 0,
                                s = r.getSelectorFromElement(t);
                            return s && (n = e(s)[0]), n && (n.offsetWidth || n.offsetHeight) ? [e(n)[i]().top + o, s] : null
                        }).filter(function(e) {
                            return e
                        }).sort(function(e, t) {
                            return e[0] - t[0]
                        }).forEach(function(e) {
                            t._offsets.push(e[0]), t._targets.push(e[1])
                        })
                    }, l.prototype.dispose = function() {
                        e.removeData(this._element, s), e(this._scrollElement).off(a), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
                    }, l.prototype._getConfig = function(n) {
                        if ("string" != typeof(n = e.extend({}, c, n)).target) {
                            var i = e(n.target).attr("id");
                            i || (i = r.getUID(t), e(n.target).attr("id", i)), n.target = "#" + i
                        }
                        return r.typeCheckConfig(t, n, u), n
                    }, l.prototype._getScrollTop = function() {
                        return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
                    }, l.prototype._getScrollHeight = function() {
                        return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
                    }, l.prototype._getOffsetHeight = function() {
                        return this._scrollElement === window ? window.innerHeight : this._scrollElement.offsetHeight
                    }, l.prototype._process = function() {
                        var e = this._getScrollTop() + this._config.offset,
                            t = this._getScrollHeight(),
                            n = this._config.offset + t - this._getOffsetHeight();
                        if (this._scrollHeight !== t && this.refresh(), e >= n) {
                            var i = this._targets[this._targets.length - 1];
                            this._activeTarget !== i && this._activate(i)
                        } else {
                            if (this._activeTarget && e < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, void this._clear();
                            for (var o = this._offsets.length; o--;) this._activeTarget !== this._targets[o] && e >= this._offsets[o] && (void 0 === this._offsets[o + 1] || e < this._offsets[o + 1]) && this._activate(this._targets[o])
                        }
                    }, l.prototype._activate = function(t) {
                        this._activeTarget = t, this._clear();
                        var n = this._selector.split(",");
                        n = n.map(function(e) {
                            return e + '[data-target="' + t + '"],' + e + '[href="' + t + '"]'
                        });
                        var i = e(n.join(","));
                        i.hasClass(f.DROPDOWN_ITEM) ? (i.closest(h.DROPDOWN).find(h.DROPDOWN_TOGGLE).addClass(f.ACTIVE), i.addClass(f.ACTIVE)) : i.parents(h.LI).find("> " + h.NAV_LINKS).addClass(f.ACTIVE), e(this._scrollElement).trigger(d.ACTIVATE, {
                            relatedTarget: t
                        })
                    }, l.prototype._clear = function() {
                        e(this._selector).filter(h.ACTIVE).removeClass(f.ACTIVE)
                    }, l._jQueryInterface = function(t) {
                        return this.each(function() {
                            var n = e(this).data(s),
                                o = "object" === (void 0 === t ? "undefined" : i(t)) && t;
                            if (n || (n = new l(this, o), e(this).data(s, n)), "string" == typeof t) {
                                if (void 0 === n[t]) throw new Error('No method named "' + t + '"');
                                n[t]()
                            }
                        })
                    }, o(l, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }, {
                        key: "Default",
                        get: function() {
                            return c
                        }
                    }]), l
                }();
            e(window).on(d.LOAD_DATA_API, function() {
                for (var t = e.makeArray(e(h.DATA_SPY)), n = t.length; n--;) {
                    var i = e(t[n]);
                    g._jQueryInterface.call(i, i.data())
                }
            }), e.fn[t] = g._jQueryInterface, e.fn[t].Constructor = g, e.fn[t].noConflict = function() {
                return e.fn[t] = l, g._jQueryInterface
            }
        }(jQuery), function(e) {
            var t = "tab",
                i = "bs.tab",
                s = "." + i,
                a = e.fn[t],
                l = {
                    HIDE: "hide" + s,
                    HIDDEN: "hidden" + s,
                    SHOW: "show" + s,
                    SHOWN: "shown" + s,
                    CLICK_DATA_API: "click" + s + ".data-api"
                },
                c = {
                    DROPDOWN_MENU: "dropdown-menu",
                    ACTIVE: "active",
                    DISABLED: "disabled",
                    FADE: "fade",
                    SHOW: "show"
                },
                u = {
                    A: "a",
                    LI: "li",
                    DROPDOWN: ".dropdown",
                    LIST: "ul:not(.dropdown-menu), ol:not(.dropdown-menu), nav:not(.dropdown-menu)",
                    FADE_CHILD: "> .nav-item .fade, > .fade",
                    ACTIVE: ".active",
                    ACTIVE_CHILD: "> .nav-item > .active, > .active",
                    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"]',
                    DROPDOWN_TOGGLE: ".dropdown-toggle",
                    DROPDOWN_ACTIVE_CHILD: "> .dropdown-menu .active"
                },
                d = function() {
                    function t(e) {
                        n(this, t), this._element = e
                    }
                    return t.prototype.show = function() {
                        var t = this;
                        if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && e(this._element).hasClass(c.ACTIVE) || e(this._element).hasClass(c.DISABLED))) {
                            var n = void 0,
                                i = void 0,
                                o = e(this._element).closest(u.LIST)[0],
                                s = r.getSelectorFromElement(this._element);
                            o && (i = e.makeArray(e(o).find(u.ACTIVE)), i = i[i.length - 1]);
                            var a = e.Event(l.HIDE, {
                                    relatedTarget: this._element
                                }),
                                d = e.Event(l.SHOW, {
                                    relatedTarget: i
                                });
                            if (i && e(i).trigger(a), e(this._element).trigger(d), !d.isDefaultPrevented() && !a.isDefaultPrevented()) {
                                s && (n = e(s)[0]), this._activate(this._element, o);
                                var f = function() {
                                    var n = e.Event(l.HIDDEN, {
                                            relatedTarget: t._element
                                        }),
                                        o = e.Event(l.SHOWN, {
                                            relatedTarget: i
                                        });
                                    e(i).trigger(n), e(t._element).trigger(o)
                                };
                                n ? this._activate(n, n.parentNode, f) : f()
                            }
                        }
                    }, t.prototype.dispose = function() {
                        e.removeClass(this._element, i), this._element = null
                    }, t.prototype._activate = function(t, n, i) {
                        var o = this,
                            s = e(n).find(u.ACTIVE_CHILD)[0],
                            a = i && r.supportsTransitionEnd() && (s && e(s).hasClass(c.FADE) || Boolean(e(n).find(u.FADE_CHILD)[0])),
                            l = function() {
                                return o._transitionComplete(t, s, a, i)
                            };
                        s && a ? e(s).one(r.TRANSITION_END, l).emulateTransitionEnd(150) : l(), s && e(s).removeClass(c.SHOW)
                    }, t.prototype._transitionComplete = function(t, n, i, o) {
                        if (n) {
                            e(n).removeClass(c.ACTIVE);
                            var s = e(n.parentNode).find(u.DROPDOWN_ACTIVE_CHILD)[0];
                            s && e(s).removeClass(c.ACTIVE), n.setAttribute("aria-expanded", !1)
                        }
                        if (e(t).addClass(c.ACTIVE), t.setAttribute("aria-expanded", !0), i ? (r.reflow(t), e(t).addClass(c.SHOW)) : e(t).removeClass(c.FADE), t.parentNode && e(t.parentNode).hasClass(c.DROPDOWN_MENU)) {
                            var a = e(t).closest(u.DROPDOWN)[0];
                            a && e(a).find(u.DROPDOWN_TOGGLE).addClass(c.ACTIVE), t.setAttribute("aria-expanded", !0)
                        }
                        o && o()
                    }, t._jQueryInterface = function(n) {
                        return this.each(function() {
                            var o = e(this),
                                r = o.data(i);
                            if (r || (r = new t(this), o.data(i, r)), "string" == typeof n) {
                                if (void 0 === r[n]) throw new Error('No method named "' + n + '"');
                                r[n]()
                            }
                        })
                    }, o(t, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }]), t
                }();
            e(document).on(l.CLICK_DATA_API, u.DATA_TOGGLE, function(t) {
                t.preventDefault(), d._jQueryInterface.call(e(this), "show")
            }), e.fn[t] = d._jQueryInterface, e.fn[t].Constructor = d, e.fn[t].noConflict = function() {
                return e.fn[t] = a, d._jQueryInterface
            }
        }(jQuery), function(e) {
            if ("undefined" == typeof Tether) throw new Error("Bootstrap tooltips require Tether (http://tether.io/)");
            var t = "tooltip",
                s = "bs.tooltip",
                a = "." + s,
                l = e.fn[t],
                c = {
                    animation: !0,
                    template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>',
                    trigger: "hover focus",
                    title: "",
                    delay: 0,
                    html: !1,
                    selector: !1,
                    placement: "top",
                    offset: "0 0",
                    constraints: [],
                    container: !1
                },
                u = {
                    animation: "boolean",
                    template: "string",
                    title: "(string|element|function)",
                    trigger: "string",
                    delay: "(number|object)",
                    html: "boolean",
                    selector: "(string|boolean)",
                    placement: "(string|function)",
                    offset: "string",
                    constraints: "array",
                    container: "(string|element|boolean)"
                },
                d = {
                    TOP: "bottom center",
                    RIGHT: "middle left",
                    BOTTOM: "top center",
                    LEFT: "middle right"
                },
                f = {
                    SHOW: "show",
                    OUT: "out"
                },
                h = {
                    HIDE: "hide" + a,
                    HIDDEN: "hidden" + a,
                    SHOW: "show" + a,
                    SHOWN: "shown" + a,
                    INSERTED: "inserted" + a,
                    CLICK: "click" + a,
                    FOCUSIN: "focusin" + a,
                    FOCUSOUT: "focusout" + a,
                    MOUSEENTER: "mouseenter" + a,
                    MOUSELEAVE: "mouseleave" + a
                },
                p = {
                    FADE: "fade",
                    SHOW: "show"
                },
                g = {
                    TOOLTIP: ".tooltip",
                    TOOLTIP_INNER: ".tooltip-inner"
                },
                m = {
                    element: !1,
                    enabled: !1
                },
                v = {
                    HOVER: "hover",
                    FOCUS: "focus",
                    CLICK: "click",
                    MANUAL: "manual"
                },
                y = function() {
                    function l(e, t) {
                        n(this, l), this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._isTransitioning = !1, this._tether = null, this.element = e, this.config = this._getConfig(t), this.tip = null, this._setListeners()
                    }
                    return l.prototype.enable = function() {
                        this._isEnabled = !0
                    }, l.prototype.disable = function() {
                        this._isEnabled = !1
                    }, l.prototype.toggleEnabled = function() {
                        this._isEnabled = !this._isEnabled
                    }, l.prototype.toggle = function(t) {
                        if (t) {
                            var n = this.constructor.DATA_KEY,
                                i = e(t.currentTarget).data(n);
                            i || (i = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(n, i)), i._activeTrigger.click = !i._activeTrigger.click, i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i)
                        } else {
                            if (e(this.getTipElement()).hasClass(p.SHOW)) return void this._leave(null, this);
                            this._enter(null, this)
                        }
                    }, l.prototype.dispose = function() {
                        clearTimeout(this._timeout), this.cleanupTether(), e.removeData(this.element, this.constructor.DATA_KEY), e(this.element).off(this.constructor.EVENT_KEY), e(this.element).closest(".modal").off("hide.bs.modal"), this.tip && e(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._tether = null, this.element = null, this.config = null, this.tip = null
                    }, l.prototype.show = function() {
                        var t = this;
                        if ("none" === e(this.element).css("display")) throw new Error("Please use show on visible elements");
                        var n = e.Event(this.constructor.Event.SHOW);
                        if (this.isWithContent() && this._isEnabled) {
                            if (this._isTransitioning) throw new Error("Tooltip is transitioning");
                            e(this.element).trigger(n);
                            var i = e.contains(this.element.ownerDocument.documentElement, this.element);
                            if (n.isDefaultPrevented() || !i) return;
                            var o = this.getTipElement(),
                                s = r.getUID(this.constructor.NAME);
                            o.setAttribute("id", s), this.element.setAttribute("aria-describedby", s), this.setContent(), this.config.animation && e(o).addClass(p.FADE);
                            var a = "function" == typeof this.config.placement ? this.config.placement.call(this, o, this.element) : this.config.placement,
                                c = this._getAttachment(a),
                                u = !1 === this.config.container ? document.body : e(this.config.container);
                            e(o).data(this.constructor.DATA_KEY, this).appendTo(u), e(this.element).trigger(this.constructor.Event.INSERTED), this._tether = new Tether({
                                attachment: c,
                                element: o,
                                target: this.element,
                                classes: m,
                                classPrefix: "bs-tether",
                                offset: this.config.offset,
                                constraints: this.config.constraints,
                                addTargetClasses: !1
                            }), r.reflow(o), this._tether.position(), e(o).addClass(p.SHOW);
                            var d = function() {
                                var n = t._hoverState;
                                t._hoverState = null, t._isTransitioning = !1, e(t.element).trigger(t.constructor.Event.SHOWN), n === f.OUT && t._leave(null, t)
                            };
                            if (r.supportsTransitionEnd() && e(this.tip).hasClass(p.FADE)) return this._isTransitioning = !0, void e(this.tip).one(r.TRANSITION_END, d).emulateTransitionEnd(l._TRANSITION_DURATION);
                            d()
                        }
                    }, l.prototype.hide = function(t) {
                        var n = this,
                            i = this.getTipElement(),
                            o = e.Event(this.constructor.Event.HIDE);
                        if (this._isTransitioning) throw new Error("Tooltip is transitioning");
                        var s = function() {
                            n._hoverState !== f.SHOW && i.parentNode && i.parentNode.removeChild(i), n.element.removeAttribute("aria-describedby"), e(n.element).trigger(n.constructor.Event.HIDDEN), n._isTransitioning = !1, n.cleanupTether(), t && t()
                        };
                        e(this.element).trigger(o), o.isDefaultPrevented() || (e(i).removeClass(p.SHOW), this._activeTrigger[v.CLICK] = !1, this._activeTrigger[v.FOCUS] = !1, this._activeTrigger[v.HOVER] = !1, r.supportsTransitionEnd() && e(this.tip).hasClass(p.FADE) ? (this._isTransitioning = !0, e(i).one(r.TRANSITION_END, s).emulateTransitionEnd(150)) : s(), this._hoverState = "")
                    }, l.prototype.isWithContent = function() {
                        return Boolean(this.getTitle())
                    }, l.prototype.getTipElement = function() {
                        return this.tip = this.tip || e(this.config.template)[0]
                    }, l.prototype.setContent = function() {
                        var t = e(this.getTipElement());
                        this.setElementContent(t.find(g.TOOLTIP_INNER), this.getTitle()), t.removeClass(p.FADE + " " + p.SHOW), this.cleanupTether()
                    }, l.prototype.setElementContent = function(t, n) {
                        var o = this.config.html;
                        "object" === (void 0 === n ? "undefined" : i(n)) && (n.nodeType || n.jquery) ? o ? e(n).parent().is(t) || t.empty().append(n) : t.text(e(n).text()): t[o ? "html" : "text"](n)
                    }, l.prototype.getTitle = function() {
                        var e = this.element.getAttribute("data-original-title");
                        return e || (e = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), e
                    }, l.prototype.cleanupTether = function() {
                        this._tether && this._tether.destroy()
                    }, l.prototype._getAttachment = function(e) {
                        return d[e.toUpperCase()]
                    }, l.prototype._setListeners = function() {
                        var t = this;
                        this.config.trigger.split(" ").forEach(function(n) {
                            if ("click" === n) e(t.element).on(t.constructor.Event.CLICK, t.config.selector, function(e) {
                                return t.toggle(e)
                            });
                            else if (n !== v.MANUAL) {
                                var i = n === v.HOVER ? t.constructor.Event.MOUSEENTER : t.constructor.Event.FOCUSIN,
                                    o = n === v.HOVER ? t.constructor.Event.MOUSELEAVE : t.constructor.Event.FOCUSOUT;
                                e(t.element).on(i, t.config.selector, function(e) {
                                    return t._enter(e)
                                }).on(o, t.config.selector, function(e) {
                                    return t._leave(e)
                                })
                            }
                            e(t.element).closest(".modal").on("hide.bs.modal", function() {
                                return t.hide()
                            })
                        }), this.config.selector ? this.config = e.extend({}, this.config, {
                            trigger: "manual",
                            selector: ""
                        }) : this._fixTitle()
                    }, l.prototype._fixTitle = function() {
                        var e = i(this.element.getAttribute("data-original-title"));
                        (this.element.getAttribute("title") || "string" !== e) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
                    }, l.prototype._enter = function(t, n) {
                        var i = this.constructor.DATA_KEY;
                        return (n = n || e(t.currentTarget).data(i)) || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(i, n)), t && (n._activeTrigger["focusin" === t.type ? v.FOCUS : v.HOVER] = !0), e(n.getTipElement()).hasClass(p.SHOW) || n._hoverState === f.SHOW ? void(n._hoverState = f.SHOW) : (clearTimeout(n._timeout), n._hoverState = f.SHOW, n.config.delay && n.config.delay.show ? void(n._timeout = setTimeout(function() {
                            n._hoverState === f.SHOW && n.show()
                        }, n.config.delay.show)) : void n.show())
                    }, l.prototype._leave = function(t, n) {
                        var i = this.constructor.DATA_KEY;
                        if ((n = n || e(t.currentTarget).data(i)) || (n = new this.constructor(t.currentTarget, this._getDelegateConfig()), e(t.currentTarget).data(i, n)), t && (n._activeTrigger["focusout" === t.type ? v.FOCUS : v.HOVER] = !1), !n._isWithActiveTrigger()) return clearTimeout(n._timeout), n._hoverState = f.OUT, n.config.delay && n.config.delay.hide ? void(n._timeout = setTimeout(function() {
                            n._hoverState === f.OUT && n.hide()
                        }, n.config.delay.hide)) : void n.hide()
                    }, l.prototype._isWithActiveTrigger = function() {
                        for (var e in this._activeTrigger)
                            if (this._activeTrigger[e]) return !0;
                        return !1
                    }, l.prototype._getConfig = function(n) {
                        return (n = e.extend({}, this.constructor.Default, e(this.element).data(), n)).delay && "number" == typeof n.delay && (n.delay = {
                            show: n.delay,
                            hide: n.delay
                        }), r.typeCheckConfig(t, n, this.constructor.DefaultType), n
                    }, l.prototype._getDelegateConfig = function() {
                        var e = {};
                        if (this.config)
                            for (var t in this.config) this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
                        return e
                    }, l._jQueryInterface = function(t) {
                        return this.each(function() {
                            var n = e(this).data(s),
                                o = "object" === (void 0 === t ? "undefined" : i(t)) && t;
                            if ((n || !/dispose|hide/.test(t)) && (n || (n = new l(this, o), e(this).data(s, n)), "string" == typeof t)) {
                                if (void 0 === n[t]) throw new Error('No method named "' + t + '"');
                                n[t]()
                            }
                        })
                    }, o(l, null, [{
                        key: "VERSION",
                        get: function() {
                            return "4.0.0-alpha.6"
                        }
                    }, {
                        key: "Default",
                        get: function() {
                            return c
                        }
                    }, {
                        key: "NAME",
                        get: function() {
                            return t
                        }
                    }, {
                        key: "DATA_KEY",
                        get: function() {
                            return s
                        }
                    }, {
                        key: "Event",
                        get: function() {
                            return h
                        }
                    }, {
                        key: "EVENT_KEY",
                        get: function() {
                            return a
                        }
                    }, {
                        key: "DefaultType",
                        get: function() {
                            return u
                        }
                    }]), l
                }();
            return e.fn[t] = y._jQueryInterface, e.fn[t].Constructor = y, e.fn[t].noConflict = function() {
                return e.fn[t] = l, y._jQueryInterface
            }, y
        }(jQuery));
    ! function(r) {
        var a = "popover",
            l = "bs.popover",
            c = "." + l,
            u = r.fn[a],
            d = r.extend({}, s.Default, {
                placement: "right",
                trigger: "click",
                content: "",
                template: '<div class="popover" role="tooltip"><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            }),
            f = r.extend({}, s.DefaultType, {
                content: "(string|element|function)"
            }),
            h = {
                FADE: "fade",
                SHOW: "show"
            },
            p = {
                TITLE: ".popover-title",
                CONTENT: ".popover-content"
            },
            g = {
                HIDE: "hide" + c,
                HIDDEN: "hidden" + c,
                SHOW: "show" + c,
                SHOWN: "shown" + c,
                INSERTED: "inserted" + c,
                CLICK: "click" + c,
                FOCUSIN: "focusin" + c,
                FOCUSOUT: "focusout" + c,
                MOUSEENTER: "mouseenter" + c,
                MOUSELEAVE: "mouseleave" + c
            },
            m = function(s) {
                function u() {
                    return n(this, u), e(this, s.apply(this, arguments))
                }
                return t(u, s), u.prototype.isWithContent = function() {
                    return this.getTitle() || this._getContent()
                }, u.prototype.getTipElement = function() {
                    return this.tip = this.tip || r(this.config.template)[0]
                }, u.prototype.setContent = function() {
                    var e = r(this.getTipElement());
                    this.setElementContent(e.find(p.TITLE), this.getTitle()), this.setElementContent(e.find(p.CONTENT), this._getContent()), e.removeClass(h.FADE + " " + h.SHOW), this.cleanupTether()
                }, u.prototype._getContent = function() {
                    return this.element.getAttribute("data-content") || ("function" == typeof this.config.content ? this.config.content.call(this.element) : this.config.content)
                }, u._jQueryInterface = function(e) {
                    return this.each(function() {
                        var t = r(this).data(l),
                            n = "object" === (void 0 === e ? "undefined" : i(e)) ? e : null;
                        if ((t || !/destroy|hide/.test(e)) && (t || (t = new u(this, n), r(this).data(l, t)), "string" == typeof e)) {
                            if (void 0 === t[e]) throw new Error('No method named "' + e + '"');
                            t[e]()
                        }
                    })
                }, o(u, null, [{
                    key: "VERSION",
                    get: function() {
                        return "4.0.0-alpha.6"
                    }
                }, {
                    key: "Default",
                    get: function() {
                        return d
                    }
                }, {
                    key: "NAME",
                    get: function() {
                        return a
                    }
                }, {
                    key: "DATA_KEY",
                    get: function() {
                        return l
                    }
                }, {
                    key: "Event",
                    get: function() {
                        return g
                    }
                }, {
                    key: "EVENT_KEY",
                    get: function() {
                        return c
                    }
                }, {
                    key: "DefaultType",
                    get: function() {
                        return f
                    }
                }]), u
            }(s);
        r.fn[a] = m._jQueryInterface, r.fn[a].Constructor = m, r.fn[a].noConflict = function() {
            return r.fn[a] = u, m._jQueryInterface
        }
    }(jQuery)
}(),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("jquery"), require("window")) : "function" == typeof define && define.amd ? define("isInViewport", ["jquery", "window"], t) : t(e.$, e.window)
}(this, function(e, t) {
    "use strict";

    function n(t) {
        var n = e("<div></div>").css({
            width: "100%"
        });
        t.append(n);
        var i = t.width() - n.width();
        return n.remove(), i
    }

    function i(o, r) {
        var s = o.getBoundingClientRect(),
            a = s.top,
            l = s.bottom,
            c = s.left,
            u = s.right,
            d = e.extend({
                tolerance: 0,
                viewport: t
            }, r),
            f = !1,
            h = d.viewport.jquery ? d.viewport : e(d.viewport);
        h.length || (console.warn("isInViewport: The viewport selector you have provided matches no element on page."), console.warn("isInViewport: Defaulting to viewport as window"), h = e(t));
        var p = h.height(),
            g = h.width(),
            m = h[0].toString();
        if (h[0] !== t && "[object Window]" !== m && "[object DOMWindow]" !== m) {
            var v = h[0].getBoundingClientRect();
            a -= v.top, l -= v.top, c -= v.left, u -= v.left, i.scrollBarWidth = i.scrollBarWidth || n(h), g -= i.scrollBarWidth
        }
        return d.tolerance = ~~Math.round(parseFloat(d.tolerance)), d.tolerance < 0 && (d.tolerance = p + d.tolerance), u <= 0 || c >= g ? f : f = d.tolerance ? a <= d.tolerance && l >= d.tolerance : l > 0 && a <= p
    }

    function o(t) {
        if (t) {
            var n = t.split(",");
            return 1 === n.length && isNaN(n[0]) && (n[1] = n[0], n[0] = void 0), {
                tolerance: n[0] ? n[0].trim() : void 0,
                viewport: n[1] ? e(n[1].trim()) : void 0
            }
        }
        return {}
    }
    e = "default" in e ? e.default : e, t = "default" in t ? t.default : t, e.extend(e.expr[":"], {
        "in-viewport": e.expr.createPseudo ? e.expr.createPseudo(function(e) {
            return function(t) {
                return i(t, o(e))
            }
        }) : function(e, t, n) {
            return i(e, o(n[3]))
        }
    }), e.fn.isInViewport = function(e) {
        return this.filter(function(t, n) {
            return i(n, e)
        })
    }, e.fn.run = function(t) {
        var n = this;
        if (1 === arguments.length && "function" == typeof t && (t = [t]), !(t instanceof Array)) throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");
        return t.forEach(function(t) {
            "function" != typeof t ? (console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"), console.warn("isInViewport: Ignoring non-function values in array and moving on")) : [].slice.call(n).forEach(function(n) {
                return t.call(e(n))
            })
        }), this
    }
}),
function(e, t) {
    "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.AOS = t() : e.AOS = t()
}(this, function() {
    return function(e) {
        function t(i) {
            if (n[i]) return n[i].exports;
            var o = n[i] = {
                exports: {},
                id: i,
                loaded: !1
            };
            return e[i].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
        }
        var n = {};
        return t.m = e, t.c = n, t.p = "dist/", t(0)
    }([function(e, t, n) {
        "use strict";

        function i(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }
        var o = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
                }
                return e
            },
            r = i((i(n(1)), n(5))),
            s = i(n(6)),
            a = i(n(7)),
            l = i(n(8)),
            c = i(n(9)),
            u = i(n(10)),
            d = i(n(13)),
            f = [],
            h = !1,
            p = document.all && !window.atob,
            g = {
                offset: 120,
                delay: 0,
                easing: "ease",
                duration: 400,
                disable: !1,
                once: !1,
                startEvent: "DOMContentLoaded"
            },
            m = function() {
                return !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0] && (h = !0), h ? (f = (0, u.default)(f, g), (0, c.default)(f, g.once), f) : void 0
            },
            v = function() {
                f = (0, d.default)(), m()
            },
            y = function() {
                f.forEach(function(e, t) {
                    e.node.removeAttribute("data-aos"), e.node.removeAttribute("data-aos-easing"), e.node.removeAttribute("data-aos-duration"), e.node.removeAttribute("data-aos-delay")
                })
            },
            b = function(e) {
                return !0 === e || "mobile" === e && l.default.mobile() || "phone" === e && l.default.phone() || "tablet" === e && l.default.tablet() || "function" == typeof e && !0 === e()
            };
        e.exports = {
            init: function(e) {
                return g = o(g, e), f = (0, d.default)(), b(g.disable) || p ? y() : (document.querySelector("body").setAttribute("data-aos-easing", g.easing), document.querySelector("body").setAttribute("data-aos-duration", g.duration), document.querySelector("body").setAttribute("data-aos-delay", g.delay), "DOMContentLoaded" === g.startEvent && ["complete", "interactive"].indexOf(document.readyState) > -1 ? m(!0) : document.addEventListener(g.startEvent, function() {
                    m(!0)
                }), window.addEventListener("resize", (0, s.default)(m, 50, !0)), window.addEventListener("orientationchange", (0, s.default)(m, 50, !0)), window.addEventListener("scroll", (0, r.default)(function() {
                    (0, c.default)(f, g.once)
                }, 99)), document.addEventListener("DOMNodeRemoved", function(e) {
                    var t = e.target;
                    t && 1 === t.nodeType && t.hasAttribute && t.hasAttribute("data-aos") && (0, s.default)(v, 50, !0)
                }), (0, a.default)("[data-aos]", v), f)
            },
            refresh: m,
            refreshHard: v
        }
    }, function(e, t) {}, , , , function(e, t, n) {
        "use strict";

        function i(e) {
            var t = void 0 === e ? "undefined" : o(e);
            return !!e && ("object" == t || "function" == t)
        }
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
            },
            r = n(6),
            s = "Expected a function";
        e.exports = function(e, t, n) {
            var o = !0,
                a = !0;
            if ("function" != typeof e) throw new TypeError(s);
            return i(n) && (o = "leading" in n ? !!n.leading : o, a = "trailing" in n ? !!n.trailing : a), r(e, t, {
                leading: o,
                maxWait: t,
                trailing: a
            })
        }
    }, function(e, t) {
        "use strict";

        function n(e) {
            var t = i(e) ? y.call(e) : "";
            return t == u || t == d
        }

        function i(e) {
            var t = void 0 === e ? "undefined" : a(e);
            return !!e && ("object" == t || "function" == t)
        }

        function o(e) {
            return !!e && "object" == (void 0 === e ? "undefined" : a(e))
        }

        function r(e) {
            return "symbol" == (void 0 === e ? "undefined" : a(e)) || o(e) && y.call(e) == f
        }

        function s(e) {
            if ("number" == typeof e) return e;
            if (r(e)) return c;
            if (i(e)) {
                var t = n(e.valueOf) ? e.valueOf() : e;
                e = i(t) ? t + "" : t
            }
            if ("string" != typeof e) return 0 === e ? e : +e;
            e = e.replace(h, "");
            var o = g.test(e);
            return o || m.test(e) ? v(e.slice(2), o ? 2 : 8) : p.test(e) ? c : +e
        }
        var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol ? "symbol" : typeof e
            },
            l = "Expected a function",
            c = NaN,
            u = "[object Function]",
            d = "[object GeneratorFunction]",
            f = "[object Symbol]",
            h = /^\s+|\s+$/g,
            p = /^[-+]0x[0-9a-f]+$/i,
            g = /^0b[01]+$/i,
            m = /^0o[0-7]+$/i,
            v = parseInt,
            y = Object.prototype.toString,
            b = Math.max,
            w = Math.min,
            T = Date.now;
        e.exports = function(e, t, n) {
            function o(t) {
                var n = h,
                    i = p;
                return h = p = void 0, C = t, m = e.apply(i, n)
            }

            function r(e) {
                return C = e, v = setTimeout(u, t), _ ? o(e) : m
            }

            function a(e) {
                var n = e - C,
                    i = t - (e - y);
                return E ? w(i, g - n) : i
            }

            function c(e) {
                var n = e - y,
                    i = e - C;
                return !y || n >= t || 0 > n || E && i >= g
            }

            function u() {
                var e = T();
                return c(e) ? d(e) : void(v = setTimeout(u, a(e)))
            }

            function d(e) {
                return clearTimeout(v), v = void 0, S && h ? o(e) : (h = p = void 0, m)
            }

            function f() {
                var e = T(),
                    n = c(e);
                if (h = arguments, p = this, y = e, n) {
                    if (void 0 === v) return r(y);
                    if (E) return clearTimeout(v), v = setTimeout(u, t), o(y)
                }
                return void 0 === v && (v = setTimeout(u, t)), m
            }
            var h, p, g, m, v, y = 0,
                C = 0,
                _ = !1,
                E = !1,
                S = !0;
            if ("function" != typeof e) throw new TypeError(l);
            return t = s(t) || 0, i(n) && (_ = !!n.leading, E = "maxWait" in n, g = E ? b(s(n.maxWait) || 0, t) : g, S = "trailing" in n ? !!n.trailing : S), f.cancel = function() {
                void 0 !== v && clearTimeout(v), y = C = 0, h = p = v = void 0
            }, f.flush = function() {
                return void 0 === v ? m : d(T())
            }, f
        }
    }, function(e, t) {
        "use strict";

        function n() {
            for (var e, t, n = 0, o = r.length; o > n; n++) {
                e = r[n];
                for (var s, a = 0, l = (t = i.querySelectorAll(e.selector)).length; l > a; a++)(s = t[a]).ready || (s.ready = !0, e.fn.call(s, s))
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = window.document,
            o = window.MutationObserver || window.WebKitMutationObserver,
            r = [],
            s = void 0;
        t.default = function(e, t) {
            r.push({
                selector: e,
                fn: t
            }), !s && o && (s = new o(n)).observe(i.documentElement, {
                childList: !0,
                subtree: !0,
                removedNodes: !0
            }), n()
        }
    }, function(e, t) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function() {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var i = t[n];
                        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
                    }
                }
                return function(t, n, i) {
                    return n && e(t.prototype, n), i && e(t, i), t
                }
            }(),
            o = function() {
                function e() {
                    n(this, e)
                }
                return i(e, [{
                    key: "phone",
                    value: function() {
                        var e = !1;
                        return function(t) {
                            (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
                        }(navigator.userAgent || navigator.vendor || window.opera), e
                    }
                }, {
                    key: "mobile",
                    value: function() {
                        var e = !1;
                        return function(t) {
                            (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(t) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0, 4))) && (e = !0)
                        }(navigator.userAgent || navigator.vendor || window.opera), e
                    }
                }, {
                    key: "tablet",
                    value: function() {
                        return this.mobile() && !this.phone()
                    }
                }]), e
            }();
        t.default = new o
    }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var n = function(e, t, n) {
            var i = e.node.getAttribute("data-aos-once");
            t > e.position ? e.node.classList.add("aos-animate") : void 0 !== i && ("false" === i || !n && "true" !== i) && e.node.classList.remove("aos-animate")
        };
        t.default = function(e, t) {
            var i = window.pageYOffset,
                o = window.innerHeight;
            e.forEach(function(e, r) {
                n(e, o + i, t)
            })
        }
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(n(11));
        t.default = function(e, t) {
            return e.forEach(function(e, n) {
                e.node.classList.add("aos-init"), e.position = (0, i.default)(e.node, t.offset)
            }), e
        }
    }, function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = function(e) {
            return e && e.__esModule ? e : {
                default: e
            }
        }(n(12));
        t.default = function(e, t) {
            var n = 0,
                o = 0,
                r = window.innerHeight,
                s = {
                    offset: e.getAttribute("data-aos-offset"),
                    anchor: e.getAttribute("data-aos-anchor"),
                    anchorPlacement: e.getAttribute("data-aos-anchor-placement")
                };
            switch (s.offset && !isNaN(s.offset) && (o = parseInt(s.offset)), s.anchor && document.querySelectorAll(s.anchor) && (e = document.querySelectorAll(s.anchor)[0]), n = (0, i.default)(e).top, s.anchorPlacement) {
                case "top-bottom":
                    break;
                case "center-bottom":
                    n += e.offsetHeight / 2;
                    break;
                case "bottom-bottom":
                    n += e.offsetHeight;
                    break;
                case "top-center":
                    n += r / 2;
                    break;
                case "bottom-center":
                    n += r / 2 + e.offsetHeight;
                    break;
                case "center-center":
                    n += r / 2 + e.offsetHeight / 2;
                    break;
                case "top-top":
                    n += r;
                    break;
                case "bottom-top":
                    n += e.offsetHeight + r;
                    break;
                case "center-top":
                    n += e.offsetHeight / 2 + r
            }
            return s.anchorPlacement || s.offset || isNaN(t) || (o = t), n + o
        }
    }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        t.default = function(e) {
            for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) t += e.offsetLeft - ("BODY" != e.tagName ? e.scrollLeft : 0), n += e.offsetTop - ("BODY" != e.tagName ? e.scrollTop : 0), e = e.offsetParent;
            return {
                top: n,
                left: t
            }
        }
    }, function(e, t) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        t.default = function(e) {
            e = e || document.querySelectorAll("[data-aos]");
            var t = [];
            return [].forEach.call(e, function(e, n) {
                t.push({
                    node: e
                })
            }), t
        }
    }])
}),
function(e) {
    e.fn.countdown = function(t, n) {
        function i() {
            eventDate = Date.parse(o.date) / 1e3, currentDate = Math.floor(e.now() / 1e3), eventDate <= currentDate && (n.call(this), clearInterval(interval)), seconds = eventDate - currentDate, days = Math.floor(seconds / 86400), seconds -= 60 * days * 60 * 24, hours = Math.floor(seconds / 3600), seconds -= 60 * hours * 60, minutes = Math.floor(seconds / 60), seconds -= 60 * minutes, 1 == days ? thisEl.find(".timeRefDays").text("day") : thisEl.find(".timeRefDays").text("days"), 1 == hours ? thisEl.find(".timeRefHours").text("hour") : thisEl.find(".timeRefHours").text("hours"), 1 == minutes ? thisEl.find(".timeRefMinutes").text("minute") : thisEl.find(".timeRefMinutes").text("minutes"), 1 == seconds ? thisEl.find(".timeRefSeconds").text("second") : thisEl.find(".timeRefSeconds").text("seconds"), "on" == o.format && (days = String(days).length >= 2 ? days : "0" + days, hours = String(hours).length >= 2 ? hours : "0" + hours, minutes = String(minutes).length >= 2 ? minutes : "0" + minutes, seconds = String(seconds).length >= 2 ? seconds : "0" + seconds), isNaN(eventDate) ? (alert("Invalid date. Here's an example: 12 Tuesday 2016 17:30:00"), clearInterval(interval)) : (thisEl.find(".days").text(days), thisEl.find(".hours").text(hours), thisEl.find(".minutes").text(minutes), thisEl.find(".seconds").text(seconds))
        }
        thisEl = e(this);
        var o = {
            date: null,
            format: null
        };
        t && e.extend(o, t), i(), interval = setInterval(i, 1e3)
    }
}(jQuery),
function(e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "undefined" != typeof exports ? module.exports = e(require("jquery")) : e(jQuery)
}(function(e) {
    "use strict";
    var t = window.Slick || {};
    (t = function() {
        var t = 0;
        return function(n, i) {
            var o, r = this;
            r.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: e(n),
                appendDots: e(n),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3e3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(t, n) {
                    return e('<button type="button" />').text(n + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1e3
            }, r.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            }, e.extend(r, r.initials), r.activeBreakpoint = null, r.animType = null, r.animProp = null, r.breakpoints = [], r.breakpointSettings = [], r.cssTransitions = !1, r.focussed = !1, r.interrupted = !1, r.hidden = "hidden", r.paused = !0, r.positionProp = null, r.respondTo = null, r.rowCount = 1, r.shouldClick = !0, r.$slider = e(n), r.$slidesCache = null, r.transformType = null, r.transitionType = null, r.visibilityChange = "visibilitychange", r.windowWidth = 0, r.windowTimer = null, o = e(n).data("slick") || {}, r.options = e.extend({}, r.defaults, i, o), r.currentSlide = r.options.initialSlide, r.originalSettings = r.options, void 0 !== document.mozHidden ? (r.hidden = "mozHidden", r.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (r.hidden = "webkitHidden", r.visibilityChange = "webkitvisibilitychange"), r.autoPlay = e.proxy(r.autoPlay, r), r.autoPlayClear = e.proxy(r.autoPlayClear, r), r.autoPlayIterator = e.proxy(r.autoPlayIterator, r), r.changeSlide = e.proxy(r.changeSlide, r), r.clickHandler = e.proxy(r.clickHandler, r), r.selectHandler = e.proxy(r.selectHandler, r), r.setPosition = e.proxy(r.setPosition, r), r.swipeHandler = e.proxy(r.swipeHandler, r), r.dragHandler = e.proxy(r.dragHandler, r), r.keyHandler = e.proxy(r.keyHandler, r), r.instanceUid = t++, r.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, r.registerBreakpoints(), r.init(!0)
        }
    }()).prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }, t.prototype.addSlide = t.prototype.slickAdd = function(t, n, i) {
        var o = this;
        if ("boolean" == typeof n) i = n, n = null;
        else if (n < 0 || n >= o.slideCount) return !1;
        o.unload(), "number" == typeof n ? 0 === n && 0 === o.$slides.length ? e(t).appendTo(o.$slideTrack) : i ? e(t).insertBefore(o.$slides.eq(n)) : e(t).insertAfter(o.$slides.eq(n)) : !0 === i ? e(t).prependTo(o.$slideTrack) : e(t).appendTo(o.$slideTrack), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slides.each(function(t, n) {
            e(n).attr("data-slick-index", t)
        }), o.$slidesCache = o.$slides, o.reinit()
    }, t.prototype.animateHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.animate({
                height: t
            }, e.options.speed)
        }
    }, t.prototype.animateSlide = function(t, n) {
        var i = {},
            o = this;
        o.animateHeight(), !0 === o.options.rtl && !1 === o.options.vertical && (t = -t), !1 === o.transformsEnabled ? !1 === o.options.vertical ? o.$slideTrack.animate({
            left: t
        }, o.options.speed, o.options.easing, n) : o.$slideTrack.animate({
            top: t
        }, o.options.speed, o.options.easing, n) : !1 === o.cssTransitions ? (!0 === o.options.rtl && (o.currentLeft = -o.currentLeft), e({
            animStart: o.currentLeft
        }).animate({
            animStart: t
        }, {
            duration: o.options.speed,
            easing: o.options.easing,
            step: function(e) {
                e = Math.ceil(e), !1 === o.options.vertical ? (i[o.animType] = "translate(" + e + "px, 0px)", o.$slideTrack.css(i)) : (i[o.animType] = "translate(0px," + e + "px)", o.$slideTrack.css(i))
            },
            complete: function() {
                n && n.call()
            }
        })) : (o.applyTransition(), t = Math.ceil(t), !1 === o.options.vertical ? i[o.animType] = "translate3d(" + t + "px, 0px, 0px)" : i[o.animType] = "translate3d(0px," + t + "px, 0px)", o.$slideTrack.css(i), n && setTimeout(function() {
            o.disableTransition(), n.call()
        }, o.options.speed))
    }, t.prototype.getNavTarget = function() {
        var t = this,
            n = t.options.asNavFor;
        return n && null !== n && (n = e(n).not(t.$slider)), n
    }, t.prototype.asNavFor = function(t) {
        var n = this.getNavTarget();
        null !== n && "object" == typeof n && n.each(function() {
            var n = e(this).slick("getSlick");
            n.unslicked || n.slideHandler(t, !0)
        })
    }, t.prototype.applyTransition = function(e) {
        var t = this,
            n = {};
        !1 === t.options.fade ? n[t.transitionType] = t.transformType + " " + t.options.speed + "ms " + t.options.cssEase : n[t.transitionType] = "opacity " + t.options.speed + "ms " + t.options.cssEase, !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
    }, t.prototype.autoPlay = function() {
        var e = this;
        e.autoPlayClear(), e.slideCount > e.options.slidesToShow && (e.autoPlayTimer = setInterval(e.autoPlayIterator, e.options.autoplaySpeed))
    }, t.prototype.autoPlayClear = function() {
        var e = this;
        e.autoPlayTimer && clearInterval(e.autoPlayTimer)
    }, t.prototype.autoPlayIterator = function() {
        var e = this,
            t = e.currentSlide + e.options.slidesToScroll;
        e.paused || e.interrupted || e.focussed || (!1 === e.options.infinite && (1 === e.direction && e.currentSlide + 1 === e.slideCount - 1 ? e.direction = 0 : 0 === e.direction && (t = e.currentSlide - e.options.slidesToScroll, e.currentSlide - 1 == 0 && (e.direction = 1))), e.slideHandler(t))
    }, t.prototype.buildArrows = function() {
        var t = this;
        !0 === t.options.arrows && (t.$prevArrow = e(t.options.prevArrow).addClass("slick-arrow"), t.$nextArrow = e(t.options.nextArrow).addClass("slick-arrow"), t.slideCount > t.options.slidesToShow ? (t.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.prependTo(t.options.appendArrows), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.appendTo(t.options.appendArrows), !0 !== t.options.infinite && t.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : t.$prevArrow.add(t.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }, t.prototype.buildDots = function() {
        var t, n, i = this;
        if (!0 === i.options.dots) {
            for (i.$slider.addClass("slick-dotted"), n = e("<ul />").addClass(i.options.dotsClass), t = 0; t <= i.getDotCount(); t += 1) n.append(e("<li />").append(i.options.customPaging.call(this, i, t)));
            i.$dots = n.appendTo(i.options.appendDots), i.$dots.find("li").first().addClass("slick-active")
        }
    }, t.prototype.buildOut = function() {
        var t = this;
        t.$slides = t.$slider.children(t.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), t.slideCount = t.$slides.length, t.$slides.each(function(t, n) {
            e(n).attr("data-slick-index", t).data("originalStyling", e(n).attr("style") || "")
        }), t.$slider.addClass("slick-slider"), t.$slideTrack = 0 === t.slideCount ? e('<div class="slick-track"/>').appendTo(t.$slider) : t.$slides.wrapAll('<div class="slick-track"/>').parent(), t.$list = t.$slideTrack.wrap('<div class="slick-list"/>').parent(), t.$slideTrack.css("opacity", 0), !0 !== t.options.centerMode && !0 !== t.options.swipeToSlide || (t.options.slidesToScroll = 1), e("img[data-lazy]", t.$slider).not("[src]").addClass("slick-loading"), t.setupInfinite(), t.buildArrows(), t.buildDots(), t.updateDots(), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), !0 === t.options.draggable && t.$list.addClass("draggable")
    }, t.prototype.buildRows = function() {
        var e, t, n, i, o, r, s, a = this;
        if (i = document.createDocumentFragment(), r = a.$slider.children(), a.options.rows > 1) {
            for (s = a.options.slidesPerRow * a.options.rows, o = Math.ceil(r.length / s), e = 0; e < o; e++) {
                var l = document.createElement("div");
                for (t = 0; t < a.options.rows; t++) {
                    var c = document.createElement("div");
                    for (n = 0; n < a.options.slidesPerRow; n++) {
                        var u = e * s + (t * a.options.slidesPerRow + n);
                        r.get(u) && c.appendChild(r.get(u))
                    }
                    l.appendChild(c)
                }
                i.appendChild(l)
            }
            a.$slider.empty().append(i), a.$slider.children().children().children().css({
                width: 100 / a.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }, t.prototype.checkResponsive = function(t, n) {
        var i, o, r, s = this,
            a = !1,
            l = s.$slider.width(),
            c = window.innerWidth || e(window).width();
        if ("window" === s.respondTo ? r = c : "slider" === s.respondTo ? r = l : "min" === s.respondTo && (r = Math.min(c, l)), s.options.responsive && s.options.responsive.length && null !== s.options.responsive) {
            o = null;
            for (i in s.breakpoints) s.breakpoints.hasOwnProperty(i) && (!1 === s.originalSettings.mobileFirst ? r < s.breakpoints[i] && (o = s.breakpoints[i]) : r > s.breakpoints[i] && (o = s.breakpoints[i]));
            null !== o ? null !== s.activeBreakpoint ? (o !== s.activeBreakpoint || n) && (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : (s.activeBreakpoint = o, "unslick" === s.breakpointSettings[o] ? s.unslick(o) : (s.options = e.extend({}, s.originalSettings, s.breakpointSettings[o]), !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t)), a = o) : null !== s.activeBreakpoint && (s.activeBreakpoint = null, s.options = s.originalSettings, !0 === t && (s.currentSlide = s.options.initialSlide), s.refresh(t), a = o), t || !1 === a || s.$slider.trigger("breakpoint", [s, a])
        }
    }, t.prototype.changeSlide = function(t, n) {
        var i, o, r, s = this,
            a = e(t.currentTarget);
        switch (a.is("a") && t.preventDefault(), a.is("li") || (a = a.closest("li")), r = s.slideCount % s.options.slidesToScroll != 0, i = r ? 0 : (s.slideCount - s.currentSlide) % s.options.slidesToScroll, t.data.message) {
            case "previous":
                o = 0 === i ? s.options.slidesToScroll : s.options.slidesToShow - i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide - o, !1, n);
                break;
            case "next":
                o = 0 === i ? s.options.slidesToScroll : i, s.slideCount > s.options.slidesToShow && s.slideHandler(s.currentSlide + o, !1, n);
                break;
            case "index":
                var l = 0 === t.data.index ? 0 : t.data.index || a.index() * s.options.slidesToScroll;
                s.slideHandler(s.checkNavigable(l), !1, n), a.children().trigger("focus");
                break;
            default:
                return
        }
    }, t.prototype.checkNavigable = function(e) {
        var t, n;
        if (t = this.getNavigableIndexes(), n = 0, e > t[t.length - 1]) e = t[t.length - 1];
        else
            for (var i in t) {
                if (e < t[i]) {
                    e = n;
                    break
                }
                n = t[i]
            }
        return e
    }, t.prototype.cleanUpEvents = function() {
        var t = this;
        t.options.dots && null !== t.$dots && (e("li", t.$dots).off("click.slick", t.changeSlide).off("mouseenter.slick", e.proxy(t.interrupt, t, !0)).off("mouseleave.slick", e.proxy(t.interrupt, t, !1)), !0 === t.options.accessibility && t.$dots.off("keydown.slick", t.keyHandler)), t.$slider.off("focus.slick blur.slick"), !0 === t.options.arrows && t.slideCount > t.options.slidesToShow && (t.$prevArrow && t.$prevArrow.off("click.slick", t.changeSlide), t.$nextArrow && t.$nextArrow.off("click.slick", t.changeSlide), !0 === t.options.accessibility && (t.$prevArrow.off("keydown.slick", t.keyHandler), t.$nextArrow.off("keydown.slick", t.keyHandler))), t.$list.off("touchstart.slick mousedown.slick", t.swipeHandler), t.$list.off("touchmove.slick mousemove.slick", t.swipeHandler), t.$list.off("touchend.slick mouseup.slick", t.swipeHandler), t.$list.off("touchcancel.slick mouseleave.slick", t.swipeHandler), t.$list.off("click.slick", t.clickHandler), e(document).off(t.visibilityChange, t.visibility), t.cleanUpSlideEvents(), !0 === t.options.accessibility && t.$list.off("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().off("click.slick", t.selectHandler), e(window).off("orientationchange.slick.slick-" + t.instanceUid, t.orientationChange), e(window).off("resize.slick.slick-" + t.instanceUid, t.resize), e("[draggable!=true]", t.$slideTrack).off("dragstart", t.preventDefault), e(window).off("load.slick.slick-" + t.instanceUid, t.setPosition)
    }, t.prototype.cleanUpSlideEvents = function() {
        var t = this;
        t.$list.off("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.off("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }, t.prototype.cleanUpRows = function() {
        var e, t = this;
        t.options.rows > 1 && ((e = t.$slides.children().children()).removeAttr("style"), t.$slider.empty().append(e))
    }, t.prototype.clickHandler = function(e) {
        !1 === this.shouldClick && (e.stopImmediatePropagation(), e.stopPropagation(), e.preventDefault())
    }, t.prototype.destroy = function(t) {
        var n = this;
        n.autoPlayClear(), n.touchObject = {}, n.cleanUpEvents(), e(".slick-cloned", n.$slider).detach(), n.$dots && n.$dots.remove(), n.$prevArrow && n.$prevArrow.length && (n.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.prevArrow) && n.$prevArrow.remove()), n.$nextArrow && n.$nextArrow.length && (n.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), n.htmlExpr.test(n.options.nextArrow) && n.$nextArrow.remove()), n.$slides && (n.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            e(this).attr("style", e(this).data("originalStyling"))
        }), n.$slideTrack.children(this.options.slide).detach(), n.$slideTrack.detach(), n.$list.detach(), n.$slider.append(n.$slides)), n.cleanUpRows(), n.$slider.removeClass("slick-slider"), n.$slider.removeClass("slick-initialized"), n.$slider.removeClass("slick-dotted"), n.unslicked = !0, t || n.$slider.trigger("destroy", [n])
    }, t.prototype.disableTransition = function(e) {
        var t = this,
            n = {};
        n[t.transitionType] = "", !1 === t.options.fade ? t.$slideTrack.css(n) : t.$slides.eq(e).css(n)
    }, t.prototype.fadeSlide = function(e, t) {
        var n = this;
        !1 === n.cssTransitions ? (n.$slides.eq(e).css({
            zIndex: n.options.zIndex
        }), n.$slides.eq(e).animate({
            opacity: 1
        }, n.options.speed, n.options.easing, t)) : (n.applyTransition(e), n.$slides.eq(e).css({
            opacity: 1,
            zIndex: n.options.zIndex
        }), t && setTimeout(function() {
            n.disableTransition(e), t.call()
        }, n.options.speed))
    }, t.prototype.fadeSlideOut = function(e) {
        var t = this;
        !1 === t.cssTransitions ? t.$slides.eq(e).animate({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }, t.options.speed, t.options.easing) : (t.applyTransition(e), t.$slides.eq(e).css({
            opacity: 0,
            zIndex: t.options.zIndex - 2
        }))
    }, t.prototype.filterSlides = t.prototype.slickFilter = function(e) {
        var t = this;
        null !== e && (t.$slidesCache = t.$slides, t.unload(), t.$slideTrack.children(this.options.slide).detach(), t.$slidesCache.filter(e).appendTo(t.$slideTrack), t.reinit())
    }, t.prototype.focusHandler = function() {
        var t = this;
        t.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(n) {
            n.stopImmediatePropagation();
            var i = e(this);
            setTimeout(function() {
                t.options.pauseOnFocus && (t.focussed = i.is(":focus"), t.autoPlay())
            }, 0)
        })
    }, t.prototype.getCurrent = t.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }, t.prototype.getDotCount = function() {
        var e = this,
            t = 0,
            n = 0,
            i = 0;
        if (!0 === e.options.infinite)
            if (e.slideCount <= e.options.slidesToShow) ++i;
            else
                for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else if (!0 === e.options.centerMode) i = e.slideCount;
        else if (e.options.asNavFor)
            for (; t < e.slideCount;) ++i, t = n + e.options.slidesToScroll, n += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
        else i = 1 + Math.ceil((e.slideCount - e.options.slidesToShow) / e.options.slidesToScroll);
        return i - 1
    }, t.prototype.getLeft = function(e) {
        var t, n, i, o = this,
            r = 0;
        return o.slideOffset = 0, n = o.$slides.first().outerHeight(!0), !0 === o.options.infinite ? (o.slideCount > o.options.slidesToShow && (o.slideOffset = o.slideWidth * o.options.slidesToShow * -1, r = n * o.options.slidesToShow * -1), o.slideCount % o.options.slidesToScroll != 0 && e + o.options.slidesToScroll > o.slideCount && o.slideCount > o.options.slidesToShow && (e > o.slideCount ? (o.slideOffset = (o.options.slidesToShow - (e - o.slideCount)) * o.slideWidth * -1, r = (o.options.slidesToShow - (e - o.slideCount)) * n * -1) : (o.slideOffset = o.slideCount % o.options.slidesToScroll * o.slideWidth * -1, r = o.slideCount % o.options.slidesToScroll * n * -1))) : e + o.options.slidesToShow > o.slideCount && (o.slideOffset = (e + o.options.slidesToShow - o.slideCount) * o.slideWidth, r = (e + o.options.slidesToShow - o.slideCount) * n), o.slideCount <= o.options.slidesToShow && (o.slideOffset = 0, r = 0), !0 === o.options.centerMode && o.slideCount <= o.options.slidesToShow ? o.slideOffset = o.slideWidth * Math.floor(o.options.slidesToShow) / 2 - o.slideWidth * o.slideCount / 2 : !0 === o.options.centerMode && !0 === o.options.infinite ? o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2) - o.slideWidth : !0 === o.options.centerMode && (o.slideOffset = 0, o.slideOffset += o.slideWidth * Math.floor(o.options.slidesToShow / 2)), t = !1 === o.options.vertical ? e * o.slideWidth * -1 + o.slideOffset : e * n * -1 + r, !0 === o.options.variableWidth && (i = o.slideCount <= o.options.slidesToShow || !1 === o.options.infinite ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow), t = !0 === o.options.rtl ? i[0] ? -1 * (o.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, !0 === o.options.centerMode && (i = o.slideCount <= o.options.slidesToShow || !1 === o.options.infinite ? o.$slideTrack.children(".slick-slide").eq(e) : o.$slideTrack.children(".slick-slide").eq(e + o.options.slidesToShow + 1), t = !0 === o.options.rtl ? i[0] ? -1 * (o.$slideTrack.width() - i[0].offsetLeft - i.width()) : 0 : i[0] ? -1 * i[0].offsetLeft : 0, t += (o.$list.width() - i.outerWidth()) / 2)), t
    }, t.prototype.getOption = t.prototype.slickGetOption = function(e) {
        return this.options[e]
    }, t.prototype.getNavigableIndexes = function() {
        var e, t = this,
            n = 0,
            i = 0,
            o = [];
        for (!1 === t.options.infinite ? e = t.slideCount : (n = -1 * t.options.slidesToScroll, i = -1 * t.options.slidesToScroll, e = 2 * t.slideCount); n < e;) o.push(n), n = i + t.options.slidesToScroll, i += t.options.slidesToScroll <= t.options.slidesToShow ? t.options.slidesToScroll : t.options.slidesToShow;
        return o
    }, t.prototype.getSlick = function() {
        return this
    }, t.prototype.getSlideCount = function() {
        var t, n, i = this;
        return n = !0 === i.options.centerMode ? i.slideWidth * Math.floor(i.options.slidesToShow / 2) : 0, !0 === i.options.swipeToSlide ? (i.$slideTrack.find(".slick-slide").each(function(o, r) {
            if (r.offsetLeft - n + e(r).outerWidth() / 2 > -1 * i.swipeLeft) return t = r, !1
        }), Math.abs(e(t).attr("data-slick-index") - i.currentSlide) || 1) : i.options.slidesToScroll
    }, t.prototype.goTo = t.prototype.slickGoTo = function(e, t) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(e)
            }
        }, t)
    }, t.prototype.init = function(t) {
        var n = this;
        e(n.$slider).hasClass("slick-initialized") || (e(n.$slider).addClass("slick-initialized"), n.buildRows(), n.buildOut(), n.setProps(), n.startLoad(), n.loadSlider(), n.initializeEvents(), n.updateArrows(), n.updateDots(), n.checkResponsive(!0), n.focusHandler()), t && n.$slider.trigger("init", [n]), !0 === n.options.accessibility && n.initADA(), n.options.autoplay && (n.paused = !1, n.autoPlay())
    }, t.prototype.initADA = function() {
        var t = this,
            n = Math.ceil(t.slideCount / t.options.slidesToShow),
            i = t.getNavigableIndexes().filter(function(e) {
                return e >= 0 && e < t.slideCount
            });
        t.$slides.add(t.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        }), null !== t.$dots && (t.$slides.not(t.$slideTrack.find(".slick-cloned")).each(function(n) {
            var o = i.indexOf(n);
            e(this).attr({
                role: "tabpanel",
                id: "slick-slide" + t.instanceUid + n,
                tabindex: -1
            }), -1 !== o && e(this).attr({
                "aria-describedby": "slick-slide-control" + t.instanceUid + o
            })
        }), t.$dots.attr("role", "tablist").find("li").each(function(o) {
            var r = i[o];
            e(this).attr({
                role: "presentation"
            }), e(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + t.instanceUid + o,
                "aria-controls": "slick-slide" + t.instanceUid + r,
                "aria-label": o + 1 + " of " + n,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(t.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var o = t.currentSlide, r = o + t.options.slidesToShow; o < r; o++) t.$slides.eq(o).attr("tabindex", 0);
        t.activateADA()
    }, t.prototype.initArrowEvents = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, e.changeSlide), e.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow.on("keydown.slick", e.keyHandler), e.$nextArrow.on("keydown.slick", e.keyHandler)))
    }, t.prototype.initDotEvents = function() {
        var t = this;
        !0 === t.options.dots && (e("li", t.$dots).on("click.slick", {
            message: "index"
        }, t.changeSlide), !0 === t.options.accessibility && t.$dots.on("keydown.slick", t.keyHandler)), !0 === t.options.dots && !0 === t.options.pauseOnDotsHover && e("li", t.$dots).on("mouseenter.slick", e.proxy(t.interrupt, t, !0)).on("mouseleave.slick", e.proxy(t.interrupt, t, !1))
    }, t.prototype.initSlideEvents = function() {
        var t = this;
        t.options.pauseOnHover && (t.$list.on("mouseenter.slick", e.proxy(t.interrupt, t, !0)), t.$list.on("mouseleave.slick", e.proxy(t.interrupt, t, !1)))
    }, t.prototype.initializeEvents = function() {
        var t = this;
        t.initArrowEvents(), t.initDotEvents(), t.initSlideEvents(), t.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, t.swipeHandler), t.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, t.swipeHandler), t.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, t.swipeHandler), t.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, t.swipeHandler), t.$list.on("click.slick", t.clickHandler), e(document).on(t.visibilityChange, e.proxy(t.visibility, t)), !0 === t.options.accessibility && t.$list.on("keydown.slick", t.keyHandler), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), e(window).on("orientationchange.slick.slick-" + t.instanceUid, e.proxy(t.orientationChange, t)), e(window).on("resize.slick.slick-" + t.instanceUid, e.proxy(t.resize, t)), e("[draggable!=true]", t.$slideTrack).on("dragstart", t.preventDefault), e(window).on("load.slick.slick-" + t.instanceUid, t.setPosition), e(t.setPosition)
    }, t.prototype.initUI = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.show(), e.$nextArrow.show()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.show()
    }, t.prototype.keyHandler = function(e) {
        var t = this;
        e.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === e.keyCode && !0 === t.options.accessibility ? t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "next" : "previous"
            }
        }) : 39 === e.keyCode && !0 === t.options.accessibility && t.changeSlide({
            data: {
                message: !0 === t.options.rtl ? "previous" : "next"
            }
        }))
    }, t.prototype.lazyLoad = function() {
        function t(t) {
            e("img[data-lazy]", t).each(function() {
                var t = e(this),
                    n = e(this).attr("data-lazy"),
                    i = e(this).attr("data-srcset"),
                    o = e(this).attr("data-sizes") || r.$slider.attr("data-sizes"),
                    s = document.createElement("img");
                s.onload = function() {
                    t.animate({
                        opacity: 0
                    }, 100, function() {
                        i && (t.attr("srcset", i), o && t.attr("sizes", o)), t.attr("src", n).animate({
                            opacity: 1
                        }, 200, function() {
                            t.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        }), r.$slider.trigger("lazyLoaded", [r, t, n])
                    })
                }, s.onerror = function() {
                    t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), r.$slider.trigger("lazyLoadError", [r, t, n])
                }, s.src = n
            })
        }
        var n, i, o, r = this;
        if (!0 === r.options.centerMode ? !0 === r.options.infinite ? o = (i = r.currentSlide + (r.options.slidesToShow / 2 + 1)) + r.options.slidesToShow + 2 : (i = Math.max(0, r.currentSlide - (r.options.slidesToShow / 2 + 1)), o = r.options.slidesToShow / 2 + 1 + 2 + r.currentSlide) : (i = r.options.infinite ? r.options.slidesToShow + r.currentSlide : r.currentSlide, o = Math.ceil(i + r.options.slidesToShow), !0 === r.options.fade && (i > 0 && i--, o <= r.slideCount && o++)), n = r.$slider.find(".slick-slide").slice(i, o), "anticipated" === r.options.lazyLoad)
            for (var s = i - 1, a = o, l = r.$slider.find(".slick-slide"), c = 0; c < r.options.slidesToScroll; c++) s < 0 && (s = r.slideCount - 1), n = (n = n.add(l.eq(s))).add(l.eq(a)), s--, a++;
        t(n), r.slideCount <= r.options.slidesToShow ? t(r.$slider.find(".slick-slide")) : r.currentSlide >= r.slideCount - r.options.slidesToShow ? t(r.$slider.find(".slick-cloned").slice(0, r.options.slidesToShow)) : 0 === r.currentSlide && t(r.$slider.find(".slick-cloned").slice(-1 * r.options.slidesToShow))
    }, t.prototype.loadSlider = function() {
        var e = this;
        e.setPosition(), e.$slideTrack.css({
            opacity: 1
        }), e.$slider.removeClass("slick-loading"), e.initUI(), "progressive" === e.options.lazyLoad && e.progressiveLazyLoad()
    }, t.prototype.next = t.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }, t.prototype.orientationChange = function() {
        var e = this;
        e.checkResponsive(), e.setPosition()
    }, t.prototype.pause = t.prototype.slickPause = function() {
        var e = this;
        e.autoPlayClear(), e.paused = !0
    }, t.prototype.play = t.prototype.slickPlay = function() {
        var e = this;
        e.autoPlay(), e.options.autoplay = !0, e.paused = !1, e.focussed = !1, e.interrupted = !1
    }, t.prototype.postSlide = function(t) {
        var n = this;
        n.unslicked || (n.$slider.trigger("afterChange", [n, t]), n.animating = !1, n.slideCount > n.options.slidesToShow && n.setPosition(), n.swipeLeft = null, n.options.autoplay && n.autoPlay(), !0 === n.options.accessibility && (n.initADA(), n.options.autoplay || e(n.$slides.get(n.currentSlide)).attr("tabindex", 0).focus()))
    }, t.prototype.prev = t.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }, t.prototype.preventDefault = function(e) {
        e.preventDefault()
    }, t.prototype.progressiveLazyLoad = function(t) {
        t = t || 1;
        var n, i, o, r, s, a = this,
            l = e("img[data-lazy]", a.$slider);
        l.length ? (n = l.first(), i = n.attr("data-lazy"), o = n.attr("data-srcset"), r = n.attr("data-sizes") || a.$slider.attr("data-sizes"), (s = document.createElement("img")).onload = function() {
            o && (n.attr("srcset", o), r && n.attr("sizes", r)), n.attr("src", i).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === a.options.adaptiveHeight && a.setPosition(), a.$slider.trigger("lazyLoaded", [a, n, i]), a.progressiveLazyLoad()
        }, s.onerror = function() {
            t < 3 ? setTimeout(function() {
                a.progressiveLazyLoad(t + 1)
            }, 500) : (n.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), a.$slider.trigger("lazyLoadError", [a, n, i]), a.progressiveLazyLoad())
        }, s.src = i) : a.$slider.trigger("allImagesLoaded", [a])
    }, t.prototype.refresh = function(t) {
        var n, i, o = this;
        i = o.slideCount - o.options.slidesToShow, !o.options.infinite && o.currentSlide > i && (o.currentSlide = i), o.slideCount <= o.options.slidesToShow && (o.currentSlide = 0), n = o.currentSlide, o.destroy(!0), e.extend(o, o.initials, {
            currentSlide: n
        }), o.init(), t || o.changeSlide({
            data: {
                message: "index",
                index: n
            }
        }, !1)
    }, t.prototype.registerBreakpoints = function() {
        var t, n, i, o = this,
            r = o.options.responsive || null;
        if ("array" === e.type(r) && r.length) {
            o.respondTo = o.options.respondTo || "window";
            for (t in r)
                if (i = o.breakpoints.length - 1, r.hasOwnProperty(t)) {
                    for (n = r[t].breakpoint; i >= 0;) o.breakpoints[i] && o.breakpoints[i] === n && o.breakpoints.splice(i, 1), i--;
                    o.breakpoints.push(n), o.breakpointSettings[n] = r[t].settings
                }
            o.breakpoints.sort(function(e, t) {
                return o.options.mobileFirst ? e - t : t - e
            })
        }
    }, t.prototype.reinit = function() {
        var t = this;
        t.$slides = t.$slideTrack.children(t.options.slide).addClass("slick-slide"), t.slideCount = t.$slides.length, t.currentSlide >= t.slideCount && 0 !== t.currentSlide && (t.currentSlide = t.currentSlide - t.options.slidesToScroll), t.slideCount <= t.options.slidesToShow && (t.currentSlide = 0), t.registerBreakpoints(), t.setProps(), t.setupInfinite(), t.buildArrows(), t.updateArrows(), t.initArrowEvents(), t.buildDots(), t.updateDots(), t.initDotEvents(), t.cleanUpSlideEvents(), t.initSlideEvents(), t.checkResponsive(!1, !0), !0 === t.options.focusOnSelect && e(t.$slideTrack).children().on("click.slick", t.selectHandler), t.setSlideClasses("number" == typeof t.currentSlide ? t.currentSlide : 0), t.setPosition(), t.focusHandler(), t.paused = !t.options.autoplay, t.autoPlay(), t.$slider.trigger("reInit", [t])
    }, t.prototype.resize = function() {
        var t = this;
        e(window).width() !== t.windowWidth && (clearTimeout(t.windowDelay), t.windowDelay = window.setTimeout(function() {
            t.windowWidth = e(window).width(), t.checkResponsive(), t.unslicked || t.setPosition()
        }, 50))
    }, t.prototype.removeSlide = t.prototype.slickRemove = function(e, t, n) {
        var i = this;
        if (e = "boolean" == typeof e ? !0 === (t = e) ? 0 : i.slideCount - 1 : !0 === t ? --e : e, i.slideCount < 1 || e < 0 || e > i.slideCount - 1) return !1;
        i.unload(), !0 === n ? i.$slideTrack.children().remove() : i.$slideTrack.children(this.options.slide).eq(e).remove(), i.$slides = i.$slideTrack.children(this.options.slide), i.$slideTrack.children(this.options.slide).detach(), i.$slideTrack.append(i.$slides), i.$slidesCache = i.$slides, i.reinit()
    }, t.prototype.setCSS = function(e) {
        var t, n, i = this,
            o = {};
        !0 === i.options.rtl && (e = -e), t = "left" == i.positionProp ? Math.ceil(e) + "px" : "0px", n = "top" == i.positionProp ? Math.ceil(e) + "px" : "0px", o[i.positionProp] = e, !1 === i.transformsEnabled ? i.$slideTrack.css(o) : (o = {}, !1 === i.cssTransitions ? (o[i.animType] = "translate(" + t + ", " + n + ")", i.$slideTrack.css(o)) : (o[i.animType] = "translate3d(" + t + ", " + n + ", 0px)", i.$slideTrack.css(o)))
    }, t.prototype.setDimensions = function() {
        var e = this;
        !1 === e.options.vertical ? !0 === e.options.centerMode && e.$list.css({
            padding: "0px " + e.options.centerPadding
        }) : (e.$list.height(e.$slides.first().outerHeight(!0) * e.options.slidesToShow), !0 === e.options.centerMode && e.$list.css({
            padding: e.options.centerPadding + " 0px"
        })), e.listWidth = e.$list.width(), e.listHeight = e.$list.height(), !1 === e.options.vertical && !1 === e.options.variableWidth ? (e.slideWidth = Math.ceil(e.listWidth / e.options.slidesToShow), e.$slideTrack.width(Math.ceil(e.slideWidth * e.$slideTrack.children(".slick-slide").length))) : !0 === e.options.variableWidth ? e.$slideTrack.width(5e3 * e.slideCount) : (e.slideWidth = Math.ceil(e.listWidth), e.$slideTrack.height(Math.ceil(e.$slides.first().outerHeight(!0) * e.$slideTrack.children(".slick-slide").length)));
        var t = e.$slides.first().outerWidth(!0) - e.$slides.first().width();
        !1 === e.options.variableWidth && e.$slideTrack.children(".slick-slide").width(e.slideWidth - t)
    }, t.prototype.setFade = function() {
        var t, n = this;
        n.$slides.each(function(i, o) {
            t = n.slideWidth * i * -1, !0 === n.options.rtl ? e(o).css({
                position: "relative",
                right: t,
                top: 0,
                zIndex: n.options.zIndex - 2,
                opacity: 0
            }) : e(o).css({
                position: "relative",
                left: t,
                top: 0,
                zIndex: n.options.zIndex - 2,
                opacity: 0
            })
        }), n.$slides.eq(n.currentSlide).css({
            zIndex: n.options.zIndex - 1,
            opacity: 1
        })
    }, t.prototype.setHeight = function() {
        var e = this;
        if (1 === e.options.slidesToShow && !0 === e.options.adaptiveHeight && !1 === e.options.vertical) {
            var t = e.$slides.eq(e.currentSlide).outerHeight(!0);
            e.$list.css("height", t)
        }
    }, t.prototype.setOption = t.prototype.slickSetOption = function() {
        var t, n, i, o, r, s = this,
            a = !1;
        if ("object" === e.type(arguments[0]) ? (i = arguments[0], a = arguments[1], r = "multiple") : "string" === e.type(arguments[0]) && (i = arguments[0], o = arguments[1], a = arguments[2], "responsive" === arguments[0] && "array" === e.type(arguments[1]) ? r = "responsive" : void 0 !== arguments[1] && (r = "single")), "single" === r) s.options[i] = o;
        else if ("multiple" === r) e.each(i, function(e, t) {
            s.options[e] = t
        });
        else if ("responsive" === r)
            for (n in o)
                if ("array" !== e.type(s.options.responsive)) s.options.responsive = [o[n]];
                else {
                    for (t = s.options.responsive.length - 1; t >= 0;) s.options.responsive[t].breakpoint === o[n].breakpoint && s.options.responsive.splice(t, 1), t--;
                    s.options.responsive.push(o[n])
                }
        a && (s.unload(), s.reinit())
    }, t.prototype.setPosition = function() {
        var e = this;
        e.setDimensions(), e.setHeight(), !1 === e.options.fade ? e.setCSS(e.getLeft(e.currentSlide)) : e.setFade(), e.$slider.trigger("setPosition", [e])
    }, t.prototype.setProps = function() {
        var e = this,
            t = document.body.style;
        e.positionProp = !0 === e.options.vertical ? "top" : "left", "top" === e.positionProp ? e.$slider.addClass("slick-vertical") : e.$slider.removeClass("slick-vertical"), void 0 === t.WebkitTransition && void 0 === t.MozTransition && void 0 === t.msTransition || !0 === e.options.useCSS && (e.cssTransitions = !0), e.options.fade && ("number" == typeof e.options.zIndex ? e.options.zIndex < 3 && (e.options.zIndex = 3) : e.options.zIndex = e.defaults.zIndex), void 0 !== t.OTransform && (e.animType = "OTransform", e.transformType = "-o-transform", e.transitionType = "OTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.MozTransform && (e.animType = "MozTransform", e.transformType = "-moz-transform", e.transitionType = "MozTransition", void 0 === t.perspectiveProperty && void 0 === t.MozPerspective && (e.animType = !1)), void 0 !== t.webkitTransform && (e.animType = "webkitTransform", e.transformType = "-webkit-transform", e.transitionType = "webkitTransition", void 0 === t.perspectiveProperty && void 0 === t.webkitPerspective && (e.animType = !1)), void 0 !== t.msTransform && (e.animType = "msTransform", e.transformType = "-ms-transform", e.transitionType = "msTransition", void 0 === t.msTransform && (e.animType = !1)), void 0 !== t.transform && !1 !== e.animType && (e.animType = "transform", e.transformType = "transform", e.transitionType = "transition"), e.transformsEnabled = e.options.useTransform && null !== e.animType && !1 !== e.animType
    }, t.prototype.setSlideClasses = function(e) {
        var t, n, i, o, r = this;
        n = r.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), r.$slides.eq(e).addClass("slick-current"), !0 === r.options.centerMode ? (t = Math.floor(r.options.slidesToShow / 2), !0 === r.options.infinite && (e >= t && e <= r.slideCount - 1 - t ? r.$slides.slice(e - t, e + t + 1).addClass("slick-active").attr("aria-hidden", "false") : (i = r.options.slidesToShow + e, n.slice(i - t + 1, i + t + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === e ? n.eq(n.length - 1 - r.options.slidesToShow).addClass("slick-center") : e === r.slideCount - 1 && n.eq(r.options.slidesToShow).addClass("slick-center")), r.$slides.eq(e).addClass("slick-center")) : e >= 0 && e <= r.slideCount - r.options.slidesToShow ? r.$slides.slice(e, e + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : n.length <= r.options.slidesToShow ? n.addClass("slick-active").attr("aria-hidden", "false") : (o = r.slideCount % r.options.slidesToShow, i = !0 === r.options.infinite ? r.options.slidesToShow + e : e, r.options.slidesToShow == r.options.slidesToScroll && r.slideCount - e < r.options.slidesToShow ? n.slice(i - (r.options.slidesToShow - o), i + o).addClass("slick-active").attr("aria-hidden", "false") : n.slice(i, i + r.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false")), "ondemand" !== r.options.lazyLoad && "anticipated" !== r.options.lazyLoad || r.lazyLoad()
    }, t.prototype.setupInfinite = function() {
        var t, n, i, o = this;
        if (!0 === o.options.fade && (o.options.centerMode = !1), !0 === o.options.infinite && !1 === o.options.fade && (n = null, o.slideCount > o.options.slidesToShow)) {
            for (i = !0 === o.options.centerMode ? o.options.slidesToShow + 1 : o.options.slidesToShow, t = o.slideCount; t > o.slideCount - i; t -= 1) n = t - 1, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n - o.slideCount).prependTo(o.$slideTrack).addClass("slick-cloned");
            for (t = 0; t < i + o.slideCount; t += 1) n = t, e(o.$slides[n]).clone(!0).attr("id", "").attr("data-slick-index", n + o.slideCount).appendTo(o.$slideTrack).addClass("slick-cloned");
            o.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                e(this).attr("id", "")
            })
        }
    }, t.prototype.interrupt = function(e) {
        var t = this;
        e || t.autoPlay(), t.interrupted = e
    }, t.prototype.selectHandler = function(t) {
        var n = this,
            i = e(t.target).is(".slick-slide") ? e(t.target) : e(t.target).parents(".slick-slide"),
            o = parseInt(i.attr("data-slick-index"));
        o || (o = 0), n.slideCount <= n.options.slidesToShow ? n.slideHandler(o, !1, !0) : n.slideHandler(o)
    }, t.prototype.slideHandler = function(e, t, n) {
        var i, o, r, s, a, l = null,
            c = this;
        if (t = t || !1, !(!0 === c.animating && !0 === c.options.waitForAnimate || !0 === c.options.fade && c.currentSlide === e))
            if (!1 === t && c.asNavFor(e), i = e, l = c.getLeft(i), s = c.getLeft(c.currentSlide), c.currentLeft = null === c.swipeLeft ? s : c.swipeLeft, !1 === c.options.infinite && !1 === c.options.centerMode && (e < 0 || e > c.getDotCount() * c.options.slidesToScroll)) !1 === c.options.fade && (i = c.currentSlide, !0 !== n ? c.animateSlide(s, function() {
                c.postSlide(i)
            }) : c.postSlide(i));
            else if (!1 === c.options.infinite && !0 === c.options.centerMode && (e < 0 || e > c.slideCount - c.options.slidesToScroll)) !1 === c.options.fade && (i = c.currentSlide, !0 !== n ? c.animateSlide(s, function() {
            c.postSlide(i)
        }) : c.postSlide(i));
        else {
            if (c.options.autoplay && clearInterval(c.autoPlayTimer), o = i < 0 ? c.slideCount % c.options.slidesToScroll != 0 ? c.slideCount - c.slideCount % c.options.slidesToScroll : c.slideCount + i : i >= c.slideCount ? c.slideCount % c.options.slidesToScroll != 0 ? 0 : i - c.slideCount : i, c.animating = !0, c.$slider.trigger("beforeChange", [c, c.currentSlide, o]), r = c.currentSlide, c.currentSlide = o, c.setSlideClasses(c.currentSlide), c.options.asNavFor && (a = (a = c.getNavTarget()).slick("getSlick")).slideCount <= a.options.slidesToShow && a.setSlideClasses(c.currentSlide), c.updateDots(), c.updateArrows(), !0 === c.options.fade) return !0 !== n ? (c.fadeSlideOut(r), c.fadeSlide(o, function() {
                c.postSlide(o)
            })) : c.postSlide(o), void c.animateHeight();
            !0 !== n ? c.animateSlide(l, function() {
                c.postSlide(o)
            }) : c.postSlide(o)
        }
    }, t.prototype.startLoad = function() {
        var e = this;
        !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow.hide(), e.$nextArrow.hide()), !0 === e.options.dots && e.slideCount > e.options.slidesToShow && e.$dots.hide(), e.$slider.addClass("slick-loading")
    }, t.prototype.swipeDirection = function() {
        var e, t, n, i, o = this;
        return e = o.touchObject.startX - o.touchObject.curX, t = o.touchObject.startY - o.touchObject.curY, n = Math.atan2(t, e), (i = Math.round(180 * n / Math.PI)) < 0 && (i = 360 - Math.abs(i)), i <= 45 && i >= 0 ? !1 === o.options.rtl ? "left" : "right" : i <= 360 && i >= 315 ? !1 === o.options.rtl ? "left" : "right" : i >= 135 && i <= 225 ? !1 === o.options.rtl ? "right" : "left" : !0 === o.options.verticalSwiping ? i >= 35 && i <= 135 ? "down" : "up" : "vertical"
    }, t.prototype.swipeEnd = function(e) {
        var t, n, i = this;
        if (i.dragging = !1, i.swiping = !1, i.scrolling) return i.scrolling = !1, !1;
        if (i.interrupted = !1, i.shouldClick = !(i.touchObject.swipeLength > 10), void 0 === i.touchObject.curX) return !1;
        if (!0 === i.touchObject.edgeHit && i.$slider.trigger("edge", [i, i.swipeDirection()]), i.touchObject.swipeLength >= i.touchObject.minSwipe) {
            switch (n = i.swipeDirection()) {
                case "left":
                case "down":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide + i.getSlideCount()) : i.currentSlide + i.getSlideCount(), i.currentDirection = 0;
                    break;
                case "right":
                case "up":
                    t = i.options.swipeToSlide ? i.checkNavigable(i.currentSlide - i.getSlideCount()) : i.currentSlide - i.getSlideCount(), i.currentDirection = 1
            }
            "vertical" != n && (i.slideHandler(t), i.touchObject = {}, i.$slider.trigger("swipe", [i, n]))
        } else i.touchObject.startX !== i.touchObject.curX && (i.slideHandler(i.currentSlide), i.touchObject = {})
    }, t.prototype.swipeHandler = function(e) {
        var t = this;
        if (!(!1 === t.options.swipe || "ontouchend" in document && !1 === t.options.swipe || !1 === t.options.draggable && -1 !== e.type.indexOf("mouse"))) switch (t.touchObject.fingerCount = e.originalEvent && void 0 !== e.originalEvent.touches ? e.originalEvent.touches.length : 1, t.touchObject.minSwipe = t.listWidth / t.options.touchThreshold, !0 === t.options.verticalSwiping && (t.touchObject.minSwipe = t.listHeight / t.options.touchThreshold), e.data.action) {
            case "start":
                t.swipeStart(e);
                break;
            case "move":
                t.swipeMove(e);
                break;
            case "end":
                t.swipeEnd(e)
        }
    }, t.prototype.swipeMove = function(e) {
        var t, n, i, o, r, s, a = this;
        return r = void 0 !== e.originalEvent ? e.originalEvent.touches : null, !(!a.dragging || a.scrolling || r && 1 !== r.length) && (t = a.getLeft(a.currentSlide), a.touchObject.curX = void 0 !== r ? r[0].pageX : e.clientX, a.touchObject.curY = void 0 !== r ? r[0].pageY : e.clientY, a.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(a.touchObject.curX - a.touchObject.startX, 2))), s = Math.round(Math.sqrt(Math.pow(a.touchObject.curY - a.touchObject.startY, 2))), !a.options.verticalSwiping && !a.swiping && s > 4 ? (a.scrolling = !0, !1) : (!0 === a.options.verticalSwiping && (a.touchObject.swipeLength = s), n = a.swipeDirection(), void 0 !== e.originalEvent && a.touchObject.swipeLength > 4 && (a.swiping = !0, e.preventDefault()), o = (!1 === a.options.rtl ? 1 : -1) * (a.touchObject.curX > a.touchObject.startX ? 1 : -1), !0 === a.options.verticalSwiping && (o = a.touchObject.curY > a.touchObject.startY ? 1 : -1), i = a.touchObject.swipeLength, a.touchObject.edgeHit = !1, !1 === a.options.infinite && (0 === a.currentSlide && "right" === n || a.currentSlide >= a.getDotCount() && "left" === n) && (i = a.touchObject.swipeLength * a.options.edgeFriction, a.touchObject.edgeHit = !0), !1 === a.options.vertical ? a.swipeLeft = t + i * o : a.swipeLeft = t + i * (a.$list.height() / a.listWidth) * o, !0 === a.options.verticalSwiping && (a.swipeLeft = t + i * o), !0 !== a.options.fade && !1 !== a.options.touchMove && (!0 === a.animating ? (a.swipeLeft = null, !1) : void a.setCSS(a.swipeLeft))))
    }, t.prototype.swipeStart = function(e) {
        var t, n = this;
        if (n.interrupted = !0, 1 !== n.touchObject.fingerCount || n.slideCount <= n.options.slidesToShow) return n.touchObject = {}, !1;
        void 0 !== e.originalEvent && void 0 !== e.originalEvent.touches && (t = e.originalEvent.touches[0]), n.touchObject.startX = n.touchObject.curX = void 0 !== t ? t.pageX : e.clientX, n.touchObject.startY = n.touchObject.curY = void 0 !== t ? t.pageY : e.clientY, n.dragging = !0
    }, t.prototype.unfilterSlides = t.prototype.slickUnfilter = function() {
        var e = this;
        null !== e.$slidesCache && (e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.appendTo(e.$slideTrack), e.reinit())
    }, t.prototype.unload = function() {
        var t = this;
        e(".slick-cloned", t.$slider).remove(), t.$dots && t.$dots.remove(), t.$prevArrow && t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove(), t.$nextArrow && t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove(), t.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }, t.prototype.unslick = function(e) {
        var t = this;
        t.$slider.trigger("unslick", [t, e]), t.destroy()
    }, t.prototype.updateArrows = function() {
        var e = this;
        Math.floor(e.options.slidesToShow / 2), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && !e.options.infinite && (e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === e.currentSlide ? (e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - e.options.slidesToShow && !1 === e.options.centerMode ? (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : e.currentSlide >= e.slideCount - 1 && !0 === e.options.centerMode && (e.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }, t.prototype.updateDots = function() {
        var e = this;
        null !== e.$dots && (e.$dots.find("li").removeClass("slick-active").end(), e.$dots.find("li").eq(Math.floor(e.currentSlide / e.options.slidesToScroll)).addClass("slick-active"))
    }, t.prototype.visibility = function() {
        var e = this;
        e.options.autoplay && (document[e.hidden] ? e.interrupted = !0 : e.interrupted = !1)
    }, e.fn.slick = function() {
        var e, n, i = this,
            o = arguments[0],
            r = Array.prototype.slice.call(arguments, 1),
            s = i.length;
        for (e = 0; e < s; e++)
            if ("object" == typeof o || void 0 === o ? i[e].slick = new t(i[e], o) : n = i[e].slick[o].apply(i[e].slick, r), void 0 !== n) return n;
        return i
    }
});
var ssc_framerate = 150,
    ssc_animtime = 500,
    ssc_stepsize = 150,
    ssc_pulseAlgorithm = !0,
    ssc_pulseScale = 6,
    ssc_pulseNormalize = 1,
    ssc_keyboardsupport = !0,
    ssc_arrowscroll = 50,
    ssc_frame = !1,
    ssc_direction = {
        x: 0,
        y: 0
    },
    ssc_initdone = !1,
    ssc_fixedback = !0,
    ssc_root = document.documentElement,
    ssc_activeElement, ssc_key = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        spacebar: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36
    },
    ssc_que = [],
    ssc_pending = !1,
    ssc_cache = {};
setInterval(function() {
    ssc_cache = {}
}, 1e4);
var ssc_uniqueID = function() {
        var e = 0;
        return function(t) {
            return t.ssc_uniqueID || (t.ssc_uniqueID = e++)
        }
    }(),
    ischrome = /chrome/.test(navigator.userAgent.toLowerCase());
ischrome && (ssc_addEvent("mousedown", ssc_mousedown), ssc_addEvent("mousewheel", ssc_wheel), ssc_addEvent("load", ssc_init)),
    function(e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
    }(function(e) {
        e.extend(e.fn, {
            validate: function(t) {
                if (this.length) {
                    var n = e.data(this[0], "validator");
                    return n || (this.attr("novalidate", "novalidate"), n = new e.validator(t, this[0]), e.data(this[0], "validator", n), n.settings.onsubmit && (this.validateDelegate(":submit", "click", function(t) {
                        n.settings.submitHandler && (n.submitButton = t.target), e(t.target).hasClass("cancel") && (n.cancelSubmit = !0), void 0 !== e(t.target).attr("formnovalidate") && (n.cancelSubmit = !0)
                    }), this.submit(function(t) {
                        function i() {
                            var i, o;
                            return !n.settings.submitHandler || (n.submitButton && (i = e("<input type='hidden'/>").attr("name", n.submitButton.name).val(e(n.submitButton).val()).appendTo(n.currentForm)), o = n.settings.submitHandler.call(n, n.currentForm, t), n.submitButton && i.remove(), void 0 !== o && o)
                        }
                        return n.settings.debug && t.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, i()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0, !1) : i() : (n.focusInvalid(), !1)
                    })), n)
                }
                t && t.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
            },
            valid: function() {
                var t, n;
                return e(this[0]).is("form") ? t = this.validate().form() : (t = !0, n = e(this[0].form).validate(), this.each(function() {
                    t = n.element(this) && t
                })), t
            },
            removeAttrs: function(t) {
                var n = {},
                    i = this;
                return e.each(t.split(/\s/), function(e, t) {
                    n[t] = i.attr(t), i.removeAttr(t)
                }), n
            },
            rules: function(t, n) {
                var i, o, r, s, a, l, c = this[0];
                if (t) switch (i = e.data(c.form, "validator").settings, o = i.rules, r = e.validator.staticRules(c), t) {
                    case "add":
                        e.extend(r, e.validator.normalizeRule(n)), delete r.messages, o[c.name] = r, n.messages && (i.messages[c.name] = e.extend(i.messages[c.name], n.messages));
                        break;
                    case "remove":
                        return n ? (l = {}, e.each(n.split(/\s/), function(t, n) {
                            l[n] = r[n], delete r[n], "required" === n && e(c).removeAttr("aria-required")
                        }), l) : (delete o[c.name], r)
                }
                return (s = e.validator.normalizeRules(e.extend({}, e.validator.classRules(c), e.validator.attributeRules(c), e.validator.dataRules(c), e.validator.staticRules(c)), c)).required && (a = s.required, delete s.required, s = e.extend({
                    required: a
                }, s), e(c).attr("aria-required", "true")), s.remote && (a = s.remote, delete s.remote, s = e.extend(s, {
                    remote: a
                })), s
            }
        }), e.extend(e.expr[":"], {
            blank: function(t) {
                return !e.trim("" + e(t).val())
            },
            filled: function(t) {
                return !!e.trim("" + e(t).val())
            },
            unchecked: function(t) {
                return !e(t).prop("checked")
            }
        }), e.validator = function(t, n) {
            this.settings = e.extend(!0, {}, e.validator.defaults, t), this.currentForm = n, this.init()
        }, e.validator.format = function(t, n) {
            return 1 === arguments.length ? function() {
                var n = e.makeArray(arguments);
                return n.unshift(t), e.validator.format.apply(this, n)
            } : (arguments.length > 2 && n.constructor !== Array && (n = e.makeArray(arguments).slice(1)), n.constructor !== Array && (n = [n]), e.each(n, function(e, n) {
                t = t.replace(new RegExp("\\{" + e + "\\}", "g"), function() {
                    return n
                })
            }), t)
        }, e.extend(e.validator, {
            defaults: {
                messages: {},
                groups: {},
                rules: {},
                errorClass: "error",
                validClass: "valid",
                errorElement: "label",
                focusCleanup: !1,
                focusInvalid: !0,
                errorContainer: e([]),
                errorLabelContainer: e([]),
                onsubmit: !0,
                ignore: ":hidden",
                ignoreTitle: !1,
                onfocusin: function(e) {
                    this.lastActive = e, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(e)))
                },
                onfocusout: function(e) {
                    this.checkable(e) || !(e.name in this.submitted) && this.optional(e) || this.element(e)
                },
                onkeyup: function(e, t) {
                    9 === t.which && "" === this.elementValue(e) || (e.name in this.submitted || e === this.lastElement) && this.element(e)
                },
                onclick: function(e) {
                    e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
                },
                highlight: function(t, n, i) {
                    "radio" === t.type ? this.findByName(t.name).addClass(n).removeClass(i) : e(t).addClass(n).removeClass(i)
                },
                unhighlight: function(t, n, i) {
                    "radio" === t.type ? this.findByName(t.name).removeClass(n).addClass(i) : e(t).removeClass(n).addClass(i)
                }
            },
            setDefaults: function(t) {
                e.extend(e.validator.defaults, t)
            },
            messages: {
                required: "This field is required.",
                remote: "Please fix this field.",
                email: "Please enter a valid email address.",
                url: "Please enter a valid URL.",
                date: "Please enter a valid date.",
                dateISO: "Please enter a valid date ( ISO ).",
                number: "Please enter a valid number.",
                digits: "Please enter only digits.",
                creditcard: "Please enter a valid credit card number.",
                equalTo: "Please enter the same value again.",
                maxlength: e.validator.format("Please enter no more than {0} characters."),
                minlength: e.validator.format("Please enter at least {0} characters."),
                rangelength: e.validator.format("Please enter a value between {0} and {1} characters long."),
                range: e.validator.format("Please enter a value between {0} and {1}."),
                max: e.validator.format("Please enter a value less than or equal to {0}."),
                min: e.validator.format("Please enter a value greater than or equal to {0}.")
            },
            autoCreateRanges: !1,
            prototype: {
                init: function() {
                    function t(t) {
                        var n = e.data(this[0].form, "validator"),
                            i = "on" + t.type.replace(/^validate/, ""),
                            o = n.settings;
                        o[i] && !this.is(o.ignore) && o[i].call(n, this[0], t)
                    }
                    this.labelContainer = e(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || e(this.currentForm), this.containers = e(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                    var n, i = this.groups = {};
                    e.each(this.settings.groups, function(t, n) {
                        "string" == typeof n && (n = n.split(/\s/)), e.each(n, function(e, n) {
                            i[n] = t
                        })
                    }), n = this.settings.rules, e.each(n, function(t, i) {
                        n[t] = e.validator.normalizeRule(i)
                    }), e(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", t).validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", t), this.settings.invalidHandler && e(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler), e(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
                },
                form: function() {
                    return this.checkForm(), e.extend(this.submitted, this.errorMap), this.invalid = e.extend({}, this.errorMap), this.valid() || e(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
                },
                checkForm: function() {
                    this.prepareForm();
                    for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++) this.check(t[e]);
                    return this.valid()
                },
                element: function(t) {
                    var n = this.clean(t),
                        i = this.validationTargetFor(n),
                        o = !0;
                    return this.lastElement = i, void 0 === i ? delete this.invalid[n.name] : (this.prepareElement(i), this.currentElements = e(i), (o = !1 !== this.check(i)) ? delete this.invalid[i.name] : this.invalid[i.name] = !0), e(t).attr("aria-invalid", !o), this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), o
                },
                showErrors: function(t) {
                    if (t) {
                        e.extend(this.errorMap, t), this.errorList = [];
                        for (var n in t) this.errorList.push({
                            message: t[n],
                            element: this.findByName(n)[0]
                        });
                        this.successList = e.grep(this.successList, function(e) {
                            return !(e.name in t)
                        })
                    }
                    this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
                },
                resetForm: function() {
                    e.fn.resetForm && e(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")
                },
                numberOfInvalids: function() {
                    return this.objectLength(this.invalid)
                },
                objectLength: function(e) {
                    var t, n = 0;
                    for (t in e) n++;
                    return n
                },
                hideErrors: function() {
                    this.hideThese(this.toHide)
                },
                hideThese: function(e) {
                    e.not(this.containers).text(""), this.addWrapper(e).hide()
                },
                valid: function() {
                    return 0 === this.size()
                },
                size: function() {
                    return this.errorList.length
                },
                focusInvalid: function() {
                    if (this.settings.focusInvalid) try {
                        e(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (e) {}
                },
                findLastActive: function() {
                    var t = this.lastActive;
                    return t && 1 === e.grep(this.errorList, function(e) {
                        return e.element.name === t.name
                    }).length && t
                },
                elements: function() {
                    var t = this,
                        n = {};
                    return e(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function() {
                        return !this.name && t.settings.debug && window.console && console.error("%o has no name assigned", this), !(this.name in n || !t.objectLength(e(this).rules())) && (n[this.name] = !0, !0)
                    })
                },
                clean: function(t) {
                    return e(t)[0]
                },
                errors: function() {
                    var t = this.settings.errorClass.split(" ").join(".");
                    return e(this.settings.errorElement + "." + t, this.errorContext)
                },
                reset: function() {
                    this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = e([]), this.toHide = e([]), this.currentElements = e([])
                },
                prepareForm: function() {
                    this.reset(), this.toHide = this.errors().add(this.containers)
                },
                prepareElement: function(e) {
                    this.reset(), this.toHide = this.errorsFor(e)
                },
                elementValue: function(t) {
                    var n, i = e(t),
                        o = t.type;
                    return "radio" === o || "checkbox" === o ? e("input[name='" + t.name + "']:checked").val() : "number" === o && void 0 !== t.validity ? !t.validity.badInput && i.val() : "string" == typeof(n = i.val()) ? n.replace(/\r/g, "") : n
                },
                check: function(t) {
                    t = this.validationTargetFor(this.clean(t));
                    var n, i, o, r = e(t).rules(),
                        s = e.map(r, function(e, t) {
                            return t
                        }).length,
                        a = !1,
                        l = this.elementValue(t);
                    for (i in r) {
                        o = {
                            method: i,
                            parameters: r[i]
                        };
                        try {
                            if ("dependency-mismatch" === (n = e.validator.methods[i].call(this, l, t, o.parameters)) && 1 === s) {
                                a = !0;
                                continue
                            }
                            if (a = !1, "pending" === n) return void(this.toHide = this.toHide.not(this.errorsFor(t)));
                            if (!n) return this.formatAndAdd(t, o), !1
                        } catch (e) {
                            throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + o.method + "' method.", e), e
                        }
                    }
                    if (!a) return this.objectLength(r) && this.successList.push(t), !0
                },
                customDataMessage: function(t, n) {
                    return e(t).data("msg" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase()) || e(t).data("msg")
                },
                customMessage: function(e, t) {
                    var n = this.settings.messages[e];
                    return n && (n.constructor === String ? n : n[t])
                },
                findDefined: function() {
                    for (var e = 0; e < arguments.length; e++)
                        if (void 0 !== arguments[e]) return arguments[e]
                },
                defaultMessage: function(t, n) {
                    return this.findDefined(this.customMessage(t.name, n), this.customDataMessage(t, n), !this.settings.ignoreTitle && t.title || void 0, e.validator.messages[n], "<strong>Warning: No message defined for " + t.name + "</strong>")
                },
                formatAndAdd: function(t, n) {
                    var i = this.defaultMessage(t, n.method),
                        o = /\$?\{(\d+)\}/g;
                    "function" == typeof i ? i = i.call(this, n.parameters, t) : o.test(i) && (i = e.validator.format(i.replace(o, "{$1}"), n.parameters)), this.errorList.push({
                        message: i,
                        element: t,
                        method: n.method
                    }), this.errorMap[t.name] = i, this.submitted[t.name] = i
                },
                addWrapper: function(e) {
                    return this.settings.wrapper && (e = e.add(e.parent(this.settings.wrapper))), e
                },
                defaultShowErrors: function() {
                    var e, t, n;
                    for (e = 0; this.errorList[e]; e++) n = this.errorList[e], this.settings.highlight && this.settings.highlight.call(this, n.element, this.settings.errorClass, this.settings.validClass), this.showLabel(n.element, n.message);
                    if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success)
                        for (e = 0; this.successList[e]; e++) this.showLabel(this.successList[e]);
                    if (this.settings.unhighlight)
                        for (e = 0, t = this.validElements(); t[e]; e++) this.settings.unhighlight.call(this, t[e], this.settings.errorClass, this.settings.validClass);
                    this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
                },
                validElements: function() {
                    return this.currentElements.not(this.invalidElements())
                },
                invalidElements: function() {
                    return e(this.errorList).map(function() {
                        return this.element
                    })
                },
                showLabel: function(t, n) {
                    var i, o, r, s = this.errorsFor(t),
                        a = this.idOrName(t),
                        l = e(t).attr("aria-describedby");
                    s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html(n)) : (i = s = e("<" + this.settings.errorElement + ">").attr("id", a + "-error").addClass(this.settings.errorClass).html(n || ""), this.settings.wrapper && (i = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(i) : this.settings.errorPlacement ? this.settings.errorPlacement(i, e(t)) : i.insertAfter(t), s.is("label") ? s.attr("for", a) : 0 === s.parents("label[for='" + a + "']").length && (r = s.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"), l ? l.match(new RegExp("\\b" + r + "\\b")) || (l += " " + r) : l = r, e(t).attr("aria-describedby", l), (o = this.groups[t.name]) && e.each(this.groups, function(t, n) {
                        n === o && e("[name='" + t + "']", this.currentForm).attr("aria-describedby", s.attr("id"))
                    }))), !n && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, t)), this.toShow = this.toShow.add(s)
                },
                errorsFor: function(t) {
                    var n = this.idOrName(t),
                        i = e(t).attr("aria-describedby"),
                        o = "label[for='" + n + "'], label[for='" + n + "'] *";
                    return i && (o = o + ", #" + i.replace(/\s+/g, ", #")), this.errors().filter(o)
                },
                idOrName: function(e) {
                    return this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
                },
                validationTargetFor: function(t) {
                    return this.checkable(t) && (t = this.findByName(t.name)), e(t).not(this.settings.ignore)[0]
                },
                checkable: function(e) {
                    return /radio|checkbox/i.test(e.type)
                },
                findByName: function(t) {
                    return e(this.currentForm).find("[name='" + t + "']")
                },
                getLength: function(t, n) {
                    switch (n.nodeName.toLowerCase()) {
                        case "select":
                            return e("option:selected", n).length;
                        case "input":
                            if (this.checkable(n)) return this.findByName(n.name).filter(":checked").length
                    }
                    return t.length
                },
                depend: function(e, t) {
                    return !this.dependTypes[typeof e] || this.dependTypes[typeof e](e, t)
                },
                dependTypes: {
                    boolean: function(e) {
                        return e
                    },
                    string: function(t, n) {
                        return !!e(t, n.form).length
                    },
                    function: function(e, t) {
                        return e(t)
                    }
                },
                optional: function(t) {
                    var n = this.elementValue(t);
                    return !e.validator.methods.required.call(this, n, t) && "dependency-mismatch"
                },
                startRequest: function(e) {
                    this.pending[e.name] || (this.pendingRequest++, this.pending[e.name] = !0)
                },
                stopRequest: function(t, n) {
                    --this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[t.name], n && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (e(this.currentForm).submit(), this.formSubmitted = !1) : !n && 0 === this.pendingRequest && this.formSubmitted && (e(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
                },
                previousValue: function(t) {
                    return e.data(t, "previousValue") || e.data(t, "previousValue", {
                        old: null,
                        valid: !0,
                        message: this.defaultMessage(t, "remote")
                    })
                }
            },
            classRuleSettings: {
                required: {
                    required: !0
                },
                email: {
                    email: !0
                },
                url: {
                    url: !0
                },
                date: {
                    date: !0
                },
                dateISO: {
                    dateISO: !0
                },
                number: {
                    number: !0
                },
                digits: {
                    digits: !0
                },
                creditcard: {
                    creditcard: !0
                }
            },
            addClassRules: function(t, n) {
                t.constructor === String ? this.classRuleSettings[t] = n : e.extend(this.classRuleSettings, t)
            },
            classRules: function(t) {
                var n = {},
                    i = e(t).attr("class");
                return i && e.each(i.split(" "), function() {
                    this in e.validator.classRuleSettings && e.extend(n, e.validator.classRuleSettings[this])
                }), n
            },
            attributeRules: function(t) {
                var n, i, o = {},
                    r = e(t),
                    s = t.getAttribute("type");
                for (n in e.validator.methods) "required" === n ? ("" === (i = t.getAttribute(n)) && (i = !0), i = !!i) : i = r.attr(n), /min|max/.test(n) && (null === s || /number|range|text/.test(s)) && (i = Number(i)), i || 0 === i ? o[n] = i : s === n && "range" !== s && (o[n] = !0);
                return o.maxlength && /-1|2147483647|524288/.test(o.maxlength) && delete o.maxlength, o
            },
            dataRules: function(t) {
                var n, i, o = {},
                    r = e(t);
                for (n in e.validator.methods) void 0 !== (i = r.data("rule" + n.charAt(0).toUpperCase() + n.substring(1).toLowerCase())) && (o[n] = i);
                return o
            },
            staticRules: function(t) {
                var n = {},
                    i = e.data(t.form, "validator");
                return i.settings.rules && (n = e.validator.normalizeRule(i.settings.rules[t.name]) || {}), n
            },
            normalizeRules: function(t, n) {
                return e.each(t, function(i, o) {
                    if (!1 !== o) {
                        if (o.param || o.depends) {
                            var r = !0;
                            switch (typeof o.depends) {
                                case "string":
                                    r = !!e(o.depends, n.form).length;
                                    break;
                                case "function":
                                    r = o.depends.call(n, n)
                            }
                            r ? t[i] = void 0 === o.param || o.param : delete t[i]
                        }
                    } else delete t[i]
                }), e.each(t, function(i, o) {
                    t[i] = e.isFunction(o) ? o(n) : o
                }), e.each(["minlength", "maxlength"], function() {
                    t[this] && (t[this] = Number(t[this]))
                }), e.each(["rangelength", "range"], function() {
                    var n;
                    t[this] && (e.isArray(t[this]) ? t[this] = [Number(t[this][0]), Number(t[this][1])] : "string" == typeof t[this] && (n = t[this].replace(/[\[\]]/g, "").split(/[\s,]+/), t[this] = [Number(n[0]), Number(n[1])]))
                }), e.validator.autoCreateRanges && (null != t.min && null != t.max && (t.range = [t.min, t.max], delete t.min, delete t.max), null != t.minlength && null != t.maxlength && (t.rangelength = [t.minlength, t.maxlength], delete t.minlength, delete t.maxlength)), t
            },
            normalizeRule: function(t) {
                if ("string" == typeof t) {
                    var n = {};
                    e.each(t.split(/\s/), function() {
                        n[this] = !0
                    }), t = n
                }
                return t
            },
            addMethod: function(t, n, i) {
                e.validator.methods[t] = n, e.validator.messages[t] = void 0 !== i ? i : e.validator.messages[t], n.length < 3 && e.validator.addClassRules(t, e.validator.normalizeRule(t))
            },
            methods: {
                required: function(t, n, i) {
                    if (!this.depend(i, n)) return "dependency-mismatch";
                    if ("select" === n.nodeName.toLowerCase()) {
                        var o = e(n).val();
                        return o && o.length > 0
                    }
                    return this.checkable(n) ? this.getLength(t, n) > 0 : e.trim(t).length > 0
                },
                email: function(e, t) {
                    return this.optional(t) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(e)
                },
                url: function(e, t) {
                    return this.optional(t) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(e)
                },
                date: function(e, t) {
                    return this.optional(t) || !/Invalid|NaN/.test(new Date(e).toString())
                },
                dateISO: function(e, t) {
                    return this.optional(t) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(e)
                },
                number: function(e, t) {
                    return this.optional(t) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(e)
                },
                digits: function(e, t) {
                    return this.optional(t) || /^\d+$/.test(e)
                },
                creditcard: function(e, t) {
                    if (this.optional(t)) return "dependency-mismatch";
                    if (/[^0-9 \-]+/.test(e)) return !1;
                    var n, i, o = 0,
                        r = 0,
                        s = !1;
                    if ((e = e.replace(/\D/g, "")).length < 13 || e.length > 19) return !1;
                    for (n = e.length - 1; n >= 0; n--) i = e.charAt(n), r = parseInt(i, 10), s && (r *= 2) > 9 && (r -= 9), o += r, s = !s;
                    return o % 10 == 0
                },
                minlength: function(t, n, i) {
                    var o = e.isArray(t) ? t.length : this.getLength(t, n);
                    return this.optional(n) || o >= i
                },
                maxlength: function(t, n, i) {
                    var o = e.isArray(t) ? t.length : this.getLength(t, n);
                    return this.optional(n) || o <= i
                },
                rangelength: function(t, n, i) {
                    var o = e.isArray(t) ? t.length : this.getLength(t, n);
                    return this.optional(n) || o >= i[0] && o <= i[1]
                },
                min: function(e, t, n) {
                    return this.optional(t) || e >= n
                },
                max: function(e, t, n) {
                    return this.optional(t) || e <= n
                },
                range: function(e, t, n) {
                    return this.optional(t) || e >= n[0] && e <= n[1]
                },
                equalTo: function(t, n, i) {
                    var o = e(i);
                    return this.settings.onfocusout && o.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        e(n).valid()
                    }), t === o.val()
                },
                remote: function(t, n, i) {
                    if (this.optional(n)) return "dependency-mismatch";
                    var o, r, s = this.previousValue(n);
                    return this.settings.messages[n.name] || (this.settings.messages[n.name] = {}), s.originalMessage = this.settings.messages[n.name].remote, this.settings.messages[n.name].remote = s.message, i = "string" == typeof i && {
                        url: i
                    } || i, s.old === t ? s.valid : (s.old = t, o = this, this.startRequest(n), r = {}, r[n.name] = t, e.ajax(e.extend(!0, {
                        url: i,
                        mode: "abort",
                        port: "validate" + n.name,
                        dataType: "json",
                        data: r,
                        context: o.currentForm,
                        success: function(i) {
                            var r, a, l, c = !0 === i || "true" === i;
                            o.settings.messages[n.name].remote = s.originalMessage, c ? (l = o.formSubmitted, o.prepareElement(n), o.formSubmitted = l, o.successList.push(n), delete o.invalid[n.name], o.showErrors()) : (r = {}, a = i || o.defaultMessage(n, "remote"), r[n.name] = s.message = e.isFunction(a) ? a(t) : a, o.invalid[n.name] = !0, o.showErrors(r)), s.valid = c, o.stopRequest(n, c)
                        }
                    }, i)), "pending")
                }
            }
        }), e.format = function() {
            throw "$.format has been deprecated. Please use $.validator.format instead."
        };
        var t, n = {};
        e.ajaxPrefilter ? e.ajaxPrefilter(function(e, t, i) {
            var o = e.port;
            "abort" === e.mode && (n[o] && n[o].abort(), n[o] = i)
        }) : (t = e.ajax, e.ajax = function(i) {
            var o = ("mode" in i ? i : e.ajaxSettings).mode,
                r = ("port" in i ? i : e.ajaxSettings).port;
            return "abort" === o ? (n[r] && n[r].abort(), n[r] = t.apply(this, arguments), n[r]) : t.apply(this, arguments)
        }), e.extend(e.fn, {
            validateDelegate: function(t, n, i) {
                return this.bind(n, function(n) {
                    var o = e(n.target);
                    if (o.is(t)) return i.apply(o, arguments)
                })
            }
        })
    }), $(function() {
        "use strict";
        $.validator.setDefaults({
            ignore: [],
            highlight: function(e) {
                $(e).closest(".form-group").addClass("has-danger"), $(e).addClass("form-control-danger")
            },
            unhighlight: function(e) {
                $(e).closest(".form-group").removeClass("has-danger"), $(e).removeClass("form-control-danger")
            },
            errorElement: "div",
            errorClass: "form-control-feedback",
            errorPlacement: function(e, t) {
                t.parent(".input-group").length || t.parent("label").length
            }
        });
        var e = $("#phpcontactform"),
            t = $("#js-contact-btn"),
            n = $("#js-contact-result");
        e.submit(function(e) {
            e.preventDefault()
        }).validate({
            rules: {
                name: "required",
                email: {
                    required: !0,
                    email: !0
                },
                message: "required"
            },
            messages: {
                name: "Your first name please",
                email: "We need your email address",
                message: "Please enter your message"
            },
            submitHandler: function(i) {
                t.attr("disabled", !0);
                var o = e.data("redirect"),
                    r = !1;
                "none" != o && "" != o && null != o || (r = !0), n.html('<p class="help-block">Please wait...</p>');
                var s = n.data("success-msg"),
                    a = n.data("error-msg"),
                    l = $(i).serialize();
                return $.ajax({
                    type: "POST",
                    data: l,
                    url: "php/contact.php",
                    cache: !1,
                    success: function(i) {
                        "success" == i ? r ? (e[0].reset(), n.fadeIn("slow").html('<div class="mt-3 help-block text-success">' + s + "</div>").delay(3e3).fadeOut("slow")) : window.location.href = o : (n.fadeIn("slow").html('<div class="mt-3 help-block text-danger">' + a + "</div>").delay(3e3).fadeOut("slow"), window.console && console.log("PHP Error: " + i)), t.attr("disabled", !1)
                    },
                    error: function(e) {
                        n.fadeIn("slow").html('<div class="mt-3 help-block text-danger"> Cannot access Server</div>').delay(3e3).fadeOut("slow"), t.attr("disabled", !1), window.console && console.error("JS Error: Please make sure you are running on a PHP Server")
                    }
                }), !1
            }
        })
    }), $(function() {
        "use strict";
        $.validator.setDefaults({
            ignore: [],
            highlight: function(e) {
                $(e).closest(".form-group").addClass("has-danger"), $(e).addClass("form-control-danger")
            },
            unhighlight: function(e) {
                $(e).closest(".form-group").removeClass("has-danger"), $(e).removeClass("form-control-danger")
            },
            errorElement: "div",
            errorClass: "form-control-feedback",
            errorPlacement: function(e, t) {
                t.parent(".input-group").length || t.parent("label").length
            }
        }), $("#subscribeform").submit(function(e) {
            e.preventDefault()
        }).validate({
            rules: {
                email: {
                    required: !0,
                    email: !0
                }
            },
            messages: {
                email: "Please enter your email address"
            },
            submitHandler: function(e) {
                var t = $("#js-subscribe-btn"),
                    n = $("#js-subscribe-result");
                t.attr("disabled", !0);
                var i = $("#subscribeform").data("redirect"),
                    o = !1;
                "none" != i && "" != i && null != i || (o = !0), n.fadeIn("slow").html('<p class="help-block">Please wait...</p>');
                var r = n.data("success-msg"),
                    s = n.data("error-msg"),
                    a = $(e).serialize();
                return $.ajax({
                    type: "POST",
                    data: a,
                    url: "php/subscribe.php",
                    cache: !1,
                    success: function(e) {
                        $(".form-group").removeClass("has-success"), "success" == e ? o ? n.fadeIn("slow").html('<p class="mt-3 help-block text-success">' + r + "</p>").delay(3e3).fadeOut("slow") : window.location.href = i : (n.fadeIn("slow").html('<p class="mt-3 help-block text-danger">' + s + "</p>").delay(3e3).fadeOut("slow"), window.console && console.log("PHP Error: " + e)), t.attr("disabled", !1)
                    },
                    error: function(e) {
                        n.fadeIn("slow").html('<p class="mt-3 help-block text-danger"> Sorry. Cannot access the PHP Server</p>').delay(3e3).fadeOut("slow"), t.attr("disabled", !1)
                    }
                }), !1
            }
        })
    });
var $scrollable = $("#fscontent");
$(function() {
    "use strict";
    $(".hamburger").on("click", function() {
        $("body").toggleClass("sidebar-open"), setTimeout(function() {
            $scrollable.find(".aos-init:not(.aos-animate):in-viewport").addClass("aos-animate")
        }, 1200)
    }), $scrollable.on("scroll", function() {
        $scrollable.find(".aos-init:not(.aos-animate):in-viewport").addClass("aos-animate")
    }), $("input, textarea").keyup(function() {
        "" == $(this).val() ? $(this).siblings("label").removeClass("active") : $(this).siblings("label").addClass("active")
    }), $("#bg-slider").length && $.fn.slick && ($("#bg-slider").slick({
        arrows: !1,
        autoplay: !0,
        fade: !0,
        dots: !0,
        appendDots: $(".wrapper"),
        speed: 1e3,
        autoplaySpeed: 5e3
    }), $(".slick-slide .img-holder").height($(window).height()));
    var e = $("#countdown");
    if (e.length && $.fn.countdown) {
        var t = e.data("event-date");
        t && e.countdown({
            date: t,
            format: "on"
        })
    }
}), $(window).on("load", function() {
    AOS.init({
        duration: 1200
    }), loadGoogleMapsAPI(), $("#bg-slider").length && $.fn.slick && ($(".slick-slide .img-holder").height($(window).height()), $(window).on("resize", function() {
        $(".slick-slide .img-holder").height($(window).height())
    })), $scrollable.find(".aos-init").removeClass("aos-animate")
});