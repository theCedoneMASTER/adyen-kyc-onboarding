// -- THEME --
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.querySelector('.theme-icon').textContent =
    document.body.classList.contains('light') ? '\u2600\uFE0F' : '\uD83C\uDF19';
});

// -- RIPPLE --
function ripple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const r = document.createElement('span');
  r.className = 'ripple';
  r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// -- STEP NAVIGATION --
let currentStep = 1;
const stepBtns = document.querySelectorAll('.step-btn');
const stepPanels = document.querySelectorAll('.step-panel');

function showStep(n) {
  currentStep = n;
  stepBtns.forEach(b => {
    const s = parseInt(b.dataset.step);
    b.classList.remove('active');
    if (s === n) b.classList.add('active');
  });
  stepPanels.forEach(p => p.classList.remove('active'));
  document.getElementById(`step${n}`).classList.add('active');
  document.getElementById('progressText').textContent = `Schritt ${n}/3`;
  renderOutput();
}

stepBtns.forEach(btn => {
  btn.addEventListener('click', () => showStep(parseInt(btn.dataset.step)));
});

// -- TAB SWITCHER --
let currentTab = 'preview';
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    renderOutput();
  });
});

// -- HELPERS --
function val(id) { return document.getElementById(id)?.value?.trim() || ''; }

function getCheckedDocs() {
  return [...document.querySelectorAll('.doc-check:checked')].map(c => c.dataset.doc);
}

function getMissingDocs() {
  return [...document.querySelectorAll('.doc-check:not(:checked)')].map(c => ({
    id: c.dataset.doc,
    label: c.closest('label').querySelector('.label-content span').textContent
  }));
}

function getMailType() {
  return document.querySelector('input[name="mailType"]:checked')?.value || 'initial';
}

// -- DOC LABELS --
const docLabels = {
  handelsregister: 'Aktueller Handelsregisterauszug (alle Seiten)',
  gewerbe: 'Gewerbeanmeldung oder Gewerbeschein (alle Seiten inkl. Unterschrift)',
  ausweis_gf: 'Ausweiskopie des Geschaeftsfuehrers (Reisepass oder Personalausweis, Vorder- und Rueckseite)',
  ausweis_ubo: 'Ausweiskopie(n) der wirtschaftlich Berechtigten (>25% Anteil)',
  adressnachweis: 'Adressnachweis der wirtschaftlich Berechtigten (z.B. Nebenkostenabrechnung, nicht aelter als 3 Monate)',
  kontoauszug: 'Kontoauszug (mit Banklogo, IBAN und Firmenname, nicht aelter als 12 Monate, kein App-Screenshot)',
  pcidss: 'PCI DSS SAQ-A Formular (elektronisch signiert)'
};

