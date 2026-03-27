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

// ============================================================
// KUNDEN-VERWALTUNG (Multi-Client LocalStorage)
// ============================================================
const STORAGE_KEY = 'adyenKycClients';
let activeClientId = null;

function getAllClients() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}

function saveAllClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function getClientData(id) {
  return getAllClients()[id] || {};
}

function saveClientData(id, data) {
  const clients = getAllClients();
  if (!data._createdAt) {
    data._createdAt = clients[id]?._createdAt || Date.now();
  }
  clients[id] = data;
  saveAllClients(clients);
}

function deleteClient(id) {
  const clients = getAllClients();
  delete clients[id];
  saveAllClients(clients);
}

function generateId() {
  return 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// -- Filter-State --
let clientSearchQuery = '';
let clientViewMode = 'active'; // 'active' | 'completed' | 'archived' | 'all'

function getClientDocCount(data) {
  const docKeys = ['doc_handelsregister', 'doc_gewerbe', 'doc_ausweis_gf', 'doc_ausweis_ubo', 'doc_adressnachweis', 'doc_kontoauszug', 'doc_pcidss'];
  const checked = docKeys.filter(k => data[k] === true).length;
  return { checked, total: 7 };
}

function getClientDisplayName(data) {
  return data.firmenname || data.kontaktName || 'Neuer Kunde';
}

// -- Formular ↔ Daten --
function collectFormData() {
  const data = {};
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    if (el.id) data[el.id] = el.value;
  });
  document.querySelectorAll('.doc-check').forEach(el => {
    data['doc_' + el.dataset.doc] = el.checked;
  });
  document.querySelectorAll('.status-check').forEach(el => {
    data['status_' + el.dataset.status] = el.checked;
  });
  return data;
}

function applyFormData(data) {
  // Felder leeren
  document.querySelectorAll('.form-group input').forEach(el => { if (el.id) el.value = ''; });
  document.querySelectorAll('.form-group select').forEach(el => { if (el.id) el.selectedIndex = 0; });
  document.querySelectorAll('.form-group textarea').forEach(el => { if (el.id) el.value = ''; });
  document.querySelectorAll('.doc-check').forEach(el => { el.checked = false; });
  document.querySelectorAll('.status-check').forEach(el => { el.checked = false; });

  // Daten einfüllen
  Object.entries(data).forEach(([key, value]) => {
    if (key.startsWith('doc_')) {
      const docId = key.replace('doc_', '');
      const el = document.querySelector(`.doc-check[data-doc="${docId}"]`);
      if (el) el.checked = value;
    } else if (key.startsWith('status_')) {
      const statusId = key.replace('status_', '');
      const el = document.querySelector(`.status-check[data-status="${statusId}"]`);
      if (el) el.checked = value;
    } else {
      const el = document.getElementById(key);
      if (el) el.value = value;
    }
  });
}

function getClientStatusCount(data) {
  const statusKeys = ['status_mail_gesendet','status_docs_geprueft','status_merchant_angelegt','status_pci_docusign','status_merchant_request','status_adyen_freigabe','status_terminal_zugewiesen','status_backend_config','status_dev_benachrichtigt','status_user_erstellt'];
  const checked = statusKeys.filter(k => data[k] === true).length;
  return { checked, total: 10 };
}

function saveCurrentClient() {
  if (!activeClientId) return;
  const data = collectFormData();
  saveClientData(activeClientId, data);
  renderClientSelector();
}

function switchToClient(id) {
  activeClientId = id;
  localStorage.setItem('adyenKycActiveClient', id);
  const data = getClientData(id);
  applyFormData(data);
  updateDocCounts();
  updateStatusCount();
  renderOutput();
  renderClientSelector();
}

function createNewClient() {
  // Aktuellen Kunden speichern
  if (activeClientId) saveCurrentClient();

  const id = generateId();
  saveClientData(id, {});
  switchToClient(id);
  showStep(1);
  // Fokus auf Firmenname
  document.getElementById('firmenname')?.focus();
}

function archiveClient(id) {
  const clients = getAllClients();
  if (!clients[id]) return;
  clients[id]._archived = !clients[id]._archived;
  saveAllClients(clients);
  // Wenn archivierter Kunde aktiv war, zum nächsten aktiven wechseln
  if (clients[id]._archived && id === activeClientId) {
    const activeIds = Object.keys(clients).filter(k => !clients[k]._archived);
    if (activeIds.length > 0) {
      switchToClient(activeIds[0]);
    } else {
      createNewClient();
    }
  }
  renderClientSelector();
}

