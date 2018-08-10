/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the

  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,

  or download the license from the following URL: https://evan.network/license/

  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address: https://evan.network/license/
*/

export const de = {
  'addressbook': 'Meine Kontakte',
  'contacts-list': 'Meine Kontakte',
  'contacts': 'Meine Kontakte',
  'contact-add': 'Kontakt hinzufügen',
  'add-via-mail': 'Einladung über E-Mail',
  'add-via-accountid': 'Einladung mit einer Account ID',
  'add-via-qrcode': 'Hinzufügen mit Kontaktkarten',
  'ContactsDispatcher': 'Konkaktmanagement',

  '_dappcontacts': {
    'copy-account-id': 'Copy Account ID',
    'eves-to-send': 'Zu sendende EVEs',
    'alert': {
      'remove-title': 'Konktakt entfernen',
      'remove-description': 'Wollen sie diesen Kontakt wirklich entfernen?',
      'eve-missing': 'Nicht genug EVE',
      'eve-missing-description': `
        Sie wollen mehr Geld versenden als Sie besitzen.
        Bitte laden Sie Ihr Konto auf, um diese Menge EVE zu versenden.
      `,
      'profile-missing': 'Kein Profil',
      'profile-missing-description': `
        Für die account ID des Nutzers der eingeladen werden soll, ist kein Profil hinterlegt.
        Bitte überprüfen Sie die eingegebene account ID oder laden Sie den Nutzer per E-Mail ein.
      `
    },
    'remove': 'Entfernen',
    'alias': 'Name',
    'account-id': 'Account-ID',
    'account-detail': 'Kontaktdetails',
    'accepted': 'Anfrage akzeptiert',
    'account-delete': 'Kontakt entfernen',
    'edit-profile': 'Profil editieren',
    'email': 'E-Mail',
    'no_alias': 'Kein Name verfügbar',
    'pending': 'Anfrage wurde gesendet...',
    'outstanding': 'Anfrage wird gesendet...',
    'save': 'Speichern',
    'saving': 'Speichern',
    'empty-address-book': 'Keine Kontakte hinzugefügt...',
    'nothing-found': 'Es wurden keine Kontakte für den Filter <b>{{ filter }}</b> gefunden...',
    'invalid-address': 'Ungültige Addresse (e.g.: "0x006b0b55b83694983Ece446985BF1FcC625b2eE6")',
    'me': 'Ich',
    'delete': 'Entfernen',
    'my-account': 'Mein Account',
    'invalid-is-my-account': 'Sie können sich nicht selbst als Kontakt hinzufügen.',
    'invalid-already-added': 'Ein Kontakt mit der selben Addresse existiert bereits in Ihren Kontakten.',
    'email-already-added': 'Ein Kontakt mit der selben E-Mail Adresse existiert bereits in Ihren Kontakten..',
    'account-status': 'Kontaktstatus',
    'create-contact': 'Kontakt hinzufügen',
    'invitation': 'Einladung',
    'invitation-message': 'Einladungsnachricht',
    'invitation-message-long': 'Bitte überprüfen Sie die Nachricht, die an den eingeladenen Nutzer gesendet wird.',
    'send-invitation': 'Einladung senden',
    'send-invitation-mail': 'Mit Email Adresse',
    'send-invitation-mail-description': `
      Vernetzen Sie sich mit einem Nutzer mit Hilfe einer Email Adresse.
      Der Nutzer erhält eine Einladungsmail mit einem Link, um sich mit Ihnen zu verbinden.`,
    'send-invitation-address': 'Mit Nutzer ID',
    'send-invitation-address-description': `
      Vernetzen Sie sich mit einem bereits vorhandenem Nutzer.
      Der Nutzer erhält die Anfrage direkt in sein Postfach und kann diese bestätigen
    `,
    'contact-card-invite': 'Mit Visitenkarte',
    'contact-card-invite-description': `
      Vernetzen Sie sich mit einem Nutzer direkt über seine evan.network Visitenkarte.
      Der Nutzer erhält die Anfrage direkt in sein Postfach und kann diese bestätigen.
    `,
    'go-to-mails': 'Zur Mailbox',
    'filter_items': 'Kontakte filtern',
    'invitation-text': {
      'title': 'Kontaktanfrage',
      'body':
`Guten Tag,

ich möchte Sie als Kontakt hinzufügen.

Mit freundlichen Grüßen,

{{ fromName }}`,
    },
    'show': 'Anzeigen',
    'dispatcher': {
      'address-book-description': 'Speichere Änderungen am Addressbuch.',
      'key-exchange': 'Einladungen',
      'key-exchange-description': 'Sende Einladungen an neue Kontakte.',
      'undefined': ''
    },
    'status': {
      'invitation': 'Einladung',
      'invitation-answer': 'Antwort',
      'invitation-handshake': 'Sichere Kommunikation',
      'account-status-desc': 'Beschreibung'
    },
    'status-desc': {
      'outstanding': `
        Sie haben den Kontakt hinzugefügt. Ihre Einladung wird gerade gesendet.
      `,
      'pending': `
        Sie haben eine Einladung an einen neuen Kontakt gesendet.
        <br><br>

        Bitte überprüfen Sie Ihre eingehenden Mails auf eine Antwort und speichern Sie die aktualisierten
        Kontaktdaten Ihres Partners.
      `,
      'accepted': `
        Sie haben erfolgreich diesen Kontakt in Ihr Addressbuch hinzugefügt.
        <br><br>
        Nun können Sie:
        <ul>
          <li>sichere Nachrichten austauschen</li>
          <li>diesen Kontakt in Ihre Verträge einladen</li>
          <li>von diesem Kontakt in Ihre Verträge eingeladen werden</li>
        </ul>
      `
    }
  }
};