// -- UPDATE DOC COUNTS --
function updateDocCounts() {
  const groups = {
    firma: { checks: ['handelsregister', 'gewerbe'], total: 2 },
    id: { checks: ['ausweis_gf', 'ausweis_ubo', 'adressnachweis'], total: 3 },
    bank: { checks: ['kontoauszug'], total: 1 },
    pci: { checks: ['pcidss'], total: 1 }
  };

  let totalChecked = 0;
  let totalAll = 7;

  Object.entries(groups).forEach(([key, group]) => {
    const checked = group.checks.filter(id =>
      document.querySelector(`.doc-check[data-doc="${id}"]`)?.checked
    ).length;
    totalChecked += checked;
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = `${checked}/${group.total}`;
  });

  const pct = Math.round((totalChecked / totalAll) * 100);
  const fill = document.getElementById('summaryFill');
  const text = document.getElementById('summaryText');
  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${totalChecked} von ${totalAll} Dokumenten erhalten`;
}

// -- BUILD MAIL HTML --
function buildInitialMail() {
  const name = val('kontaktName') || '[KUNDENNAME]';
  const firma = val('firmenname') || '[FIRMENNAME]';
  const lang = val('sprache');

  if (lang === 'en') {
    let html = `<p>Dear ${name},</p>`;
    html += `<p>To set up your payment processing through our partner Adyen, we need some documents from you. <strong>We will handle the entire setup for you</strong> - you only need to send us the following documents.</p>`;
    html += `<h3>What we need from you:</h3>`;
    html += `<p><strong>1. Company documents:</strong></p><ul>`;
    html += `<li>Current extract from the commercial register (Handelsregisterauszug) - all pages</li>`;
    html += `<li>Business registration certificate (Gewerbeanmeldung) - all pages including signature</li></ul>`;
    html += `<p><strong>2. ID copy of the managing director:</strong></p><ul>`;
    html += `<li>Passport OR national ID card (front and back)</li></ul>`;
    html += `<p><strong>3. Ultimate Beneficial Owners (persons with more than 25% company shares):</strong></p><ul>`;
    html += `<li>Name, date of birth, and ownership percentage</li>`;
    html += `<li>ID copy (passport or national ID card, both sides)</li>`;
    html += `<li>Proof of address (e.g. utility bill or tax assessment, no older than 3 months)</li></ul>`;
    html += `<p><strong>4. Bank details for payouts:</strong></p><ul>`;
    html += `<li>IBAN and account holder name</li>`;
    html += `<li>Bank statement as proof (with visible bank logo, IBAN, and account holder name)</li>`;
    html += `<li>Please use an official bank statement, not a screenshot from a banking app</li>`;
    html += `<li>The statement must not be older than 12 months</li></ul>`;
    html += `<p><strong>Document requirements:</strong></p><ul>`;
    html += `<li>Photos/scans as <strong>JPEG or PNG</strong></li>`;
    html += `<li>File size between <strong>100 KB and 4 MB</strong></li>`;
    html += `<li>Documents must be <strong>legible</strong> and <strong>complete</strong></li></ul>`;
    html += `<p>Once we have received all documents, we will take care of the complete setup. You will be notified as soon as everything is finalized.</p>`;
    html += `<p>Please don't hesitate to reach out if you have any questions.</p>`;
    html += `<p>Best regards</p>`;
    return html;
  }

  let html = `<p>Sehr geehrte/r ${name},</p>`;
  html += `<p>fuer die Einrichtung Ihrer Zahlungsanbindung ueber unseren Partner Adyen benoetigen wir einige Unterlagen von Ihnen. <strong>Wir uebernehmen die komplette Einrichtung fuer Sie</strong> - Sie muessen lediglich die folgenden Dokumente an uns senden.</p>`;
  html += `<h3>Was wir von Ihnen benoetigen:</h3>`;
  html += `<p><strong>1. Firmendokumente:</strong></p><ul>`;
  html += `<li>Aktueller Handelsregisterauszug (alle Seiten)</li>`;
  html += `<li>Gewerbeanmeldung oder Gewerbeschein (alle Seiten inkl. Unterschrift)</li></ul>`;
  html += `<p><strong>2. Ausweiskopie des Geschaeftsfuehrers:</strong></p><ul>`;
  html += `<li>Reisepass ODER Personalausweis (Vorder- und Rueckseite)</li></ul>`;
  html += `<p><strong>3. Wirtschaftlich Berechtigte (Personen mit mehr als 25% Firmenanteil):</strong></p><ul>`;
  html += `<li>Name, Geburtsdatum und Anteil in Prozent</li>`;
  html += `<li>Ausweiskopie (Reisepass oder Personalausweis, beidseitig)</li>`;
  html += `<li>Adressnachweis (z.B. Nebenkostenabrechnung oder Steuerbescheid, nicht aelter als 3 Monate)</li></ul>`;
  html += `<p><strong>4. Bankverbindung fuer Auszahlungen:</strong></p><ul>`;
  html += `<li>IBAN und Name des Kontoinhabers</li>`;
  html += `<li>Kontoauszug als Nachweis (mit sichtbarem Banklogo, IBAN und Kontoinhabername)</li>`;
  html += `<li>Bitte einen offiziellen Kontoauszug verwenden, kein Screenshot aus einer Banking-App</li>`;
  html += `<li>Der Auszug darf nicht aelter als 12 Monate sein</li></ul>`;
  html += `<p><strong>Hinweise zu den Dokumenten:</strong></p><ul>`;
  html += `<li>Fotos/Scans bitte als <strong>JPEG oder PNG</strong> senden</li>`;
  html += `<li>Dateien muessen zwischen <strong>100 KB und 4 MB</strong> gross sein</li>`;
  html += `<li>Dokumente muessen <strong>gut lesbar</strong> und <strong>vollstaendig</strong> sein</li></ul>`;
  html += `<p>Sobald wir alle Unterlagen erhalten haben, kuemmern wir uns um die komplette Einrichtung. Sie werden von uns informiert, sobald alles abgeschlossen ist.</p>`;
  html += `<p>Bei Fragen stehe ich Ihnen gerne zur Verfuegung.</p>`;
  html += `<p>Beste Gruesse</p>`;
  return html;
}

