// Inhoud van de leeromgeving. Elke stap wordt beoordeeld op 2 punten:
// 0 = niet gedaan, 1 = gedaan maar niet helemaal correct, 2 = correct.
// Pas teksten gerust aan: de leerkrachtpagina leest dezelfde lijst.

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
          "Ga naar <b>www.office.com</b> en meld je aan met je schoolaccount.",
          "Klik links op <b>PowerPoint</b> (het oranje icoontje met een P).",
          "Kies <b>Lege presentatie</b>.",
          "Klik bovenaan op de titel \"Presentatie\" en typ de naam: <b>klas_Kleuterquiz_thema_voornaam1_voornaam2</b>.",
          "Klik op het mapje bij <b>Locatie</b> en kies je OneDrive-map <b>Informatica/PowerPoint</b>. Bestaat de map nog niet? Maak ze dan eerst aan op OneDrive.",
        ],
        tip: "PowerPoint bewaart automatisch. Je hoeft nooit op Opslaan te klikken zolang je online werkt.",
        check: [
          "Het bestand heeft de juiste naam.",
          "Het bestand staat in de map Informatica/PowerPoint.",
        ],
        criterium: "Bestand met correcte naam in de juiste OneDrive-map.",
      },
      {
        id: "1.4",
        titel: "Deel het bestand met je partner en je leerkracht",
        nieuw: true,
        uitleg: [
          "Klik rechtsboven op <b>Delen</b>.",
          "Typ de naam van je partner en de naam van je leerkracht.",
          "Kijk of er <b>Kan bewerken</b> staat. Zo niet, klik erop en kies het.",
          "Klik op <b>Verzenden</b>.",
          "Je partner opent het bestand via de mail of via OneDrive → <b>Gedeeld</b>. Zien jullie allebei hetzelfde bestand? Dan kunnen jullie voortaan samen werken.",
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
          "Klik bovenaan op het tabblad <b>Ontwerpen</b>.",
          "Klik op een ontwerp om het te proberen. Kies een vrolijk ontwerp met een <b>lichte achtergrond</b>.",
          "Wil je een andere kleur? Kijk rechts naast de ontwerpen bij <b>Varianten</b>.",
        ],
        tip: "Kleuters houden van kleur, maar donkere tekst op een lichte achtergrond blijft het best leesbaar.",
        check: ["We hebben een ontwerp met een lichte achtergrond gekozen."],
        criterium: "Passend ontwerp, tekst goed leesbaar.",
      },
      {
        id: "1.6",
        titel: "Maak de titeldia",
        uitleg: [
          "Klik in het grote vak op de eerste dia en typ de titel van je quiz, bv. \"Handjes wassen, hoe doe jij dat?\".",
          "Klik in het kleine vak en typ: <b>Een quiz van</b> + jullie voornamen.",
          "Selecteer de titel. Zet de tekengrootte op minstens <b>54</b> en kies een rond, duidelijk lettertype, bv. <b>Century Gothic</b> of <b>Comic Sans MS</b>. Dat werkt net zoals in Word, via het tabblad <b>Start</b>.",
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
          "Klik op het tabblad <b>Start</b> op het pijltje onder <b>Nieuwe dia</b>.",
          "Kies de indeling <b>Titel en inhoud</b>. Links zie je nu 2 dia's.",
          "Typ als titel: <b>Hoe speel je?</b>",
          "Typ in het inhoudsvak 3 korte zinnen voor de juf: \"Lees de vraag voor.\", \"Laat de kleuter een prent aantikken.\", \"Juist of fout? De computer zegt het!\"",
        ],
        check: ["Dia 2 heeft de titel \"Hoe speel je?\" en 3 zinnen uitleg."],
        criterium: "Uitlegdia met titel en 3 duidelijke zinnen.",
      },
      {
        id: "1.8",
        titel: "Maak je eerste vraagdia",
        nieuw: true,
        uitleg: [
          "Klik op <b>Nieuwe dia</b> en kies de indeling <b>Alleen titel</b>.",
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
          "Klik op <b>Invoegen</b> → <b>Afbeeldingen</b> → <b>Stockafbeeldingen</b>. Zoek met een Nederlands woord, bv. \"toilet\". Kies een prent en klik op <b>Invoegen</b>.",
          "Of zoek een pictogram op <b>www.sclera.be</b>, kopieer het (rechtermuisknop → Afbeelding kopiëren) en plak het op je dia.",
          "Voeg zo 3 prenten in: de juiste en de 2 foute antwoorden.",
          "Klik op een prent en ga naar het tabblad <b>Afbeelding</b> (of <b>Afbeeldingsopmaak</b>). Zet de <b>hoogte</b> op <b>6 cm</b>. Doe dat voor alle 3 de prenten.",
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
          "Klik op de eerste prent, houd <b>Shift</b> ingedrukt en klik op de andere 2. Nu zijn ze alle 3 geselecteerd.",
          "Ga naar <b>Start</b> → <b>Schikken</b> → <b>Uitlijnen</b> en kies <b>Onderkant uitlijnen</b>.",
          "Ga nog eens naar <b>Schikken</b> → <b>Uitlijnen</b> en kies <b>Horizontaal verdelen</b>.",
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
        titel: "Open je quiz in de PowerPoint-app",
        nieuw: true,
        uitleg: [
          "Ga naar <b>www.office.com</b> → <b>OneDrive</b> en open de map <b>Informatica/PowerPoint</b>. Werkt je partner? Kijk dan bij <b>Gedeeld</b>.",
          "Open jullie bestand.",
          "Klik bovenaan op <b>Bewerken</b> → <b>Openen in bureaubladapp</b> (of: <b>Openen in app</b>). Het blijft hetzelfde gedeelde bestand.",
        ],
        tip: "Vanaf nu werken jullie in de app op de pc. Knoppen naar andere dia's, geluid opnemen en de kiosk-modus werken daar het best.",
        check: ["Ons bestand is open in de PowerPoint-app op de pc."],
        criterium: "Gedeeld bestand geopend in de app (geen kopie gemaakt).",
      },
      {
        id: "2.2",
        titel: "Maak vraag 2 tot en met 5",
        nieuw: true,
        uitleg: [
          "Klik links met de <b>rechtermuisknop</b> op vraag 1 en kies <b>Dia dupliceren</b>. Je krijgt een kopie.",
          "Typ op de kopie vraag 2.",
          "Klik met de rechtermuisknop op een prent → <b>Afbeelding wijzigen</b> → <b>Stockafbeeldingen</b> (of <b>Van dit apparaat</b>). Zo blijft de grootte en de plaats hetzelfde.",
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
          "Klik onderaan het scherm op <b>Notities</b>. Er verschijnt een vak onder je dia.",
          "Typ bij elke vraag welke prent juist is, bv. <b>Juist = rechts</b>.",
        ],
        tip: "De kleuter ziet de notities niet. Ze helpen jou straks bij het maken van de knoppen.",
        check: ["Bij elke vraag staat in de notities welke prent juist is."],
        criterium: "Notities ingevuld bij alle 5 vragen.",
      },
      {
        id: "2.4",
        titel: "Maak de Goed-zo-dia's",
        uitleg: [
          "Klik op vraag 1. Klik op <b>Nieuwe dia</b> → <b>Alleen titel</b>.",
          "Typ <b>Goed zo!</b> in een groene, grote letter (minstens 66 pt).",
          "Voeg een vrolijke prent toe: een duim, een ster of een lachend gezicht.",
          "Dupliceer deze dia 4 keer.",
          "Sleep de kopieën links in het overzicht naar de juiste plaats. Na elke vraag komt zijn eigen Goed-zo-dia: vraag 1, goed zo, vraag 2, goed zo, …",
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
          "Controleer de volgorde: titel, uitleg, 5 keer vraag + goed zo, Oei, slot. Dat zijn <b>14 dia's</b>.",
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
          "Klik op <b>Invoegen</b> → <b>Koppeling</b>.",
          "Kies links <b>Plaats in dit document</b>.",
          "Kies de Goed-zo-dia die net na vraag 1 komt en klik op <b>OK</b>.",
          "Doe hetzelfde voor de juiste prent van vraag 2 tot en met 5. Telkens naar de Goed-zo-dia die direct na die vraag komt.",
        ],
        tip: "Fout gekoppeld? Klik met de rechtermuisknop op de prent → <b>Koppeling bewerken</b>.",
        check: ["Bij alle 5 vragen gaat de juiste prent naar de juiste Goed-zo-dia."],
        criterium: "5 juiste prenten correct gekoppeld aan de bijhorende Goed-zo-dia.",
      },
      {
        id: "2.7",
        titel: "Maak van de foute prenten een knop",
        uitleg: [
          "Klik op vraag 1 op een <b>foute</b> prent.",
          "Klik op <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> en kies de <b>Oei-dia</b>.",
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
          "Ga naar de eerste Goed-zo-dia. Klik op <b>Invoegen</b> → <b>Vormen</b> en kies de <b>pijl naar rechts</b>.",
          "Teken de pijl rechtsonder op de dia. Klik erin en typ <b>Verder</b>.",
          "Klik op de rand van de pijl en koppel hem met <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> aan <b>vraag 2</b>.",
          "Kopieer de pijl (Ctrl+C) en plak hem (Ctrl+V) op de andere Goed-zo-dia's. Pas telkens de koppeling aan (rechtermuisknop → <b>Koppeling bewerken</b>): naar de volgende vraag.",
          "De pijl op de laatste Goed-zo-dia gaat naar de <b>slotdia</b>.",
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
          "Open jullie bestand in de PowerPoint-app (zoals in stap 2.1).",
          "Ga naar de Oei-dia. Teken met <b>Invoegen</b> → <b>Vormen</b> een <b>pijl naar links</b> en typ erin: <b>Nog eens</b>.",
          "Koppel de pijl: <b>Invoegen</b> → <b>Koppeling</b> → <b>Plaats in dit document</b> → <b>Laatst weergegeven dia</b>.",
        ],
        tip: "\"Laatst weergegeven dia\" is slim: de kleuter gaat altijd terug naar de vraag waar hij of zij net was. Daarom heb je maar één Oei-dia nodig.",
        check: ["De Nog-eens-pijl is gekoppeld aan Laatst weergegeven dia."],
        criterium: "Nog-eens-knop gekoppeld aan Laatst weergegeven dia.",
      },
      {
        id: "3.2",
        titel: "Maak de Start- en Speel-knop",
        uitleg: [
          "Ga naar de titeldia. Teken met <b>Invoegen</b> → <b>Vormen</b> een <b>afgeronde rechthoek</b> en typ erin: <b>Start</b>.",
          "Koppel de knop aan de uitlegdia (dia 2).",
          "Ga naar de uitlegdia. Teken een knop <b>Speel!</b> en koppel die aan vraag 1.",
          "Geef beide knoppen een opvallende kleur via <b>Vormopmaak</b> → <b>Opvulling van vorm</b>.",
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
          "Ga naar vraag 1. Klik op <b>Invoegen</b> → <b>Audio</b> → <b>Audio opnemen</b>.",
          "Klik op de rode knop en lees de vraag <b>traag en duidelijk</b> voor, alsof er een kleuter voor je staat. Klik op stop en dan op <b>OK</b>.",
          "Sleep het luidsprekertje naar de linkerbovenhoek.",
          "Klik op het luidsprekertje en ga naar het tabblad <b>Afspelen</b>. Zet <b>Starten</b> op <b>Automatisch</b> en vink <b>Verbergen tijdens voorstelling</b> aan.",
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
          "Ga naar de eerste Goed-zo-dia en klik op de vrolijke prent.",
          "Klik op het tabblad <b>Animaties</b> en kies <b>Stuiteren</b> (of een andere vrolijke animatie).",
          "Zet bij <b>Begin</b> de keuze op <b>Met vorige</b>, zodat de animatie vanzelf start.",
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
          "Klik op het tabblad <b>Overgangen</b>.",
          "Kies <b>Vervagen</b>.",
          "Klik op <b>Op alles toepassen</b>.",
        ],
        check: ["Alle dia's hebben dezelfde rustige overgang."],
        criterium: "Eén rustige overgang op alle dia's.",
      },
      {
        id: "3.7",
        titel: "Zet de kiosk-modus aan",
        nieuw: true,
        uitleg: [
          "Klik op het tabblad <b>Diavoorstelling</b> → <b>Diavoorstelling instellen</b>.",
          "Kies bij Type voorstelling: <b>Bladeren bij kiosk (volledig scherm)</b>. Klik op <b>OK</b>.",
          "Druk op <b>F5</b>. Klik eens naast een prent: er gebeurt niets. De quiz gaat nu alleen verder via de prenten en knoppen, net als een echte game.",
        ],
        check: ["De kiosk-modus staat aan en naast een prent klikken doet niets."],
        criterium: "Kiosk-modus ingesteld.",
      },
      {
        id: "3.8",
        titel: "Geef elke prent een alternatieve tekst",
        nieuw: true,
        uitleg: [
          "Klik met de rechtermuisknop op een prent → <b>Alternatieve tekst bekijken</b>.",
          "Typ in een paar woorden wat er op de prent staat, bv. \"kind wast handen met zeep\".",
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
          "Klik op <b>Bestand</b> → <b>Opslaan</b> en sluit PowerPoint.",
          "Kijk op OneDrive of jullie bestand er staat met de juiste naam.",
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
