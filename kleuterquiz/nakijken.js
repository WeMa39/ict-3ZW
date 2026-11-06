// Automatische nakijker voor de kleuterquiz.
// 1) Controleert de vragen en antwoorden (thema, niveau, leeftijd).
// 2) Opent het PowerPoint-bestand (.pptx) in de browser en controleert elke stap.
// Elke stap krijgt 0, 1 of 2 punten en een lijst met feedback.
// Er wordt niets verstuurd: alles gebeurt in de browser.
(function () {
  const NK = {};

  // ───────── Hulpjes ─────────
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9?!.' -]/g, " ").replace(/\s+/g, " ").trim();
  const woorden = (t) => norm(t).replace(/[?!.]/g, " ").split(" ").filter(Boolean);
  const voornaam = (n) => woorden(n)[0] || "";
  const r = (score, fb) => ({ score, fb: fb || [] });
  const deel = (ok, totaal) => (ok >= totaal ? 2 : ok >= Math.ceil(totaal / 2) ? 1 : 0);

  // Leeftijd → niveau. Maximumleeftijd is 6 jaar (3de kleuterklas).
  NK.LEEFTIJDEN = {
    3: { label: "3 jaar (1ste kleuterklas)", vraagMax: 6, letterMax: 8, waaromMax: 8 },
    4: { label: "4 jaar (2de kleuterklas)", vraagMax: 7, letterMax: 9, waaromMax: 10 },
    5: { label: "5 jaar (3de kleuterklas)", vraagMax: 8, letterMax: 10, waaromMax: 12 },
    6: { label: "6 jaar (einde 3de kleuterklas)", vraagMax: 9, letterMax: 11, waaromMax: 14 },
  };

  // Woorden die bij elk thema passen (begin van het woord volstaat).
  NK.THEMAWOORDEN = {
    "Handjes wassen": "hand handje was zeep kraan water handdoek bacter microb kiem vies vuil proper schoon droog wrijf toilet wc plas kaka pipi poep eten nies hoest schrob nagel spoel lavabo wasbak ziek virus vinger buiten spelen dier",
    "Tanden poetsen": "tand tanden poets borstel tandpasta pasta tandarts snoep suiker gaatje mond spoel ochtend morgen avond slapen bed kies melktand wissel beker water minuut lach glimlach frisdrank cola drink appel tong adem",
    "Een gezond tienuurtje": "fruit appel peer banaan mandarijn druif aardbei groent wortel komkommer tomaat koek snoep chips choco boterham brood kaas yoghurt melk water drink frisdrank cola limonade gezond ongezond suiker tienuurtje honger energie brooddoos doos speeltijd eten",
    "Hoesten en niezen": "hoest nies elleboog mouw arm zakdoek neus snuit mond hand was bacter virus kiem ziek verkoud griep keel koorts vuilbak afstand hatsjie hatsjoe proper",
    "Veilig oversteken": "overste straat zebrapad zebra licht rood groen oranje verkeer auto fiets kijk links rechts stop wacht hand mama papa juf volwassen stoep voetpad fluo hesje gevaar veilig bus weg bord oversteek lopen rennen",
    "Zon en drinken in de zomer": "zon warm heet zomer drink water fles dorst pet petje hoed zonnecr creme insmeer smeer zonnebril bril schaduw verbrand rood huid zwem ijs zweet middag hitte buiten shirt strand",
    "Warm aankleden in de winter": "winter koud sjaal muts want handschoen jas laars sneeuw ijs bevroren ril warm trui kous sok aankle kleren kleed rits vriest vorst regen buiten glad schaats bibber",
    "Afval sorteren": "afval vuil vuilbak vuilnis sorteer pmd papier karton gft rest glas fles blik plastic bak zak schil compost natuur recyc milieu gooi kleur blauw groen grijs container park brik doos",
  };
  const VERBODEN = ["idk", "geen idee", "weet niet", "weet ik niet", "lol", "kut", "shit", "fuck", "kanker", "klote", "xxx", "test", "bla"];

  function themaHit(tekst, thema) {
    const stammen = (NK.THEMAWOORDEN[thema] || "").split(" ").filter(Boolean);
    return woorden(tekst).some((w) => stammen.some((s) => w.startsWith(s) || (s.length > 4 && w.includes(s))));
  }

  // ───────── 1) Vragen nakijken ─────────
  NK.vragen = function (st) {
    const fb = [];
    const niveau = NK.LEEFTIJDEN[st.leeftijd];
    if (!st.thema || !niveau) return r(0, ["Kies eerst een thema en een leeftijd in stap 1.1."]);
    let fouten = 0, naastThema = 0, onvolledig = false;
    const gezien = new Set();
    st.vragen.forEach((v, i) => {
      const nr = `Vraag ${i + 1}`;
      const vw = woorden(v.vraag);
      if (!vw.length || !woorden(v.juist).length || !woorden(v.fout1).length || !woorden(v.fout2).length || !v.plaats || !woorden(v.waarom).length) {
        onvolledig = true; fb.push(`${nr}: nog niet volledig ingevuld.`); return;
      }
      const alles = [v.vraag, v.juist, v.fout1, v.fout2, v.waarom].join(" ");
      if (VERBODEN.some((b) => (" " + norm(alles) + " ").includes(" " + b + " "))) { fouten += 2; fb.push(`${nr}: gebruik geen grappen of ongepaste woorden.`); }
      if (vw.length < 3) { fouten++; fb.push(`${nr}: de vraag is te kort. Maak er een echte vraag van.`); }
      if (vw.length > niveau.vraagMax) { fouten++; fb.push(`${nr}: te lang voor een kind van ${st.leeftijd}. Maximum ${niveau.vraagMax} woorden, jij hebt er ${vw.length}.`); }
      if (!v.vraag.trim().endsWith("?")) { fouten++; fb.push(`${nr}: een vraag eindigt met een vraagteken.`); }
      if (!/^[A-ZÀ-Ý]/.test(v.vraag.trim())) { fouten++; fb.push(`${nr}: begin met een hoofdletter.`); }
      const lang = woorden(v.vraag + " " + v.waarom).filter((w) => w.length > niveau.letterMax && !themaHit(w, st.thema));
      if (lang.length) { fouten++; fb.push(`${nr}: moeilijk woord voor een kind van ${st.leeftijd}: "${lang[0]}". Zoek een korter, eenvoudiger woord.`); }
      [["juist", v.juist], ["fout antwoord 1", v.fout1], ["fout antwoord 2", v.fout2]].forEach(([n, a]) => {
        if (woorden(a).length > 4) { fouten++; fb.push(`${nr}: ${n} is te lang. Een antwoord is een prent, dus maximum 4 woorden.`); }
      });
      const ant = [v.juist, v.fout1, v.fout2].map(norm);
      if (new Set(ant).size < 3) { fouten++; fb.push(`${nr}: de 3 antwoorden moeten verschillend zijn.`); }
      const jw = woorden(v.juist).filter((w) => w.length >= 4);
      if (jw.length && jw.every((w) => vw.includes(w))) { fouten++; fb.push(`${nr}: het juiste antwoord staat al in de vraag. Dan is het te makkelijk.`); }
      const ww = woorden(v.waarom);
      if (ww.length < 4) { fouten++; fb.push(`${nr}: leg in de waarom-zin uit waarom het antwoord juist is (minstens 4 woorden).`); }
      if (ww.length > niveau.waaromMax) { fouten++; fb.push(`${nr}: de waarom-zin is te lang voor een kind van ${st.leeftijd} (maximum ${niveau.waaromMax} woorden).`); }
      if (!themaHit(v.vraag + " " + v.juist + " " + v.waarom, st.thema)) { naastThema++; fb.push(`${nr}: ik zie het verband met "${st.thema}" niet goed. Gebruik woorden die bij het thema horen.`); }
      const k = norm(v.vraag);
      if (gezien.has(k)) { fouten++; fb.push(`${nr}: deze vraag hebben jullie al gesteld.`); }
      gezien.add(k);
    });
    if (onvolledig) return r(0, fb);
    const pl = st.vragen.map((v) => v.plaats);
    if (new Set(pl).size < 2) { fouten++; fb.push("De juiste prent staat altijd op dezelfde plaats. Wissel af tussen links, midden en rechts."); }
    else if (pl.some((p, i) => i >= 2 && p === pl[i - 1] && p === pl[i - 2])) { fouten++; fb.push("De juiste prent staat 3 keer na elkaar op dezelfde plaats. Wissel meer af."); }
    if (naastThema) fouten += naastThema;
    let score = fouten === 0 ? 2 : fouten <= 3 ? 1 : 0;
    if (naastThema >= 2) score = Math.min(score, 1);
    if (!fb.length) fb.push("Prima vragen: kort, duidelijk en ze passen bij jullie thema en leeftijd.");
    return r(score, fb);
  };

  // ───────── 2) PowerPoint openen ─────────
  const EMU_CM = 360000;
  const xml = (s) => new DOMParser().parseFromString(s, "application/xml");
  const tags = (el, naam) => (el ? Array.from(el.getElementsByTagName(naam)) : []);
  const tekst = (el) => tags(el, "a:t").map((t) => t.textContent).join(" ").replace(/\s+/g, " ").trim();

  function pad(basis, doel) {
    if (doel.startsWith("/")) return doel.slice(1);
    const delen = basis.split("/"); delen.pop();
    for (const d of doel.split("/")) { if (d === "..") delen.pop(); else if (d !== ".") delen.push(d); }
    return delen.join("/");
  }

  async function lees(zip, p) { const f = zip.file(p); return f ? f.async("string") : null; }
  async function rels(zip, p) {
    const map = {};
    const i = p.lastIndexOf("/");
    const s = await lees(zip, p.slice(0, i) + "/_rels/" + p.slice(i + 1) + ".rels");
    if (!s) return map;
    tags(xml(s), "Relationship").forEach((rel) => {
      map[rel.getAttribute("Id")] = { type: rel.getAttribute("Type") || "", doel: rel.getAttribute("TargetMode") === "External" ? rel.getAttribute("Target") : pad(p, rel.getAttribute("Target")) };
    });
    return map;
  }
  const relVanType = (m, deel) => Object.values(m).find((x) => x.type.endsWith("/" + deel));

  async function maxSz(zip, plekPad, phType) {
    // Zoek de standaard tekengrootte voor een titel in de indeling en de diamodel.
    const s = await lees(zip, plekPad); if (!s) return null;
    const d = xml(s);
    for (const sp of tags(d, "p:sp")) {
      const ph = tags(sp, "p:ph")[0];
      const t = ph && (ph.getAttribute("type") || "body");
      if (t === phType || (phType === "ctrTitle" && t === "title") || (phType === "title" && t === "ctrTitle")) {
        const def = tags(sp, "a:defRPr").find((x) => x.getAttribute("sz")) || tags(sp, "a:rPr").find((x) => x.getAttribute("sz"));
        if (def) return +def.getAttribute("sz") / 100;
      }
    }
    const ts = tags(d, "p:titleStyle")[0];
    const def = ts && tags(ts, "a:defRPr").find((x) => x.getAttribute("sz"));
    return def ? +def.getAttribute("sz") / 100 : null;
  }

  async function openPptx(buf) {
    if (!window.JSZip) throw new Error("JSZip ontbreekt");
    const zip = await JSZip.loadAsync(buf);
    const presXml = await lees(zip, "ppt/presentation.xml");
    if (!presXml) throw new Error("Dit is geen PowerPoint-bestand.");
    const pres = xml(presXml);
    const presRels = await rels(zip, "ppt/presentation.xml");
    const paden = tags(pres, "p:sldId").map((s) => presRels[s.getAttribute("r:id")]?.doel).filter(Boolean);
    const props = (await lees(zip, "ppt/presProps.xml")) || "";
    const kiosk = /<p:kiosk\b/.test(props);
    // Thema-naam
    let themaNaam = "";
    const master = relVanType(presRels, "slideMaster");
    if (master) {
      const mr = await rels(zip, master.doel);
      const th = relVanType(mr, "theme");
      const ts = th && (await lees(zip, th.doel));
      if (ts) themaNaam = xml(ts).documentElement.getAttribute("name") || "";
    }
    const dias = [];
    for (let i = 0; i < paden.length; i++) {
      const p = paden[i];
      const doc = xml(await lees(zip, p));
      const rm = await rels(zip, p);
      const layoutRel = relVanType(rm, "slideLayout");
      let layoutType = "", layoutPad = layoutRel?.doel, masterPad = null;
      if (layoutPad) {
        const ls = await lees(zip, layoutPad);
        if (ls) layoutType = xml(ls).documentElement.getAttribute("type") || "";
        masterPad = relVanType(await rels(zip, layoutPad), "slideMaster")?.doel;
      }
      const notesRel = relVanType(rm, "notesSlide");
      let notities = "";
      if (notesRel) {
        const ns = await lees(zip, notesRel.doel);
        if (ns) notities = tags(xml(ns), "p:sp").filter((sp) => (tags(sp, "p:ph")[0]?.getAttribute("type") || "body") === "body").map(tekst).join(" ");
      }
      const doelVan = (h) => {
        const act = h.getAttribute("action") || "";
        const rid = h.getAttribute("r:id");
        if (act.includes("hlinksldjump") && rid && rm[rid]) return paden.indexOf(rm[rid].doel);
        if (act.includes("jump=lastslideviewed")) return "laatst";
        if (act.includes("jump=nextslide")) return i + 1;
        if (act.includes("jump=previousslide")) return i - 1;
        if (act.includes("jump=firstslide")) return 0;
        if (act.includes("jump=lastslide")) return paden.length - 1;
        return null;
      };
      const vormen = [];
      let titel = null, titelSz = null, ondertitel = "", body = [];
      const spTree = tags(doc, "p:spTree")[0];
      const kids = spTree ? Array.from(spTree.children) : [];
      for (const el of kids) {
        const n = el.tagName;
        if (n !== "p:sp" && n !== "p:pic") continue;
        const cNvPr = tags(el, "p:cNvPr")[0];
        const off = tags(el, "a:off")[0], ext = tags(el, "a:ext").find((e) => e.getAttribute("cx"));
        const hl = tags(el, "a:hlinkClick").map(doelVan).filter((x) => x !== null);
        const sndInAct = tags(el, "a:hlinkClick").some((h) => tags(h, "a:snd").length > 0);
        const ph = tags(el, "p:ph")[0];
        const phType = ph ? ph.getAttribute("type") || "body" : null;
        const v = {
          soort: n === "p:pic" ? "pic" : "sp",
          audio: tags(el, "a:audioFile").length > 0 || tags(el, "p14:media").length > 0 && !tags(el, "a:videoFile").length,
          alt: (cNvPr?.getAttribute("descr") || "").trim(),
          x: off ? +off.getAttribute("x") / EMU_CM : null, y: off ? +off.getAttribute("y") / EMU_CM : null,
          b: ext ? +ext.getAttribute("cx") / EMU_CM : null, h: ext ? +ext.getAttribute("cy") / EMU_CM : null,
          vorm: tags(el, "a:prstGeom")[0]?.getAttribute("prst") || "",
          tekst: tekst(el), links: hl, geluid: sndInAct,
          stijl: tags(tags(el, "p:spPr")[0], "a:ln").some((l) => !tags(l, "a:noFill").length) || tags(tags(el, "p:spPr")[0], "a:effectLst").some((e) => e.children.length > 0) || tags(el, "p:style").length > 0,
          ph: phType,
        };
        if (phType === "title" || phType === "ctrTitle") {
          titel = v.tekst;
          const szs = tags(el, "a:rPr").concat(tags(el, "a:endParaRPr")).map((x) => +x.getAttribute("sz") || 0).filter(Boolean);
          titelSz = szs.length ? Math.max(...szs) / 100 : (layoutPad && (await maxSz(zip, layoutPad, phType))) || (masterPad && (await maxSz(zip, masterPad, phType))) || null;
        } else if (phType === "subTitle") ondertitel = v.tekst;
        else if (phType) body = body.concat(tags(el, "a:p").map(tekst).filter(Boolean));
        vormen.push(v);
      }
      // Timing: audio automatisch, verborgen; ingangsanimatie automatisch.
      const timing = tags(doc, "p:timing")[0];
      const autoAudio = tags(timing, "p:cmd").some((c) => /playFrom/.test(c.getAttribute("cmd") || "") && (() => {
        let e = c; while (e && e !== timing) { if (e.tagName === "p:cTn" && e.getAttribute("nodeType")) return e.getAttribute("nodeType") !== "clickEffect"; e = e.parentNode; } return false; })());
      const verborgen = tags(timing, "p:cMediaNode").some((m) => m.getAttribute("showWhenStopped") === "0");
      const animAuto = tags(timing, "p:cTn").some((c) => c.getAttribute("presetClass") === "entr" && /withEffect|afterEffect/.test(c.getAttribute("nodeType") || ""));
      const animKlik = tags(timing, "p:cTn").some((c) => c.getAttribute("presetClass") === "entr");
      const tr = tags(doc, "p:transition")[0];
      const trSoort = tr ? (Array.from(tr.children).find((c) => !/sndAc|extLst/.test(c.tagName))?.tagName.split(":")[1] || "") : "";
      const trGeluid = tr ? tags(tr, "p:snd").map((s) => s.getAttribute("name") || "geluid")[0] || "" : "";
      dias.push({ nr: i + 1, layoutType, titel: titel || "", titelSz, ondertitel, body, notities, vormen, autoAudio, verborgen, animAuto, animKlik, overgang: tr ? trSoort || "ja" : "", trGeluid });
    }
    return { dias, kiosk, themaNaam };
  }

  // ───────── 3) PowerPoint nakijken ─────────
  function rol(d, i) {
    const t = norm(d.titel);
    if (t.includes("goed zo")) return "goed";
    if (t.startsWith("oei") || t.includes("probeer nog")) return "oei";
    if (t.includes("bravo")) return "slot";
    if (i === 0) return "titel";
    if (t.includes("hoe speel")) return "uitleg";
    return "vraag";
  }
  const lijkt = (a, b) => {
    const A = new Set(woorden(a)), B = new Set(woorden(b));
    if (!A.size || !B.size) return false;
    const gemeen = [...A].filter((w) => B.has(w)).length;
    return gemeen / Math.max(A.size, B.size) >= 0.6;
  };
  const prenten = (d) => d.vormen.filter((v) => v.soort === "pic" && !v.audio);
  const POS = { links: 0, midden: 1, rechts: 2 };

  function kijkNa(P, st, lesNr, bestandsnaam) {
    const R = {};
    const D = P.dias;
    D.forEach((d, i) => (d.rol = rol(d, i)));
    const vragen = D.filter((d) => d.rol === "vraag");
    const goed = D.filter((d) => d.rol === "goed");
    const oei = D.find((d) => d.rol === "oei");
    const slot = D.find((d) => d.rol === "slot");
    const idx = (d) => D.indexOf(d);
    const v1 = vragen[0];

    // Les 1
    {
      const bn = norm(bestandsnaam);
      const namenOk = st.namen.every((n) => voornaam(n) && bn.includes(voornaam(n)));
      R["1.3"] = bn.includes("kleuterquiz") && namenOk ? r(2, ["Bestandsnaam is in orde."]) : bn.includes("kleuterquiz") ? r(1, ["Zet allebei jullie voornamen in de bestandsnaam."]) : r(0, [`De bestandsnaam "${bestandsnaam}" volgt de afspraak niet: klas_Kleuterquiz_thema_voornaam1_voornaam2.`]);

      const standaard = !P.themaNaam || /office/i.test(P.themaNaam);
      R["1.5"] = standaard ? r(0, ["Jullie gebruiken nog het standaardontwerp. Kies een ontwerp bij Ontwerpen."]) : r(2, [`Ontwerp gekozen: ${P.themaNaam}.`]);

      const d0 = D[0];
      if (!d0) R["1.6"] = r(0, ["Er is nog geen titeldia."]);
      else {
        const fb = []; let ok = 0;
        if (woorden(d0.titel).length >= 2) ok++; else fb.push("Typ een titel op de eerste dia.");
        const ond = norm(d0.ondertitel + " " + d0.body.join(" "));
        if (st.namen.every((n) => ond.includes(voornaam(n)))) ok++; else fb.push("Zet allebei jullie voornamen op de titeldia.");
        if (d0.titelSz && d0.titelSz >= 54) ok++; else fb.push(`De titel moet minstens 54 pt zijn${d0.titelSz ? ` (nu ${d0.titelSz} pt)` : ""}.`);
        R["1.6"] = r(deel(ok, 3), fb.length ? fb : ["Titeldia in orde."]);
      }

      const d1 = D[1];
      if (!d1) R["1.7"] = r(0, ["Er is nog geen uitlegdia (dia 2)."]);
      else {
        const fb = []; let ok = 0;
        if (d1.layoutType === "obj") ok++; else fb.push("Dia 2 moet de indeling Titel en object hebben.");
        if (norm(d1.titel).includes("hoe speel")) ok++; else fb.push('De titel van dia 2 is "Hoe speel je?".');
        if (d1.body.length >= 3) ok++; else fb.push(`Schrijf 3 zinnen uitleg op dia 2 (nu ${d1.body.length}).`);
        R["1.7"] = r(deel(ok, 3), fb.length ? fb : ["Uitlegdia in orde."]);
      }

      if (!v1) { ["1.8", "1.9", "1.10", "1.11"].forEach((s) => (R[s] = r(0, ["Ik vind nog geen vraagdia."]))); }
      else {
        const fb = []; let ok = 0;
        if (v1.layoutType === "titleOnly") ok++; else fb.push("De vraagdia moet de indeling Alleen titel hebben.");
        if (lijkt(v1.titel, st.vragen[0].vraag)) ok++; else fb.push(`De vraag op dia ${v1.nr} is niet vraag 1 uit stap 1.2.`);
        if (v1.titelSz && v1.titelSz >= 40) ok++; else fb.push(`De vraag moet minstens 40 pt zijn${v1.titelSz ? ` (nu ${v1.titelSz} pt)` : ""}.`);
        R["1.8"] = r(deel(ok, 3), fb.length ? fb : ["Vraagdia in orde."]);

        const pr = prenten(v1);
        if (pr.length !== 3) R["1.9"] = r(pr.length ? 1 : 0, [`Op de eerste vraagdia staan ${pr.length} prenten, het moeten er 3 zijn.`]);
        else {
          const goedeHoogte = pr.filter((p) => Math.abs(p.h - 6) <= 0.25).length;
          R["1.9"] = goedeHoogte === 3 ? r(2, ["3 prenten van 6 cm hoog."]) : r(1, [`Niet alle prenten zijn 6 cm hoog (${pr.map((p) => p.h.toFixed(1) + " cm").join(", ")}).`]);
        }
        if (pr.length >= 2) {
          const s = [...pr].sort((a, b) => a.x - b.x);
          const onder = s.map((p) => p.y + p.h);
          const onderOk = Math.max(...onder) - Math.min(...onder) <= 0.15;
          const gaten = s.slice(1).map((p, i) => p.x - (s[i].x + s[i].b));
          const gatOk = gaten.length < 2 || Math.max(...gaten) - Math.min(...gaten) <= 0.3;
          const fb2 = [];
          if (!onderOk) fb2.push("De onderkant van de prenten staat niet op één lijn. Gebruik Uitlijnen → Onder uitlijnen.");
          if (!gatOk) fb2.push("De ruimte tussen de prenten is niet gelijk. Gebruik Uitlijnen → Horizontaal verdelen.");
          R["1.10"] = r((onderOk ? 1 : 0) + (gatOk ? 1 : 0), fb2.length ? fb2 : ["Netjes uitgelijnd en verdeeld."]);
          const gestijld = pr.filter((p) => p.stijl).length;
          R["1.11"] = r(deel(gestijld, pr.length), gestijld === pr.length ? ["Alle prenten hebben een afbeeldingsstijl."] : [`${pr.length - gestijld} prent(en) hebben nog geen afbeeldingsstijl.`]);
        } else { R["1.10"] = r(0, ["Er zijn te weinig prenten om uit te lijnen."]); R["1.11"] = r(0, ["Er zijn nog geen prenten."]); }
      }
      if (lesNr === 1) R["1.12"] = r(2, ["Ingeleverd."]);
    }
    if (lesNr < 2) return R;

    // Les 2
    {
      const fb = []; let ok = 0;
      vragen.slice(0, 5).forEach((d, i) => {
        const g = [];
        if (d.layoutType !== "titleOnly") g.push("indeling is niet Alleen titel");
        if (prenten(d).length !== 3) g.push(`${prenten(d).length} prenten in plaats van 3`);
        if (!lijkt(d.titel, st.vragen[i]?.vraag)) g.push(`het is niet vraag ${i + 1} uit stap 1.2`);
        if (g.length) fb.push(`Dia ${d.nr}: ${g.join(", ")}.`); else ok++;
      });
      if (vragen.length !== 5) fb.unshift(`Ik vind ${vragen.length} vraagdia's, het moeten er 5 zijn.`);
      R["2.2"] = r(deel(ok, 5), fb.length ? fb : ["5 vraagdia's in orde."]);

      const met = vragen.filter((d) => norm(d.notities).includes("juist")).length;
      R["2.3"] = r(deel(met, 5), met >= 5 ? ["Notities in orde."] : [`Bij ${Math.max(0, 5 - met)} vraag/vragen staat nog niet in de notities welke prent juist is.`]);

      const naVraag = goed.filter((g) => D[idx(g) - 1]?.rol === "vraag").length;
      R["2.4"] = r(deel(Math.min(naVraag, 5), 5), naVraag >= 5 && goed.length === 5 ? ["Goed-zo-dia's staan op de juiste plaats."] : [`Ik vind ${goed.length} Goed-zo-dia's, waarvan ${naVraag} direct na een vraag.`]);

      const fb5 = []; let ok5 = 0;
      if (oei) ok5++; else fb5.push("Er is geen Oei-dia.");
      if (slot && idx(slot) === D.length - 1) ok5++; else fb5.push("De slotdia (Bravo!) moet de laatste dia zijn.");
      if (D.length === 14) ok5++; else fb5.push(`De quiz heeft ${D.length} dia's, het moeten er 14 zijn.`);
      R["2.5"] = r(deel(ok5, 3), fb5.length ? fb5 : ["Oei-dia, slotdia en 14 dia's: in orde."]);

      let ok6 = 0, ok7 = 0; const fb6 = [], fb7 = [];
      vragen.slice(0, 5).forEach((d, i) => {
        const pr = [...prenten(d)].sort((a, b) => a.x - b.x);
        const juist = pr.filter((p) => p.links.includes(idx(d) + 1) && D[idx(d) + 1]?.rol === "goed");
        if (juist.length === 1 && pr.indexOf(juist[0]) === POS[st.vragen[i]?.plaats]) ok6++;
        else if (juist.length === 1) fb6.push(`Dia ${d.nr}: de juiste prent staat niet ${st.vragen[i]?.plaats}, zoals jullie kozen in stap 1.2.`);
        else fb6.push(`Dia ${d.nr}: ${juist.length} prenten gaan naar de Goed-zo-dia erna (dat moet er precies 1 zijn).`);
        const fout = pr.filter((p) => oei && p.links.includes(idx(oei))).length;
        ok7 += Math.min(fout, 2);
        if (fout < 2) fb7.push(`Dia ${d.nr}: ${2 - fout} foute prent(en) gaan nog niet naar de Oei-dia.`);
      });
      R["2.6"] = r(deel(ok6, 5), fb6.length ? fb6 : ["Alle juiste prenten gaan naar de juiste Goed-zo-dia."]);
      R["2.7"] = r(deel(ok7, 10), fb7.length ? fb7 : ["Alle foute prenten gaan naar de Oei-dia."]);

      let ok8 = 0; const fb8 = [];
      goed.forEach((g) => {
        const doel = D.slice(idx(g) + 1).find((d) => d.rol === "vraag") || slot;
        const pijl = doel && g.vormen.some((v) => v.soort === "sp" && v.links.includes(idx(doel)));
        if (pijl) ok8++;
        else fb8.push(`Dia ${g.nr}: de Verder-pijl moet naar ${doel ? (doel.rol === "slot" ? "de slotdia" : "dia " + doel.nr) : "de volgende vraag"} gaan.`);
      });
      R["2.8"] = r(deel(ok8, 5), fb8.length ? fb8 : ["Alle Verder-pijlen zijn juist."]);

      let ok9 = 0;
      goed.forEach((g) => { const extra = g.vormen.filter((v) => !["title", "ctrTitle"].includes(v.ph) && v.soort === "sp" && !v.links.length).map((v) => v.tekst).join(" "); if (woorden(extra).length >= 4) ok9++; });
      R["2.9"] = r(deel(ok9, 5), ok9 >= 5 ? ["Op elke Goed-zo-dia staat een waarom-zin."] : [`Op ${Math.max(0, 5 - ok9)} Goed-zo-dia('s) staat nog geen waarom-zin van minstens 4 woorden.`]);
      if (lesNr === 2) R["2.10"] = r(2, ["Ingeleverd."]);
    }
    if (lesNr < 3) return R;

    // Les 3
    {
      R["3.1"] = oei && oei.vormen.some((v) => v.links.includes("laatst")) ? r(2, ["Nog eens gaat naar de laatst weergegeven dia."]) : r(0, ["Op de Oei-dia staat geen knop die naar de Laatst weergegeven dia gaat (Invoegen → Actie)."]);
      const fb2 = []; let ok2 = 0;
      if (D[0]?.vormen.some((v) => v.soort === "sp" && v.links.includes(1))) ok2++; else fb2.push("De Start-knop op dia 1 gaat niet naar dia 2.");
      if (D[1]?.vormen.some((v) => v.soort === "sp" && v.links.includes(2))) ok2++; else fb2.push("De Speel-knop op dia 2 gaat niet naar dia 3.");
      R["3.2"] = r(ok2, fb2.length ? fb2 : ["Start- en Speel-knop in orde."]);

      let ok3 = 0; const fb3 = [];
      vragen.slice(0, 5).forEach((d) => {
        const audio = d.vormen.some((v) => v.audio);
        if (!audio) { fb3.push(`Dia ${d.nr}: er is geen ingesproken vraag.`); return; }
        let p = 1;
        if (d.autoAudio) p++; else fb3.push(`Dia ${d.nr}: zet Starten op Automatisch.`);
        if (d.verborgen) p++; else fb3.push(`Dia ${d.nr}: vink Verbergen tijdens voorstelling aan.`);
        ok3 += p;
      });
      R["3.3"] = r(deel(ok3, 15), fb3.length ? fb3 : ["Alle vragen worden automatisch voorgelezen."]);

      const auto = goed.filter((g) => g.animAuto).length, klik = goed.filter((g) => g.animKlik && !g.animAuto).length;
      R["3.4"] = r(deel(auto, 5), auto >= 5 ? ["Op elke Goed-zo-dia beweegt de prent vanzelf."] : [`${5 - auto} Goed-zo-dia('s) hebben nog geen animatie die vanzelf start${klik ? " (zet Begin op Met vorige)" : ""}.`]);

      const soorten = D.map((d) => d.overgang);
      const met = soorten.filter(Boolean).length;
      const zelfde = new Set(soorten.filter(Boolean)).size === 1;
      R["3.5"] = met === D.length && zelfde ? r(2, [`Alle dia's hebben de overgang ${soorten[0]}.`]) : r(met ? 1 : 0, [met < D.length ? `${D.length - met} dia('s) hebben nog geen overgang. Gebruik Op alles toepassen.` : "Niet alle dia's hebben dezelfde overgang."]);

      const applaus = goed.filter((g) => g.trGeluid).length;
      R["3.6"] = r(deel(applaus, 5), applaus >= 5 ? ["Op elke Goed-zo-dia klinkt applaus."] : [`Op ${5 - applaus} Goed-zo-dia('s) klinkt nog geen applaus.`]);

      R["3.7"] = P.kiosk ? r(2, ["Kiosk-modus staat aan."]) : r(0, ["De kiosk-modus staat nog niet aan (Diavoorstelling instellen)."]);

      const alle = vragen.slice(0, 5).flatMap(prenten);
      const metAlt = alle.filter((p) => woorden(p.alt).length >= 2).length;
      R["3.8"] = r(alle.length && metAlt >= alle.length ? 2 : metAlt >= alle.length * 0.6 ? 1 : 0, metAlt >= alle.length && alle.length ? ["Alle prenten hebben een alternatieve tekst."] : [`${alle.length - metAlt} prent(en) hebben nog geen alternatieve tekst.`]);

      const knoppen = ["2.6", "2.7", "2.8", "3.1", "3.2"];
      const perfect = knoppen.filter((k) => R[k].score === 2).length;
      R["3.9"] = r(perfect === 5 ? 2 : perfect >= 3 ? 1 : 0, perfect === 5 ? ["Alle knoppen werken."] : ["Nog niet alle knoppen werken. Kijk naar de feedback bij " + knoppen.filter((k) => R[k].score < 2).join(", ") + "."]);
      if (lesNr === 3) R["3.10"] = r(2, ["Ingeleverd."]);
    }
    return R;
  }

  NK.pptx = async function (buf, bestandsnaam, st, lesNr) {
    const P = await openPptx(buf);
    return { stappen: kijkNa(P, st, Math.min(lesNr, 3), bestandsnaam), dias: P.dias.length };
  };

  // ───────── Les 4: feedback en terugblik ─────────
  NK.feedback = function (f) {
    if (!f || !woorden(f.duo).length) return r(0, ["Vul in van welk duo de quiz was."]);
    const fb = []; let ok = 0;
    if (woorden(f.top).length >= 5) ok++; else fb.push("Schrijf een top van minstens 5 woorden.");
    if (woorden(f.tip).length >= 5) ok++; else fb.push("Schrijf een tip van minstens 5 woorden.");
    return r(ok, fb.length ? fb : ["Duidelijke top en tip."]);
  };
  NK.reflectie = function (antw) {
    const goed = antw.filter((a) => woorden(a).length >= 6).length;
    return r(deel(goed, antw.length), goed === antw.length ? ["Eerlijke en volledige terugblik."] : [`Beantwoord elke vraag met minstens 6 woorden (${antw.length - goed} nog te kort).`]);
  };

  // Eenvoudige controlecode zodat een aangepast rapport opvalt.
  NK.code = function (obj) {
    const s = JSON.stringify(obj, (k, v) => (k === "controlecode" ? undefined : v));
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ("00000000" + (h >>> 0).toString(16)).slice(-8);
  };

  window.NK = NK;
})();
