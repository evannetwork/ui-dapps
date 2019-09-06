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
      "addressbook.vue.evan": "Kontakte",
      "detail": "Profil",
      "logout": "Ausloggen",
      "organizations.evan": "Verifizierungen",
      "settings": "Einstellungen",
      "wallet": "Wallet"
    },
    "detail": {
      "account-id": "Account-ID",
      "alias": "Alias",
      "balance": "Guthaben",
      "desc": "Profilinformationen",
      "edit": "Profil bearbeiten"
    },
    "settings": {
      "desc": "Einstellungen",
      "dev-domain": {
        "desc": "Mit dieser Konfiguration wird die Endung \".evan\" durch die angegebene Adresse ersetzt. Über diese Logik ist es möglich, Applikation auf verschiedenen Domains gleichzeitig für Testzwecke zu verwenden (z.B.: myapp.test.evan).",
        "title": "Applikation von Test-Domain"
      },
      "developer-mode": "Entwicklermodus",
      "language": "Sprache",
      "languages": {
        "browser": "Browser-Sprache",
        "de": "Deutsch",
        "en": "Englisch"
      },
      "reload-hint": "Bitte laden Sie die Anwendung neu, wenn Sie die Spracheinstellungen geändert haben."
    }
  }
}
/* tslint:enable */

i18n._addressbook = translations.de._addressbook;

export default i18n;
