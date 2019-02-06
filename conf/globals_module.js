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

module.exports = {
  beforeEach: function (browser, done) {
    if (this.client.options.selenium_host === 'hub-cloud.browserstack.com') {
      return storeSessionId(browser, done)
    }
    done()
  },
  afterEach: function (browser, done) {
    if (this.client.options.selenium_host === 'hub-cloud.browserstack.com') {
      return updateStatus(browser, done)
    }
    done()
  }
};

function storeSessionId(browser, done) {
  browser.session(function (session) {
    browser.browserStackSessionId = session.sessionId
    done()
  })
};

function updateStatus(browser, done) {
  if (browser.currentTest.results.failed || browser.currentTest.results.errors) {
    const caps = browser.options.desiredCapabilities
    const user = caps['browserstack.user']
    const key = caps['browserstack.key']
    const options = {
      host: 'api.browserstack.com',
      path: `/automate/sessions/${browser.browserStackSessionId}.json`,
      method: 'PUT',
      auth: `${user}:${key}`,
      headers: {'Content-Type': 'application/json'}
    }
    require('https')
      .request(options, function () { done() })
      .on('error', function (error) { throw error })
      .end(JSON.stringify({status: 'error', reason: browser.currentTest.results.lastError.message}))
  } else {
    done()
  }
};