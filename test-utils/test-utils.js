import { client } from 'nightwatch-api';

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
  vueSwitch: '.theme-evan',
};

const backspaces = (n) => [...Array(n)].map(() => '\ue003').join('');

const isVue = async () => {
  const elements = await new Promise((resolve) => {
    client.elements('css selector', selectors.vueSwitch, result => resolve(result.value)); });
  return !!elements.length;
};

module.exports = {
  backspaces,
  isVue,
  pauseHere: async () => {
    console.log('/******************************************************************************/');
    console.log('test paused, enjoy your developer tools :3');
    console.log('/******************************************************************************/');
    return new Promise(() => {});
  },
  switchToVue: async ({ client, evan, password }) => {
    if (await isVue()) {
      return;
    }
    await client.url(`${ evan.url }#/profile.evan`)
    // go to settings
    await client.waitForElementPresent(selectors.profile.settingsTab, 10 * 1000)
    await client.pause(1000)
    await client.click(selectors.profile.settingsTab)
    // enable dev mode
    await client.waitForElementPresent(selectors.profile.settings.devToggle, 10 * 1000)
    await client.pause(1000)
    await client.click(selectors.profile.settings.devToggle)
    // enable custom domains (and cancel reload popup)
    await client.waitForElementPresent(selectors.profile.settings.domainToggle, 10 * 1000)
    await client.pause(1000)
    await client.click(selectors.profile.settings.domainToggle)
    await client.waitForElementPresent(selectors.profile.settings.domainPopupNo, 10 * 1000)
    await client.pause(1000)
    await client.click(selectors.profile.settings.domainPopupNo)
    // enter custom domain and confirm popup
    await client.waitForElementPresent(selectors.profile.settings.domainInput, 10 * 1000)
    await client.pause(1000)
    await client.setValue(selectors.profile.settings.domainInput, [backspaces(10), 'vue.evan'])
    await client.waitForElementPresent(selectors.profile.settings.domainPopupYes, 10 * 1000)
    await client.pause(2000)
    await client.click(selectors.profile.settings.domainPopupYes)
    // enter password on login screen
    await client.waitForElementPresent(selectors.login.passwordInput, 30 * 1000)
    // .url('https://dashboard.test.evan.network')
    await client.url(evan.url)
    await client.waitForElementPresent(selectors.login.passwordInput, 30 * 1000)
    await client.setValue(selectors.login.passwordInput, [password, client.Keys.ENTER])
    await client.pause(2000)
    ;
  },
};