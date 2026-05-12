# Adyen Backend Walkthrough (Kunden-POV)

> Referenz-Dokument: So sieht der Adyen-Onboarding-Prozess **aus Kundensicht** aus.
> Im Support-Workflow (siehe `03_Interner_Leitfaden.md`) füllen WIR das für den Kunden aus –
> dieses Dokument hilft, Kundenrückfragen zu verstehen.

---

## 1. Phase: Initialisierung im HotelFriend PMS

### 1.1 Merchant Account Erstellung
- **Pfad:** `Settings > Financial > Merchant accounts`
- **Aktion:** Klick auf `+ Request new merchant account`
- **Konfiguration:**
  - **Name:** Eindeutiger Identifikator (z.B. `[Hotelname]_[Stadt]`)
  - **Payment Type:**
    - `Ecommerce` – Online-Buchungen, Remote-Zahlungen
    - `Point of Sale (POS)` – Kartenterminals vor Ort
  - **Country of Registration:** Muss mit Sitz der juristischen Person übereinstimmen
  - **Legal Entity:** Über `Select or add new company` suchen. Falls neu: Handelsregisternummer + Steuer-ID bereithalten

### 1.2 Übergang zum Antrag
- Nach Speichern: Status `Draft`
- Klick auf `Go to application` – öffnet/kopiert verschlüsselten Adyen-Provider-Link

---

## 2. Phase: CRM-Workflow (Pipedrive)

### 2.1 Deal-Verknüpfung
Pflichtfelder im Pipedrive-Deal:
- **Adyen Document Link:** Link aus PMS einfügen
- **Adyen Company ID:** Vom System zugewiesene interne Kennung

### 2.2 Kommunikation
- Mail-Vorlage: `Adyen Onboarding Intro`
- Link als Hyperlink formatieren (sonst Konvertierungsfehler beim Kunden)

---

## 3. Phase: Adyen PowerForm (KYC Deep Dive)

### 3.1 Authentifizierung & Sicherheit
- **Identity Verification:** Unterzeichner (Geschäftsführer/Prokurist) gibt Name + offizielle Geschäfts-E-Mail ein
- **DocuSign Access:** Token per Mail an angegebene Adresse

### 3.2 Merchant Information & SAQ-A
- Firmenadresse muss exakt mit Handelsregister übereinstimmen (sonst Ablehnung)
- PCI-DSS Self-Assessment (SAQ A):
  - Bestätigung: Keine Kreditkartendaten auf eigenen Servern
  - Sektion 2 + 3: Alle Checkboxen `True` / `Confirmed`
  - HotelFriend leitet via Iframes/Redirects an Adyen

### 3.3 Financial & Payout Details
- Währung: standardmäßig EUR
- IBAN/BIC: Muss auf juristische Person lauten – Privatkonten = Ablehnung

### 3.4 Ultimate Beneficial Owners (UBO) & Management
- **UBO-Definition:** Direkt oder indirekt >25% Anteile/Stimmrechte
- **Pflichtdaten pro UBO:**
  - Vollständiger Name (laut Ausweis)
  - Geburtsdatum + **Geburtsort**
  - Private Wohnanschrift
  - **Nationalität**

---

## 4. Phase: Dokumentations-Matrix (Upload)

| Dokument | Anforderung | Format |
|---|---|---|
| Identitätsnachweis | Personalausweis (beidseitig) oder Reisepass | PDF oder JPG (hochauflösend) |
| Handelsregister | Nicht älter als 3-6 Monate, alle Seiten | PDF |
| Banknachweis | Kontoauszug/Bankbestätigung, IBAN + Inhaber sichtbar | PDF |
| Vollmacht | Nur falls Unterzeichner nicht im Handelsregister | PDF |

> **Hinweis:** Im Support-Workflow (siehe `01_Checkliste_Deutsche_Kunden.md`)
> akzeptieren wir vom Kunden JPEG/PNG (100 KB – 4 MB). Adyen akzeptiert beim Upload
> auch PDF – Format vorab klären.

---

## 5. Phase: Finalisierung & Review

### Einreichung
Nach Signatur in DocuSign: Antrag geht automatisch an Adyen-Compliance.

### Status-Monitoring
| Status | Bedeutung | Action |
|---|---|---|
| `Pending` | Prüfung läuft (3-5 Werktage) | Warten |
| `Action Required` | Adyen benötigt weitere Docs | Mails im CRM prüfen, Kunden kontaktieren |
| `Active` | Live, Zahlungen möglich | Weiter zu Schritt 7+ im internen Leitfaden |

### Fehlerfälle
- Link abgelaufen → im PMS neuen Token generieren
- Manuelle Korrektur im DocuSign-Dokument nach Absenden = nicht möglich
