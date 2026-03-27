# Adyen KYC Onboarding – Länderunterschiede

## Übersicht

Die Grundstruktur ist überall gleich: **Identität + Firma + Bank + UBOs**.
Was sich ändert, sind die **akzeptierten Dokumenttypen**, Registernummern-Formate und länderspezifische Besonderheiten.

> **Wichtig:** Dieses Dokument enthält detaillierte Checklisten für alle aktuell unterstützten Länder.
> Die allgemeinen Anforderungen (Dateiformate, PCI DSS, Webhook-Konfiguration) gelten länderübergreifend – siehe unten.

---

## Länderübergreifende Anforderungen (gelten für ALLE Länder)

| Anforderung | Wert |
|---|---|
| **Dateiformate** | JPEG, JPG, PNG (100 KB – 4 MB) |
| **Kontoauszug max. Alter** | 12 Monate |
| **Adressnachweis max. Alter** | 3 Monate (Nebenkostenrechnung) / 12 Monate (behördliche Dokumente) |
| **PCI DSS SAQ-A** | Immer erforderlich, per DocuSign |
| **UBO-Schwelle** | >25% Anteil am Unternehmen |
| **Ausweis** | Muss gültig sein, physisches Dokument (kein digitales), Vorder- + Rückseite |

---

## 🇩🇪 Deutschland (DE)

