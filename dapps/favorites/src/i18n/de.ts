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
  'favorites': 'Verknüpfungen',
  'dapp-list': 'Verknüpfungen',
  'dapp-add': 'Verknüpfung hinzufügen',

  'BookmarkDispatcher': 'Verknüpfungs-Synchronisation',

  '_dappdapps': {
    'add': 'Verknüpfung hinzufügen',
    'adding': 'Verknüpfung wird hinzugefügt',
    'alert': {
      'validTitle': 'Wollen sie diese Anwendung wirklich hinzufügen?',
      'validMessage': `
        <div class="advanced-alert">
          <div class="alert-img-container">
            <div class="alert-img evan-img-{{ name }}"></div>
          </div>
          <div class="alert-body">
            <h3>{{ name }}</h3>
            <span>{{ description }}</span>
          </div>
        </div>
      `,
      'inValidTitle': 'Ungültige Anwendung',
      'invalidMessage': `
        <div text-center class="advanced-alert">
          <div class="alert-body centered-text">
            <span>Es konnte keine gültige Anwendung für die Vertragsadresse </span>
            <br><br><br>
            <h3>{{ name }}</h3>
            <br>
            <span>
              gefunden werden. Bitte geben sie eine gültige Vertragsadresse ein.
            </span>
          </div>
        </div>
      `,
      'alreadyTitle': 'Verknüpfung bereits hinzugefügt',
      'alreadyMessage': `
        <div class="advanced-alert">
          <div class="alert-img-container">
            <div class="alert-img evan-img-{{ name }}"></div>
          </div>
          <div class="alert-body">
            <h3>{{ name }}</h3>
            <span>{{ description }}</span>
          </div>
        </div>
      `,
    },
    'dapps': 'Verknüpfungen',
    'dispatcher': {
      'add': 'Verknüpfung wurde hinzugefügt',
      'remove': 'Verknüpfung wurde entfern',
      'save-bookmarks': 'Verknüpfungen synchronisieren',
      'save-bookmarks-description': 'Aktuelle Änderungen an den Verknüpfungen in die Blockchain sichern...',
    },
    'edit': 'Editieren',
    'empty-bookmarks': 'Keine Verknüpfungen erstellt...',
    'ensaddress': 'App- / Vertragsadresse',
    'ensaddress-desc': 'Geben Sie eine ENS- oder Vertragsaddresse ein um Sie zu öffnen',
    'featured_dapps': 'Vorgeschlagene Anwendungen',
    'mailbox': 'Mailbox',
    'nothing-found': 'Es wurden keine Verknüpfung für den Filter <b>{{ filter }}</b> gefunden...',
    'remove': 'Entfernen',
    'scan': 'QR-Code scannen',
    'no_title': 'Kein Titel',
    'filter_items': 'Verknüpfungen filtern',
    'copy-url': 'URL kopieren'
  }
};
