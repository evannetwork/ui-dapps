const { config } = require('dotenv-safe');

const { accounts } = require('./conf/accounts.js');

const seleniumServer = require('selenium-server-standalone-jar');
const chromeDriver = require('chromedriver');

config({ allowEmptyValues: true });

let localBrowser = process.env.LOCAL_BROWSER ? JSON.parse(process.env.LOCAL_BROWSER) : false;
let defaultConfig;
if (localBrowser) {
  defaultConfig = {
    selenium: {
      start_process: true,
      server_path: seleniumServer.path,
      port: 4444,
      cli_args: {
        'webdriver.chrome.driver': chromeDriver.path
      }
    },
    globals: {
      accounts,
    },
  }
} else {
  defaultConfig = {
    selenium: {
      start_process: false,
      host: 'hub-cloud.browserstack.com',
      port: 80
    },
    desiredCapabilities: {
      'browserstack.user': process.env.BROWSERSTACK_USERNAME,
      'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
      os: 'Windows',
      os_version: '10'
    },
    globals: {
      accounts,
    },
  };
}
const chromeSettings = {
  desiredCapabilities: {
    browserName: 'chrome',
    javascriptEnabled: true,
    acceptSslCerts: true,
    chromeOptions: {
      args: [
        'disable-gpu',
        'use-fake-device-for-media-stream', 
        'use-fake-ui-for-media-stream',
      ],
    },
  },
};
const firefoxSettings = {
  desiredCapabilities: {
    browserName: 'firefox',
    javascriptEnabled: true,
    acceptSslCerts: true,
    marionette: false,
  }
};
if (process.env.LOCAL_BROWSER_HEADLESS && JSON.parse(process.env.LOCAL_BROWSER_HEADLESS)) {
  chromeSettings.desiredCapabilities.chromeOptions.args.push('headless');
  firefoxSettings.desiredCapabilities.marionette = true;
}
module.exports = {
  test_settings: {
    default: defaultConfig,
    chrome: chromeSettings,
    firefox: firefoxSettings,
  },
};