### 1. Firmenregistrierungsdokument
- **Name:** Handelsregisterauszug (chronologisch/aktuell)
- **Quelle:** [handelsregister.de](https://www.handelsregister.de) oder zuständiges Amtsgericht
- **Inhalt:** Firmenname, Rechtsform, Sitz, Geschäftsführer, Stammkapital
- **Hinweis:** Alle Seiten erforderlich, inkl. Unterschriftsseite

### 2. Registernummer-Format
- **Format:** `HRB 100484` oder `HRA 12345` (2–3 Buchstaben + Ziffern)
- **Erklärung:** HRB = Handelsregister Abteilung B (Kapitalgesellschaften), HRA = Abteilung A (Personengesellschaften)

### 3. Gewerbe-/Gründungsdokument
- **Name:** Gewerbeanmeldung (GewA 1 oder GewA 2) oder Gewerbeschein
- **Quelle:** Zuständiges Gewerbeamt / Ordnungsamt
- **Hinweis:** Alle Seiten inkl. Unterschriftsseite hochladen, kein Ablaufdatum

### 4. Ausweisdokumente
- **Akzeptiert:** Personalausweis oder Reisepass
- **Besonderheiten:** Keine – Standard-EU-Regeln

### 5. UBO-Register
- **Name:** Transparenzregister
- **URL:** [transparenzregister.de](https://www.transparenzregister.de)
- **Hinweis:** Seit 2022 Vollregister, alle Gesellschaften meldepflichtig

### 6. Adressnachweis
- **Akzeptiert:** Nebenkostenabrechnung, Steuerbescheid, Kontoauszug
- **Nicht akzeptiert:** Mobilfunkrechnung, Amazon-Rechnung, Paketdienstbelege

### 7. Kontoauszug
- **Anforderungen:** Banklogo, IBAN, Kontoinhaber (muss mit Firmenname übereinstimmen)
- **Max. Alter:** 12 Monate
- **Kein** Screenshot aus Mobile-Banking-App

### 8. Steuer-ID-Format
- **USt-IdNr.:** `DE 115235681` (DE + 9 Ziffern, Leerzeichen optional)
- **Persönliche IdNr.:** 11-stellig (für natürliche Personen)

---

## 🇦🇹 Österreich (AT)

### 1. Firmenregistrierungsdokument
- **Name:** Firmenbuchauszug
- **Quelle:** [justiz.gv.at](https://www.justiz.gv.at) (JustizOnline) oder zuständiges Landesgericht
- **Inhalt:** Firmenname, Rechtsform, Sitz, Geschäftsführer, Gesellschafter, Stammkapital
- **Für Einzelunternehmer:** GISA-Auszug (Gewerbeinformationssystem Austria)

### 2. Registernummer-Format
- **Format:** `FN 123456m` (FN + 3–6 Ziffern + 1 Kleinbuchstabe als Prüfzeichen)
- **Hinweis:** Die FN-Nummer bleibt lebenslang gleich, auch bei Änderungen (Adresse, Name, Rechtsform)

### 3. Gewerbe-/Gründungsdokument
- **Name:** GISA-Auszug (Gewerbeinformationssystem Austria)
- **Quelle:** [gisa.gv.at](https://www.gisa.gv.at) – kostenlose Online-Abfrage
- **Hinweis:** Seit 2015 ersetzt GISA die 14 dezentralen Gewerberegister Österreichs

### 4. Ausweisdokumente
- **Akzeptiert:** Personalausweis oder Reisepass
- **Besonderheiten:** Österreichische Personalausweise sind 10 Jahre gültig, Reisepässe ebenfalls 10 Jahre

### 5. UBO-Register
- **Name:** Register der wirtschaftlichen Eigentümer (WiEReG)
- **URL:** [bmf.gv.at/services/wiereg](https://www.bmf.gv.at/services/wiereg/wiereg-register.html)
- **Gesetz:** Wirtschaftliche Eigentümer Registergesetz (WiEReG)
- **Hinweis:** Meldepflichtig sind alle im Firmenbuch eingetragenen Personen- und Kapitalgesellschaften, Vereine, Stiftungen. Ausnahmen bei ausschließlich natürlichen Personen als Gesellschafter (z.B. OG, KG, GmbH)

### 6. Adressnachweis
- **Akzeptiert:** Meldebestätigung (Meldezettel), Nebenkostenabrechnung, Steuerbescheid
- **Besonderheit:** Meldezettel ist in Österreich das Standarddokument für Adressnachweis

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **IBAN-Format:** AT + 18 Zeichen (gesamt 20 Zeichen)

### 8. Steuer-ID-Format
- **USt-IdNr.:** `ATU 51507409` (AT + U + 8 Ziffern)
- **Für Vereine:** `AT-ZVR-555769679` (AT-ZVR- + 9–10 Ziffern)

---

## 🇨🇭 Schweiz (CH)

### 1. Firmenregistrierungsdokument
- **Name:** Handelsregisterauszug
- **Quelle:** Kantonales Handelsregisteramt oder [zefix.ch](https://www.zefix.ch) (Zentraler Firmenindex)
- **Publikation:** Schweizerisches Handelsamtsblatt (SHAB)
- **Hinweis:** Das Handelsregister wird kantonal geführt, aber zentral über ZEFIX durchsuchbar

### 2. Registernummer-Format
- **Format (neu, seit 2011):** `CHE-123.456.789` (CHE + 9 Ziffern, Bindestriche und Punkte optional)
- **Format (alt):** `CH-RRR.X.XXX.XXX-P` (RRR = Kantonsnummer, P = Prüfziffer)
- **Hinweis:** UID (Unternehmens-Identifikationsnummer) / IDE (franz.) / IDI (ital.) – bleibt lebenslang gleich

### 3. Gewerbe-/Gründungsdokument
- **Name:** Handelsregisterauszug (dient gleichzeitig als Gründungsdokument)
- **Alternative:** Steuerveranlagung (Tax Assessment) wird von Adyen ebenfalls akzeptiert
- **Hinweis:** Keine separate Gewerbeanmeldung wie in DE/AT – die Eintragung im Handelsregister reicht

### 4. Ausweisdokumente
- **Akzeptiert:** Reisepass, Identitätskarte (ID-Karte)
- **Besonderheiten:** Schweizer ID-Karten sind 10 Jahre gültig (ab 18 Jahren)

### 5. UBO-Register
- **Kein öffentliches Register!** Die Schweiz hat kein zentrales, öffentliches Transparenzregister
- **Regelung:** Unternehmen müssen intern ein Verzeichnis der wirtschaftlich Berechtigten führen (>25% Kapital oder Stimmen)
- **Zugang:** Nur durch das Unternehmen selbst oder auf behördliche Anordnung
- **Hinweis:** Für Adyen: UBO-Erklärung muss vom Kunden selbst bereitgestellt werden (Eigenauskunft oder Organigramm)

### 6. Adressnachweis
- **Akzeptiert:** Wohnsitzbescheinigung (Einwohnerkontrolle), Nebenkostenabrechnung, Steuerbescheid
- **Besonderheit:** Wohnsitzbescheinigung der Einwohnerkontrolle ist das übliche Dokument

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **Währung:** CHF (oder EUR bei Grenzgängerkonten)
- **Hinweis:** Schweizer IBANs beginnen mit CH und haben 21 Zeichen

### 8. Steuer-ID-Format
- **MWST-Nr.:** `CHE-123.456.789 MWST` (UID + MWST-Suffix)
- **Hinweis:** Die UID dient gleichzeitig als Handelsregister- und Steuer-Identifikationsnummer

---

## 🇳🇱 Niederlande (NL)

### 1. Firmenregistrierungsdokument
- **Name:** Uittreksel Handelsregister (KvK-Uittreksel / Handelsregisterauszug der Kamer van Koophandel)
- **Quelle:** [kvk.nl](https://www.kvk.nl) (Kamer van Koophandel)
- **Inhalt:** Firmenname, Rechtsform, Sitz, Geschäftsführer, Handelsaktivitäten
- **Hinweis:** Das KvK-Uittreksel dient gleichzeitig als Gründungs- und Registrierungsdokument

### 2. Registernummer-Format
- **Format:** `34179503` (KvK-Nummer, 8 Ziffern)
- **Hinweis:** Wird bei der Erstregistrierung bei der KvK vergeben

### 3. Gewerbe-/Gründungsdokument
- **Name:** Uittreksel Handelsregister (identisch mit Firmenregistrierungsdokument)
- **Hinweis:** Keine separate Gewerbeanmeldung – die KvK-Registrierung deckt alles ab

### 4. Ausweisdokumente
- **Akzeptiert:** Paspoort (Reisepass), Identiteitskaart (Personalausweis), Rijbewijs (Führerschein)
- **Besonderheiten:** Niederländische ID-Karten sind 10 Jahre gültig

### 5. UBO-Register
- **Name:** UBO-Register bei KvK
- **URL:** [kvk.nl/ubo](https://www.kvk.nl/en/ubo/)
- **Hinweis:** Seit 2022 sind UBO-Daten **nicht mehr öffentlich** einsehbar (EuGH-Urteil). Nur autorisierte Stellen (Polizei, Steueramt, FIU) haben Zugriff. Unternehmen können einen KvK UBO Register Extract für eigene Daten bestellen

### 6. Adressnachweis
- **Akzeptiert:** Gemeentelijke Basisadministratie (GBA-Auszug), Nebenkostenabrechnung, Steuerbescheid
- **Besonderheit:** GBA-uittreksel (Meldebescheinigung der Gemeinde) ist das Standarddokument

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **IBAN-Format:** NL + 16 Zeichen (gesamt 18 Zeichen)

### 8. Steuer-ID-Format
- **BTW-Nr. (USt-IdNr.):** `NL 123456789B01` (NL + 9 Ziffern + B + 2 Ziffern)
- **BSN (persönlich):** 9-stellig (Burgerservicenummer, nicht für Unternehmen)

---

## 🇫🇷 Frankreich (FR)

### 1. Firmenregistrierungsdokument
- **Name:** Extrait Kbis (Extrait du Registre du Commerce et des Sociétés)
- **Quelle:** Greffe du Tribunal de Commerce oder [infogreffe.fr](https://www.infogreffe.fr)
- **Alternative Quelle:** [annuaire-entreprises.data.gouv.fr](https://annuaire-entreprises.data.gouv.fr) (kostenlos, ersetzt sirene.fr seit 2025)
- **Inhalt:** Firmenname, SIREN/SIRET, Rechtsform, Sitz, Geschäftsführer, Kapital
- **Gültigkeit:** Kbis muss möglichst aktuell sein (idealerweise < 3 Monate)

### 2. Registernummer-Format
- **SIREN:** `542051180` (9 Ziffern – identifiziert das Unternehmen)
- **SIRET:** `542051180 00066` (14 Ziffern = SIREN + 5-stellige NIC, Bindestrich optional)
- **Hinweis:** SIREN bleibt lebenslang gleich, SIRET ändert sich bei Standortwechsel

### 3. Gewerbe-/Gründungsdokument
- **Name:** Extrait Kbis (dient gleichzeitig als Gründungsdokument)
- **Alternative:** Avis de Situation au Répertoire Sirene (für Freiberufler/Autoentrepreneurs)
- **Hinweis:** Keine separate Gewerbeanmeldung – die Kbis-Eintragung reicht

### 4. Ausweisdokumente
- **Akzeptiert:** Carte Nationale d'Identité (CNI), Passeport
- **⚠️ WICHTIG – Besonderheit Frankreich:**
  - Französische Personalausweise, die **zwischen 2004 und 2013** ausgestellt wurden, sind **15 Jahre gültig** (statt 10), auch wenn auf der Karte „10 ans" steht!
  - Diese Verlängerung gilt automatisch und wird von Adyen akzeptiert
  - Beispiel: Ausweis ausgestellt 01.01.2010, „gültig bis 01.01.2020" → tatsächlich gültig bis 01.01.2025

### 5. UBO-Register
- **Name:** Registre des Bénéficiaires Effectifs (RBE)
- **Quelle:** Greffe du Tribunal de Commerce / [infogreffe.fr](https://www.infogreffe.fr)
- **Hinweis:** Seit 2017 Pflicht, alle Gesellschaften müssen wirtschaftlich Berechtigte melden

### 6. Adressnachweis
- **Akzeptiert:** Facture de services publics (Strom, Gas, Wasser), Avis d'imposition (Steuerbescheid), Quittance de loyer (Mietquittung)
- **Besonderheit:** EDF/GDF-Rechnungen (Strom/Gas) sind das gängigste Dokument

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **Alternative:** RIB (Relevé d'Identité Bancaire) – wird von Adyen akzeptiert und hat **kein Ablaufdatum**
- **IBAN-Format:** FR + 25 Zeichen (gesamt 27 Zeichen)

### 8. Steuer-ID-Format
- **TVA-Nr. (USt-IdNr.):** `FR 12345678901` (FR + 2 Prüfziffern + SIREN, gesamt 13 Zeichen)
- **Numéro SPI (persönlich):** 13-stellig (Numéro fiscal / Simplification des Procédures d'Imposition)

---

## 🇮🇹 Italien (IT)

### 1. Firmenregistrierungsdokument
- **Name:** Visura Camerale (Handelsregisterauszug der Camera di Commercio)
- **Quelle:** [registroimprese.it](https://www.registroimprese.it) (Registro Imprese)
- **Inhalt:** Firmenname, Rechtsform, Sitz, Geschäftsführer, Gesellschafter, Codice Fiscale, Partita IVA
- **Alternative:** Certificato di Attribuzione del Codice Fiscale (Steuernummernzuweisung der Agenzia delle Entrate)

### 2. Registernummer-Format
- **Partita IVA (P.IVA):** `00470400011` (11 Ziffern: 7 Firmenkennung + 3 Provinz + 1 Prüfziffer)
- **CCIAA-Nummer (REA):** `TO 0091712` (2 Buchstaben Provinzkürzel + 6–7 Ziffern)
- **Codice Fiscale (jur. Person):** Identisch mit P.IVA (11 Ziffern)

### 3. Gewerbe-/Gründungsdokument
- **Name:** Visura Camerale (dient gleichzeitig als Gründungsnachweis)
- **Hinweis:** Bei Adyen wird die Visura Camerale sowohl als Registrierungs- als auch als Gründungsdokument akzeptiert

### 4. Ausweisdokumente
- **Akzeptiert:** Carta d'Identità (Personalausweis), Passaporto (Reisepass)
- **Besonderheiten:** Italienische Carta d'Identità Elettronica (CIE) ist 10 Jahre gültig (ab 18 Jahren)

### 5. UBO-Register
- **Name:** Registro dei Titolari Effettivi
- **Quelle:** Camera di Commercio (Handelskammer)
- **Hinweis:** Das Register wurde 2023 eingeführt, ist aber derzeit aufgrund gerichtlicher Anfechtungen teilweise im Zugang eingeschränkt. Für Adyen: UBO-Eigenauskunft oder Gesellschaftsvertrag bereitstellen

### 6. Adressnachweis
- **Akzeptiert:** Certificato di residenza (Meldebescheinigung der Gemeinde), Bolletta utenze (Nebenkostenrechnung), Dichiarazione dei redditi (Steuererklärung)
- **Besonderheit:** Certificato di residenza ist das offizielle Wohnsitzdokument

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **IBAN-Format:** IT + 25 Zeichen (gesamt 27 Zeichen)

### 8. Steuer-ID-Format
- **Partita IVA (USt-IdNr.):** `IT 12345678901` (IT + 11 Ziffern)
- **Codice Fiscale (natürl. Person):** `YULSQG40E60I271T` (16 Zeichen – Buchstaben/Ziffern, abgeleitet aus Name, Geburtsdatum, -ort)

---

## 🇪🇸 Spanien (ES)

### 1. Firmenregistrierungsdokument
- **Name:** Nota Simple / Certificación del Registro Mercantil
- **Quelle:** Registro Mercantil (Handelsregister) – [registradores.org](https://sede.registradores.org/site/mercantil)
- **Inhalt:** Firmenname, NIF, Rechtsform, Sitz, Geschäftsführer, Gesellschafter, Kapital
- **Hinweis:** Es gibt zentrale (RMC, Madrid) und regionale (provinziale) Handelsregister

### 2. Registernummer-Format
- **NIF (jur. Person):** `A39000013` (1 Buchstabe + 8 alphanumerische Zeichen)
  - Erster Buchstabe gibt Rechtsform an: A = SA, B = SL, usw.
- **Ehemals CIF:** Seit 2008 offiziell durch NIF ersetzt, wird umgangssprachlich noch verwendet

### 3. Gewerbe-/Gründungsdokument
- **Name:** Escritura de Constitución (Gründungsurkunde, notariell beurkundet)
- **Alternative:** Comunicación de Tarjeta Acreditativa del NIF (NIF-Bestätigungskarte)
- **Hinweis:** Die Escritura wird vom Notar elektronisch beim Registro Mercantil eingereicht

### 4. Ausweisdokumente
- **Akzeptiert:** DNI (Documento Nacional de Identidad), Pasaporte (Reisepass)
- **Für Ausländer:** NIE (Número de Identidad de Extranjero)
- **DNI-Format:** `99999999L` (8–10 Zeichen)
- **NIE-Format:** `X9999999L` (Buchstabe + 7 Ziffern + Prüfbuchstabe)

### 5. UBO-Register
- **Name:** Registro Central de Titularidades Reales (RCTR)
- **Zugang:** Stark eingeschränkt – spanische ID erforderlich, Kommunikation nur auf Spanisch
- **Hinweis:** Praktisch schwer zugänglich für ausländische Antragsteller. Für Adyen: UBO-Eigenauskunft mit Gesellschaftervertrag bereitstellen

### 6. Adressnachweis
- **Akzeptiert:** Certificado de empadronamiento (Meldebescheinigung), Factura de servicios (Nebenkostenrechnung), Declaración de la renta (Steuererklärung)
- **Besonderheit:** Empadronamiento (Einwohnermeldeamt-Bescheinigung) ist das Standarddokument

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **IBAN-Format:** ES + 22 Zeichen (gesamt 24 Zeichen)

### 8. Steuer-ID-Format
- **NIF/IVA-Nr.:** `ES X12345678` (ES + 9 Zeichen)
- **Persönlich (DNI):** 8 Ziffern + 1 Prüfbuchstabe
- **Ausländer (NIE):** X/Y/Z + 7 Ziffern + 1 Prüfbuchstabe

---

## 🇬🇧 Vereinigtes Königreich / UK (GB)

### 1. Firmenregistrierungsdokument
- **Name:** Certificate of Incorporation
- **Quelle:** [Companies House](https://www.gov.uk/government/organisations/companies-house) / [find-and-update.company-information.service.gov.uk](https://find-and-update.company-information.service.gov.uk)
- **Inhalt:** Company name, Company number, Date of incorporation, Registered office
- **Zusätzlich:** Confirmation Statement (ehemals Annual Return) als aktueller Nachweis

### 2. Registernummer-Format
- **Format:** `04366849` (8 Zeichen – Ziffern, bei schottischen Firmen mit SC-Präfix)
- **Hinweis:** Wird bei Companies House Registrierung vergeben

### 3. Gewerbe-/Gründungsdokument
- **Name:** Certificate of Incorporation (identisch mit Registrierungsdokument)
- **Adyen-Besonderheit:** Zusätzlich kann ein „Proof of Director" verlangt werden:
  - Confirmation Statement oder
  - Board of Directors Meeting Minutes (max. 12 Monate alt, signiert)
  - Trade Registry Extract

### 4. Ausweisdokumente
- **Akzeptiert:** Passport (Reisepass), Driving Licence (Führerschein), National Identity Card (für EEA-Bürger)
- **Besonderheit UK:** Driving Licence wird als vollwertiges ID-Dokument akzeptiert (enthält Foto, Adresse, Geburtsdatum)

### 5. UBO-Register
- **Name:** PSC Register (People with Significant Control)
- **URL:** [Companies House PSC-Daten](https://find-and-update.company-information.service.gov.uk)
- **Hinweis:** Öffentlich einsehbar! Jedes UK-Unternehmen muss PSCs (>25% Anteile oder Stimmrechte) bei Companies House melden. Seit 2026 müssen PSCs ihre Identität mit einem Companies House Personal Code verifizieren

### 6. Adressnachweis
- **Akzeptiert:** Council Tax Bill, Utility Bill (Gas, Strom, Wasser), Bank Statement, HMRC Tax Letter
- **Besonderheit:** Council Tax Bill ist in UK das gängigste Adressnachweis-Dokument

### 7. Kontoauszug
- **Anforderungen:** Banklogo, Kontoinhaber, IBAN oder Sort Code + Account Number
- **IBAN-Format:** GB + 20 Zeichen (gesamt 22 Zeichen)
- **Alternative:** Sort Code (6 Ziffern) + Account Number (8 Ziffern)
- **Währung:** GBP (oder EUR)

### 8. Steuer-ID-Format
- **VAT Number:** `GB 123456789` (GB + 9–12 Ziffern)
- **UTR (Unique Taxpayer Reference):** 10-stellig (für Unternehmen)
- **NINO (National Insurance Number):** Format `AB123456C` (für natürliche Personen)

---

## 🇵🇱 Polen (PL)

### 1. Firmenregistrierungsdokument
- **Name:** Informacja Odpowiadająca Odpisowi Aktualnemu z Rejestru Przedsiębiorców (KRS-Auszug)
- **Quelle:** [ems.ms.gov.pl](https://ems.ms.gov.pl) (Krajowy Rejestr Sądowy – Nationales Gerichtsregister)
- **Für Einzelunternehmer:** Wypis z CEIDG (CEIDG-Auszug) über [ceidg.gov.pl](https://www.ceidg.gov.pl)
- **Inhalt:** Firmenname, KRS-Nummer, REGON, NIP, Sitz, Geschäftsführer, Gesellschafter

### 2. Registernummer-Format
- **KRS (Kapitalgesellschaften):** `0000123456` (10 Ziffern)
- **REGON (Einzelunternehmer):** `123456789` (9 Ziffern)
- **NIP (Steuer-ID):** `1234567890` (10 Ziffern)

### 3. Gewerbe-/Gründungsdokument
- **Für Sp. z o.o. / S.A.:** KRS-Auszug (dient als Gründungsnachweis)
- **Für Einzelunternehmer:** Wypis z CEIDG (CEIDG-Auszug)
- **Hinweis:** Keine separate Gewerbeanmeldung – KRS bzw. CEIDG deckt alles ab

### 4. Ausweisdokumente
- **Akzeptiert:** Dowód Osobisty (Personalausweis), Paszport (Reisepass), Prawo Jazdy (Führerschein)
- **⚠️ WICHTIG – Besonderheit Polen:**
  - Polnische Führerscheine, die **vor dem 19.01.2013** ausgestellt wurden, haben **kein Ablaufdatum** aufgedruckt
  - Diese sind **gültig bis 2033** und werden von Adyen akzeptiert
  - Adyen kennt diese Regelung und lehnt solche Führerscheine nicht ab

### 5. UBO-Register
- **Name:** CRBR (Centralny Rejestr Beneficjentów Rzeczywistych / Zentrales Register der wirtschaftlichen Eigentümer)
- **URL:** [crbr.podatki.gov.pl](https://crbr.podatki.gov.pl)
- **Hinweis:** Öffentlich einsehbar, Meldung innerhalb von 14 Tagen nach Registrierung oder Änderung Pflicht
- **Gesetz:** Polnisches Geldwäschebekämpfungsgesetz (AML Act)

### 6. Adressnachweis
- **Akzeptiert:** Zaświadczenie o zameldowaniu (Meldebescheinigung), Rachunek za media (Nebenkostenrechnung), Zeznanie podatkowe (Steuererklärung)

### 7. Kontoauszug
- **Anforderungen:** Wie DE – Banklogo, IBAN, Kontoinhaber
- **IBAN-Format:** PL + 26 Zeichen (gesamt 28 Zeichen)
- **Währung:** PLN oder EUR

### 8. Steuer-ID-Format
- **NIP (USt-IdNr.):** `PL 1234567890` (PL + 10 Ziffern)
- **PESEL (persönlich):** `53012224757` (11 Ziffern – abgeleitet aus Geburtsdatum und Geschlecht)

---

## Schnellvergleich: Firmendokumente

| Land | Registerdokument | Registernummer-Format | Gewerbe-/Gründungsdokument |
|---|---|---|---|
| **DE** | Handelsregisterauszug | `HRB 100484` | Gewerbeanmeldung (GewA 1/2) |
| **AT** | Firmenbuchauszug | `FN 123456m` | GISA-Auszug |
| **CH** | Handelsregisterauszug | `CHE-123.456.789` | Handelsregisterauszug |
| **NL** | KvK-Uittreksel | `34179503` (8 Ziffern) | KvK-Uittreksel |
| **FR** | Extrait Kbis | `542051180` (SIREN, 9 Ziffern) | Extrait Kbis |
| **IT** | Visura Camerale | `00470400011` (P.IVA, 11 Ziffern) | Visura Camerale |
| **ES** | Nota Simple / Certificación | `A39000013` (NIF) | Escritura de Constitución |
| **GB** | Certificate of Incorporation | `04366849` (8 Zeichen) | Certificate of Incorporation |
| **PL** | KRS-Auszug | `0000123456` (10 Ziffern) | KRS-Auszug / CEIDG |

## Schnellvergleich: Steuer-IDs

| Land | Format | Beispiel |
|---|---|---|
| **DE** | DE + 9 Ziffern | `DE 115235681` |
| **AT** | ATU + 8 Ziffern | `ATU 51507409` |
| **CH** | CHE + 9 Ziffern + MWST | `CHE-123.456.789 MWST` |
| **NL** | NL + 9 Ziffern + B + 2 Ziffern | `NL 123456789B01` |
| **FR** | FR + 2 Prüfziffern + SIREN | `FR 12345678901` |
| **IT** | IT + 11 Ziffern | `IT 12345678901` |
| **ES** | ES + 9 Zeichen | `ES X12345678` |
| **GB** | GB + 9–12 Ziffern | `GB 123456789` |
| **PL** | PL + 10 Ziffern | `PL 1234567890` |

## Schnellvergleich: UBO-Register

| Land | Registername | URL | Öffentlich? |
|---|---|---|---|
| **DE** | Transparenzregister | transparenzregister.de | Ja (seit 2022) |
| **AT** | WiEReG-Register | bmf.gv.at/services/wiereg | Eingeschränkt |
| **CH** | Kein zentrales Register | – | Nein (nur intern) |
| **NL** | UBO-Register (KvK) | kvk.nl/ubo | Nein (seit EuGH 2022) |
| **FR** | Registre des Bénéficiaires Effectifs | infogreffe.fr | Eingeschränkt |
| **IT** | Registro dei Titolari Effettivi | registroimprese.it | Eingeschränkt |
| **ES** | Registro Central de Titularidades Reales | – | Sehr eingeschränkt |
| **GB** | PSC Register (Companies House) | gov.uk/companies-house | Ja (öffentlich) |
| **PL** | CRBR | crbr.podatki.gov.pl | Ja (öffentlich) |

## Schnellvergleich: Ausweisbesonderheiten

| Land | Besonderheit |
|---|---|
| **DE** | Personalausweis oder Reisepass – keine Besonderheiten |
| **AT** | Personalausweis oder Reisepass – keine Besonderheiten |
| **CH** | ID-Karte oder Reisepass – keine Besonderheiten |
| **NL** | Auch Führerschein (Rijbewijs) akzeptiert |
| **FR** | ⚠️ Ausweise 2004–2013: **15 Jahre gültig** (statt 10 auf der Karte) |
| **IT** | Carta d'Identità Elettronica (CIE) – keine Besonderheiten |
| **ES** | DNI oder NIE (für Ausländer) |
| **GB** | ⚠️ Driving Licence als vollwertiges ID akzeptiert |
| **PL** | ⚠️ Führerscheine vor 19.01.2013: **kein Ablaufdatum**, gültig bis 2033 |

---

## Wenn ein nicht-deutscher Kunde kommt

### Sofort-Checkliste:
1. Welches Land ist es?
2. Im entsprechenden Länderabschnitt oben nachschlagen
3. Registerdokument, Registernummer-Format und Steuer-ID-Format prüfen
4. Auf länderspezifische Ausweisbesonderheiten achten (FR, PL, UK!)
5. UBO-Nachweis klären – je nach Land öffentliches Register oder Eigenauskunft
6. Adyen Docs als Referenz:
   - [Document Requirements](https://docs.adyen.com/platforms/verification-requirements/document-requirements)
   - [Data Formats per Country](https://docs.adyen.com/issuing/verification-requirements/data-formats-per-country)

### Was immer gleich bleibt (länderunabhängig):
- PCI DSS SAQ-A Formular (DocuSign)
- Kontoauszug-Anforderungen (Logo, IBAN, Name, max. 12 Monate)
- Datei-Formate (JPEG/PNG, 100 KB – 4 MB)
- Webhook-/Backend-Konfiguration
- User-Erstellung
- UBO-Schwelle: >25% Anteil
