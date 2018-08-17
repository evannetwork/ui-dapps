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

export const de = {
  'mailbox': 'Mailbox-Nachrichten',
  'mail-detail': 'Nachricht Details',
  '_dappmailbox': {
    'remove': 'Löschen',
    'received': 'Empfangen',
    'sent': 'Gesendet',
    'comm-key': 'Kommunikationsschlüssel',
    'comm-key-error': `
      Während der Kommunkationsschlüssel gespeichert wurde, ist ein Fehler aufgetreten.<br>
      Bitte versuchen sie es erneut.
      <br><br>
      Dieser Fehler kann in den folgenden Fällen auftreten:
      <ul>
        <li>Sie haben bereits eine weiter Einladung an den selben Nutzer geschickt</li>
        <li>Ihr Kontakt hat Ihnen einen invaliden Kommunikationsschlüssel zurück gesendet.</li>
      </ul>
      <br>
      Wenn sie ein weiteres mal versucht haben, diesen Kommunkationsschlüssel in ihr Addressbuch
      hinzuzufügen und es weiterhin nicht funktionert, entfernen Sie den betroffen Kontakt von Ihrem
      Addressbuch und senden Sie diesem eine neue Einladung.
    `,
    'addAccount': {
      'title': 'Kommunikationsschlüssel zu Account hinzufügen`?',
      'message': 'Dadurch können mit dem Benutzer Nachrichten und Verträge ausgehandelt werden',
      'alreadyAddedTitle': 'Kommunikationsschlüssel existiert bereits',
      'alreadyAddedMessage': 'Dieser Schlüssel ist bereits mit einem Benutzer verknüpft und kann nicht mehr hinzugefügt werden!'
    },
    'dispatcher': {
      'send-mail': 'Mailbox elemente synchronisieren',
      'send-mail-description': 'Gesendete Mail Antworten in die Blockchain sichern',
      'send-commkey': 'Sende aktualisierte Kontaktdaten',
      'send-commkey-description': 'Sende aktualisierte Kontaktdaten zurück zu der anfragenden Person.',
      'sendAnswer': 'Antwort gesendet',
      'key-exchange': 'Aktualisierte Kontaktinformationen speichern',
      'add-key': 'Kontaktdetails Aktualisieren',
      'add-key-description': 'Aktualisieren der neu erhaltenen Kontaktinformationen.'
    },
    'already-added': 'Bereits hinzugefügt',
    'showing': 'Zeige',
    'of': 'von',
    'items': 'Elementen',
    'filter_items': 'Nachrichten filtern',
    'adding': 'Wird hinzugefügt',
    'no_alias': 'Kein Alias',
    'enter_answer': 'Antwort erstellen',
    'send_answer': 'Senden',
    'sending': 'Senden',
    'answer': 'Antworten',
    'more_items': 'weitere Antworten',
    'loading_answers': 'Lade weitere Antworten',
    'attachments': 'Anhhänge',
    'empty-mails': 'Keine Nachrichten...',
    'empty-mails-filter': 'Es konnten keine Nachrichten für Ihre Filter gefunden werden...',
    'nothing-found': 'Es wurden keine Nachrichten für den Filter <b>{{ filter }}</b> gefunden...',
    'from': 'Von',
    'answers': 'Antworten',
    'send-answer': 'Antwort senden',
    'no-detail-selected': 'Wählen sie eine Nachricht aus, um sie zu lesen...',
    'loading_more_mail': 'Mehr Nachrichten nachladen...',
    'filter-toggle': 'Filter',
    'from-me': 'Gesendet von mir',
    'from-others': 'Empfangen von anderen',
    'send-by-me': 'Gesendet von mir',
    'sent-to': 'Gesendet an',
    'to': 'An',
    'contact-invitation': 'Kontaktanfrage',
    'add-to-contacts': 'Kontaktanfrage akzeptieren',
    'contact-already-added': 'Kontakt wurde bereits hinzugefügt',
    'contact-invitation-accepted': 'Kontaktanfrage akzeptiert',
    'finish-contact-invitation': 'In Kontakten speichern',
    'accept-contract-invitation': 'Vertrag anzeigen',
    'shared-exchange-key-mail': {
      'title': 'Antwort anpassen',
      'sub-title': 'Bitte überprüfen Sie die Antwort, die an den einladenen Nutzer gesendet wird.',
      'subject': 'Kontaktanfrage akzeptiert',
      'body':
`Hi,

Danke, dass Sie mich als Kontakt hinzugefügt haben. Ich habe Sie in meinem Addressbuch gespeichert.

Im Anhang finden sie unseren sicheren Kommunkationsschlüssel.

Mit freundlichen Grüßen,

{{ fromName }}`,
    },
    'addContract': {
      'title': 'Vertrag zum Profil hinzufügen',
      'message': 'Wollen Sie diesen Vertrag zu Ihrem Profil hinzufügen ?'
    }
  },
  'SendMailDispatcher': 'Mail Sendungen',
  'KeyExchangeDispatcher': 'Sicherer Datenaustausch',
  'mailbox-list': 'Mailbox-Nachrichten'
};
