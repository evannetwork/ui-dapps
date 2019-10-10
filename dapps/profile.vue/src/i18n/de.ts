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
*/

/* tslint:disable */
const i18n: any = {
  "_profile": {
    "breadcrumbs": {
      "addressbook.vue.evan": "Kontakte",
      "detail": "Profil",
      "logout": "Ausloggen",
      "settings": "Einstellungen",
      "verifications": "Verifizierungen",
      "wallet": "Wallet"
    },
    "company": {
      "contact": {
        "city": {
          "error": "Bitte geben Sie einen Ort ein!",
          "label": "Ort",
          "placeholder": "Berlin, London, Paris"
        },
        "country": {
          "desc": "Firmensitz eingeben",
          "error": "Bitte geben Sie einen Firmensitz an!",
          "label": "Firmensitz"
        },
        "postalCode": {
          "error": "Bitte geben Sie eine gültige Postleitzahl ein!",
          "label": "Postleitzahl",
          "placeholder": "12345"
        },
        "streetAndNumber": {
          "error": "Bitte geben Sie eine Straße und eine Hausnummer ein!",
          "label": "Straße und Hausnummer",
          "placeholder": "Meine Straße 15"
        },
        "title": "Contact",
        "website": {
          "error": "Bitte geben Sie eine gültige URL ein!",
          "label": "Website",
          "placeholder": "https://website.com"
        }
      },
      "registration": {
        "company": {
          "error": "Bitte geben Sie einen Firmennamen ein!",
          "label": "Unternehmen",
          "placeholder": "Mein Unternehmen"
        },
        "court": {
          "error": "Bitte geben Sie die Informationen der Registrierungsstelle ein!",
          "label": "Registergericht",
          "placeholder": "Wo ist der Firmensitz?"
        },
        "register": {
          "error": "Bitte wählen Sie den Registertyp aus!",
          "label": "Register",
          "placeholder": "Art des Registers",
          "types": {
            "hra": "HRA",
            "hrb": "HRB"
          }
        },
        "registerNumber": {
          "error": "Bitte geben Sie die Registernummer ein.",
          "label": "Registernummer",
          "placeholder": "Registernummer des Unternehmens"
        },
        "salesTaxID": {
          "error": "Bitte geben Sie die Umsatzsteuer-ID ein.",
          "label": "Umsatzsteuer-ID",
          "placeholder": "Geben Sie Ihre Umsatzsteuer-ID ein..."
        },
        "title": "Registrierung"
      }
    },
    "current-balance": "Aktueller Kontostand",
    "detail": {
      "account-id": "Account-ID",
      "alias": "Alias",
      "balance": "Guthaben",
      "desc": "Profilinformationen",
      "edit": "Profil bearbeiten"
    },
    "device": {
      "detail": {
        "dataStreamSettings": {
          "error": "Bitte fügen Sie IoT-Einstellungsdateien ein!",
          "label": "IoT-Einstellungen",
          "placeholder": "Fügen Sie IoT-Einstellungsdateien hinzu."
        },
        "location": {
          "error": "Bitte geben Sie einen Standort an!",
          "label": "Standort",
          "placeholder": "Geben Sie die Standort Koordinaten ein."
        },
        "manufacturer": {
          "error": "Bitte geben Sie einen Gerätehersteller an!",
          "label": "Hersteller",
          "placeholder": "Geben Sie den Gerätehersteller ein."
        },
        "owner": {
          "error": "Bitte geben Sie eine korrekte Account-Adresse an!",
          "label": "Eigentümer",
          "placeholder": "Geben Sie die Adresse des Besitzerkontos ein."
        },
        "serialNumber": {
          "error": "Bitte geben Sie eine Seriennummer ein!",
          "label": "Seriennummer",
          "placeholder": "Geben Sie die Seriennummer des Geräts ein."
        },
        "settings": {
          "error": "Bitte Einstellungsdateien einfügen!",
          "label": "Einstellungen",
          "placeholder": "Fügen Sie Geräteeinstellungsdateien hinzu."
        },
        "title": "Geräteinformationen",
        "type": {
          "error": "Bitte geben Sie einen Gerätetyp an!",
          "label": "Typ",
          "placeholder": "Geben Sie den Gerätetyp ein."
        }
      }
    },
    "dispatchers": {
      "profile-type": "Profiltyp wird geändert...",
      "profile-update": "Profilinformationen werden gespeichert...",
      "request-verification": "Verifikation wird beantragt...",
      "verification-accept": "Verifikation wird angenommen..."
    },
    "settings": {
      "desc": "Einstellungen",
      "dev-domain": {
        "desc": "Mit dieser Konfiguration wird die Endung \".evan\" durch die angegebene Adresse ersetzt. Über diese Logik ist es möglich, Applikation auf verschiedenen Domains gleichzeitig für Testzwecke zu verwenden (z.B.: myapp.test.evan).",
        "title": "Applikation von Test-Domain"
      },
      "developer-mode": "Entwicklermodus",
      "language": "Sprache",
      "languages": {
        "browser": "Browser-Sprache",
        "de": "Deutsch",
        "en": "Englisch"
      },
      "reload-hint": "Bitte laden Sie die Anwendung neu, wenn Sie die Spracheinstellungen geändert haben."
    },
    "type": {
      "change": "Ändern",
      "choose": "Profiltyp spezifieren",
      "missing-type": "Sie haben noch keinen Profiltypen ausgewählt. Nutzen Sie die nachfolgende Interaktionsfläche, um Ihr Profil genauer zu spezifieren.",
      "no-verifications-avaiable": "Für Ihren Profiltyp stehen aktuell keine Verifikationen zur Verfügung.",
      "switch": "Geben Sie Ihren Profiltyp an."
    },
    "verifications": {
      "add": "Verifikation hinzufügen",
      "back": "Zurück",
      "categories": {
        "identifications": "Identifikationen",
        "notary": "Notarielle Verifikation"
      },
      "done": "Schließen",
      "empty": "Keine Verifikationen verfügbar",
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
          "file-rename-hint": "Die hochgeladenen Dateien werden bei während der Austellung der Organisations-Verifikation in ein einheitliches Namensschema umbenannt.",
          "header": "Organisations-Verifikation ausstellen",
          "issue": "Organisations-Verifikation ausstellen",
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
          "issuing": "Organisations-Verifikation wird ausgestellt",
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
        "no-requests": "Sie haben noch keine notarielle Verifikation beantragt. Nutzen Sie die folgende Schaltfläche um diese anzufordern.",
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
        "request": {
          "fill-missing": "Bitte füllen Sie alle erforderlichen Unternehmensinformationen und speichern Sie diese ab.",
          "only-de": "Momentan wird die Notarverifikation nur für Unternehmen in Deutschland unterstützt. Bitte wählen Sie Deutschland als Unternehmenssitz aus.",
          "contact": {
            "error": "Bitte geben Sie eine Kontaktperson an!",
            "label": "Ansprechpartner",
            "placeholder": "Vorname und Nachname"
          },
          "costs": {
            "approve": "Ja, ich fordere die notarielle Verifikation zu den Transaktionskosten von 200 EVE an.",
            "description": "Die Transaktionskosten für die notarielle Verifikation betragen 200 EVE. Ihr Wallet wird mit diesem Betrag belastet.",
            "hint": "Das Anfordern einer notariellen Verifikation ist kostenpflichtig.",
            "title": "Kosten"
          },
          "department": {
            "error": "Bitte geben Sie eine Abteilung an!",
            "label": "Abteilung",
            "placeholder": "Abteilung"
          },
          "description": "Bitte füllen Sie das Forumlar aus, um eine notarielle Verifikation Ihrer Organisation anzufordern. Dieser Service ist kostenpflichtig.",
          "header": "Notarielle Verifikation",
          "how": {
            "steps": {
              "1": {
                "description": "Geben Sie Handelsregisternummer, Registergericht, Ihre Anschrift und einen Ansprechpartner an.",
                "title": "Anfordern"
              },
              "2": {
                "description": "Sie erhalten eine PIN per Post. Generieren Sie mit dieser das Bestätigungsdokument und senden Sie es unterschrieben per Post an den anfragenden Notar.",
                "title": "Authentifizieren"
              },
              "3": {
                "description": "Ist die notarielle Verifikation erfolgreich, werden Sie benachrichtigt. Akzeptieren Sie als letzten Schritt die Verifikation.",
                "title": "Akzeptieren"
              }
            },
            "title": "Schritte"
          },
          "mail": {
            "body": "Hiermit beantrage Ich eine Notarielle Bestätigung für die folgenden Informationen: <ul><li>Evan-AccountID: {organizationEvanId}</li><li>Handelsregisternummer: {organizationRegistrationNumber}</li><li>Organisation: {organizationName}</li><li>Kontakt: {organizationContact}</li><li>Anschrift: {organizationStreetAddress}</li><li>Stadt: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Beantragung einer Notariellen Bestätigung"
          },
          "not-enough-funds": "<i class=\"mdi mdi-alert-outline\"></i> Sie benötigen mindestens 200 EVE. Ihre Wallet hat nicht genügend EVE ({readableFunds} EVE)! <a href=\"/#/dashboard.evan/profile.evan/buy-eve\">EVE kaufen</a>",
          "postal-address": "Anschrift",
          "proof": {
            "description": "Für die Verifikation Ihres Unternehmens erhalten Sie im nächsten Schritt eine PIN per Post vom Notar zu Händen der folgenden Person.",
            "title": "Bitte überprüfen Sie Ihre Daten."
          },
          "request-ident": "Anfordern",
          "request-verification": "Notarielle Verifikation anfordern",
          "requested1": "Sie haben erfolgreich eine notarielle Verifikation angefordert.",
          "requested2": "Es wurden 200 EVE als Transaktionskosten von Ihrem Wallet abgebucht.",
          "requested3": "Sie erhalten in Kürze vom Notar Post!",
          "requesting": "Notarielle Verifikation wird angefordert...",
          "requesting-account": "Anfragender Account",
          "step": "Schritt",
          "who": {
            "description": "Als eingetragenes Unternehmen können Sie eine notarielle Verifikation Ihres Accounts anfordern.",
            "link": "Mehr erfahren",
            "title": "Voraussetzungen"
          },
          "why": {
            "description": "Mit der notariellen Verifikation wird bestätigt, dass Ihr Unternehmen im Besitz der Account-ID {accountId} ist. Durch diese Bestätigung können Sie sich gegenüber Ihren Geschäftspartnern ausweisen und verifizieren, dass Transaktionen, Digitale Zwillinge und Smart Contracts von Ihnen stammen.",
            "link": "Mehr erfahren",
            "title": "Vorteile"
          }
        },
        "request-error": "Informationen zu dieser Anfrage konnten nicht geladen werden!",
        "request-error-desc": "Bitte laden Sie erneut...",
        "request-notary-verification": "Eine notarielle Bestätigung beantragen",
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
          "unknown": "Anfordern",
          "unknown-long": "Notarielle Verifikation anfordern"
        },
        "step": {
          "costs": "Kosten",
          "summary": "Zusammenfassung",
          "your_data": "Ihre Daten"
        },
        "title": "Notarielle Verifikation",
        "verification": {
          "accept": "Annehmen",
          "incorrect": "Die Ihnen ausgestellten Organisationsidentifikationen wurden nicht von der korrekten Instanz erstellt.",
          "organization": "Organisations-Verifikation",
          "organization-random": "Organisations-ID-Verifikation",
          "status": "Status",
          "verified-by": "Verified by"
        }
      },
      "reload": "Neu-laden",
      "title": "Alle Verifikationen"
    }
  }
}
/* tslint:enable */

export default i18n;
