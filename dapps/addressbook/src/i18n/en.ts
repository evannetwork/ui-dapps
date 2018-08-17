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
  'addressbook': 'My Contacts',
  'contacts-list': 'My Contacts',
  'contacts': 'My Contacts',
  'contact-add': 'Add Contact',
  'add-via-mail': 'Invitation via Mail',
  'add-via-accountid': 'Invitation via Account ID',
  'add-via-qrcode': 'Invitation using Contact Cards',
  'ContactsDispatcher': 'Contact Management',

  '_dappcontacts': {
    'copy-account-id': 'Account ID kopieren',
    'eves-to-send': 'Onboarding Eves to send',
    'alert': {
      'remove-title': 'Remove Contact',
      'remove-description': 'Do you really want to remove this contact?',
      'eve-missing': 'EVE missing',
      'eve-missing-description': 'You want to send more money than you own. Please recharge your account to send this amount of EVE.',
      'profile-missing': 'Profile missing',
      'profile-missing-description': `
        No profile is stored for the account ID that you want to invite.
        Please check the entered account ID or invite the user by e-mail.
      `
    },
    'remove': 'Remove',
    'alias': 'Name',
    'account-id': 'Account-ID',
    'account-detail': 'Contact Details',
    'accepted': 'Request accepted',
    'account-delete': 'Remove Contact',
    'edit-profile': 'Edit profile',
    'email': 'E-Mail',
    'no_alias': 'No Name',
    'pending': 'Request sent',
    'outstanding': 'Invitation is sending...',
    'save': 'Save',
    'saving': 'Saving',
    'empty-address-book': 'No contacts added...',
    'nothing-found': 'No contacts found for this filter <b>{{ filter }}</b>...',
    'invalid-address': 'Invalid Ethereum address (e.g.: "0x006b0b55b83694983Ece446985BF1FcC625b2eE6")',
    'me': 'Me',
    'delete': 'Remove',
    'my-account': 'My account',
    'invalid-is-my-account': 'You can\'t add your own account as contact.',
    'invalid-already-added': 'A contact with this address is already added to your contacts.',
    'email-already-added': 'A contact with this mail address is already added to your contacts.',
    'account-status': 'Contact Status',
    'create-contact': 'Contact creation',
    'invitation': 'Invitation',
    'invitation-message': 'Invitation Message',
    'invitation-message-long': 'Please review the message that will be sent to the new user.',
    'send-invitation': 'Send Invitation',
    'send-invitation-mail': 'Using an E-Mail',
    'send-invitation-mail-description': `
      Network with a user with an email address.
      The user receives an invitation email with a link to connect to the evan.network.
    `,
    'send-invitation-address': 'Using Account Address',
    'send-invitation-address-description': `
      Network with an existing user.
      The user receives the request directly in his mailbox and can confirm it.
    `,
    'contact-card-invite': 'Using Contact Cards',
    'contact-card-invite-description': `
      Network with a user directly via his or her evan.network business card.
      The user receives the request directly in his mailbox and can confirm it.
    `,
    'contact-cards': 'Contact cards',
    'go-to-mails': 'Go to mailbox',
    'filter_items': 'Filter contacts',
    'invitation-text': {
      'title': 'Contact request',
      'body':
`Hi,

I'd like to add you as a contact. Do you accept my invitation?

With kind regards,

{{ fromName }}`,
    },
    'show': 'Show',
    'dispatcher': {
      'address-book-description': 'Save your added / removed contacts.',
      'key-exchange': 'Contact Invitation',
      'key-exchange-description': 'Send invitation requests to new contacts.',
      'undefined': ''
    },
    'status': {
      'invitation': 'Invitation',
      'invitation-answer': 'Invitation answer',
      'invitation-handshake': 'Handshake',
      'account-status-desc': 'Description'
    },
    'status-desc': {
      'outstanding': `
        You've added this contact. <br><br> The invitiation is sending now.
      `,
      'pending': `
        You sent / received contact information for a new contact.
        <br><br>
        Please check your incoming mails for invitation answers and save the updated contact information.
      `,
      'accepted': `
        You successfully added this contact to your address book.
        <br><br>
        Now you:
        <ul>
          <li>can send secured messages to</li>
          <li>can invite this contact to contracts</li>
          <li>can be invited to contracts from this contact</li>
        </ul>
      `
    }
  }
};
