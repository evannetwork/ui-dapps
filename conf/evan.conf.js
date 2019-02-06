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

const argv = require('minimist')(process.argv.slice(2));

// selenium configuration
const seleniumConfig = {
  "start_process" : false,
  "host" : "hub-cloud.browserstack.com",
  "port" : 80
};

// default configuration for 
const defaultConfig = {
  desiredCapabilities: {
    'build': 'nightwatch-browserstack',
    'browserstack.user': process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    'browserstack.debug': true,
    ...seleniumConfig // apply selenium config to everything
  },
  globals: { }
};

// check for the test type and check which configuration should be used.
switch(argv.t) {
  case 'localhost': {
    var browserstack = require('browserstack-local');

    defaultConfig.globals.url = 'http://localhost:3000/dev.html';

    break;
  }
  case 'testnet': {
    defaultConfig.globals.url = 'https://dashboard.evan.network';

    break;
  }
}

const nightwatchConfig = {
  src_folders : [ 'tests' ],
  globals_path : "./globals_module.js",
  selenium : seleniumConfig,
  test_settings: {
    default: {
      ...defaultConfig,
    },
    chrome: {
      desiredCapabilities: {
        browser: "chrome"
      }
    },
    firefox: {
      desiredCapabilities: {
        browser: "firefox"
      }
    },
    safari: {
      desiredCapabilities: {
        browser: "safari"
      }
    },
    ie: {
      desiredCapabilities: {
        browser: "internet explorer"
      }
    }
  }
};

// if suite should be used, start the thread workers
if (argv.w) {
  nightwatchConfig.test_workers = {
    "enabled": true,
    "workers": parseInt(argv.w)
  };
}


module.exports = nightwatchConfig;
