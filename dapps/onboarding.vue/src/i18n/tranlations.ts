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

import de from './de.json';
import en from './en.json';

// add profile translations for profile specific forms
import * as profileDApp from '@evan.network/profile.vue';
import * as countriesDApp from '@evan.network/ui-countries';

// map all langugages
export default {
  de: { ...de, ...(profileDApp as any).translations.de, ...countriesDApp.translations.de },
  en: { ...en, ...(profileDApp as any).translations.en, ...countriesDApp.translations.en },
};
