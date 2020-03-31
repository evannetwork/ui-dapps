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

/**
 * Returns the default webpack vue externals.
 *
 * @param      {any}     customExcludes  object with custom externals
 * @return     {Object}  object with all externals
 */
module.exports = function getCustomExcludes(customExcludes) {
  return {
    '@evan.network/api-blockchain-core': '@evan.network/api-blockchain-core',
    '@evan.network/smart-contracts-core': '@evan.network/smart-contracts-core',
    '@evan.network/ui': '@evan.network/ui',
    '@evan.network/ui-countries': '@evan.network/ui-countries',
    '@evan.network/ui-dapp-browser': '@evan.network/ui-dapp-browser',
    '@evan.network/ui-session': '@evan.network/ui-session',
    '@evan.network/ui-vue-core': '@evan.network/ui-vue-core',
    'ajv-i18n': 'ajv-i18n',
    'bootstrap-vue': 'bootstrap-vue',
    'vee-validate': 'vee-validate',
    'vue-material': 'vue-material',
    'vue-recaptcha': 'vue-recaptcha',
    'vue-router': 'vue-router',
    'vue-select': 'vue-select',
    'vuex-i18n': 'vuex-i18n',
    axios: 'axios',
    dexie: 'dexie',
    lodash: 'lodash',
    moment: 'moment',
    qrcodejs: 'qrcodejs',
    vue: 'vue',
    vuex: 'vuex',
    ...(customExcludes || { }),
  };
};
