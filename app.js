/* تحدّي المدرجات — منطق اللعبة (الإصدار 2) */
(function () {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const CFG = window.CFG || {};
const LADDER = [100,200,400,700,1000,2000,3500,5000,10000,20000,40000,75000,150000,300000,600000,1000000];
const SAFE = [4, 9]; // بعد السؤال 5 و 10
const RANKS = [[0,"مبتدئ"],[5000,"هاوي"],[40000,"محترف"],[200000,"ممتاز"],[1000000,"عالمي"]];
const SEASON_GEMS = [0, 100, 250, 600, 1500]; // مكافأة نهاية الموسم حسب الرتبة
const seasonId = () => { const d = new Date(); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0"); }; // الموسم بيبدأ وينتهي 12 بالليل بتوقيت جرينتش (UTC)
const seasonMsLeft = () => { const d = new Date(); return Math.max(0, Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - Date.now()); };
const fmtLeft = () => { const ms = seasonMsLeft(), d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); return d > 0 ? d + " يوم و" + h + " ساعة" : h + " ساعة و" + m + " دقيقة"; };
const seasonParts = () => { const ms = seasonMsLeft(); return [Math.floor(ms / 864e5), Math.floor(ms % 864e5 / 36e5), Math.floor(ms % 36e5 / 6e4)]; };
const seasonBar = () => { clearInterval(window.__sl); window.__sl = setInterval(() => { const e = document.getElementById("sbx"); if (!e) return clearInterval(window.__sl); const p = seasonParts(); e.querySelectorAll("[data-t]").forEach((x, i) => x.textContent = p[i]); }, 30000);
  const p = seasonParts(), nx = RANKS.find(r => r[0] > S.points), pv = [...RANKS].reverse().find(r => r[0] <= S.points), pct = nx ? Math.round((S.points - pv[0]) / (nx[0] - pv[0]) * 100) : 100, t = (v, l) => `<div class="sbt"><b data-t>${v}</b><small>${l}</small></div>`;
  return `<div class="sbox" id="sbx"><div class="sbh">🏁 نهاية الموسم بعد</div><div class="sbtiles">${t(p[0], "يوم")}${t(p[1], "ساعة")}${t(p[2], "دقيقة")}</div><div class="sbr"><span>★ ${rankOf(S.points)} · ${num(S.points)} نقطة</span><span>${nx ? "الجاية: " + nx[1] : "أعلى رتبة 👑"}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`; };
const DAILY_GEMS = [50,75,100,150,200,300,500];
const LL = {
  coach: { ic: "🧠", nm: "المدرب", price: 40 },
  vr:    { ic: "🎥", nm: "VAR", price: 60 },
  time:  { ic: "⏱", nm: "وقت إضافي", price: 30 },
  gold:  { ic: "⭐", nm: "هدف ذهبي", price: 40 }
};
const LET = ["أ","ب","ج","د"];
const GAME_N = { classic: 16, daily: 10, speed: 40, survive: 60, tour: 12, transfer: 10 };
const STAGES = ["دور المجموعات", "ربع النهائي", "نصف النهائي", "النهائي"], STAGE_PAY = [0.1, 0.2, 0.3, 0.6];
/* ---------- البطولات ---------- */
const TOURS = [
  { k: "ucl", fee: 400,   g: "club", ic: "⭐", nm: "دوري أبطال أوروبا",   ds: "أقوى بطولة أندية في العالم" },
  { k: "caf", fee: 150,   g: "club", ic: "🌍", nm: "دوري أبطال أفريقيا",  ds: "الأهلي والزمالك والترجي والوداد وغيرهم" },
  { k: "afc", fee: 150,   g: "club", ic: "🌏", nm: "دوري أبطال آسيا",     ds: "من الهلال والعين لأوراوا وأولسان" },
  { k: "euro", fee: 400,  g: "nat",  ic: "🇪🇺", nm: "أمم أوروبا (اليورو)", ds: "تاريخ كأس أمم أوروبا ونجومها" },
  { k: "afcon", fee: 250, g: "nat",  ic: "🦁", nm: "كأس أمم أفريقيا",     ds: "الفراعنة والأسود وكل أبطال القارة" },
  { k: "asian", fee: 250, g: "nat",  ic: "🥇", nm: "كأس آسيا (أمم آسيا)", ds: "من اليابان للسعودية وقطر والعراق" },
  { k: "wc", fee: 1000,    g: "nat",  ic: "🏆", nm: "كأس العالم",          ds: "أعظم بطولة في تاريخ كرة القدم" }
];
const TOUR_RE = {
  ucl: /أبطال أوروبا|أوروبا للأندية|الأندية الأوروبية|دوري الأبطال/,
  caf: /أبطال أفريقيا/, afc: /أبطال آسيا/,
  euro: /أمم أوروبا|يورو ?(19|20)\d\d/,
  afcon: /أمم أفريقيا/, asian: /كأس آسيا/,
  wc: /كأس العالم(?! للأندية)/
};
// وسم البطولة: العنصر السابع في السؤال لو موجود، وإلا بنصنّفه من نص السؤال
function tagsOf(r) {
  if (r[6]) return String(r[6]).split(",");
  const q = r[0], out = [];
  Object.keys(TOUR_RE).forEach(k => { if (TOUR_RE[k].test(q)) out.push(k); });
  if (out.includes("ucl") && (out.includes("caf") || out.includes("afc") || /أفريقيا|آسيا/.test(q))) out.splice(out.indexOf("ucl"), 1);
  return out;
}

/* ---------- أدوات ---------- */
const today = () => { const d = new Date(); return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); };
const yesterday = () => { const d = new Date(Date.now() - 864e5); return d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate(); };
const fmt = n => n >= 1e6 ? "مليون" : n >= 1000 ? (n/1000) + " ألف" : String(n);
const num = n => Number(n).toLocaleString("en-US");
const shuffle = a => { a = a.slice(); for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const hashStr = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const qid = r => hashStr(r[0]);
async function sha(s) {
  try { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("fm:" + s));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join(""); }
  catch (e) { return "h" + hashStr("fm:" + s); }
}
const rankOf = p => { let r = RANKS[0][1]; RANKS.forEach(x => { if (p >= x[0]) r = x[1]; }); return r; };
const firebaseOn = () => CFG.FIREBASE && CFG.FIREBASE.apiKey;

/* ---------- صوت واهتزاز ونطق ---------- */
let AC;
function ctx() { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); return AC; }
function beep(f, d, type, when) {
  if (!S || !S.set.sound) return;
  try {
    const c = ctx(), o = c.createOscillator(), g = c.createGain();
    o.type = type || "sine"; o.frequency.value = f;
    const t = c.currentTime + (when || 0);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.18, t + .02);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .02);
  } catch (e) {}
}
function noise(dur, f0, f1, vol, when) { // ضجيج مفلتر = صوت جمهور/تصفيق
  if (!S || !S.set.sound) return;
  try {
    const c = ctx(), n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = .8;
    const t = c.currentTime + (when || 0);
    f.frequency.setValueAtTime(f0, t); f.frequency.linearRampToValueAtTime(f1, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * .25); g.gain.linearRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t);
  } catch (e) {}
}
const sfx = {
  tap: () => beep(740, .05, "sine"),
  ok: () => { beep(784,.09,"sine"); beep(988,.09,"sine",.09); beep(1319,.16,"sine",.18); },
  no: () => { beep(196,.18,"square"); beep(147,.28,"square",.16); },
  tick: () => beep(1250, .025, "sine"),
  win: () => [392,494,587,740,988,1175].forEach((f,i) => beep(f,.14,"sine",i*.09)),
  cheer: (big) => { noise(big ? 3 : 1.6, 500, 1900, big ? .5 : .35); for (let i = 0; i < (big ? 26 : 12); i++) noise(.05, 2600, 2600, .3, .15 + i * .09 + Math.random() * .05); },
  boo: () => { noise(1.3, 450, 160, .3); beep(170, .6, "sawtooth", .1); },
  boom: () => { for (let i = 0; i < 5; i++) { noise(.35, 900, 120, .45, i * .35); beep(110, .25, "sine", i * .35); } }
};
function speak(t) {
  try {
    if (!S || !S.set.voice || !window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t); u.lang = "ar-SA"; u.rate = 1.05; u.pitch = 1.1;
    speechSynthesis.speak(u);
  } catch (e) {}
}
const vib = ms => { try { if (S && S.set.vibrate && navigator.vibrate) navigator.vibrate(ms); } catch (e) {} };

/* ---------- الحفظ ---------- */
let SES = lsGet("fm_session", null);
let CLOUD_READY = false;
let S = null;
const defData = () => ({
  gems: 200, points: 0, xp: 0,
  stats: { games: 0, correct: 0, wrong: 0, best: 0, millions: 0, streak: 0, bestStreak: 0, dailyDone: 0, duelWins: 0, duelGames: 0 },
  daily: { last: "", streak: 0, claimedToday: false },
  mis: { date: "", correct: 0, c10: false, c25: false },
  dc: "", inv: { coach: 0, vr: 0, time: 0, gold: 0 },
  seen: [], pack: [], skill: 0, hist: [], ach: {}, tour: {}, set: { sound: true, vibrate: true, voice: true }
});
function seasonTick() {
  const sid = seasonId();
  if (!S.season) { S.life = (S.life || 0) + (S.points || 0); S.points = 0; S.season = sid; save(); }
  else if (S.season !== sid) {
    let ri = 0; RANKS.forEach((x, i) => { if (S.points >= x[0]) ri = i; });
    const g = SEASON_GEMS[ri] || 0; S.gems += g; S.life = (S.life || 0) + S.points;
    S.lastSeason = { id: S.season, rank: RANKS[ri][1], pts: S.points, gems: g, seen: false };
    S.points = 0; S.season = sid; save();
  }
}
function applyData(raw) {
  S = Object.assign(defData(), raw || {});
  S.set = Object.assign({ sound: true, vibrate: true, voice: true }, S.set);
  S.stats = Object.assign(defData().stats, S.stats);
  S.inv = Object.assign(defData().inv, S.inv);
  if (S.mis.date !== today()) S.mis = { date: today(), correct: 0, c10: false, c25: false };
  if (S.daily.last !== today()) S.daily.claimedToday = false;
  seasonTick();
  if (!S.pack || !S.pack.length) buildPack();
}
function loadData() { if (!SES) return; applyData(lsGet("fm_data_" + SES.id, {})); }
const save = () => { if (SES && S) { S.ts = Date.now(); lsSet("fm_data_" + SES.id, S); if (CLOUD_READY) schedulePush(); } };

