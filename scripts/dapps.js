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
const exec = require('child_process').exec;
const express = require('express');
const fs = require('fs');
const gulp = require('gulp');
const inquirer = require('inquirer');
const path = require('path');
const serveStatic = require('serve-static');
const Throttle = require('promise-parallel-throttle');
const { runExec, scriptsFolder, isDirectory, getDirectories, nodeEnv, getArgs } = require('./lib');

let arg, dappDirs, categories, longestDAppName, serves, watching;

/**
 * Initialize dapp folders and symlink core projects
 *
 * @return     {Promise}  resolved when done
 */
async function initialize() {
  console.clear();

  // setup initial values
  arg = getArgs(process.argv);
  longestDAppName = 0;
  serves = { };

  // ask for folders to build / serve
  const prompt = inquirer.createPromptModule();
  categories = (await prompt([{
    name: 'dappCategories',
    message: 'Which dapp categories should be build?',
    type: 'checkbox',
    choices: [
      { name: 'core', value: 'core', checked: true },
      { name: 'dapps', value: 'dapps', checked: true },
      { name: 'evan-libs', value: 'evan-libs', checked: false },
      { name: 'libs', value: 'libs', checked: false },
    ]
  }])).dappCategories;
  dappDirs = [ ]
    .concat(
      ...categories.map(key => getDirectories(path.resolve(`../${ key }`)))
    )
    .sort();

  // check for longest dapp name to have a correct display
  for (let dappDir of dappDirs) {
    const dappNameLength = dappDir.split('/').pop().length;
    if (longestDAppName < dappNameLength) {
      longestDAppName = dappNameLength;
    }
  }

  // save latest serve and build status
  dappDirs.forEach(dappDir =>
    serves[dappDir.split('/').pop()] = { duration: 0, lastDuration: 0 }
  );
}

/**
 * Fill dapp name with spaces to create an clean watching log.
 *
 * @param      {string}  dappName  dapp name
 * @return     {string}  filled dapp name
 */
const getFilledDAppName = (dappName) => {
  while (dappName.length < longestDAppName + 3) {
    dappName += ' ';
  }

  return dappName;
}

/**
 * Return the dapp dirs for a specific category.
 *
 * @param      {string}  category  category name (core, libs, dapps)
 */
const getCatgeroyDAppDirs = (category) => {
  const categoryPath = path.resolve(`${ __dirname }/../${ category }`);
  return dappDirs.filter(dappDir => dappDir.indexOf(categoryPath) !== -1);
}

/**
 * Show the current wachting status
 */
const logServing = async () => {
  console.clear();

  console.log(`Watching DApps`);
  console.log('--------------');
  console.log(`\nbuild type: ${ nodeEnv }`)
  console.log(`\nstarted local server: http://localhost:3000`)

  for (const category of categories) {
    console.log(`\n => ${ category }`);
    for (const dappDir of getCatgeroyDAppDirs(category)) {
      const dappName = dappDir.split('/').pop();
      const logDAppName = getFilledDAppName(dappName);

      // load the status of the dapp
      const status = serves[dappName];
      const wasBuild = serves[dappName].lastDuration;
      const timeLog = wasBuild && serves[dappName].loading
        ? `(${ status.duration }s / ${ status.lastDuration }s)`
        : `(${ status.duration }s)`;
      let statusMsg;
      if (serves[dappName].rebuild) {
        statusMsg = `    ${ logDAppName } »»»»»» ${ timeLog }`;
      } else if (serves[dappName].loading) {
        statusMsg =`    ${ logDAppName } »»»   ${ timeLog }`;
      } else {
        if (watching) {
          statusMsg =`    ${ logDAppName } ∞     ${ timeLog }`;
        } else {
          statusMsg =`    ${ logDAppName } ${ wasBuild ? '√' : '»' }     ${ timeLog }`;
        }
      }

      console.log(statusMsg);

      if (serves[dappName].error) {
        console.log();
        console.error(serves[dappName].error.replace(/^/gm, '      '));
      }
    }
  }

  console.log('\n');
}
/**
 * Build a specific DApp and log the status.
 *
 * @param      {string}  dappDir  the directory of the dapp
 * @return     {Promise<void>}  resolved when done
 */
