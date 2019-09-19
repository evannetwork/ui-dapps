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
export default {
  "_onboarding": {
    "close": "Schließen",
    "continue": "Fortfahren",
    "free-input": "Freie Eingabe",
    "invalid-mnemonic-integrity": "Die Zusammensetzung der Wörter Ihres Wiederherstellungs-Schlüssels ist inkorrekt. Bitte überprüfen Sie Ihre Eingabe.",
    "invalid-mnemonic-word": "Dies ist kein korrektes Wort für einen Wiederherstellungschlüssel!",
    "mail-invitation-accepted": {
      "body": "Guten Tag, <br>der Benutzer mit der Email Adresse {userEmail} hat Ihre Einladung in das evan.network angenommen und ist nun verfügbar unter dem Namen: {{ userAlias }}.<br><br> Ihr evan.network Team",
      "subject": "Nutzer hat Ihre Anfrage angenommen",
      "title": "Einladung angenommen"
    },
    "mnemonic-word": "{index}. Word",
    "mnemonic-words": "12 Wörter",
    "password": "Passwort",
    "password-match-repeat": "Die Passwörter müssen übereinstimmen.",
    "password-min-characters": "Das Passwort muss mindestens 8 Zeichen enthalten",
    "password-one-character": "Das Passwort muss mindestens ein Zeichen enthalten",
    "password-one-digest-needed": "Das Passwort muss mindestens eine Zahl enthalten",
    "password-one-uppercase-character": "Das Passwort muss mindestens einen Großbuchstaben enthalten",
    "password-repeat": "Passwort wiederholen",
    "please-login-signup": "Nutzen Sie ein bestehende Identität oder erstellen Sie eine neue, um fortzufahren.",
    "sign-in": {
      "decrypt": "Entschlüsseln",
      "desc": "Stellen Sie eine bestehende evan.network Identität auf diesem Gerärt wieder her",
      "get-mnemonic": "Wiederherstellungs-Schlüssel",
      "get-mnemonic-desc": "Bitte geben Sie die 12 Wörter, die Sie zur Registrierung erhalten haben, ein.",
      "get-password": "Identität entschlüsseln",
      "get-password-desc": "Geben Sie Ihr Passwort ein, um auf die Daten Ihrer Identität zuzugreifen.",
      "invalid-password": "Das eingegebene Passwort ist ungültig.",
      "next": "Weiter",
      "no-profile": "Kein Identität gefunden",
      "no-profile-desc": "Im Zusammenhang mit diesem Wiederherstellungs-Schlüssel existiert kein evan.network Identität.",
      "not-signed-up": "Noch keinen Account? <a href=\"#/dashboard.vue.evan/onboarding.vue.evan/sign-up\">Account erstellen</a>",
      "recovery-key": "Wiederherstellungs Schlüssel",
      "title": "Einloggen",
      "welcome": "Kontaktanfrage",
      "welcome-desc": "Sie haben eine Kontaktanfrage erhalten."
    },
    "sign-up": {
      "account-type": "Account Typ",
      "agree": "Akzeptieren",
      "alias": "Account Name",
      "alias-help": "Der Account Name ist nur für Sie sichtbar",
      "already-signed-up": "Bereits registriert? <a href=\"#/dashboard.vue.evan/onboarding.vue.evan/sign-in\">Login</a>",
      "cancel-riddle": "Abbrechen",
      "create-profile": {
        "creation-time": "ca. {creationTime} / 30 Sekunden",
        "desc": "Bitte bestätigen Sie das Captcha und die Nutzungsbedingen.",
        "long": "Alle Daten zur Erstellung Ihrer evan.network Identität wurden aufgenommen. Bitte bestätigen Sie die Nutzungsbedingungen über die Captcha Abfrage, um den Prozess abzuschließen.",
        "status-1": "Erstellung des Identitätsvertrages...",
        "status-2": "Verschlüsselung der Nutzerinformationen...",
        "status-3": "Erstellung Mailbox, Addressbuch, ...",
        "status-4": "Erstellung der Verifizierungsverwaltung...",
        "status-5": "Identität wurde erfolgreich erstellt...",
        "title": "Account erstellen"
      },
      "create-account": "Erstellen Sie ihren Account",
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
      "headings": {
        "header-0" : "Ihr Tor zur Digitalisierung",
        "desc-0": "Digitale Identitäten allein bilden noch kein Netzwerk. Es wird auch eine neutrale operative Plattform, auf der Transaktionen zwischen Dingen, Organisationen und Menschen sicher und zuverlässig abgewickelt werden können, benötigt.",
        "header-1": "Transparenz",
        "desc-1": "Die Blockchain-Technologie ermöglicht die Transparenz von Transaktionen durch die Sicherstellung einer nicht personalisierten Transparenz. Jede Transaktion kann von jedem Mitglied der Blockchain eingesehen werden. Ihre Privatsphäre wird geschützt, indem entschlüsselte Adressen anstelle von einfachen Namen verwendet werden.",
      },
      "password0": "Passwort",
      "password1": "Passwortwiederholung",
      "password-help": "Das Passwort muss aus mindestens 8 Zeichen bestehen (Groß-/Kleinbuchstaben, Zahlen und Sonderzeichen.",
      "profile-create-error": {
        "desc": "Während der Profilerstellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
        "ok": "ok",
        "title": "Fehler"
      },
      "profile-informations": "Nutzerinformationen",
      "profile-informations-desc": "Bitte wählen Sie einen Nutzernames und ein Passwortes.",
      "select-account-type": "Bitte wählen Sie einen Account Typ",
      "terms-of-use": {
        "desc": "Bestätigen Sie die Nutzungsbedingungen und verifizieren Sie ihre reelle Interkation.",
        "title": "Nutzungsbedingungen"
      },
      "terms-accepted": "Ich Stimme den <a href=\"https://evan.network/terms/\" target=\"_blank\">Nutzungsbedingungen</a> zu.",
      "title": "Registrieren",
      "use-profile": "Weiter",
      "user-name": "Account Name",
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
/* tslint:enable */