function removeClient(id) {
  const clients = getAllClients();
  const name = getClientDisplayName(clients[id] || {});
  if (!confirm(`"${name}" wirklich endgültig löschen?`)) return;

  deleteClient(id);
  const remaining = Object.keys(getAllClients());
  if (remaining.length > 0) {
    switchToClient(remaining[0]);
  } else {
    createNewClient();
  }
}

function getClientDaysOld(data) {
  if (!data._createdAt) return 0;
  return Math.floor((Date.now() - data._createdAt) / (1000 * 60 * 60 * 24));
}

// -- Client Selector rendern --
function renderClientSelector() {
  const container = document.getElementById('clientSelector');
  const clients = getAllClients();
  const allIds = Object.keys(clients);

  // Suche + Filter
  const query = clientSearchQuery.toLowerCase();
  const filteredIds = allIds.filter(id => {
    const data = clients[id];
    const isArchived = !!data._archived;
    const isCompleted = !!data._completed;

    // Filter
    if (clientViewMode === 'active' && (isArchived || isCompleted)) return false;
    if (clientViewMode === 'completed' && !isCompleted) return false;
    if (clientViewMode === 'archived' && !isArchived) return false;

    // Suchfilter
    if (query) {
      const name = getClientDisplayName(data).toLowerCase();
      const email = (data.kontaktEmail || '').toLowerCase();
      const merchant = (data.merchantName || '').toLowerCase();
      return name.includes(query) || email.includes(query) || merchant.includes(query);
    }
    return true;
  });

  let html = '';

  // Suchfeld
  html += `<input type="text" class="client-search" id="clientSearch" placeholder="Kunde suchen..." value="${clientSearchQuery}">`;

  // Archiv-Toggle
  const activeCount = allIds.filter(id => !clients[id]._archived && !clients[id]._completed).length;
  const completedCount = allIds.filter(id => clients[id]._completed && !clients[id]._archived).length;
  const archivedCount = allIds.filter(id => clients[id]._archived).length;
  html += `<div class="archive-toggle">`;
  html += `<button class="archive-toggle-btn ${clientViewMode === 'active' ? 'active' : ''}" data-mode="active">Aktiv (${activeCount})</button>`;
  html += `<button class="archive-toggle-btn ${clientViewMode === 'completed' ? 'active' : ''}" data-mode="completed">Fertig (${completedCount})</button>`;
  html += `<button class="archive-toggle-btn ${clientViewMode === 'archived' ? 'active' : ''}" data-mode="archived">Archiv (${archivedCount})</button>`;
  html += `</div>`;

  html += '<div class="client-list">';

  filteredIds.forEach(id => {
    const data = clients[id];
    const name = getClientDisplayName(data);
    const { checked, total } = getClientDocCount(data);
    const pct = Math.round((checked / total) * 100);
    const isActive = id === activeClientId;
    const isArchived = !!data._archived;
    const statusClass = checked === total ? 'complete' : checked > 0 ? 'progress' : '';
    const daysOld = getClientDaysOld(data);
    const needsReminder = !isArchived && checked < total && daysOld >= 5;

    const isCompleted = !!data._completed;
    let classes = 'client-item';
    if (isActive) classes += ' active';
    if (isArchived) classes += ' archived';
    if (isCompleted) classes += ' completed';

    html += `<div class="${classes}" data-id="${id}">`;
    html += `  <div class="client-info" data-id="${id}">`;
    html += `    <span class="client-name">${name}</span>`;
    html += `    <div style="display:flex;align-items:center;gap:5px">`;
    if (needsReminder) {
      html += `<span class="client-reminder">${daysOld}d</span>`;
    }
    html += `    <span class="client-status ${statusClass}">${checked}/${total}</span>`;
    html += `    </div>`;
    html += `  </div>`;
    html += `  <div class="client-bar"><div class="client-bar-fill" style="width:${pct}%"></div></div>`;
    html += `  <button class="client-archive" data-id="${id}" title="${isArchived ? 'Wiederherstellen' : 'Archivieren'}">${isArchived ? '↩' : '📦'}</button>`;
    html += `  <button class="client-delete" data-id="${id}" title="Endgültig löschen">×</button>`;
    html += `</div>`;
  });

  if (filteredIds.length === 0) {
    html += `<div style="padding:12px;text-align:center;font-size:12px;color:var(--text3)">Keine Kunden gefunden</div>`;
  }

  html += '</div>';
  if (clientViewMode !== 'archived') {
    html += '<button class="client-add" id="addClientBtn">+ Neuer Kunde</button>';
  }

  container.innerHTML = html;

  // Event Listeners
  container.querySelectorAll('.client-info').forEach(el => {
    el.addEventListener('click', () => {
      if (activeClientId) saveCurrentClient();
      switchToClient(el.dataset.id);
    });
  });
  container.querySelectorAll('.client-archive').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      archiveClient(el.dataset.id);
    });
  });
  container.querySelectorAll('.client-delete').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      removeClient(el.dataset.id);
    });
  });
  document.getElementById('addClientBtn')?.addEventListener('click', createNewClient);

  // Suchfeld
  document.getElementById('clientSearch')?.addEventListener('input', (e) => {
    clientSearchQuery = e.target.value;
    renderClientSelector();
    // Fokus zurück aufs Suchfeld
    const searchEl = document.getElementById('clientSearch');
    if (searchEl) { searchEl.focus(); searchEl.selectionStart = searchEl.selectionEnd = searchEl.value.length; }
  });

  // Archiv-Toggle
  container.querySelectorAll('.archive-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      clientViewMode = btn.dataset.mode;
      renderClientSelector();
    });
  });

  // Topbar Kundenanzahl (nur aktive)
  document.getElementById('clientCount').textContent = activeCount + completedCount;
}

