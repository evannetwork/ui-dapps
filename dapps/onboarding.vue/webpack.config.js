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

const getExternals = require('../../scripts/dapp/webpack.externals');

module.exports = require('../../scripts/dapp/webpack.config')(
  require('./dbcp.json').public.name,
  require('path').resolve(__dirname, './dist'),
  true,
  false,
  getExternals({
    '@evan.network/profile.vue': '@evan.network/profile.vue'
  })
);
