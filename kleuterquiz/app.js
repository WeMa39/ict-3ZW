// Leerlingenpagina: stap-voor-stap lessen, automatisch nakijken, voortgang en rapport.
(function () {
  const OPSLAG = "kleuterquiz-leerling-v1";
  const app = document.getElementById("app");
  const duoLabel = document.getElementById("duo-label");

  const legeVraag = () => ({ vraag: "", juist: "", fout1: "", fout2: "", waarom: "", plaats: "" });
  function leeg() {
    return {
      versie: 1, klas: "", namen: ["", ""], thema: "", leeftijd: "",
      vragen: Array.from({ length: 5 }, legeVraag),
      stappen: {}, auto: {}, controles: {}, feedback: {},
      reflectie: REFLECTIE_VRAGEN.map(() => ""),
      getypt: { geblokkeerd: 0, verdacht: 0 },
      les: 1,
    };
  }
  function aanvullen(s) {
    const n = Object.assign(leeg(), s);
    n.vragen = (n.vragen || []).map((v) => Object.assign(legeVraag(), v));
    while (n.vragen.length < 5) n.vragen.push(legeVraag());
    n.auto = n.auto || {}; n.controles = n.controles || {}; n.getypt = Object.assign({ geblokkeerd: 0, verdacht: 0 }, n.getypt);
    return n;
  }
  function laad() {
    try { const s = JSON.parse(localStorage.getItem(OPSLAG)); if (s && s.versie === 1) return aanvullen(s); } catch (e) {}
    return leeg();
  }
  let st = laad();
  let openStap = null;
  const bewaar = () => { try { localStorage.setItem(OPSLAG, JSON.stringify(st)); } catch (e) {} };

  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tijd = (iso) => new Date(iso).toLocaleString("nl-BE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  const stapInfo = (id) => (st.stappen[id] = st.stappen[id] || { checks: [], klaar: null });

  // ───────── Zelf typen: plakken, slepen en kopiëren blokkeren ─────────
  let melding;
  function meld(t) {
    if (!melding) { melding = document.createElement("div"); melding.className = "plakmelding"; document.body.appendChild(melding); }
    melding.textContent = t; melding.classList.add("zichtbaar");
    clearTimeout(meld.t); meld.t = setTimeout(() => melding.classList.remove("zichtbaar"), 2500);
  }
  const blokkeer = (e) => { e.preventDefault(); st.getypt.geblokkeerd++; bewaar(); meld("Kopiëren en plakken kan hier niet. Typ het zelf!"); };
  ["paste", "drop", "copy", "cut"].forEach((ev) => document.addEventListener(ev, blokkeer, true));
  document.addEventListener("dragstart", (e) => e.preventDefault(), true);
  document.addEventListener("contextmenu", (e) => e.preventDefault(), true);
  document.addEventListener("beforeinput", (e) => { if (/^insertFrom(Paste|Drop|Yank)/.test(e.inputType || "")) blokkeer(e); }, true);
  const lengtes = new WeakMap();
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!el.matches || !el.matches("input[type=text], textarea")) return;
    const oud = lengtes.get(el) ?? 0, nieuw = el.value.length;
    if (nieuw - oud > 12 && !/^insert(Text|CompositionText)$/.test(e.inputType || "")) { st.getypt.verdacht++; bewaar(); }
    lengtes.set(el, nieuw);
  }, true);
  document.addEventListener("focusin", (e) => { if (e.target.matches && e.target.matches("input, textarea")) lengtes.set(e.target, e.target.value.length); });

  // ───────── Startscherm ─────────
  function toonStart() {
    duoLabel.textContent = "";
    app.innerHTML = `
      <div class="kaart">
        <h2>Welkom!</h2>
        <p>In 3 lessen maken jullie met z'n tweeën een klikbare quiz voor kleuters in PowerPoint. In de 4de les spelen jullie elkaars quiz en verbeteren jullie je eigen quiz. Alles wat je moet doen, staat hier stap voor stap uitgelegd.</p>
        <p>Werk de stappen in volgorde af. Op het einde van elke les leveren jullie je PowerPoint in. De computer kijkt het na en jullie krijgen meteen feedback.</p>
        <label for="klas">Klas</label>
        <input type="text" id="klas" value="${esc(st.klas)}" placeholder="bv. 3ZW" autocomplete="off">
        <div class="rij2">
          <div><label for="n1">Voornaam en naam leerling 1</label><input type="text" id="n1" value="${esc(st.namen[0])}" autocomplete="off"></div>
          <div><label for="n2">Voornaam en naam leerling 2</label><input type="text" id="n2" value="${esc(st.namen[1])}" autocomplete="off"></div>
        </div>
        <p style="margin-top:16px"><button id="start">Starten</button></p>
      </div>
      <div class="kaart">
        <h3>Al eerder gewerkt op een andere computer?</h3>
        <p class="klein-tekst">Open het rapport dat je vorige les gedownload hebt. Dan gaan jullie verder waar je gebleven was.</p>
        <input type="file" id="herstel" accept=".json,application/json">
      </div>`;
    document.getElementById("start").onclick = () => {
      st.klas = document.getElementById("klas").value.trim();
      st.namen = [document.getElementById("n1").value.trim(), document.getElementById("n2").value.trim()];
      if (!st.klas || !st.namen[0] || !st.namen[1]) { alert("Vul je klas en allebei jullie namen in."); return; }
      bewaar(); toonLes();
    };
    document.getElementById("herstel").onchange = herstel;
  }

  function herstel(ev) {
    const f = ev.target.files[0];
    if (!f) return;
    f.text().then((t) => {
      try { const s = JSON.parse(t); if (!s || s.versie !== 1) throw new Error(); st = aanvullen(s); bewaar(); toonLes(); }
      catch (e) { alert("Dit bestand is geen rapport van de kleuterquiz."); }
    });
  }

  // ───────── Lespagina ─────────
  const telKlaar = (les) => les.stappen.filter((s) => st.stappen[s.id] && st.stappen[s.id].klaar).length;
  const punten = (les) => les.stappen.reduce((t, s) => t + (st.auto[s.id]?.score ?? 0), 0);

  function toonLes() {
    duoLabel.textContent = `${st.klas} · ${st.namen[0]} & ${st.namen[1]}`;
    const les = LESSEN.find((l) => l.nr === st.les) || LESSEN[0];
    if (!openStap || !les.stappen.some((s) => s.id === openStap)) {
      const eerste = les.stappen.find((s) => !(st.stappen[s.id] && st.stappen[s.id].klaar));
      openStap = eerste ? eerste.id : null;
    }
    const klaar = telKlaar(les);
    const pct = Math.round((klaar / les.stappen.length) * 100);
    const nagekeken = les.stappen.some((s) => st.auto[s.id]);

    app.innerHTML = `
      <nav class="tabs" aria-label="Lessen">
        ${LESSEN.map((l) => `<button data-les="${l.nr}" class="${l.nr === les.nr ? "actief" : ""}">Les ${l.nr} <span class="mini">${telKlaar(l)}/${l.stappen.length}</span></button>`).join("")}
      </nav>
      <div class="kaart">
        <h2>Les ${les.nr}: ${esc(les.titel)}</h2>
        <p>${esc(les.intro)}</p>
        <div class="voortgang" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
        <div class="voortgang-tekst">${klaar} van ${les.stappen.length} stappen klaar${nagekeken ? ` · nagekeken: ${punten(les)} van ${les.stappen.length * 2} punten` : ""}</div>
        ${les.schema ? schemaSVG() : ""}
      </div>
      ${les.stappen.map((s, i) => stapHTML(s, i, les)).join("")}
      <div class="kaart geen-print">
        <h3>Rapport</h3>
        <p class="klein-tekst">Download op het einde van elke les jullie rapport en lever het in. Zo ziet je leerkracht jullie punten en feedback, en kunnen jullie volgende les verder werken, ook op een andere computer.</p>
        <div class="rapport-knoppen">
          <button id="download">Download ons rapport</button>
          ${INLEVERLINK ? `<a class="knop" href="${esc(INLEVERLINK)}" target="_blank" rel="noopener">Rapport inleveren</a>` : ""}
          <button class="tweede" id="opnieuw">Ander duo / opnieuw beginnen</button>
        </div>
      </div>`;

    app.querySelectorAll("[data-les]").forEach((b) => (b.onclick = () => { st.les = +b.dataset.les; openStap = null; bewaar(); toonLes(); window.scrollTo(0, 0); }));
    app.querySelectorAll(".stap-kop").forEach((k) => (k.onclick = () => { const id = k.parentElement.dataset.id; openStap = openStap === id ? null : id; toonLes(); }));
    les.stappen.forEach((s) => koppelStap(s, les));
    document.getElementById("download").onclick = download;
    document.getElementById("opnieuw").onclick = () => {
      if (confirm("Alles wissen op deze computer en opnieuw beginnen? Download eerst jullie rapport als je het nog nodig hebt.")) { st = leeg(); openStap = null; bewaar(); toonStart(); }
    };
    if (openStap) {
      const el = app.querySelector(`.stap[data-id="${CSS.escape(openStap)}"]`);
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function resultaatHTML(id) {
    const a = st.auto[id];
    if (!a) return "";
    const kleur = ["nul", "een", "twee"][a.score];
    return `<div class="resultaat r-${kleur}"><b>Nagekeken: ${a.score}/2</b>${a.zelf ? " (zelfcontrole)" : ""}<ul>${a.fb.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></div>`;
  }

  function stapHTML(s, i, les) {
    const info = stapInfo(s.id);
    const isOpen = openStap === s.id;
    const muis = st.namen[i % 2], naast = st.namen[(i + 1) % 2];
    const a = st.auto[s.id];
    return `
    <section class="kaart stap ${info.klaar ? "klaar" : ""} ${isOpen ? "open" : ""}" data-id="${s.id}">
      <div class="stap-kop" role="button" tabindex="0" aria-expanded="${isOpen}">
        <div class="stap-nr">${info.klaar ? "✓" : s.id}</div>
        <h3>${esc(s.titel)}</h3>
        ${s.nieuw ? '<span class="badge">Nieuw</span>' : ""}
        ${a ? `<span class="badge punt p${a.score}">${a.score}/2</span>` : info.klaar ? `<span class="badge ok">klaar ${tijd(info.klaar)}</span>` : ""}
      </div>
      <div class="stap-body">
        ${les.nr < 4 && s.type !== "inleveren" ? `<div class="rol">🖱️ Aan de muis: <b>${esc(muis)}</b> · 👀 Kijkt mee en leest voor: <b>${esc(naast)}</b></div>` : ""}
        <ol class="uitleg">${s.uitleg.map((u, j) => typeof u === "string" ? `<li>${u}</li>` : `<li>${u.t}${u.b && window.tekenBeeld ? window.tekenBeeld(u.b, s.id + "-" + (j + 1)) : ""}</li>`).join("")}</ol>
        ${s.voorbeeld ? `<div class="voorbeeld"><b>Voorbeeld:</b> ${esc(s.voorbeeld)}</div>` : ""}
        ${s.type === "thema" ? themaHTML() : ""}
        ${s.type === "vragen" ? vragenHTML() : ""}
        ${s.type === "waarom" ? waaromHTML() : ""}
        ${s.type === "inleveren" ? inleverHTML(s) : ""}
        ${s.type === "feedback" ? feedbackHTML(s.id) : ""}
        ${s.type === "reflectie" ? reflectieHTML() : ""}
        ${s.tip ? `<div class="tip"><b>Tip:</b> ${s.tip}</div>` : ""}
        <div class="criterium"><b>Zo wordt dit nagekeken (2 punten):</b> ${esc(s.criterium)}</div>
        ${s.type === "inleveren" ? "" : resultaatHTML(s.id)}
        <div class="checks">
          <b>Controleer jezelf:</b>
          ${s.check.map((c, j) => `<label><input type="checkbox" data-check="${j}" ${info.checks[j] ? "checked" : ""} ${info.klaar ? "disabled" : ""}> <span>${esc(c)}</span></label>`).join("")}
        </div>
        ${info.klaar
          ? `<button class="tweede klein" data-heropen>Toch nog iets aanpassen</button>`
          : `<button data-klaar>Stap klaar</button> <span class="klein-tekst" data-hint></span>`}
      </div>
    </section>`;
  }

  function themaHTML() {
    return `<div class="rij2"><div><label for="thema">Ons thema</label>
      <select id="thema"><option value="">Kies een thema …</option>
      ${THEMAS.map((t) => `<option ${st.thema === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></div>
      <div><label for="leeftijd">Leeftijd van de kleuters</label>
      <select id="leeftijd"><option value="">Kies een leeftijd …</option>
      ${Object.entries(NK.LEEFTIJDEN).map(([k, v]) => `<option value="${k}" ${String(st.leeftijd) === k ? "selected" : ""}>${esc(v.label)}</option>`).join("")}</select></div></div>`;
  }

  function vragenHTML() {
    const n = NK.LEEFTIJDEN[st.leeftijd];
    const regels = n ? `<div class="tip"><b>Voor kinderen van ${st.leeftijd} jaar:</b> een vraag heeft maximum ${n.vraagMax} woorden, een waarom-zin maximum ${n.waaromMax} woorden, en gebruik geen woorden langer dan ${n.letterMax} letters.</div>` : `<div class="tip">Kies eerst een leeftijd in stap 1.1.</div>`;
    return regels + st.vragen.map((v, i) => `
      <div class="vraag-blok">
        <label>Vraag ${i + 1}</label>
        <input type="text" data-v="${i}" data-k="vraag" value="${esc(v.vraag)}" maxlength="90" autocomplete="off" spellcheck="true">
        <div class="rij3">
          <div><label>Juist antwoord</label><input type="text" data-v="${i}" data-k="juist" value="${esc(v.juist)}" autocomplete="off"></div>
          <div><label>Fout antwoord 1</label><input type="text" data-v="${i}" data-k="fout1" value="${esc(v.fout1)}" autocomplete="off"></div>
          <div><label>Fout antwoord 2</label><input type="text" data-v="${i}" data-k="fout2" value="${esc(v.fout2)}" autocomplete="off"></div>
        </div>
        <label>Waarom is het juiste antwoord juist?</label>
        <input type="text" data-v="${i}" data-k="waarom" value="${esc(v.waarom)}" maxlength="140" autocomplete="off">
        <label>Plaats van de juiste prent</label>
        <select data-v="${i}" data-k="plaats">
          ${["", "links", "midden", "rechts"].map((p) => `<option value="${p}" ${v.plaats === p ? "selected" : ""}>${p || "Kies …"}</option>`).join("")}
        </select>
      </div>`).join("") + `<p><button class="tweede" data-controleer>Controleer onze vragen</button></p>`;
  }

  function waaromHTML() {
    return `<div class="voorbeeld"><b>Jullie waarom-zinnen:</b><ol>${st.vragen.map((v) => `<li>${esc(v.waarom) || "<i>nog niet ingevuld in stap 1.2</i>"}</li>`).join("")}</ol></div>`;
  }

  function inleverHTML(s) {
    const c = st.controles[s.les];
    const les = LESSEN.find((l) => l.nr === Math.min(s.les, 3));
    const ids = LESSEN.filter((l) => l.nr <= Math.min(s.les, 3)).flatMap((l) => l.stappen.map((x) => x.id));
    const rij = (id) => { const a = st.auto[id]; if (!a) return ""; const stp = LESSEN.flatMap((l) => l.stappen).find((x) => x.id === id); return `<tr><td><b>${id}</b> ${esc(stp.titel)}</td><td class="sc p${a.score}">${a.score}/2</td><td>${a.fb.map(esc).join("<br>")}</td></tr>`; };
    return `<div class="inleveren">
      <label class="knop" for="pptx-${s.id}">📂 Kies ons PowerPoint-bestand</label>
      <input type="file" id="pptx-${s.id}" data-pptx="${s.les}" accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation" hidden>
      <span class="klein-tekst" data-status></span>
      ${c ? `<p class="klein-tekst">Laatst nagekeken: ${tijd(c.datum)} · bestand: ${esc(c.bestand)} · ${c.dias} dia's</p>
        <div class="tabel-scroll"><table class="score"><tr><th>Stap</th><th>Punten</th><th>Feedback</th></tr>${(s.les === 4 ? ids : les.stappen.map((x) => x.id)).map(rij).join("")}${s.les === 4 ? rij("4.3") : ""}</table></div>` : ""}
    </div>`;
  }

  function feedbackHTML(id) {
    const f = st.feedback[id] || { duo: "", checks: [], top: "", tip: "" };
    return `<div class="vraag-blok">
      <label>Van welk duo was de quiz?</label>
      <input type="text" data-f="${id}" data-k="duo" value="${esc(f.duo)}" placeholder="Namen van het andere duo" autocomplete="off">
      <div class="checks">${FEEDBACK_VRAGEN.map((q, j) => `<label><input type="checkbox" data-f="${id}" data-fc="${j}" ${f.checks[j] ? "checked" : ""}> <span>${esc(q)}</span></label>`).join("")}</div>
      <label>Top: wat vonden jullie goed?</label>
      <textarea data-f="${id}" data-k="top">${esc(f.top)}</textarea>
      <label>Tip: wat kan beter?</label>
      <textarea data-f="${id}" data-k="tip">${esc(f.tip)}</textarea>
    </div>`;
  }

  function reflectieHTML() {
    return REFLECTIE_VRAGEN.map((q, i) => `<label>${esc(q)}</label><textarea data-r="${i}">${esc(st.reflectie[i])}</textarea>`).join("");
  }

  function velden(s) {
    if (s.type === "thema" && (!st.thema || !st.leeftijd)) return "Kies een thema en een leeftijd.";
    if (s.type === "vragen") {
      if (st.vragen.some((v) => !v.vraag.trim() || !v.juist.trim() || !v.fout1.trim() || !v.fout2.trim() || !v.waarom.trim() || !v.plaats)) return "Vul alle 5 de vragen volledig in, ook de waarom-zin.";
      if (!st.auto["1.2"]) return "Klik eerst op Controleer onze vragen.";
    }
    if (s.type === "inleveren" && !st.controles[s.les]) return "Kies eerst jullie PowerPoint-bestand om te laten nakijken.";
    if (s.type === "feedback") { const f = st.feedback[s.id]; if (!f || !f.duo.trim() || !f.top.trim() || !f.tip.trim()) return "Vul het duo, een top en een tip in."; }
    if (s.type === "reflectie" && st.reflectie.some((r) => !r.trim())) return "Beantwoord alle vragen.";
    return "";
  }

  // Score voor stappen die niet uit de PowerPoint komen, bij Stap klaar.
  function scoorBijKlaar(s) {
    if (s.type === "thema") st.auto[s.id] = { score: 2, fb: [`Thema: ${st.thema}, leeftijd: ${st.leeftijd} jaar.`] };
    else if (s.type === "vragen") st.auto[s.id] = NK.vragen(st);
    else if (s.type === "feedback") st.auto[s.id] = NK.feedback(st.feedback[s.id]);
    else if (s.type === "reflectie") st.auto[s.id] = NK.reflectie(st.reflectie);
    else if (s.zelf) st.auto[s.id] = { score: 2, fb: ["Jullie hebben deze stap zelf afgevinkt."], zelf: true };
  }

  async function nakijken(input, s) {
    const f = input.files[0];
    if (!f) return;
    const status = input.parentElement.querySelector("[data-status]");
    status.textContent = "Even geduld, de computer kijkt jullie quiz na …";
    try {
      const vorigTotaal = st.controles[3] ? st.controles[3].totaal : null;
      const res = await NK.pptx(await f.arrayBuffer(), f.name, st, s.les);
      Object.entries(res.stappen).forEach(([id, r]) => (st.auto[id] = r));
      st.auto["1.2"] = NK.vragen(st);
      const totaal = Object.entries(st.auto).filter(([id]) => +id.split(".")[0] <= 3).reduce((t, [, a]) => t + a.score, 0);
      if (s.les === 4) st.auto["4.3"] = vorigTotaal === null ? { score: 1, fb: ["Er is geen inzending van les 3 om mee te vergelijken."] } : totaal >= vorigTotaal ? { score: 2, fb: [`Opnieuw nagekeken: ${totaal} punten voor les 1 tot 3 (eerst ${vorigTotaal}).`] } : { score: 1, fb: [`Opnieuw nagekeken: ${totaal} punten, minder dan bij les 3 (${vorigTotaal}). Kijk de feedback na.`] };
      st.controles[s.les] = { datum: new Date().toISOString(), bestand: f.name, dias: res.dias, totaal };
      bewaar(); toonLes();
    } catch (e) {
      status.textContent = "Dit bestand kan ik niet openen. Kies jullie .pptx-bestand (niet een snelkoppeling of een ander bestand).";
    }
  }

  function koppelStap(s) {
    const el = app.querySelector(`.stap[data-id="${CSS.escape(s.id)}"]`);
    if (!el || !el.classList.contains("open")) return;
    const info = stapInfo(s.id);
    el.querySelectorAll("[data-check]").forEach((c) => (c.onchange = () => { info.checks[+c.dataset.check] = c.checked; bewaar(); }));
    const thema = el.querySelector("#thema"), lft = el.querySelector("#leeftijd");
    if (thema) thema.onchange = () => { st.thema = thema.value; bewaar(); };
    if (lft) lft.onchange = () => { st.leeftijd = lft.value ? +lft.value : ""; bewaar(); };
    el.querySelectorAll("[data-v]").forEach((inp) => (inp.oninput = inp.onchange = () => { st.vragen[+inp.dataset.v][inp.dataset.k] = inp.value; bewaar(); }));
    const ctrl = el.querySelector("[data-controleer]");
    if (ctrl) ctrl.onclick = () => { st.auto["1.2"] = NK.vragen(st); bewaar(); toonLes(); };
    const pp = el.querySelector("[data-pptx]");
    if (pp) pp.onchange = () => nakijken(pp, s);
    el.querySelectorAll("[data-f]").forEach((inp) => {
      const id = inp.dataset.f;
      inp.oninput = inp.onchange = () => {
        const f = (st.feedback[id] = st.feedback[id] || { duo: "", checks: [], top: "", tip: "" });
        if (inp.dataset.fc !== undefined) f.checks[+inp.dataset.fc] = inp.checked; else f[inp.dataset.k] = inp.value;
        bewaar();
      };
    });
    el.querySelectorAll("[data-r]").forEach((t) => (t.oninput = () => { st.reflectie[+t.dataset.r] = t.value; bewaar(); }));

    const knop = el.querySelector("[data-klaar]");
    if (knop) knop.onclick = () => {
      const hint = el.querySelector("[data-hint]");
      const probleem = velden(s);
      if (probleem) { hint.textContent = probleem; return; }
      if (s.check.some((_, j) => !info.checks[j])) { hint.textContent = "Vink eerst alles aan bij \"Controleer jezelf\"."; return; }
      scoorBijKlaar(s);
      info.klaar = new Date().toISOString();
      bewaar();
      const les = LESSEN.find((l) => l.nr === st.les);
      const volgende = les.stappen.find((x) => !(st.stappen[x.id] && st.stappen[x.id].klaar));
      openStap = volgende ? volgende.id : null;
      toonLes();
      if (!volgende) setTimeout(() => alert(`Les ${les.nr} is klaar! Download nu jullie rapport en lever het in.`), 50);
    };
    const her = el.querySelector("[data-heropen]");
    if (her) her.onclick = () => { info.klaar = null; bewaar(); toonLes(); };
  }

  function download() {
    st.gedownload = new Date().toISOString();
    st.controlecode = NK.code(st);
    bewaar();
    const naam = `${st.klas}_Kleuterquiz_rapport_${st.namen[0]}_${st.namen[1]}`.replace(/[^\wÀ-ÿ-]+/g, "_");
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = naam + ".json";
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function schemaSVG() {
    const box = (x, y, w, t, kleur) => `<g><rect x="${x}" y="${y}" width="${w}" height="44" rx="10" fill="${kleur}" stroke="#2b2b33" stroke-opacity=".15"/><text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-size="15" font-weight="600" fill="#2b2b33">${t}</text></g>`;
    const pijl = (x1, y1, x2, y2, t, tx, ty) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6b6b78" stroke-width="2" marker-end="url(#pk)"/>${t ? `<text x="${tx}" y="${ty}" font-size="13" fill="#6b6b78" text-anchor="middle">${t}</text>` : ""}`;
    return `<p style="margin-bottom:4px"><b>Zo werkt jullie quiz:</b></p>
    <svg class="schema" viewBox="0 0 760 200" role="img" aria-label="Schema: vraag, juiste prent naar Goed zo, Verder naar volgende vraag; foute prent naar Oei, Nog eens terug naar de vraag">
      <defs><marker id="pk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6b6b78"/></marker></defs>
      ${box(60, 20, 120, "Vraag 1", "#fdebd9")}
      ${box(320, 20, 140, "Goed zo! 1", "#e3f4e8")}
      ${box(610, 20, 140, "Vraag 2 …", "#fdebd9")}
      ${box(60, 150, 120, "Oei!", "#fff0d6")}
      ${pijl(180, 42, 316, 42, "juiste prent", 248, 34)}
      ${pijl(460, 42, 606, 42, "pijl Verder", 533, 34)}
      ${pijl(95, 64, 95, 146, "", 0, 0)}
      ${pijl(145, 150, 145, 68, "", 0, 0)}
      <text x="88" y="112" font-size="13" fill="#6b6b78" text-anchor="end">foute prent</text>
      <text x="152" y="112" font-size="13" fill="#6b6b78">pijl Nog eens</text>
    </svg>`;
  }

  if (st.klas && st.namen[0] && st.namen[1]) toonLes(); else toonStart();
})();
