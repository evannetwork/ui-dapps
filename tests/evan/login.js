const setupEvan = require('../../test-utils/evan.js').setupEvan;
const user = {
  mnemonic: 'clap tower execute indicate fame ugly almost diary mask music vault produce',
  password: 'Test1234'
};

module.exports = {
  'evan.network login': function (browser) {
    // apply the evan functions to the browser context
    setupEvan(browser);

    browser
      .evan.login(user.mnemonic, user.password)
      .end();
  }
};