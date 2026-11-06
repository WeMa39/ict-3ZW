// Tekent nagebootste schermbeelden van PowerPoint bij de stappen.
// Een rood kader met een nummer toont waar je moet klikken.
// Echte schermafdruk beschikbaar? Zet ze in de map img/ met de naam die onder het beeld
// vermeld staat (bv. img/1.5-a.png). Dan toont de site automatisch jouw schermafdruk.
(function () {
  const esc = (t) => String(t ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const acc = (n) => (n ? ` acc" data-n="${n}` : "");

  const TABS = ["Bestand", "Start", "Invoegen", "Tekenen", "Ontwerpen", "Overgangen", "Animaties", "Diavoorstelling", "Controleren", "Beeld"];

  function titelbalk(s) {
    const a = s.acc || {};
    return `<div class="pp-titel">
      <span class="pp-auto${acc(a.autosave)}">Automatisch opslaan <span class="pp-switch"></span></span>
      <span class="pp-naam">${esc(s.bestand || "klas_Kleuterquiz_thema_voornaam1_voornaam2")} • Opgeslagen in OneDrive</span>
      <span class="pp-delen${acc(a.delen)}">Delen</span>
    </div>`;
  }

  function knop(k) {
    if (k.soort === "veld") return `<span class="pp-veld${acc(k.acc)}"${k.w ? ` style="width:${k.w}px"` : ""}>${k.label ? `<small>${esc(k.label)}</small> ` : ""}${esc(k.l)} <span class="pp-pijl">▾</span></span>`;
    if (k.soort === "check") return `<span class="pp-check${acc(k.acc)}"><span class="pp-vak">${k.aan ? "✓" : ""}</span>${esc(k.l)}</span>`;
    if (k.soort === "duim") return `<span class="pp-duim${acc(k.acc)}"><span style="${k.stijl || ""}">${esc(k.i ?? "Aa")}</span>${k.l ? `<small>${esc(k.l)}</small>` : ""}</span>`;
    return `<span class="pp-knop ${k.klein ? "klein" : ""}${acc(k.acc)}">${k.i ? `<span class="pp-ico">${k.i}</span>` : ""}<span>${esc(k.l)}${k.menu ? " ▾" : ""}</span></span>`;
  }

  function lint(s) {
    return `${s.titelbalk === false ? "" : titelbalk(s)}
      <div class="pp-tabs">${(s.tabs || TABS).map((t) => `<span class="${t === s.tab ? "aan" : ""}${t === s.tab && s.tabAcc ? acc(s.tabAcc) : ""}">${esc(t)}</span>`).join("")}</div>
      <div class="pp-lint">${s.groepen.map((g) => `<div class="pp-groep"><div class="pp-knoppen ${g.rij ? "rij" : ""}">${g.knoppen.map(knop).join("")}</div><div class="pp-gnaam">${esc(g.naam)}</div></div>`).join("")}</div>`;
  }

  function menu(s) {
    return `<div class="pp-menu">${s.kop ? `<div class="pp-mkop">${esc(s.kop)}</div>` : ""}${s.items
      .map((it) => {
        if (it === "-") return `<div class="pp-sep"></div>`;
        const o = typeof it === "string" ? { l: it } : it;
        return `<div class="pp-mitem${o.acc ? acc(o.acc) : ""}${o.zacht ? " zacht" : ""}"><span class="pp-ico">${o.i || ""}</span>${esc(o.l)}${o.sub ? '<span class="pp-sub">▸</span>' : ""}</div>`;
      })
      .join("")}</div>`;
  }

  function indelingen(s) {
    const namen = ["Titeldia", "Titel en object", "Sectiekop", "Twee objecten", "Vergelijking", "Alleen titel", "Leeg", "Inhoud met bijschrift", "Afbeelding met bijschrift"];
    const vorm = { "Titeldia": "t", "Titel en object": "to", "Alleen titel": "ot", "Leeg": "l" };
    return `<div class="pp-menu breed"><div class="pp-mkop">${esc(s.kop || "Kantoorthema")}</div><div class="pp-indel">${namen
      .map((n) => `<div class="pp-ind${n === s.kies ? acc(s.acc || 1) : ""}"><div class="pp-indvb v-${vorm[n] || "x"}"><i></i><b></b></div><small>${esc(n)}</small></div>`)
      .join("")}</div></div>`;
  }

  function venster(s) {
    const links = s.links ? `<div class="pp-vlinks">${s.linksKop ? `<small>${esc(s.linksKop)}</small>` : ""}${s.links.map((l) => `<div class="${l.aan ? "aan" : ""}${acc(l.acc)}">${esc(l.l)}</div>`).join("")}</div>` : "";
    const lijst = s.lijst ? `<div class="pp-vlijst">${s.lijstKop ? `<small>${esc(s.lijstKop)}</small>` : ""}<div class="pp-vbox">${s.lijst.map((l) => `<div class="${l.in ? "in" : ""} ${l.aan ? "aan" : ""}${acc(l.acc)}">${esc(l.l)}</div>`).join("")}</div></div>` : "";
    const velden = (s.velden || []).map((v) => {
      if (v.radio !== undefined) return `<div class="pp-radio${acc(v.acc)}"><span class="pp-rond ${v.radio ? "aan" : ""}"></span>${esc(v.l)}</div>`;
      if (v.check !== undefined) return `<div class="pp-check${acc(v.acc)}"><span class="pp-vak">${v.check ? "✓" : ""}</span>${esc(v.l)}</div>`;
      if (v.html) return v.html;
      return `<div class="pp-vrij"><small>${esc(v.label || "")}</small><span class="pp-invul${acc(v.acc)}">${esc(v.l || "")}${v.menu ? ' <span class="pp-pijl">▾</span>' : ""}</span></div>`;
    }).join("");
    const knoppen = (s.knoppen || ["OK", "Annuleren"]).map((k) => {
      const o = typeof k === "string" ? { l: k } : k;
      return `<span class="pp-vknop ${o.l === "OK" || o.hoofd ? "hoofd" : ""}${acc(o.acc)}">${esc(o.l)}</span>`;
    }).join("");
    return `<div class="pp-venster"><div class="pp-vtitel">${esc(s.titel)}<span>✕</span></div>
      <div class="pp-vinhoud">${velden ? `<div class="pp-velden">${velden}</div>` : ""}${links || lijst ? `<div class="pp-vrij2">${links}${lijst}</div>` : ""}${s.extra || ""}</div>
      <div class="pp-vknoppen">${knoppen}</div></div>`;
  }

  function backstage(s) {
    const items = ["Start", "Nieuw", "Openen", "-", "Info", "Opslaan", "Opslaan als", "Afdrukken", "Delen", "Exporteren", "Sluiten"];
    return `<div class="pp-back"><div class="pp-bmenu"><div class="pp-terug">←</div>${items
      .map((i) => (i === "-" ? `<div class="pp-sep"></div>` : `<div class="${i === s.kies ? "aan" : ""}${i === s.kies ? acc(s.acc || 1) : ""}">${esc(i)}</div>`))
      .join("")}</div><div class="pp-binhoud"><h4>${esc(s.kies)}</h4>${s.inhoud || ""}</div></div>`;
  }

  function start(s) {
    return `<div class="pp-start"><div class="pp-slogo">P</div><div><h4>Goedemiddag</h4>
      <div class="pp-tegels"><div class="pp-tegel${acc(s.acc || 1)}"><div class="pp-tvb"></div><small>Lege presentatie</small></div>
      <div class="pp-tegel"><div class="pp-tvb kleur"></div><small>Rondleiding</small></div>
      <div class="pp-tegel"><div class="pp-tvb kleur2"></div><small>Hout</small></div></div></div></div>`;
  }

  function dia(s) {
    const prenten = (s.prenten || []).map((p, i) => `<span class="pp-prent${s.prentAcc && s.prentAcc[i] ? acc(s.prentAcc[i]) : ""}${s.selectie ? " sel" : ""}">${p}</span>`).join("");
    return `<div class="pp-diawrap"><div class="pp-dia" style="${s.achtergrond ? "background:" + s.achtergrond : ""}">
      ${s.titel ? `<div class="pp-dtitel${acc(s.titelAcc)}" style="${s.titelStijl || ""}">${esc(s.titel)}</div>` : ""}
      ${s.onder ? `<div class="pp-donder${acc(s.onderAcc)}">${esc(s.onder)}</div>` : ""}
      ${s.lijst ? `<ul class="pp-dlijst">${s.lijst.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>` : ""}
      ${prenten ? `<div class="pp-prenten">${prenten}</div>` : ""}
      ${s.vorm ? `<span class="pp-vorm ${s.vorm.soort || ""}${acc(s.vorm.acc)}" style="${s.vorm.stijl || ""}">${esc(s.vorm.l)}</span>` : ""}
      ${s.luid ? `<span class="pp-luid${acc(s.luidAcc)}">🔊</span>` : ""}
    </div>${s.notities !== undefined ? `<div class="pp-notities${acc(s.notAcc)}"><small>Notities</small> ${esc(s.notities)}</div>` : ""}</div>`;
  }

  function overzicht(s) {
    return `<div class="pp-overzicht">${s.dias
      .map((d, i) => `<div class="pp-thumb ${d.k || ""}${acc(d.acc)}"><small>${i + 1}</small><span>${esc(d.t)}</span></div>`)
      .join("")}</div>`;
  }

  function statusbalk(s) {
    return `<div class="pp-status"><span>Dia 3 van 14</span><span>Nederlands (België)</span><span class="rechts"><span class="${s.acc ? "acc" : ""}" style="padding:0 4px" ${s.acc ? `data-n="${s.acc}"` : ""}>≡ Notities</span><span>▦</span><span>▤</span><span>▶</span><span>— 70% +</span></span></div>`;
  }

  function deelvenster(s) {
    return `<div class="pp-deel"><div class="pp-vtitel">${esc(s.titel)}<span>✕</span></div><div class="pp-deelinh">${s.inhoud}</div></div>`;
  }

  const TEKEN = { lint, menu, indelingen, venster, backstage, start, dia, overzicht, statusbalk, deelvenster, titelbalk: (s) => titelbalk(s) };

  function scherm(s) {
    const delen = (Array.isArray(s.delen) ? s.delen : [s]).map((d) => (TEKEN[d.type] || (() => ""))(d)).join("");
    return `<div class="pp-scherm ${s.smal ? "smal" : ""}">${delen}</div>`;
  }

  // Publieke functie: één beeld met eventueel een echte schermafdruk.
  window.tekenBeeld = function (b, naam) {
    const bestand = `img/${naam}.png`;
    return `<figure class="beeld">
      <img src="${bestand}" alt="${esc(b.uitleg || "")}" loading="lazy" onload="this.nextElementSibling.remove()" onerror="this.remove()">
      <div class="nagebootst" role="img" aria-label="${esc(b.uitleg || "")}">${scherm(b)}</div>
      ${b.uitleg ? `<figcaption>${b.uitleg}</figcaption>` : ""}
    </figure>`;
  };
})();
