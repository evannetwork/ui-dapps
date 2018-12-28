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