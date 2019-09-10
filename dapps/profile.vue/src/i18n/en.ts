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

import { translations } from '@evan.network/addressbook';

/* tslint:disable */
const i18n: any = {
  "_profile": {
    "breadcrumbs": {
      "addressbook.vue.evan": "Contacts",
      "detail": "Profile",
      "logout": "Logout",
      "organizations.evan": "Verifications",
      "settings": "Settings",
      "wallet": "Wallet"
    },
    "current-balance": "Current Balance",
    "detail": {
      "account-id": "Account-ID",
      "alias": "Alias",
      "balance": "Balance",
      "desc": "Profile-Details",
      "edit": "Edit Profile"
    },
    "settings": {
      "desc": "Settings",
      "dev-domain": {
        "desc": "With this configuration the ending \".evan\" is replaced by the given address. With this logic it is possible to use applications on different domains simultaneously for test purposes (e.g.: myapp.test.evan).",
        "title": "Applications from test-domain"
      },
      "developer-mode": "Developer Mode",
      "language": "Language",
      "languages": {
        "browser": "Browser-Language",
        "de": "German",
        "en": "English"
      },
      "reload-hint": "Please reload the application if you have changed the language settings."
    }
  }
}
/* tslint:enable */

i18n._addressbook = translations.en._addressbook;

export default i18n;
