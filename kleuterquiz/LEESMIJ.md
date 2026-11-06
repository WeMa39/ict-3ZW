# Kleuterquiz in PowerPoint – digitale leeromgeving

Leeromgeving voor 3BSO Zorg en Welzijn. Leerlingen werken per 2 en maken zelfstandig een klikbare quiz voor kleuters in PowerPoint.

## Bestanden

| Bestand | Wat |
| --- | --- |
| `index.html` | De pagina voor de leerlingen |
| `leerkracht.html` | Jouw pagina om te beoordelen (staat nergens gelinkt op de leerlingenpagina) |
| `data.js` | Alle teksten van de lessen en stappen. Pas hier aan wat je wil. |
| `nakijken.js` | De automatische nakijker (vragen en PowerPoint) |
| `lib/jszip.min.js` | Hulpprogramma om .pptx-bestanden te openen (MIT-licentie) |
| `beelden.js` | Tekent de schermbeelden van PowerPoint bij de stappen |
| `app.js`, `style.css` | De werking en de opmaak |

## Zo werkt het

- **Les 1–3:** bouwen (12 + 10 + 10 stappen). **Les 4:** elkaars quiz spelen, de eigen quiz verbeteren en terugblikken.
- In stap 1.1 kiezen de leerlingen een thema én de leeftijd van de kleuters (3 tot maximum 6 jaar). Hoe jonger, hoe strenger de regels voor hun vragen.
- Op het einde van elke les kiezen ze hun PowerPoint-bestand in de site. De computer opent het bestand in de browser, kijkt elke stap na en geeft meteen punten (0, 1 of 2) en feedback. Het bestand wordt nergens naartoe gestuurd.
- Daarna downloaden ze hun rapport (.json) en leveren het in. Jij leest de rapporten in op `leerkracht.html` en ziet meteen per stap de score en de feedback. Je kan elke score nog aanpassen. **Exporteer alle scores** geeft een bestand voor Excel.

### Wat de computer nakijkt

| Wat | Hoe |
| --- | --- |
| Vragen (1.2) | Lengte volgens de gekozen leeftijd, vraagteken, hoofdletter, moeilijke woorden, 3 verschillende antwoorden van max. 4 woorden, juiste antwoord niet al in de vraag, waarom-zin, passend bij het thema (lijst met themawoorden), wisselende plaats van de juiste prent, geen ongepaste woorden |
| PowerPoint (les 1–3) | Bestandsnaam, ontwerp, tekengroottes, indelingen, aantal en grootte van de prenten, uitlijning, afbeeldingsstijl, notities, volgorde van de 14 dia's, elke koppeling (juist, fout, Verder, Nog eens, Start, Speel), waarom-zinnen, ingesproken vragen (automatisch en verborgen), animaties, overgangen, applaus, kiosk-modus, alternatieve tekst |
| Les 4 | Feedback aan andere duo's (top en tip), opnieuw inleveren, terugblik |
| Niet automatisch | 1.4 (delen) en 2.1 (bestand openen): die tellen als de leerlingen ze zelf afvinken |

De thema-controle werkt met een lijst van woorden per thema (in `nakijken.js`, bij `THEMAWOORDEN`). Een vraag zonder enig themawoord krijgt feedback. Het is geen echte taalcontrole: een rare maar correct gespelde vraag met themawoorden komt erdoor. Kijk dus af en toe even naar de tabel "Hun 5 vragen" op je leerkrachtpagina.

### Zelf typen

Op de leerlingenpagina kan je niet kopiëren, plakken of tekst slepen. Probeert een leerling het toch, dan verschijnt "Typ het zelf!" en wordt de poging geteld. Jij ziet dat aantal op je leerkrachtpagina. Overtypen van een ChatGPT-antwoord kan een website niet tegenhouden, maar ze moeten het wel zelf typen.

### Rapporten inleveren

Zonder server kan de site de rapporten niet zelf naar jou sturen. Twee manieren:

1. Via een Teams-opdracht of een gedeelde OneDrive-map: de leerlingen uploaden hun rapport daar.
2. Via Microsoft Forms: maak een formulier met een vraag **Bestand uploaden**. Zet de link in `data.js` bij `INLEVERLINK`. Dan verschijnt er een knop **Rapport inleveren** op de site. Alle rapporten komen automatisch in jouw OneDrive.

