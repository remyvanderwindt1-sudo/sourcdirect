# SourcDirect – Setup Instructies

Sourcing landingspagina voor bol.com verkopers. Klanten plakken hun Alibaba links en jij ontvangt alles netjes in Google Sheets.

---

## 📁 Bestanden

| Bestand | Omschrijving |
|---|---|
| `index.html` | De volledige website (1 bestand, direct te openen) |
| `apps-script.js` | Google Apps Script voor de Sheets koppeling |
| `README.md` | Dit bestand |

---

## 🚀 Stap-voor-stap: Google Sheets koppeling instellen

### Stap 1 – Maak een nieuw Google Sheet aan

1. Ga naar [sheets.google.com](https://sheets.google.com)
2. Klik op **"+"** om een nieuw spreadsheet te maken
3. Geef het een naam, bijv. **"SourcDirect Aanvragen"**

---

### Stap 2 – Open de Apps Script editor

1. Klik in het menu op **Extensies → Apps Script**
2. Er opent een nieuw tabblad met de script editor
3. **Verwijder alle bestaande code** in het editor venster (selecteer alles → Delete)

---

### Stap 3 – Plak het script

1. Open het bestand `apps-script.js` (in deze map)
2. Kopieer de volledige inhoud
3. Plak het in de Apps Script editor
4. Klik op het **💾 opslaan** icoon (of Ctrl+S)
5. Geef het project een naam, bijv. **"SourcDirect"**

---

### Stap 4 – Implementeer als Web App

1. Klik rechtsboven op **"Implementeren"** → **"Nieuwe implementatie"**
2. Klik op het ⚙️ tandwiel naast "Selecteer type" → kies **"Web-app"**
3. Vul in:
   - **Beschrijving:** `SourcDirect v1`
   - **Uitvoeren als:** `Ik` (jouw Google account)
   - **Wie heeft toegang:** `Iedereen` ⚠️ (dit is nodig zodat het formulier kan posten)
4. Klik op **"Implementeren"**
5. Geef toestemming als daarom gevraagd wordt (klik op "Toegang verlenen")
6. **Kopieer de Web App URL** — die ziet er zo uit:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

### Stap 5 – URL invullen in de website

1. Open `index.html` in een teksteditor (of VS Code)
2. Zoek deze regel (bovenaan het `<script>` blok):
   ```javascript
   const GOOGLE_SCRIPT_URL = 'JOUW_GOOGLE_APPS_SCRIPT_URL_HIER';
   ```
3. Vervang `JOUW_GOOGLE_APPS_SCRIPT_URL_HIER` met de URL die je in stap 4 hebt gekopieerd:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Sla het bestand op

---

### Stap 6 – Testen

1. Open `index.html` in je browser (dubbelklik op het bestand)
2. Vul het formulier in met testdata
3. Klik op "Verstuur offerte aanvraag"
4. Controleer je Google Sheet — er zou een nieuwe rij moeten verschijnen met:
   - Datum & tijd
   - Naam, e-mail, winkelnaam
   - Alibaba links, prijzen, hoeveelheden
   - Status: "Nieuw"

✅ **Werkt het?** Dan ben je klaar!

---

## 🌐 Website online zetten op jouw eigen domein

De aanbevolen setup is: **domein bij TransIP** + **hosting bij Netlify (gratis)**.

- ✅ Netlify is gratis voor statische HTML sites
- ✅ Koppelen aan eigen domein duurt 5 minuten
- ✅ Automatisch HTTPS/SSL certificaat (gratis)
- ✅ Maakt niet uit waar je het domein koopt — TransIP, Hostnet, etc. werken allemaal

---

### Stap A – Domein kopen bij TransIP

1. Ga naar [transip.nl](https://www.transip.nl) en maak een account aan
2. Zoek op `sourcdirect.nl` (of jouw gewenste naam)
3. Koop het domein (~€10-15/jaar) — je hebt **geen** TransIP hosting nodig, alleen het domein
4. Laat de DNS-instellingen voor nu staan, die pas je zo aan

---

### Stap B – Website uploaden naar Netlify

1. Ga naar [netlify.com](https://www.netlify.com) en maak een gratis account aan (met je Google of GitHub account)
2. Ga naar [app.netlify.com/drop](https://app.netlify.com/drop)
3. **Sleep de map `sourcdirect`** (de hele map met `index.html`) naar het drag-and-drop vlak
4. Netlify geeft je een tijdelijke URL zoals `random-naam.netlify.app` — de site werkt nu al!

---

### Stap C – Eigen domein koppelen in Netlify

1. Ga in Netlify naar jouw site → **"Domain settings"** → **"Add a domain"**
2. Typ je domein in: `sourcdirect.nl` → klik **"Verify"** → **"Add domain"**
3. Netlify toont je twee **nameservers**, bijv.:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

---

### Stap D – Nameservers instellen bij TransIP

1. Log in op [transip.nl](https://www.transip.nl) → **"Mijn domeinen"**
2. Klik op jouw domein → **"Nameservers"**
3. Vervang de bestaande nameservers met de Netlify nameservers uit stap C
4. Sla op — het kan 15 minuten tot 24 uur duren voordat dit actief is

---

### Stap E – HTTPS activeren (automatisch gratis)

1. Ga terug naar Netlify → **"Domain settings"** → **"HTTPS"**
2. Klik op **"Verify DNS configuration"**
3. Klik op **"Provision certificate"** — Netlify regelt een gratis SSL certificaat

✅ **Klaar!** Je site is nu bereikbaar op `https://sourcdirect.nl`

---

> 💡 **Maakt het uit waar je host?**
> Voor een statische HTML pagina zoals deze maakt het nauwelijks uit. Netlify is de beste gratis optie: snel, betrouwbaar, en koppelen aan een eigen domein is eenvoudig. Alternatieven zijn GitHub Pages of Vercel — allemaal gratis en werken hetzelfde. Je hebt **geen** betaalde hosting nodig.

> 💡 **Site updaten later?**
> Sleep gewoon de map opnieuw naar Netlify Drop, of gebruik Netlify's gratis "Continuous Deployment" via GitHub voor automatische updates.

---

## 📊 Google Sheets gebruiken

### Kolommen in het sheet:

| Kolom | Inhoud |
|---|---|
| A | Datum & Tijd van aanvraag |
| B | Naam klant |
| C | E-mailadres |
| D | Bol.com winkelnaam |
| E | Telefoonnummer |
| F–I | Product 1 (URL, naam, prijs, qty) |
| J–M | Product 2 (URL, naam, prijs, qty) |
| ... | ... (tot 10 producten) |
| AJ | Opmerkingen |
| AK | Status (Nieuw / In behandeling / Offerte verstuurd) |

### Exporteren als XLSX:
1. Open het Google Sheet
2. Klik op **Bestand → Downloaden → Microsoft Excel (.xlsx)**

### Handige filters instellen:
1. Selecteer rij 1 (de headers)
2. Klik op **Gegevens → Filter maken**
3. Nu kun je filteren op Status, datum, etc.

---

## ✉️ E-mailnotificaties activeren (optioneel)

In `apps-script.js` staat een uitgecommentarieerde functie `sendNotificationEmail`. Om e-mailmeldingen te krijgen bij elke nieuwe aanvraag:

1. Open de Apps Script editor
2. Verwijder de `/*` en `*/` rondom de `sendNotificationEmail` functie
3. Verander `info@sourcdirect.nl` naar jouw eigen e-mailadres
4. Voeg in de `doPost` functie deze regel toe na `formatLastRow(sheet);`:
   ```javascript
   sendNotificationEmail(data);
   ```
5. Sla op en implementeer opnieuw (nieuwe versie)

---

## 🎨 Aanpassingen maken

### Bedrijfsnaam wijzigen:
Zoek in `index.html` naar `SourcDirect` en vervang met jouw naam.

### E-mailadres in footer wijzigen:
Zoek naar `info@sourcdirect.nl` en vervang met jouw e-mailadres.

### Kleuren aanpassen:
Bovenaan de `<style>` sectie staan CSS variabelen:
```css
--primary: #0052cc;   /* Hoofdkleur (blauw) */
--accent: #ff6b00;    /* Accentkleur (oranje) */
```

---

## ❓ Problemen?

| Probleem | Oplossing |
|---|---|
| Formulier doet niets | Controleer of de GOOGLE_SCRIPT_URL correct is ingevuld |
| Geen data in Sheets | Controleer of de Web App toegang heeft voor "Iedereen" |
| Script vraagt toestemming | Klik op "Geavanceerd" → "Ga naar SourcDirect" → "Toestaan" |
| Fout bij implementeren | Verwijder de implementatie en maak een nieuwe aan |

---

*SourcDirect – Gebouwd voor bol.com verkopers die slimmer willen inkopen uit China.*