function buildReminderMail() {
  const name = val('kontaktName') || '[KUNDENNAME]';
  const missing = getMissingDocs();
  const lang = val('sprache');

  if (lang === 'en') {
    let html = `<p>Dear ${name},</p>`;
    html += `<p>We are still waiting for some documents from you to complete the setup of your payment processing.</p>`;
    if (missing.length > 0) {
      html += `<p><strong>Still missing:</strong></p><ul>`;
      missing.forEach(m => html += `<li>${m.label}</li>`);
      html += `</ul>`;
    } else {
      html += `<p><strong>All documents have been received!</strong> We are processing your setup now.</p>`;
    }
    html += `<p>Please send us the missing documents so we can finalize your setup.</p>`;
    html += `<p>Best regards</p>`;
    return html;
  }

  let html = `<p>Sehr geehrte/r ${name},</p>`;
  html += `<p>wir warten noch auf einige Unterlagen von Ihnen, um die Einrichtung Ihrer Zahlungsanbindung abzuschliessen.</p>`;
  if (missing.length > 0) {
    html += `<p><strong>Noch fehlend:</strong></p><ul>`;
    missing.forEach(m => html += `<li>${m.label}</li>`);
    html += `</ul>`;
  } else {
    html += `<p><strong>Alle Dokumente sind eingegangen!</strong> Wir bearbeiten Ihre Einrichtung jetzt.</p>`;
  }
  html += `<p>Bitte senden Sie uns die fehlenden Unterlagen, damit wir die Einrichtung fuer Sie abschliessen koennen.</p>`;
  html += `<p>Beste Gruesse</p>`;
  return html;
}

function buildCompleteMail() {
  const name = val('kontaktName') || '[KUNDENNAME]';
  const lang = val('sprache');

  if (lang === 'en') {
    let html = `<p>Dear ${name},</p>`;
    html += `<p>Your payment processing through Adyen has been <strong>successfully set up</strong>.</p>`;
    html += `<p>You will receive a separate email from Adyen shortly with your access credentials for the Adyen Essentials Portal, where you can view your payment overview.</p>`;
    html += `<p>Please don't hesitate to reach out if you have any questions.</p>`;
    html += `<p>Best regards</p>`;
    return html;
  }

  let html = `<p>Sehr geehrte/r ${name},</p>`;
  html += `<p>Ihre Zahlungsanbindung ueber Adyen wurde <strong>erfolgreich eingerichtet</strong>.</p>`;
  html += `<p>Sie erhalten in Kuerze eine separate E-Mail von Adyen mit Ihren Zugangsdaten fuer das Adyen Essentials Portal. Dort koennen Sie Ihre Zahlungsuebersicht einsehen.</p>`;
  html += `<p>Bei Fragen stehe ich Ihnen gerne zur Verfuegung.</p>`;
  html += `<p>Beste Gruesse</p>`;
  return html;
}

