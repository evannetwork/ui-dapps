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
      "categories": {
        "identifications": "Identifikationen",
        "notary": "Notarielle Verifikation"
      },
      "notary": {
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
          "files": {
            "error": "Sie müssen mindestens 1 notariell bestätigtes Dokument hinzufügen, um fortzufahren.",
            "title": "Notariell bestätige Dateien"
          },
          "header": "Organisations-Verifikation ausstellen",
          "issue": "Organisations-Verifikation ausstellen"
        },
        "learn-more": "Mehr erfahren",
        "no-requests": "Sie haben noch keine notarielle Verifikation beantragt. Nutzen Sie die folgende Schaltfläche um diese zu beantragen.",
        "pin": {
          "confirmation-code": "Ihr Bestätigungscode wurde erfolgreich erkannt.",
          "confirmation-code-desc": "Drucken Sie Ihren Bestätigungscode und senden Sie ihn per Post an die auf dem Dokument angegebene Adresse.",
          "desc": "Bitte geben Sie den PIN ein, die Ihnen zugesendet wurde und generieren Sie ihren Bestätigungscode.",
          "desc-hin": "Bitte achten Sie bei der Eingabe auf Groß- und Kleinschreibung.",
          "desc2": "Senden Sie dieses bitte an die unten angeführte Adresse.",
          "generate-answer": "Bestätigungscode Generieren",
          "header": "Notarielle Verifikation",
          "pin": {
            "desc": "Der in dem Brief enthaltende PIN.",
            "error": "Bitte geben Sie die PIN ein, um fortzufahren.",
            "error2": "Die eingegebene PIN war nicht korrekt. Bitte geben Sie die korrekte PIN ein.",
            "title": "PIN"
          }
        },
        "print": "Drucken",
        "request": {
          "address": {
            "desc": "Anschrift eingeben",
            "error": "Bitte geben Sie eine Anschrift an!",
            "title": "Anschrift"
          },
          "back": "Zurück",
          "city": {
            "desc": "Stadt eingeben",
            "error": "Bitte geben Sie einen Stadt an!",
            "title": "Stadt"
          },
          "organization": {
            "desc": "Organisationsname eingeben",
            "error": "Bitte geben Sie einen Firmenname an!",
            "title": "Organisation"
          },
          "contact": {
            "desc": "Kontaktperson eingeben",
            "error": "Bitte geben Sie eine Kontaktperson an!",
            "title": "Kontaktperson"
          },
          "countries": {
            "germany": "Deutschland"
          },
          "country": {
            "desc": "Land eingeben",
            "error": "Bitte geben Sie ein Land an!",
            "title": "Land"
          },
          "description": "Bitte füllen Sie das Forumlar aus, um eine notarielle Verifikation ihrer Organisation zu beantragen. Dieser Service ist kostenpflichtig.",
          "header": "Notarielle Verifikation",
          "mail": {
            "body": "Hiermit beantrage Ich eine Notarielle Bestätigung für die folgenden Informationen: <ul><li>Evan-AccountID: {organizationEvanId}</li><li>Handelsregisternummer: {organizationRegistrationNumber}</li><li>Organisation: {organizationName}</li><li>Kontakt: {organizationContact}</li><li>Anschrift: {organizationStreetAddress}</li><li>Stadt: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Beantragung einer Notariellen Bestätigung"
          },
          "next": "Weiter",
          "postal-address": "Anschrift",
          "proof": {
            "contact-is": "Kontaktperson ist",
            "footer": "Die notarielle Verifikation ist kostenpflichtig.",
            "footer2": "Ihr Wallet wird mit 200 EVE belastet.",
            "for-org": "für die Organisation",
            "question-desc": "Zur Vervollständigung der notariellen Verifikation erhalten Sie ein Kennwort, zu Händen der folgenden Person.",
            "title": "Bitte überprüfen Sie alle Informationen.",
            "with-reg-number": "mit der Handelsregisternummer",
            "you-request": "Sie bantragen eine",
            "you-request-2": "notarielle Verifikation"
          },
          "regNumber": {
            "desc": "Handelsregisternummer eingeben",
            "error": "Bitte geben Sie eine Handelsregisternummer an!",
            "title": "Handelsregisternummer"
          },
          "request-ident": "Beantragen",
          "requested1": "Sie haben erfolgreich eine Notarielle Verifikation für Ihre Organisation beantragt.",
          "requested2": "Ihr Wallet wurde mit 200 EVE belastet.",
          "requesting": "Notarielle Verifikation wird beantragt...",
          "zipCode": {
            "desc": "PLZ eingeben",
            "error": "Bitte geben Sie eine gültige Postleitzahl an!",
            "title": "PLZ"
          }
        },
        "status": {
          "accepted": "notariell identifiziert",
          "confirming": "in Prüfung",
          "forwarding": "wird vom Provider bearbeitet",
          "issued": "notariell identifiziert",
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
        "title": "Notarielle Identifikationen",
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
