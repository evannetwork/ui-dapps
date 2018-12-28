module.exports = {
  'evan.network login' : function (browser) {
    browser
      .url('https://dashboard.evan.network')
      .waitForElementVisible('onboarding-welcome', 30000)
      .assert.elementPresent('.slide-zoom > h3')
      .click('.start-buttons > button:nth-child(2)')
      .waitForElementVisible('mnemonic-display', 10000)
      .click('mnemonic-display ion-toggle')
      .setValue('.direct-input ion-textarea > textarea', ['clap tower execute indicate fame ugly almost diary mask music vault produce', browser.Keys.ENTER])
      .waitForElementVisible('.password-dialog', 10000)
      .setValue('.password-dialog ion-input > input', ['Test1234', browser.Keys.ENTER])
      .waitForElementVisible('dashboard-component', 10000)
      .end();
  }
};