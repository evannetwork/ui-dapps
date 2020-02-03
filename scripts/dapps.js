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

/* eslint-disable no-console */

const express = require('express');
const gulp = require('gulp');
const inquirer = require('inquirer');
const path = require('path');
const serveStatic = require('serve-static');
const Throttle = require('promise-parallel-throttle');
const {
  runExec, getDirectories, nodeEnv, getArgs,
} = require('./lib');

let arg;
let dappDirs;
let categories;
let longestDAppName;
let serves;
let watching;
let expressApp;

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
      { name: 'playground', value: 'playground', checked: false },
    ],
  }])).dappCategories;
  dappDirs = [
    ...categories.map((key) => getDirectories(path.resolve(`../${key}`))),
  ].sort();

  // check for longest dapp name to have a correct display
  dappDirs.forEach((dappDir) => {
    const dappNameLength = dappDir.split('/').pop().length;
    if (longestDAppName < dappNameLength) {
      longestDAppName = dappNameLength;
    }
  });

  // save latest serve and build status
  dappDirs.forEach((dappDir) => {
    serves[dappDir.split('/').pop()] = { duration: 0, lastDuration: 0 };
  });
}

/**
 * Fill dapp name with spaces to create an clean watching log.
 *
 * @param      {string}  dappName  dapp name
 * @return     {string}  filled dapp name
 */
const getFilledDAppName = (initialDAppName) => {
  let dappName = initialDAppName;
  while (dappName.length < longestDAppName + 3) {
    dappName += ' ';
  }

  return dappName;
};

/**
 * Return the dapp dirs for a specific category.
 *
 * @param      {string}  category  category name (core, libs, dapps)
 */
const getCategoryDAppDirs = (category) => {
  const categoryPath = path.resolve(`${__dirname}/../${category}`);
  return dappDirs.filter((dappDir) => dappDir.indexOf(categoryPath) !== -1);
};

/**
 * Show the current wachting status
 */
const logServing = async () => {
  console.clear();

  console.log('----------------------');
  console.log('│ evan.network dapps │');
  console.log('----------------------');

  console.log(`\nbuild type           : ${watching ? 'serving' : 'building'}`);
  console.log(`environment          : ${nodeEnv}`);
  if (expressApp) {
    console.log('started local server : http://localhost:3000');
  }

  categories.forEach((category) => {
    // calculate good looking categoryTitle
    let categoryTitle = ` ${category} `;
    while (categoryTitle.length < longestDAppName + 16) {
      categoryTitle = categoryTitle.length % 2 ? `${categoryTitle}-` : `-${categoryTitle}`;
    }
    console.log(`\n${categoryTitle}`);

    getCategoryDAppDirs(category).forEach((dappDir) => {
      const dappName = dappDir.split('/').pop();
      const logDAppName = getFilledDAppName(dappName);

      // load the status of the dapp
      const status = serves[dappName];
      const wasBuild = serves[dappName].lastDuration;
      const timeLog = wasBuild && serves[dappName].loading
        ? `(${status.duration}s / ${status.lastDuration}s)`
        : `(${status.duration}s)`;
      let statusMsg;
      if (serves[dappName].rebuild) {
        statusMsg = ` ${logDAppName} »»»»»» ${timeLog}`;
      } else if (serves[dappName].loading) {
        statusMsg = ` ${logDAppName} »»»   ${timeLog}`;
      } else if (watching) {
        statusMsg = ` ${logDAppName} ∞     ${timeLog}`;
      } else {
        statusMsg = ` ${logDAppName} ${wasBuild ? '√' : '»'}     ${timeLog}`;
      }

      console.log(statusMsg);

      if (serves[dappName].error) {
        console.log();
        console.error(serves[dappName].error.replace(/^/gm, '      '));
      }
    });
  });

  console.log('\n');
};
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

      // eslint-disable-next-line
      await runExec(require(`${dappDir}/package.json`).scripts.build, dappDir);

      // clear timer and calculate time
      serves[dappName].lastDuration = Math.round((Date.now() - startTime) / 1000);

      try {
        // show mac notification
        await runExec(`osascript -e 'display notification "${dappName} was successfully build in `
          + `${serves[dappName].lastDuration} seconds." with title "${dappName} build"'`);
        if (process.env.LIVE_RELOAD === 'chrome') {
          await runExec('osascript -e \'tell application "Google Chrome" to reload (tabs of window'
            + '1 whose URL contains "localhost:3000")\'');
        } else if (process.env.LIVE_RELOAD === 'brave') {
          await runExec('osascript -e \'tell application "Brave Browser" to reload (tabs of window'
            + '1 whose URL contains "localhost:3000")\'');
        }
      } catch (ex) {
        // not ios?
      }

      delete serves[dappName].error;
    } catch (ex) {
      try {
        // show mac notification
        await runExec(`osascript -e 'display notification "Error building ${dappName}" with`
          + `title "${dappName} build"'`);
      } catch (innerEx) {
        // not ios?
      }
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
};

const startStaticServer = async () => {
  expressApp = express();
  const dappBrowserPath = path.resolve('../node_modules/@evan.network/ui-dapp-browser');

  expressApp.use(serveStatic(`${dappBrowserPath}/runtime`));
  expressApp.use(serveStatic('.'));
  expressApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  expressApp.use('/dev-dapps', (req, res) => {
    const data = { externals: [] };
    try {
      data.externals = getDirectories(path.resolve(`${dappBrowserPath}/runtime/external`))
        .map((external) => external.split(path.sep).pop());
    } catch (ex) {
      console.error('external folder does not exist');
    }
    res.send(data);
  });

  return new Promise((resolve) => expressApp.listen(3000, resolve));
};

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-serve', async () => {
  await initialize();
  // set watching flag so output will be correct
  watching = true;

  // start watching
  dappDirs.forEach((dappDir) => gulp.watch(`${dappDir}/src/**/*`, () => buildDApp(dappDir)));

  setTimeout(() => logServing());
});

// Run Express, auto rebuild and restart on src changes
gulp.task('dapps-build', async () => {
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
    for (let i = 0; i < categories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await Throttle.all(getCategoryDAppDirs(categories[i]).map((dappDir) => async () => {
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
gulp.task('serve', gulp.series(startStaticServer, 'dapps-serve'));

gulp.task('default', gulp.series(['dapps-build']));