/* ---------- الحفظ السحابي (Firebase) — بياناتك بترجع لك عند أي تسجيل دخول ---------- */
const dbBase = () => String(CFG.FIREBASE_DB || "").replace(/\/+$/, "");
const isCloudUser = s => !!(firebaseOn() && dbBase() && s && !s.guest && s.email && String(s.id).length >= 20);
const cleanKeys = o => Array.isArray(o) ? o.map(cleanKeys) : (o && typeof o === "object" ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/[.$#\[\]\/]/g, "_"), cleanKeys(v)])) : o);
async function fbToken(force) {
  const t = lsGet("fm_tok", null); if (!t || !SES || t.uid !== SES.id) return "";
  if (!force && Date.now() < t.exp) return t.idToken;
  try {
    const r = await fetch("https://securetoken.googleapis.com/v1/token?key=" + CFG.FIREBASE.apiKey, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "grant_type=refresh_token&refresh_token=" + encodeURIComponent(t.refresh) });
    const j = await r.json(); if (!r.ok) return "";
    const n = { uid: t.uid, idToken: j.id_token, refresh: j.refresh_token || t.refresh, exp: Date.now() + (+j.expires_in || 3600) * 1000 - 60000 };
    lsSet("fm_tok", n); return n.idToken;
  } catch (e) { return ""; }
}
async function cloudReq(method, id, body, keep) {
  for (let k = 0; k < 2; k++) {
    const tok = await fbToken(k > 0), ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 9000);
    try {
      const r = await fetch(dbBase() + "/users/" + encodeURIComponent(id) + ".json" + (tok ? "?auth=" + encodeURIComponent(tok) : ""), { method, signal: ctl.signal, keepalive: !!keep, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
      if ((r.status === 401 || r.status === 403) && k === 0 && tok) continue;
      if (!r.ok) throw new Error("db" + r.status);
      return await r.json();
    } finally { clearTimeout(to); }
  }
  throw new Error("auth");
}
function cloudDoc() { const d = Object.assign({}, S); delete d.pack; delete d._pend; return { ts: S.ts || Date.now(), name: SES.name, data: cleanKeys(d) }; }
let pushT = null;
function schedulePush(ms) { clearTimeout(pushT); pushT = setTimeout(pushNow, ms || 3000); }
async function pushNow(keep) {
  clearTimeout(pushT);
  if (!CLOUD_READY || !SES || !S || !isCloudUser(SES) || !online()) return;
  try { await cloudReq("PUT", SES.id, cloudDoc(), keep === true); } catch (e) { schedulePush(15000); }
}
let syncT = null;
async function cloudSync() {
  clearTimeout(syncT);
  if (!SES || !S || !isCloudUser(SES) || !online()) return;
  const id = SES.id; let cd;
  try { cd = await cloudReq("GET", id); } catch (e) { syncT = setTimeout(cloudSync, 20000); return; }
  if (!SES || SES.id !== id) return;
  if (cd && cd.data && (S._pend || (cd.ts || 0) > (S.ts || 0))) {
    if (cd.name) { SES.name = cd.name; lsSet("fm_session", SES); }
    applyData(cd.data); CLOUD_READY = true; save();
    if (["home", "profile", "stats", "rewards", "settings", "board", "challenges"].includes(screen)) R[screen]();
  } else { delete S._pend; CLOUD_READY = true; save(); pushNow(); }
}

/* ---------- الأسئلة (أونلاين دايماً جديدة / أوفلاين حزمة محفوظة) ---------- */
const BUNDLED = window.BUNDLED_QUESTIONS || [];
let REMOTE = lsGet("fm_remote", []);
const online = () => navigator.onLine !== false;
const PACK_N = 500; // عدد الأسئلة المحفوظة للأوفلاين
let LAST_ADDED = 0; // عدد الأسئلة الجديدة اللي نزلت في آخر تحديث
const remoteConfigured = () => CFG.QUESTIONS_URL && !/USERNAME|REPO/.test(CFG.QUESTIONS_URL);
function validQ(r) { return Array.isArray(r) && r.length >= 6 && r.slice(0,5).every(x => typeof x === "string" && x) && new Set(r.slice(1,5)).size === 4 && r[5] >= 1 && r[5] <= 3; }
// ملفات إضافية بتتحمّل جنب questions.json (لو مش موجودة بيتجاهلها من غير مشكلة)
const EXTRA_FILES = CFG.EXTRA_FILES || ["questions-extra.json", "transfers.json"];
async function fetchList(url) {
  const ctl = new AbortController(), to = setTimeout(() => ctl.abort(), 8000);
  try {
    const res = await fetch(url + "?t=" + Date.now(), { signal: ctl.signal, cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : (data.questions || []);
  } catch (e) { return null; } finally { clearTimeout(to); }
}
async function refreshQuestions() {
  if (!online() || !remoteConfigured()) return false;
  try {
    const base = await fetchList(CFG.QUESTIONS_URL);
    if (!base) return false;
    const dir = CFG.QUESTIONS_URL.replace(/[^\/]*$/, "");
    const extras = await Promise.all(EXTRA_FILES.map(f => fetchList(dir + f)));
    const arr = base.concat(...extras.map(x => x || [])).filter(validQ);
    if (arr.length >= 10) {
      REMOTE = arr; lsSet("fm_remote", arr); if (S) topUpPack(); return true;
    }
  } catch (e) {}
  return false;
}
const isTr = r => r[6] === "tr"; // وسم قسم «اعرف اللاعب من انتقالاته»
function poolAny() {
  const m = new Map();
  BUNDLED.concat(REMOTE).forEach(r => { if (validQ(r)) m.set(qid(r), r); });
  return Array.from(m.values());
}
function poolAll() { return poolAny().filter(r => !isTr(r)); }
const poolTr = () => poolAny().filter(isTr);
// حزمة الأوفلاين: 200 سؤال، بنفضّل فيها الأسئلة اللي اللاعب لسه ماشافهاش
function buildPack() {
  if (!S) return;
  const seen = new Set(S.seen), all = poolAll(), pack = [], ids = new Set();
  const rem = new Set(REMOTE.map(qid));
  const add = r => { if (pack.length < PACK_N && !ids.has(qid(r))) { ids.add(qid(r)); pack.push(r); } };
  [175, 200, 125].forEach((n, i) => {
    const tier = shuffle(all.filter(r => r[5] === i + 1));
    const fresh = tier.filter(r => !seen.has(qid(r))), old = tier.filter(r => seen.has(qid(r)));
    const freshNew = fresh.filter(r => rem.has(qid(r))), freshOld = fresh.filter(r => !rem.has(qid(r)));
    freshNew.concat(freshOld, old).slice(0, n).forEach(add);
  });
  // لو فئة ناقصة (مثلاً الصعب قليل) نكمّل لحد 200 من باقي الأسئلة
  shuffle(all.filter(r => !seen.has(qid(r))).concat(all)).forEach(add);
  S.pack = pack; save();
}
// تكملة الحزمة: بنشيل الأسئلة اللي اتلعبت، وبنجيب أسئلة جديدة خالص (ماظهرتش قبل كده) لحد ما الحزمة ترجع 500
function topUpPack() {
  if (!S) return;
  if (!S.pack || !S.pack.length) { buildPack(); LAST_ADDED = S.pack.length; return; }
  const seen = new Set(S.seen);
  const keep = S.pack.filter(r => validQ(r) && !seen.has(qid(r)));
  const ids = new Set(keep.map(qid));
  const need = PACK_N - keep.length;
  const fresh = shuffle(poolAll().filter(r => !seen.has(qid(r)) && !ids.has(qid(r)))).slice(0, Math.max(0, need));
  S.pack = keep.concat(fresh); LAST_ADDED = fresh.length; save();
}
function poolOffline() {
  const m = new Map();
  (S.pack || []).forEach(r => { if (validQ(r)) m.set(qid(r), r); });
  if (m.size < 60) shuffle(BUNDLED.filter(r => !isTr(r))).forEach(r => { if (m.size < 150) m.set(qid(r), r); });
  return Array.from(m.values());
}
function markServed(q) {
  S.seen = S.seen.filter(x => x !== q.id); S.seen.push(q.id);
  if (S.seen.length > 6000) S.seen = S.seen.slice(-6000);
  save();
}
const REMOTE_IDS = () => new Set(REMOTE.map(qid));
const tourPool = k => poolAll().filter(r => tagsOf(r).includes(k));
// اختيار سؤال داخل بطولة: أسئلة البطولة بس، والجديد أولاً، والأقرب في الصعوبة
function pickTour(t, used) {
  const pool = tourPool(G.tour), seen = new Set(S.seen), free = r => !used.has(qid(r));
  const order = [0, 1, -1, 2, -2];
  for (const onlyNew of [true, false]) {
    for (const d of order) {
      const tt = t + d; if (tt < 1 || tt > 3) continue;
      const c = pool.filter(r => r[5] === tt && free(r) && (!onlyNew || !seen.has(qid(r))));
      if (c.length) return c[Math.floor(Math.random() * c.length)];
    }
  }
  const c = pool.filter(free);
  return c.length ? c[Math.floor(Math.random() * c.length)] : null;
}
function pickTr(t, used) {
  const pool = poolTr(), seen = new Set(S.seen), free = r => !used.has(qid(r));
  for (const onlyNew of [true, false]) {
    for (const d of [0, 1, -1, 2, -2]) {
      const tt = t + d; if (tt < 1 || tt > 3) continue;
      const c = pool.filter(r => r[5] === tt && free(r) && (!onlyNew || !seen.has(qid(r))));
      if (c.length) return c[Math.floor(Math.random() * c.length)];
    }
  }
  const c = pool.filter(free);
  return c.length ? c[Math.floor(Math.random() * c.length)] : null;
}
function pickTier(t, used) {
  if (G && G.mode === "transfer") return pickTr(t, used);
  if (G && G.mode === "tour") return pickTour(t, used);
  const offline = !online();
  const pool = offline ? poolOffline() : poolAll();
  const seen = new Set(S.seen);
  const free = r => !used.has(qid(r));
  let c = [];
  for (const d of [0, 1, -1, 2, -2]) { // الأقرب في الصعوبة أولاً، والجديد قبل المكرر
    const tt = t + d; if (tt < 1 || tt > 3) continue;
    c = pool.filter(r => r[5] === tt && free(r) && !seen.has(qid(r)));
    if (!offline && c.length) { const cr = c.filter(r => REMOTE_IDS().has(qid(r))); if (cr.length) c = cr; } // أونلاين: الجديد من السحابة أولاً
    if (c.length) break;
  }
  if (!c.length && !offline) { // خلّصت كل الأسئلة الجديدة: دورة جديدة لحد ما ينزل غيرها
    S.seen = []; save();
    if (!pickTier.warned) { pickTier.warned = 1; toast("خلّصت كل الأسئلة الجديدة 🎉 هنعيد الدورة لحد ما تنزل أسئلة جديدة"); }
    c = pool.filter(r => r[5] === t && free(r));
  }
  if (!c.length) c = pool.filter(r => free(r) && Math.abs(r[5] - t) <= 1); // أوفلاين: تكرار مسموح
  if (!c.length) c = pool.filter(free);
  if (!c.length) return null;
  return c[Math.floor(Math.random() * c.length)];
}
function norm(r) {
  const opts = shuffle([0,1,2,3]).map(i => ({ t: r[1 + i], ok: i === 0 }));
  return { raw: r, id: qid(r), q: r[0], opts, ans: opts.findIndex(o => o.ok), l: r[5] };
}
// الصعوبة بتزيد مع التقدّم ومع كل إجابة صح (ومستواك العام)
function tierFor() {
  const prog = (G.mode === "classic" || G.mode === "daily" || G.mode === "tour" || G.mode === "transfer") ? G.i / (GAME_N[G.mode] - 1) : Math.min(1, G.right / 12);
  const t = 1 + prog * 2 + S.skill * 0.6 + Math.min(.5, G.streak * .08);
  return Math.max(1, Math.min(3, Math.round(t)));
}

/* ---------- واجهة عامة ---------- */
let screen = "splash", timerId = null, G = null, leaveHook = null;
const app = $("#app");
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.remove("hidden"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.add("hidden"), 2600); }
function modal(html) { const m = $("#modal"); m.innerHTML = '<div class="mbox">' + html + "</div>"; m.classList.remove("hidden"); }
function closeModal() { $("#modal").classList.add("hidden"); $("#modal").innerHTML = ""; }
function confetti(n) {
  const d = document.createElement("div"); d.className = "conf";
  const cols = ["#ffb68a","#f57027","#4ee9ce","#46e8d1","#22c55e","#ffffff","#ff6b6b"];
  n = n || 60;
  for (let i = 0; i < n; i++) { const e = document.createElement("i"); e.style.left = Math.random()*100 + "%"; e.style.background = cols[i % cols.length]; e.style.animationDuration = (1.8 + Math.random()*1.8) + "s"; e.style.animationDelay = Math.random()*.6 + "s"; d.appendChild(e); }
  document.body.appendChild(d); setTimeout(() => d.remove(), 5000);
}
// لافتة رد الفعل: فرحة للإجابة الصح وحزن للغلط
function feedback(kind, text) {
  document.querySelectorAll(".fb").forEach(x => x.remove());
  const d = document.createElement("div"); d.className = "fb " + kind;
  d.innerHTML = `<div class="fbi">${kind === "ok" ? "🎉" : kind === "no" ? "😞" : "⏰"}</div><div class="fbt">${text}</div>`;
  document.body.appendChild(d); setTimeout(() => d.remove(), 1500);
}
function celebrate(big) {
  confetti(big ? 150 : 70); sfx.cheer(big); if (big) sfx.boom();
  const e = document.createElement("div"); e.className = "fw";
  e.textContent = big ? "🎆🎇🏆🎇🎆" : "🎉🏆🎉"; document.body.appendChild(e); setTimeout(() => e.remove(), 2600);
}
function netBadge() { return online() ? '<span class="net on">● أونلاين</span>' : '<span class="net off">● أوفلاين</span>'; }

function header() {
  const name = SES ? SES.name : "";
  return `<div class="top">
    <button class="avatar" data-go="profile">👑</button>
    <div class="who"><b>${esc(name)}</b><small>★ ${rankOf(S.points)}</small></div>
    <div class="gems"><span>💎</span><span>${num(S.gems)}</span><button class="plus" data-go="rewards">+</button></div>
    <button class="ibtn" data-go="board">🏆</button>
    <button class="ibtn" data-go="settings">⚙</button>
  </div>`;
}
function nav(cur) {
  const it = [["home","🏠","الرئيسية"],["challenges","⚡","التحديات"],["tournaments","🏟","البطولات"],["board","🏆","نتائجي"],["profile","👤","حسابي"]];
  return '<div class="nav">' + it.map(x => `<button data-go="${x[0]}" class="${cur === x[0] ? "on" : ""}"><span>${x[1]}</span>${x[2]}</button>`).join("") + "</div>";
}
function go(name, p) {
  stopTimer();
  if (leaveHook) { const h = leaveHook; leaveHook = null; try { h(); } catch (e) {} }
  FM.lock = false; closeModal(); screen = name; window.scrollTo(0, 0); (R[name] || R.home)(p);
}

/* ---------- الشاشات ---------- */
const R = {};

R.splash = function () {
  app.innerHTML = '<div class="splash"><img src="icon.png" alt=""></div>';
  setTimeout(() => {
    loadData();
    if (SES && S) { dailyLogin(); go("home"); refreshQuestions(); cloudSync(); } else go("login");
  }, 1100);
};

/* تسجيل الدخول */
R.login = function (tab) {
  tab = tab || "in";
  app.innerHTML = `<div class="login">
    <img src="icon.png" alt="تحدّي المدرجات">
    <div class="tabs"><button data-tab="in" class="${tab==="in"?"on":""}">تسجيل الدخول</button><button data-tab="up" class="${tab==="up"?"on":""}">حساب جديد</button></div>
    ${tab==="up" ? '<input class="inp" id="nm" placeholder="الاسم في اللعبة" maxlength="20" autocomplete="nickname">' : ""}
    <input class="inp" id="em" type="email" placeholder="البريد الإلكتروني" dir="ltr" autocomplete="email">
    <input class="inp" id="pw" type="password" placeholder="كلمة السر (6 أحرف على الأقل)" dir="ltr" autocomplete="${tab==="up"?"new-password":"current-password"}">
    <div class="err" id="err"></div>
    <button class="btn" id="sub">${tab==="up" ? "إنشاء الحساب" : "دخول"}</button>
    ${tab==="in" && firebaseOn() ? '<button class="btn ghost" id="forgot" style="margin-top:8px">نسيت كلمة السر؟</button>' : ""}
    <div class="or">أو</div>
    <button class="btn sec" id="guest">👤 العب كضيف</button>
    <p class="mut" style="margin-top:14px">بالتسجيل أو اللعب أنت موافق على <a href="#" id="priv" style="color:var(--gold1);text-decoration:underline">سياسة الخصوصية</a></p>
    <p class="mut" style="margin-top:14px">${netBadge()}</p>
  </div>`;
  app.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => R.login(b.dataset.tab));
  $("#guest").onclick = () => { startSession({ id: "guest", name: "ضيف", guest: true }); };
  $("#priv").onclick = e => { e.preventDefault(); openPrivacy(); };
  $("#sub").onclick = () => doAuth(tab);
  const f = $("#forgot"); if (f) f.onclick = () => go("forgot", cleanEmail($("#em").value));
};
/* تنضيف الإيميل: بيشيل الرموز المخفية (اتجاه الكتابة/عرض صفري/مسافات) اللي الكيبورد العربي ساعات بيضيفها، ويحوّل الأرقام العربية والحروف العريضة */
const cleanEmail = v => String(v || "").normalize("NFKC").replace(/[\u0660-\u0669]/g, d => d.charCodeAt(0) - 0x660).replace(/[\u06F0-\u06F9]/g, d => d.charCodeAt(0) - 0x6F0).replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u2069\u061C\uFEFF\u00AD\s]/g, "").replace(/[\u066B\u06D4]/g, ".").toLowerCase();
const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
const authErr = c => ({ EMAIL_EXISTS: "الإيميل ده مسجل قبل كده", INVALID_LOGIN_CREDENTIALS: "الإيميل أو كلمة السر غلط", INVALID_PASSWORD: "كلمة السر غلط", WEAK_PASSWORD: "كلمة السر ضعيفة", TOO_MANY_ATTEMPTS_TRY_LATER: "محاولات كتير، جرّب بعد شوية", INVALID_OOB_CODE: "الرمز غلط أو اتستخدم قبل كده", EXPIRED_OOB_CODE: "الرمز انتهت صلاحيته، ابعت رمز جديد", MISSING_OOB_CODE: "الصق الرمز الأول", USER_DISABLED: "الحساب ده موقوف", OPERATION_NOT_ALLOWED: "الميزة دي مش مفعّلة في Firebase", INVALID_EMAIL: "الإيميل غير صحيح — اكتبه بالإنجليزي وبدون مسافات", MISSING_EMAIL: "اكتب الإيميل الأول", MISSING_PASSWORD: "اكتب كلمة السر", EMAIL_NOT_FOUND: "مفيش حساب بالإيميل ده", RESET_PASSWORD_EXCEED_LIMIT: "طلبات كتير للرمز، جرّب بعد شوية", "Failed": "مفيش اتصال بالنت، جرّب تاني", NETWORK: "مفيش اتصال بالنت، جرّب تاني" }[c] || ("حصلت مشكلة، حاول تاني" + (c ? " (" + String(c).slice(0, 60) + ")" : "")));
async function fbCall(path, body) {
  let r, j;
  try { r = await fetch("https://identitytoolkit.googleapis.com/v1/" + path + "?key=" + CFG.FIREBASE.apiKey, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
  catch (e) { throw new Error("NETWORK"); }
  try { j = await r.json(); } catch (e) { j = {}; }
  if (!r.ok) { const m = String((j.error && j.error.message) || "HTTP_" + r.status); throw new Error(m.split(/[\s:]/)[0]); }
  return j;
}
async function doAuth(tab) {
  const em = cleanEmail($("#em").value), pw = $("#pw").value, nm = tab === "up" ? cleanName($("#nm").value) : "";
  const err = m => { $("#err").textContent = m; };
  if (!emailOk(em)) return err("اكتب إيميل صحيح");
  if (pw.length < 6) return err("كلمة السر لازم 6 أحرف على الأقل");
  if (tab === "up" && !nameOk(nm)) return err("الاسم من 2 لـ 20 حرف (حروف وأرقام ومسافة بس)");
  const btn = $("#sub"); btn.disabled = true; err("");
  const accs = lsGet("fm_accounts", {}); const h = await sha(em + "|" + pw);
  try {
    if (firebaseOn() && online()) {
      const j = await fbCall(tab === "up" ? "accounts:signUp" : "accounts:signInWithPassword", { email: em, password: pw, returnSecureToken: true });
      lsSet("fm_tok", { uid: j.localId, idToken: j.idToken, refresh: j.refreshToken, exp: Date.now() + (+j.expiresIn || 3600) * 1000 - 60000 });
      if (tab === "up") { try { await fbCall("accounts:update", { idToken: j.idToken, displayName: nm, returnSecureToken: false }); } catch (e) {} }
      const name = tab === "up" ? nm : (j.displayName || (accs[em] && accs[em].name) || "لاعب");
      accs[em] = { h, name, id: j.localId }; lsSet("fm_accounts", accs);
      return startSession({ id: j.localId, email: em, name });
    }
    if (firebaseOn() && !online() && tab === "up") { btn.disabled = false; return err("محتاج نت لإنشاء حساب جديد"); }
    if (tab === "up") {
      if (accs[em]) { btn.disabled = false; return err("الإيميل ده مسجل قبل كده"); }
      accs[em] = { h, name: nm, id: "u" + hashStr(em) }; lsSet("fm_accounts", accs);
      return startSession({ id: accs[em].id, email: em, name: nm });
    }
    if (!accs[em] || accs[em].h !== h) { btn.disabled = false; return err(accs[em] || !firebaseOn() ? "الإيميل أو كلمة السر غلط" : "سجّل دخولك أونلاين أول مرة"); }
    startSession({ id: accs[em].id, email: em, name: accs[em].name });
  } catch (e) { btn.disabled = false; err(authErr(e.message)); }
}
/* استرجاع كلمة السر: إيميل ← رمز ← كلمة سر جديدة (كله جوه اللعبة) */
const parseOob = v => { v = String(v || "").trim(); const m = v.match(/[?&]oobCode=([^&#\s]+)/); return m ? decodeURIComponent(m[1]) : v.replace(/\s+/g, ""); };
R.forgot = function (em0) {
  let em = cleanEmail(em0), code = "", last = 0;
  const err = m => { const e = $("#err"); if (e) e.textContent = m || ""; };
  const draw = step => {
    const box = $("#fs");
    if (step === 1) box.innerHTML = `<p class="mut">اكتب إيميل حسابك وهنبعتلك رمز استرجاع.</p>
      <input class="inp" id="em" type="email" placeholder="البريد الإلكتروني" dir="ltr" autocomplete="email" value="${esc(em)}">
      <button class="btn" id="go1">إرسال الرمز</button>`;
    if (step === 2) box.innerHTML = `<p class="mut">بعتنالك رسالة على <b dir="ltr">${esc(em)}</b>.<br>افتحها وانسخ <b>الرمز</b> (أو اضغط مطولًا على الرابط وانسخه كله) والصقه هنا. لو مش لاقيها شوف مجلد السبام.</p>
      <input class="inp" id="cd" placeholder="الصق الرمز أو الرابط هنا" dir="ltr" autocomplete="one-time-code">
      <button class="btn" id="go2">تأكيد الرمز</button>
      <button class="btn ghost" id="re" style="margin-top:8px">إعادة إرسال الرمز</button>`;
    if (step === 3) box.innerHTML = `<p class="mut">✅ الرمز صح. اكتب كلمة السر الجديدة لـ <b dir="ltr">${esc(em)}</b></p>
      <input class="inp" id="p1" type="password" placeholder="كلمة السر الجديدة (6 أحرف على الأقل)" dir="ltr" autocomplete="new-password">
      <input class="inp" id="p2" type="password" placeholder="أعد كتابة كلمة السر" dir="ltr" autocomplete="new-password">
      <button class="btn" id="go3">تعيين كلمة السر</button>`;
    err("");
    const send = async resend => {
      if (!emailOk(em)) return err("اكتب إيميل صحيح");
      if (!online()) return err("محتاج نت عشان نبعت الرمز");
      if (Date.now() - last < 30000) return err("استنى " + Math.ceil((30000 - (Date.now() - last)) / 1000) + " ثانية وجرّب تاني");
      err(""); const b = $(resend ? "#re" : "#go1"); b.disabled = true;
      try { await fbCall("accounts:sendOobCode", { requestType: "PASSWORD_RESET", email: em }); last = Date.now(); toast("بعتنالك الرمز على الإيميل ✉"); draw(2); }
      catch (e) { b.disabled = false; err(authErr(e.message)); }
    };
    if (step === 1) { $("#go1").onclick = () => { em = cleanEmail($("#em").value); send(false); }; }
    if (step === 2) {
      $("#re").onclick = () => send(true);
      $("#go2").onclick = async () => {
        code = parseOob($("#cd").value); if (!code) return err("الصق الرمز الأول");
        const b = $("#go2"); b.disabled = true; err("");
        try { const j = await fbCall("accounts:resetPassword", { oobCode: code }); if (j.email) em = String(j.email).toLowerCase(); draw(3); }
        catch (e) { b.disabled = false; err(authErr(e.message)); }
      };
    }
    if (step === 3) $("#go3").onclick = async () => {
      const p1 = $("#p1").value, p2 = $("#p2").value;
      if (p1.length < 6) return err("كلمة السر لازم 6 أحرف على الأقل");
      if (p1 !== p2) return err("كلمتين السر مش زي بعض");
      const b = $("#go3"); b.disabled = true; err("");
      try {
        await fbCall("accounts:resetPassword", { oobCode: code, newPassword: p1 });
        const accs = lsGet("fm_accounts", {}); if (accs[em]) { accs[em].h = await sha(em + "|" + p1); lsSet("fm_accounts", accs); }
        toast("✅ اتغيّرت كلمة السر، سجّل دخولك بيها"); R.login("in"); const e2 = $("#em"); if (e2) e2.value = em;
      } catch (e) { b.disabled = false; err(authErr(e.message)); }
    };
  };
  app.innerHTML = `<div class="login"><img src="icon.png" alt=""><h3 style="margin:8px 0">🔑 استرجاع كلمة السر</h3><div id="fs"></div><div class="err" id="err"></div><button class="btn ghost" id="fb" style="margin-top:8px">رجوع لتسجيل الدخول</button></div>`;
  $("#fb").onclick = () => go("login");
  draw(1);
};
async function startSession(s) {
  SES = s; lsSet("fm_session", s); CLOUD_READY = false;
  const cu = isCloudUser(s); let cd;
  if (cu && online()) {
    app.innerHTML = '<div class="splash"><img src="icon.png" alt=""><p class="mut" style="margin-top:16px">جارٍ استرجاع بياناتك…</p></div>';
    try { cd = await cloudReq("GET", s.id); } catch (e) { cd = undefined; }
  }
  const raw = lsGet("fm_data_" + s.id, null); let use = raw;
  if (cd && cd.data && (!raw || raw._pend || (cd.ts || 0) > (raw.ts || 0))) use = cd.data;
  if (cd && cd.name) { SES.name = cd.name; lsSet("fm_session", SES); }
  applyData(use || {});
  if (cu) { if (cd !== undefined) { delete S._pend; CLOUD_READY = true; } else if (!raw) S._pend = 1; }
  save(); dailyLogin(); go("home"); refreshQuestions();
  if (cu && cd === undefined) syncT = setTimeout(cloudSync, 15000);
}
function logout() { try { pushNow(); } catch (e) {} CLOUD_READY = false; SES = null; S = null; try { localStorage.removeItem("fm_session"); localStorage.removeItem("fm_tok"); } catch (e) {} go("login"); }

function dailyLogin() {
  if (S.daily.last === today()) return;
  S.daily.streak = S.daily.last === yesterday() ? S.daily.streak + 1 : 1;
  S.daily.last = today(); S.daily.claimedToday = false; save();
}

/* الرئيسية */
R.home = function () {
  try { seasonTick(); } catch (e) {}
  if (S && S.lastSeason && !S.lastSeason.seen) { const ls = S.lastSeason; ls.seen = true; save(); setTimeout(() => { modal(`<div class="big">🏁</div><h3>انتهى الموسم!</h3><p>تم رجوعك من <b>${ls.rank}</b> إلى <b>مبتدئ</b></p><p class="mut">كانت نقطك ${num(ls.pts)} — موسم جديد بدأ، يلا نتنافس من الأول!</p>${ls.gems ? `<p>🎁 مكافأة رتبتك: <b>+${ls.gems} 💎</b></p>` : ""}<p class="mut">جواهرك زي ما هي ومحدش بيمسحها</p><button class="btn" id="ok">يلا</button>`); const b = $("#ok"); if (b) b.onclick = closeModal; }, 300); }
  const rows = LADDER.map((v, i) => i).reverse().map(i => {
    const cls = i === LADDER.length - 1 ? "mil" : SAFE.includes(i) ? "safe" : "";
    return `<div class="r ${cls}"><span>${i === LADDER.length - 1 ? "👑 " : ""}${String(i+1).padStart(2,"0")}</span><span>${fmt(LADDER[i])}${i===LADDER.length-1?"":'<i></i>'}</span></div>`;
  }).join("");
  const n = !S.daily.claimedToday ? "🎁" : "";
  app.innerHTML = `<div style="text-align:center;padding:8px 12px;margin-bottom:6px;border:1.5px solid var(--line);border-radius:14px;background:var(--panel);color:var(--gold1);font-size:15px">سيف محمد صلاح يرحب بكم</div>` + header() + seasonBar() + `
    <div class="hero">
      <div class="emb"><div class="tag">اختبر معرفتك.. وكن بطل المدرجات!</div><img src="icon.png" alt=""></div>
      <div class="ladder">${rows}</div>
    </div>
    <div class="ticker"><span>⚽</span><span>أسئلة كروية</span><span>•</span><span>تحدي المشجعين</span><span>•</span><span>هل أنت جاهز؟</span><span>⚽</span></div>
    <button class="btn big" id="play">▶ ابدأ اللعب</button>
    <button class="btn sec" id="duel" style="margin-top:12px">⚔ واحد ضد واحد — تحدّى لاعب</button>
    <button class="btn sec" id="tours" style="margin-top:12px">🏟 البطولات — كأس العالم واليورو ودوري الأبطال</button>
    <div class="tiles">
      <button class="tile" data-go="stats"><div class="ic">📊</div><b>إحصائياتي</b><small>شوف مستواك</small></button>
      <button class="tile" data-go="rewards"><div class="ic">🎁</div><b>المكافآت ${n}</b><small>جوائز وهدايا</small></button>
      <button class="tile" data-go="helps"><div class="ic">💡</div><b>المساعدات</b><small>استخدمها بحكمة</small></button>
    </div>
    <div class="banner"><div class="ic">👑⚽</div><div>ليس فقط عن كرة القدم.. بل عن ذكائك وشغفك بها! <div style="margin-top:4px">${netBadge()}</div></div></div>
  ` + nav("home");
  $("#play").onclick = () => startGame("classic");
  $("#duel").onclick = () => go("duel");
  $("#tours").onclick = () => go("tournaments");
};

/* البطولات */
R.tournaments = function () {
  const card = T => {
    const rec = S.tour && S.tour[T.k], n = tourPool(T.k).length;
    return `<div class="chal"><div class="ic">${T.ic}</div><div class="t grow"><b>${T.nm}</b><small>${T.ds}</small><br><small>${n} سؤال${rec && rec.games ? " — أفضل نتيجة: " + (rec.pass >= 4 ? "بطل 🏆" : "وصلت " + STAGES[rec.pass || 0]) : ""}</small></div><button class="btn" data-tour="${T.k}">العب · ${T.fee} 💎</button></div>`;
  };
  app.innerHTML = header() + `<h2>🏟 البطولات</h2>
    <p class="mut">ادفع جواهر عشان تدخل. البطولة 4 مراحل: دور المجموعات ← ربع النهائي ← نصف النهائي ← النهائي، وكل مرحلة 3 أسئلة لازم تجاوب 2 صح عشان تعدّيها. كل مرحلة بتعدّيها بترجّع لك جواهر، ولو كسبت البطولة بتكسب أكتر من اللي دفعته.</p>
    <div class="sect">🏟 بطولات الأندية</div>` + TOURS.filter(t => t.g === "club").map(card).join("") + `
    <div class="sect">🌍 بطولات المنتخبات</div>` + TOURS.filter(t => t.g === "nat").map(card).join("") + nav("tournaments");
  app.querySelectorAll("[data-tour]").forEach(b => b.onclick = () => startGame("tour", b.dataset.tour));
};

/* الإحصائيات */
const ACH = [
  // الأسئلة
  ["first", "🎯", "أول فوز", "أجب بشكل صحيح على سؤال", s => s.stats.correct >= 1, 50],
  ["c50", "⚽", "عاشق الكرة", "50 إجابة صحيحة", s => s.stats.correct >= 50, 50],
  ["c250", "🏅", "خبير الكرة", "250 إجابة صحيحة", s => s.stats.correct >= 250, 100],
  ["c1000", "🧠", "موسوعة الكرة", "1,000 إجابة صحيحة", s => s.stats.correct >= 1000, 300],
  ["c5000", "📚", "أسطورة المعرفة", "5,000 إجابة صحيحة", s => s.stats.correct >= 5000, 1500],
  ["c20000", "🌟", "عالم الكرة", "20,000 إجابة صحيحة", s => s.stats.correct >= 20000, 6000],
  ["acc90", "🎯", "القناص", "نسبة دقة 90% أو أكتر بعد 200 إجابة صحيحة", s => s.stats.correct >= 200 && s.stats.correct / Math.max(1, s.stats.correct + s.stats.wrong) >= 0.9, 400],
  // السلاسل
  ["st10", "🔥", "سلسلة نارية", "10 إجابات صحيحة متتالية", s => s.stats.bestStreak >= 10, 50],
  ["st20", "⚡", "سلسلة لا تُوقف", "20 إجابة صحيحة متتالية", s => s.stats.bestStreak >= 20, 300],
  ["st35", "💥", "خارق", "35 إجابة صحيحة متتالية", s => s.stats.bestStreak >= 35, 1000],
  ["st60", "☄️", "ماكينة المعرفة", "60 إجابة صحيحة متتالية", s => s.stats.bestStreak >= 60, 3000],
  // المباريات
  ["g10", "🎮", "مدمن اللعب", "العب 10 مباريات", s => s.stats.games >= 10, 50],
  ["g50", "🕹", "لاعب دائم", "العب 50 مباراة", s => s.stats.games >= 50, 150],
  ["g250", "🏟", "نجم الملعب", "العب 250 مباراة", s => s.stats.games >= 250, 600],
  ["g1000", "🗿", "أسطورة اللعب", "العب 1,000 مباراة", s => s.stats.games >= 1000, 2500],
  // القمة
  ["mil", "👑", "بطل المدرجات", "اوصل للقمة", s => s.stats.millions >= 1, 500],
  ["mil5", "💰", "بطل متسلسل", "اوصل للقمة 5 مرات", s => s.stats.millions >= 5, 1500],
  ["mil25", "🏰", "ملك المدرجات", "اوصل للقمة 25 مرة", s => s.stats.millions >= 25, 6000],
  // واحد ضد واحد
  ["duel1", "⚔", "أول انتصار", "افوز في تحدي واحد ضد واحد", s => s.stats.duelWins >= 1, 50],
  ["duel10", "🥊", "مقاتل", "10 انتصارات في 1 ضد 1", s => s.stats.duelWins >= 10, 300],
  ["duel50", "🗡", "سيد التحدي", "50 انتصار في 1 ضد 1", s => s.stats.duelWins >= 50, 1200],
  ["duel200", "🏹", "بطل الساحات", "200 انتصار في 1 ضد 1", s => s.stats.duelWins >= 200, 4000],
  ["duelg100", "🛡", "خصم عنيد", "العب 100 مباراة 1 ضد 1", s => s.stats.duelGames >= 100, 600],
  // الرتب (نقط الموسم)
  ["rk1", "🥉", "رتبة هاوي", "اوصل لرتبة هاوي", s => s.points >= 5000, 100],
  ["rk2", "🥈", "رتبة محترف", "اوصل لرتبة محترف", s => s.points >= 40000, 400],
  ["rk3", "🥇", "رتبة ممتاز", "اوصل لرتبة ممتاز", s => s.points >= 200000, 1200],
  ["rk4", "🌍", "العالمية!", "اوصل لرتبة عالمي في موسم واحد", s => s.points >= 1000000, 5000],
  // الالتزام والبطولات والمزاد
  ["day7", "📅", "ملتزم", "أكمل تحدي اليوم 7 مرات", s => s.stats.dailyDone >= 7, 200],
  ["day30", "🗓", "وفي للعبة", "أكمل تحدي اليوم 30 مرة", s => s.stats.dailyDone >= 30, 1000],
  ["tour10", "🏆", "عاشق البطولات", "العب 10 مباريات في البطولات", s => Object.values(s.tour || {}).reduce((t, x) => t + (x.games || 0), 0) >= 10, 300],
  ["tourw", "🥇", "بطل البطولة", "اكسب بطولة كاملة (12 من 12)", s => Object.values(s.tour || {}).some(x => (x.best || 0) >= 12), 800],
  ["hl10", "🦅", "عين الصقر", "سلسلة 10 في أعلى ولا أقل", s => (s.hlBest || 0) >= 10, 250],
  ["hl25", "🔮", "حدس لا يخطئ", "سلسلة 25 في أعلى ولا أقل", s => (s.hlBest || 0) >= 25, 1000],
  // إنجازات إضافية
  ["c100", "📣", "مشجع متحمس", "100 إجابة صحيحة", s => s.stats.correct >= 100, 75],
  ["c500", "⚖", "حكم المعرفة", "500 إجابة صحيحة", s => s.stats.correct >= 500, 200],
  ["c10000", "🌌", "نصف عالم", "10,000 إجابة صحيحة", s => s.stats.correct >= 10000, 3000],
  ["st5", "✨", "بداية قوية", "5 إجابات صحيحة متتالية", s => s.stats.bestStreak >= 5, 25],
  ["st50", "🛡", "لا يُقهر", "50 إجابة صحيحة متتالية", s => s.stats.bestStreak >= 50, 2000],
  ["g100", "📆", "عميل ثابت", "العب 100 مباراة", s => s.stats.games >= 100, 300],
  ["g500", "🏛", "حارس الملعب", "العب 500 مباراة", s => s.stats.games >= 500, 1200],
  ["g2500", "♾", "خالد في اللعبة", "العب 2,500 مباراة", s => s.stats.games >= 2500, 5000],
  ["duel25", "⚔", "محارب", "25 انتصار في 1 ضد 1", s => s.stats.duelWins >= 25, 600],
  ["duel100", "🎖", "جنرال التحديات", "100 انتصار في 1 ضد 1", s => s.stats.duelWins >= 100, 2000],
  ["day3", "🌱", "بداية الالتزام", "أكمل تحدي اليوم 3 مرات", s => s.stats.dailyDone >= 3, 75],
  ["day14", "🌿", "أسبوعين التزام", "أكمل تحدي اليوم 14 مرة", s => s.stats.dailyDone >= 14, 400],
  ["day100", "🌳", "عادة يومية", "أكمل تحدي اليوم 100 مرة", s => s.stats.dailyDone >= 100, 3000],
  ["hl5", "👁", "نظرة ثاقبة", "سلسلة 5 في أعلى ولا أقل", s => (s.hlBest || 0) >= 5, 100],
  ["hl50", "🧿", "العرّاف", "سلسلة 50 في أعلى ولا أقل", s => (s.hlBest || 0) >= 50, 3000],
  ["tour30", "🏟", "مدمن البطولات", "العب 30 مباراة في البطولات", s => Object.values(s.tour || {}).reduce((t, x) => t + (x.games || 0), 0) >= 30, 800],
  ["tourall", "🧭", "جولة حول العالم", "العب في 5 بطولات مختلفة", s => Object.keys(s.tour || {}).length >= 5, 500]
];
function checkAch() { ACH.forEach(a => { if (!S.ach[a[0]] && a[4](S)) { S.ach[a[0]] = 1; S.gems += (a[5] || 50); toast("🏆 إنجاز جديد: " + a[2] + " (+" + (a[5] || 50) + " 💎)"); } }); }
R.stats = function () {
  const st = S.stats, tot = st.correct + st.wrong, acc = tot ? Math.round(st.correct / tot * 100) : 0;
  const next = RANKS.find(r => r[0] > S.points); const prev = [...RANKS].reverse().find(r => r[0] <= S.points);
  const pct = next ? Math.round((S.points - prev[0]) / (next[0] - prev[0]) * 100) : 100;
  app.innerHTML = header() + `<h2>📊 إحصائياتي</h2>
    <div class="card"><div class="row"><b class="grow">${rankOf(S.points)}</b><span class="pill">${num(S.points)} نقطة</span></div>
      <div class="bar" style="margin-top:10px"><i style="width:${pct}%"></i></div>
      <div class="mut" style="margin-top:6px">${next ? "الرتبة الجاية: " + next[1] + " عند " + num(next[0]) + " نقطة" : "وصلت لأعلى رتبة 👑"}</div>
      <div class="mut" style="margin-top:6px">📅 الموسم بينتهي بعد ${fmtLeft()} — بترجع مبتدئ وبتاخد جواهر على رتبتك</div></div>
    <div class="grid2">
      <div class="card stat"><b>${st.games}</b><small>مباريات</small></div>
      <div class="card stat"><b>${acc}%</b><small>نسبة الدقة</small></div>
      <div class="card stat"><b>${st.correct}</b><small>إجابات صحيحة</small></div>
      <div class="card stat"><b>${st.wrong}</b><small>إجابات خاطئة</small></div>
      <div class="card stat"><b>${st.best ? fmt(st.best) : "—"}</b><small>أعلى جائزة</small></div>
      <div class="card stat"><b>${st.bestStreak}</b><small>أطول سلسلة صح</small></div>
      <div class="card stat"><b>${st.duelWins}</b><small>انتصارات 1 ضد 1</small></div>
      <div class="card stat"><b>${Math.round(S.skill * 100)}%</b><small>مستواك الحالي</small></div>
    </div>
    <h2>🏅 الإنجازات (${ACH.filter(a => S.ach[a[0]]).length}/${ACH.length})</h2><div class="card">${ACH.map(a => `<div class="ach ${S.ach[a[0]]?"on":""}"><span class="ic">${a[1]}</span><div><b>${a[2]}</b><div class="mut">${a[3]} · <b style="color:var(--gold1)">+${a[5] || 50} 💎</b></div></div></div>`).join("")}</div>
  ` + nav("profile");
};

/* المكافآت */
R.rewards = function () {
  const st = S.daily.streak, idx = (st - 1) % 7;
  const days = DAILY_GEMS.map((g, i) => `<div class="day ${i < idx || (i === idx && S.daily.claimedToday) ? "done" : ""} ${i === idx && !S.daily.claimedToday ? "now" : ""}">يوم ${i+1}<b>${g}</b>💎</div>`).join("");
  const m = S.mis;
  const mis = (key, need, gems, label) => {
    const ok = m.correct >= need, done = m[key];
    return `<div class="row" style="padding:8px 0"><div class="grow"><b>${label}</b><div class="mut">${Math.min(m.correct, need)} / ${need}</div><div class="bar" style="margin-top:4px"><i style="width:${Math.min(100, m.correct/need*100)}%"></i></div></div>
      <button class="btn ${done ? "ghost" : ""}" data-mis="${key}" style="width:auto;padding:8px 14px;font-size:14px" ${!ok || done ? "disabled" : ""}>${done ? "تم ✓" : "+" + gems + " 💎"}</button></div>`;
  };
  app.innerHTML = header() + `<h2>🎁 المكافآت</h2>
    <div class="card"><b>الهدية اليومية</b> <span class="pill">أيام متتالية: ${st}</span><div class="days">${days}</div>
      <button class="btn" id="claim" ${S.daily.claimedToday ? "disabled" : ""}>${S.daily.claimedToday ? "استلمت هدية النهاردة ✓" : "استلم +" + DAILY_GEMS[idx] + " 💎"}</button></div>
    <div class="card"><b>مهام اليوم</b>${mis("c10", 10, 60, "جاوب 10 أسئلة صح")}${mis("c25", 25, 150, "جاوب 25 سؤال صح")}</div>
    <p class="mut" style="text-align:center">اللعبة ترفيهية، والجوائز والأرباح افتراضية داخل اللعبة فقط.</p>
  ` + nav("home");
  $("#claim").onclick = () => { if (S.daily.claimedToday) return; S.gems += DAILY_GEMS[idx]; S.daily.claimedToday = true; save(); sfx.win(); toast("+" + DAILY_GEMS[idx] + " 💎"); R.rewards(); };
  app.querySelectorAll("[data-mis]").forEach(b => b.onclick = () => { const k = b.dataset.mis; const g = k === "c10" ? 60 : 150; if (S.mis[k]) return; S.mis[k] = true; S.gems += g; save(); sfx.win(); toast("+" + g + " 💎"); R.rewards(); });
};

/* المساعدات */
R.helps = function () {
  app.innerHTML = header() + `<h2>💡 المساعدات</h2>
    <p class="mut">في كل مباراة معاك مرة من كل مساعدة. تقدر تشتري زيادة بالجواهر 💎 وتحتفظ بيها.</p>` +
    Object.keys(LL).map(k => `<div class="chal"><div class="ic">${LL[k].ic}</div><div class="t grow"><b>${LL[k].nm}</b><small>${{coach:"تلميح: أول حرف من الإجابة وعدد كلماتها",vr:"لو غلطت مرة تقدر تختار تاني (مرة واحدة)",time:"+20 ثانية على وقت السؤال",gold:"لو جاوبت صح تاخد +40 💎 إضافية"}[k]}</small><br><small>معاك زيادة: ${S.inv[k]}</small></div><button class="btn" data-buy="${k}">${LL[k].price} 💎</button></div>`).join("") + nav("home");
  app.querySelectorAll("[data-buy]").forEach(b => b.onclick = () => { const k = b.dataset.buy; if (S.gems < LL[k].price) return toast("جواهرك مش كفاية — خدها من المكافآت 🎁"); S.gems -= LL[k].price; S.inv[k]++; save(); sfx.ok(); R.helps(); });
};

/* نتائجي */
R.board = function () {
  const h = S.hist.slice(0, 15);
  app.innerHTML = header() + `<h2>🏆 سجل نتائجي</h2>
    <div class="card"><div class="row"><div class="grow"><b>${esc(SES.name)}</b><div class="mut">${rankOf(S.points)}</div></div><span class="pill">${num(S.points)} نقطة</span></div></div>
    <div class="card lb">${h.length ? h.map((x, i) => `<div class="r"><span class="n">${i+1}</span><div class="grow"><b>${x.mode}</b><div class="mut">${x.date}</div></div><div style="text-align:left"><b style="color:var(--gold1)">+${num(x.pts)}</b><div class="mut">${x.info}</div></div></div>`).join("") : '<div class="mut" style="text-align:center;padding:16px">لسه ماعبتش أي مباراة — ابدأ دلوقتي!</div>'}</div>
    ${SES.guest ? '<p class="mut" style="text-align:center">سجّل بحساب لحفظ تقدّمك باسمك.</p>' : ""}` + nav("board");
};

/* الحساب */
R.profile = function () {
  app.innerHTML = header() + seasonBar() + `<h2>👤 حسابي</h2>
    <div class="card"><div class="row"><div class="avatar">👑</div><div class="grow"><b>${esc(SES.name)}</b><div class="mut" dir="ltr" style="text-align:right">${esc(SES.email || "حساب ضيف")}</div><div class="mut">★ ${rankOf(S.points)}</div></div></div></div>
    <button class="btn sec" data-go="stats" style="margin-bottom:10px">📊 إحصائياتي والإنجازات</button>
    <button class="btn sec" data-go="rewards" style="margin-bottom:10px">🎁 المكافآت</button>
    <button class="btn sec" data-go="settings" style="margin-bottom:10px">⚙ الإعدادات</button>
    <button class="btn ghost" id="lo">${SES.guest ? "تسجيل حساب / دخول" : "تسجيل الخروج"}</button>` + nav("profile");
  $("#lo").onclick = logout;
};

const PRIVACY_URL = (window.CFG && CFG.PRIVACY_URL) || "https://siafmohammed334-ux.github.io/Foot.ball-1-Million.er/privacy.html";
function openPrivacy() { try { window.open(PRIVACY_URL, "_blank"); } catch (e) { location.href = PRIVACY_URL; } }
/* اسم اللاعب */
const NAME_COST = 1000, NAME_RE = /^[\p{L}\p{M}\p{N} _.\-]{2,20}$/u;
const cleanName = v => String(v || "").replace(/\s+/g, " ").trim();
const nameOk = n => NAME_RE.test(n);
function changeName() {
  if (!SES || SES.guest) return;
  if (S.gems < NAME_COST) return toast("محتاج " + NAME_COST + " 💎 لتغيير الاسم — معاك " + num(S.gems));
  const needPw = !!(SES.email && firebaseOn());
  modal(`<h3>تغيير الاسم</h3><p>التغيير بيكلّف <b>${NAME_COST} 💎</b>، والاسم الجديد بيظهر لمنافسيك في المعرفة والمزاد والانتقالات.</p>
    <input class="inp" id="nn" maxlength="20" placeholder="الاسم الجديد" autocomplete="nickname">
    ${needPw ? '<input class="inp" id="npw" type="password" placeholder="كلمة السر للتأكيد" dir="ltr" autocomplete="current-password">' : ""}
    <div class="err" id="nerr"></div>
    <button class="btn" id="ngo">غيّر الاسم (${NAME_COST} 💎)</button>
    <button class="btn ghost" id="nno">إلغاء</button>`);
  $("#nno").onclick = closeModal;
  $("#ngo").onclick = async () => {
    const btn = $("#ngo"), err = m => { $("#nerr").textContent = m; }, nn = cleanName($("#nn").value);
    if (!nameOk(nn)) return err("الاسم من 2 لـ 20 حرف (حروف وأرقام ومسافة بس)");
    if (nn === SES.name) return err("ده اسمك الحالي");
    if (needPw && $("#npw").value.length < 6) return err("اكتب كلمة السر");
    if (S.gems < NAME_COST) return err("جواهرك مش كفاية");
    btn.disabled = true; err("");
    try {
      if (needPw) {
        if (!online()) throw new Error("OFFLINE");
        const j = await fbCall("accounts:signInWithPassword", { email: SES.email, password: $("#npw").value, returnSecureToken: true });
        await fbCall("accounts:update", { idToken: j.idToken, displayName: nn, returnSecureToken: false });
      }
      S.gems -= NAME_COST; SES.name = nn; lsSet("fm_session", SES);
      const accs = lsGet("fm_accounts", {}); if (SES.email && accs[SES.email]) { accs[SES.email].name = nn; lsSet("fm_accounts", accs); }
      save(); closeModal(); toast("✅ اسمك بقى " + nn); go("settings");
    } catch (e) { btn.disabled = false; err(e.message === "OFFLINE" ? "محتاج نت عشان تغيّر الاسم" : authErr(e.message)); }
  };
}
/* حذف الحساب */
function confirmDeleteAccount() {
  if (!SES) return;
  const needPw = !!(SES.email && !SES.guest && firebaseOn());
  modal(`<h3>حذف الحساب</h3>
    <p>هل أنت متأكد؟ هيتحذف حسابك وكل تقدمك (النقاط والجواهر والإنجازات) نهائياً، ومش هتقدر ترجّعهم.</p>
    ${needPw ? '<input class="inp" id="dpw" type="password" placeholder="اكتب كلمة السر للتأكيد" dir="ltr" autocomplete="current-password">' : ""}
    <label style="display:flex;gap:10px;align-items:center;margin:10px 0;line-height:1.6;text-align:right;cursor:pointer"><input type="checkbox" id="dok" style="width:22px;height:22px;flex:none"><span>أوافق على حذف حسابي وكل بياناتي نهائياً</span></label>
    <div class="err" id="derr"></div>
    <button class="btn" id="dgo" disabled>حذف حسابي نهائياً</button>
    <button class="btn ghost" id="dno">إلغاء</button>`);
  const upd = () => { $("#dgo").disabled = !($("#dok").checked && (!needPw || $("#dpw").value.length >= 6)); };
  $("#dok").onchange = upd;
  if (needPw) $("#dpw").oninput = upd;
  $("#dno").onclick = closeModal;
  $("#dgo").onclick = async () => {
    const btn = $("#dgo"), err = m => { $("#derr").textContent = m; };
    btn.disabled = true; err("");
    try { await deleteAccount(needPw, needPw ? $("#dpw").value : ""); }
    catch (e) {
      btn.disabled = false;
      err(e.message === "OFFLINE" ? "محتاج نت عشان تحذف الحساب" : (e.message === "INVALID_LOGIN_CREDENTIALS" || e.message === "INVALID_PASSWORD") ? "كلمة السر غلط" : e.message === "TOO_MANY_ATTEMPTS_TRY_LATER" ? "محاولات كتير، جرّب بعد شوية" : "تعذّر الحذف، جرّب تاني");
    }
  };
}
async function deleteAccount(needPw, pw) {
  const id = SES.id, em = SES.email, guest = !!SES.guest;
  if (needPw) {
    if (!online()) throw new Error("OFFLINE");
    let j = null;
    try { j = await fbCall("accounts:signInWithPassword", { email: em, password: pw, returnSecureToken: true }); }
    catch (e) { if (e.message !== "EMAIL_NOT_FOUND") throw e; }
    if (j) { try { if (dbBase()) await fetch(dbBase() + "/users/" + encodeURIComponent(id) + ".json?auth=" + encodeURIComponent(j.idToken), { method: "DELETE" }); } catch (e) {} await fbCall("accounts:delete", { idToken: j.idToken }); }
  }
  try { if (online() && CFG.FIREBASE_DB) await fetch(String(CFG.FIREBASE_DB).replace(/\/+$/, "") + "/seek/" + encodeURIComponent(id) + ".json", { method: "DELETE" }); } catch (e) {}
  try {
    if (em) { const accs = lsGet("fm_accounts", {}); delete accs[em]; lsSet("fm_accounts", accs); }
    localStorage.removeItem("fm_data_" + id);
    localStorage.removeItem("fm_session"); localStorage.removeItem("fm_tok"); CLOUD_READY = false;
    if (guest) localStorage.removeItem("fm_uid");
  } catch (e) {}
  SES = null; S = null; closeModal(); go("login"); toast("تم حذف حسابك نهائياً");
}

/* الإعدادات */
R.settings = function () {
  const sw = (k, t) => `<div class="sw"><span>${t}</span><button class="tg ${S.set[k] ? "on" : ""}" data-sw="${k}"></button></div>`;
  app.innerHTML = header() + `<h2>⚙ الإعدادات</h2><div class="card">${sw("sound", "🔊 الصوت والمؤثرات")}${sw("voice", "🗣 التعليق الصوتي (إجابة صحيحة / خاطئة)")}${sw("vibrate", "📳 الاهتزاز")}</div>
    <div class="card"><b>الأسئلة</b><div class="mut" style="margin:6px 0">${netBadge()} — أسئلة جديدة لسه ماشفتهاش: ${poolAll().filter(r => !S.seen.includes(qid(r))).length}<br>الأوفلاين: محفوظ لك ${S.pack.length} سؤال (بنكمّلها لـ 500 بأسئلة ماشفتهاش)، ولما النت يشتغل بنجيب لك أسئلة جديدة وبنجدّد المحفوظ.</div>
      <button class="btn sec" id="upd">🔄 تحديث الأسئلة الآن</button></div>
    <div class="card"><b>اسم اللاعب</b><div style="margin:6px 0;font-size:18px">${esc(SES.name)}</div><div class="mut" style="margin-bottom:8px">ده الاسم اللي بيظهر لمنافسيك في المعرفة والمزاد والانتقالات.</div>${SES.guest ? '<div class="mut">سجّل حساب جديد عشان تختار اسمك.</div>' : `<button class="btn sec" id="chname">✏️ تغيير الاسم (${NAME_COST} 💎)</button>`}</div>
    <div class="card"><b>الحساب</b><div class="mut" style="margin:6px 0">لو حذفت حسابك هتتمسح كل بياناتك نهائياً ومش هتقدر ترجّعها.</div>
      <button class="btn sec" id="privs" style="margin-bottom:10px">🔒 سياسة الخصوصية</button>
      <button class="btn sec" id="delacc" style="color:#ff8a8a">🗑 حذف الحساب</button></div>
    <div class="card mut">تحدّي المدرجات — لعبة ترفيهية. الجوائز والجواهر والنقاط افتراضية داخل اللعبة فقط، ولا توجد أي جوائز مالية حقيقية ولا يمكن تحويلها أو استبدالها بمال. الأسئلة عن كرة القدم للرجال.</div>` + nav("profile");
  app.querySelectorAll("[data-sw]").forEach(b => b.onclick = () => { S.set[b.dataset.sw] = !S.set[b.dataset.sw]; save(); R.settings(); });
  $("#delacc").onclick = confirmDeleteAccount;
  const cn = $("#chname"); if (cn) cn.onclick = changeName;
  $("#privs").onclick = openPrivacy;
  $("#upd").onclick = async () => { toast("جاري التحديث..."); const ok = await refreshQuestions(); toast(!online() ? "مفيش نت حالياً" : !remoteConfigured() ? "الأسئلة المدمجة بس حالياً" : ok ? (LAST_ADDED > 0 ? "تم التحديث ✓ نزل " + LAST_ADDED + " سؤال جديد، والمحفوظ دلوقتي " + S.pack.length : "الحزمة كاملة أو مفيش أسئلة جديدة على السيرفر، والمحفوظ " + S.pack.length) : "تعذّر التحديث"); R.settings(); };
};

/* التحديات */
R.challenges = function () {
  const doneToday = S.dc === today();
  const c = (ic, t, d, id, extra, dis) => `<div class="chal"><div class="ic">${ic}</div><div class="t grow"><b>${t}</b><small>${d}</small></div><button class="btn" data-ch="${id}" ${dis ? "disabled" : ""}>${extra}</button></div>`;
  app.innerHTML = header() + seasonBar() + `<h2>⚡ التحديات</h2>` +
    c("⚔", "واحد ضد واحد", "تحدّى لاعب حقيقي أو صديقك على واتساب", "duel", "العب") +
    c("🔄", "اعرف اللاعب من انتقالاته", "10 أسئلة: أندية اللاعب بالترتيب وانت تعرفه — 20 💎 لكل إجابة صح", "transfer", "العب") +
    c("📅", "تحدي اليوم", "10 أسئلة — مرة كل يوم — 20 💎 لكل إجابة صح", "daily", doneToday ? "تم ✓" : "العب", doneToday) +
    c("⏱", "تحدي السرعة", "60 ثانية: جاوب أكبر عدد من الأسئلة", "speed", "العب") +
    c("🔥", "تحدي الصمود", "كمّل لحد أول غلطة — كل إجابة صح بنقاط أعلى", "survive", "العب") +
    c("👑", "التحدي الكلاسيكي", "16 سؤال والمساعدات الأربعة", "classic", "العب") +
    c("🏟", "البطولات", "دوري الأبطال واليورو وأمم أفريقيا وآسيا وكأس العالم", "tours", "ادخل") + nav("challenges");
  app.querySelectorAll("[data-ch]").forEach(b => b.onclick = () => b.dataset.ch === "duel" ? go("duel") : b.dataset.ch === "tours" ? go("tournaments") : startGame(b.dataset.ch));
};

/* ---------- اللعب ---------- */
async function startGame(mode, tour) {
  sfx.tap();
  const T0 = mode === "tour" ? TOURS.find(x => x.k === tour) : null;
  if (T0 && S.gems < T0.fee) return toast("محتاج " + T0.fee + " 💎 عشان تدخل " + T0.nm + " — خدهم من المكافآت 🎁");
  if (online() && remoteConfigured() && Date.now() - (startGame.last || 0) > 30000) { startGame.last = Date.now(); await refreshQuestions(); }
  G = { mode, tour: tour || "", qs: [], n: GAME_N[mode], i: 0, locked: false, free: { coach: 1, vr: 1, time: 1, gold: 1 }, score: 0, right: 0, streak: 0, t: 0, hidden: [], sr: 0, passed: 0 };
  if (mode === "speed") G.total = 60;
  if (!pickTier(1, new Set())) { G = null; return toast("مفيش أسئلة كفاية حالياً"); }
  if (T0) { S.gems -= T0.fee; save(); }
  go("game");
}
const qTime = () => G.i < 5 ? 30 : G.i < 10 ? 45 : 60;
const llCount = k => G.free[k] + S.inv[k];

R.game = function () {
  if (!G) return go("home");
  if (!G.qs[G.i]) {
    const r = pickTier(tierFor(), new Set(G.qs.map(x => x.id)));
    if (!r) return finish("done");
    G.qs[G.i] = norm(r);
  }
  const q = G.qs[G.i], m = G.mode;
  markServed(q); G.hidden = []; G.locked = false; G.varOn = false; G.goldOn = false;
  const classic = m === "classic", TT = m === "tour" ? TOURS.find(x => x.k === G.tour) : null;
  const llHtml = (classic || m === "daily" || m === "tour" || m === "transfer") ? '<div class="ll">' + Object.keys(LL).map(k => `<button data-ll="${k}" ${llCount(k) < 1 ? "disabled" : ""}><span>${LL[k].ic}</span>${LL[k].nm}<em>${llCount(k)}</em></button>`).join("") + "</div>" : "";
  const label = classic ? `السؤال <bdi dir="ltr">${G.i + 1} / 16</bdi>` : m === "daily" ? `السؤال <bdi dir="ltr">${G.i + 1} / 10</bdi>` : m === "transfer" ? `🔄 اعرف اللاعب · <bdi dir="ltr">${G.i + 1} / 10</bdi>` : m === "tour" ? `${TT.ic} ${STAGES[Math.floor(G.i / 3)]} · سؤال <bdi dir="ltr">${G.i % 3 + 1} / 3</bdi>` : m === "speed" ? `صح: ${G.right}` : `سلسلة: ${G.right}`;
  const centre = classic ? `<small>الجائزة الحالية</small><b>${fmt(LADDER[G.i])}</b>` : (m === "daily" || m === "tour" || m === "transfer") ? `<small>الإجابات الصح</small><b>${G.right}</b>` : `<small>النقاط</small><b>${num(G.score)}</b>`;
  app.innerHTML = `<div class="gtop">
      <button class="ibtn" id="quit">✕</button>
      <div class="prize">${centre}</div>
      <div class="timer" id="tm">${m === "speed" ? G.total : qTime()}</div>
    </div>
    <span class="pill qn">${label}</span>
    <div class="qbox">${esc(q.q)}</div>
    ${llHtml}
    <div class="opts">${q.opts.map((o, i) => `<button class="opt" data-o="${i}"><b>${LET[i]}</b><span class="tx">${esc(o.t)}</span><span class="pc"></span></button>`).join("")}</div>
    ${classic ? '<div class="gfoot"><button class="btn ghost" id="wd">💰 انسحب بـ ' + (G.i ? fmt(LADDER[G.i-1]) : "0") + "</button></div>" : ""}`;
  app.querySelectorAll("[data-o]").forEach(b => b.onclick = () => answer(+b.dataset.o));
  app.querySelectorAll("[data-ll]").forEach(b => b.onclick = () => useLL(b.dataset.ll));
  $("#quit").onclick = () => confirmQuit();
  const wd = $("#wd"); if (wd) wd.onclick = () => { if (!G.i) return; modal(`<h3>تنسحب؟</h3><p>هتاخد ${fmt(LADDER[G.i-1])} وتنهي المباراة.</p><button class="btn" id="y">أيوه، انسحب</button><button class="btn ghost" id="n">كمّل اللعب</button>`); $("#y").onclick = () => { closeModal(); finish("withdraw"); }; $("#n").onclick = closeModal; };
  startQTimer();
};
function startQTimer() {
  stopTimer();
  const tm = $("#tm");
  if (G.mode === "speed") {
    timerId = setInterval(() => { G.total--; tm.textContent = G.total; tm.classList.toggle("low", G.total <= 10); if (G.total <= 10) sfx.tick(); if (G.total <= 0) { stopTimer(); finish("time"); } }, 1000);
  } else {
    G.t = qTime(); tm.textContent = G.t;
    timerId = setInterval(() => { G.t--; tm.textContent = G.t; tm.classList.toggle("low", G.t <= 8); if (G.t <= 5) sfx.tick(); if (G.t <= 0) { stopTimer(); answer(-1); } }, 1000);
  }
}
function confirmQuit() {
  modal(`<h3>خروج؟</h3><p>${G.mode === "classic" ? "لو خرجت دلوقتي هتخسر المباراة (من غير ما تاخد الجائزة)." : "هيتحسب اللي حققته لحد دلوقتي."}</p><button class="btn" id="y">خروج</button><button class="btn ghost" id="n">كمّل</button>`);
  $("#y").onclick = () => { closeModal(); if (G.mode === "classic") { G = null; go("home"); } else finish("quit"); };
  $("#n").onclick = closeModal;
}
function useLL(k) {
  if (G.locked || llCount(k) < 1) return;
  const q = G.qs[G.i];
  if (k === "vr" && G.varOn) return toast("الـ VAR شغّال بالفعل");
  if (k === "gold" && G.goldOn) return toast("الهدف الذهبي شغّال بالفعل");
  if (G.free[k] > 0) G.free[k]--; else S.inv[k]--;
  save(); sfx.tap();
  if (k === "coach") {
    const txt = String(q.opts[q.ans].t).trim(), first = Array.from(txt)[0] || "", words = txt.split(/\s+/).length;
    modal(`<div class="big">🧠</div><h3>تلميح المدرب</h3><p>الإجابة بتبدأ بحرف <b style="color:var(--gold1)">«${esc(first)}»</b> وعدد كلماتها <b style="color:var(--gold1)">${words}</b></p><button class="btn" id="ok">تمام</button>`);
    $("#ok").onclick = closeModal;
  } else if (k === "vr") {
    G.varOn = true;
    toast("🎥 الـ VAR شغّال: لو غلطت هتاخد فرصة تانية");
  } else if (k === "time") {
    G.t += 20; const tm = $("#tm"); if (tm) { tm.textContent = G.t; tm.classList.remove("low"); }
    toast("⏱ +20 ثانية");
  } else if (k === "gold") {
    G.goldOn = true;
    toast("⭐ هدف ذهبي: جاوب صح وخد +40 💎");
  }
  const bt = app.querySelector(`[data-ll="${k}"]`); if (bt) { bt.querySelector("em").textContent = llCount(k); if (llCount(k) < 1) bt.disabled = true; }
}
const OKS = ["إجابة صحيحة!", "أحسنت!", "ممتاز!", "برافو عليك!"], NOS = ["إجابة خاطئة", "للأسف إجابة غلط"];
function answer(i) {
  if (G.locked) return;
  if (G.varOn && i >= 0 && i !== G.qs[G.i].ans) {
    G.varOn = false; G.hidden.push(i);
    const wb = app.querySelector(`[data-o="${i}"]`); if (wb) wb.classList.add("gone");
    sfx.tap(); vib(30); toast("🎥 الـ VAR راجع اللقطة — جرّب تاني");
    return;
  }
  G.locked = true;
  if (G.mode !== "speed") stopTimer();
  const q = G.qs[G.i], btns = app.querySelectorAll("[data-o]");
  btns.forEach(b => b.setAttribute("disabled", ""));
  const right = i === q.ans;
  if (i >= 0) btns[i].classList.add("sel");
  const speed = G.mode === "speed", ref = G;
  setTimeout(() => {
    if (G !== ref) return;
    if (i >= 0) btns[i].classList.remove("sel");
    btns[q.ans].classList.add("ok");
    if (i >= 0 && !right) btns[i].classList.add("no");
    if (right) {
      const t = OKS[Math.floor(Math.random() * OKS.length)];
      sfx.ok(); sfx.cheer(false); vib(40); feedback("ok", t); if (!speed) speak(t); else confetti(10);
    } else {
      const t = i === -1 ? "انتهى الوقت" : NOS[Math.floor(Math.random() * NOS.length)];
      sfx.no(); sfx.boo(); vib([80, 60, 120]); feedback(i === -1 ? "time" : "no", t); document.body.classList.add("shake"); setTimeout(() => document.body.classList.remove("shake"), 500); if (!speed) speak(t);
    }
    S.stats[right ? "correct" : "wrong"]++;
    S.skill = Math.max(0, Math.min(1, S.skill + (right ? .06 : -.12)));
    if (right && G.goldOn) { S.gems += 40; G.goldOn = false; toast("⭐ هدف ذهبي! +40 💎"); }
    if (right) { S.mis.correct++; G.right++; G.streak++; S.stats.streak = G.streak; S.stats.bestStreak = Math.max(S.stats.bestStreak, G.streak); G.score += G.mode === "survive" ? 50 * q.l + G.streak * 5 : G.mode === "speed" ? 100 + 20 * q.l : 0; }
    else { G.streak = 0; S.stats.streak = 0; }
    save();
    setTimeout(() => { if (G === ref) next(right, i === -1); }, speed ? 500 : 1700);
  }, speed ? 350 : 1100);
}
function next(right, timeout) {
  if (G.mode === "classic") {
    if (!right) return finish(timeout ? "timeout" : "wrong");
    if (G.i === LADDER.length - 1) return finish("million");
    G.i++; return R.game();
  }
  if (G.mode === "tour") {
    if (right) G.sr++;
    if (G.i % 3 === 2) {
      if (G.sr < 2) return finish("out");
      G.passed++; G.sr = 0;
      if (G.i >= 11) return finish("done");
      toast("✅ عديت " + STAGES[G.passed - 1] + " — يلا على " + STAGES[G.passed]);
    }
    G.i++; return R.game();
  }
  if (G.mode === "daily" || G.mode === "transfer") { if (G.i >= 9) return finish("done"); G.i++; return R.game(); }
  if (G.mode === "survive") { if (!right) return finish("wrong"); if (G.i >= G.n - 1) return finish("done"); G.i++; return R.game(); }
  if (G.mode === "speed") { if (G.i >= G.n - 1) return finish("done"); G.i++; return R.game(); }
}

function finish(why) {
  stopTimer();
  const g = G; G = null; if (!g) return go("home");
  let prize = 0, pts = 0, gems = 0, title = "", icon = "⚽", msg = "", info = "";
  const TT = g.mode === "tour" ? TOURS.find(x => x.k === g.tour) : null;
  const name = TT ? "🏟 " + TT.nm : { classic: "التحدي الكلاسيكي", daily: "تحدي اليوم", speed: "تحدي السرعة", survive: "تحدي الصمود", transfer: "اعرف اللاعب من انتقالاته" }[g.mode];
  if (g.mode === "classic") {
    if (why === "million") { prize = 1000000; S.stats.millions++; }
    else if (why === "withdraw") prize = g.i ? LADDER[g.i - 1] : 0;
    else { const s = [...SAFE].reverse().find(x => g.i > x); prize = s !== undefined ? LADDER[s] : 0; }
    pts = prize; gems = Math.round(prize / 400) + (why === "million" ? 500 : 0);
    S.stats.best = Math.max(S.stats.best, prize);
    info = fmt(prize);
    if (why === "million") { icon = "👑"; title = "مبروك! بقيت بطل المدرجات!"; msg = "جاوبت على كل الأسئلة الـ16 صح 🎉"; }
    else if (why === "withdraw") { icon = "💰"; title = "انسحاب ذكي"; msg = `خدت ${fmt(prize)}`; }
    else { icon = why === "timeout" ? "⏰" : "😢"; title = why === "timeout" ? "خلص الوقت!" : "إجابة غلط!"; const qq = g.qs[g.i]; msg = `الإجابة الصح: <b style="color:var(--gold1)">${esc(qq.opts[qq.ans].t)}</b><br>جايزتك: ${prize ? fmt(prize) : "0"}`; }
  } else if (g.mode === "daily") {
    S.dc = today(); S.stats.dailyDone++; pts = g.right * 50; gems = g.right * 20; info = g.right + "/10";
    icon = g.right >= 7 ? "🏆" : "👏"; title = "خلصت تحدي اليوم"; msg = `جاوبت ${g.right} من 10`;
  } else if (g.mode === "transfer") {
    pts = g.right * 50; gems = g.right * 20; info = g.right + "/10";
    icon = g.right >= 7 ? "🏆" : "👏"; title = "خلصت «اعرف اللاعب»"; msg = `عرفت ${g.right} لاعب من 10`;
  } else if (g.mode === "tour") {
    const champ = g.passed >= 4, pass = Math.min(4, g.passed);
    pts = g.right * 50 + (champ ? 200 : 0);
    gems = Math.round(TT.fee * STAGE_PAY.slice(0, pass).reduce((a, b) => a + b, 0)) + (champ && g.right === 12 ? Math.round(TT.fee * 0.1) : 0);
    info = champ ? "بطل 🏆" : STAGES[pass];
    icon = champ ? "👑" : pass >= 2 ? "🏆" : "👏";
    title = champ ? "مبروك! أنت بطل " + TT.nm : "خرجت من " + STAGES[pass];
    msg = champ ? `جاوبت ${g.right} من 12 وكسبت البطولة` : `عديت ${pass} ${pass === 1 ? "مرحلة" : "مراحل"} وجاوبت ${g.right} إجابة صح`;
    S.tour = S.tour || {}; const rec = S.tour[g.tour] = Object.assign({ games: 0, best: 0, correct: 0, pass: 0 }, S.tour[g.tour]);
    rec.games++; rec.best = Math.max(rec.best, g.right); rec.correct += g.right; rec.pass = Math.max(rec.pass || 0, pass);
  } else if (g.mode === "speed") {
    pts = g.score; gems = Math.floor(g.right / 2) * 5; info = g.right + " صح"; icon = "⏱"; title = "انتهى الوقت!"; msg = `جاوبت ${g.right} إجابة صح`;
  } else {
    pts = g.score; gems = Math.floor(g.right / 3) * 5; info = g.right + " صح"; icon = "🔥"; title = why === "done" ? "ما غلطتش ولا مرة!" : "غلطة وخلصت"; msg = `سلسلتك: ${g.right} إجابة صح`;
  }
  S.stats.games++; S.points += pts; S.gems += gems;
  S.hist.unshift({ mode: name, date: new Date().toLocaleDateString("ar-EG"), pts, info }); S.hist = S.hist.slice(0, 30);
  checkAch(); save();
  if (online()) buildPack(); // نحدّث حزمة الأوفلاين بأسئلة لسه ماشافهاش
  screen = "result"; window.scrollTo(0, 0);
  const lost = why === "wrong" || why === "timeout";
  if (why === "million") { celebrate(true); speak("مبروك! بقيت بطل المدرجات!"); }
  else if (!lost && pts > 0) { celebrate(false); speak("مبروك! أحسنت"); }
  else if (lost) { sfx.no(); sfx.boo(); speak(prize ? "حظ أوفر المرة الجاية" : "للأسف خسرت، جرّب تاني"); }
  app.innerHTML = `<div style="text-align:center;padding-top:40px"><div style="font-size:72px">${icon}</div><h2 style="font-size:26px">${title}</h2><p style="line-height:1.8">${msg}</p>
    <div class="grid2" style="margin:18px 0"><div class="card stat"><b>+${num(pts)}</b><small>نقاط</small></div><div class="card stat"><b>+${num(gems)} 💎</b><small>جواهر</small></div></div>
    <button class="btn" id="again">🔁 العب تاني</button>${TT ? '<button class="btn sec" id="tl" style="margin-top:10px">🏟 كل البطولات</button>' : ""}<button class="btn sec" id="hm" style="margin-top:10px">🏠 الرئيسية</button></div>`;
  $("#again").onclick = () => g.mode === "daily" ? go("challenges") : startGame(g.mode, g.tour);
  const tl = $("#tl"); if (tl) tl.onclick = () => go("tournaments");
  $("#hm").onclick = () => go("home");
}

/* ---------- ربط الأحداث ---------- */
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g && !g.closest(".modal")) { if ((G && screen === "game") || FM.lock) return; sfx.tap(); go(g.dataset.go); }
});
const onBack = () => {
  if (!$("#modal").classList.contains("hidden")) closeModal();
  else if (screen === "game" && G) confirmQuit();
  else if (screen === "forgot") go("login");
  else if (screen !== "home" && screen !== "login" && SES) go("home");
  else if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) Capacitor.Plugins.App.exitApp();
};
try { if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.App) Capacitor.Plugins.App.addListener("backButton", onBack); } catch (e) {}
window.addEventListener("online", () => { refreshQuestions(); cloudSync(); if (screen === "home") R.home(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") pushNow(true); });
window.addEventListener("pagehide", () => pushNow(true));
window.addEventListener("offline", () => { toast("النت قطع — هتكمل بأسئلة محفوظة 📴"); });

/* واجهة للملفات التانية (واحد ضد واحد) */
const FM = window.FM = {
  R, go, app, $, esc, toast, modal, closeModal, header, nav, sfx, vib, confetti, celebrate, speak, feedback, fmt, num, shuffle, norm, pickTier, validQ, qid, pickTr, isTr, online, save, rankOf, checkAch, LET, markServed,
  lock: false,
  get S() { return S; }, get SES() { return SES; },
  setLeave(f) { leaveHook = f; }
};

go("splash");
})();
