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

const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const commonShake = require('common-shakeify');
const fs = require('fs');
const gulp = require('gulp');
const gulpReplace = require('gulp-replace');
const path = require('path');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const { runExec } = require('../lib');

// extract the dapp relative folder
const dappRelativePath = process.argv[process.argv.indexOf('--dapp') + 1];
const rootFolder = path.resolve(process.cwd(), '..');

/**
 * check if a folder exists, else, create it
 */
const checkFolder = function(folder) {
  try {
    fs.mkdirSync(folder);
  } catch (err) { }
};

/**
 * Get the dapp name from an ens path.
 *
 * @param      {string}  ens     ens path to parse
 * @return     {string}  dapp name
 */
const parseEnsName = function(ens) {
  return ens.replace(/-/g, '');
};

gulp.task('browserify', async function(callback) {
  const dbcp = require(`${ dappRelativePath }/dbcp.json`);
  const outFileName = dbcp.public.dapp.entrypoint;
  const buildFolder = `${ dappRelativePath }/dist/build`;
  const indexFile = `${ buildFolder }/index.js`;
  const distFolder = `${ dappRelativePath }/dist`;
  const runtimeFolder = `${ rootFolder }/node_modules/@evan.network/ui-dapp-browser/runtime/external/${ dbcp.public.name }`;

  // ensure dist folder exists
  checkFolder(distFolder);

  // build typescript
  await runExec(`npm run tsc ${ dappRelativePath }`, rootFolder);

  await new Promise((resolve, reject) => {
    const buildJob = browserify(indexFile, {
      standalone: dbcp.public.name,
      ignoreMissing: true,
      debug: true,
    });

    // mark tsconfig excludes as external
    try {
      tsConfig = require(`${ dappRelativePath }/tsconfig.json`);

      if (tsConfig && tsConfig.exclude && Array.isArray(tsConfig.exclude)) {
        tsConfig.exclude.forEach((exclude) => buildJob.exclude(exclude));
      }
    } catch(ex) { }

    buildJob
      .exclude('bcc')
      .transform('babelify', {
        // compact everything
        compact: true,
        // remove comments
        comments: false,
        //parse all sub node_modules es5 to es6
        global: true,
        //important!
        ignore: [
          // underscore gets broken when we try to parse it
          /underscore/,

          // remove core-js and babel runtime,
          // https://github.com/babel/babel/issues/8731#issuecomment-426522500
          /[\/\\]core-js/,
          /@babel[\/\\]runtime/,
        ],
        presets: [
          '@babel/env'
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          // include lodash plugin to pull all lodash functions and imports together and down size the
          // bundle
          'lodash'
        ],
      })
      .plugin(commonShake, { /* options */ })
      .bundle()
      .pipe(source(outFileName))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./', {
        sourceMappingURL: function(file) {
          return `http://localhost:3000/external/${ dbcp.public.name }/${ file.relative }.map`;
        }
      }))
      .pipe(gulp.dest(`${ distFolder }`))
      .on('end', () => {
        const dbcpPath = path.resolve(`${ dappRelativePath }/dbcp.json`);

        gulp.src([ dbcpPath ]).pipe(gulp.dest(distFolder));

        const dbcp = {
          dbcpPath: `${dbcpPath}`
        };

        fs.writeFileSync(
          `${distFolder}/dbcpPath.json`,
          JSON.stringify(dbcp)
        );

        resolve();
      });
  })

  await new Promise((resolve, reject) => gulp
    .src(`${ distFolder }/${ outFileName }`)
    .pipe(gulpReplace('if (global._babelPolyfill) {', 'if (false) {'))
    .pipe(gulpReplace('bitcore.versionGuard(global._bitcore)', 'bitcore.versionGuard()'))
    .pipe(gulpReplace('/* common-shake removed: exports.createDecipher = */ void createDecipher', 'exports.createDecipher = createDecipher'))
    .pipe(gulpReplace('/* common-shake removed: exports.createDecipheriv = */ void createDecipheriv', 'exports.createDecipheriv = createDecipheriv'))
    .pipe(gulpReplace('/* common-shake removed: exports.createCipheriv = */ void createCipheriv', 'exports.createCipheriv = createCipheriv'))
    .pipe(gulpReplace('/* common-shake removed: exports.createCipher = */ void createCipher', 'exports.createCipher = createCipher'))
    .pipe(gulpReplace('exports.randomBytes = /* common-shake removed: exports.rng = */ void 0, /* common-shake removed: exports.pseudoRandomBytes = */ void 0, /* common-shake removed: exports.prng = */ require(\'randombytes\');', 'exports.randomBytes = require(\'randombytes\');'))
    .pipe(gulpReplace('require("babel-polyfill");', ''))
    .pipe(gulpReplace('var createBC = function () {', 'require("babel-polyfill");\nvar createBC = function () {'))
    .pipe(gulpReplace('interruptStep\ \=\ 200\;', 'interruptStep\ \=\ 2000\;'))
    .pipe(gulpReplace('"use strict";', ''))
    .pipe(gulp.dest(`${ distFolder }`))
    .on('end', () => resolve())
  );

  await runExec('rm -r ./build', distFolder);

  // copy the build files into the runtimeFolder
  await new Promise((resolve, reject) => {
    gulp
      .src(`${ distFolder }/**/*`)
      .pipe(gulp.dest(runtimeFolder))
      .on('end', () => resolve());
  });
});

gulp.task('default', gulp.series([ 'browserify' ]));
