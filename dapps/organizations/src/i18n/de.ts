/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

/* tslint:disable */
const i18n: any = {
  "_org": {
    "breadcrumbs": {
      "verification": "Verifikation",
      "identifications": "Identifikationen",
      "notary": "Notariell",
      "organization": "Organisation",
      "organizations": "Organisationen"
    },
    "dispatchers": {
      "request-verification": "Verifikation wird beantragt...",
      "verification-accept": "Verifikation wird angenommen..."
    },
    "ident": {
      "error": "Fehler",
      "categories": {
        "identifications": "Identifikationen",
        "notary": "Notarielle Verifikation"
      },
      "next": "Weiter",
      "back": "Zurück",
      "done": "Fertig",
      "notary": {
        "request-error": "Informationen zu dieser Anfrage konnten nicht geladen werden!",
        "step": {
          "your_data": "Ihre Daten",
          "summary": "Zusammenfassung",
          "costs": "Kosten"
        },
        "account-id": "Account-ID",
        "info": "Identifizieren Sie Ihr Konto als vertrauenswürdiges evan.network-Mitglied",
        "issue": {
          "accountId": {
            "desc": "Account-ID für die die notarielle Bestätigung erstellt werden soll.",
            "error": "Bitte geben Sie eine gültige Account ID an!",
            "title": "Account-ID"
          },
          "requestId": {
            "desc": "Geben Sie die Anfrage-ID an, für die die Notarielle Verifikation abgeschlossen werden soll, ein.",
            "error": "Bitte geben Sie eine korrekte Anfrage-ID ein!",
            "title": "Anfrage-ID"
          },
          "publicFiles": {
            "error": "Sie müssen mindestens 1 notariell bestätigtes Dokument hinzufügen, um fortzufahren.",
            "title": "Öffentliche, notariell bestätige Dateien"
          },
          "privateFiles": {
            "error": "Sie müssen mindestens 1 notariell bestätigtes Dokument hinzufügen, um fortzufahren.",
            "title": "Verschlüsselte, notariell bestätige Dateien"
          },
          "header": "Organisations-Verifikation ausstellen",
          "issue": "Organisations-Verifikation ausstellen"
        },
        "learn-more": "Mehr erfahren",
        "no-requests": "Sie haben noch keine notarielle Verifikation beantragt. Nutzen Sie die folgende Schaltfläche um diese zu beantragen.",
        "pin": {
          "step": {
            "pin": "PIN",
            "print": "Bestätigungsdokument drucken",
            "send": "Per Post senden"
          },
          "confirmation-code": "Ihr Bestätigungscode wurde erfolgreich erkannt.",
          "confirmation-code-desc": "Drucken Sie Ihren Bestätigungscode und senden Sie ihn per Post an die auf dem Dokument angegebene Adresse.",
          "desc": "Bitte geben Sie Ihre PIN ein. Sie finden Ihre PIN in der Bestätigungsanfrage des Notars.",
          "desc-hin": "Bitte achten Sie bei der Eingabe auf Groß- und Kleinschreibung.",
          "generate-answer": "Code generieren",
          "header": "Authentifizierung",
          "pin": {
            "desc": "Die per Brief erhaltene, sechstellige PIN.",
            "error": "Bitte geben Sie Ihre PIN ein, um fortzufahren.",
            "error2": "Die eingegebene PIN war nicht korrekt. Bitte geben Sie die korrekte PIN ein.",
            "title": "PIN"
          },
          "did-printed": "Haben Sie das Dokument gedruckt?",
          "download": "Kein Drucker verfügbar? Download als PDF Datei",
          "do-not-forget": "Bitte vergessen Sie nicht Ihre Unterschrift und den Fimenstempel und schicken Sie es per Post an den anfragenden Notar.",
          "next-step": "Nach erfolgreicher Prüfung durch den Notar wird Ihr Account verifiziert.",
          "next-step2": "Sie werden in Ihrer Account Mailbox darüber informiert."
        },
        "print": "Drucken",
        "request": {
          "why": {
            "title": "Vorteile",
            "description": "Mit der notariellen Verifikation wird bestätigt, dass ihr Unternehmen im Besitz der Account-ID {{accountId}} ist. Durch diese Bestätigung können Sie sich gegenüber ihren Geschäftspartnern ausweisen und verifizieren, dass Transaktionen, Digitale Zwillinge und Smart Contracts von Ihnen stammen.",
            "link": "Mehr erfahren"
          },
          "who": {
            "title": "Voraussetzungen",
            "description": "Als eingetragenes Unternehmen können sie eine notarielle Verifikation ihres Accounts anfordern.",
            "link": "Mehr erfahren"
          },
          "how": {
            "title": "Schritte",
            "steps": {
              "1": {
                "title": "Schritt 1: Anfordern",
                "description": "Geben Sie Handelsregisternummer, Registergericht, ihre Anschrift und einen Ansprechpartner an."
              },
              "2": {
                "title": "Schritt 2: Authentifizieren",
                "description": "Sie erhalten eine PIN per Post. Generieren Sie mit dieser das Bestätigungsdokument und senden Sie es unterschrieben per Post an den anfragenden Notar."
              },
              "3": {
                "title": "Schritt 3: Akzeptieren",
                "description": "Ist die notarielle Verifikation erfolgreich, werden Sie benachrichtigt. Akzeptieren Sie als letzten Schritt die Verifikation."
              }
            }
          },
          "costs": {
            "title": "Kosten",
            "description": "Die Transaktionskosten für die notarielle Verifikation betragen 200 EVE. Ihr Wallet wird mit diesem Betrag belastet.",
            "approve": "Ja, ich fordere die notarielle Verifikation zu den Transaktionskosten von 200 EVE an.",
            "hint": "Das Anfordern einer notariellen Verifikation ist kostenpflichtig."
          },
          "step": "Schritt",
          "address": {
            "desc": "Straße und Hausnummer",
            "error": "Bitte geben Sie eine Anschrift an!",
            "title": "Anschrift"
          },
          "organization": {
            "desc": "Firmenname",
            "error": "Bitte geben Sie den Unternehmensname an!",
            "title": "Firma"
          },
          "contact": {
            "desc": "Vorname und Nachname",
            "error": "Bitte geben Sie eine Kontaktperson an!",
            "title": "Ansprechpartner"
          },
          "court": {
            "title": "Registergericht",
            "error": "Bitte geben Sie das Registergericht an!",
            "desc": "Ort des Amtsgerichts"
          },
          "department": {
            "desc": "Abteilung",
            "error": "Bitte geben Sie eine Abteilung an!",
            "title": "Abteilung"
          },
          "register": {
            "title": "Register",
            "error": "Bitte geben Sie das Register an!",
            "desc": "Register"
          },
          "registerNumber": {
            "title": "Registernummer",
            "error": "Bitte geben Sie die Registernummer an!",
            "desc": "98765"
          },
          "countries": {
            "germany": "Deutschland"
          },
          "country": {
            "desc": "Firmensitz eingeben",
            "error": "Bitte geben Sie einen Firmensitz an!",
            "title": "Firmensitz"
          },
          "description": "Bitte füllen Sie das Forumlar aus, um eine notarielle Verifikation ihrer Organisation zu beantragen. Dieser Service ist kostenpflichtig.",
          "header": "Notarielle Verifikation",
          "mail": {
            "body": "Hiermit beantrage Ich eine Notarielle Bestätigung für die folgenden Informationen: <ul><li>Evan-AccountID: {organizationEvanId}</li><li>Handelsregisternummer: {organizationRegistrationNumber}</li><li>Organisation: {organizationName}</li><li>Kontakt: {organizationContact}</li><li>Anschrift: {organizationStreetAddress}</li><li>Stadt: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Beantragung einer Notariellen Bestätigung"
          },
          "postal-address": "Anschrift",
          "zipCode": {
            "desc": "Postleitzahl",
            "error": "Bitte geben Sie eine gültige Postleitzahl an!",
            "title": "PLZ"
          },
          "city": {
            "desc": "Ort",
            "error": "Bitte geben Sie einen Stadt an!",
            "title": "Stadt"
          },
          "proof": {
            "description": "Für die Verifikation Ihres Unternehmens erhalten Sie im nächsten Schritt eine PIN per Post vom Notar zu Händen der folgenden Person.",
            "title": "Bitte überprüfen Sie Ihre Daten."
          },
          "request-ident": "Beantragen",
          "request-verification": "Notarielle Verifikation beantragen",
          "requested1": "Sie haben erfolgreich eine notarielle Verifikation angefordert.",
          "requested2": "Es wurden 200 EVE als Transaktionskosten von Ihrem Wallet abgebucht.",
          "requested3": "Sie erhalten in Kürze vom Notar Post!", // TODO: Sie erhalten in den nächsten Tagen Post von einem Notar!
          "requesting": "Notarielle Verifikation wird angefordert..."
        },
        "status": {
          "accepted": "notariell verifiziert",
          "confirming": "in Prüfung",
          "forwarding": "wird vom Provider bearbeitet",
          "issued": "notariell verifiziert",
          "requested": "beantragt",
          "title": "Verifikation",
          "unknown": "keine Verifikation"
        },
        "status-actions": {
          "confirming": "Bestätigung drucken",
          "issued": "Annehmen",
          "requested": "PIN eingeben",
          "unknown": "Beantragen",
          "unknown-long": "Notarielle Verifikation beantragen"
        },
        "title": "Notarielle Verifikationen",
        "verification": {
          "accept": "Annehmen",
          "organization": "Organisations-Verifikation",
          "organization-random": "Organisations-ID-Verifikation",
          "incorrect": "Die Ihnen ausgestellten Organisationsidentifikationen wurden nicht von der korrekten Instanz erstellt.",
          "status": "Status"
        }
      }
    },
    "overview": {
      "title": "Meine Organisationen"
    },
    "types": {
      "organization": "Organisation",
      "person": "Person"
    }
  }
}
/* tslint:enable */

export default i18n;
