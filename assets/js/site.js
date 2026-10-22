/* =================================================================
   site.js  ·  builds the page from content.js
   You shouldn't need to edit this file. Change content.js instead.
   ================================================================= */
(function () {
  "use strict";

  const S = (typeof SITE !== "undefined" && SITE) || null;
  const $ = (sel, root = document) => root.querySelector(sel);
  const has = (a) => Array.isArray(a) && a.length > 0;
  const txt = (v) => (typeof v === "string" ? v.trim() : "");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked: ignore */ } }
  };

  // tiny element builder: el("p", { class: "x", text: "hi" }, child, child)
  function el(tag, attrs, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined || v === false || v === "") continue;
      if (k === "class") n.className = v;
      else if (k === "text") n.textContent = v;
      else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid === null || kid === undefined || kid === false || kid === "") continue;
      n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return n;
  }

  /* ---------------- toast ---------------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------------- board color ---------------- */
  const MASKS = [
    ["blue", "#123257", "Blue"],
    ["green", "#1a4a33", "Green"],
    ["black", "#17191c", "Black"],
    ["purple", "#34205a", "Purple"],
    ["red", "#6a1b1f", "Red"]
  ];
  const maskIds = MASKS.map((m) => m[0]);
  function setMask(id, announce) {
    if (!maskIds.includes(id)) id = "blue";
    document.documentElement.setAttribute("data-mask", id);
    document.querySelectorAll(".swatch").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mask === id)));
    if (announce) { store.set("board-color", id); toast(MASKS.find((m) => m[0] === id)[2] + " solder mask"); }
    Board.redraw();
  }
  function initMasks() {
    const box = $("#swatches");
    if (!box) return;
    for (const [id, color, label] of MASKS) {
      const b = el("button", { class: "swatch", type: "button", "data-mask": id, "aria-label": label + " board", title: label, "aria-pressed": "false" });
      b.style.setProperty("--c", color);
      b.addEventListener("click", () => setMask(id, true));
      box.append(b);
    }
    const saved = store.get("board-color");
    setMask(saved || (S && S.boardColor) || "blue", false);
  }

  /* ---------------- hero ---------------- */
  function renderHero() {
    const name = txt(S.name) || "Your Name";
    document.title = name;
    $("#brand-name").textContent = name;
    $("#brand-mark").textContent = txt(S.initials) || name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    $("#hero-roles").textContent = (S.roles || []).join(" / ");
    const h1 = $("#hero-name");
    h1.textContent = "";
    name.split(/\s+/).forEach((w) => h1.append(el("span", { text: w })));
    $("#hero-tagline").textContent = txt(S.tagline);
    $("#hero-intro").textContent = txt(S.intro);

    const sensor = $("#hero-photo");
    sensor.textContent = "";
    const showInitials = () => { sensor.textContent = ""; sensor.append(el("span", { class: "initials", text: txt(S.initials) || name[0] })); };
    if (txt(S.photo)) {
      const img = el("img", { src: S.photo, alt: "Photo of " + name, width: "400", height: "500" });
      img.addEventListener("error", showInitials, { once: true });
      sensor.append(img);
    } else showInitials();
  }

  /* ---------------- sections ---------------- */
  function sectionText(key) {
    const s = (S.sections && S.sections[key]) || {};
    return { menu: txt(s.menu) || key, title: txt(s.title) || txt(s.menu) || key, lede: txt(s.lede) };
  }

  function contactItems() {
    const c = S.contact || {};
    const out = [];
    if (txt(c.email)) out.push({ label: "Email", value: c.email.trim(), href: "mailto:" + c.email.trim(), copy: true });
    if (txt(c.github)) out.push({ label: "GitHub", value: c.github.trim().replace(/^https?:\/\/(www\.)?/, ""), href: c.github.trim() });
    if (txt(c.linkedin)) out.push({ label: "LinkedIn", value: c.linkedin.trim().replace(/^https?:\/\/(www\.)?/, ""), href: c.linkedin.trim() });
    if (txt(c.instagram)) out.push({ label: "Instagram", value: c.instagram.trim().replace(/^https?:\/\/(www\.)?/, ""), href: c.instagram.trim() });
    if (txt(c.spotify)) out.push({ label: "Spotify", value: c.spotify.trim().replace(/^https?:\/\/(open\.)?/, "").replace(/\?.*$/, ""), href: c.spotify.trim() });
    return out;
  }

  const SECTIONS = [
    { key: "about", show: () => has(S.about) || has(S.specs) || has(S.skills), render: renderAbout },
    { key: "projects", show: () => has(S.projects), render: renderProjects },
    { key: "work", show: () => has(S.experience), render: () => renderBom(S.experience) },
    { key: "leadership", show: () => has(S.leadership), render: () => renderBom(S.leadership) },
    { key: "awards", show: () => has(S.awards), render: () => renderHoles(S.awards) },
    { key: "sports", show: () => has(S.sports), render: () => renderHoles(S.sports) },
    { key: "interests", show: () => has(S.interests) || !!spotifyLink(), render: renderInterests },
    { key: "contact", show: () => contactItems().length > 0, render: renderContact }
  ];

  function renderSections() {
    const wrap = $("#sections");
    const edge = $("#edge");
    wrap.textContent = "";
    edge.textContent = "";
    const visible = SECTIONS.filter((s) => { try { return s.show(); } catch (e) { return false; } });
    visible.forEach((sec, i) => {
      const t = sectionText(sec.key);
      const ref = (txt(S.connectorLetter) || "F").slice(0, 2) + (i + 1);
      const region = el("section", { class: "region", id: sec.key, "aria-labelledby": sec.key + "-title" },
        el("span", { class: "refdes", "aria-hidden": "true", text: ref }),
        el("h2", { id: sec.key + "-title", text: t.title }),
        t.lede ? el("p", { class: "lede", text: t.lede }) : null,
        sec.render()
      );
      wrap.append(region);
      edge.append(el("a", { class: "finger", href: "#" + sec.key },
        el("span", { class: "lbl", text: t.menu }),
        el("span", { class: "pad", "aria-hidden": "true", text: ref })
      ));
    });
    const n = visible.length;
    edge.style.setProperty("--n", n);
    edge.style.setProperty("--n-small", n <= 4 ? n : Math.ceil(n / 2));
  }

  function renderAbout() {
    const frag = document.createDocumentFragment();
    const grid = el("div", { class: "about-grid" });
    if (has(S.about)) grid.append(el("div", { class: "about-text" }, S.about.map((p) => el("p", { text: p }))));
    if (has(S.specs)) {
      const rows = S.specs.filter((r) => Array.isArray(r) && txt(r[0])).map((r) =>
        el("tr", {}, el("th", { scope: "row", text: r[0] }), el("td", { text: r[1] || "" })));
      grid.append(el("div", { class: "specs" },
        el("p", { class: "specs-title", text: "Key specifications" }),
        el("table", {}, el("tbody", {}, rows))));
    }
    frag.append(grid);
    if (has(S.skills)) {
      frag.append(el("div", { class: "skills" }, S.skills.map((g) =>
        el("div", { class: "skill-group" },
          el("h3", { text: g.group }),
          el("ul", { class: "chips" }, (g.items || []).map((s) => el("li", { text: s })))))));
    }
    return frag;
  }

  const STATUS = { progress: "In progress", done: "Complete", ongoing: "Ongoing" };

  function renderProjects() {
    return el("div", { class: "parts" }, S.projects.map((p, i) => {
      const status = STATUS[p.status] ? p.status : "done";
      return el("article", { class: "part" },
        el("div", { class: "part-head" },
          el("span", { class: "led", "data-status": status, "aria-hidden": "true" }),
          el("span", { text: STATUS[status] }),
          txt(p.when) ? el("span", { class: "when", text: p.when }) : null),
        el("h3", { text: p.title }),
        txt(p.award) ? el("span", { class: "badge", text: p.award }) : null,
        el("p", { text: p.summary }),
        has(p.tags) ? el("ul", { class: "chips", "aria-label": "Tags" }, p.tags.map((t) => el("li", { text: t }))) : null,
        el("button", { class: "btn", type: "button", onclick: () => openSheet(p, i) }, "Open datasheet")
      );
    }));
  }

  function renderBom(list) {
    const frag = document.createDocumentFragment();
    frag.append(el("div", { class: "bom-head", "aria-hidden": "true" }, el("span", { text: "Role / organization" }), el("span", { text: "When" })));
    frag.append(el("ul", { class: "bom" }, list.map((r) =>
      el("li", {},
        el("div", {},
          el("h3", { text: r.role }),
          txt(r.org) ? el("p", { class: "org", text: r.org }) : null,
          txt(r.text) ? el("p", { class: "desc", text: r.text }) : null),
        el("span", { class: "when", text: txt(r.when) || "" })))));
    return frag;
  }

  function renderHoles(list) {
    return el("div", { class: "holes" }, list.map((a) =>
      el("div", { class: "hole" },
        el("span", { class: "via", "aria-hidden": "true" }),
        el("div", {}, el("h3", { text: a.title }), txt(a.text) ? el("p", { text: a.text }) : null))));
  }

  /* Spotify: playlists, songs, albums, artists and podcasts can play on the page */
  function spotifyLink() { return txt((S.contact || {}).spotify); }
  function spotifyEmbed() {
    const m = spotifyLink().match(/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)/);
    return m ? "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?theme=0" : "";
  }

  function renderInterests() {
    const frag = document.createDocumentFragment();
    if (has(S.interests)) frag.append(renderHoles(S.interests));
    const src = spotifyEmbed();
    if (src) {
      frag.append(el("div", { class: "player" },
        el("p", { class: "player-label", text: txt(S.spotifyLabel) || "On repeat" }),
        el("iframe", { src, title: "Spotify player", loading: "lazy", height: "152",
          allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" })));
    } else if (spotifyLink()) { // a profile link can't play on the page, so it's a button
      frag.append(el("div", { class: "player" },
        el("p", { class: "player-label", text: txt(S.spotifyLabel) || "On repeat" }),
        el("a", { class: "btn", href: spotifyLink(), target: "_blank", rel: "noopener" }, "Open my Spotify")));
    }
    return frag;
  }

  function renderContact() {
    return el("ul", { class: "contact-list" }, contactItems().map((c) => {
      const actions = el("div", { class: "contact-actions" });
      if (c.copy) {
        actions.append(el("button", { class: "btn", type: "button", onclick: () => copyText(c.value) }, "Copy"));
        actions.append(el("a", { class: "btn", href: c.href }, "Email"));
      } else {
        actions.append(el("a", { class: "btn", href: c.href, target: "_blank", rel: "noopener" }, "Open"));
      }
      return el("li", {},
        el("span", { class: "contact-label", text: c.label }),
        el("span", { class: "contact-value", text: c.value }),
        actions);
    }));
  }

  function copyText(value) {
    const done = () => toast("Copied " + value);
    try {
      navigator.clipboard.writeText(value).then(done, () => toast("Select the address to copy it"));
    } catch (e) { toast("Select the address to copy it"); }
  }

  /* ---------------- datasheet pop-up ---------------- */
  let lastOpener = null;
  function openSheet(p, i) {
    const dlg = $("#sheet");
    const status = STATUS[p.status] ? p.status : "done";
    $("#sheet-pn").textContent = "Datasheet · PN " + (txt(S.initials) || "FA") + "-" + String(i + 1).padStart(3, "0");
    $("#sheet-title").textContent = p.title;
    const body = $("#sheet-body");
    body.textContent = "";
    const parts = [
      el("div", { class: "sheet-meta" },
        el("span", {}, el("span", { class: "led", "data-status": status, "aria-hidden": "true" }), STATUS[status]),
        txt(p.when) ? el("span", { text: p.when }) : null),
      el("h3", { text: "Overview" }),
      el("p", { text: p.summary }),
      has(p.details) ? el("h3", { text: "Details" }) : null,
      has(p.details) ? el("ul", {}, p.details.map((d) => el("li", { text: d }))) : null,
      txt(p.award) ? el("h3", { text: "Recognition" }) : null,
      txt(p.award) ? el("span", { class: "badge", text: p.award }) : null,
      has(p.tags) ? el("h3", { text: "Built with" }) : null,
      has(p.tags) ? el("ul", { class: "chips" }, p.tags.map((t) => el("li", { text: t }))) : null,
      txt(p.link) ? el("h3", { text: "Link" }) : null,
      txt(p.link) ? el("a", { class: "btn", href: p.link, target: "_blank", rel: "noopener" }, txt(p.linkLabel) || "Visit") : null
    ];
    body.append(...parts.filter(Boolean));
    lastOpener = document.activeElement;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    body.scrollTop = 0;
  }
  function closeSheet() {
    const dlg = $("#sheet");
    if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
  }
  function initSheet() {
    const dlg = $("#sheet");
    $("#sheet-close").addEventListener("click", closeSheet);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) closeSheet(); });
    dlg.addEventListener("close", () => { if (lastOpener && lastOpener.focus) lastOpener.focus(); });
  }

  /* ---------------- footer ---------------- */
  function renderFooter() {
    const year = new Date().getFullYear();
    $("#footer-copy").textContent = "© " + year + " " + (txt(S.name) || "");
    $("#footer-rev").textContent = "Rev " + year + (txt(S.updated) ? " · Updated " + S.updated : "");
  }

  /* ---------------- background traces (canvas) ---------------- */
  const Board = (function () {
    const canvas = document.getElementById("board");
    const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let traces = [], base = null, w = 0, h = 0, dpr = 1, raf = 0;

    function rng(seed) { // mulberry32
      return function () {
        seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

    function build() {
      const rand = rng(42);
      const step = 26;
      const cols = Math.ceil(w / step) + 1, rows = Math.ceil(h / step) + 1;
      const used = new Set();
      const key = (x, y) => x + "," + y;
      traces = [];
      const attempts = Math.round((w * h) / 7000);
      for (let a = 0; a < attempts; a++) {
        let x = Math.floor(rand() * cols), y = Math.floor(rand() * rows);
        if (used.has(key(x, y))) continue;
        let d = Math.floor(rand() * 4) * 2; // start straight
        const pts = [[x, y]];
        used.add(key(x, y));
        const len = 3 + Math.floor(rand() * 24);
        for (let s = 0; s < len; s++) {
          if (s > 1 && rand() < 0.2) d = (d + (rand() < 0.5 ? 1 : 7)) % 8; // 45° bend
          const nx = x + DIRS[d][0], ny = y + DIRS[d][1];
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || used.has(key(nx, ny))) break;
          x = nx; y = ny; used.add(key(x, y)); pts.push([x, y]);
        }
        if (pts.length > 3) traces.push({ pts: pts.map(([px, py]) => [px * step, py * step]), wide: rand() < 0.25 });
      }
    }

    function color(name, fallback) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    }

    function drawBase() {
      base = document.createElement("canvas");
      base.width = w * dpr; base.height = h * dpr;
      const b = base.getContext("2d");
      b.scale(dpr, dpr);
      const trace = color("--trace", "#1d4775"), hole = color("--mask-deep", "#0b2240");
      b.lineCap = "round"; b.lineJoin = "round"; b.strokeStyle = trace;
      for (const t of traces) {
        b.lineWidth = t.wide ? 5 : 2.5;
        b.beginPath();
        t.pts.forEach(([x, y], i) => (i ? b.lineTo(x, y) : b.moveTo(x, y)));
        b.stroke();
      }
      for (const t of traces) {
        for (const [x, y] of [t.pts[0], t.pts[t.pts.length - 1]]) {
          b.fillStyle = trace; b.beginPath(); b.arc(x, y, t.wide ? 6 : 4.5, 0, Math.PI * 2); b.fill();
          b.fillStyle = hole; b.beginPath(); b.arc(x, y, t.wide ? 2.6 : 1.9, 0, Math.PI * 2); b.fill();
        }
      }
    }

    function paint() {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (base) ctx.drawImage(base, 0, 0);
    }

    function resize() {
      if (!ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      build(); drawBase(); paint();
    }

    function redraw() { if (!ctx || !w) return; drawBase(); paint(); }

    // one-time "power on": signals run down a few traces
    function pulse() {
      if (!ctx || reduce || !traces.length) return;
      cancelAnimationFrame(raf);
      const runs = traces
        .map((t) => ({ t, len: t.pts.reduce((s, p, i) => i ? s + Math.hypot(p[0] - t.pts[i - 1][0], p[1] - t.pts[i - 1][1]) : 0, 0) }))
        .filter((r) => r.len > 220)
        .sort((a, b) => b.len - a.len)
        .slice(0, 14)
        .map((r, i) => ({ ...r, delay: i * 110 }));
      const gold = color("--gold-hi", "#f1cf80");
      const dur = 1500;
      const start = performance.now();
      function at(t, dist) {
        let left = dist;
        for (let i = 1; i < t.pts.length; i++) {
          const [x0, y0] = t.pts[i - 1], [x1, y1] = t.pts[i];
          const seg = Math.hypot(x1 - x0, y1 - y0);
          if (left <= seg) { const f = left / seg; return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]; }
          left -= seg;
        }
        return t.pts[t.pts.length - 1];
      }
      function frame(now) {
        paint();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        let alive = false;
        for (const r of runs) {
          const k = (now - start - r.delay) / dur;
          if (k < 0) { alive = true; continue; }
          if (k > 1) continue;
          alive = true;
          const e = 1 - Math.pow(1 - k, 2);
          const [x, y] = at(r.t, e * r.len);
          const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
          g.addColorStop(0, gold); g.addColorStop(1, "rgba(241,207,128,0)");
          ctx.globalAlpha = Math.sin(Math.PI * Math.min(1, k * 1.05));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (alive) raf = requestAnimationFrame(frame); else paint();
      }
      raf = requestAnimationFrame(frame);
    }

    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (window.innerWidth !== w || Math.abs(window.innerHeight - h) > 120) resize(); }, 150);
    });
    return { resize, redraw, pulse };
  })();

  /* ---------------- Konami code easter egg ---------------- */
  function initKonami() {
    const code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
    let pos = 0;
    window.addEventListener("keydown", (e) => {
      const k = (e.key || "").toLowerCase();
      pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
      if (pos === code.length) {
        pos = 0;
        const on = document.documentElement.classList.toggle("overclock");
        toast(on ? "Overclocked to 4.2 GHz" : "Back to stock clocks");
        if (on) Board.pulse();
      }
    });
  }

  /* ---------------- start ---------------- */
  function showError() {
    const box = el("div", { class: "oops", role: "alert" },
      el("strong", { text: "content.js has a mistake, so the page can't load your text. " }),
      "Open assets/js/content.js and check your last edit for a missing quote (\"), comma (,) or bracket. ",
      "Pressing F12 and opening the Console tab shows the line number.");
    $("#sections").append(box);
  }

  function start() {
    Board.resize();
    if (!S) { showError(); return; }
    try {
      initMasks();
      renderHero();
      renderSections();
      renderFooter();
      initSheet();
      initKonami();
    } catch (err) {
      console.error(err);
      showError();
    }
    // jump to a section if the link had one (#projects etc.)
    if (location.hash && location.hash.length > 1) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
    setTimeout(Board.pulse, 350);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
