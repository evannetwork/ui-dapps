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

export const en = {
  'mailbox': 'Mailbox',
  'maildetail': 'Mail Detail',
  '_dappmailbox': {
    'remove': 'Delete',
    'received': 'Received',
    'sent': 'Sent',
    'comm-key': 'Communication Key',
    'comm-key-error': `
      An error occured while adding your shared communication key to your profile. <br>
      Please try again.
      <br><br>
      If you tried it again and it not works, please remove the contact from your address book
      and send a new invitation.
    `,
    'addAccount': {
      'title': 'Add this Account to your Contact list?',
      'message': 'When adding this account, you can invite and can be invited to custom contracts',
      'alreadyAddedTitle': 'Account already in your contact list',
      'alreadyAddedMessage': 'This communication key is already associated to the account in your contact list!'
    },
    'dispatcher': {
      'send-mail': 'Sync Mailbox elements',
      'send-mail-description': 'Send Mail answers to the blockchain',
      'send-commkey': 'Send secured contact update',
      'send-commkey-description': 'Send your updated contact details back to the inviting one.',
      'sendAnswer': 'Answer sent',
      'key-exchange': 'Save updated contact data',
      'add-key': 'Contact detail update',
      'add-key-description': 'Update the newly received data from the contact acceptation.'
    },
    'already-added': 'Already added',
    'showing': 'Showing',
    'of': 'of',
    'items': 'items',
    'filter_items': 'Filter mails',
    'adding': 'Adding account',
    'no_alias': 'No alias',
    'enter_answer': 'Answer here',
    'send_answer': 'Send answer',
    'sending': 'Sending',
    'answer': 'Answer',
    'more_items': 'more answers',
    'loading_answers': 'Loading more answers',
    'attachments': 'Attachment(s)',
    'empty-mails': 'No mails...',
    'empty-mails-filter': 'Nothing found for the current filters...',
    'nothing-found': 'No mails found for this filter <b>{{ filter }}</b>...',
    'from': 'From',
    'answers': 'Answers',
    'send-answer': 'Send Answer',
    'no-detail-selected': 'Choose a message to read it...',
    'loading_more_mail': 'Load more mails...',
    'filter-toggle': 'Filter',
    'from-me': 'Sent by me',
    'from-others': 'Received by others',
    'send-by-me': 'Sent by me',
    'sent-to': 'Send to',
    'to': 'To',
    'contact-invitation': 'Contact request',
    'add-to-contacts': 'Accept contact request',
    'contact-already-added': 'Contact already added',
    'contact-invitation-accepted': 'Contract request accepted',
    'finish-contact-invitation': 'Update contact data',
    'accept-contract-invitation': 'View contract details',
    'shared-exchange-key-mail': {
      'title': 'Adjust Answer Mail',
      'sub-title': 'Please review the answer that will be sent to the user.',
      'subject': 'Contact request Accepted',
      'body':
`Hi,

Thank you for the contact request. I've add you as a contact.

My secure communication key can be found in the appendix.

With kind regards,

{{ fromName }}`,
    },
    'addContract': {
      'title': 'Accept contract',
      'message': 'Would you add this contract to your profile?'
    }
  },
  'SendMailDispatcher': 'Mail sending',
  'KeyExchangeDispatcher': 'Secure Data exchange',
  'mailboxlist': 'Mailbox'
};
