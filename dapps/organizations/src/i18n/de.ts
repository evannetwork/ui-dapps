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
      "identifications": "Identifikationen",
      "notary": "Notariell",
      "organization": "Organisation",
      "organizations": "Organisationen",
      "verification": "Verifikation"
    },
    "dispatchers": {
      "request-verification": "Verifikation wird beantragt...",
      "verification-accept": "Verifikation wird angenommen..."
    },
    "ident": {
      "back": "Zurück",
      "categories": {
        "identifications": "Identifikationen",
        "notary": "Notarielle Verifikation"
      },
      "done": "Fertig",
      "error": "Fehler",
      "error-loading": "Beim Laden der Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      "next": "Weiter",
      "notary": {
        "account-id": "Account-ID",
        "check-updates": "Warte auf Aktualisierung...",
        "info": "Identifizieren Sie Ihr Konto als vertrauenswürdiges evan.network-Mitglied",
        "issue": {
          "accountId": {
            "desc": "Account-ID für die die notarielle Bestätigung erstellt werden soll.",
            "error": "Bitte geben Sie eine gültige Account ID an!",
            "title": "Account-ID"
          },
          "header": "Organisations-Verifikation ausstellen",
          "issue": "Organisations-Verifikation ausstellen",
          "issuing": "Organisations-Verifikation wird ausgestellt",
          "issued": {
            "error": {
              "desc": "Die Organisations-Verifikation konnte nicht ausgestellt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie Ihren Administrator.",
              "title": "Fehler"
            },
            "success": {
              "desc": "Die Organisations-Verifikation wurde erfolgreich ausgestellt.",
              "title": "Abgeschlossen"
            }
          },
          "privateFiles": {
            "error": "Sie müssen mindestens 1 notariell bestätigtes Dokument hinzufügen, um fortzufahren.",
            "title": "Verschlüsselte, notariell bestätige Dateien"
          },
          "publicFiles": {
            "error": "Sie müssen mindestens 1 notariell bestätigtes Dokument hinzufügen, um fortzufahren.",
            "title": "Öffentliche, notariell bestätige Dateien"
          },
          "requestId": {
            "desc": "Geben Sie die Anfrage-ID an, für die die Notarielle Verifikation abgeschlossen werden soll, ein.",
            "error": "Bitte geben Sie eine korrekte Anfrage-ID ein!",
            "title": "Anfrage-ID"
          }
        },
        "learn-more": "Mehr erfahren",
        "no-requests": "Sie haben noch keine notarielle Verifikation beantragt. Nutzen Sie die folgende Schaltfläche um diese zu beantragen.",
        "pin": {
          "confirmation-code": "Ihr Bestätigungscode wurde erfolgreich erkannt.",
          "confirmation-code-desc": "Drucken Sie Ihren Bestätigungscode und senden Sie ihn per Post an die auf dem Dokument angegebene Adresse.",
          "desc": "Bitte geben Sie Ihre PIN ein. Sie finden Ihre PIN in der Bestätigungsanfrage des Notars.",
          "desc-hin": "Bitte achten Sie bei der Eingabe auf Groß- und Kleinschreibung.",
          "did-printed": "Haben Sie das Dokument gedruckt?",
          "do-not-forget": "Bitte vergessen Sie nicht Ihre Unterschrift und den Fimenstempel und schicken Sie es per Post an den anfragenden Notar.",
          "download": "Kein Drucker verfügbar? Download als PDF Datei",
          "generate-answer": "Code generieren",
          "header": "Authentifizierung",
          "next-step": "Nach erfolgreicher Prüfung durch den Notar wird Ihr Account verifiziert.",
          "next-step2": "Sie werden in Ihrer Account Mailbox darüber informiert.",
          "pin": {
            "desc": "Die per Brief erhaltene, sechstellige PIN.",
            "error": "Bitte geben Sie Ihre PIN ein, um fortzufahren.",
            "error2": "Die eingegebene PIN war nicht korrekt. Bitte geben Sie die korrekte PIN ein.",
            "title": "PIN"
          },
          "step": {
            "pin": "PIN",
            "print": "Bestätigungsdokument drucken",
            "send": "Per Post senden"
          }
        },
        "print": "Drucken",
        "reload": "Neu-laden",
        "request": {
          "address": {
            "desc": "Straße und Hausnummer",
            "error": "Bitte geben Sie eine Anschrift an!",
            "title": "Anschrift"
          },
          "city": {
            "desc": "Ort",
            "error": "Bitte geben Sie einen Stadt an!",
            "title": "Stadt"
          },
          "contact": {
            "desc": "Vorname und Nachname",
            "error": "Bitte geben Sie eine Kontaktperson an!",
            "title": "Ansprechpartner"
          },
          "costs": {
            "approve": "Ja, ich fordere die notarielle Verifikation zu den Transaktionskosten von 200 EVE an.",
            "description": "Die Transaktionskosten für die notarielle Verifikation betragen 200 EVE. Ihr Wallet wird mit diesem Betrag belastet.",
            "hint": "Das Anfordern einer notariellen Verifikation ist kostenpflichtig.",
            "title": "Kosten"
          },
          "countries": {
            "germany": "Deutschland"
          },
          "country": {
            "desc": "Firmensitz eingeben",
            "error": "Bitte geben Sie einen Firmensitz an!",
            "title": "Firmensitz"
          },
          "court": {
            "desc": "Ort des Amtsgerichts",
            "error": "Bitte geben Sie das Registergericht an!",
            "title": "Registergericht"
          },
          "department": {
            "desc": "Abteilung",
            "error": "Bitte geben Sie eine Abteilung an!",
            "title": "Abteilung"
          },
          "description": "Bitte füllen Sie das Forumlar aus, um eine notarielle Verifikation ihrer Organisation zu beantragen. Dieser Service ist kostenpflichtig.",
          "header": "Notarielle Verifikation",
          "how": {
            "steps": {
              "1": {
                "description": "Geben Sie Handelsregisternummer, Registergericht, ihre Anschrift und einen Ansprechpartner an.",
                "title": "Schritt 1: Anfordern"
              },
              "2": {
                "description": "Sie erhalten eine PIN per Post. Generieren Sie mit dieser das Bestätigungsdokument und senden Sie es unterschrieben per Post an den anfragenden Notar.",
                "title": "Schritt 2: Authentifizieren"
              },
              "3": {
                "description": "Ist die notarielle Verifikation erfolgreich, werden Sie benachrichtigt. Akzeptieren Sie als letzten Schritt die Verifikation.",
                "title": "Schritt 3: Akzeptieren"
              }
            },
            "title": "Schritte"
          },
          "mail": {
            "body": "Hiermit beantrage Ich eine Notarielle Bestätigung für die folgenden Informationen: <ul><li>Evan-AccountID: {organizationEvanId}</li><li>Handelsregisternummer: {organizationRegistrationNumber}</li><li>Organisation: {organizationName}</li><li>Kontakt: {organizationContact}</li><li>Anschrift: {organizationStreetAddress}</li><li>Stadt: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Beantragung einer Notariellen Bestätigung"
          },
          "organization": {
            "desc": "Firmenname",
            "error": "Bitte geben Sie den Unternehmensname an!",
            "title": "Firma"
          },
          "postal-address": "Anschrift",
          "proof": {
            "description": "Für die Verifikation Ihres Unternehmens erhalten Sie im nächsten Schritt eine PIN per Post vom Notar zu Händen der folgenden Person.",
            "title": "Bitte überprüfen Sie Ihre Daten."
          },
          "register": {
            "desc": "Register",
            "error": "Bitte geben Sie das Register an!",
            "title": "Register"
          },
          "registerNumber": {
            "desc": "98765",
            "error": "Bitte geben Sie die Registernummer an!",
            "title": "Registernummer"
          },
          "request-ident": "Beantragen",
          "request-verification": "Notarielle Verifikation beantragen",
          "requested1": "Sie haben erfolgreich eine notarielle Verifikation angefordert.",
          "requested2": "Es wurden 200 EVE als Transaktionskosten von Ihrem Wallet abgebucht.",
          "requested3": "Sie erhalten in Kürze vom Notar Post!",
          "requesting": "Notarielle Verifikation wird angefordert...",
          "step": "Schritt",
          "who": {
            "description": "Als eingetragenes Unternehmen können sie eine notarielle Verifikation ihres Accounts anfordern.",
            "link": "Mehr erfahren",
            "title": "Voraussetzungen"
          },
          "why": {
            "description": "Mit der notariellen Verifikation wird bestätigt, dass ihr Unternehmen im Besitz der Account-ID {{accountId}} ist. Durch diese Bestätigung können Sie sich gegenüber ihren Geschäftspartnern ausweisen und verifizieren, dass Transaktionen, Digitale Zwillinge und Smart Contracts von Ihnen stammen.",
            "link": "Mehr erfahren",
            "title": "Vorteile"
          },
          "zipCode": {
            "desc": "Postleitzahl",
            "error": "Bitte geben Sie eine gültige Postleitzahl an!",
            "title": "PLZ"
          }
        },
        "request-error": "Informationen zu dieser Anfrage konnten nicht geladen werden!",
        "status": {
          "accepted": "notariell verifiziert",
          "confirming": "in Prüfung",
          "finished": "notariell verifiziert",
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
        "step": {
          "costs": "Kosten",
          "summary": "Zusammenfassung",
          "your_data": "Ihre Daten"
        },
        "title": "Notarielle Verifikationen",
        "verification": {
          "accept": "Annehmen",
          "incorrect": "Die Ihnen ausgestellten Organisationsidentifikationen wurden nicht von der korrekten Instanz erstellt.",
          "organization": "Organisations-Verifikation",
          "organization-random": "Organisations-ID-Verifikation",
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
