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

/* ---------- المدربين ---------- */
const C = (a, e, n, o) => ({ ar: a, en: e, nat: n, ovr: o, pos: "COACH" });
const COACH_TOP = [C("بيب غوارديولا", "Pep Guardiola", "ESP", 97), C("أليكس فيرغسون", "Alex Ferguson", "SCO", 96), C("كارلو أنشيلوتي", "Carlo Ancelotti", "ITA", 95), C("يورغن كلوب", "Jürgen Klopp", "GER", 94),
  C("زين الدين زيدان", "Zinedine Zidane", "FRA", 93), C("جوزيه مورينيو", "José Mourinho", "POR", 92), C("لويس إنريكي", "Luis Enrique", "ESP", 91), C("هانزي فليك", "Hansi Flick", "GER", 91), C("ديدييه ديشان", "Didier Deschamps", "FRA", 90), C("دييغو سيميوني", "Diego Simeone", "ARG", 90)];
const COACH_LOW = [C("ماوريسيو بوكيتينو", "Mauricio Pochettino", "ARG", 84), C("غاريث ساوثغيت", "Gareth Southgate", "ENG", 82), C("روبرتو مارتينيز", "Roberto Martínez", "ESP", 82), C("إريك تن هاغ", "Erik ten Hag", "NED", 82),
  C("وليد الركراكي", "Walid Regragui", "MAR", 80), C("بيتسو موسيماني", "Pitso Mosimane", "RSA", 79), C("هيرفي رينارد", "Hervé Renard", "FRA", 79), C("كارلوس كيروش", "Carlos Queiroz", "POR", 78), C("حسام حسن", "Hossam Hassan", "EGY", 76)];

/* ---------- الكروت ---------- */
const POSAR = { GK: "حارس", DEF: "مدافع", MID: "وسط", ATT: "مهاجم", COACH: "مدرب" };
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
  return `<div class="fcw"><div class="fc ${ret ? "ret" : "cur"}${sm ? " sm" : ""}${o.cls ? " " + o.cls : ""}"><div class="fc-in"><div class="fc-rt"><b>${p.ovr}</b><i>${p.pos === "COACH" ? "COACH" : p.pos}</i></div><div class="fc-img">${avatar(p)}</div><div class="fc-nm"${fs}>${esc(nm)}</div><div class="fc-fl">${n[2]}</div></div></div>${sm ? "" : `<div class="fc-arc">${esc(p.ar)}</div>`}${o.tag ? `<div class="fc-cap">${o.tag}</div>` : ""}${o.off ? '<div class="fc-off">خارج مركزه</div>' : ""}</div>`;
}

/* ---------- الإعدادات ---------- */
const FMT = { five: { n: 5, bud: 100, nm: "خماسي", tg: { GK: 1, DEF: 1, MID: 2, ATT: 1 } }, full: { n: 11, bud: 300, nm: "ملعب كامل 11", tg: { GK: 1, DEF: 4, MID: 3, ATT: 3 } } };
const BID_MS = 12000, ROUND = 19000;
const val = r => Math.max(1, Math.round(Math.pow((r - 60) / 10, 3))); // قيمة اللاعب التقديرية بالمليون
let M = null, fmtK = "five", OFF = 0;
const now = () => Date.now() + OFF;
function stop() { if (M) { clearInterval(M.tick); clearInterval(M.poll); clearInterval(M.sim); M.dead = true; if (M.open && M.code) db("DELETE", "/auc_open/" + M.fmt + "/" + M.code).catch(() => {}); } M = null; }
const view = h => { F.app.innerHTML = h; window.scrollTo(0, 0); };
async function syncTime(code, role) { // توحيد الساعة مع سيرفر Firebase عشان اللاعبين يبدأوا مع بعض حتى لو ساعات الموبايلات مختلفة
  try { const a = Date.now(); let s = await db("PUT", "/auc/" + code + "/ts/" + role, { ".sv": "timestamp" }); const b = Date.now();
    if (typeof s !== "number") s = await db("GET", "/auc/" + code + "/ts/" + role);
    if (typeof s === "number") OFF = s - (a + b) / 2; } catch (e) { OFF = 0; }
}

