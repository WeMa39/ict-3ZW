// Inhoud van de leeromgeving. Elke stap wordt beoordeeld op 2 punten:
// 0 = niet gedaan, 1 = gedaan maar niet helemaal correct, 2 = correct.
// Een uitleg-regel is ofwel tekst, ofwel { t: "tekst", b: beeld }.
// Beelden zijn nagebootste PowerPoint-schermen (zie beelden.js). Een rood kader met
// een nummer duidt aan waar de leerling moet klikken.

const THEMAS = [
  "Handjes wassen",
  "Tanden poetsen",
  "Een gezond tienuurtje",
  "Hoesten en niezen",
  "Veilig oversteken",
  "Zon en drinken in de zomer",
  "Warm aankleden in de winter",
  "Afval sorteren",
];

// ───────── Bouwstenen voor de beelden ─────────
const K = (l, i, acc, extra) => Object.assign({ l, i, acc }, extra || {});
const KK = (l, i, acc, extra) => Object.assign({ l, i, acc, klein: true }, extra || {});
const VELD = (l, acc, extra) => Object.assign({ soort: "veld", l, acc }, extra || {});
const CHECK = (l, acc, aan) => ({ soort: "check", l, acc, aan });
const DUIM = (l, i, acc, stijl) => ({ soort: "duim", l, i, acc, stijl });
const G = (naam, knoppen, rij) => ({ naam, knoppen, rij });
const LINT = (tab, groepen, extra) => Object.assign({ type: "lint", tab, groepen }, extra || {});
const TABS_AFB = ["Bestand", "Start", "Invoegen", "Ontwerpen", "Overgangen", "Animaties", "Diavoorstelling", "Beeld", "Afbeeldingsopmaak"];
const TABS_VORM = ["Bestand", "Start", "Invoegen", "Ontwerpen", "Overgangen", "Animaties", "Diavoorstelling", "Beeld", "Vormopmaak"];
const TABS_AUDIO = ["Bestand", "Start", "Invoegen", "Ontwerpen", "Animaties", "Diavoorstelling", "Audio-opmaak", "Afspelen"];

const START_DIAS = G("Dia's", [K("Nieuwe dia", "🗔", 0, { menu: true }), KK("Indeling", "▦"), KK("Opnieuw instellen", "↺")]);
const START_LETTER = (a1, a2) => G("Lettertype", [VELD("Century Gothic", a1, { w: 120 }), VELD("54", a2), KK("B", "", 0), KK("I", "", 0), KK("U", "", 0)]);

const INVOEGEN = (accs) => {
  const a = accs || {};
  return LINT("Invoegen", [
    G("Dia's", [K("Nieuwe dia", "🗔")]),
    G("Afbeeldingen", [K("Afbeeldingen", "🖼️", a.afb, { menu: true })]),
    G("Illustraties", [K("Vormen", "🔷", a.vormen, { menu: true }), K("Pictogrammen", "☺")]),
    G("Koppelingen", [K("Koppeling", "🔗", a.koppeling), K("Actie", "⭐", a.actie)]),
    G("Tekst", [K("Tekstvak", "🅰")]),
    G("Media", [K("Video", "🎬", 0, { menu: true }), K("Audio", "🔊", a.audio, { menu: true })]),
  ]);
};

const KOPPEL_DIAS = [
  "1. Handjes wassen, hoe doe jij dat?",
  "2. Hoe speel je?",
  "3. Wanneer was je je handen?",
  "4. Goed zo!",
  "5. Waarmee was je je handen?",
  "6. Goed zo!",
  "…",
  "13. Oei, probeer nog eens!",
  "14. Bravo!",
];
const KOPPELVENSTER = (kies, acc) => ({
  type: "venster",
  titel: "Hyperlink invoegen",
  linksKop: "Koppelen aan:",
  links: [{ l: "Bestaand bestand of webpagina" }, { l: "Plaats in dit document", aan: true, acc: acc ? acc[0] : 0 }, { l: "Nieuw document maken" }, { l: "E-mailadres" }],
  lijstKop: "Selecteer een plaats in dit document:",
  lijst: [{ l: "Eerste dia" }, { l: "Laatste dia" }, { l: "Volgende dia" }, { l: "Vorige dia" }, { l: "▾ Diatitels" }].concat(
    KOPPEL_DIAS.map((d) => ({ l: d, in: true, aan: d === kies, acc: d === kies && acc ? acc[1] : 0 }))
  ),
  knoppen: [{ l: "OK", acc: acc ? acc[2] : 0 }, "Annuleren"],
});

const QUIZ_DIAS = [
  { t: "Titel", k: "titel" }, { t: "Hoe speel je?", k: "titel" },
  { t: "Vraag 1", k: "vraag" }, { t: "Goed zo!", k: "goed" },
  { t: "Vraag 2", k: "vraag" }, { t: "Goed zo!", k: "goed" },
  { t: "Vraag 3", k: "vraag" }, { t: "Goed zo!", k: "goed" },
  { t: "Vraag 4", k: "vraag" }, { t: "Goed zo!", k: "goed" },
  { t: "Vraag 5", k: "vraag" }, { t: "Goed zo!", k: "goed" },
  { t: "Oei!", k: "oei" }, { t: "Bravo!", k: "titel" },
];

