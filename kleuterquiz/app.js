// Leerlingenpagina: stap-voor-stap lessen, voortgang en rapport.
(function () {
  const OPSLAG = "kleuterquiz-leerling-v1";
  const app = document.getElementById("app");
  const duoLabel = document.getElementById("duo-label");

  function leeg() {
    return {
      versie: 1,
      klas: "",
      namen: ["", ""],
      thema: "",
      vragen: Array.from({ length: 5 }, () => ({ vraag: "", juist: "", fout1: "", fout2: "", plaats: "" })),
      stappen: {},
      feedback: {},
      reflectie: REFLECTIE_VRAGEN.map(() => ""),
      les: 1,
    };
  }

  function laad() {
    try {
      const s = JSON.parse(localStorage.getItem(OPSLAG));
      if (s && s.versie === 1) return Object.assign(leeg(), s);
    } catch (e) {}
    return leeg();
  }
  let st = laad();
  let openStap = null;

  function bewaar() {
    try { localStorage.setItem(OPSLAG, JSON.stringify(st)); } catch (e) {}
  }

  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tijd = (iso) => new Date(iso).toLocaleString("nl-BE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

  function stapInfo(id) {
    if (!st.stappen[id]) st.stappen[id] = { checks: [], klaar: null };
    return st.stappen[id];
  }

  // ───────── Startscherm ─────────
  function toonStart() {
    duoLabel.textContent = "";
    app.innerHTML = `
      <div class="kaart">
        <h2>Welkom!</h2>
        <p>In 3 lessen maken jullie met z'n tweeën een klikbare quiz voor kleuters in PowerPoint. In de 4de les spelen jullie elkaars quiz. Alles wat je moet doen, staat hier stap voor stap uitgelegd.</p>
        <p>Werk de stappen in volgorde af. Bij elke stap zie je hoe je leerkracht ze nakijkt. Vink pas iets aan als het echt klaar is.</p>
        <label for="klas">Klas</label>
        <input type="text" id="klas" value="${esc(st.klas)}" placeholder="bv. 3ZW">
        <div class="rij2">
          <div><label for="n1">Voornaam en naam leerling 1</label><input type="text" id="n1" value="${esc(st.namen[0])}"></div>
          <div><label for="n2">Voornaam en naam leerling 2</label><input type="text" id="n2" value="${esc(st.namen[1])}"></div>
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
      bewaar();
      toonLes();
    };
    document.getElementById("herstel").onchange = herstel;
  }

  function herstel(ev) {
    const f = ev.target.files[0];
    if (!f) return;
    f.text().then((t) => {
      try {
        const s = JSON.parse(t);
        if (!s || s.versie !== 1) throw new Error();
        st = Object.assign(leeg(), s);
        bewaar();
        toonLes();
      } catch (e) {
        alert("Dit bestand is geen rapport van de kleuterquiz.");
      }
    });
  }

  // ───────── Lespagina ─────────
  function telKlaar(les) {
    return les.stappen.filter((s) => st.stappen[s.id] && st.stappen[s.id].klaar).length;
  }

  function toonLes() {
    duoLabel.textContent = `${st.klas} · ${st.namen[0]} & ${st.namen[1]}`;
    const les = LESSEN.find((l) => l.nr === st.les) || LESSEN[0];
    if (!openStap || !les.stappen.some((s) => s.id === openStap)) {
      const eerste = les.stappen.find((s) => !(st.stappen[s.id] && st.stappen[s.id].klaar));
      openStap = eerste ? eerste.id : null;
    }
    const klaar = telKlaar(les);
    const pct = Math.round((klaar / les.stappen.length) * 100);

    app.innerHTML = `
      <nav class="tabs" aria-label="Lessen">
        ${LESSEN.map((l) => `<button data-les="${l.nr}" class="${l.nr === les.nr ? "actief" : ""}">Les ${l.nr} <span class="mini">${telKlaar(l)}/${l.stappen.length}</span></button>`).join("")}
      </nav>
      <div class="kaart">
        <h2>Les ${les.nr}: ${esc(les.titel)}</h2>
        <p>${esc(les.intro)}</p>
        <div class="voortgang" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>
        <div class="voortgang-tekst">${klaar} van ${les.stappen.length} stappen klaar</div>
        ${les.schema ? schemaSVG() : ""}
      </div>
      ${les.stappen.map((s, i) => stapHTML(s, i, les)).join("")}
      <div class="kaart geen-print">
        <h3>Rapport</h3>
        <p class="klein-tekst">Download op het einde van elke les jullie rapport en bewaar het op OneDrive. Zo kan je leerkracht zien welke stappen jullie gedaan hebben, en kunnen jullie volgende les verder werken, ook op een andere computer.</p>
        <div class="rapport-knoppen">
          <button id="download">Download ons rapport</button>
          <button class="tweede" id="opnieuw">Ander duo / opnieuw beginnen</button>
        </div>
      </div>`;

    app.querySelectorAll("[data-les]").forEach((b) => (b.onclick = () => { st.les = +b.dataset.les; openStap = null; bewaar(); toonLes(); window.scrollTo(0, 0); }));
    app.querySelectorAll(".stap-kop").forEach((k) => (k.onclick = () => { const id = k.parentElement.dataset.id; openStap = openStap === id ? null : id; toonLes(); }));
    les.stappen.forEach((s) => koppelStap(s));
    document.getElementById("download").onclick = download;
    document.getElementById("opnieuw").onclick = () => {
      if (confirm("Alles wissen op deze computer en opnieuw beginnen? Download eerst jullie rapport als je het nog nodig hebt.")) {
        st = leeg(); openStap = null; bewaar(); toonStart();
      }
    };
    if (openStap) {
      const el = app.querySelector(`.stap[data-id="${CSS.escape(openStap)}"]`);
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function stapHTML(s, i, les) {
    const info = stapInfo(s.id);
    const isOpen = openStap === s.id;
    const muis = st.namen[i % 2], naast = st.namen[(i + 1) % 2];
    return `
    <section class="kaart stap ${info.klaar ? "klaar" : ""} ${isOpen ? "open" : ""}" data-id="${s.id}">
      <div class="stap-kop" role="button" tabindex="0" aria-expanded="${isOpen}">
        <div class="stap-nr">${info.klaar ? "✓" : s.id}</div>
        <h3>${esc(s.titel)}</h3>
        ${s.nieuw ? '<span class="badge">Nieuw</span>' : ""}
        ${info.klaar ? `<span class="badge ok">klaar ${tijd(info.klaar)}</span>` : ""}
      </div>
      <div class="stap-body">
        ${les.nr < 4 ? `<div class="rol">🖱️ Aan de muis: <b>${esc(muis)}</b> · 👀 Kijkt mee en leest voor: <b>${esc(naast)}</b></div>` : ""}
        <ol class="uitleg">${s.uitleg.map((u, j) => typeof u === "string" ? `<li>${u}</li>` : `<li>${u.t}${u.b && window.tekenBeeld ? window.tekenBeeld(u.b, s.id + "-" + (j + 1)) : ""}</li>`).join("")}</ol>
        ${s.voorbeeld ? `<div class="voorbeeld"><b>Voorbeeld:</b> ${esc(s.voorbeeld)}</div>` : ""}
        ${s.type === "thema" ? themaHTML() : ""}
        ${s.type === "vragen" ? vragenHTML() : ""}
        ${s.type === "feedback" ? feedbackHTML(s.id) : ""}
        ${s.type === "reflectie" ? reflectieHTML() : ""}
        ${s.tip ? `<div class="tip"><b>Tip:</b> ${s.tip}</div>` : ""}
        <div class="criterium"><b>Zo kijkt je leerkracht dit na (2 punten):</b> ${esc(s.criterium)}</div>
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
    return `<label for="thema">Ons thema</label>
      <select id="thema"><option value="">Kies een thema …</option>
      ${THEMAS.map((t) => `<option ${st.thema === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>`;
  }

  function vragenHTML() {
    return st.vragen.map((v, i) => `
      <div class="vraag-blok">
        <label>Vraag ${i + 1}</label>
        <input type="text" data-v="${i}" data-k="vraag" value="${esc(v.vraag)}" maxlength="80" placeholder="Korte vraag, max. 8 woorden">
        <div class="rij3">
          <div><label>Juist antwoord</label><input type="text" data-v="${i}" data-k="juist" value="${esc(v.juist)}"></div>
          <div><label>Fout antwoord 1</label><input type="text" data-v="${i}" data-k="fout1" value="${esc(v.fout1)}"></div>
          <div><label>Fout antwoord 2</label><input type="text" data-v="${i}" data-k="fout2" value="${esc(v.fout2)}"></div>
        </div>
        <label>Plaats van de juiste prent</label>
        <select data-v="${i}" data-k="plaats">
          ${["", "links", "midden", "rechts"].map((p) => `<option value="${p}" ${v.plaats === p ? "selected" : ""}>${p || "Kies …"}</option>`).join("")}
        </select>
      </div>`).join("");
  }

  function feedbackHTML(id) {
    const f = st.feedback[id] || { duo: "", checks: [], top: "", tip: "" };
    return `<div class="vraag-blok">
      <label>Van welk duo was de quiz?</label>
      <input type="text" data-f="${id}" data-k="duo" value="${esc(f.duo)}" placeholder="Namen van het andere duo">
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
    // Wat moet ingevuld zijn voor een stap klaar mag?
    if (s.type === "thema" && !st.thema) return "Kies eerst een thema.";
    if (s.type === "vragen") {
      const leeg = st.vragen.some((v) => !v.vraag.trim() || !v.juist.trim() || !v.fout1.trim() || !v.fout2.trim() || !v.plaats);
      if (leeg) return "Vul alle 5 de vragen volledig in.";
    }
    if (s.type === "feedback") {
      const f = st.feedback[s.id];
      if (!f || !f.duo.trim() || !f.top.trim() || !f.tip.trim()) return "Vul het duo, een top en een tip in.";
    }
    if (s.type === "reflectie" && st.reflectie.some((r) => !r.trim())) return "Beantwoord alle vragen.";
    return "";
  }

  function koppelStap(s) {
    const el = app.querySelector(`.stap[data-id="${CSS.escape(s.id)}"]`);
    if (!el || !el.classList.contains("open")) return;
    const info = stapInfo(s.id);

    el.querySelectorAll("[data-check]").forEach((c) => (c.onchange = () => { info.checks[+c.dataset.check] = c.checked; bewaar(); }));
    const thema = el.querySelector("#thema");
    if (thema) thema.onchange = () => { st.thema = thema.value; bewaar(); };
    el.querySelectorAll("[data-v]").forEach((inp) => (inp.oninput = inp.onchange = () => { st.vragen[+inp.dataset.v][inp.dataset.k] = inp.value; bewaar(); }));
    el.querySelectorAll("[data-f]").forEach((inp) => {
      const id = inp.dataset.f;
      inp.oninput = inp.onchange = () => {
        const f = (st.feedback[id] = st.feedback[id] || { duo: "", checks: [], top: "", tip: "" });
        if (inp.dataset.fc !== undefined) f.checks[+inp.dataset.fc] = inp.checked;
        else f[inp.dataset.k] = inp.value;
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
      info.klaar = new Date().toISOString();
      bewaar();
      const les = LESSEN.find((l) => l.nr === st.les);
      const volgende = les.stappen.find((x) => !(st.stappen[x.id] && st.stappen[x.id].klaar));
      openStap = volgende ? volgende.id : null;
      toonLes();
      if (!volgende) setTimeout(() => alert(`Les ${les.nr} is klaar! Download nu jullie rapport.`), 50);
    };
    const her = el.querySelector("[data-heropen]");
    if (her) her.onclick = () => { info.klaar = null; bewaar(); toonLes(); };
  }

  function download() {
    st.gedownload = new Date().toISOString();
    bewaar();
    const naam = `${st.klas}_Kleuterquiz_rapport_${st.namen[0]}_${st.namen[1]}`.replace(/[^\wÀ-ÿ-]+/g, "_");
    const blob = new Blob([JSON.stringify(st, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = naam + ".json";
    document.body.appendChild(a);
    a.click();
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
