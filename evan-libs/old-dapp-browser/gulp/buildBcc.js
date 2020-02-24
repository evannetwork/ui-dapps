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

const path = require('path');
const fs = require('fs');
const { runExec, scriptsFolder, isDirectory, getDirectories } = require('../../../scripts/lib');
const dbcpFolder = path.resolve(`../../node_modules/@evan.network/dbcp`);
const bccFolder = path.resolve(`../../node_modules/@evan.network/api-blockchain-core`);

async function build() {
  if (fs.existsSync(`${ dbcpFolder }/src/index.ts`)) {
    await runExec('npm run build', dbcpFolder);
  }
  if (fs.existsSync(`${ bccFolder }/src/index.ts`)) {
    await runExec('npm run build', bccFolder);
  }
}

build();