const LESSEN = [
  // ───────────────────────────── LES 1 ─────────────────────────────
  {
    nr: 1,
    titel: "Start: thema, vragen en je eerste dia's",
    intro:
      "Jullie maken samen een klikbare quiz voor kleuters. Kleuters kunnen niet lezen, dus elke vraag krijgt 3 grote prenten. Een kleuter tikt een prent aan: juist geeft een feestje, fout zegt \"probeer nog eens\". Vandaag bedenken jullie de vragen en maken jullie de eerste dia's.",
    stappen: [
      {
        id: "1.1",
        titel: "Kies jullie thema",
        uitleg: [
          "Lees de lijst met thema's hieronder en kies er samen één.",
          "Denk aan een kleuter van 5 jaar: wat moet die over dit thema weten om gezond of veilig te blijven?",
        ],
        type: "thema",
        check: ["We hebben een thema gekozen."],
        criterium: "Thema gekozen dat past bij kleuters.",
      },
      {
        id: "1.2",
        titel: "Bedenk 5 vragen",
        uitleg: [
          "Schrijf hieronder 5 korte vragen over jullie thema. Maximum 8 woorden per vraag.",
          "Geef bij elke vraag 1 juist antwoord en 2 foute antwoorden. Elk antwoord moet je kunnen tonen met een prent.",
          "Kies bij elke vraag waar de juiste prent komt: links, midden of rechts. Wissel af, zodat de juiste prent niet altijd op dezelfde plaats staat.",
        ],
        voorbeeld:
          "Vraag: \"Wanneer was je je handen?\" Juist: na het toilet. Fout: na het tv kijken, na het slapen. Juiste prent: rechts.",
        type: "vragen",
        check: [
          "Alle 5 vragen zijn ingevuld, met telkens 1 juist en 2 foute antwoorden.",
          "De juiste prent staat niet altijd op dezelfde plaats.",
        ],
        criterium:
          "5 duidelijke vragen op maat van een kleuter, met 1 juist en 2 foute antwoorden die je met een prent kan tonen. Juiste plaats wisselt af.",
      },
      {
        id: "1.3",
        titel: "Maak je PowerPoint-bestand",
        nieuw: true,
        uitleg: [
          "Open PowerPoint.",
          {
            t: "Kies <b>Lege presentatie</b>.",
            b: { type: "start", uitleg: "Klik op Lege presentatie (1)." },
          },
          {
            t: "Klik linksboven op <b>Bestand</b> en kies <b>Opslaan als</b>. Klik op <b>OneDrive</b> en open de map <b>Informatica</b> en dan <b>PowerPoint</b>. Bestaat de map PowerPoint nog niet? Klik dan op <b>Nieuwe map</b>.",
            b: {
              type: "backstage", kies: "Opslaan als", acc: 1,
              inhoud: '<div class="pp-plek aan acc" data-n="2">☁️ OneDrive – school</div><div class="pp-plek">💻 Deze pc</div><div class="pp-plek">📁 Bladeren</div><div style="margin-top:8px;color:#605e5c">OneDrive › Informatica › PowerPoint</div>',
              uitleg: "Bestand → Opslaan als (1) → OneDrive (2).",
            },
          },
          {
            t: "Typ als bestandsnaam: <b>klas_Kleuterquiz_thema_voornaam1_voornaam2</b> en klik op <b>Opslaan</b>.",
            b: {
              type: "venster", titel: "Opslaan als", smal: true,
              velden: [{ label: "Bestandsnaam", l: "3ZW_Kleuterquiz_Handjes wassen_Lotte_Yassin", acc: 1 }, { label: "Opslaan als", l: "PowerPoint-presentatie (*.pptx)", menu: true }],
              knoppen: [{ l: "Opslaan", hoofd: true, acc: 2 }, "Annuleren"],
              uitleg: "Typ de naam (1) en klik op Opslaan (2).",
            },
          },
          {
            t: "Kijk linksboven: de schakelaar <b>Automatisch opslaan</b> staat nu aan. Vanaf nu bewaart PowerPoint alles vanzelf.",
            b: { type: "titelbalk", acc: { autosave: 1 }, uitleg: "Automatisch opslaan staat aan (1)." },
          },
        ],
        check: [
          "Het bestand heeft de juiste naam.",
          "Het bestand staat in de map Informatica/PowerPoint op OneDrive.",
        ],
        criterium: "Bestand met correcte naam in de juiste OneDrive-map.",
      },
      {
        id: "1.4",
        titel: "Deel het bestand met je partner en je leerkracht",
        nieuw: true,
        uitleg: [
          {
            t: "Klik rechtsboven op <b>Delen</b>.",
            b: { type: "titelbalk", acc: { delen: 1 }, uitleg: "De knop Delen staat rechtsboven (1)." },
          },
          {
            t: "Typ de naam van je partner en de naam van je leerkracht. Kijk of er <b>Kan bewerken</b> staat en klik op <b>Verzenden</b>.",
            b: {
              type: "venster", titel: "Delen: klas_Kleuterquiz_…", smal: true,
              velden: [{ label: "Naam, groep of e-mailadres", l: "Yassin El Amrani; mevrouw …", acc: 1 }, { label: "", l: "✏️ Kan bewerken", menu: true, acc: 2 }, { label: "Bericht (optioneel)", l: "" }],
              knoppen: [{ l: "Verzenden", hoofd: true, acc: 3 }],
              uitleg: "Namen typen (1), Kan bewerken (2), Verzenden (3).",
            },
          },
          {
            t: "Je partner opent PowerPoint, klikt op <b>Bestand</b> → <b>Openen</b> → <b>Gedeeld met mij</b> en opent jullie bestand. Zien jullie allebei hetzelfde bestand? Dan kunnen jullie voortaan samen werken.",
            b: {
              type: "backstage", kies: "Openen", acc: 0,
              inhoud: '<div class="pp-plek">🕘 Recent</div><div class="pp-plek aan acc" data-n="1">👥 Gedeeld met mij</div><div class="pp-plek">☁️ OneDrive – school</div><div style="margin-top:8px">📊 3ZW_Kleuterquiz_Handjes wassen_Lotte_Yassin</div>',
              uitleg: "Je partner vindt het bestand bij Gedeeld met mij (1).",
            },
          },
        ],
        check: [
          "Mijn partner kan het bestand openen en bewerken.",
          "De leerkracht staat bij de mensen met wie het bestand gedeeld is.",
        ],
        criterium: "Bestand gedeeld met partner (bewerken) en met de leerkracht.",
      },
      {
        id: "1.5",
        titel: "Kies een ontwerp",
        nieuw: true,
        uitleg: [
          {
            t: "Klik bovenaan op het tabblad <b>Ontwerpen</b>. Je ziet nu een rij ontwerpen. Klik op een ontwerp om het te proberen en kies een vrolijk ontwerp met een <b>lichte achtergrond</b>.",
            b: LINT("Ontwerpen", [
              G("Thema's", [DUIM("", "Aa", 0), DUIM("", "Aa", 1, "background:#fff3c4;color:#c45800"), DUIM("", "Aa", 0, "background:#2b579a;color:#fff"), DUIM("", "Aa", 0, "background:#e3f4e8;color:#1e8449"), DUIM("", "Aa", 0, "background:#3b3b3b;color:#fff")], false),
              G("Varianten", [DUIM("", "", 0, "background:#fff3c4"), DUIM("", "", 0, "background:#ffd9c4"), DUIM("", "", 0, "background:#d6ecff"), K("Meer", "▾", 2)]),
              G("Aanpassen", [K("Diagrootte", "▭", 0, { menu: true }), K("Achtergrond opmaken", "🎨")]),
            ], { tabAcc: 0, uitleg: "Tabblad Ontwerpen: kies een thema (1). Andere kleur? Kijk bij Varianten (2)." }),
          },
          "Wil je een andere kleur? Klik rechts naast de ontwerpen op een van de <b>Varianten</b>.",
        ],
        tip: "Kleuters houden van kleur, maar donkere tekst op een lichte achtergrond blijft het best leesbaar.",
        check: ["We hebben een ontwerp met een lichte achtergrond gekozen."],
        criterium: "Passend ontwerp, tekst goed leesbaar.",
      },
      {
        id: "1.6",
        titel: "Maak de titeldia",
        uitleg: [
          {
            t: "Klik op de eerste dia in het grote vak en typ de titel van je quiz, bv. \"Handjes wassen, hoe doe jij dat?\". Klik in het kleine vak en typ: <b>Een quiz van</b> + jullie voornamen.",
            b: { type: "dia", titel: "Handjes wassen, hoe doe jij dat?", titelAcc: 1, onder: "Een quiz van Lotte en Yassin", onderAcc: 2, achtergrond: "#fff3c4", uitleg: "Titel in het grote vak (1), jullie namen in het kleine vak (2)." },
          },
          {
            t: "Selecteer de titel. Kies op het tabblad <b>Start</b> een rond, duidelijk lettertype, bv. <b>Century Gothic</b> of <b>Comic Sans MS</b>, en zet de tekengrootte op minstens <b>54</b>. Dat werkt net zoals in Word.",
            b: LINT("Start", [G("Klembord", [K("Plakken", "📋")]), START_DIAS, START_LETTER(1, 2), G("Alinea", [KK("", "≡"), KK("", "☰")])], { uitleg: "Lettertype (1) en tekengrootte (2) op het tabblad Start." }),
          },
        ],
        check: [
          "De titel en onze namen staan op de eerste dia.",
          "De titel is minstens 54 pt in een duidelijk lettertype.",
        ],
        criterium: "Titeldia met titel (min. 54 pt, duidelijk lettertype) en beide namen.",
      },
      {
        id: "1.7",
        titel: "Maak de uitlegdia",
        nieuw: true,
        uitleg: [
          {
            t: "Klik op het tabblad <b>Start</b> op het pijltje onder <b>Nieuwe dia</b>.",
            b: LINT("Start", [G("Klembord", [K("Plakken", "📋")]), G("Dia's", [K("Nieuwe dia", "🗔", 1, { menu: true }), KK("Indeling", "▦")]), START_LETTER()], { uitleg: "Klik op het pijltje onder Nieuwe dia (1)." }),
          },
          {
            t: "Kies de indeling <b>Titel en object</b>. Links zie je nu 2 dia's.",
            b: { type: "indelingen", kies: "Titel en object", smal: true, uitleg: "Kies Titel en object (1)." },
          },
          {
            t: "Typ als titel: <b>Hoe speel je?</b> Typ in het grote vak 3 korte zinnen voor de juf: \"Lees de vraag voor.\", \"Laat de kleuter een prent aantikken.\", \"Juist of fout? De computer zegt het!\"",
            b: { type: "dia", titel: "Hoe speel je?", lijst: ["Lees de vraag voor.", "Laat de kleuter een prent aantikken.", "Juist of fout? De computer zegt het!"], achtergrond: "#fff3c4", uitleg: "Zo ziet je uitlegdia eruit." },
          },
        ],
        check: ["Dia 2 heeft de titel \"Hoe speel je?\" en 3 zinnen uitleg."],
        criterium: "Uitlegdia met titel en 3 duidelijke zinnen.",
      },
      {
        id: "1.8",
        titel: "Maak je eerste vraagdia",
        nieuw: true,
        uitleg: [
          {
            t: "Klik weer op het pijltje onder <b>Nieuwe dia</b> en kies nu de indeling <b>Alleen titel</b>.",
            b: { type: "indelingen", kies: "Alleen titel", smal: true, uitleg: "Kies Alleen titel (1)." },
          },
          "Typ vraag 1 (die van stap 1.2) in het titelvak.",
          "Gebruik hetzelfde lettertype als op je titeldia, minstens <b>40</b> pt.",
        ],
        check: ["Dia 3 is vraag 1, met indeling Alleen titel en minstens 40 pt."],
        criterium: "Vraagdia met indeling Alleen titel, vraag in min. 40 pt.",
      },
      {
        id: "1.9",
        titel: "Voeg 3 prenten in",
        nieuw: true,
        uitleg: [
          {
            t: "Klik op het tabblad <b>Invoegen</b> op <b>Afbeeldingen</b> en kies <b>Stockafbeeldingen</b>.",
            b: { delen: [INVOEGEN({ afb: 1 }), { type: "menu", items: [{ l: "Dit apparaat…", i: "💻" }, { l: "Stockafbeeldingen…", i: "🖼️", acc: 2 }, { l: "Onlineafbeeldingen…", i: "🌐" }] }], uitleg: "Invoegen → Afbeeldingen (1) → Stockafbeeldingen (2)." },
          },
          {
            t: "Typ een Nederlands woord in het zoekvak, bv. \"toilet\". Klik op een prent en klik op <b>Invoegen</b>.",
            b: {
              type: "venster", titel: "Stockafbeeldingen",
              extra: '<div class="pp-zoek acc" data-n="1">🔍 toilet</div><div class="pp-raster"><span class="aan acc" data-n="2">🚽</span><span>🧻</span><span>🚻</span><span>🧼</span><span>🚿</span></div>',
              knoppen: [{ l: "Invoegen (1)", hoofd: true, acc: 3 }, "Annuleren"],
              uitleg: "Zoeken (1), prent kiezen (2), Invoegen (3).",
            },
          },
          "Of zoek een pictogram op <b>www.sclera.be</b>, kopieer het (rechtermuisknop → Afbeelding kopiëren) en plak het op je dia.",
          "Voeg zo 3 prenten in: de juiste en de 2 foute antwoorden.",
          {
            t: "Klik op een prent. Bovenaan verschijnt het tabblad <b>Afbeeldingsopmaak</b>. Zet helemaal rechts de <b>hoogte</b> op <b>6 cm</b>. Doe dat voor alle 3 de prenten.",
            b: LINT("Afbeeldingsopmaak", [
              G("Aanpassen", [K("Achtergrond verwijderen", "✂️"), K("Correcties", "☀️", 0, { menu: true })]),
              G("Toegankelijkheid", [K("Alternatieve tekst", "💬")]),
              G("Schikken", [KK("Naar voren", "⬆"), KK("Uitlijnen", "⫶", 0, { menu: true })], true),
              G("Grootte", [K("Bijsnijden", "⛶"), VELD("6 cm", 1, { label: "↕" }), VELD("6 cm", 0, { label: "↔" })], false),
            ], { tabs: TABS_AFB, uitleg: "Tabblad Afbeeldingsopmaak: hoogte op 6 cm (1)." }),
          },
        ],
        tip: "Gebruik geen foto's van echte kinderen die je online vindt. Pictogrammen of tekeningen zijn veiliger en duidelijker voor kleuters.",
        check: [
          "Er staan 3 prenten op vraag 1.",
          "Alle 3 de prenten zijn 6 cm hoog.",
        ],
        criterium: "3 passende prenten, alle 3 even hoog (6 cm).",
      },
      {
        id: "1.10",
        titel: "Zet de prenten netjes op een rij",
        nieuw: true,
        uitleg: [
          {
            t: "Klik op de eerste prent, houd <b>Shift</b> ingedrukt en klik op de andere 2. Nu zijn ze alle 3 geselecteerd.",
            b: { type: "dia", titel: "Wanneer was je je handen?", prenten: ["📺", "😴", "🚽"], selectie: true, achtergrond: "#fff3c4", uitleg: "Alle 3 de prenten zijn geselecteerd (blauwe kaders)." },
          },
          {
            t: "Ga naar <b>Afbeeldingsopmaak</b> → <b>Uitlijnen</b> en kies <b>Onder uitlijnen</b>. Klik daarna nog eens op <b>Uitlijnen</b> en kies <b>Horizontaal verdelen</b>.",
            b: { delen: [
              LINT("Afbeeldingsopmaak", [G("Toegankelijkheid", [K("Alternatieve tekst", "💬")]), G("Schikken", [KK("Naar voren", "⬆"), KK("Naar achteren", "⬇"), KK("Uitlijnen", "⫶", 1, { menu: true })], true), G("Grootte", [VELD("6 cm", 0, { label: "↕" })])], { tabs: TABS_AFB, titelbalk: false }),
              { type: "menu", items: [{ l: "Links uitlijnen" }, { l: "Centreren" }, { l: "Rechts uitlijnen" }, "-", { l: "Boven uitlijnen" }, { l: "Midden uitlijnen" }, { l: "Onder uitlijnen", acc: 2 }, "-", { l: "Horizontaal verdelen", acc: 3 }, { l: "Verticaal verdelen" }] },
            ], uitleg: "Uitlijnen (1) → Onder uitlijnen (2). Daarna Uitlijnen → Horizontaal verdelen (3)." },
          },
          "Controleer: staat de juiste prent op de plaats die je in stap 1.2 koos?",
          "Druk op <b>F5</b> om je quiz te bekijken. Druk op <b>Esc</b> om te stoppen.",
        ],
        check: [
          "De 3 prenten staan op één rij met evenveel ruimte ertussen.",
          "De juiste prent staat op de plaats die we kozen.",
        ],
        criterium: "Prenten uitgelijnd en gelijk verdeeld; juiste prent op de gekozen plaats.",
      },
    ],
  },

  // ───────────────────────────── LES 2 ─────────────────────────────
  {
    nr: 2,
    titel: "Alle dia's en de eerste knoppen",
    intro:
      "Vandaag maken jullie alle vragen af en bouwen jullie de dia's waar de kleuter terechtkomt: \"Goed zo!\" en \"Oei!\". Daarna maken jullie van de prenten knoppen.",
    schema: true,
    stappen: [
      {
        id: "2.1",
        titel: "Open jullie quiz",
        uitleg: [
          {
            t: "Open PowerPoint en klik op <b>Bestand</b> → <b>Openen</b>. Jullie bestand staat bij <b>Recent</b>. Staat het er niet? Kijk dan bij <b>Gedeeld met mij</b>.",
            b: {
              type: "backstage", kies: "Openen", acc: 1,
              inhoud: '<div class="pp-plek aan acc" data-n="2">🕘 Recent</div><div class="pp-plek">👥 Gedeeld met mij</div><div class="pp-plek">☁️ OneDrive – school</div><div style="margin-top:8px">📊 3ZW_Kleuterquiz_Handjes wassen_Lotte_Yassin</div>',
              uitleg: "Bestand → Openen (1) → Recent (2).",
            },
          },
          "Kijk linksboven of <b>Automatisch opslaan</b> aan staat. Dan werken jullie in het gedeelde bestand en niet in een kopie.",
        ],
        check: ["Ons gedeelde bestand is open en Automatisch opslaan staat aan."],
        criterium: "Gedeeld bestand geopend (geen kopie gemaakt).",
      },
      {
        id: "2.2",
        titel: "Maak vraag 2 tot en met 5",
        nieuw: true,
        uitleg: [
          {
            t: "Klik links met de <b>rechtermuisknop</b> op vraag 1 en kies <b>Dia dupliceren</b>. Je krijgt een kopie.",
            b: { type: "menu", smal: true, items: [{ l: "Knippen", i: "✂️" }, { l: "Kopiëren", i: "📄" }, { l: "Plakopties:", i: "📋" }, "-", { l: "Nieuwe dia", i: "🗔" }, { l: "Dia dupliceren", i: "⧉", acc: 1 }, { l: "Dia verwijderen", i: "🗑️" }, "-", { l: "Indeling", i: "▦", sub: true }], uitleg: "Rechtermuisknop op de dia links → Dia dupliceren (1)." },
          },
          "Typ op de kopie vraag 2.",
          {
            t: "Klik met de rechtermuisknop op een prent → <b>Afbeelding wijzigen</b> → <b>Van stockafbeeldingen</b>. Zo blijven de grootte en de plaats hetzelfde.",
            b: { delen: [
              { type: "menu", items: [{ l: "Knippen", i: "✂️" }, { l: "Kopiëren", i: "📄" }, "-", { l: "Afbeelding wijzigen", i: "🖼️", sub: true, acc: 1 }, { l: "Groeperen", i: "▣", sub: true }, { l: "Koppeling", i: "🔗" }, { l: "Alternatieve tekst bekijken…", i: "💬" }] },
              { type: "menu", kop: "Afbeelding wijzigen", items: [{ l: "Uit een bestand…", i: "💻" }, { l: "Van stockafbeeldingen…", i: "🖼️", acc: 2 }, { l: "Van online bronnen…", i: "🌐" }, { l: "Van pictogrammen", i: "☺" }, { l: "Van klembord", i: "📋" }] },
            ], uitleg: "Afbeelding wijzigen (1) → Van stockafbeeldingen (2)." },
          },
          "Zet de juiste prent op de plaats die je in stap 1.2 koos.",
          "Herhaal tot je 5 vraagdia's hebt.",
        ],
        check: [
          "Er zijn 5 vraagdia's met dezelfde opmaak.",
          "Op elke vraag staan 3 prenten die passen bij onze antwoorden.",
        ],
        criterium: "5 vraagdia's met gelijke opmaak, telkens 3 passende prenten.",
      },
      {
        id: "2.3",
        titel: "Noteer de juiste prent in de notities",
        nieuw: true,
        uitleg: [
          {
            t: "Klik onderaan het scherm op <b>Notities</b>. Er verschijnt een vak onder je dia.",
            b: { type: "statusbalk", acc: 1, uitleg: "De knop Notities staat onderaan (1)." },
          },
          {
            t: "Typ bij elke vraag welke prent juist is, bv. <b>Juist = rechts</b>.",
            b: { type: "dia", titel: "Wanneer was je je handen?", prenten: ["📺", "😴", "🚽"], achtergrond: "#fff3c4", notities: "Juist = rechts", notAcc: 1, uitleg: "In het notitievak (1) schrijf je welke prent juist is." },
          },
        ],
        tip: "De kleuter ziet de notities niet. Ze helpen jou straks bij het maken van de knoppen.",
        check: ["Bij elke vraag staat in de notities welke prent juist is."],
        criterium: "Notities ingevuld bij alle 5 vragen.",
      },
      {
        id: "2.4",
        titel: "Maak de Goed-zo-dia's",
        uitleg: [
          "Klik op vraag 1. Klik op het pijltje onder <b>Nieuwe dia</b> en kies <b>Alleen titel</b>.",
          {
            t: "Typ <b>Goed zo!</b> in een groene, grote letter (minstens 66 pt) en voeg een vrolijke prent toe: een duim, een ster of een lachend gezicht.",
            b: { type: "dia", titel: "Goed zo!", titelStijl: "color:#1e8449;font-size:30px;border:0", prenten: ["⭐"], achtergrond: "#fff3c4", uitleg: "Zo kan een Goed-zo-dia eruitzien." },
          },
          "Dupliceer deze dia 4 keer.",
          {
            t: "Sleep de kopieën links in het overzicht naar de juiste plaats. Na elke vraag komt zijn eigen Goed-zo-dia.",
            b: { type: "overzicht", dias: QUIZ_DIAS.slice(0, 12), uitleg: "De volgorde: vraag 1, Goed zo, vraag 2, Goed zo, …" },
          },
        ],
        check: [
          "Na elke vraag staat een Goed-zo-dia.",
          "De Goed-zo-dia's hebben een grote groene tekst en een vrolijke prent.",
        ],
        criterium: "5 Goed-zo-dia's, elk direct na de juiste vraag.",
      },
      {
        id: "2.5",
        titel: "Maak de Oei-dia en de slotdia",
        uitleg: [
          "Klik op de laatste dia en maak 2 nieuwe dia's met de indeling <b>Alleen titel</b>.",
          "Oei-dia: typ <b>Oei, probeer nog eens!</b> in oranje en voeg een vriendelijke prent toe. Nooit een boos of huilend gezicht: de kleuter mag zich niet slecht voelen.",
          "Slotdia: typ <b>Bravo! Je weet alles over …</b> + jullie thema.",
          {
            t: "Controleer de volgorde. Jullie quiz heeft nu <b>14 dia's</b>.",
            b: { type: "overzicht", dias: QUIZ_DIAS, uitleg: "Alle 14 dia's in de juiste volgorde. De Oei-dia is dia 13." },
          },
        ],
        check: [
          "Er is een vriendelijke Oei-dia en een slotdia.",
          "Onze quiz heeft 14 dia's in de juiste volgorde.",
        ],
        criterium: "Oei-dia (vriendelijk) en slotdia aanwezig, 14 dia's in de juiste volgorde.",
      },
      {
        id: "2.6",
        titel: "Maak van de juiste prent een knop",
        nieuw: true,
        uitleg: [
          "Ga naar vraag 1 en klik op de <b>juiste</b> prent (kijk in je notities).",
          {
            t: "Klik op het tabblad <b>Invoegen</b> op <b>Koppeling</b>.",
            b: Object.assign(INVOEGEN({ koppeling: 1 }), { uitleg: "Invoegen → Koppeling (1)." }),
          },
          {
            t: "Kies links <b>Plaats in dit document</b>. Kies de Goed-zo-dia die net na vraag 1 komt (dia 4) en klik op <b>OK</b>.",
            b: Object.assign(KOPPELVENSTER("4. Goed zo!", [1, 2, 3]), { uitleg: "Plaats in dit document (1) → de juiste Goed-zo-dia (2) → OK (3). Kijk naar het nummer van de dia!" }),
          },
          "Doe hetzelfde voor de juiste prent van vraag 2 tot en met 5. Telkens naar de Goed-zo-dia die direct na die vraag komt.",
        ],
        tip: "Alle Goed-zo-dia's heten hetzelfde. Kijk daarom naar het <b>nummer</b> voor de naam: vraag 1 gaat naar dia 4, vraag 2 naar dia 6, vraag 3 naar dia 8, vraag 4 naar dia 10 en vraag 5 naar dia 12. Fout gekoppeld? Rechtermuisknop op de prent → <b>Koppeling bewerken</b>.",
        check: ["Bij alle 5 vragen gaat de juiste prent naar de juiste Goed-zo-dia."],
        criterium: "5 juiste prenten correct gekoppeld aan de bijhorende Goed-zo-dia.",
      },
      {
        id: "2.7",
        titel: "Maak van de foute prenten een knop",
        uitleg: [
          "Klik op vraag 1 op een <b>foute</b> prent.",
          {
            t: "Klik op <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> en kies dia 13, de <b>Oei-dia</b>. Klik op <b>OK</b>.",
            b: Object.assign(KOPPELVENSTER("13. Oei, probeer nog eens!", [1, 2, 3]), { uitleg: "Plaats in dit document (1) → de Oei-dia (2) → OK (3)." }),
          },
          "Doe hetzelfde voor de tweede foute prent.",
          "Herhaal voor vraag 2 tot en met 5. Dat zijn 10 foute prenten in totaal.",
        ],
        check: ["Alle 10 foute prenten gaan naar de Oei-dia."],
        criterium: "10 foute prenten correct gekoppeld aan de Oei-dia.",
      },
      {
        id: "2.8",
        titel: "Maak de Verder-pijlen",
        nieuw: true,
        uitleg: [
          {
            t: "Ga naar de eerste Goed-zo-dia. Klik op <b>Invoegen</b> → <b>Vormen</b> en kies bij <b>Blokpijlen</b> de <b>pijl naar rechts</b>.",
            b: { delen: [INVOEGEN({ vormen: 1 }), { type: "menu", kop: "Blokpijlen", items: [{ l: "Pijl: rechts", i: "➡️", acc: 2 }, { l: "Pijl: links", i: "⬅️" }, { l: "Pijl: omhoog", i: "⬆️" }, { l: "Pijl: omlaag", i: "⬇️" }] }], uitleg: "Invoegen → Vormen (1) → Pijl: rechts (2)." },
          },
          {
            t: "Teken de pijl rechtsonder op de dia. Klik erin en typ <b>Verder</b>.",
            b: { type: "dia", titel: "Goed zo!", titelStijl: "color:#1e8449;font-size:30px;border:0", prenten: ["⭐"], vorm: { soort: "pijl-r", l: "Verder" }, achtergrond: "#fff3c4", uitleg: "De Verder-pijl staat rechtsonder." },
          },
          "Klik op de rand van de pijl en koppel hem met <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> aan <b>vraag 2</b> (dia 5).",
          "Kopieer de pijl (Ctrl+C) en plak hem (Ctrl+V) op de andere Goed-zo-dia's. Pas telkens de koppeling aan (rechtermuisknop → <b>Koppeling bewerken</b>): naar de volgende vraag.",
          "De pijl op de laatste Goed-zo-dia gaat naar de <b>slotdia</b> (dia 14).",
        ],
        check: [
          "Elke Goed-zo-dia heeft een Verder-pijl naar de volgende vraag.",
          "De laatste Verder-pijl gaat naar de slotdia.",
        ],
        criterium: "5 Verder-pijlen, elk naar de juiste volgende dia.",
      },
    ],
  },

  // ───────────────────────────── LES 3 ─────────────────────────────
  {
    nr: 3,
    titel: "Laatste knoppen, geluid en afwerking",
    intro:
      "Vandaag wordt jullie quiz een echt spelletje: de laatste knoppen, de vragen worden voorgelezen, er komt beweging bij en jullie testen alles. Op het einde leveren jullie in.",
    schema: true,
    stappen: [
      {
        id: "3.1",
        titel: "Maak de Nog-eens-knop",
        nieuw: true,
        uitleg: [
          "Open jullie bestand (zoals in stap 2.1).",
          {
            t: "Ga naar de Oei-dia. Teken met <b>Invoegen</b> → <b>Vormen</b> een <b>pijl naar links</b> en typ erin: <b>Nog eens</b>.",
            b: { type: "dia", titel: "Oei, probeer nog eens!", titelStijl: "color:#d35400;font-size:26px;border:0", prenten: ["🙂"], vorm: { soort: "pijl-l", l: "Nog eens" }, achtergrond: "#fff3c4", uitleg: "De Nog-eens-pijl staat linksonder." },
          },
          {
            t: "Klik op de rand van de pijl. Klik op <b>Invoegen</b> → <b>Actie</b> (niet Koppeling!).",
            b: Object.assign(INVOEGEN({ actie: 1 }), { uitleg: "Invoegen → Actie (1)." }),
          },
          {
            t: "Kies <b>Hyperlink naar:</b>, klik op het pijltje en kies <b>Laatst weergegeven dia</b>. Klik op <b>OK</b>.",
            b: {
              type: "venster", titel: "Actie-instellingen", smal: true,
              velden: [{ html: '<div style="font-weight:600;border-bottom:2px solid #c43e1c;display:inline-block;margin-bottom:4px">Klikken met de muis</div>' }, { radio: false, l: "Geen" }, { radio: true, l: "Hyperlink naar:", acc: 1 }, { label: "", l: "Laatst weergegeven dia", menu: true, acc: 2 }, { radio: false, l: "Programma uitvoeren:" }, { check: false, l: "Geluid afspelen:" }],
              knoppen: [{ l: "OK", acc: 3 }, "Annuleren"],
              uitleg: "Hyperlink naar (1) → Laatst weergegeven dia (2) → OK (3).",
            },
          },
        ],
        tip: "\"Laatst weergegeven dia\" is slim: de kleuter gaat altijd terug naar de vraag waar hij of zij net was. Daarom heb je maar één Oei-dia nodig.",
        check: ["De Nog-eens-pijl is via Actie gekoppeld aan Laatst weergegeven dia."],
        criterium: "Nog-eens-knop gekoppeld aan Laatst weergegeven dia.",
      },
      {
        id: "3.2",
        titel: "Maak de Start- en Speel-knop",
        uitleg: [
          {
            t: "Ga naar de titeldia. Teken met <b>Invoegen</b> → <b>Vormen</b> een <b>afgeronde rechthoek</b> en typ erin: <b>Start</b>.",
            b: { type: "dia", titel: "Handjes wassen, hoe doe jij dat?", onder: "Een quiz van Lotte en Yassin", vorm: { soort: "rond", l: "Start" }, achtergrond: "#fff3c4", uitleg: "De Start-knop onderaan de titeldia." },
          },
          "Koppel de knop met <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> aan dia 2, de uitlegdia.",
          "Ga naar de uitlegdia. Teken een knop <b>Speel!</b> en koppel die aan dia 3, vraag 1.",
          {
            t: "Geef beide knoppen een opvallende kleur: klik op de knop, ga naar het tabblad <b>Vormopmaak</b> en kies <b>Opvulling van vorm</b>.",
            b: LINT("Vormopmaak", [G("Vormen invoegen", [KK("", "▭"), KK("", "◯"), KK("", "➡")]), G("Vormstijlen", [DUIM("", "Abc", 0, "background:#ed7d31;color:#fff"), DUIM("", "Abc", 0, "background:#70ad47;color:#fff"), KK("Opvulling van vorm", "🪣", 1, { menu: true }), KK("Omtrek van vorm", "✏️", 0, { menu: true })]), G("Grootte", [VELD("2 cm", 0, { label: "↕" })])], { tabs: TABS_VORM, uitleg: "Vormopmaak → Opvulling van vorm (1)." }),
          },
        ],
        check: [
          "De Start-knop gaat naar de uitlegdia.",
          "De Speel-knop gaat naar vraag 1.",
        ],
        criterium: "Start- en Speel-knop aanwezig en correct gekoppeld.",
      },
      {
        id: "3.3",
        titel: "Test alle knoppen",
        uitleg: [
          "Druk op <b>F5</b>.",
          "Klik <b>alleen op prenten en knoppen</b>, nooit ernaast.",
          "Probeer bij elke vraag eerst een foute prent, klik op Nog eens, en kies dan de juiste prent.",
          "Werkt iets niet? Druk op Esc, verbeter de koppeling en test opnieuw.",
        ],
        check: [
          "We kunnen de hele quiz spelen van Start tot de slotdia.",
          "Nog eens brengt ons bij elke vraag terug naar dezelfde vraag.",
        ],
        criterium: "Volledige quiz speelbaar zonder foute koppeling.",
      },
      {
        id: "3.4",
        titel: "Spreek de vragen in",
        nieuw: true,
        uitleg: [
          "Zet een koptelefoon met microfoon op (of ga op een rustige plaats zitten).",
          {
            t: "Ga naar vraag 1. Klik op <b>Invoegen</b> → <b>Audio</b> → <b>Audio opnemen</b>.",
            b: { delen: [INVOEGEN({ audio: 1 }), { type: "menu", items: [{ l: "Audio op mijn pc…", i: "💻" }, { l: "Audio opnemen…", i: "🎙️", acc: 2 }] }], uitleg: "Invoegen → Audio (1) → Audio opnemen (2)." },
          },
          {
            t: "Klik op de <b>rode bol</b> en lees de vraag <b>traag en duidelijk</b> voor, alsof er een kleuter voor je staat. Klik op het <b>vierkantje</b> om te stoppen en dan op <b>OK</b>.",
            b: {
              type: "venster", titel: "Geluid opnemen", smal: true,
              velden: [{ label: "Naam:", l: "Vraag 1" }, { html: '<small style="color:#605e5c">Totale lengte geluid: 3,2</small>' }],
              extra: '<div style="display:flex;gap:34px;font-size:24px;margin:10px 0 4px 6px"><span>▶</span><span class="acc" data-n="2" style="padding:0 4px">⏹</span><span class="acc" data-n="1" style="color:#e3001b;padding:0 4px">⏺</span></div>',
              knoppen: [{ l: "OK", acc: 3 }, "Annuleren"],
              uitleg: "Opnemen (1), stoppen (2), OK (3).",
            },
          },
          "Sleep het luidsprekertje naar de linkerbovenhoek.",
          {
            t: "Klik op het luidsprekertje en ga naar het tabblad <b>Afspelen</b>. Zet <b>Starten</b> op <b>Automatisch</b> en vink <b>Verbergen tijdens voorstelling</b> aan.",
            b: LINT("Afspelen", [G("Voorbeeld", [K("Afspelen", "▶")]), G("Bewerken", [K("Audio bijsnijden", "✂️")]), G("Audio-opties", [VELD("Automatisch", 1, { label: "Starten:", w: 150 }), CHECK("Verbergen tijdens voorstelling", 2, true), CHECK("Doorlopend afspelen", 0, false)], true)], { tabs: TABS_AUDIO, uitleg: "Starten: Automatisch (1) en Verbergen tijdens voorstelling (2)." }),
          },
          "Doe dit voor alle 5 de vragen. Wissel af: allebei spreken jullie minstens 2 vragen in.",
        ],
        check: [
          "Alle 5 de vragen worden automatisch voorgelezen.",
          "We hebben allebei vragen ingesproken.",
        ],
        criterium: "5 vragen ingesproken, starten automatisch, luidspreker verborgen; duidelijk verstaanbaar.",
      },
      {
        id: "3.5",
        titel: "Laat de Goed-zo-prent bewegen",
        nieuw: true,
        uitleg: [
          {
            t: "Ga naar de eerste Goed-zo-dia en klik op de vrolijke prent. Ga naar het tabblad <b>Animaties</b> en kies <b>Stuiteren</b>. Zet bij <b>Begin</b> de keuze op <b>Met vorige</b>, zodat de animatie vanzelf start.",
            b: LINT("Animaties", [
              G("Voorbeeld", [K("Voorbeeld", "▶")]),
              G("Animatie", [DUIM("Geen", "✕"), DUIM("Verschijnen", "★"), DUIM("Vervagen", "★"), DUIM("Invliegen", "★"), DUIM("Stuiteren", "★", 1, "color:#2e8b57")]),
              G("Geavanceerde animatie", [KK("Animatie toevoegen", "✚"), KK("Animatiedeelvenster", "▤"), KK("Animatie kopiëren", "🖌️", 3)], true),
              G("Timing", [VELD("Met vorige", 2, { label: "Begin:", w: 140 }), VELD("02,00", 0, { label: "Duur:" })], true),
            ], { uitleg: "Stuiteren (1), Begin: Met vorige (2). Later: Animatie kopiëren (3)." }),
          },
          "Klik op <b>Animatie kopiëren</b> (het penseeltje) en klik dan op de prent van de volgende Goed-zo-dia. Herhaal voor alle Goed-zo-dia's.",
        ],
        tip: "Een beetje beweging is leuk, te veel maakt een kleuter onrustig. Alleen de Goed-zo-prenten krijgen een animatie.",
        check: ["Op alle 5 de Goed-zo-dia's beweegt de prent vanzelf."],
        criterium: "Animatie op de 5 Goed-zo-prenten, start automatisch, niet overdreven.",
      },
      {
        id: "3.6",
        titel: "Kies een rustige overgang",
        nieuw: true,
        uitleg: [
          {
            t: "Klik op het tabblad <b>Overgangen</b>. Kies <b>Vervagen</b> en klik daarna op <b>Op alles toepassen</b>.",
            b: LINT("Overgangen", [
              G("Voorbeeld", [K("Voorbeeld", "▶")]),
              G("Overgang naar deze dia", [DUIM("Geen", "▭"), DUIM("Morfen", "◐"), DUIM("Vervagen", "◌", 1), DUIM("Duwen", "⇥"), DUIM("Vegen", "⇢")]),
              G("Timing", [VELD("Geen", 0, { label: "Geluid:" }), VELD("00,70", 0, { label: "Duur:" }), KK("Op alles toepassen", "⧉", 2)], true),
            ], { uitleg: "Vervagen (1) en daarna Op alles toepassen (2)." }),
          },
        ],
        check: ["Alle dia's hebben dezelfde rustige overgang."],
        criterium: "Eén rustige overgang op alle dia's.",
      },
      {
        id: "3.7",
        titel: "Zet de kiosk-modus aan",
        nieuw: true,
        uitleg: [
          {
            t: "Klik op het tabblad <b>Diavoorstelling</b> op <b>Diavoorstelling instellen</b>.",
            b: LINT("Diavoorstelling", [G("Diavoorstelling starten", [K("Vanaf begin", "▶"), K("Vanaf huidige dia", "⏵")]), G("Instellen", [K("Diavoorstelling instellen", "⚙️", 1), K("Dia verbergen", "🚫")])], { uitleg: "Diavoorstelling → Diavoorstelling instellen (1)." }),
          },
          {
            t: "Kies bij Type voorstelling: <b>Bladeren bij kiosk (volledig scherm)</b>. Klik op <b>OK</b>.",
            b: {
              type: "venster", titel: "Diavoorstelling instellen", smal: true,
              velden: [{ html: "<b>Type voorstelling</b>" }, { radio: false, l: "Gepresenteerd door een spreker (volledig scherm)" }, { radio: false, l: "Bladeren door een persoon (venster)" }, { radio: true, l: "Bladeren bij kiosk (volledig scherm)", acc: 1 }],
              knoppen: [{ l: "OK", acc: 2 }, "Annuleren"],
              uitleg: "Bladeren bij kiosk (1) → OK (2).",
            },
          },
          "Druk op <b>F5</b>. Klik eens naast een prent: er gebeurt niets. De quiz gaat nu alleen verder via de prenten en knoppen, net als een echte game.",
        ],
        tip: "Wil je de quiz stoppen in de kiosk-modus? Druk op <b>Esc</b>.",
        check: ["De kiosk-modus staat aan en naast een prent klikken doet niets."],
        criterium: "Kiosk-modus ingesteld.",
      },
      {
        id: "3.8",
        titel: "Geef elke prent een alternatieve tekst",
        nieuw: true,
        uitleg: [
          {
            t: "Klik met de rechtermuisknop op een prent en kies <b>Alternatieve tekst bekijken</b>.",
            b: { type: "menu", smal: true, items: [{ l: "Knippen", i: "✂️" }, { l: "Kopiëren", i: "📄" }, "-", { l: "Afbeelding wijzigen", i: "🖼️", sub: true }, { l: "Koppeling bewerken", i: "🔗" }, { l: "Alternatieve tekst bekijken…", i: "💬", acc: 1 }, { l: "Grootte en positie…", i: "⛶" }], uitleg: "Rechtermuisknop op de prent → Alternatieve tekst bekijken (1)." },
          },
          {
            t: "Typ rechts in een paar woorden wat er op de prent staat, bv. \"kind wast handen met zeep\".",
            b: { type: "deelvenster", titel: "Alternatieve tekst", smal: true, inhoud: '<small style="color:#605e5c">Hoe zou je dit object en de context ervan beschrijven voor iemand die blind of slechtziend is?</small><div class="pp-invul acc" data-n="1" style="margin-top:8px;min-height:50px">kind wast handen met zeep</div>', uitleg: "Typ de beschrijving in het vak (1)." },
          },
          "Doe dit voor de prenten van alle 5 de vragen.",
        ],
        tip: "Alternatieve tekst helpt mensen die slecht zien: hun computer leest voor wat er op de prent staat.",
        check: ["Alle prenten op de vraagdia's hebben een alternatieve tekst."],
        criterium: "Alternatieve tekst bij alle 15 prenten op de vraagdia's.",
      },
      {
        id: "3.9",
        titel: "Laatste controle en inleveren",
        uitleg: [
          "Speel jullie quiz nog één keer volledig met <b>F5</b>.",
          "Kijk of <b>Automatisch opslaan</b> nog aan staat en sluit PowerPoint.",
          "Klik hieronder op <b>Download ons rapport</b> en lever het in zoals je leerkracht vraagt.",
        ],
        check: [
          "Onze quiz werkt van begin tot einde.",
          "Het bestand staat opgeslagen op OneDrive.",
        ],
        criterium: "Afgewerkte quiz op OneDrive, rapport ingeleverd.",
      },
    ],
  },

  // ───────────────────────────── LES 4 ─────────────────────────────
  {
    nr: 4,
    titel: "Quizfeest: speel elkaars quiz",
    intro:
      "Vandaag spelen jullie de quiz van andere duo's. Eén van jullie speelt de kleuter, de andere is de juf of meester. Na elke quiz geven jullie eerlijke en vriendelijke feedback.",
    stappen: [
      {
        id: "4.1",
        titel: "Speel de quiz van een ander duo (1)",
        uitleg: [
          "Je leerkracht zegt welke quiz je speelt. Open hem (je krijgt de link of het bestand).",
          "Start met <b>F5</b>. Eén van jullie speelt de kleuter, de andere leest mee en helpt met woorden.",
          "Vul daarna de feedback hieronder in.",
        ],
        type: "feedback",
        check: ["We hebben de quiz gespeeld en de feedback ingevuld."],
        criterium: "Quiz gespeeld, feedback volledig, eerlijk en vriendelijk.",
      },
      {
        id: "4.2",
        titel: "Speel de quiz van een ander duo (2)",
        uitleg: [
          "Speel een tweede quiz. Wissel nu van rol: wie de kleuter was, is nu de juf of meester.",
          "Vul daarna de feedback hieronder in.",
        ],
        type: "feedback",
        check: ["We hebben de quiz gespeeld en de feedback ingevuld."],
        criterium: "Quiz gespeeld, feedback volledig, eerlijk en vriendelijk.",
      },
      {
        id: "4.3",
        titel: "Kijk terug op jullie eigen quiz",
        uitleg: [
          "Vraag aan de duo's die jullie quiz speelden wat ze ervan vonden.",
          "Beantwoord de vragen hieronder samen.",
          "Klik op <b>Download ons rapport</b> en lever het in.",
        ],
        type: "reflectie",
        check: ["We hebben de terugblik ingevuld en het rapport ingeleverd."],
        criterium: "Eerlijke terugblik met minstens 1 concreet verbeterpunt.",
      },
    ],
  },
];

const FEEDBACK_VRAGEN = [
  "Elke vraag werd voorgelezen.",
  "Elke juiste prent gaat naar Goed zo.",
  "Elke foute prent gaat naar Oei en Nog eens werkt.",
  "Een kleuter van 5 jaar begrijpt alle prenten.",
  "De quiz eindigt op de slotdia.",
];

const REFLECTIE_VRAGEN = [
  "Waar zijn jullie het meest trots op?",
  "Wat was het moeilijkste en hoe hebben jullie dat opgelost?",
  "Wat zouden jullie de volgende keer anders doen?",
  "Hoe verliep de samenwerking? Deden jullie allebei evenveel?",
];
