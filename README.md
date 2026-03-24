# Adyen KYC Onboarding Wizard

Browser-Tool zum Vereinfachen des Adyen KYC Onboarding-Prozesses fuer deutsche Kunden.

## Live Demo

Oeffne den Wizard direkt im Browser:
**[Adyen KYC Wizard](https://thecedonemASTER.github.io/adyen-kyc-onboarding/wizard/)**

## Was ist das?

Statt Kunden durch den kompletten Adyen-Onboarding-Prozess zu schicken (was oft 2-3 Monate dauert oder abgebrochen wird), sammelt der Support die benoetigten Dokumente ein und erledigt die Einrichtung selbst.

### Der Wizard hilft bei:
1. **Kundendaten erfassen** - Firma, Kontakt, Bank, Adyen-Config
2. **Dokumente tracken** - Checkboxen mit Fortschrittsbalken und Gueltigkeits-Warnungen
3. **Mails generieren** - Erstmail (DE/EN), Erinnerung, Abschluss, Rocket-Chat-Nachricht

Daten werden im Browser gespeichert (LocalStorage).

## Dokumentation

| Datei | Inhalt |
|---|---|
| `01_Checkliste_Deutsche_Kunden.md` | Dokumenten-Checkliste mit Gueltigkeiten |
| `02_Mail_Vorlagen.md` | Mail-Vorlagen DE/EN |
| `03_Interner_Leitfaden.md` | 10-Schritte-Anleitung fuer Support |
| `04_Tracking.md` | Tracking-Tabelle pro Kunde |
| `05_FAQ_Kunden.md` | 25+ Antworten auf typische Kundenfragen |
| `06_Beispieldokumente_Guide.md` | Wie Dokumente aussehen muessen |
| `07_Laenderunterschiede.md` | DE vs. AT/CH/NL/FR/IT/ES/UK/PL |

## Nutzung

`wizard/index.html` im Browser oeffnen oder ueber GitHub Pages aufrufen.
