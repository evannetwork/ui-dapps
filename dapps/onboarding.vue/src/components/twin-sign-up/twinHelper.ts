/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty ofa
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

import { EvanComponent } from '@evan.network/ui-vue-core';

/**
 * Returns a translation, given by a specific key, from the dbcp.
 *
 * @param      {EvanComponent}  vueInstance  vue instance for getting current language
 * @param      {any}            dbcp         dbcp definition including a i18n specification.
 * @param      {string}         key          key that should be translated (can also be dot
 *                                           seperated)
 */
function getTranslationFromDBCP(vueInstance: EvanComponent, dbcp: any, key: string) {
  const keys = key.split('.');
  const keyLength = keys.length;
  const lang = vueInstance.$i18n.locale();
  let parent = dbcp.i18n[lang] || dbcp.i18n['en'];
  let translation = key;

  for (let i = 0; i < keyLength; i++) {
    // stop if nothing is defined
    if (!(parent && parent[keys[i]])) {
      break;
    }

    // if last element was reached, use translation and stop
    if (i === keyLength - 1) {
      translation = parent[keys[i]];
      break;
    } else {
      parent = parent[keys[i]];
    }
  }

  return translation;
}

export {
  getTranslationFromDBCP,
};