// -- MIGRATION: Alte Single-Client-Daten übernehmen --
function migrateOldData() {
  const oldRaw = localStorage.getItem('adyenKycWizard');
  if (!oldRaw) return;
  try {
    const oldData = JSON.parse(oldRaw);
    if (Object.keys(oldData).length > 0) {
      const id = generateId();
      saveClientData(id, oldData);
      activeClientId = id;
      localStorage.setItem('adyenKycActiveClient', id);
    }
    localStorage.removeItem('adyenKycWizard');
  } catch {}
}

// ============================================================
// STEP NAVIGATION
// ============================================================
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
  document.getElementById('progressText').textContent = `Schritt ${n}/4`;
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
  ausweis_gf: 'Ausweiskopie des Geschäftsführers (Reisepass oder Personalausweis, Vorder- und Rückseite)',
  ausweis_ubo: 'Ausweiskopie(n) der wirtschaftlich Berechtigten (>25% Anteil)',
  adressnachweis: 'Adressnachweis der wirtschaftlich Berechtigten (z.B. Nebenkostenabrechnung, nicht älter als 3 Monate)',
  kontoauszug: 'Kontoauszug (mit Banklogo, IBAN und Firmenname, nicht älter als 12 Monate, kein App-Screenshot)',
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

// ============================================================
// BUILD MAIL HTML
// ============================================================
function buildInitialMail() {
  const name = val('kontaktName') || '[KUNDENNAME]';
  const firma = val('firmenname') || '[FIRMENNAME]';
  const lang = val('sprache');

  if (lang === 'en') {
    let html = `<p>Dear ${name},</p>`;
    html += `<p>To set up your payment processing through our partner Adyen, we need some documents from you. <strong>We will handle the entire setup for you</strong> – you only need to send us the following documents.</p>`;
    html += `<h3>What we need from you:</h3>`;
    html += `<p><strong>1. Company documents:</strong></p><ul>`;
    html += `<li>Current extract from the commercial register (Handelsregisterauszug) – all pages</li>`;
    html += `<li>Business registration certificate (Gewerbeanmeldung) – all pages including signature</li></ul>`;
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
  html += `<p>für die Einrichtung Ihrer Zahlungsanbindung über unseren Partner Adyen benötigen wir einige Unterlagen von Ihnen. <strong>Wir übernehmen die komplette Einrichtung für Sie</strong> – Sie müssen lediglich die folgenden Dokumente an uns senden.</p>`;
  html += `<h3>Was wir von Ihnen benötigen:</h3>`;
  html += `<p><strong>1. Firmendokumente:</strong></p><ul>`;
  html += `<li>Aktueller Handelsregisterauszug (alle Seiten)</li>`;
  html += `<li>Gewerbeanmeldung oder Gewerbeschein (alle Seiten inkl. Unterschrift)</li></ul>`;
  html += `<p><strong>2. Ausweiskopie des Geschäftsführers:</strong></p><ul>`;
  html += `<li>Reisepass ODER Personalausweis (Vorder- und Rückseite)</li></ul>`;
  html += `<p><strong>3. Wirtschaftlich Berechtigte (Personen mit mehr als 25% Firmenanteil):</strong></p><ul>`;
  html += `<li>Name, Geburtsdatum und Anteil in Prozent</li>`;
  html += `<li>Ausweiskopie (Reisepass oder Personalausweis, beidseitig)</li>`;
  html += `<li>Adressnachweis (z.B. Nebenkostenabrechnung oder Steuerbescheid, nicht älter als 3 Monate)</li></ul>`;
  html += `<p><strong>4. Bankverbindung für Auszahlungen:</strong></p><ul>`;
  html += `<li>IBAN und Name des Kontoinhabers</li>`;
  html += `<li>Kontoauszug als Nachweis (mit sichtbarem Banklogo, IBAN und Kontoinhabername)</li>`;
  html += `<li>Bitte einen offiziellen Kontoauszug verwenden, kein Screenshot aus einer Banking-App</li>`;
  html += `<li>Der Auszug darf nicht älter als 12 Monate sein</li></ul>`;
  html += `<p><strong>Hinweise zu den Dokumenten:</strong></p><ul>`;
  html += `<li>Fotos/Scans bitte als <strong>JPEG oder PNG</strong> senden</li>`;
  html += `<li>Dateien müssen zwischen <strong>100 KB und 4 MB</strong> groß sein</li>`;
  html += `<li>Dokumente müssen <strong>gut lesbar</strong> und <strong>vollständig</strong> sein</li></ul>`;
  html += `<p>Sobald wir alle Unterlagen erhalten haben, kümmern wir uns um die komplette Einrichtung. Sie werden von uns informiert, sobald alles abgeschlossen ist.</p>`;
  html += `<p>Bei Fragen stehe ich Ihnen gerne zur Verfügung.</p>`;
  html += `<p>Beste Grüße</p>`;
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
  html += `<p>wir warten noch auf einige Unterlagen von Ihnen, um die Einrichtung Ihrer Zahlungsanbindung abzuschließen.</p>`;
  if (missing.length > 0) {
    html += `<p><strong>Noch fehlend:</strong></p><ul>`;
    missing.forEach(m => html += `<li>${m.label}</li>`);
    html += `</ul>`;
  } else {
    html += `<p><strong>Alle Dokumente sind eingegangen!</strong> Wir bearbeiten Ihre Einrichtung jetzt.</p>`;
  }
  html += `<p>Bitte senden Sie uns die fehlenden Unterlagen, damit wir die Einrichtung für Sie abschließen können.</p>`;
  html += `<p>Beste Grüße</p>`;
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
  html += `<p>Ihre Zahlungsanbindung über Adyen wurde <strong>erfolgreich eingerichtet</strong>.</p>`;
  html += `<p>Sie erhalten in Kürze eine separate E-Mail von Adyen mit Ihren Zugangsdaten für das Adyen Essentials Portal. Dort können Sie Ihre Zahlungsübersicht einsehen.</p>`;
  html += `<p>Bei Fragen stehe ich Ihnen gerne zur Verfügung.</p>`;
  html += `<p>Beste Grüße</p>`;
  return html;
}

function buildPciDssMail() {
  const name = val('kontaktName') || '[KUNDENNAME]';
  const firma = val('firmenname') || '[FIRMENNAME]';
  const merchantName = val('merchantName') || '[ACCOUNT_NAME]';
  const lang = val('sprache');

  if (lang === 'en') {
    let html = `<p>Dear ${name},</p>`;
    html += `<p>As part of the Adyen onboarding, you will receive a link to the <strong>PCI DSS Self-Assessment Questionnaire A (SAQ A)</strong>. This document needs to be filled out and signed by you.</p>`;
    html += `<p><strong>Don't worry – it looks more complex than it is.</strong> The document is about 30 pages long, but most of it is already pre-filled. Below you will find a detailed summary and step-by-step instructions.</p>`;

    html += `<h3>1. What is this document?</h3>`;
    html += `<ul>`;
    html += `<li>The SAQ A is <strong>not an additional contract</strong>, but the so-called PCI DSS Self-Assessment Questionnaire A – a standardized self-assessment for PCI DSS compliance (Payment Card Industry Data Security Standard).</li>`;
    html += `<li>PCI DSS is the international security standard for handling credit card data. <strong>Every company</strong> that accepts card payments must comply – this applies equally to small boutique hotels and large chains.</li>`;
    html += `<li>The questionnaire is in version 4.0.1 (as of January 2025) and is specifically designed for merchants who outsource all card data processing to a PCI-certified service provider like Adyen and do not electronically store, process, or transmit any card data themselves.</li>`;
    html += `<li>Since you outsource all card data processing to Adyen, the questionnaire is <strong>largely pre-filled</strong> for you.</li>`;
    html += `</ul>`;

    html += `<h3>2. What you confirm by signing</h3>`;
    html += `<p>By signing, you essentially confirm the following:</p>`;

    html += `<p><strong>a) Outsourcing of card data processing</strong></p>`;
    html += `<ul>`;
    html += `<li>You only accept card-not-present (e-commerce) transactions through Adyen.</li>`;
    html += `<li>Storage, processing and transmission of card data is handled entirely by Adyen or other PCI-compliant service providers – not on your own systems.</li>`;
    html += `<li>You do not electronically store any card data on your own systems or servers.</li>`;
    html += `</ul>`;

    html += `<p><strong>b) Payment page and technical integration</strong></p>`;
    html += `<ul>`;
    html += `<li>Your checkout page is set up so that all sensitive parts (forms, payment fields, etc.) are delivered directly from Adyen or another PCI-compliant payment service provider (e.g. via redirect or embedded payment forms/iframes).</li>`;
    html += `<li>You ensure that your website is not susceptible to script-based attacks that could manipulate the payment page or intercept card data (e.g. through regular updates, security patches, and basic protective measures).</li>`;
    html += `</ul>`;

    html += `<p><strong>c) Third-party service providers</strong></p>`;
    html += `<ul>`;
    html += `<li>You maintain a list of all service providers that could see card data in your payment flow or affect the security of your payment environment (e.g. hosting provider, payment service provider).</li>`;
    html += `<li>You confirm that these service providers are PCI-compliant and that written agreements exist with clearly defined responsibilities for the protection of card data (e.g. the Adyen Merchant Agreement).</li>`;
    html += `</ul>`;

    html += `<p><strong>d) Basic security measures in your organization</strong></p>`;
    html += `<ul>`;
    html += `<li>No default passwords/accounts are still active – all default access has been removed or securely changed.</li>`;
    html += `<li>All users have individual logins (no generic/shared accounts), and access is immediately revoked when employees leave the company or change roles.</li>`;
    html += `<li>Strong passwords and where necessary multi-factor authentication (MFA) for access to relevant systems.</li>`;
    html += `<li>You monitor security advisories and install security updates and patches promptly, especially for critical vulnerabilities.</li>`;
    html += `<li>You perform regular external vulnerability scans by a PCI-approved scanning vendor (ASV) at least once per quarter and after significant changes.</li>`;
    html += `</ul>`;

    html += `<p><strong>e) Handling of paper records</strong></p>`;
    html += `<ul>`;
    html += `<li>If you had paper receipts or reports with complete card data, they would be securely stored (e.g. in locked cabinets) and securely destroyed after the retention period (e.g. cross-cut shredder).</li>`;
    html += `<li>In the present document, it is already noted that you factually do not store card data, therefore many of these points are marked as <em>"not applicable"</em>.</li>`;
    html += `</ul>`;

    html += `<p><strong>f) Incident response plan</strong></p>`;
    html += `<ul>`;
    html += `<li>You have an incident response plan for security incidents, which includes: who does what, who you inform (including Adyen), and how you secure business operations and data in case of a security incident.</li>`;
    html += `</ul>`;

    html += `<h3>3. Document structure – what you actually need to do</h3>`;
    html += `<ul>`;
    html += `<li><strong>First pages (Section 1):</strong> Master data for your company (name, address, website, contact person), description of payment processes and involved service providers. All empty red-marked fields must be filled in by you.</li>`;
    html += `<li>In the field <strong>"Adyen Company Account Name"</strong> please enter: <code>${merchantName}</code></li>`;
    html += `<li>At two places you will be asked for <strong>"URL"</strong> or <strong>"Website URL(s)"</strong>. Please enter the website where you will sell with Adyen as payment service provider.</li>`;
    html += `<li><strong>Middle section (Section 2-3):</strong> Security questionnaire. The questions about security measures (passwords, scans, third parties, incident response, etc.) are <strong>already pre-filled</strong> in the Adyen-provided version. You only need to review and if necessary correct/supplement.</li>`;
    html += `<li><strong>Last pages (Section 3, Part 3b):</strong> Attestation of Compliance – the confirmation that must be <strong>signed by an authorized person</strong> (e.g. Managing Director, CTO, or IT Manager) with name and date.</li>`;
    html += `</ul>`;

    html += `<h3>4. Should you fill out this document?</h3>`;
    html += `<p>Yes. Every legally independent company that uses its own merchant account at Adyen must submit its own PCI SAQ A. This document is part of the standard PCI obligations for your online business.</p>`;

    html += `<p>If you have any questions while filling out the form, please don't hesitate to contact me.</p>`;
    html += `<p>Best regards</p>`;
    return html;
  }

  let html = `<p>Sehr geehrte/r ${name},</p>`;
  html += `<p>im Rahmen des Adyen-Onboardings erhalten Sie einen Link zum <strong>PCI DSS Self-Assessment Questionnaire A (SAQ A)</strong>. Dieses Dokument muss von Ihnen ausgefüllt und unterschrieben werden.</p>`;
  html += `<p><strong>Keine Sorge – es sieht komplizierter aus als es ist.</strong> Das Dokument umfasst ca. 30 Seiten, aber das meiste ist bereits vorausgefüllt. Im Folgenden finden Sie eine ausführliche Zusammenfassung und eine Schritt-für-Schritt-Anleitung.</p>`;

  html += `<h3>1. Worum geht es bei dem Dokument?</h3>`;
  html += `<ul>`;
  html += `<li>Das Dokument ist <strong>kein zusätzlicher Vertrag</strong>, sondern der sogenannte PCI DSS Self-Assessment Questionnaire A (SAQ A) – eine standardisierte Selbstauskunft zur PCI DSS Compliance (Payment Card Industry Data Security Standard).</li>`;
  html += `<li>PCI DSS ist der internationale Sicherheitsstandard für den Umgang mit Kreditkartendaten. <strong>Alle Unternehmen</strong>, die Kartenzahlungen akzeptieren, müssen diesen Standard erfüllen – daher ist Adyen verpflichtet, diese Selbstauskunft von Ihnen einzuholen.</li>`;
  html += `<li>Der Fragebogen liegt in der Version 4.0.1 (Stand Januar 2025) vor und ist speziell für Händler gedacht, die alle Kartendatenverarbeitung an einen PCI-zertifizierten Dienstleister wie Adyen auslagern und selbst keine Kartendaten elektronisch speichern, verarbeiten oder übertragen.</li>`;
  html += `<li>Da Sie die gesamte Kartendatenverarbeitung an Adyen auslagern, ist der Fragebogen <strong>größtenteils bereits für Sie vorausgefüllt</strong>.</li>`;
  html += `</ul>`;

  html += `<h3>2. Was Sie mit Ihrer Unterschrift bestätigen</h3>`;
  html += `<p>Mit Ihrer Unterschrift bestätigen Sie im Wesentlichen Folgendes:</p>`;

  html += `<p><strong>a) Auslagerung der Kartendatenverarbeitung</strong></p>`;
  html += `<ul>`;
  html += `<li>Sie akzeptieren nur E-Commerce / card-not-present Zahlungen über Adyen.</li>`;
  html += `<li>Speicherung, Verarbeitung und Übermittlung von Kartendaten erfolgt vollständig bei Adyen bzw. anderen PCI-konformen Dienstleistern – nicht auf Ihren eigenen Systemen.</li>`;
  html += `<li>Sie speichern keine Kartendaten elektronisch in Ihren eigenen Systemen oder auf Ihren Servern.</li>`;
  html += `</ul>`;

  html += `<p><strong>b) Zahlungsseite und technische Anbindung</strong></p>`;
  html += `<ul>`;
  html += `<li>Ihre Bezahlseite ist so aufgebaut, dass alle sensiblen Teile (Formulare, Zahlungsfelder etc.) direkt von Adyen bzw. einem anderen PCI-konformen Zahlungsdienstleister geliefert werden (z.B. durch Redirect oder eingebettete Zahlungsformulare/iframes).</li>`;
  html += `<li>Sie stellen sicher, dass Ihre Website nicht für Script-Angriffe anfällig ist, die die Zahlungsseite manipulieren oder Kartendaten abgreifen könnten (z.B. durch regelmäßige Updates, Sicherheitspatches und grundlegende Schutzmaßnahmen).</li>`;
  html += `</ul>`;

  html += `<p><strong>c) Umgang mit Dritten (Third-Party Service Provider)</strong></p>`;
  html += `<ul>`;
  html += `<li>Sie führen eine Liste aller Dienstleister, die in Ihrem Zahlungsprozess Kartendaten sehen könnten oder die Sicherheit Ihrer Zahlungsumgebung beeinflussen (z.B. Hosting-Provider, Zahlungsdienstleister).</li>`;
  html += `<li>Sie bestätigen, dass diese Dienstleister PCI-konform sind und dass es schriftliche Vereinbarungen mit klar geregelten Verantwortlichkeiten beim Schutz der Kartendaten gibt (z.B. der Vertrag mit Adyen).</li>`;
  html += `</ul>`;

  html += `<p><strong>d) Basis-Sicherheitsmaßnahmen in Ihrem Unternehmen</strong></p>`;
  html += `<ul>`;
  html += `<li>Keine Standardpasswörter / Standardkonten mehr aktiv – alle Standard-Zugänge wurden entfernt oder sicher geändert.</li>`;
  html += `<li>Alle Benutzer haben individuelle Logins (keine generischen/Shared Accounts), und Zugänge werden sofort entzogen, wenn Mitarbeiter das Unternehmen verlassen oder die Rolle wechseln.</li>`;
  html += `<li>Starke Passwörter und wo nötig Multi-Faktor-Authentifizierung (MFA) für Zugriffe auf relevante Systeme.</li>`;
  html += `<li>Sie verfolgen Sicherheitsmeldungen (z.B. über bekannte Schwachstellen) und spielen Sicherheits-Updates und Patches zeitnah ein, insbesondere bei kritischen Lücken.</li>`;
  html += `<li>Sie führen regelmäßig externe Schwachstellenscans durch einen PCI-zugelassenen Scannerdienst (ASV) durch (mindestens einmal pro Quartal und nach größeren Änderungen an der Umgebung).</li>`;
  html += `</ul>`;

  html += `<p><strong>e) Umgang mit physischen Unterlagen (Papier)</strong></p>`;
  html += `<ul>`;
  html += `<li>Falls Sie Papierbelege oder Auswertungen mit vollständigen Kartendaten hätten, würden diese sicher aufbewahrt (z.B. in verschlossenen Schränken) und nach Ablauf der Aufbewahrungsfrist sicher vernichtet (z.B. Kreuzschnitt-Schredder).</li>`;
  html += `<li>Im vorliegenden Dokument ist bereits vermerkt, dass Sie faktisch keine Kartendaten speichern, daher sind viele dieser Punkte als <em>„nicht anwendbar"</em> markiert.</li>`;
  html += `</ul>`;

  html += `<p><strong>f) Incident-Response / Notfallplan</strong></p>`;
  html += `<ul>`;
  html += `<li>Sie verfügen über einen Incident-Response-Plan für Sicherheitsvorfälle, der u.a. regelt: wer was tut, wen Sie informieren (inkl. Adyen), wie Sie Geschäftsbetrieb und Daten sichern, falls es doch einmal zu einem Sicherheitsvorfall kommen sollte.</li>`;
  html += `</ul>`;

  html += `<h3>3. Aufbau des Dokuments – was Sie tatsächlich tun müssen</h3>`;
  html += `<ul>`;
  html += `<li><strong>Erste Seiten (Section 1):</strong> Stammdaten zu Ihrem Unternehmen (Name, Adresse, Website, Kontaktperson), Beschreibung der Zahlungsprozesse und der involvierten Dienstleister. Sämtliche leeren rot markierten Felder müssen von Ihnen ausgefüllt werden.</li>`;
  html += `<li>Im Feld <strong>„Adyen Company Account Name"</strong> tragen Sie bitte ein: <code>${merchantName}</code></li>`;
  html += `<li>An zwei Stellen werden Sie nach <strong>„URL"</strong> bzw. <strong>„Website URL(s)"</strong> gefragt. Dort tragen Sie bitte jeweils die Webseite ein, auf der Sie künftig mit Adyen als Zahlungsdienstleister verkaufen wollen.</li>`;
  html += `<li><strong>Mittlerer Teil (Section 2-3):</strong> Fragenkatalog zu den oben genannten Sicherheitsmaßnahmen (Passwörter, Scans, Umgang mit Dritten, Incident-Response etc.). Viele Felder sind bei der von Adyen bereitgestellten Version <strong>bereits automatisch ausgefüllt</strong> oder vorkonfiguriert; Sie müssen diese Angaben nur prüfen und ggf. ergänzen/korrigieren.</li>`;
  html += `<li><strong>Letzte Seiten (Section 3, Part 3b):</strong> Attestation of Compliance / Bestätigung – hier muss eine <strong>zeichnungsberechtigte Person</strong> (z.B. Geschäftsführer, CTO oder IT-Verantwortlicher) mit Name und Datum unterschreiben.</li>`;
  html += `</ul>`;

  html += `<h3>4. Muss ich das Dokument ausfüllen?</h3>`;
  html += `<p>Ja. Jede rechtlich eigenständige Gesellschaft, die ein eigenes Händlerkonto bei Adyen nutzt, muss ihren eigenen PCI SAQ A abgeben. Das Dokument ist Teil der Standard-PCI-Pflichten für Ihren Online-Geschäftsbetrieb.</p>`;

  html += `<p>Falls Sie beim Ausfüllen Fragen haben, melden Sie sich gerne bei mir.</p>`;
  html += `<p>Beste Grüße</p>`;
  return html;
}

function buildRocketChatMsg() {
  const firma = val('firmenname') || '[KUNDENNAME]';
  const merchantName = val('merchantName') || '[MERCHANT_ID]';

  let html = `<p><strong>Nachricht für Rocket Chat #general-client-onboarding:</strong></p>`;
  html += `<hr>`;
  html += `<p><code>${firma}</code> is ready for adyen interface connection</p>`;
  html += `<p>[PIPEDRIVE LINK]</p>`;
  html += `<p>Merchant ID = <code>${merchantName}</code></p>`;
  html += `<hr>`;
  html += `<p><strong>Hinweis:</strong> API Key, Client Key und Live Prefix sind für jeden Kunden gleich – siehe interner Leitfaden (03_Interner_Leitfaden.md, Schritt 9).</p>`;
  html += `<p><strong>Kundenspezifisch eintragen:</strong></p><ul>`;
  html += `<li><strong>Merchant ID:</strong> Copy aus dem Adyen Backend</li>`;
  html += `<li><strong>Terminal Name:</strong> Frei wählbar (Standort für Rezeption)</li>`;
  html += `<li><strong>Sale ID:</strong> Frei wählbar (unser Identifier)</li>`;
  html += `<li><strong>POIID:</strong> In-person payments > Terminals > Gerät anklicken</li>`;
  html += `</ul>`;
  return html;
}

// -- ZENTRALE MAIL-FUNKTION --
function getMailHtml(mailType) {
  switch (mailType) {
    case 'initial':    return buildInitialMail();
    case 'reminder':   return buildReminderMail();
    case 'complete':   return buildCompleteMail();
    case 'pcidss':     return buildPciDssMail();
    case 'rocketchat': return buildRocketChatMsg();
    default:           return buildInitialMail();
  }
}

// -- RENDER OUTPUT --
function renderOutput() {
  const finalDiv = document.getElementById('finalText');
  const html = getMailHtml(getMailType());

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
  const html = getMailHtml(getMailType());
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

// -- EVENT LISTENERS --
document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
  el.addEventListener('input', () => { saveCurrentClient(); renderOutput(); });
  el.addEventListener('change', () => { saveCurrentClient(); renderOutput(); });
});

