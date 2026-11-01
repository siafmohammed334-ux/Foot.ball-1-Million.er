/* قسم المزاد — نسخة جديدة: كروت لاعبين + مدربين + مباراة محاكاة (بيعتمد على FM من app.js و Firebase زي duel.js) */
(function () {
"use strict";
const NAT = {
ARG:["الأرجنتين","Argentina","🇦🇷","#75aadb"],POR:["البرتغال","Portugal","🇵🇹","#b3121f"],FRA:["فرنسا","France","🇫🇷","#1b3a8c"],NOR:["النرويج","Norway","🇳🇴","#c8102e"],
EGY:["مصر","Egypt","🇪🇬","#c8102e"],BRA:["البرازيل","Brazil","🇧🇷","#f3c600"],ENG:["إنجلترا","England","🏴󠁧󠁢󠁥󠁮󠁧󠁿","#eeeeee"],BEL:["بلجيكا","Belgium","🇧🇪","#c8102e"],
CRO:["كرواتيا","Croatia","🇭🇷","#d6262f"],ESP:["إسبانيا","Spain","🇪🇸","#c60b1e"],NED:["هولندا","Netherlands","🇳🇱","#f36c21"],GER:["ألمانيا","Germany","🇩🇪","#f2f2f2"],
POL:["بولندا","Poland","🇵🇱","#dc143c"],KOR:["كوريا الجنوبية","South Korea","🇰🇷","#c60c30"],MAR:["المغرب","Morocco","🇲🇦","#c1272d"],URU:["الأوروغواي","Uruguay","🇺🇾","#5bb2e8"],
ITA:["إيطاليا","Italy","🇮🇹","#0a5cc5"],CIV:["كوت ديفوار","Ivory Coast","🇨🇮","#f77f00"],NGA:["نيجيريا","Nigeria","🇳🇬","#0b8a3c"],SEN:["السنغال","Senegal","🇸🇳","#00853f"],
ALG:["الجزائر","Algeria","🇩🇿","#0b7a3c"],TUN:["تونس","Tunisia","🇹🇳","#e70013"],CMR:["الكاميرون","Cameroon","🇨🇲","#0b8a3c"],GHA:["غانا","Ghana","🇬🇭","#f4c20d"],
COL:["كولومبيا","Colombia","🇨🇴","#f6c800"],MEX:["المكسيك","Mexico","🇲🇽","#0b7a3c"],JPN:["اليابان","Japan","🇯🇵","#1c3f94"],SWE:["السويد","Sweden","🇸🇪","#f1c40f"],
DEN:["الدنمارك","Denmark","🇩🇰","#c8102e"],SUI:["سويسرا","Switzerland","🇨🇭","#d52b1e"],SRB:["صربيا","Serbia","🇷🇸","#c6363c"],AUT:["النمسا","Austria","🇦🇹","#ed2939"],
TUR:["تركيا","Turkey","🇹🇷","#e30a17"],CAN:["كندا","Canada","🇨🇦","#d80621"],USA:["أمريكا","USA","🇺🇸","#1d3a7a"],SCO:["اسكتلندا","Scotland","🏴󠁧󠁢󠁳󠁣󠁴󠁿","#1b3a8c"],
WAL:["ويلز","Wales","🏴󠁧󠁢󠁷󠁬󠁳󠁿","#c8102e"],CHI:["تشيلي","Chile","🇨🇱","#d52b1e"],SVN:["سلوفينيا","Slovenia","🇸🇮","#1e5aa8"],GEO:["جورجيا","Georgia","🇬🇪","#e8e8e8"],
LBR:["ليبيريا","Liberia","🇱🇷","#b22234"],BUL:["بلغاريا","Bulgaria","🇧🇬","#0b7a3c"],URS:["الاتحاد السوفييتي","USSR","🇷🇺","#c8102e"],ECU:["الإكوادور","Ecuador","🇪🇨","#f6c800"],
KSA:["السعودية","Saudi Arabia","🇸🇦","#0b7a3c"],MLI:["مالي","Mali","🇲🇱","#f4c20d"],GAB:["الجابون","Gabon","🇬🇦","#0b8a3c"],RSA:["جنوب أفريقيا","South Africa","🇿🇦","#0b7a3c"],
CZE:["التشيك","Czechia","🇨🇿","#d7141a"],PAR:["باراغواي","Paraguay","🇵🇾","#d52b1e"],PER:["بيرو","Peru","🇵🇪","#d91023"],UKR:["أوكرانيا","Ukraine","🇺🇦","#f6c800"]
};
// [الاسم بالعربي، الاسم بالإنجليزي، المنتخب، المركز، الأوفر (تقريبي على طريقة ألعاب الكرة)]
const P = (a,e,n,p,o)=>({ar:a,en:e,nat:n,pos:p,ovr:o});
const POOL = [
// ===== نجوم حاليين =====
P("كيليان مبابي","Kylian Mbappé","FRA","ATT",91),P("إيرلينغ هالاند","Erling Haaland","NOR","ATT",91),P("رودري","Rodri","ESP","MID",91),
P("عثمان ديمبيلي","Ousmane Dembélé","FRA","ATT",90),P("فينيسيوس جونيور","Vinícius Júnior","BRA","ATT",90),P("جود بيلينغهام","Jude Bellingham","ENG","MID",90),
P("هاري كين","Harry Kane","ENG","ATT",90),P("محمد صلاح","Mohamed Salah","EGY","ATT",90),P("ليونيل ميسي","Lionel Messi","ARG","ATT",88),
P("كريستيانو رونالدو","Cristiano Ronaldo","POR","ATT",86),P("لامين يامال","Lamine Yamal","ESP","ATT",89),P("رافينيا","Raphinha","BRA","ATT",88),
P("لاوتارو مارتينيز","Lautaro Martínez","ARG","ATT",88),P("كيفين دي بروين","Kevin De Bruyne","BEL","MID",88),P("بيدري","Pedri","ESP","MID",88),
P("فيدي فالفيردي","Federico Valverde","URU","MID",88),P("فيرجيل فان دايك","Virgil van Dijk","NED","DEF",89),P("روبن دياز","Rúben Dias","POR","DEF",88),
P("تيبو كورتوا","Thibaut Courtois","BEL","GK",89),P("أليسون بيكر","Alisson Becker","BRA","GK",89),P("جيانلويجي دوناروما","Gianluigi Donnarumma","ITA","GK",88),
P("إيميليانو مارتينيز","Emiliano Martínez","ARG","GK",87),P("مايك مينيان","Mike Maignan","FRA","GK",87),P("يان أوبلاك","Jan Oblak","SVN","GK",87),
P("مارك أندريه تير شتيغن","Marc-André ter Stegen","GER","GK",87),P("ياسين بونو","Yassine Bounou","MAR","GK",85),P("مانويل نوير","Manuel Neuer","GER","GK",85),
P("أشرف حكيمي","Achraf Hakimi","MAR","DEF",87),P("وليام ساليبا","William Saliba","FRA","DEF",87),P("غابرييل ماغالهايس","Gabriel Magalhães","BRA","DEF",86),
P("ماركينيوس","Marquinhos","BRA","DEF",86),P("ترينت ألكسندر أرنولد","Trent Alexander-Arnold","ENG","DEF",86),P("أليساندرو باستوني","Alessandro Bastoni","ITA","DEF",86),
P("كريستيان روميرو","Cristian Romero","ARG","DEF",85),P("جول كوندي","Jules Koundé","FRA","DEF",85),P("داني كارفاخال","Dani Carvajal","ESP","DEF",85),
P("نونو مينديش","Nuno Mendes","POR","DEF",85),P("ثيو هيرنانديز","Theo Hernández","FRA","DEF",85),P("أنطونيو روديغر","Antonio Rüdiger","GER","DEF",85),
P("مانويل أكانجي","Manuel Akanji","SUI","DEF",84),P("يوشكو غفارديول","Joško Gvardiol","CRO","DEF",84),P("إيدير ميليتاو","Éder Militão","BRA","DEF",84),
P("كيم مين جاي","Kim Min-jae","KOR","DEF",83),P("كاليدو كوليبالي","Kalidou Koulibaly","SEN","DEF",82),P("ألفونسو ديفيز","Alphonso Davies","CAN","DEF",83),
P("أندرو روبرتسون","Andrew Robertson","SCO","DEF",82),P("رياض ربيعة","Ramy Rabia","EGY","DEF",74),P("أحمد حجازي","Ahmed Hegazi","EGY","DEF",72),
P("محمد عبد المنعم","Mohamed Abdelmonem","EGY","DEF",72),P("أحمد فتحي","Ahmed Fathy","EGY","DEF",72),
P("جمال موسيالا","Jamal Musiala","GER","MID",87),P("فلوريان فيرتز","Florian Wirtz","GER","MID",87),P("مارتن أوديغارد","Martin Ødegaard","NOR","MID",87),
P("ديكلان رايس","Declan Rice","ENG","MID",87),P("برونو فيرنانديز","Bruno Fernandes","POR","MID",87),P("برناردو سيلفا","Bernardo Silva","POR","MID",87),
P("نيكولو باريلا","Nicolò Barella","ITA","MID",87),P("جوشوا كيميتش","Joshua Kimmich","GER","MID",87),P("هاكان تشالهان أوغلو","Hakan Çalhanoğlu","TUR","MID",86),
P("كول بالمر","Cole Palmer","ENG","MID",86),P("فيل فودين","Phil Foden","ENG","MID",86),P("ألكسيس ماك أليستر","Alexis Mac Allister","ARG","MID",85),
P("فيتينيا","Vitinha","POR","MID",85),P("أوريليان تشواميني","Aurélien Tchouaméni","FRA","MID",85),P("برونو غيمارايش","Bruno Guimarães","BRA","MID",85),
P("لوكا مودريتش","Luka Modrić","CRO","MID",85),P("دانيال أولمو","Dani Olmo","ESP","MID",84),P("إدواردو كامافينغا","Eduardo Camavinga","FRA","MID",84),
P("جواو نيفيز","João Neves","POR","MID",84),P("إنزو فرنانديز","Enzo Fernández","ARG","MID",83),P("مويسيس كايسيدو","Moisés Caicedo","ECU","MID",83),
P("لوكاس باكيتا","Lucas Paquetá","BRA","MID",82),P("غرانيت تشاكا","Granit Xhaka","SUI","MID",82),P("ماتيو كوفاسيتش","Mateo Kovačić","CRO","MID",82),
P("إلكاي غوندوغان","İlkay Gündoğan","GER","MID",81),P("سكوت ماكتوميناي","Scott McTominay","SCO","MID",81),P("كاسيميرو","Casemiro","BRA","MID",80),
P("آردا غولر","Arda Güler","TUR","MID",80),P("كريستيان إريكسن","Christian Eriksen","DEN","MID",80),P("سفيان أمرابط","Sofyan Amrabat","MAR","MID",79),
P("حكيم زياش","Hakim Ziyech","MAR","MID",78),P("جيمس رودريغيز","James Rodríguez","COL","MID",78),P("محمد النني","Mohamed Elneny","EGY","MID",75),
P("عبد الله السعيد","Abdallah El Said","EGY","MID",74),
P("بوكايو ساكا","Bukayo Saka","ENG","ATT",87),P("أليكسندر إيساك","Alexander Isak","SWE","ATT",87),P("خفيتشا كفاراتسخيليا","Khvicha Kvaratskhelia","GEO","ATT",86),
P("رافائيل لياو","Rafael Leão","POR","ATT",86),P("فيكتور أوسيمين","Victor Osimhen","NGA","ATT",86),P("روبرت ليفاندوفسكي","Robert Lewandowski","POL","ATT",87),
P("خوليان ألفاريز","Julián Álvarez","ARG","ATT",86),P("لويس دياز","Luis Díaz","COL","ATT",85),P("فيكتور غيوكيريس","Viktor Gyökeres","SWE","ATT",85),
P("سون هيونغ مين","Son Heung-min","KOR","ATT",85),P("أنطوان غريزمان","Antoine Griezmann","FRA","ATT",85),P("رودريغو","Rodrygo","BRA","ATT",84),
P("نيكو ويليامز","Nico Williams","ESP","ATT",84),P("رياض محرز","Riyad Mahrez","ALG","ATT",84),P("نيمار","Neymar","BRA","ATT",84),
P("ليروي ساني","Leroy Sané","GER","ATT",84),P("عمر مرموش","Omar Marmoush","EGY","ATT",83),P("ساديو ماني","Sadio Mané","SEN","ATT",83),
P("أديمولا لوكمان","Ademola Lookman","NGA","ATT",83),P("دوشان فلاهوفيتش","Dušan Vlahović","SRB","ATT",83),P("سيرج غنابري","Serge Gnabry","GER","ATT",83),
P("جوناثان ديفيد","Jonathan David","CAN","ATT",82),P("براهيم دياز","Brahim Díaz","MAR","ATT",82),P("محمد قدوس","Mohammed Kudus","GHA","ATT",82),
P("كاي هافيرتز","Kai Havertz","GER","ATT",82),P("غابرييل جيسوس","Gabriel Jesus","BRA","ATT",81),P("كريستيان بوليسيتش","Christian Pulisic","USA","ATT",81),
P("داروين نونيز","Darwin Núñez","URU","ATT",80),P("كاورو ميتوما","Kaoru Mitoma","JPN","ATT",80),P("تاكيفوسا كوبو","Takefusa Kubo","JPN","ATT",80),
P("سانتياغو خيمينيز","Santiago Giménez","MEX","ATT",80),P("يوسف النصيري","Youssef En-Nesyri","MAR","ATT",79),P("محمود تريزيغيه","Mahmoud Trézéguet","EGY","ATT",78),
P("إندريك","Endrick","BRA","ATT",78),P("مصطفى محمد","Mostafa Mohamed","EGY","ATT",76),
P("إدوارد مندي","Édouard Mendy","SEN","GK",80),P("محمد الشناوي","Mohamed El Shenawy","EGY","GK",76),P("كاسبر شمايكل","Kasper Schmeichel","DEN","GK",76),
P("جريجور كوبل","Gregor Kobel","SUI","GK",84),P("ديفيد رايا","David Raya","ESP","GK",83),P("ديوغو كوستا","Diogo Costa","POR","GK",83),
P("رونالد أراوخو","Ronald Araújo","URU","DEF",83),P("يوريان تيمبر","Jurriën Timber","NED","DEF",82),P("ريس جيمس","Reece James","ENG","DEF",82),
P("فيديريكو ديماركو","Federico Dimarco","ITA","DEF",82),P("باو كوبارسي","Pau Cubarsí","ESP","DEF",81),P("بيدرو بورو","Pedro Porro","ESP","DEF",80),
P("فرينكي دي يونغ","Frenkie de Jong","NED","MID",84),P("مارتن زوبيميندي","Martín Zubimendi","ESP","MID",83),P("ريان خرافنبيرخ","Ryan Gravenberch","NED","MID",83),
P("ساندرو تونالي","Sandro Tonali","ITA","MID",83),P("وارن زائير إيمري","Warren Zaïre-Emery","FRA","MID",80),P("كوبي ماينو","Kobbie Mainoo","ENG","MID",79),
P("مايكل أوليسي","Michael Olise","FRA","ATT",84),P("ديزيريه دويه","Désiré Doué","FRA","ATT",83),P("ميكيل أويارسابال","Mikel Oyarzabal","ESP","ATT",83),
P("برادلي باركولا","Bradley Barcola","FRA","ATT",82),P("كينان يلدز","Kenan Yıldız","TUR","ATT",80),
// ===== أساطير =====
P("بيليه","Pelé","BRA","ATT",98),P("دييغو مارادونا","Diego Maradona","ARG","ATT",97),P("يوهان كرويف","Johan Cruyff","NED","ATT",97),P("زين الدين زيدان","Zinedine Zidane","FRA","MID",96),
P("رونالدو الظاهرة","Ronaldo Nazário","BRA","ATT",96),P("فرانتس بيكنباور","Franz Beckenbauer","GER","DEF",96),P("باولو مالديني","Paolo Maldini","ITA","DEF",94),
P("جيرد مولر","Gerd Müller","GER","ATT",94),P("ماركو فان باستن","Marco van Basten","NED","ATT",94),P("رونالدينيو","Ronaldinho","BRA","ATT",93),
P("ليف ياشين","Lev Yashin","URS","GK",95),P("جيجي بوفون","Gianluigi Buffon","ITA","GK",92),P("إيكر كاسياس","Iker Casillas","ESP","GK",91),
P("أوليفر كان","Oliver Kahn","GER","GK",91),P("إدوين فان در سار","Edwin van der Sar","NED","GK",89),P("فابيو كانافارو","Fabio Cannavaro","ITA","DEF",92),
P("تييري هنري","Thierry Henry","FRA","ATT",92),P("أندريس إنييستا","Andrés Iniesta","ESP","MID",91),P("أندريا بيرلو","Andrea Pirlo","ITA","MID",91),
P("كاكا","Kaká","BRA","MID",90),P("تشافي","Xavi","ESP","MID",90),P("جورج وياه","George Weah","LBR","ATT",90),P("فرانشيسكو توتي","Francesco Totti","ITA","ATT",90),
P("كارليس بويول","Carles Puyol","ESP","DEF",90),P("روبرتو كارلوس","Roberto Carlos","BRA","DEF",90),P("كافو","Cafu","BRA","DEF",90),P("سيرخيو راموس","Sergio Ramos","ESP","DEF",89),
P("ديدييه دروغبا","Didier Drogba","CIV","ATT",89),P("ستيفن جيرارد","Steven Gerrard","ENG","MID",89),P("يايا توريه","Yaya Touré","CIV","MID",88),
P("فرانك لامبارد","Frank Lampard","ENG","MID",88),P("واين روني","Wayne Rooney","ENG","ATT",88),P("صامويل إيتو","Samuel Eto'o","CMR","ATT",88),
P("كريم بنزيما","Karim Benzema","FRA","ATT",88),P("إدين هازارد","Eden Hazard","BEL","ATT",88),P("مارسيلو","Marcelo","BRA","DEF",88),P("تياغو سيلفا","Thiago Silva","BRA","DEF",86),
P("محمد أبو تريكة","Mohamed Aboutrika","EGY","MID",86),P("جاي جاي أوكوتشا","Jay-Jay Okocha","NGA","MID",87),P("غاريث بيل","Gareth Bale","WAL","ATT",86),
P("حسام حسن","Hossam Hassan","EGY","ATT",80),P("عصام الحضري","Essam El Hadary","EGY","GK",80),P("أحمد حسام ميدو","Ahmed Hossam Mido","EGY","ATT",76),
P("محمد زيدان","Mohamed Zidan","EGY","ATT",75),P("وائل جمعة","Wael Gomaa","EGY","DEF",74),
P("بيتر شمايكل","Peter Schmeichel","DEN","GK",90),P("فرانكو باريزي","Franco Baresi","ITA","DEF",93),P("فيليب لام","Philipp Lahm","GER","DEF",89),
P("نيمانيا فيديتش","Nemanja Vidić","SRB","DEF",88),P("ريو فرديناند","Rio Ferdinand","ENG","DEF",87),P("لوثار ماتيوس","Lothar Matthäus","GER","MID",92),
P("ميشيل بلاتيني","Michel Platini","FRA","MID",93),P("لويس فيغو","Luís Figo","POR","MID",90),P("ديفيد بيكهام","David Beckham","ENG","MID",88),
P("زلاتان إبراهيموفيتش","Zlatan Ibrahimović","SWE","ATT",91),P("روبرتو باجيو","Roberto Baggio","ITA","ATT",93),P("ريفالدو","Rivaldo","BRA","ATT",91),
P("أندريه شيفتشينكو","Andriy Shevchenko","UKR","ATT",90)
];
const F = window.FM, CFG = window.CFG || {}, R = F.R, $ = F.$, esc = F.esc;
const base = () => String(CFG.FIREBASE_DB || "").replace(/\/+$/, "");
const ready = () => /^https?:\/\//.test(base());
async function db(m, p, b) {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 7000);
  try { const r = await fetch(base() + p + ".json", { method: m, signal: c.signal, headers: { "Content-Type": "application/json" }, body: b === undefined ? undefined : JSON.stringify(b) });
    if (!r.ok) throw new Error("db"); return await r.json(); } finally { clearTimeout(t); }
}
const sleep = ms => new Promise(s => setTimeout(s, ms));
const rid = () => Math.random().toString(36).slice(2, 10);
function myId() { let id = F.SES && F.SES.id; if (!id || id === "guest") { try { id = localStorage.getItem("fm_uid"); if (!id) { id = rid(); localStorage.setItem("fm_uid", id); } } catch (e) { id = rid(); } } return String(id).replace(/[.$#\[\]\/]/g, "_"); }
const myName = () => (F.SES && F.SES.name) || "لاعب";
const CH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", mkCode = () => Array.from({ length: 6 }, () => CH[Math.floor(Math.random() * CH.length)]).join("");
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const shuf = (a, rg) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rg() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
POOL.forEach((p, i) => p.id = i);
/* المراكز التفصيلية: GK / CB / RB / LB / CM / CAM / ST / RW / LW */
(function () {
  const o = {
    RB: ["Achraf Hakimi","Trent Alexander-Arnold","Dani Carvajal","Jules Koundé","Reece James","Pedro Porro","Cafu","Philipp Lahm","Ahmed Fathy"],
    LB: ["Nuno Mendes","Theo Hernández","Alphonso Davies","Andrew Robertson","Federico Dimarco","Marcelo","Roberto Carlos"],
    CAM: ["Kevin De Bruyne","Martin Ødegaard","Bruno Fernandes","Bernardo Silva","Jamal Musiala","Florian Wirtz","Cole Palmer","Phil Foden","Dani Olmo","Arda Güler","Christian Eriksen","Lucas Paquetá","Hakim Ziyech","James Rodríguez","Abdallah El Said","Zinedine Zidane","Kaká","Michel Platini","Mohamed Aboutrika","Jay-Jay Okocha"],
    RW: ["Mohamed Salah","Lamine Yamal","Ousmane Dembélé","Raphinha","Bukayo Saka","Riyad Mahrez","Lionel Messi","Michael Olise","Désiré Doué","Serge Gnabry","Mahmoud Trézéguet","Mohammed Kudus","Christian Pulisic","Takefusa Kubo","Brahim Díaz","Rodrygo","Gareth Bale"],
    LW: ["Vinícius Júnior","Rafael Leão","Khvicha Kvaratskhelia","Leroy Sané","Son Heung-min","Luis Díaz","Neymar","Kaoru Mitoma","Bradley Barcola","Kenan Yıldız","Nico Williams","Ronaldinho","Rivaldo","Eden Hazard","Cristiano Ronaldo","Sadio Mané","Ademola Lookman","Mikel Oyarzabal"]
  }, m = {}; Object.keys(o).forEach(k => o[k].forEach(n => m[n] = k));
  const dflt = { GK: "GK", DEF: "CB", MID: "CM", ATT: "ST" };
  POOL.forEach(p => { p.fp = m[p.en] || dflt[p.pos]; });
})();

/* ---------- المدربين ---------- */
const C = (a, e, n, o) => ({ ar: a, en: e, nat: n, ovr: o, pos: "COACH" });
const COACH_TOP = [C("بيب غوارديولا", "Pep Guardiola", "ESP", 97), C("أليكس فيرغسون", "Alex Ferguson", "SCO", 96), C("كارلو أنشيلوتي", "Carlo Ancelotti", "ITA", 95), C("يورغن كلوب", "Jürgen Klopp", "GER", 94),
  C("زين الدين زيدان", "Zinedine Zidane", "FRA", 93), C("جوزيه مورينيو", "José Mourinho", "POR", 92), C("لويس إنريكي", "Luis Enrique", "ESP", 91), C("هانزي فليك", "Hansi Flick", "GER", 91), C("ديدييه ديشان", "Didier Deschamps", "FRA", 90), C("دييغو سيميوني", "Diego Simeone", "ARG", 90)];
const COACH_LOW = [C("ماوريسيو بوكيتينو", "Mauricio Pochettino", "ARG", 84), C("غاريث ساوثغيت", "Gareth Southgate", "ENG", 82), C("روبرتو مارتينيز", "Roberto Martínez", "ESP", 82), C("إريك تن هاغ", "Erik ten Hag", "NED", 82),
  C("وليد الركراكي", "Walid Regragui", "MAR", 80), C("بيتسو موسيماني", "Pitso Mosimane", "RSA", 79), C("هيرفي رينارد", "Hervé Renard", "FRA", 79), C("كارلوس كيروش", "Carlos Queiroz", "POR", 78), C("حسام حسن", "Hossam Hassan", "EGY", 76)];

/* ---------- الكروت ---------- */
const POSAR = { GK: "حارس", CB: "قلب دفاع", RB: "ظهير أيمن", LB: "ظهير أيسر", CM: "وسط", CAM: "صانع ألعاب", ST: "مهاجم", RW: "جناح أيمن", LW: "جناح أيسر", DEF: "مدافع", MID: "وسط", ATT: "مهاجم", COACH: "مدرب" };
const GRP = { GK: "GK", CB: "DEF", RB: "DEF", LB: "DEF", CM: "MID", CAM: "MID", ST: "ATT", RW: "ATT", LW: "ATT" };
const tier = o => o >= 90 ? "t-el" : o >= 80 ? "t-gd" : o >= 70 ? "t-sv" : "t-br";
const lastName = en => { const w = en.split(" "); return w.length > 1 && w[0].length > 2 && !/^(van|de|der|ter|al|el|di)$/i.test(w[w.length - 2]) ? w[w.length - 1] : w.slice(-2).join(" "); };
function stats(p) {
  const h = hash(p.en), j = i => ((h >> (i * 4)) & 15) - 7, o = p.ovr, cl = v => Math.max(25, Math.min(99, Math.round(v)));
  if (p.pos === "GK") return [["DIV", o + j(0)], ["HAN", o + j(1)], ["KIC", o - 3 + j(2)], ["REF", o + 1 + j(3)], ["SPD", o - 30 + j(4)], ["POS", o + j(5)]].map(x => [x[0], cl(x[1])]);
  const b = { ATT: [0, 3, -6, 1, -38, -12], MID: [-3, -5, 2, 1, -16, -6], DEF: [-5, -32, -10, -12, 2, 3] }[p.pos];
  return ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"].map((n, i) => [n, cl(o + b[i] + j(i))]);
}
(function () {
  const st = document.createElement("style");
  st.textContent = `
.fc .fc-rt{z-index:3;left:11px;top:26px}
.fc .fc-rt b{font-size:36px;text-shadow:0 2px 6px rgba(0,0,0,.45)}
.fc .fc-rt i{font-size:16px}
.fc.ret .fc-rt b,.fc.ret .fc-rt i{text-shadow:0 1px 0 #fff3b8,0 2px 6px rgba(0,0,0,.25)}
.fc .fc-img{z-index:1;right:2px;top:12px;width:112px;height:120px}
.fc .fc-nm{padding:0 10px;box-sizing:border-box}
.fc-img img.fm-ph{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 10%;
 -webkit-mask-image:radial-gradient(ellipse 64% 72% at 55% 40%,#000 58%,transparent 100%);mask-image:radial-gradient(ellipse 64% 72% at 55% 40%,#000 58%,transparent 100%)}
.fc.sm .fc-rt{left:5px;top:12px}
.fc.sm .fc-rt b{font-size:18px}.fc.sm .fc-rt i{font-size:9px}
.fc.sm .fc-img{width:58px;height:60px;top:6px;right:1px}`;
  document.head.appendChild(st);
})();
const fmQ = []; let fmBusy = false;
window.FMimg = el => { fmQ.push(el); if (!fmBusy) fmRun(); };
async function fmFind(en) {
  const r = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(en.replace(/ /g, "_")));
  if (r.ok) { const j = await r.json(); if (j.type === "standard" && j.thumbnail) return j.thumbnail.source; }
  try {
    const r2 = await (await fetch("https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=" + encodeURIComponent(en))).json();
    const x = r2.player && r2.player[0];
    if (x) return x.strCutout || x.strThumb || "none";
  } catch (e) {}
  return "none";
}
async function fmRun() {
  fmBusy = true;
  while (fmQ.length) {
    const el = fmQ.shift(), en = el.dataset.en, key = "fmimg2_" + en; let u = null;
    try {
      u = localStorage.getItem(key);
      if (!u) { u = await fmFind(en); localStorage.setItem(key, u); await sleep(700); }
    } catch (e) { u = null; await sleep(1500); }
    if (u && u !== "none" && el.isConnected) {
      const old = el.innerHTML;
      el.innerHTML = '<img class="fm-ph" alt="" src="' + u + '">';
      el.firstChild.onerror = () => { el.innerHTML = old; };
    }
  }
  fmBusy = false;
}
function avatar(p) {
  const n = NAT[p.nat] || ["", "", "🏳", "#456"], h = hash(p.en), skin = ["#f1c9a5", "#e0ac86", "#c68c64", "#8d5a3b", "#6b4429"][h % 5], hair = ["#1b1b1b", "#3b2a1a", "#6a4a2a", "#c9a24a", "#101010"][(h >> 3) % 5];
  const svg = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 100c0-26 16-40 38-40s38 14 38 40z" fill="${n[3]}"/><path d="M38 60l12 13 12-13" fill="#fff" opacity=".9"/><rect x="43" y="48" width="14" height="14" rx="5" fill="${skin}"/><ellipse cx="50" cy="35" rx="16" ry="19" fill="${skin}"/><path d="M33 33c0-14 8-20 17-20s17 6 17 20c-4-7-9-10-17-10s-13 3-17 10z" fill="${hair}"/></svg>`;
  let c = null; try { c = localStorage.getItem("fmimg2_" + p.en); } catch (e) {}
  if (c === "none") return svg;
  if (c) return `<img class="fm-ph" alt="" src="${c}" onerror="this.outerHTML=decodeURIComponent('${encodeURIComponent(svg)}')">`;
  return `<span data-en="${esc(p.en)}" style="display:block;width:100%;height:100%">${svg}</span><img hidden alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" onload="window.FMimg(this.previousSibling)">`;
}
const RET_FROM = POOL.findIndex(p => p.en === "Pelé");
POOL.forEach((p, i) => { p.ret = i >= RET_FROM && p.en !== "Karim Benzema"; });
function card(p, o) {
  o = o || {}; const sm = o.sm, n = NAT[p.nat] || ["", "", "🏳", "#456", ""], ret = p.pos === "COACH" || p.ret, nm = sm ? lastName(p.en) : p.en;
  const fs = nm.length > (sm ? 9 : 14) ? ' style="font-size:' + (sm ? 7 : 10.5) + 'px"' : nm.length > (sm ? 9 : 11) ? ' style="font-size:' + (sm ? 7 : 12) + 'px"' : "";
  return `<div class="fcw"><div class="fc ${ret ? "ret" : "cur"}${sm ? " sm" : ""}${o.cls ? " " + o.cls : ""}"><div class="fc-in"><div class="fc-rt"><b>${p.ovr}</b><i>${p.pos === "COACH" ? "COACH" : (p.fp || p.pos)}</i></div><div class="fc-img">${avatar(p)}</div><div class="fc-nm"${fs}>${esc(nm)}</div><div class="fc-fl">${n[2]}</div></div></div>${sm ? "" : `<div class="fc-arc">${esc(p.ar)}</div>`}${o.tag ? `<div class="fc-cap">${o.tag}</div>` : ""}${o.off ? '<div class="fc-off">خارج مركزه</div>' : ""}</div>`;
}

/* ---------- الإعدادات ---------- */
const FMT = { five: { n: 5, bud: 100, nm: "خماسي", tg: { GK: 1, CB: 2, CM: 1, ST: 1 } }, full: { n: 11, bud: 300, nm: "ملعب كامل 11", tg: { GK: 1, CB: 2, RB: 1, LB: 1, CM: 2, CAM: 1, ST: 1, RW: 1, LW: 1 } } };
const BID_MS = 30000, GAP_MS = 6000, ROUND = BID_MS + 300 + GAP_MS;
const val = r => Math.max(1, Math.round(Math.pow((r - 60) / 10, 3))); // قيمة اللاعب التقديرية بالمليون
let M = null, fmtK = "five", OFF = 0;
const now = () => Date.now() + OFF;
function stop() { if (M) { clearInterval(M.tick); clearInterval(M.poll); clearInterval(M.sim); clearTimeout(M.next); clearTimeout(M.turnT); M.dead = true; if (M.open && M.code) db("DELETE", "/auc_open/" + M.fmt + "/" + M.code).catch(() => {}); } M = null; }
const view = h => { F.app.innerHTML = h; window.scrollTo(0, 0); F.app.querySelectorAll("[data-sec]").forEach(b => b.onclick = () => F.go(b.dataset.sec)); };
const secTabs = cur => `<div class="sectabs"><button data-sec="auction" class="${cur === "a" ? "on" : ""}">🔨 المزاد</button><button data-sec="transfers" class="${cur === "t" ? "on" : ""}">🔄 الانتقالات</button><button data-sec="hilo" class="${cur === "h" ? "on" : ""}">⚖ أعلى ولا أقل</button></div>`;
async function syncTime(code, role) { // توحيد الساعة مع سيرفر Firebase عشان اللاعبين يبدأوا مع بعض حتى لو ساعات الموبايلات مختلفة
  try { const a = Date.now(); let s = await db("PUT", "/auc/" + code + "/ts/" + role, { ".sv": "timestamp" }); const b = Date.now();
    if (typeof s !== "number") s = await db("GET", "/auc/" + code + "/ts/" + role);
    if (typeof s === "number") OFF = s - (a + b) / 2; } catch (e) { OFF = 0; }
}

/* ---------- الشاشة الرئيسية للمزاد ---------- */
R.auction = function () {
  stop(); F.setLeave(stop);
  view(secTabs("a") + `<div class="card" data-mkt="1" style="text-align:center"><h3>🔨 المزاد</h3><p>اشتري لاعبين من كل أنحاء العالم بميزانيتك، وركّب أقوى فريق، وبعدين المباراة تحسم!</p></div>
  <div class="card"><b>اختار نوع المزاد</b><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ${fmtK === "five" ? "" : "sec"}" id="f5">⚽ خماسي<br><small>5 مزادات · ${FMT.five.bud} م</small></button><button class="btn ${fmtK === "full" ? "" : "sec"}" id="f11">🏟 11 لاعب<br><small>11 مزاد · ${FMT.full.bud} م</small></button></div></div>
  <button class="btn big" id="ai">🤖 ضد الذكاء الاصطناعي</button>
  <button class="btn sec" id="rnd" style="margin-top:10px">⚔ واحد ضد واحد (منافس عشوائي)</button>
  <div class="card" style="margin-top:12px"><b>🏠 غرفة خاصة مع صديق</b>
    <input id="cd" placeholder="اكتب كود الغرفة" maxlength="6" style="display:block;width:100%;box-sizing:border-box;height:52px;margin-top:10px;padding:0 12px;border-radius:12px;text-align:center;text-transform:uppercase;font-size:18px">
    <div class="auc-actions"><button class="btn sec" id="mk">إنشاء غرفة</button><button class="btn sec" id="jn">دخول غرفة</button></div></div>
  <button class="btn sec" id="bk" style="margin-top:14px">رجوع</button>` + F.nav(""));
  F.app.querySelectorAll(".nav [data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
  $("#f5").onclick = () => { fmtK = "five"; R.auction(); }; $("#f11").onclick = () => { fmtK = "full"; R.auction(); };
  $("#ai").onclick = () => begin({ mode: "ai", role: "h", seed: Math.floor(Math.random() * 1e9), t0: Date.now() + 2500 });
  $("#rnd").onclick = randomMatch; $("#mk").onclick = () => createRoom(false); $("#jn").onclick = joinRoom; $("#bk").onclick = () => F.go("home");
};
function guard() { if (!F.online()) { F.toast("المزاد أونلاين محتاج إنترنت"); return false; } if (!ready()) { F.toast("الأونلاين مش مفعّل"); return false; } return true; }
async function createRoom(open) {
  if (!guard()) return false; const code = mkCode(), seed = Math.floor(Math.random() * 1e9), me = { id: myId(), name: myName() };
  try { await db("PUT", "/auc/" + code, { seed, fmt: fmtK, host: me, state: "wait" }); if (open) await db("PUT", "/auc_open/" + fmtK + "/" + code, Date.now()); } catch (e) { F.toast("تعذر إنشاء الغرفة"); return false; }
  stop(); M = { code, open, fmt: fmtK }; F.setLeave(stop);
  view(`<div class="card" style="text-align:center"><h3>${open ? "بندوّر على منافس…" : "كود الغرفة"}</h3>${open ? "" : `<div style="font-size:42px;letter-spacing:6px;margin:12px 0"><b>${code}</b></div><p>ابعته لصديقك وخلّيه يدخل الكود</p>`}<small>${FMT[fmtK].nm}</small></div><button class="btn sec" id="cx">إلغاء</button>`);
  $("#cx").onclick = () => { if (M && M.code) db("DELETE", "/auc/" + M.code).catch(() => {}); R.auction(); }; const t00 = Date.now(), mm = M;
  M.poll = setInterval(async () => { try { const r = await db("GET", "/auc/" + code); if (M !== mm) return;
    if (r && r.guest && !r.t0) { clearInterval(mm.poll); await syncTime(code, "h"); const t0 = now() + 5000; await db("PUT", "/auc/" + code + "/t0", t0); if (M !== mm) return; const s = { mode: "on", role: "h", seed, t0, code, opp: r.guest.name, fmt: fmtK }; stop(); begin(s); }
    else if (open && Date.now() - t00 > 40000) { stop(); F.toast("مفيش منافس دلوقتي، العب ضد الـAI"); R.auction(); } } catch (e) {} }, 1000);
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
  try { const r = await db("GET", "/auc/" + code); if (!r || r.guest || !r.host) return F.toast("الغرفة مش موجودة أو ممتلئة");
    await db("PUT", "/auc/" + code + "/guest", { id: myId(), name: myName() }); await syncTime(code, "g");
    stop(); M = { code }; F.setLeave(stop); view(`<div class="card" style="text-align:center"><h3>دخلت الغرفة ✅</h3><p>مستنيين المزاد يبدأ…</p></div>`); const mm = M;
    M.poll = setInterval(async () => { try { const x = await db("GET", "/auc/" + code); if (M !== mm) return; if (x && x.t0) { const s = { mode: "on", role: "g", seed: x.seed, t0: x.t0, code, opp: x.host.name, fmt: x.fmt }; stop(); begin(s); } } catch (e) {} }, 1000);
  } catch (e) { F.toast("تعذر الدخول"); }
}

/* ---------- بدء المزاد ---------- */
function begin(s) {
  const fk = s.fmt || fmtK, f = FMT[fk], rg = rng(s.seed), all = shuf(POOL, rg);
  const ORD = { five: ["GK", "CB", "CB", "CM", "ST"], full: ["GK", "CB", "CB", "RB", "LB", "CM", "CM", "CAM", "ST", "RW", "LW"] }[fk], left = all.slice(), lots = [];
  if (ORD) ORD.forEach(pos => { const i = left.findIndex(p => p.fp === pos); if (i >= 0) lots.push(left.splice(i, 1)[0]); });
  while (lots.length < f.n) lots.push(left.shift());
  const rest = left, cons = rest;
  stop();
  M = Object.assign({ n: f.n, tg: f.tg, lots, cons, used: new Set(), teams: { h: { pl: [], bud: f.bud }, g: { pl: [], bud: f.bud } }, cur: -1, mine: {}, done: {}, log: {}, stg: 0, oppName: s.opp || "🤖 فريق الذكاء الاصطناعي", fmt: fk, phase: "auc" }, s);
  F.setLeave(stop);
  if (M.mode === "ai") { const mm = M; view(`<div class="card" style="text-align:center"><h3>🔨 المزاد هيبدأ…</h3><p>🤖 ضد الذكاء الاصطناعي · ${FMT[M.fmt].nm}</p><small>بتزايدوا على كل لاعب وراء بعض لحد ما واحد يتخطى — اللي يفضل ياخد اللاعب بآخر سعر</small></div>`); M.next = setTimeout(() => { if (M === mm && !mm.dead) openLot(0); }, 2200); }
  else {
    const mm = M; view(`<div class="card" style="text-align:center"><h3>🔨 المزاد هيبدأ…</h3><p>${esc(M.oppName)} ضدك · ${FMT[M.fmt].nm}</p><small>بتزايدوا على كل لاعب وراء بعض لحد ما واحد يتخطى — اللي يفضل ياخد اللاعب بآخر سعر</small></div>`);
    M.next = setTimeout(() => { if (M === mm && !mm.dead) openLotOn(0, mm.t0); }, Math.max(0, M.t0 - now()));
  }
}
function step() {
  if (!M || M.dead || M.phase !== "auc") return; const el = now() - M.t0;
  if (el < 0) { const sec = Math.ceil(-el / 1000); if (M.cdShown === sec) return; M.cdShown = sec; } if (el < 0) return view(`<div class="card" style="text-align:center"><h3>🔨 المزاد هيبدأ بعد ${Math.ceil(-el / 1000)}…</h3><p>${esc(M.oppName)} ضدك · ${FMT[M.fmt].nm}</p></div>`);
  if (M.cur < 0) { M.cur = 0; M.stg = 0; M.sub = false; return draw(); }
  const c = M.cur, ph = el - c * ROUND;
  if (!M.done[c]) {
    if (ph >= BID_MS - 100 && !M.sub) submit();
    if (ph >= BID_MS + 300) { if (!M.busy) resolve(c); return; }
    const tm = $("#tm"); if (tm) tm.textContent = "00:" + String(Math.max(0, Math.ceil((BID_MS - ph) / 1000))).padStart(2, "0"); return;
  }
  if (ph >= ROUND) { if (c + 1 >= M.n) { M.phase = "wait"; clearInterval(M.tick); return coachStage(); } M.cur = c + 1; M.stg = 0; M.sub = false; draw(); }
}
const maxBid = t => Math.max(0, t.bud);
function draw() {
  const p = M.lots[M.cur], me = M.teams[M.role], op = M.teams[M.role === "h" ? "g" : "h"], mb = maxBid(me);
  view(`<div class="card" style="text-align:center"><small>مزاد ${M.cur + 1} من ${M.n} · ${FMT[M.fmt].nm}</small><div style="display:flex;justify-content:space-between;margin:6px 0;gap:6px"><b>أنت: ${me.bud} م · ${me.pl.length}/${M.n}</b><b>${esc(M.oppName)}: ${op.bud} م · ${op.pl.length}/${M.n}</b></div><div id="tm" style="font-size:26px;color:var(--gold1);min-width:90px;height:36px;line-height:36px;margin:0 auto;font-variant-numeric:tabular-nums" dir="ltr">00:30</div></div>
  <div class="cardrow">${card(p, { tag: "🔨 على المزاد" })}</div>
  <div class="card" style="text-align:center"><small>القيمة التقديرية للاعب: <b>${val(p.ovr)} م</b> · ${POSAR[p.fp]}</small></div>
  <div id="bx" class="card" style="text-align:center">${mb < 1 ? "<p>ميزانيتك خلصت — هتاخد لاعب تعويض لو خسرت 🎁</p>" : `<div style="display:flex;align-items:center;justify-content:center;gap:8px"><button class="btn sec" dir="ltr" id="m5">−5</button><button class="btn sec" dir="ltr" id="m1">−</button><b id="bv" style="font-size:30px;min-width:84px">0 م</b><button class="btn sec" dir="ltr" id="p1">+</button><button class="btn sec" dir="ltr" id="p5">+5</button></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn" id="ok">تأكيد المزايدة</button><button class="btn sec" id="sk">تخطي اللاعب</button></div>`}</div><div id="rs"></div>`);
  if (mb < 1) return;
  const upd = d => { M.stg = Math.max(0, Math.min(mb, M.stg + d)); $("#bv").textContent = M.stg + " م"; F.sfx && F.sfx.ok && 0; };
  $("#m1").onclick = () => upd(-1); $("#m5").onclick = () => upd(-5); $("#p1").onclick = () => upd(1); $("#p5").onclick = () => upd(5);
  $("#ok").onclick = () => { if (!M.sub) { if (M.stg < 1) return F.toast("حدد مبلغ المزايدة أو اضغط تخطي"); submit(); $("#bx").innerHTML = "<p>تم تأكيد مزايدتك: <b>" + M.stg + " م</b> ✅<br><small>مستنيين المنافس…</small></p>"; } };
  $("#sk").onclick = () => { if (!M.sub) { M.stg = 0; submit(); $("#bx").innerHTML = "<p>⏭ تخطيت اللاعب<br><small>هتاخد لاعب تعويض</small></p>"; fastSkip(M); } };
}
/* تخطي سريع: ضد الذكاء الاصطناعي بس — النتيجة بتظهر فوراً والمزاد اللي بعده بيبدأ بعد 3 ثواني */
function fastSkip(m) {
  if (!m || m.mode === "on" || m.done[m.cur] || m.busy) return;
  const c = m.cur; resolve(c);
  if (M !== m || m.dead || !m.done[c]) return;
  const ph = now() - m.t0 - c * ROUND, shift = ROUND - ph - GAP_MS;
  if (shift > 0) m.t0 -= shift;
}

/* ---------- المزاد المفتوح ضد الذكاء الاصطناعي: بتزايدوا وراء بعض لحد ما واحد يتخطى ---------- */
const TURN_S = 20, TURN_MS = 20000, GRACE_MS = 8000, NEXT_MS = 7000, other = k => (k === "h" ? "g" : "h"), opN = () => (M.mode === "on" ? M.oppName : "🤖 AI");
function aiMaxFor(r, force) { // أعلى سعر الـAI مستعد يدفعه في اللاعب ده (force = السعر اللي عايزه لو مفيش مزايدة)
  const op = M.role === "h" ? "g" : "h", t = M.teams[op], p = M.lots[r], g = rng(M.seed * 7 + r * 131), left = M.n - r;
  const want = val(p.ovr) * (0.5 + g() * 0.7), cap = Math.max(1, Math.round(t.bud / Math.max(1, left) * 2.4));
  if (t.bud < 1) return 0;
  const lowInterest = (p.ovr < 76 && g() < 0.35) || g() < 0.1;
  if (lowInterest && !force) return 0;
  return Math.max(1, Math.min(t.bud, Math.round(Math.min(want, cap))));
}
function openLot(r) {
  if (!M || M.dead) return;
  M.cur = r; M.price = 0; M.leader = null; M.turn = "me"; M.blog = []; M.tleft = TURN_S; M.aiMax = aiMaxFor(r, false);
  drawOpen();
}
function drawOpen() {
  const r = M.cur, p = M.lots[r], opK = M.role === "h" ? "g" : "h", me = M.teams[M.role], op = M.teams[opK], mb = maxBid(me), minB = M.price + 1, can = mb >= minB;
  M.stg = can ? minB : 0; clearInterval(M.tick); clearTimeout(M.turnT);
  const status = M.leader ? `أعلى عرض: <b>${M.price} م</b> — ${M.leader === "me" ? "أنت" : esc(opN())}` : "لسه محدش زايد على اللاعب";
  const mine = M.turn === "me";
  view(`<div class="card" style="text-align:center"><small>مزاد ${r + 1} من ${M.n} · ${FMT[M.fmt].nm}</small><div style="display:flex;justify-content:space-between;margin:6px 0;gap:6px"><b>أنت: ${me.bud} م · ${me.pl.length}/${M.n}</b><b>${esc(opN())}: ${op.bud} م · ${op.pl.length}/${M.n}</b></div><div id="tm" style="font-size:26px;color:var(--gold1);min-width:90px;height:36px;line-height:36px;margin:0 auto;font-variant-numeric:tabular-nums" dir="ltr">${mine ? "00:" + String(M.tleft).padStart(2, "0") : "🤖…"}</div></div>
  <div class="cardrow">${card(p, { tag: "🔨 على المزاد" })}</div>
  <div class="card" style="text-align:center"><small>القيمة التقديرية للاعب: <b>${val(p.ovr)} م</b> · ${POSAR[p.fp]}</small></div>
  <div id="bx" class="card" style="text-align:center"><div id="st" style="margin-bottom:8px">${status}</div>${mine ? (can ? `<div style="display:flex;align-items:center;justify-content:center;gap:8px"><button class="btn sec" dir="ltr" id="m5">−5</button><button class="btn sec" dir="ltr" id="m1">−</button><b id="bv" style="font-size:30px;min-width:84px">${M.stg} م</b><button class="btn sec" dir="ltr" id="p1">+</button><button class="btn sec" dir="ltr" id="p5">+5</button></div><div style="display:flex;gap:8px;margin-top:10px"><button class="btn" id="ok">زايد بـ <span id="okv">${M.stg}</span> م</button><button class="btn sec" id="sk">تخطي</button></div>` : `<p>ميزانيتك مش كفاية للزيادة</p><button class="btn sec" id="sk">تخطي</button>`) : `<p>${M.mode === "on" ? "⏳ دور " + esc(opN()) + "…" : "🤖 الذكاء الاصطناعي بيفكر…"}</p>`}</div>
  <div class="card" id="lg" style="font-size:13px;min-height:24px">${M.blog.slice(-4).join("<br>") || "<small>اللي بيتخطى بيسيب اللاعب للتاني بآخر سعر</small>"}</div>`);
  if (!mine) return;
  M.tick = setInterval(() => { if (!M || M.dead || M.turn !== "me") return; M.tleft = M.mode === "on" ? Math.ceil((M.node.ts + TURN_MS - now()) / 1000) : M.tleft - 1; const tm = $("#tm"); if (tm) tm.textContent = "00:" + String(Math.max(0, M.tleft)).padStart(2, "0"); if (M.tleft <= 0) (M.mode === "on" ? mySkipOn() : mySkip()); }, 1000);
  if (can) {
    const upd = d => { M.stg = Math.max(minB, Math.min(mb, M.stg + d)); $("#bv").textContent = M.stg + " م"; $("#okv").textContent = M.stg; };
    $("#m1").onclick = () => upd(-1); $("#m5").onclick = () => upd(-5); $("#p1").onclick = () => upd(1); $("#p5").onclick = () => upd(5);
    $("#ok").onclick = () => (M.mode === "on" ? myBidOn() : myBid());
  }
  $("#sk").onclick = () => (M.mode === "on" ? mySkipOn() : mySkip());
}
function myBid() {
  if (!M || M.dead || M.turn !== "me" || M.stg < M.price + 1) return;
  M.price = M.stg; M.leader = "me"; M.turn = "ai"; M.blog.push("🧑 أنت زايدت بـ " + M.price + " م");
  try { F.sfx.tap(); } catch (e) {} drawOpen(); aiTurn();
}
function aiTurn() {
  const m = M, r = m.cur, g = rng(m.seed * 13 + r * 17 + m.price * 7);
  m.turnT = setTimeout(() => {
    if (M !== m || m.dead || m.cur !== r) return;
    const t = m.teams[m.role === "h" ? "g" : "h"], lim = Math.min(m.aiMax, t.bud);
    if (lim >= m.price + 1) {
      m.price = Math.min(lim, m.price + 1 + Math.floor(g() * 3)); m.leader = "ai"; m.turn = "me"; m.tleft = TURN_S;
      m.blog.push("🤖 زايد بـ " + m.price + " م"); try { F.sfx.tap(); } catch (e) {} drawOpen();
    } else settle(r, m.role, m.price, "aidrop");
  }, 900 + Math.floor(g() * 900));
}
function mySkip() {
  if (!M || M.dead || M.turn !== "me") return;
  const r = M.cur, ai = M.role === "h" ? "g" : "h", t = M.teams[ai]; M.turn = "done"; clearInterval(M.tick);
  if (M.leader === "ai") return settle(r, ai, M.price, "skip");
  const ask = aiMaxFor(r, true); // لسه محدش زايد: الـAI ياخد اللاعب بالسعر اللي هو عايزه
  if (ask >= 1 && t.bud >= ask) return settle(r, ai, ask, "skip");
  settle(r, null, 0, "none");
}
function settle(r, w, price, why, ts) {
  const m = M; if (!m || m.dead || m.done[r]) return; clearInterval(m.tick); clearTimeout(m.turnT); m.turn = "done";
  const me = m.role, opR = me === "h" ? "g" : "h", lot = m.lots[r], bid = { [me]: 0, [opR]: 0 }; if (w) bid[w] = price;
  const got = {};
  ["h", "g"].forEach(k => { const t = m.teams[k]; if (k === w) { t.bud -= bid[k]; t.pl.push({ p: lot, pr: bid[k] }); got[k] = { p: lot, pr: bid[k], won: true }; } else { const c = consol(t, lot); t.pl.push({ p: c, pr: 0 }); got[k] = { p: c, pr: 0, won: false }; } });
  m.done[r] = true; m.log[r] = { w, bid, got };
  const on = esc(m.mode === "on" ? m.oppName : "🤖 AI"), onl = m.mode === "on";
  const head = !w ? "🤷 محدش اشترى — الاتنين خدوا لاعب تعويض" : w === me ? (why === "aidrop" || why === "oppskip" ? "✅ " + on + " تخطّى — كسبت اللاعب بـ " : "✅ كسبت المزاد بـ ") + price + " م" : (why === "skip" ? "⏭ تخطيت — " + on + " أخد اللاعب بـ " : "❌ " + on + " كسب المزاد بـ ") + price + " م";
  const mine = got[me], theirs = got[opR], last = r + 1 >= m.n;
  view(`<div class="card" style="text-align:center"><b>${head}</b><br><small>ميزانيتك دلوقتي ${m.teams[me].bud} م · ${on} ${m.teams[opR].bud} م</small></div>
  <div class="cardrow two"><div><small>أنت</small>${card(mine.p, { sm: 1, tag: mine.won ? "🏆 كسب المزاد" : "🎁 تعويض" })}</div><div><small>${on}</small>${card(theirs.p, { sm: 1, tag: theirs.won ? "🏆 كسب المزاد" : "🎁 تعويض" })}</div></div>
  ${onl ? `<div class="card" style="text-align:center"><small>${last ? "المدرب" : "اللاعب التالي"} بعد ثواني…</small></div>` : `<button class="btn big" id="nx">${last ? "كمّل لاختيار المدرب ▶" : "اللاعب التالي ▶"}</button>`}`);
  try { w === me ? F.sfx.cheer(true) : w ? F.sfx.boo() : F.sfx.ok(); } catch (e) {}
  const go = () => { clearTimeout(m.next); if (M !== m || m.dead || m.cur !== r || m.moved === r) return; m.moved = r; if (last) { m.phase = "wait"; coachStage(); } else if (onl) openLotOn(r + 1, (ts || now()) + NEXT_MS); else openLot(r + 1); };
  m.next = setTimeout(go, onl ? Math.max(300, (ts || now()) + NEXT_MS - now()) : NEXT_MS); const nx = $("#nx"); if (nx) nx.onclick = go;
}

/* ---------- المزاد المفتوح أونلاين (واحد ضد واحد / صديق): الدور بيتزامن عن طريق Firebase ---------- */
const oPath = r => "/auc/" + M.code + "/o/" + r;
function syncFromNode() {
  const m = M, n = m.node; m.price = n.pr; m.leader = n.ld ? (n.ld === m.role ? "me" : "ai") : null; m.turn = n.t === m.role ? "me" : "ai"; m.tleft = Math.max(0, Math.ceil((n.ts + TURN_MS - now()) / 1000));
}
async function pushNode(next) { // بيكتب الحركة بس لو اللي قبلها هي آخر حاجة (عشان ما يحصلش تضارب)
  const cur = await db("GET", oPath(M.cur)), cn = cur && typeof cur.n === "number" ? cur.n : 0;
  if (cn !== next.n - 1) return false;
  await db("PUT", oPath(M.cur), next); return true;
}
function openLotOn(r, ts) {
  if (!M || M.dead) return; const m = M; clearInterval(m.tick); clearInterval(m.poll);
  m.cur = r; m.node = { pr: 0, ld: null, t: r % 2 === 0 ? "h" : "g", sk: null, n: 0, ts }; m.blog = []; m.sending = false; syncFromNode(); drawOpen();
  m.poll = setInterval(async () => {
    if (M !== m || m.dead || m.cur !== r || m.pbusy) return; m.pbusy = true;
    try {
      const x = await db("GET", oPath(r)); if (M !== m || m.cur !== r) return;
      if (x && typeof x.n === "number" && x.n > m.node.n) {
        m.node = x; if (x.sk) { clearInterval(m.poll); return settleOn(r); }
        if (x.ld && x.ld !== m.role) m.blog.push("👤 " + m.oppName + " زايد بـ " + x.pr + " م");
        syncFromNode(); drawOpen();
      } else if (!m.node.sk && m.node.t !== m.role && now() > m.node.ts + TURN_MS + GRACE_MS) { // المنافس سايب الدور: نعتبره تخطّى
        const nx = Object.assign({}, m.node, { sk: m.node.t, n: m.node.n + 1, ts: now() });
        if (await pushNode(nx)) { m.node = nx; clearInterval(m.poll); return settleOn(r); }
      }
    } catch (e) {} finally { m.pbusy = false; }
  }, 700);
}
async function myBidOn() {
  const m = M; if (!m || m.dead || m.turn !== "me" || m.sending || m.stg < m.node.pr + 1) return; m.sending = true; const r = m.cur;
  const nx = { pr: m.stg, ld: m.role, t: other(m.role), sk: null, n: m.node.n + 1, ts: now() }; let ok = false;
  try { ok = await pushNode(nx); } catch (e) { F.toast("مفيش اتصال — جرّب تاني"); }
  m.sending = false; if (M !== m || m.cur !== r || !ok) return;
  m.node = nx; m.blog.push("🧑 أنت زايدت بـ " + nx.pr + " م"); try { F.sfx.tap(); } catch (e) {} syncFromNode(); drawOpen();
}
async function mySkipOn() {
  const m = M; if (!m || m.dead || m.turn !== "me" || m.sending) return; m.sending = true; const r = m.cur;
  const nx = Object.assign({}, m.node, { sk: m.role, n: m.node.n + 1, ts: now() }); let ok = false;
  try { ok = await pushNode(nx); } catch (e) { F.toast("مفيش اتصال — جرّب تاني"); }
  m.sending = false; if (M !== m || m.cur !== r || !ok) return;
  m.node = nx; clearInterval(m.tick); clearInterval(m.poll); settleOn(r);
}
function settleOn(r) {
  const m = M, nd = m.node, win = other(nd.sk); let price = nd.ld === win ? nd.pr : 0, w = win;
  if (nd.ld !== win) { if (m.teams[win].bud >= 1) price = 1; else w = null; }
  clearInterval(m.tick); settle(r, w, price, nd.sk === m.role ? "skip" : "oppskip", nd.ts);
}
function put(path, v) { return (async () => { for (let i = 0; i < 3; i++) { try { await db("PUT", path, v); return true; } catch (e) { await sleep(300); } } return false; })(); }
function submit() {
  if (M.sub) return; M.sub = true; const r = M.cur, v = Math.min(M.stg, maxBid(M.teams[M.role])); M.mine[r] = v;
  M.wp = M.wp || {}; if (M.mode === "on") M.wp[r] = put("/auc/" + M.code + "/b/" + r + "/" + M.role, v).then(ok => { if (!ok) M.mine[r] = 0; });
}
function aiBid(r, force) {
  const op = M.role === "h" ? "g" : "h", t = M.teams[op], p = M.lots[r], g = rng(M.seed * 7 + r * 131), left = M.n - r;
  const want = val(p.ovr) * (0.5 + g() * 0.7), cap = Math.max(1, Math.round(t.bud / Math.max(1, left) * 2.4));
  if (t.bud < 1) return 0;
  if (!force && ((p.ovr < 76 && g() < 0.35) || g() < 0.1)) return 0;
  return Math.max(1, Math.min(t.bud, Math.round(Math.min(want, cap))));
}
function consol(t, lot) { // لاعب تعويض عشوائي (بالسيد المشترك) من نفس مركز اللاعب اللي كان في المزاد
  const ok = x => !M.used.has(x.id);
  let i = M.cons.findIndex(x => ok(x) && x.fp === lot.fp);
  if (i < 0) i = M.cons.findIndex(x => ok(x) && GRP[x.fp] === GRP[lot.fp]);
  if (i < 0) i = M.cons.findIndex(ok);
  const p = M.cons[i]; M.used.add(p.id); return p;
}
async function resolve(r) {
  const m = M; m.busy = true; const me = m.role, opR = me === "h" ? "g" : "h"; let ob = 0;
  if (m.mode === "on") {
    if (m.wp && m.wp[r]) await m.wp[r];
    for (let i = 0; i < 16; i++) { try { const x = await db("GET", "/auc/" + m.code + "/b/" + r + "/" + opR); if (x !== null && x !== undefined) { ob = +x || 0; break; } } catch (e) {} await sleep(400); if (M !== m) return; }
  } else { ob = aiBid(r); if (!ob && !(m.mine[r] > 0)) ob = aiBid(r, true); }
  if (M !== m || m.dead) return;
  const bid = { [me]: Math.min(m.mine[r] || 0, maxBid(m.teams[me])), [opR]: Math.min(ob, maxBid(m.teams[opR])) }, lot = m.lots[r];
  let w = null; if (bid.h > 0 || bid.g > 0) w = bid.h > bid.g ? "h" : bid.g > bid.h ? "g" : (rng(m.seed + r * 97)() < 0.5 ? "h" : "g");
  const got = {};
  ["h", "g"].forEach(k => { const t = m.teams[k]; if (k === w) { t.bud -= bid[k]; t.pl.push({ p: lot, pr: bid[k] }); got[k] = { p: lot, pr: bid[k], won: true }; } else { const c = consol(t, lot); t.pl.push({ p: c, pr: 0 }); got[k] = { p: c, pr: 0, won: false }; } });
  m.done[r] = true; m.busy = false; m.log[r] = { w, bid, got };
  if (m.mode === "on" && m.role === "h") db("PATCH", "/auc/" + m.code + "/res", { [r]: { w, h: bid.h, g: bid.g } }).catch(() => {});
  const rs = $("#rs"), bx = $("#bx"); if (bx) bx.remove();
  const mine = got[me], theirs = got[opR], head = !w ? "🤷 محدش اشترى — الاتنين خدوا لاعب تعويض" : w === me ? "✅ كسبت المزاد بـ " + bid[me] + " م" : "❌ المنافس كسب المزاد بـ " + bid[opR] + " م";
  if (rs) rs.innerHTML = `<div class="card" style="text-align:center"><b>${head}</b><br><small>مزايدتك ${bid[me]} م · ${esc(m.oppName)} ${bid[opR]} م</small></div>
  <div class="cardrow two"><div><small>أنت</small>${card(mine.p, { sm: 1, tag: mine.won ? "🏆 كسب المزاد" : "🎁 تعويض" })}</div><div><small>${esc(m.oppName)}</small>${card(theirs.p, { sm: 1, tag: theirs.won ? "🏆 كسب المزاد" : "🎁 تعويض" })}</div></div>`;
  const tm = $("#tm"); if (tm) tm.textContent = "✔";
  try { w === me ? F.sfx.cheer(true) : (w && bid[me] > 0) ? F.sfx.boo() : F.sfx.ok(); } catch (e) {}
}

/* ---------- ترتيب الفريق والقوة ---------- */
function arrange(t, tg) {
  const left = t.pl.map(x => x.p).sort((a, b) => b.ovr - a.ovr), out = [], miss = [];
  Object.keys(tg).forEach(slot => { for (let i = 0; i < tg[slot]; i++) { const k = left.findIndex(x => x.fp === slot); if (k >= 0) out.push({ p: left.splice(k, 1)[0], slot, grp: GRP[slot], eff: 0 }); else miss.push(slot); } });
  miss.forEach(slot => { let k = left.findIndex(x => GRP[x.fp] === GRP[slot] && slot !== "GK"); let off = false; if (k < 0) { off = true; k = slot === "GK" ? left.length - 1 : 0; } out.push({ p: left.splice(k, 1)[0], slot, grp: GRP[slot], off, near: !off, eff: 0 }); });
  out.forEach(o => o.eff = o.off ? Math.max(40, o.p.ovr - (o.slot === "GK" ? 25 : 10)) : o.near ? o.p.ovr - 3 : o.p.ovr);
  return out;
}
const strength = (ar, coach) => ar.reduce((a, x) => a + x.eff, 0) / ar.length + (coach.ovr - 85) * 0.35;

/* ---------- المدرب ---------- */
function coachStage() {
  const m = M, rg = rng(m.seed + 999), rich = m.teams.h.bud >= m.teams.g.bud ? "h" : "g", poor = rich === "h" ? "g" : "h";
  m.teams[rich].c = COACH_TOP[Math.floor(rg() * COACH_TOP.length)]; m.teams[poor].c = COACH_LOW[Math.floor(rg() * COACH_LOW.length)];
  const me = m.role, op = me === "h" ? "g" : "h";
  view(`<div class="card" style="text-align:center"><h3>🧑‍💼 قسم المدرب</h3><p>اللي ميزانيته فاضلة أكتر (أغنى) بياخد مدرب أقوى 💰</p></div>
  <div class="cardrow two"><div><small>أنت · باقي ${m.teams[me].bud} م</small>${card(m.teams[me].c, { cls: "coach" })}</div><div><small>${esc(m.oppName)} · باقي ${m.teams[op].bud} م</small>${card(m.teams[op].c, { cls: "coach" })}</div></div>
  <button class="btn big" id="nx">التشكيلة ➜</button>`);
  $("#nx").onclick = lineupStage;
}

/* ---------- التشكيلة ---------- */
function rowsHTML(ar, sm) {
  const SO = { LW: 0, ST: 1, RW: 2, CM: 0, CAM: 1, LB: 0, CB: 1, RB: 2, GK: 0 };
  return ["ATT", "MID", "DEF", "GK"].map(pos => { const r = ar.filter(x => x.grp === pos).sort((a, b) => SO[a.slot] - SO[b.slot]); return r.length ? `<div class="cardrow wrap">${r.map(x => card(x.p, { sm: 1, off: x.off })).join("")}</div>` : ""; }).join("");
}
function lineupStage() {
  const m = M, me = m.role, op = me === "h" ? "g" : "h", A = arrange(m.teams[me], m.tg), B = arrange(m.teams[op], m.tg);
  m.arr = { [me]: A, [op]: B }; m.str = { [me]: strength(A, m.teams[me].c), [op]: strength(B, m.teams[op].c) };
  view(`<div class="card" style="text-align:center"><h3>📋 التشكيلة</h3><small>تقييم الفريق: أنت <b>${Math.round(m.str[me])}</b> ⚔ ${esc(m.oppName)} <b>${Math.round(m.str[op])}</b></small></div>
  <div class="card"><b>فريقك</b> · 🧑‍💼 ${esc(m.teams[me].c.en)}<div class="pitch">${rowsHTML(A)}</div></div>
  <div class="card" style="text-align:center;font-size:26px">⚔ VS ⚔</div>
  <div class="card"><b>${esc(m.oppName)}</b> · 🧑‍💼 ${esc(m.teams[op].c.en)}<div class="pitch">${rowsHTML([...B].reverse())}</div></div>
  <button class="btn big" id="go">🎮 محاكاة المباراة</button>`);
  $("#go").onclick = matchStage;
}

/* ---------- المباراة ---------- */
const meLabel = () => (F.SES && F.SES.name) || "أنت";
const opLabel = m => m.mode === "on" ? m.oppName : "🤖 AI";
const scoreRow = (m, id, txt) => `<div dir="ltr" style="display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:10px;white-space:nowrap"><div style="text-align:center;overflow:hidden;text-overflow:ellipsis"><b>${esc(meLabel())}</b></div><div dir="ltr" style="font-size:34px;line-height:1.1"><b${id ? ' id="' + id + '"' : ""}>${txt}</b></div><div style="text-align:center;overflow:hidden;text-overflow:ellipsis"><b>${esc(opLabel(m))}</b></div></div>`;
function simulate(m) {
  const rg = rng(m.seed + 7), ev = [], d = { h: m.str.h - m.str.g, g: m.str.g - m.str.h }, fac = { ATT: 3, MID: 1.2, DEF: 0.35, GK: 0 };
  for (let seg = 0; seg < 18; seg++) ["h", "g"].forEach(k => {
    if (rg() < Math.min(0.4, Math.max(0.02, 0.115 + d[k] * 0.009))) {
      const c = m.arr[k].filter(x => fac[x.grp] > 0 && x.p.pos !== "GK"), w = c.map(x => Math.pow(x.eff / 100, 4) * fac[x.grp]), s = w.reduce((a, b) => a + b, 0); let q = rg() * s, i = 0; while (i < c.length - 1 && (q -= w[i]) > 0) i++;
      ev.push({ k, mn: seg * 5 + 1 + Math.floor(rg() * 5), p: c[i].p });
    } else rg();
  });
  return ev.sort((a, b) => a.mn - b.mn);
}
function matchStage() {
  const m = M; m.phase = "match"; const me = m.role, op = me === "h" ? "g" : "h", ev = simulate(m); m.ev = ev; let mn = 0, shown = 0; const sc = { h: 0, g: 0 };
  view(`<div class="card" style="text-align:center"><small>⏱ <b id="mn">0'</b></small>${scoreRow(m, "sc", "0 - 0")}</div><div class="card" id="fd" style="min-height:90px"><small>🔔 صافرة البداية…</small></div><button class="btn sec" id="skp">⏩ تخطي للنهاية</button>`);
  const upd = () => { $("#mn").textContent = Math.min(90, mn) + "'"; $("#sc").textContent = sc[me] + " - " + sc[op];
    while (shown < ev.length && ev[shown].mn <= mn) { const e = ev[shown++]; sc[e.k]++; const fd = $("#fd"); if (shown === 1) fd.innerHTML = ""; fd.insertAdjacentHTML("beforeend", `<div>${e.mn}' ⚽ <b>${esc(e.p.en)}</b> ${e.k === me ? "✅" : "😬"}</div>`); try { e.k === me ? F.sfx.cheer(false) : F.sfx.ok(); } catch (x) {} }
    $("#sc").textContent = sc[me] + " - " + sc[op]; };
  m.sim = setInterval(() => { mn += 2; upd(); if (mn >= 90) { clearInterval(m.sim); setTimeout(() => { if (M === m) finalStage(); }, 900); } }, 300);
  $("#skp").onclick = () => { clearInterval(m.sim); mn = 90; upd(); finalStage(); };
}
function finalStage() {
  const m = M; if (!m || m.fin) return; m.fin = 1; clearInterval(m.sim); const me = m.role, op = me === "h" ? "g" : "h", ev = m.ev, sc = { h: 0, g: 0 }; ev.forEach(e => sc[e.k]++);
  const wk = sc.h > sc.g ? "h" : sc.g > sc.h ? "g" : null, res = !wk ? "d" : wk === me ? "w" : "l";
  const mk = wk || (m.str.h >= m.str.g ? "h" : "g"), cnt = {}; ev.filter(e => e.k === mk).forEach(e => { cnt[e.p.id] = (cnt[e.p.id] || 0) + 1; });
  const ids = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || POOL[b].ovr - POOL[a].ovr); const best = ids.length ? POOL[ids[0]] : m.arr[mk].map(x => x.p).sort((a, b) => b.ovr - a.ovr)[0];
  const S = F.S, gem = { w: 60, d: 30, l: 15 }[res], pt = { w: 25, d: 8, l: -10 }[res];
  S.gems += gem; S.points = Math.max(0, S.points + pt); try { F.checkAch(); } catch (e) {} F.save(); if (res === "w") try { F.sfx.cheer(true); F.confetti(30); } catch (e) {} else if (res === "l") try { F.sfx.boo(); } catch (e) {}
  view(`<div class="card" style="text-align:center"><h3>${res === "w" ? "🏆 فوز!" : res === "d" ? "🤝 تعادل" : "❌ خسارة"}</h3>${scoreRow(m, "", sc[me] + " - " + sc[op])}</div>
  <div class="card"><b>الأهداف</b><br>${ev.map(x => `${x.mn}' ⚽ ${esc(x.p.en)} ${x.k === me ? "✅" : "😬"}`).join("<br>") || "مباراة بدون أهداف"}</div>
  <div class="card" style="text-align:center"><b>⭐ رجل المباراة</b><div class="cardrow" style="margin-top:8px">${card(best, { tag: "⭐ رجل المباراة" })}</div></div>
  <div class="card" style="text-align:center">💎 +${gem} جوهرة · النقاط ${pt > 0 ? "+" : ""}${pt}</div>
  <button class="btn big" id="ag">مزاد جديد</button><button class="btn sec" id="hm" style="margin-top:10px">الرئيسية</button>`);
  stop(); $("#ag").onclick = () => F.go("auction"); $("#hm").onclick = () => F.go("home");
}

/* ---------- شاشة الانتقالات (ضد الذكاء الاصطناعي / واحد ضد واحد / غرفة) ---------- */
R.transfers = function () {
  stop(); window.__tr = false; F.setLeave(stop);
  view(secTabs("t") + `<div class="card" data-mkt="t" style="text-align:center"><h3>🔄 الانتقالات</h3><p>كل سؤال بيعرض أندية لاعب بالترتيب — خمّن اللاعب! اللي بيجمع نقاط أكتر بيكسب، واللي بيجاوب أسرع بياخد نقاط أكتر.</p></div>
  <button class="btn big" id="tai">🤖 ضد الذكاء الاصطناعي</button>
  <button class="btn sec" id="trnd" style="margin-top:10px">⚔ واحد ضد واحد (منافس عشوائي)</button>
  <div class="card" style="margin-top:12px"><b>🏠 غرفة خاصة مع صديق</b>
    <input id="tcd" placeholder="اكتب كود الغرفة" maxlength="6" style="display:block;width:100%;box-sizing:border-box;height:52px;margin-top:10px;padding:0 12px;border-radius:12px;text-align:center;text-transform:uppercase;font-size:18px">
    <div class="auc-actions"><button class="btn sec" id="tmk">إنشاء غرفة</button><button class="btn sec" id="tjn">دخول غرفة</button></div></div>
  <button class="btn sec" id="tbk" style="margin-top:14px">رجوع</button>` + F.nav(""));
  F.app.querySelectorAll(".nav [data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
  $("#tai").onclick = () => F.trStart("bot"); $("#trnd").onclick = () => F.trStart("rnd"); $("#tmk").onclick = () => F.trStart("mk");
  $("#tjn").onclick = () => F.trJoin($("#tcd").value); $("#tbk").onclick = () => F.go("home");
};
/* ---------- القسم الثالث: أعلى ولا أقل ⚖ (خفيف وسريع، من غير نت) ---------- */
let HL = null;
function hlPick() {
  const c = HL.cur, base = POOL.filter(p => p.pos !== "COACH" && (!c || p.ovr !== c.ovr)), fresh = base.filter(p => !HL.used.has(p.id)), list = fresh.length ? fresh : base;
  const p = list[Math.floor(Math.random() * list.length)]; HL.used.add(p.id); return p;
}
R.hilo = function () {
  stop(); window.__tr = false; F.setLeave(() => { HL = null; });
  const S = F.S, best = S.hlBest || 0;
  HL = { cur: null, nxt: null, streak: 0, used: new Set(), lock: false };
  HL.cur = hlPick(); HL.nxt = hlPick();
  hlDraw(best);
};
function hlDraw(best, reveal) {
  const h = HL, S = F.S; best = Math.max(best || 0, S.hlBest || 0);
  view(secTabs("h") + `<div class="card data-mkt-h" data-mkt="h" style="text-align:center"><h3>⚖ أعلى ولا أقل</h3><p>تقييم اللاعب التاني أعلى ولا أقل من الأول؟ كل إجابة صح بتزوّد سلسلتك.</p>
  <div style="display:flex;justify-content:space-around"><b>السلسلة: ${h.streak}</b><b>أفضل رقم: ${best}</b></div></div>
  <div class="cardrow two"><div><small>التقييم ${h.cur.ovr}</small>${card(h.cur, { sm: 1 })}</div><div><small>${reveal ? "التقييم " + h.nxt.ovr : "التقييم ؟"}</small>${card(reveal ? h.nxt : Object.assign({}, h.nxt, { ovr: "؟" }), { sm: 1 })}</div></div>
  <div id="hlmsg" style="min-height:34px;text-align:center;font-size:18px;margin:6px 0">${reveal || ""}</div>
  <div class="auc-actions"><button class="btn" id="hup">⬆ أعلى</button><button class="btn sec" id="hdn">⬇ أقل</button></div>
  <button class="btn sec" id="hbk" style="margin-top:14px">رجوع</button>` + F.nav(""));
  F.app.querySelectorAll(".nav [data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
  $("#hup").onclick = () => hlAnswer(true); $("#hdn").onclick = () => hlAnswer(false); $("#hbk").onclick = () => F.go("home");
}
function hlAnswer(up) {
  const h = HL; if (!h || h.lock) return; h.lock = true;
  const ok = up ? h.nxt.ovr > h.cur.ovr : h.nxt.ovr < h.cur.ovr, S = F.S;
  const bx = F.app.querySelectorAll(".fcw")[1], lbl = F.app.querySelectorAll(".cardrow small")[1];
  if (lbl) lbl.textContent = "التقييم " + h.nxt.ovr;
  const msg = $("#hlmsg"); if (msg) msg.textContent = ok ? "✅ صح!" : "❌ غلط — كان " + h.nxt.ovr;
  try { ok ? F.sfx.ok() : F.sfx.no(); } catch (e) {}
  if (ok) { h.streak++; setTimeout(() => { if (HL !== h) return; h.cur = h.nxt; h.nxt = hlPick(); h.lock = false; hlDraw(S.hlBest || 0); }, 1100); return; }
  const gems = Math.min(40, h.streak * 2), newBest = h.streak > (S.hlBest || 0);
  if (newBest) S.hlBest = h.streak; S.gems += gems; try { F.save(); } catch (e) {}
  setTimeout(() => { if (HL !== h) return;
    view(secTabs("h") + `<div class="card" data-mkt="h" style="text-align:center"><div style="font-size:60px">${h.streak >= 8 ? "🏆" : "⚖"}</div><h3>سلسلتك: ${h.streak}</h3><p>${newBest && h.streak > 0 ? "🎉 رقم قياسي جديد!" : "أفضل رقم: " + (S.hlBest || 0)}</p><p>+${gems} 💎</p></div>
    <button class="btn big" id="hag">🔁 العب تاني</button><button class="btn sec" id="hbk" style="margin-top:12px">رجوع</button>` + F.nav(""));
    F.app.querySelectorAll(".nav [data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
    $("#hag").onclick = () => R.hilo(); $("#hbk").onclick = () => F.go("home"); }, 1300);
}

/* ---------- قسم المزاد والانتقالات ---------- */
const wrap = n => { const o = R[n]; R[n] = function () { window.__tr = false; return o.apply(this, arguments); }; }; wrap("home"); wrap("challenges");
R.market = function () {
  stop(); window.__tr = false; const c = (ic, t, d, id) => `<div class="chal" data-mkt="1"><div class="ic">${ic}</div><div class="t grow"><b>${t}</b><small>${d}</small></div><button class="btn" data-m="${id}">ادخل</button></div>`;
  F.app.innerHTML = F.header() + "<h2>🔨 المزاد والانتقالات</h2>" + c("🔨", "المزاد", "اشتري لاعبين من كل العالم والأقوى يكسب — ضد الذكاء الاصطناعي أو لاعب حقيقي", "a") + c("📝", "اعرف اللاعب من انتقالاته (فردي)", "10 أسئلة: أندية اللاعب بالترتيب وانت تعرفه", "t") + c("🔄", "الانتقالات", "خمّن اللاعب من أنديته — ضد الذكاء الاصطناعي أو لاعب حقيقي أو صديق بغرفة", "x") + F.nav("market");
  F.app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
  F.app.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
    const k = b.dataset.m;
    if (k === "a") return F.go("auction");
    if (k === "x") return F.go("transfers");
    if (k === "t") { window.__keep = 1; F.go("challenges"); const x = F.app.querySelector('[data-ch="transfer"]'); window.__keep = 0; return x ? x.click() : F.toast("مش متاح دلوقتي"); }
    F.go("duel"); window.__tr = true; const y = F.app.querySelector('[data-cat="tr"]'); if (y) y.click();
  });
};
function fix() {
  const a = F.app, nv = a.querySelector(".nav");
  if (nv && !nv.querySelector('[data-go="auction"]')) {
    const mk = a.querySelector("[data-mkt]"), cur = mk ? mk.dataset.mkt : "";
    nv.insertAdjacentHTML("beforeend", `<button data-go="auction" class="${cur === "1" ? "on" : ""}"><span>🔨</span>المزاد</button><button data-go="transfers" class="${cur === "t" ? "on" : ""}"><span>🔄</span>الانتقالات</button>`);
    nv.querySelectorAll('[data-go="auction"],[data-go="transfers"]').forEach(b => b.onclick = () => F.go(b.dataset.go));
  }
  if (!window.__keep) { const t = a.querySelector('[data-ch="transfer"]'), c = t && t.closest(".chal"); if (c) c.remove(); }
  const tb = a.querySelector(".tabs"), g = tb && tb.querySelector('[data-cat="gen"]'), r = tb && tb.querySelector('[data-cat="tr"]');
  if (g && r) { if (!window.__tr && r.classList.contains("on")) return g.click(); (window.__tr ? g : r).remove(); }
}
new MutationObserver(fix).observe(F.app, { childList: true }); fix();
})();