/* ---------- الشاشة الرئيسية للمزاد ---------- */
R.auction = function () {
  stop(); F.setLeave(stop);
  view(`<div class="card" data-mkt="1" style="text-align:center"><h3>🔨 المزاد</h3><p>اشتري لاعبين من كل أنحاء العالم بميزانيتك، وركّب أقوى فريق، وبعدين المباراة تحسم!</p></div>
  <div class="card"><b>اختار نوع المزاد</b><div style="display:flex;gap:8px;margin-top:8px"><button class="btn ${fmtK === "five" ? "" : "sec"}" id="f5">⚽ خماسي<br><small>5 مزادات · ${FMT.five.bud} م</small></button><button class="btn ${fmtK === "full" ? "" : "sec"}" id="f11">🏟 11 لاعب<br><small>11 مزاد · ${FMT.full.bud} م</small></button></div></div>
  <button class="btn big" id="ai">🤖 ضد الذكاء الاصطناعي</button>
  <button class="btn sec" id="rnd" style="margin-top:10px">⚔ واحد ضد واحد (منافس عشوائي)</button>
  <button class="btn sec" id="mk" style="margin-top:10px">🏠 إنشاء غرفة (كود لصديقك)</button>
  <div style="display:flex;gap:8px;margin-top:10px"><input id="cd" placeholder="كود الغرفة" maxlength="6" style="flex:1;padding:12px;border-radius:12px;text-align:center;text-transform:uppercase"><button class="btn sec" id="jn">دخول غرفة</button></div>
  <button class="btn sec" id="bk" style="margin-top:14px">رجوع</button>`);
  $("#f5").onclick = () => { fmtK = "five"; R.auction(); }; $("#f11").onclick = () => { fmtK = "full"; R.auction(); };
  $("#ai").onclick = () => begin({ mode: "ai", role: "h", seed: Math.floor(Math.random() * 1e9), t0: Date.now() + 2500 });
  $("#rnd").onclick = randomMatch; $("#mk").onclick = () => createRoom(false); $("#jn").onclick = joinRoom; $("#bk").onclick = () => F.go("market");
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
  const ORD = { five: ["GK", "DEF", "MID", "MID", "ATT"], full: ["GK", "DEF", "DEF", "DEF", "DEF", "MID", "MID", "MID", "ATT", "ATT", "ATT"] }[fk], left = all.slice(), lots = [];
  if (ORD) ORD.forEach(pos => { const i = left.findIndex(p => p.pos === pos); if (i >= 0) lots.push(left.splice(i, 1)[0]); });
  while (lots.length < f.n) lots.push(left.shift());
  const rest = left, cons = rest.filter(p => p.ovr <= 82).concat(rest.filter(p => p.ovr > 82));
  stop();
  M = Object.assign({ n: f.n, tg: f.tg, lots, cons, used: new Set(), teams: { h: { pl: [], bud: f.bud }, g: { pl: [], bud: f.bud } }, cur: -1, mine: {}, done: {}, log: {}, stg: 0, oppName: s.opp || "🤖 فريق الذكاء الاصطناعي", fmt: fk, phase: "auc" }, s);
  F.setLeave(stop); M.tick = setInterval(step, 250); step();
}
function step() {
  if (!M || M.dead || M.phase !== "auc") return; const el = now() - M.t0;
  if (el < 0) return view(`<div class="card" style="text-align:center"><h3>🔨 المزاد هيبدأ بعد ${Math.ceil(-el / 1000)}…</h3><p>${esc(M.oppName)} ضدك · ${FMT[M.fmt].nm}</p></div>`);
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
  view(`<div class="card" style="text-align:center"><small>مزاد ${M.cur + 1} من ${M.n} · ${FMT[M.fmt].nm}</small><div style="display:flex;justify-content:space-between;margin:6px 0;gap:6px"><b>أنت: ${me.bud} م · ${me.pl.length}/${M.n}</b><b>${esc(M.oppName)}: ${op.bud} م · ${op.pl.length}/${M.n}</b></div><div id="tm" style="font-size:26px;color:var(--gold1)">00:12</div></div>
  <div class="cardrow">${card(p, { tag: "🔨 على المزاد" })}</div>
  <div class="card" style="text-align:center"><small>القيمة التقديرية للاعب: <b>${val(p.ovr)} م</b> · ${POSAR[p.pos]}</small></div>
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
  const ph = now() - m.t0 - c * ROUND, shift = ROUND - ph - 3000;
  if (shift > 0) m.t0 -= shift;
}
function put(path, v) { return (async () => { for (let i = 0; i < 3; i++) { try { await db("PUT", path, v); return true; } catch (e) { await sleep(300); } } return false; })(); }
function submit() {
  if (M.sub) return; M.sub = true; const r = M.cur, v = Math.min(M.stg, maxBid(M.teams[M.role])); M.mine[r] = v;
  M.wp = M.wp || {}; if (M.mode === "on") M.wp[r] = put("/auc/" + M.code + "/b/" + r + "/" + M.role, v).then(ok => { if (!ok) M.mine[r] = 0; });
}
function aiBid(r) {
  const op = M.role === "h" ? "g" : "h", t = M.teams[op], p = M.lots[r], g = rng(M.seed * 7 + r * 131), left = M.n - r;
  const want = val(p.ovr) * (0.5 + g() * 0.7), cap = Math.max(1, Math.round(t.bud / Math.max(1, left) * 2.4));
  if (t.bud < 1 || (p.ovr < 76 && g() < 0.35) || g() < 0.1) return 0;
  return Math.max(1, Math.min(t.bud, Math.round(Math.min(want, cap))));
}
function consol(t) {
  const c = { GK: 0, DEF: 0, MID: 0, ATT: 0 }; t.pl.forEach(x => c[x.p.pos]++);
  const nd = Object.keys(M.tg).filter(k => c[k] < M.tg[k]);
  let i = M.cons.findIndex(x => !M.used.has(x.id) && nd.includes(x.pos)); if (i < 0) i = M.cons.findIndex(x => !M.used.has(x.id));
  const p = M.cons[i]; M.used.add(p.id); return p;
}
async function resolve(r) {
  const m = M; m.busy = true; const me = m.role, opR = me === "h" ? "g" : "h"; let ob = 0;
  if (m.mode === "on") {
    if (m.wp && m.wp[r]) await m.wp[r];
    for (let i = 0; i < 16; i++) { try { const x = await db("GET", "/auc/" + m.code + "/b/" + r + "/" + opR); if (x !== null && x !== undefined) { ob = +x || 0; break; } } catch (e) {} await sleep(400); if (M !== m) return; }
  } else ob = aiBid(r);
  if (M !== m || m.dead) return;
  const bid = { [me]: Math.min(m.mine[r] || 0, maxBid(m.teams[me])), [opR]: Math.min(ob, maxBid(m.teams[opR])) }, lot = m.lots[r];
  let w = null; if (bid.h > 0 || bid.g > 0) w = bid.h > bid.g ? "h" : bid.g > bid.h ? "g" : (rng(m.seed + r * 97)() < 0.5 ? "h" : "g");
  const got = {};
  ["h", "g"].forEach(k => { const t = m.teams[k]; if (k === w) { t.bud -= bid[k]; t.pl.push({ p: lot, pr: bid[k] }); got[k] = { p: lot, pr: bid[k], won: true }; } else { const c = consol(t); t.pl.push({ p: c, pr: 0 }); got[k] = { p: c, pr: 0, won: false }; } });
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
  ["GK", "DEF", "MID", "ATT"].forEach(pos => { for (let i = 0; i < tg[pos]; i++) { const k = left.findIndex(x => x.pos === pos); if (k >= 0) out.push({ p: left.splice(k, 1)[0], slot: pos, eff: 0 }); else miss.push(pos); } });
  miss.sort((a, b) => (a === "GK" ? -1 : 0) - (b === "GK" ? -1 : 0)).forEach(pos => { const x = pos === "GK" ? left.pop() : left.shift(); out.push({ p: x, slot: pos, off: true, eff: 0 }); });
  out.forEach(o => o.eff = o.off ? Math.max(40, o.p.ovr - (o.slot === "GK" ? 25 : 10)) : o.p.ovr);
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
  return ["ATT", "MID", "DEF", "GK"].map(pos => { const r = ar.filter(x => x.slot === pos); return r.length ? `<div class="cardrow wrap">${r.map(x => card(x.p, { sm: 1, off: x.off })).join("")}</div>` : ""; }).join("");
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
const opLabel = m => m.mode === "on" ? m.oppName : "🤖 الذكاء الاصطناعي";
const scoreRow = (m, id, txt) => `<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><div style="flex:1;text-align:center"><b>${esc(meLabel())}</b></div><div style="font-size:40px"><b${id ? ' id="' + id + '"' : ""}>${txt}</b></div><div style="flex:1;text-align:center"><b>${esc(opLabel(m))}</b></div></div>`;
function simulate(m) {
  const rg = rng(m.seed + 7), ev = [], d = { h: m.str.h - m.str.g, g: m.str.g - m.str.h }, fac = { ATT: 3, MID: 1.2, DEF: 0.35, GK: 0 };
  for (let seg = 0; seg < 18; seg++) ["h", "g"].forEach(k => {
    if (rg() < Math.min(0.4, Math.max(0.02, 0.115 + d[k] * 0.009))) {
      const c = m.arr[k].filter(x => fac[x.slot] > 0 && x.p.pos !== "GK"), w = c.map(x => Math.pow(x.eff / 100, 4) * fac[x.slot]), s = w.reduce((a, b) => a + b, 0); let q = rg() * s, i = 0; while (i < c.length - 1 && (q -= w[i]) > 0) i++;
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

/* ---------- قسم المزاد والانتقالات ---------- */
const wrap = n => { const o = R[n]; R[n] = function () { window.__tr = false; return o.apply(this, arguments); }; }; wrap("home"); wrap("challenges");
R.market = function () {
  stop(); window.__tr = false; const c = (ic, t, d, id) => `<div class="chal" data-mkt="1"><div class="ic">${ic}</div><div class="t grow"><b>${t}</b><small>${d}</small></div><button class="btn" data-m="${id}">ادخل</button></div>`;
  F.app.innerHTML = F.header() + "<h2>🔨 المزاد والانتقالات</h2>" + c("🔨", "المزاد", "اشتري لاعبين من كل العالم والأقوى يكسب — ضد الذكاء الاصطناعي أو لاعب حقيقي", "a") + c("🔄", "اعرف اللاعب من انتقالاته", "10 أسئلة: أندية اللاعب بالترتيب وانت تعرفه", "t") + c("⚔", "انتقالات واحد ضد واحد", "اعرف اللاعب من انتقالاته ضد لاعب حقيقي أو الكمبيوتر", "d") + F.nav("market");
  F.app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => F.go(b.dataset.go));
  F.app.querySelectorAll("[data-m]").forEach(b => b.onclick = () => {
    const k = b.dataset.m;
    if (k === "a") return F.go("auction");
    if (k === "t") { window.__keep = 1; F.go("challenges"); const x = F.app.querySelector('[data-ch="transfer"]'); window.__keep = 0; return x ? x.click() : F.toast("مش متاح دلوقتي"); }
    F.go("duel"); window.__tr = true; const y = F.app.querySelector('[data-cat="tr"]'); if (y) y.click();
  });
};
function fix() {
  const a = F.app, nv = a.querySelector(".nav");
  if (nv && !nv.querySelector('[data-go="market"]')) { nv.insertAdjacentHTML("beforeend", `<button data-go="market" class="${a.querySelector("[data-mkt]") ? "on" : ""}"><span>🔨</span>المزاد</button>`); nv.lastElementChild.onclick = () => F.go("market"); }
  if (!window.__keep) { const t = a.querySelector('[data-ch="transfer"]'), c = t && t.closest(".chal"); if (c) c.remove(); }
  const tb = a.querySelector(".tabs"), g = tb && tb.querySelector('[data-cat="gen"]'), r = tb && tb.querySelector('[data-cat="tr"]');
  if (g && r) { if (!window.__tr && r.classList.contains("on")) return g.click(); (window.__tr ? g : r).remove(); }
}
new MutationObserver(fix).observe(F.app, { childList: true }); fix();
})();
