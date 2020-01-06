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

const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');
const { isDirectory, } = require('./lib');

gulp.task('link-core', async () => {
  // ensure symlinked projects
  await Promise.all([
    path.resolve('../node_modules'),
    path.resolve('../../ui-dapp-browser/node_modules'),
  ].map(nodeModulePath =>
    Promise.all([
      '../../api/api-blockchain-core',
      '../../api/dbcp',
      '../../api/smart-contracts-core',
      '../ui-dapp-browser',
      'core/evancore.vue.libs',
      'core/ui.libs',
    ].map(async (project) => {
      const moduleName = project.split('/').pop();

      try {
        if (isDirectory(nodeModulePath)) {
          const origin = path.resolve(`../${ project }`);

          if (isDirectory(origin)) {
            const desc = require(`${ origin }/package.json`);
            const symlink = `${ nodeModulePath }/${ desc.name }`;
            const symlinkParent = `${ nodeModulePath }/${ desc.name.split('/')[0] }`;

            // ensure, that sub hierarchy folders exists
            if (symlink !== symlinkParent && !fs.existsSync(symlinkParent)) {
              fs.mkdirSync(symlinkParent);
            }

            await del(symlink, { force: true });
            fs.symlinkSync(origin, symlink);
          }
        }
        console.log(`Linked ${ moduleName } to ${ nodeModulePath }`);
      } catch (ex) {
        console.log(`Not linked ${ moduleName } to ${ nodeModulePath }: ${ ex.message }`);
      }
    }))
  ))
})