document.querySelectorAll('.doc-check').forEach(cb => {
  cb.addEventListener('change', () => { updateDocCounts(); saveCurrentClient(); renderOutput(); });
});

document.querySelectorAll('.status-check').forEach(cb => {
  cb.addEventListener('change', () => {
    updateStatusCount();
    saveCurrentClient();
    checkCompletion();
  });
});

document.querySelectorAll('.doc-date').forEach(el => {
  el.addEventListener('change', () => { saveCurrentClient(); });
});

document.getElementById('kundenNotizen')?.addEventListener('input', () => { saveCurrentClient(); });

document.querySelectorAll('.mail-radio').forEach(r => {
  r.addEventListener('change', () => renderOutput());
});

function updateStatusCount() {
  const checks = document.querySelectorAll('.status-check');
  const checked = [...checks].filter(c => c.checked).length;
  const el = document.getElementById('count-status');
  if (el) el.textContent = `${checked}/${checks.length}`;
}

function checkCompletion() {
  if (!activeClientId) return;
  const data = collectFormData();
  const { checked, total } = getClientStatusCount(data);
  const clients = getAllClients();
  const wasCompleted = clients[activeClientId]?._completed;

  if (checked === total && !wasCompleted) {
    // Gerade fertig geworden!
    clients[activeClientId] = { ...clients[activeClientId], ...data, _completed: true };
    saveAllClients(clients);
    renderClientSelector();
    launchConfetti();
  }
}

