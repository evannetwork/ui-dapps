module.exports = {
  beforeEach: function (browser, done) {
    if (this.test_settings.selenium_host === 'hub.browserstack.com') {
      return require('nightwatch-browserstack').storeSessionId(browser, done)
    }
    done()
  },
  afterEach: function (browser, done) {
    if (this.test_settings.selenium_host === 'hub.browserstack.com') {
      return require('nightwatch-browserstack').updateStatus(browser, done)
    }
    done()
  }
};