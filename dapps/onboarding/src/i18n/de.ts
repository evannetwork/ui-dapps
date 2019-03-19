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
const translations = {
  "_onboarding": {
    "close": "Schließen",
    "continue": "Fortfahren",
    "free-input": "Freie Eingabe",
    "invalid-mnemonic-integrity": "Die Zusammensetzung der Wörter Ihres Wiederherstellungs-Schlüssels ist inkorrekt. Bitte überprüfen Sie Ihre Eingabe.",
    "mail-invitation-accepted": {
      "body": "Guten Tag, <br>der Benutzer mit der Email Adresse {userEmail} hat Ihre Einladung in das evan.network angenommen und ist nun verfügbar unter dem Namen: {{ userAlias }}.<br><br> Ihr evan.network Team",
      "subject": "Nutzer hat Ihre Anfrage angenommen",
      "title": "Einladung angenommen"
    },
    "mnemonic-word": "{index}. Word",
    "password": "Passwort",
    "sign-in": {
      "decrypt": "entschlüsseln",
      "desc": "Stellen Sie eine bestehende evan.network Identität auf diesem Gerärt wieder her",
      "desc-long": "Nutzen Sie Ihren Wiederherstellungs-Schlüssel um Ihre bestehende Identität wiederherzustellen. Alle Daten, Kontakte und Verträge werden Sie dort vorfinden, wo Sie sie zurück gelassen haben.",
      "get-mnemonic": "Wiederherstellungs-Schlüssel",
      "get-mnemonic-desc": "Bitte geben Sie die 12 Wörter, die Sie zur Registrierung erhalten haben, ein.",
      "get-password": "Identität entschlüsseln",
      "get-password-desc": "Geben Sie Ihr Passwort ein, um auf die Daten Ihrer Identität zuzugreifen.",
      "invalid-password": "Das eingegebene Passwort ist ungültig.",
      "no-profile": "Kein Identität gefunden",
      "no-profile-desc": "Im Zusammenhang mit diesem Wiederherstellungs-Schlüssel existiert kein evan.network Identität. Bitte überprüfen Sie Ihre Eingabe oder nutzen Sie <b>Registrieren</b>, um eine Identität mit dem aktuellen Schlüssel zu erstellen.",
      "title": "Einloggen",
      "welcome": "Kontaktanfrage",
      "welcome-desc": "Sie haben eine Kontaktanfrage erhalten."
    },
    "sign-up": {
      "agree": "Akzeptieren",
      "cancel-riddle": "abbrechen",
      "create-profile": {
        "desc": "Bestätigen Sie die Nutzungsbedingen und erstellen Sie Ihr Profil.",
        "long": "Alle Daten zur Erstellung Ihrer evan.network Identität wurden aufgenommen. Bitte bestätigen Sie die Nutzungsbedingungen über die Captcha Abfrage, um den Prozess abzuschließen.",
        "status-1": "Erstellung des Identitätsvertrages...",
        "status-2": "Verschlüsselung der Nutzerinformationen...",
        "status-3": "Erstellung Mailbox, Addressbuch, ...",
        "status-4": "Erstellung der Verifizierungsverwaltung...",
        "status-5": "Identität wurde erfolgreich erstellt...",
        "title": "Identität erstellen",
        "creation-time": "ca. {creationTime} / 30 Sekunden"
      },
      "desc": "Erstellen Sie Ihre evan.network Identität",
      "desc-long": "Generieren Sie ihre abgesicherte und eingenständige Identität auf dem evan.network. Mit Hilfe dieser Identität, können Sie mit Geschäftspartnern, Verträgen und Unternehmen interagieren. Sie können Ihre Identität über Ihren generierten Wiederherstellungs-Schlüssel jederzeit auf einem anderen Gerät wiederherstellen und weiter arbeiten.",
      "errors": {
        "password-match-repeat": "Ihr Passwort muss mit der vorherigen Eingabe übereinstimmen.",
        "password-min-characters": "Ihr Passwort muss mindestens 8 Zeichen lang sein.",
        "password-one-character": "Ihr Passwort muss mindestens einen Buchstaben enthalten.",
        "password-one-digest-needed": "Ihr Passwort muss mindestens eine Ziffer enthalten.",
        "password-one-uppercase-character": "Ihr Passwort muss mindestens einen Großbuchstaben enthalten.",
        "user-name": "Bitte geben Sie einen Nutzernamen an!"
      },
      "get-mnemonic": "Wiederherstellungs-Schlüssel",
      "get-mnemonic-desc": "Sichern Sie Ihren Wiederherstellungs-Schlüssel.",
      "get-mnemonic-desc-long": "Mit Hilfe dieses <b>Wiederherstellungs-Schlüssels</b> können Sie Ihre Identität auf <b>jedem beliebigen Gerät</b> wiederherstellen und auf Ihre Daten zugreifen. Bitten <b>sichern Sie sich diese 12 Wörterin einer möglichst sicheren Weise</b> (möglichst offline, z.B. auf einem Blatt Papier im Safe). <br><br> Wenn Sie diese 12 Wörter verlieren, <b>verlieren Sie für den Zugang zu Ihren Geschäftspartnern, Vertägen und Profilinformationen.</b>",
      "password0": "Passwort",
      "password1": "Passwortwiederholung",
      "profile-create-error": {
        "desc": "Während der Profilerstellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        "ok": "ok",
        "title": "Fehler"
      },
      "profile-informations": "Nutzerinformationen",
      "profile-informations-desc": "Bitte wählen Sie einen Nutzernames und ein Passwortes.",
      "terms-of-use": {
        "desc": "Bestätigen Sie die Nutzungsbedingungen und verifizieren Sie ihre reelle Interkation.",
        "full": "Das ist der <b>evan.network testcore</b>.<br><br>Dieses Netzwerk ist nur für Entwicklungs- und Testzwecke und <b>nicht für den Einsatz in der Produktion geeignet.</b> Im testcore geben wir keine Garantie für Datenverlust und -verfügbarkeit.<br><br> Sie können Ihre Fragen zum evan.network in unserem Gitterchannel <a href=\"http://gitter.im/evannetwork\" target=\"_blank\">http://gitter.im/evannetwork</a> oder auf <a href=\"https://evan.network\" target=\"_blank\">https://evan.network</a> stellen.",
        "title": "Nutzungsbedingungen"
      },
      "title": "Registrieren",
      "use-profile": "Weiter",
      "user-name": "Nutzername",
      "welcome": "Kontaktanfrage",
      "welcome-desc": "Sie haben eine Kontaktanfrage erhalten."
    },
    "signed-in": {
      "accept-contact": "Kontaktanfrage akzeptieren",
      "go-to-evan": "Weiter zum evan.network",
      "invited-info": "Herzlich willkommen im evan.network <b>{alias} ({accountId})</b>.<br><br>Sie wurden von <b>{inviteeAlias}</b> in das evan.network eingeladen. Wenn Sie diesen Kontakt zu Ihrem Adressbuch hinzufügen, erhalten Sie <b>{eveAmount} EVE</b> als Einladungsgeschenk.",
      "title": "evan.network Anmeldung",
      "unlock-for-accept": "Sie sind bereits im evan.network angemeldet.<br><br>Sie haben eine Kontaktanfrage von <b>{inviteeAlias}</b> erhalten. Entsperren Sie Ihr Profil um fortzufahren oder nutzen Sie den zurück Button, um Sich mit einer andere Identität anzumelden.",
      "welcome-signed-in": "Sie sind bereits im evan.network angemeldet <b>({accountId})</b>.<br><br>Nutzen Sie den nachfolgenden Button, um mit Ihrer Arbeit fortzufahren oder nutzen Sie den zurück Button, um Sich mit einer andere Identität anzumelden.",
      "welcome-unlocked": "Herzlich willkommen im evan.network <b>{alias} ({accountId})</b>.<br><br>Sie können nun mit Ihrer Arbeit starten."
    }
  }
}

const mainnetTexts = false;
if (mainnetTexts) {
  translations['sign-up']['terms-of-use-text'] = 'Hier werden bald die Mainnet-Nutzungsbedingungen angezeigt ...';
}
/* tslint:enable */

export default translations;
