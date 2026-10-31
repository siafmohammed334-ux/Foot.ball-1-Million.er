/* قسم المزاد — ملف مستقل (بيعتمد على FM من app.js و Firebase زي duel.js) */
(function () {
"use strict";
const F = window.FM, CFG = window.CFG || {}, R = F.R, $ = F.$, esc = F.esc;
const base = () => String(CFG.FIREBASE_DB || "").replace(/\/+$/, "");
const ready = () => /^https?:\/\//.test(base());
async function db(m, p, b) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 7000);
  try { const r = await fetch(base() + p + ".json", { method: m, signal: c.signal, headers: { "Content-Type": "application/json" }, body: b === undefined ? undefined : JSON.stringify(b) });
    if (!r.ok) throw new Error("db"); return await r.json(); } finally { clearTimeout(t); }
}
const rid = () => Math.random().toString(36).slice(2, 10);
function myId() { let id = F.SES && F.SES.id; if (!id || id === "guest") { try { id = localStorage.getItem("fm_uid"); if (!id) { id = rid(); localStorage.setItem("fm_uid", id); } } catch (e) { id = rid(); } } return String(id).replace(/[.$#\[\]\/]/g, "_"); }
const CH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", mkCode = () => Array.from({ length: 6 }, () => CH[Math.floor(Math.random() * CH.length)]).join("");
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const POOL = [["ليونيل ميسي",99,"ATT"],["كريستيانو رونالدو",99,"ATT"],["كيليان مبابي",97,"ATT"],["إيرلينغ هالاند",96,"ATT"],["محمد صلاح",95,"ATT"],["نيمار",94,"ATT"],["فينيسيوس جونيور",94,"ATT"],["جود بيلينغهام",94,"MID"],["كريم بنزيما",93,"ATT"],["هاري كين",93,"ATT"],["كيفين دي بروين",93,"MID"],["لوكا مودريتش",92,"MID"],["رودري",92,"MID"],["فيرجيل فان دايك",92,"DEF"],["تيبو كورتوا",92,"GK"],["روبرت ليفاندوفسكي",92,"ATT"],["أليسون بيكر",91,"GK"],["تشافي",91,"MID"],["أندريس إنييستا",91,"MID"],["سيرخيو راموس",90,"DEF"],["مانويل نوير",90,"GK"],["سون هيونغ مين",89,"ATT"],["لاوتارو مارتينيز",89,"ATT"],["أشرف حكيمي",88,"DEF"],["محمد أبو تريكة",88,"MID"],["ديدييه دروغبا",88,"ATT"],["ياسين بونو",86,"GK"],["رياض محرز",86,"ATT"],["ساديو ماني",86,"ATT"],["يايا توريه",87,"MID"],["أندريا بيرلو",88,"MID"],["إدين هازارد",88,"ATT"],["مارسيلو",88,"DEF"],["عمر مرموش",84,"ATT"],["حكيم زياش",82,"MID"],["محمود تريزيغيه",80,"ATT"],["يوسف النصيري",79,"ATT"],["محمد النني",78,"MID"],["محمد الشناوي",76,"GK"],["مصطفى محمد",75,"ATT"],["أحمد حجازي",72,"DEF"],["رامي ربيعة",74,"DEF"],["أحمد فتحي",73,"DEF"],["عبد الله السعيد",74,"MID"],["محمد عبد المنعم",72,"DEF"],["لاعب ناشئ واعد",66,"MID"]];
const COACHES = [["أليكس فيرغسون",98],["بيب غوارديولا",97],["كارلو أنشيلوتي",96],["يورغن كلوب",94],["زين الدين زيدان",93],["جوزيه مورينيو",92],["لويس إنريكي",91],["ديدييه ديشان",90],["دييغو سيميوني",90],["مدرب محلي",76],["مدرب مغمور",72],["مدرب ناشئين",70]];
const FMT = { five: { n: 5, bud: 100, nm: "خماسي" }, full: { n: 11, bud: 200, nm: "ملعب كامل 11" } };
const BID_MS = 12000, ROUND = 15000;
const val = r => Math.max(1, Math.round(Math.pow((r - 60) / 10, 3)));
let M = null, fmtK = "five";
function stop() { if (M) { clearInterval(M.tick); clearInterval(M.poll); M.dead = true; } if (M && M.open) db("DELETE", "/auc_open/" + M.fmt + "/" + M.code).catch(() => {}); M = null; }
const left = t => M.n - t.pl.length;
const maxBid = t => left(t) > 0 ? Math.max(0, t.bud - (left(t) - 1)) : 0;
const view = h => { F.app.innerHTML = h; };

R.auction = function () {
  stop(); F.setLeave(stop);
  view(`<div class="card" style="text-align:center"><h3>🔨 المزاد</h3><p>اشتري لاعبين بميزانيتك، واللي تشكيلته أقوى يكسب المباراة!</p></div>
  <div class="card"><b>اختار نوع المزاد</b><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ${fmtK==="five"?"":"sec"}" id="f5">خماسي · 100 م</button><button class="btn ${fmtK==="full"?"":"sec"}" id="f11">ملعب كامل 11 · 200 م</button></div></div>
  <button class="btn big" id="ai">🤖 ضد الذكاء الاصطناعي</button>
  <button class="btn sec" id="rnd" style="margin-top:10px">🎲 منافس عشوائي</button>
  <button class="btn sec" id="mk" style="margin-top:10px">🏠 إنشاء غرفة (كود لصديقك)</button>
  <div style="display:flex;gap:8px;margin-top:10px"><input id="cd" placeholder="كود الغرفة" maxlength="6" style="flex:1;padding:12px;border-radius:12px;text-align:center;text-transform:uppercase"><button class="btn sec" id="jn">دخول</button></div>
  <button class="btn sec" id="bk" style="margin-top:14px">رجوع</button>`);
  $("#f5").onclick = () => { fmtK = "five"; R.auction(); }; $("#f11").onclick = () => { fmtK = "full"; R.auction(); };
  $("#ai").onclick = () => begin({ mode: "ai", role: "h", seed: Math.floor(Math.random() * 1e9), t0: Date.now() + 2500 });
  $("#rnd").onclick = randomMatch; $("#mk").onclick = () => createRoom(false); $("#jn").onclick = joinRoom; $("#bk").onclick = () => F.go("home");
};
function guard() { if (!F.online()) { F.toast("المزاد أونلاين محتاج إنترنت"); return false; } if (!ready()) { F.toast("الأونلاين مش مفعّل"); return false; } return true; }
async function createRoom(open) {
  if (!guard()) return false; const code = mkCode(), seed = Math.floor(Math.random() * 1e9), me = { id: myId(), name: (F.SES && F.SES.name) || "لاعب" };
  try { await db("PUT", "/auc/" + code, { seed, fmt: fmtK, host: me, state: "wait" }); if (open) await db("PUT", "/auc_open/" + fmtK + "/" + code, Date.now()); } catch (e) { F.toast("تعذر إنشاء الغرفة"); return false; }
  stop(); M = { code, open, fmt: fmtK }; F.setLeave(stop);
  view(`<div class="card" style="text-align:center"><h3>${open ? "بندوّر على منافس…" : "كود الغرفة"}</h3>${open ? "" : `<div style="font-size:42px;letter-spacing:6px;margin:12px 0"><b>${code}</b></div><p>ابعته لصديقك وخلّيه يدخل الكود</p>`}</div><button class="btn sec" id="cx">إلغاء</button>`);
  $("#cx").onclick = () => R.auction(); const t00 = Date.now();
  M.poll = setInterval(async () => { try { const r = await db("GET", "/auc/" + code); if (r && r.guest && !r.t0) { const t0 = Date.now() + 4000; await db("PUT", "/auc/" + code + "/t0", t0); const s = { mode: "on", role: "h", seed, t0, code, opp: r.guest.name, fmt: fmtK }; stop(); begin(s); } else if (open && Date.now() - t00 > 40000) { stop(); F.toast("مفيش منافس دلوقتي، العب ضد الـAI"); R.auction(); } } catch (e) {} }, 1000);
  return true;
}
async function randomMatch() {
  if (!guard()) return;
  try { const o = await db("GET", "/auc_open/" + fmtK) || {}; const k = Object.keys(o).find(c => Date.now() - o[c] < 45000);
    if (k) { await db("DELETE", "/auc_open/" + fmtK + "/" + k); return enter(k); } } catch (e) {}
  createRoom(true);
}
function joinRoom() { const c = ($("#cd").value || "").trim().toUpperCase(); if (c.length < 4) return F.toast("اكتب الكود"); if (guard()) enter(c); }
async function enter(code) {
  try { const r = await db("GET", "/auc/" + code); if (!r || r.guest) return F.toast("الغرفة مش موجودة أو ممتلئة");
    await db("PUT", "/auc/" + code + "/guest", { id: myId(), name: (F.SES && F.SES.name) || "لاعب" });
    stop(); M = { code }; F.setLeave(stop); view(`<div class="card" style="text-align:center"><h3>دخلت الغرفة ✅</h3><p>مستنيين المزاد يبدأ…</p></div>`);
    M.poll = setInterval(async () => { try { const x = await db("GET", "/auc/" + code); if (x && x.t0) { const s = { mode: "on", role: "g", seed: x.seed, t0: x.t0, code, opp: x.host.name, fmt: x.fmt }; stop(); begin(s); } } catch (e) {} }, 1000);
  } catch (e) { F.toast("تعذر الدخول"); }
}
function begin(s) {
  const f = FMT[s.fmt || fmtK], rg = rng(s.seed), pool = POOL.slice(); for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rg() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  stop(); M = Object.assign({ n: f.n, rounds: f.n * 2 + 4, pool, rg, teams: { h: { pl: [], bud: f.bud }, g: { pl: [], bud: f.bud } }, cur: -1, mine: {}, done: {}, stg: 1, oppName: s.opp || "فريق AI", fmt: s.fmt || fmtK }, s);
  F.setLeave(stop); M.tick = setInterval(step, 250); step();
}
function step() {
  if (!M || M.dead || M.fin) return; const el = Date.now() - M.t0;
  if (el < 0) return view(`<div class="card" style="text-align:center"><h3>المزاد هيبدأ بعد ${Math.ceil(-el / 1000)}…</h3></div>`);
  const r = Math.floor(el / ROUND), ph = el % ROUND, full = left(M.teams.h) <= 0 && left(M.teams.g) <= 0;
  if (M.cur >= 0 && !M.done[M.cur] && (r > M.cur || ph >= BID_MS + 400)) { if (!M.sub) submit(); if (!M.busy) resolve(M.cur); return; }
  if (M.cur >= 0 && M.done[M.cur] && (r >= M.rounds || full)) { M.fin = 1; setTimeout(finish, 1800); return; }
  if (r >= M.rounds) return;
  if (r !== M.cur && (M.cur < 0 || M.done[M.cur])) { M.cur = r; M.stg = 1; M.sub = false; draw(); }
  const t = Math.max(0, Math.ceil((BID_MS - ph) / 1000)), tm = $("#tm"); if (tm) tm.textContent = "00:" + String(t).padStart(2, "0");
  if (M.cur === r && ph >= BID_MS - 100 && !M.sub) submit();
}
function draw() {
  const p = M.pool[M.cur], me = M.teams[M.role], op = M.teams[M.role === "h" ? "g" : "h"], mb = maxBid(me);
  view(`<div class="card" style="text-align:center"><small>جولة ${M.cur + 1}/${M.rounds}</small><div style="display:flex;justify-content:space-between;margin:6px 0"><b>أنت: ${me.bud} م · ${me.pl.length}/${M.n}</b><b>${esc(M.oppName)}: ${op.bud} م · ${op.pl.length}/${M.n}</b></div><div id="tm" style="font-size:26px;color:var(--gold1)">00:12</div></div>
  <div class="card" style="text-align:center"><div style="font-size:56px"><b>${p[1]}</b></div><div style="font-size:20px"><b>${p[0]}</b></div><small>${p[2]}</small></div>
  <div id="bx" class="card" style="text-align:center">${mb < 1 ? "<p>تشكيلتك كاملة ✅</p>" : `<div style="display:flex;align-items:center;justify-content:center;gap:10px"><button class="btn sec" id="m1">−1</button><b id="bv" style="font-size:30px">${M.stg} م</b><button class="btn sec" id="p1">+1</button><button class="btn sec" id="p5">+5</button></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn" id="ok">تأكيد المزايدة</button><button class="btn sec" id="sk">تخطي اللاعب</button></div>`}</div><div id="rs"></div>`);
  if (mb < 1) return;
  const upd = d => { M.stg = Math.max(1, Math.min(mb, M.stg + d)); $("#bv").textContent = M.stg + " م"; };
  $("#m1").onclick = () => upd(-1); $("#p1").onclick = () => upd(1); $("#p5").onclick = () => upd(5);
  $("#ok").onclick = () => { if (!M.sub) { submit(); $("#bx").innerHTML = "<p>تم تأكيد مزايدتك: " + M.stg + " م ✅</p>"; } }; $("#sk").onclick = () => { if (!M.sub) { M.stg = 0; submit(); $("#bx").innerHTML = "<p>تخطيت اللاعب</p>"; } };
}
function submit() {
  if (M.sub) return; M.sub = true; const me = M.teams[M.role], v = Math.min(M.stg, maxBid(me)), r = M.cur; M.mine[r] = v;
  if (M.mode === "on") db("PUT", "/auc/" + M.code + "/b/" + r + "/" + M.role, v).catch(() => {});
}
async function resolve(r) {
  M.busy = true; const opR = M.role === "h" ? "g" : "h", p = M.pool[r]; let ob = 0;
  if (M.mode === "on") { for (let i = 0; i < 5; i++) { try { const x = await db("GET", "/auc/" + M.code + "/b/" + r + "/" + opR); if (x !== null && x !== undefined) { ob = +x || 0; break; } } catch (e) {} await new Promise(s => setTimeout(s, 400)); } }
  else { const t = M.teams[opR], mb = maxBid(t); ob = mb < 1 || M.rg() < 0.15 ? 0 : Math.max(1, Math.min(mb, Math.round(val(p[1]) * (0.55 + M.rg() * 0.6)))); }
  if (!M || M.dead) return;
  const bid = { [M.role]: M.mine[r] || 0, [opR]: ob }, h = M.teams.h, g = M.teams.g;
  const hb = Math.min(bid.h, maxBid(h)), gb = Math.min(bid.g, maxBid(g)); let w = null;
  if (hb > 0 || gb > 0) w = hb >= gb ? "h" : "g"; if (hb === 0 && gb === 0) w = null;
  if (w) { const t = M.teams[w], pr = w === "h" ? hb : gb; t.bud -= pr; t.pl.push({ n: p[0], r: p[1], p: p[2], pr }); }
  M.done[r] = true; M.busy = false; const rs = $("#rs");
  if (rs) rs.innerHTML = `<div class="card" style="text-align:center">${!w ? "محدش اشتراه" : (w === M.role ? "✅ اشتريته بـ " : "❌ اشتراه المنافس بـ ") + (w === "h" ? hb : gb) + " م"}<br><small>مزايدتك ${bid[M.role]} م · المنافس ${bid[opR]} م</small></div>`;
}
function finish() {
  if (!M) return; const m = M; clearInterval(m.tick); const rg = rng(m.seed + 7);
  [m.teams.h, m.teams.g].forEach(t => { while (t.pl.length < m.n) t.pl.push({ n: "لاعب احتياطي", r: 60, p: "MID", pr: 0 }); });
  const rich = m.teams.h.bud >= m.teams.g.bud ? "h" : "g", pick = top => COACHES.slice(top ? 0 : 6, top ? 6 : 12)[Math.floor(rg() * 6)];
  m.teams[rich].c = pick(true); m.teams[rich === "h" ? "g" : "h"].c = pick(false);
  const st = t => t.pl.reduce((a, x) => a + x.r, 0) / m.n + (t.c[1] - 85) * 0.4, sh = st(m.teams.h), sg = st(m.teams.g), goals = [], sc = { h: 0, g: 0 };
  const shoot = (k, mn) => { const c = m.teams[k].pl.filter(x => x.p !== "GK"), w = c.map(x => Math.pow(x.r, 3)), s = w.reduce((a, b) => a + b, 0); let q = rg() * s, i = 0; while (i < c.length - 1 && (q -= w[i]) > 0) i++; goals.push({ k, mn, n: c[i].n }); sc[k]++; };
  for (let i = 0; i < 9; i++) { [["h", sh - sg], ["g", sg - sh]].forEach(([k, d]) => { if (rg() < Math.min(0.6, Math.max(0.04, 0.2 + d * 0.012))) shoot(k, i * 10 + 1 + Math.floor(rg() * 9)); }); }
  goals.sort((a, b) => a.mn - b.mn); const wk = sc.h > sc.g ? "h" : sc.g > sc.h ? "g" : null, mk = wk || (sh >= sg ? "h" : "g");
  const gs = goals.filter(x => x.k === mk), motm = gs.length ? gs.reduce((a, x) => (a[x.n] = (a[x.n] || 0) + 1, a), {}) : null;
  const best = motm ? Object.keys(motm).sort((a, b) => motm[b] - motm[a])[0] : m.teams[mk].pl.slice().sort((a, b) => b.r - a.r)[0].n;
  const mine = m.role, res = !wk ? "d" : wk === mine ? "w" : "l", S = F.S, gem = { w: 60, d: 30, l: 15 }[res], pt = { w: 25, d: 8, l: -10 }[res];
  S.gems += gem; S.points = Math.max(0, S.points + pt); try { F.checkAch(); } catch (e) {} F.save(); if (res === "w") try { F.sfx.cheer(true); F.confetti(30); } catch (e) {}
  const L = t => t.pl.map(x => esc(x.n) + " (" + x.r + ")").join("، ");
  view(`<div class="card" style="text-align:center"><h3>${res === "w" ? "🏆 فوز!" : res === "d" ? "🤝 تعادل" : "❌ خسارة"}</h3><div style="font-size:40px"><b>${sc[mine === "h" ? "h" : "g"]} - ${sc[mine === "h" ? "g" : "h"]}</b></div><small>أنت ضد ${esc(m.oppName)}</small></div>
  <div class="card"><b>الأهداف</b><br>${goals.map(x => `${x.mn}' ${esc(x.n)} ${x.k === mine ? "✅" : "⚽"}`).join("<br>") || "مباراة بدون أهداف"}</div>
  <div class="card" style="text-align:center">⭐ رجل المباراة: <b>${esc(best)}</b></div>
  <div class="card"><small><b>تشكيلتك:</b> ${L(m.teams[mine])}<br>المدرب: ${esc(m.teams[mine].c[0])}<br><b>المنافس:</b> ${L(m.teams[mine === "h" ? "g" : "h"])}<br>المدرب: ${esc(m.teams[mine === "h" ? "g" : "h"].c[0])}</small></div>
  <div class="card" style="text-align:center">💎 +${gem} جوهرة · النقاط ${pt > 0 ? "+" : ""}${pt}</div>
  <button class="btn big" id="ag">مزاد جديد</button><button class="btn sec" id="hm" style="margin-top:10px">الرئيسية</button>`);
  M = null; $("#ag").onclick = () => F.go("auction"); $("#hm").onclick = () => F.go("home");
}
const home = R.home;
R.home = function () { home.apply(this, arguments); const d = $("#duel"); if (d && !$("#auc")) { d.insertAdjacentHTML("afterend", '<button class="btn sec" id="auc" style="margin-top:12px">🔨 المزاد</button>'); $("#auc").onclick = () => F.go("auction"); } };
})();