Een rapport dat na het downloaden werd aangepast, krijgt een waarschuwing op je leerkrachtpagina.

## Schermbeelden

Bij elke klik in PowerPoint staat een beeld van het scherm, met een rood kader en een nummer op de plaats waar de leerlingen moeten klikken. Die beelden zijn nagetekend in de site zelf, zodat ze altijd scherp zijn en overal werken. De knoppen en namen volgen de Nederlandstalige PowerPoint-app van Microsoft 365, maar het blijft een nabootsing: kleuren en de exacte plaats van knoppen kunnen op jullie schoolcomputers wat afwijken.

**Liever een echte schermafdruk?** Maak een map `img` in de map `kleuterquiz` en zet je schermafdruk erin met de naam uit de tabel hieronder (PNG). De site toont dan automatisch jouw schermafdruk in plaats van het nagetekende beeld. Teken zelf een rood kader op de plaats waar ze moeten klikken (bv. met Knipprogramma). Beelden die je niet vervangt, blijven nagetekend.

| Bestandsnaam | Waar | Wat het beeld toont |
| --- | --- | --- |
| `img/1.3-2.png` | 1.3 Maak je PowerPoint-bestand, puntje 2 | Klik op Lege presentatie (1). |
| `img/1.3-3.png` | 1.3 Maak je PowerPoint-bestand, puntje 3 | Bestand → Opslaan als (1) → OneDrive (2). |
| `img/1.3-4.png` | 1.3 Maak je PowerPoint-bestand, puntje 4 | Typ de naam (1) en klik op Opslaan (2). |
| `img/1.3-5.png` | 1.3 Maak je PowerPoint-bestand, puntje 5 | Automatisch opslaan staat aan (1). |
| `img/1.4-1.png` | 1.4 Deel het bestand met je partner en je leerkracht, puntje 1 | De knop Delen staat rechtsboven (1). |
| `img/1.4-2.png` | 1.4 Deel het bestand met je partner en je leerkracht, puntje 2 | Namen typen (1), Kan bewerken (2), Verzenden (3). |
| `img/1.4-3.png` | 1.4 Deel het bestand met je partner en je leerkracht, puntje 3 | Je partner vindt het bestand bij Gedeeld met mij (1). |
| `img/1.5-1.png` | 1.5 Kies een ontwerp, puntje 1 | Tabblad Ontwerpen: kies een thema (1). Andere kleur? Kijk bij Varianten (2). |
| `img/1.6-1.png` | 1.6 Maak de titeldia, puntje 1 | Titel in het grote vak (1), jullie namen in het kleine vak (2). |
| `img/1.6-2.png` | 1.6 Maak de titeldia, puntje 2 | Lettertype (1) en tekengrootte (2) op het tabblad Start. |
| `img/1.7-1.png` | 1.7 Maak de uitlegdia, puntje 1 | Klik op het pijltje onder Nieuwe dia (1). |
| `img/1.7-2.png` | 1.7 Maak de uitlegdia, puntje 2 | Kies Titel en object (1). |
| `img/1.7-3.png` | 1.7 Maak de uitlegdia, puntje 3 | Zo ziet je uitlegdia eruit. |
| `img/1.8-1.png` | 1.8 Maak je eerste vraagdia, puntje 1 | Kies Alleen titel (1). |
| `img/1.9-1.png` | 1.9 Voeg 3 prenten in, puntje 1 | Invoegen → Afbeeldingen (1) → Stockafbeeldingen (2). |
| `img/1.9-2.png` | 1.9 Voeg 3 prenten in, puntje 2 | Zoeken (1), prent kiezen (2), Invoegen (3). |
| `img/1.9-5.png` | 1.9 Voeg 3 prenten in, puntje 5 | Tabblad Afbeeldingsopmaak: hoogte op 6 cm (1). |
| `img/1.10-1.png` | 1.10 Zet de prenten netjes op een rij, puntje 1 | Alle 3 de prenten zijn geselecteerd (blauwe kaders). |
| `img/1.10-2.png` | 1.10 Zet de prenten netjes op een rij, puntje 2 | Uitlijnen (1) → Onder uitlijnen (2). Daarna Uitlijnen → Horizontaal verdelen (3). |
| `img/2.1-1.png` | 2.1 Open jullie quiz, puntje 1 | Bestand → Openen (1) → Recent (2). |
| `img/2.2-1.png` | 2.2 Maak vraag 2 tot en met 5, puntje 1 | Rechtermuisknop op de dia links → Dia dupliceren (1). |
| `img/2.2-3.png` | 2.2 Maak vraag 2 tot en met 5, puntje 3 | Afbeelding wijzigen (1) → Van stockafbeeldingen (2). |
| `img/2.3-1.png` | 2.3 Noteer de juiste prent in de notities, puntje 1 | De knop Notities staat onderaan (1). |
| `img/2.3-2.png` | 2.3 Noteer de juiste prent in de notities, puntje 2 | In het notitievak (1) schrijf je welke prent juist is. |
| `img/2.4-2.png` | 2.4 Maak de Goed-zo-dia's, puntje 2 | Zo kan een Goed-zo-dia eruitzien. |
| `img/2.4-4.png` | 2.4 Maak de Goed-zo-dia's, puntje 4 | De volgorde: vraag 1, Goed zo, vraag 2, Goed zo, … |
| `img/2.5-4.png` | 2.5 Maak de Oei-dia en de slotdia, puntje 4 | Alle 14 dia's in de juiste volgorde. De Oei-dia is dia 13. |
| `img/2.6-2.png` | 2.6 Maak van de juiste prent een knop, puntje 2 | Invoegen → Koppeling (1). |
| `img/2.6-3.png` | 2.6 Maak van de juiste prent een knop, puntje 3 | Plaats in dit document (1) → de juiste Goed-zo-dia (2) → OK (3). Kijk naar het nummer van de dia! |
| `img/2.7-2.png` | 2.7 Maak van de foute prenten een knop, puntje 2 | Plaats in dit document (1) → de Oei-dia (2) → OK (3). |
| `img/2.8-1.png` | 2.8 Maak de Verder-pijlen, puntje 1 | Invoegen → Vormen (1) → Pijl: rechts (2). |
| `img/2.8-2.png` | 2.8 Maak de Verder-pijlen, puntje 2 | De Verder-pijl staat rechtsonder. |
| `img/3.1-2.png` | 3.1 Maak de Nog-eens-knop, puntje 2 | De Nog-eens-pijl staat linksonder. |
| `img/3.1-3.png` | 3.1 Maak de Nog-eens-knop, puntje 3 | Invoegen → Actie (1). |
| `img/3.1-4.png` | 3.1 Maak de Nog-eens-knop, puntje 4 | Hyperlink naar (1) → Laatst weergegeven dia (2) → OK (3). |
| `img/3.2-1.png` | 3.2 Maak de Start- en Speel-knop, puntje 1 | De Start-knop onderaan de titeldia. |
| `img/3.2-4.png` | 3.2 Maak de Start- en Speel-knop, puntje 4 | Vormopmaak → Opvulling van vorm (1). |
| `img/3.4-2.png` | 3.4 Spreek de vragen in, puntje 2 | Invoegen → Audio (1) → Audio opnemen (2). |
| `img/3.4-3.png` | 3.4 Spreek de vragen in, puntje 3 | Opnemen (1), stoppen (2), OK (3). |
| `img/3.4-5.png` | 3.4 Spreek de vragen in, puntje 5 | Starten: Automatisch (1) en Verbergen tijdens voorstelling (2). |
| `img/3.5-1.png` | 3.5 Laat de Goed-zo-prent bewegen, puntje 1 | Stuiteren (1), Begin: Met vorige (2). Later: Animatie kopiëren (3). |
| `img/3.6-1.png` | 3.6 Kies een rustige overgang, puntje 1 | Vervagen (1) en daarna Op alles toepassen (2). |
| `img/3.7-1.png` | 3.7 Zet de kiosk-modus aan, puntje 1 | Diavoorstelling → Diavoorstelling instellen (1). |
| `img/3.7-2.png` | 3.7 Zet de kiosk-modus aan, puntje 2 | Bladeren bij kiosk (1) → OK (2). |
| `img/3.8-1.png` | 3.8 Geef elke prent een alternatieve tekst, puntje 1 | Rechtermuisknop op de prent → Alternatieve tekst bekijken (1). |
| `img/3.8-2.png` | 3.8 Geef elke prent een alternatieve tekst, puntje 2 | Typ de beschrijving in het vak (1). |
