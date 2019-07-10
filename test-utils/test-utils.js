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
};