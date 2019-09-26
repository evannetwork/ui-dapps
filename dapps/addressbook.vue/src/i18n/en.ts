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
    "addressbook-desc": "Overview about your trusted contacts",
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
        "desc": "Username of the new contact",
        "error": "Please enter an alias!",
        "title": "Alias"
      },
      "bmail": {
        "body": "Hello,\n\nI want to add you as a contact.\n\nBest regards,\n\n{fromName}",
        "desc": "The selected user is notified by blockchain mail / e-mail. In the following form you can adjust the message.",
        "title": "Contact Request"
      },
      "continue": "Continue",
      "desc": "You can use this form to invite a contact via an existing evan.network identity or by e-mail. As soon as you have invited a contact, you can exchange secure messages with them and invite them into contracts.",
      "desc-email": "Once a user is invited by email, you cannot use this contact directly to share something with that user. As soon as the login process of the invited user is completed, you will receive a blockchain mail with that you can finish the invitation process and update the contact details. You can also send EVE as a starting credit.",
      "email": {
        "desc": "E-mail address for inviting the user to the network.",
        "error-added": "You have already added the specified e-mail address to your contacts.",
        "error-invalid": "Please enter a valid e-mail address!",
        "title": "E-Mail"
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
        "desc": "Tags seperated using spaces",
        "title": "Tags"
      }
    },
    "detail": "Contact information",
    "dispatcher": {
      "invite": "Inviting Contact...",
      "remove": "Removing Contact...",
      "update": "Updateing Contact"
    },
    "identifier": "Address / E-Mail",
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
