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
export default {
  "_addressbook": {
    "add": "Add contact",
    "addressbook": "Contacts",
    "addressbook-desc": "Overview of your contacts",
    "addressbook-desc-long": "Add partners here as a contact to share information with them.",
    "alias": "Alias",
    "all": "All",
    "category": "Category",
    "contact-form": {
      "accountId": {
        "desc": "Account ID of a known and existing profile.",
        "error-added": "You have already added the specified account ID to your contacts.",
        "error-invalid": "Please enter a valid account ID (e.g. 0x1637Fa43D44a1Fb415D858a3cf4F7F8596A4048F)!",
        "title": "Account ID"
      },
      "alias": {
        "desc": "Username of the new partner for your contact overview",
        "error": "Please enter an alias!",
        "title": "Alias"
      },
      "bmail": {
        "body": "Hello,\n\nI want to add you as a contact.\n\nBest regards,\n\n{fromName}",
        "desc": "The selected user is notified by blockchain mail / email. In the following form you can adjust the message.",
        "title": "Contact Request"
      },
      "continue": "Continue",
      "desc": "You can use this form to invite a contact via an existing evan.network identity or by email. As soon as you have invited a contact, you can exchange information with it.",
      "desc-email": "Here you can invite another partner based on the e-mail and send him EVE for a first interaction in the evan.network. As soon as your partner has registered in the evan.network, you will receive information in your account.",
      "email": {
        "desc": "Email address for inviting the user to the network.",
        "error-added": "You have already added the specified email address to your contacts.",
        "error-invalid": "Please enter a valid email address!",
        "title": "Email"
      },
      "eve": {
        "desc": "Quantity of EVE sent to the user.",
        "error-eve-missing": "You do not have enough EVE (balance: {eve} EVE).",
        "error-minimum": "You must send at least 1 EVE.",
        "error-number": "Please enter a valid number.",
        "title": "EVE"
      },
      "fromAlias": {
        "desc": "Name of the sender",
        "error": "Please enter a name.",
        "title": "Sender"
      },
      "msgBody": {
        "desc": "Message text",
        "error": "Please enter a message text.",
        "title": "Message text"
      },
      "msgTitle": {
        "desc": "Title of the message",
        "error": "Please enter a subject.",
        "title": "Subject"
      },
      "save": "Save",
      "step1": "Contact Details",
      "step2": "Invitation Message",
      "submit": "Add contact",
      "tags": {
        "desc": "Tags separated by spaces",
        "title": "Tags"
      }
    },
    "detail": "Contact information",
    "dispatcher": {
      "invite": "Inviting Contact...",
      "remove": "Removing Contact...",
      "update": "Updating Contact"
    },
    "identifier": "Address / EMail",
    "no-contacts": {
      "desc": "You have not yet added any contacts to your address book. Use the button below to add a new contact.",
      "title": "No contacts"
    },
    "overview": "Overview",
    "remove-contact": {
      "description": "Do you really want to remove the contact {alias} with the address {accountId} from your contacts?",
      "remove": "Remove contact",
      "title": "Remove contact"
    },
    "tags": "Tags"
  }
}
/* tslint:enable */;