function buildRocketChatMsg() {
  const firma = val('firmenname') || '[KUNDENNAME]';
  const merchantName = val('merchantName') || '[MERCHANT_ID]';

  let html = `<p><strong>Nachricht fuer Rocket Chat #general-client-onboarding:</strong></p>`;
  html += `<hr>`;
  html += `<p><code>${firma}</code> is ready for adyen interface connection</p>`;
  html += `<p>[PIPEDRIVE LINK]</p>`;
  html += `<p>Merchant ID = <code>${merchantName}</code></p>`;
  html += `<p>API Key, Client Key und Live prefix: siehe interner Leitfaden Step 6</p>`;
  html += `<hr>`;
  html += `<p><strong>Benoetigte Werte aus dem Adyen Backend:</strong></p><ul>`;
  html += `<li><strong>API Key:</strong> Developers > API Credentials > ws@Company.HotelFriend</li>`;
  html += `<li><strong>Client Key:</strong> Gleicher Ort, runterscrollen</li>`;
  html += `<li><strong>Live Prefix:</strong> Developers > API URLs</li>`;
  html += `<li><strong>Merchant ID:</strong> Copy aus dem Backend</li>`;
  html += `</ul>`;
  return html;
}

// -- RENDER OUTPUT --
function renderOutput() {
  const finalDiv = document.getElementById('finalText');
  const mailType = getMailType();
  let html;

  switch (mailType) {
    case 'initial':   html = buildInitialMail(); break;
    case 'reminder':  html = buildReminderMail(); break;
    case 'complete':  html = buildCompleteMail(); break;
    case 'rocketchat': html = buildRocketChatMsg(); break;
    default: html = buildInitialMail();
  }

  if (currentTab === 'html') {
    const raw = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    finalDiv.innerHTML = `<pre style="font-size:12px;line-height:1.6;color:var(--text2);white-space:pre-wrap;word-break:break-all">${raw}</pre>`;
    return;
  }

  finalDiv.innerHTML = html;
  finalDiv.style.animation = 'none';
  void finalDiv.offsetWidth;
  finalDiv.style.animation = '';
}

// -- COPY --
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', ripple);
copyBtn.addEventListener('click', async function () {
  const mailType = getMailType();
  let html;
  switch (mailType) {
    case 'initial':   html = buildInitialMail(); break;
    case 'reminder':  html = buildReminderMail(); break;
    case 'complete':  html = buildCompleteMail(); break;
    case 'rocketchat': html = buildRocketChatMsg(); break;
    default: html = buildInitialMail();
  }

  const text = new DOMParser().parseFromString(html, 'text/html').body.innerText;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html':  new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([text], { type: 'text/plain' })
      })
    ]);
    this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Kopiert!`;
    this.classList.add('copied');
    setTimeout(() => {
      this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Kopieren`;
      this.classList.remove('copied');
    }, 2200);
  } catch {
    this.textContent = 'Fehler!';
    setTimeout(() => {
      this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Kopieren`;
    }, 2000);
  }
});

// -- SAVE/LOAD LOCAL STORAGE --
function saveData() {
  const data = {};
  document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
    if (el.id) data[el.id] = el.value;
  });
  document.querySelectorAll('.doc-check').forEach(el => {
    data['doc_' + el.dataset.doc] = el.checked;
  });
  localStorage.setItem('adyenKycWizard', JSON.stringify(data));
}

function loadData() {
  const raw = localStorage.getItem('adyenKycWizard');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('doc_')) {
        const docId = key.replace('doc_', '');
        const el = document.querySelector(`.doc-check[data-doc="${docId}"]`);
        if (el) el.checked = value;
      } else {
        const el = document.getElementById(key);
        if (el) el.value = value;
      }
    });
  } catch {}
}

// -- EVENT LISTENERS --
document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
  el.addEventListener('input', () => { saveData(); renderOutput(); });
  el.addEventListener('change', () => { saveData(); renderOutput(); });
});

document.querySelectorAll('.doc-check').forEach(cb => {
  cb.addEventListener('change', () => { updateDocCounts(); saveData(); renderOutput(); });
});

document.querySelectorAll('.mail-radio').forEach(r => {
  r.addEventListener('change', () => renderOutput());
});

// -- INIT --
loadData();
updateDocCounts();
renderOutput();
