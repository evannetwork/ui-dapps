const selectors = {
  login: {
    passwordInput: '#password',
  },
  profile: {
    settings: {
      devToggle: '#toggle-9-0',
      domainInput: 'evan-profile-settings > div:nth-child(2) > ion-item > div.item-inner > div > ion-input > input',
      domainPopupNo: '#profile > ion-alert > div > div.alert-button-group > button:nth-child(1)',
      domainPopupYes: '#profile > ion-alert > div > div.alert-button-group > button:nth-child(2)',
      domainToggle: '#toggle-10-1',
    },
    settingsTab: 'evan-profile-container > div.evan-left-panel > ion-list > button:nth-child(3)',
  },
};

const backspaces = (n) => [...Array(n)].map(() => '\ue003').join('');

module.exports = {
  backspaces,
  pauseHere: async () => {
    console.log('/******************************************************************************/');
    console.log('test paused, enjoy your developer tools :3');
    console.log('/******************************************************************************/');
    return new Promise(() => {});
  },
  switchToVue: async ({ client, evan, password }) => {
    return client
      .url(`${ evan.url }#/profile.evan`)
      // go to settings
      .waitForElementPresent(selectors.profile.settingsTab, 10 * 1000)
      .pause(1000)
      .click(selectors.profile.settingsTab)
      // enable dev mode
      .waitForElementPresent(selectors.profile.settings.devToggle, 10 * 1000)
      .pause(1000)
      .click(selectors.profile.settings.devToggle)
      // enable custom domains (and cancel reload popup)
      .waitForElementPresent(selectors.profile.settings.domainToggle, 10 * 1000)
      .pause(1000)
      .click(selectors.profile.settings.domainToggle)
      .waitForElementPresent(selectors.profile.settings.domainPopupNo, 10 * 1000)
      .pause(1000)
      .click(selectors.profile.settings.domainPopupNo)
      // enter custom domain and confirm popup
      .waitForElementPresent(selectors.profile.settings.domainInput, 10 * 1000)
      .pause(1000)
      .setValue(selectors.profile.settings.domainInput, [backspaces(10), 'vue.evan'])
      .waitForElementPresent(selectors.profile.settings.domainPopupYes, 10 * 1000)
      .pause(2000)
      .click(selectors.profile.settings.domainPopupYes)
      // enter password on login screen
      .waitForElementPresent(selectors.login.passwordInput, 30 * 1000)
      // .url('https://dashboard.test.evan.network')
      .url(evan.url)
      .waitForElementPresent(selectors.login.passwordInput, 30 * 1000)
      .setValue(selectors.login.passwordInput, [password, client.Keys.ENTER])
      .pause(1000)
    ;
  },
};