const buildDApp = async (dappDir) => {
  // if its not already building, build the dapp
  const dappName = dappDir.split('/').pop();
  if (!serves[dappName].loading) {
    serves[dappName].duration = 0;
    serves[dappName].error = '';
    serves[dappName].loading = true;
    logServing();

    // track the build time
    const startTime = Date.now();
    const timeCounter = setInterval(() => {
      serves[dappName].duration = Math.round((Date.now() - startTime) / 1000);
      logServing();
    }, 1000);

    try {
      // navigate to the dapp dir and run the build command
      process.chdir(dappDir);

      await runExec(require(`${ dappDir }/package.json`).scripts.build, dappDir, 'stderr');

      // clear timer and calculate time
      serves[dappName].lastDuration = Math.round((Date.now() - startTime) / 1000);
      
      try {
        // show mac notification
        await runExec(`osascript -e 'display notification "${dappName} was successfully build in ${serves[dappName].lastDuration} seconds." with title "${dappName} build"'`)
      } catch (ex) { }
      
      delete serves[dappName].error;
    } catch (ex) {
      try {
        // show mac notification
        await runExec(`osascript -e 'display notification "Error building ${dappName}" with title "${dappName} build"'`)
      } catch (ex) { }
      serves[dappName].error = ex;
    }

    clearInterval(timeCounter);

    // reset loading, rebuild if nessecary
    serves[dappName].loading = false;
    if (serves[dappName].rebuild) {
      buildDApp(dappDir);
    } else {
      logServing();
    }

    // remove rebuilding flag
    delete serves[dappName].rebuild;
  } else {
    // if multiple files were changed, set the rebuild flag
    serves[dappName].rebuild = true;
  }
}

const startStaticServer = async () => {
  const app = express();
  const dappBrowserPath = path.resolve('../node_modules/@evan.network/ui-dapp-browser');

  app.use(serveStatic(`${ dappBrowserPath }/runtime`));
  app.use(serveStatic('.'));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use('/dev-dapps', (req, res) => {
    const data = { externals: [] };

    try {
      data.externals = getDirectories(path.resolve(`${ dappBrowserPath }/runtime/external`))
        .map(external => external.split(path.sep).pop());
    } catch (ex) { }

    console.log('Serving DApps locally: ' + data.externals.join(', '));

    res.send(data);
  });

  return new Promise(resolve => app.listen(3000, resolve));
}

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-serve', async () => {
  await initialize();
  // set watching flag so output will be correct
  watching = true;

  // start watching
  dappDirs.forEach(dappDir =>
    gulp.watch(`${dappDir}/src/**/*`, (event) => buildDApp(dappDir))
  );

  setTimeout(() => logServing());
});

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-build', async function () {
  // check which dapp categories should be build
  await initialize();

  // only build one dapp
  if (arg.folder) {
    // relative to root
    process.chdir('..');
    try {
      // navigate to the dapp dir and run the build command
      await buildDApp(path.resolve(arg.folder));
    } catch (ex) {
      console.error(ex);
    }
  } else {
    // build all categories
    for (const category of categories) {
      await Throttle.all(getCatgeroyDAppDirs(category).map(dappDir => async () => {
        try {
          // navigate to the dapp dir and run the build command
          await buildDApp(dappDir);
        } catch (ex) {
          console.error(ex);
        }
      }), { maxInProgress: 10 });
    }
  }
});

// start local file server and start dapp watching
gulp.task('serve', gulp.series([ () => startStaticServer(), ], 'dapps-serve'));

gulp.task('default', gulp.series([ 'dapps-build' ]));
