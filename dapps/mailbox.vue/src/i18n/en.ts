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
  _mailbox: {
    mailbox: 'Notifications',
    add: 'Nachricht senden',
    attachments: {
      commKey: {
        accepted: 'Show contact',
        'modal-body': 'Do you really want to add this contact?',
        new: 'Accept contact request',
      },
      continue: 'continue',
      contract: {
        accepted: 'Open contract',
        'modal-body': 'Do you really want to accept this contract?',
        new: 'Accept contract invitation',
      },
      keys: {
        accepted: 'Open target',
        'modal-body': 'Do you really want to store the keys?',
        new: 'Store keys in profile',
      },
      url: {
        accepted: 'Open Attachment',
      },
      verifications: {
        accepted: 'Open target',
        'modal-body': 'You want to confirm the verifications?',
        new: 'Confirm verification(s)',
      },
      identityAccess: {
        accepted: 'Switch identity',
        'modal-body': 'Do you really want to save this identity access?',
        new: 'Save identity access',
      },
      identityAccessRemove: {
        accepted: 'Switch identity',
        'modal-body': 'Do you really want to remove this identity access?',
        new: 'Remove identity access',
      },
    },
    breadcrumbs: {
      received: 'Incoming Messages',
      sent: 'Outgoing Messages',
    },
    detail: 'Message Details',
    dispatcher: {
      attachment: {
        title: 'Attachment being processed',
        starting: 'Attachment is processed',
        step0: false,
        finished: 'Attachment was processed',
      },
    },
    'load-more': 'Load More...',
    received: 'Received',
    sent: 'Sent',
    to: 'to',
  },
};
