# CLAUDE.md — SourcDirect

## Projectoverzicht

**SourcDirect** is een sourcing landingspagina voor bol.com verkopers. Klanten plakken hun Alibaba-links in een formulier en ontvangen binnen 48 uur een offerte op maat. Aanvragen worden automatisch weggeschreven naar een Google Sheet.

Het project is gebouwd voor **Cozella** en bestaat uit slechts 3 bestanden — geen buildstap, geen dependencies, geen framework.

---

## Bestandsstructuur

```
/
├── index.html        # De volledige website (HTML + CSS + JS in één bestand)
├── apps-script.js    # Google Apps Script (draait in Google Sheets, niet lokaal)
└── README.md         # Setup-instructies voor Google Sheets + Netlify-deployment
```

---

## Technische details

### index.html
- Volledig zelfstandig HTML-bestand, direct te openen in een browser
- Geen externe dependencies (geen npm, geen build)
- Taal: Nederlands
- Kleurenschema: primair blauw `#0052cc`, accent oranje `#ff6b00`
- Responsive (mobile-first via CSS Grid + media queries)
- Secties: Navbar → Hero → Hoe het werkt → Voordelen → Formulier → Trust bar → Footer

**Formulier:**
- Contactvelden: naam, e-mail, bol.com winkelnaam, telefoonnummer (optioneel)
- Dynamische productkaarten: max. 10 producten per aanvraag
- Per product: Alibaba URL, huidige prijs, gewenste hoeveelheid, productomschrijving
- Formulierdata wordt als JSON gepost naar de Google Apps Script URL
- Succesbericht vervangt het formulier na verzending
- Demo-modus actief als `GOOGLE_SCRIPT_URL` nog de placeholder-waarde heeft

**Configuratie in index.html (regel 753):**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKQ4BodV8gTkYtpPKtrtSUP4o8iiLZcpACpd0wL9jBxy6w4P7pnRmjxlLctkX7fxCT9g/exec';
```
Deze URL is al ingevuld — de koppeling met Google Sheets is actief.

### apps-script.js
- Draait als Google Apps Script (niet lokaal uitvoerbaar)
- Verwerkt POST-requests van het formulier (`doPost`)
- Maakt automatisch het tabblad "Aanvragen" aan als het nog niet bestaat, inclusief headers en opmaak
- Schrijft elke aanvraag als nieuwe rij weg met afwisselende rijkleuren en een gele "Nieuw"-statuscel
- URL-velden in het sheet worden blauw opgemaakt

**Google Sheet kolomindeling:**
| Kolom | Inhoud |
|---|---|
| A | Datum & Tijd |
| B | Naam |
| C | E-mailadres |
| D | Bol.com Winkel |
| E | Telefoonnummer |
| F–I | Product 1 (URL, naam, prijs, qty) |
| J–M | Product 2 |
| ... | (tot product 10) |
| AJ | Opmerkingen |
| AK | Status (Nieuw / In behandeling / Offerte verstuurd) |

**E-mailnotificaties:** staan uitgecommentarieerd in `apps-script.js` (functie `sendNotificationEmail`). Kunnen geactiveerd worden door de `/* */` te verwijderen en het e-mailadres aan te passen.

---

## Huidige status

De codebase is functioneel compleet:
- De Google Apps Script URL is ingevuld — het formulier stuurt echt data naar Google Sheets
- De site is klaar voor deployment (Netlify aanbevolen, zie README.md)
- E-mailnotificaties zijn nog niet geactiveerd (optioneel)

**Wat nog open staat:**
- Site deployen op Netlify (of een ander platform)
- Optioneel: e-mailnotificaties activeren in `apps-script.js`
- Optioneel: eigen domein koppelen (bijv. `sourcdirect.nl` via TransIP)

---

## Aanpassingen maken

| Wat | Waar |
|---|---|
| Bedrijfsnaam | Zoek `SourcDirect` in `index.html` |
| E-mailadres | Zoek `info@sourcdirect.nl` in `index.html` en `apps-script.js` |
| Primaire kleur | CSS variabele `--primary: #0052cc` bovenaan `<style>` in `index.html` |
| Accentkleur | CSS variabele `--accent: #ff6b00` bovenaan `<style>` in `index.html` |
| Google Script URL | Regel 753 in `index.html` |
| Max producten | `MAX_PRODUCTS = 10` in `apps-script.js` én de limit in `addProduct()` in `index.html` |
