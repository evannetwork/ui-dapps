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

// parse prams and set defaults
const argv = require('minimist')(process.argv.slice(2));
const accounts = require('./accounts.js');
argv.testname = (argv.testname || 'unkown') + ` - ${ argv.type }`;
argv.type = argv.type || 'testnet';
argv.ensRoot = argv.ensRoot || 'evan';
// delete underscore
delete argv._;

const environments = [
  { name: 'chrome', version: '60' },
  { name: 'firefox', version: '52' },
  { name: 'edge', version: '15' },
  { name: 'safari', version: '11.1' },
];

// check for missing params
if (!argv.env || argv.env === true) {
  throw new Error(`No env was specified! (${ environments
    .map(browser => browser.name.replace(/ /g, ''))})`);
}

// check for the test type and check which configuration should be used.
if (!argv.url) {
  switch(argv.type) {
    case 'localhost': {
      var browserstack = require('browserstack-local');

      argv.url = 'http://localhost:3000/dev.html';

      break;
    }
    case 'testnet': {
      argv.url = 'https://dashboard.test.evan.network/';

      break;
    }
  }
}

// selenium configuration
const seleniumConfig = {
  "start_process" : false,
  "host" : "hub-cloud.browserstack.com",
  "port" : 80
};

// set configuration
const defaultConfig = {
  desiredCapabilities: {
    'build': argv.testname,
    'browserstack.user': accounts.browserStack.name,
    'browserstack.key': accounts.browserStack.key,
    'browserstack.debug': true,
    'chromeOptions' : {
      'args' : [
        'use-fake-device-for-media-stream', 
        'use-fake-ui-for-media-stream'
      ]
    },
    ...seleniumConfig // apply selenium config to everything
  },
  globals: { ...argv, ...accounts }
};

// setup nightwatch configuration
const nightwatchConfig = {
  src_folders : [ 'tests' ],
  globals_path : './globals_module.js',
  selenium : seleniumConfig,
  test_settings: {
    // apply default configuration to all test environments
    default: { ...defaultConfig },
  }
};

// add environments
environments.forEach(browser =>
  nightwatchConfig.test_settings[browser.name.replace(/ /g, '')] = {
    desiredCapabilities: {
      browser: browser.name,
      browser_version: browser.version,
      ...defaultConfig
    }
  }
);

// if workers are added, start the thread workers
if (argv.workers) {
  nightwatchConfig.test_workers = {
    "enabled": true,
    "workers": parseInt(argv.workers)
  };
}

// test informations
console.log(`\n\nrunning evan.network tests`);
console.log('==========================');
console.log(Object.keys(argv).map(key => `  - ${ key } : ${ argv[key] }`).join('\n'));

module.exports = nightwatchConfig;