function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#0abf53', '#5a9af7', '#f59e0b', '#ef4444', '#a855f7', '#22c55e', '#3b82f6', '#ec4899'];

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = (Math.random() * 8 + 5) + 'px';
    piece.style.height = (Math.random() * 8 + 5) + 'px';
    piece.style.animationDelay = Math.random() * 1.5 + 's';
    piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}

// ============================================================
// INIT
// ============================================================
migrateOldData();

const clients = getAllClients();
const savedActiveId = localStorage.getItem('adyenKycActiveClient');

if (savedActiveId && clients[savedActiveId]) {
  switchToClient(savedActiveId);
} else if (Object.keys(clients).length > 0) {
  switchToClient(Object.keys(clients)[0]);
} else {
  createNewClient();
}

updateDocCounts();
updateStatusCount();
renderOutput();

// ============================================================
// EXPORT / IMPORT
// ============================================================
document.getElementById('exportBtn')?.addEventListener('click', () => {
  const clients = getAllClients();
  const json = JSON.stringify(clients, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `adyen-kunden-backup_${date}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById('importBtn')?.addEventListener('click', () => {
  document.getElementById('importFile')?.click();
});

document.getElementById('importFile')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const imported = JSON.parse(ev.target.result);
      const existing = getAllClients();
      let count = 0;
      Object.entries(imported).forEach(([id, data]) => {
        if (!existing[id]) {
          existing[id] = data;
          count++;
        }
      });
      saveAllClients(existing);
      renderClientSelector();
      alert(`${count} neue Kunden importiert. ${Object.keys(imported).length - count} bereits vorhanden.`);
    } catch {
      alert('Fehler: Ungültige JSON-Datei.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});
