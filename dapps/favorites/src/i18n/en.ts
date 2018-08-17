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
  'favorites': 'Bookmarks',
  'dapp-list': 'Bookmarks',
  'dapp-add': 'Add Bookmark',

  'BookmarkDispatcher': 'Bookmark Synchronization',

  '_dappdapps': {
    'add': 'Add Bookmark',
    'adding': 'Adding Bookmark',
    'alert' : {
      'validTitle': 'Are you sure you want to add this Bookmark?',
      'dappMessage': `
        <div class="advanced-alert evan-temporary-{{ trimmedName }}">
          <div class="alert-img-container" style="background-color: red">
            <div class="alert-img"></div>
          </div>
          <div class="alert-body">
            <h3>{{ translated.name }}</h3>
            <span>{{ translated.description }}</span>
          </div>
        </div>
      `,
      'inValidTitle': 'Invalid Bookmark address',
      'invalidMessage': `
        <div text-center class="advanced-alert">
          <div class="alert-body centered-text">
            <span>Could not load configuration for ENS address</span>
            <br><br><br>
            <h3>{{ name }}</h3>
            <br>
            <span> please insert a valid Bookmark address </span>
          </div>
        </div>
      `,
      'alreadyTitle' : 'Bookmark already added',
      'alreadyMessage': `
        <div class="advanced-alert evan-temporary-{{ trimmedName }}">
          <div class="alert-img-container">
            <div class="alert-img"></div>
          </div>
          <div class="alert-body">
            <h3>{{ translated.name }}</h3>
            <span>{{ translated.description }}</span>
          </div>
        </div>
      `,
      'deleteDAppTitle': 'Do you realy want to remove this Bookmark?'
    },
    'dapps': 'Bookmarks',
    'dispatcher': {
      'add': 'Bookmark added',
      'remove': 'Bookmark removed',
      'save-bookmarks': 'Save bookmarks',
      'save-bookmarks-description': 'Saving the current bookmark changes to the Blockchain.',
    },
    'edit': 'Edit',
    'featured_dapps': 'Featured Bookmarks',
    'empty-bookmarks': 'Nothing bookmarked...',
    'ensaddress' : 'Bookmark / Contract address',
    'ensaddress-desc': 'Insert ENS address or contract id to open',
    'mailbox': 'Mailbox',
    'nothing-found': 'No Bookmarks found for this filter <b>{{ filter }}</b>...',
    'remove': 'Remove',
    'scan': 'Scan QR-Code',
    'no_title': 'No title',
    'filter_items': 'Filter bookmarks',
    'copy-url': 'Copy URL'
  }
};
