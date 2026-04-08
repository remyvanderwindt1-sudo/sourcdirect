/**
 * SourcDirect – Google Apps Script
 * ================================
 * Plak dit script in je Google Sheets via:
 * Extensies → Apps Script → vervang alles → Sla op → Implementeer
 *
 * Zie README.md voor stap-voor-stap instructies.
 */

// =============================================
// CONFIGURATIE
// =============================================
const SHEET_NAME = 'Aanvragen';       // Naam van het tabblad in je Google Sheet
const MAX_PRODUCTS = 10;              // Maximaal aantal producten per aanvraag
// =============================================

/**
 * Verwerkt POST requests van het SourcDirect formulier
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    // Bouw de rij op
    const row = buildRow(data);
    sheet.appendRow(row);
    
    // Opmaak toepassen op de nieuwe rij
    formatLastRow(sheet);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('SourcDirect fout:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Verwerkt GET requests (voor testen in browser)
 */
function doGet(e) {
  return ContentService
    .createTextOutput('SourcDirect Apps Script is actief ✅')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Haal het sheet op of maak het aan met headers
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    createHeaders(sheet);
  } else if (sheet.getLastRow() === 0) {
    createHeaders(sheet);
  }
  
  return sheet;
}

/**
 * Maak de header rij aan
 */
function createHeaders(sheet) {
  const headers = [
    'Datum & Tijd',
    'Naam',
    'E-mailadres',
    'Bol.com Winkel',
    'Telefoonnummer',
  ];
  
  // Product kolommen (tot MAX_PRODUCTS)
  for (let i = 1; i <= MAX_PRODUCTS; i++) {
    headers.push(`Product ${i} – Alibaba URL`);
    headers.push(`Product ${i} – Naam/Omschrijving`);
    headers.push(`Product ${i} – Huidige Prijs`);
    headers.push(`Product ${i} – Gewenste Qty`);
  }
  
  headers.push('Opmerkingen');
  headers.push('Status');  // Voor jouw eigen gebruik: Nieuw / In behandeling / Offerte verstuurd
  
  sheet.appendRow(headers);
  
  // Opmaak headers
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#0052cc');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(10);
  headerRange.setWrap(true);
  
  // Kolombreedte instellen
  sheet.setColumnWidth(1, 160);  // Datum
  sheet.setColumnWidth(2, 140);  // Naam
  sheet.setColumnWidth(3, 200);  // Email
  sheet.setColumnWidth(4, 160);  // Winkel
  sheet.setColumnWidth(5, 140);  // Telefoon
  
  // Product kolommen
  for (let i = 0; i < MAX_PRODUCTS; i++) {
    const col = 6 + (i * 4);
    sheet.setColumnWidth(col, 300);      // URL
    sheet.setColumnWidth(col + 1, 200);  // Naam
    sheet.setColumnWidth(col + 2, 120);  // Prijs
    sheet.setColumnWidth(col + 3, 100);  // Qty
  }
  
  // Opmerkingen & Status
  const lastProductCol = 6 + (MAX_PRODUCTS * 4);
  sheet.setColumnWidth(lastProductCol, 250);      // Opmerkingen
  sheet.setColumnWidth(lastProductCol + 1, 140);  // Status
  
  // Rij vastzetten
  sheet.setFrozenRows(1);
}

/**
 * Bouw een data-rij op uit de form data
 */
function buildRow(data) {
  const row = [
    data.timestamp || new Date().toLocaleString('nl-NL'),
    data.naam || '',
    data.email || '',
    data.winkel || '',
    data.telefoon || '',
  ];
  
  // Product data
  for (let i = 1; i <= MAX_PRODUCTS; i++) {
    row.push(data[`product_${i}_url`] || '');
    row.push(data[`product_${i}_naam`] || '');
    row.push(data[`product_${i}_prijs`] || '');
    row.push(data[`product_${i}_qty`] || '');
  }
  
  row.push(data.opmerkingen || '');
  row.push('Nieuw');  // Standaard status
  
  return row;
}

/**
 * Opmaak toepassen op de laatste rij
 */
function formatLastRow(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const range = sheet.getRange(lastRow, 1, 1, lastCol);
  
  // Afwisselende rijkleur
  if (lastRow % 2 === 0) {
    range.setBackground('#f4f7ff');
  } else {
    range.setBackground('#ffffff');
  }
  
  // Status cel opmaken
  const statusCell = sheet.getRange(lastRow, lastCol);
  statusCell.setBackground('#fef3c7');
  statusCell.setFontColor('#92400e');
  statusCell.setFontWeight('bold');
  statusCell.setHorizontalAlignment('center');
  
  // URL cellen klikbaar maken
  for (let i = 1; i <= MAX_PRODUCTS; i++) {
    const urlCol = 6 + ((i - 1) * 4);
    const urlCell = sheet.getRange(lastRow, urlCol);
    const urlValue = urlCell.getValue();
    if (urlValue && urlValue.startsWith('http')) {
      urlCell.setFontColor('#0052cc');
    }
  }
  
  range.setVerticalAlignment('middle');
  sheet.setRowHeight(lastRow, 40);
}

/**
 * Stuur een e-mailnotificatie bij nieuwe aanvraag
 * (Optioneel – verwijder commentaar om te activeren)
 */
/*
function sendNotificationEmail(data) {
  const recipient = 'info@sourcdirect.nl';  // Jouw e-mailadres
  const subject = `Nieuwe sourcing aanvraag van ${data.naam} (${data.winkel})`;
  
  let body = `Nieuwe aanvraag ontvangen via SourcDirect!\n\n`;
  body += `Naam: ${data.naam}\n`;
  body += `E-mail: ${data.email}\n`;
  body += `Winkel: ${data.winkel}\n`;
  body += `Telefoon: ${data.telefoon || 'Niet opgegeven'}\n\n`;
  body += `--- PRODUCTEN ---\n`;
  
  for (let i = 1; i <= MAX_PRODUCTS; i++) {
    const url = data[`product_${i}_url`];
    if (url) {
      body += `\nProduct ${i}:\n`;
      body += `  URL: ${url}\n`;
      body += `  Naam: ${data[`product_${i}_naam`] || '-'}\n`;
      body += `  Prijs: ${data[`product_${i}_prijs`] || '-'}\n`;
      body += `  Qty: ${data[`product_${i}_qty`] || '-'}\n`;
    }
  }
  
  body += `\nOpmerkingen: ${data.opmerkingen || 'Geen'}\n`;
  body += `\nBekijk alle aanvragen in Google Sheets.`;
  
  MailApp.sendEmail(recipient, subject, body);
}
*/
