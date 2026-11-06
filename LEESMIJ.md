# ICT – 3 Zorg en Welzijn

Eén website met alle digitale opdrachten voor de klas. Elke opdracht staat in een eigen map.

| Map | Opdracht | Leerkrachtpagina |
| --- | --- | --- |
| `kleuterquiz/` | Kleuterquiz in PowerPoint (per 2, 4 lessen) | `kleuterquiz/leerkracht.html` |

De startpagina (`index.html`) toont een tegel per opdracht. De leerkrachtpagina's staan daar bewust niet op.

## Online zetten met GitHub Pages (één keer)

1. Maak op github.com een nieuwe repository, bv. `ict-3zw`, en zet ze op **Public**.
2. Klik op **Add file → Upload files** en sleep de **inhoud** van deze map erin (`index.html`, `LEESMIJ.md` en de map `kleuterquiz`). Klik op **Commit changes**.
3. Ga naar **Settings → Pages**. Kies bij *Source* **Deploy from a branch**, branch **main**, map **/ (root)**, en klik op **Save**.
4. Na een minuutje staat alles online:
   - startpagina voor de leerlingen: `https://<jouw-gebruikersnaam>.github.io/ict-3zw/`
   - kleuterquiz: `…/ict-3zw/kleuterquiz/`
   - jouw beoordeling: `…/ict-3zw/kleuterquiz/leerkracht.html`

## Een nieuwe opdracht toevoegen

1. Zet de nieuwe opdracht in een eigen map, bv. `excel-wzc/`.
2. Kopieer in `index.html` een tegel en pas de link (`excel-wzc/`), de tool en de tekst aan.
3. Upload de map en de aangepaste `index.html` naar dezelfde repository. GitHub Pages zet ze automatisch online.

## Goed om te weten

- Alles wordt bewaard in de browser van de leerling of leerkracht, er is geen server. Daarom downloaden de leerlingen een rapport en exporteer jij je scores regelmatig.
- Elke opdracht bewaart onder een eigen naam, dus opdrachten zitten elkaar niet in de weg.
- Hoe de kleuterquiz zelf werkt (rapporten, scoren op 0/1/2 per stap, export naar Excel): zie `kleuterquiz/LEESMIJ.md`.
