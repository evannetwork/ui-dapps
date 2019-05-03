import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';
import { backspaces, pauseHere, switchToVue } from '../../test-utils/test-utils.js';


const evan = setupEvan(client);

const selectors = {
  mainMenu: {
    digitalTwinsButton: '#main-menu > li:nth-child(1) > a',
  },
  twins: {
    backButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-sidebar-2 > div > div > div > button',
    createButton: 'div.dapp-wrapper-body > div.dapp-wrapper-content > div:nth-child(5) > div > div.d-flex.align-items-center > div:nth-child(3) > a.btn.btn-rounded.btn-light.font-weight-normal',
    edit: {
      description: '#description',
      name: '#name',
      saveButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(4) > div > div.white-box.border.rounded > div.footer > button',
      submitButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(4) > div > div.white-box.border.rounded > div.footer > button',
    },
    favoriteTwins: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(5) > div > div.white-box.border.rounded.mt-3 > div.row.content > div > a > div > div.col-10 > div > div > h4',
    firstTwin: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(5) > div > div.white-box.border.rounded.mt-3 > div.row.content > div:nth-child(1) > a > div > div.col-10 > div > div > h4',
    view: {
      generalInformation: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-sidebar-2 > div > ul > li.w-100.p-4.clickable.border-top.border-sm.active > div.mt-3 > ul > li:nth-child(1) > a',
      twinData: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-sidebar-2 > div > ul > li:nth-child(1)',
    },
  },
};

When(/^I create a new digital twin with the name "([^"]+)" and the description "([^"]+)"$/,
  async (name, description) => {
    await client.click(selectors.mainMenu.digitalTwinsButton);
    await client.waitForElementPresent(selectors.twins.createButton, 10000);
    await client.click(selectors.twins.createButton);
    // fill in twin data
    await client.waitForElementPresent(selectors.twins.edit.submitButton, 10000);
    await client.setValue(selectors.twins.edit.name, [backspaces(20), name]);
    await client.setValue(selectors.twins.edit.description, description);
    await client.click(selectors.twins.edit.submitButton);
    // wait for completion (first let current save button fade away)
    await client.pause(1000);
    await client.waitForElementPresent(selectors.twins.edit.saveButton, 60000);
    await client.pause(1000);
    // go back
    await client.click(selectors.twins.backButton);
    await client.waitForElementPresent(selectors.twins.createButton, 10000);
  },
);


// requires "hen(/^I create a new digital twin with the name..." beforehand
// as selection on twin with a specific name is tricky and anonymous browser does not keep order of last twins
Then(/^I can open the last twin$/, async () => {
  // open description of given twin
  await client.click(selectors.mainMenu.digitalTwinsButton);
  await client.waitForElementPresent(selectors.twins.favoriteTwins, 10000);
  await client.click(selectors.twins.firstTwin);
  await client.waitForElementPresent(selectors.twins.view.twinData, 10000);
  await client.click(selectors.twins.view.twinData);
  await client.pause(1000);
  await client.waitForElementPresent(selectors.twins.view.generalInformation, 10000);
  await client.click(selectors.twins.view.generalInformation);

  await client.waitForElementPresent(selectors.twins.edit.name, 10000);
});

Then(/^I can see that the twin name is "([^"]+)" and the description is "([^"]+)"$/, async (name, description) => {
  await client.expect.element(selectors.twins.edit.name).value.to.equal(name);
  await client.expect.element(selectors.twins.edit.description).value.to.equal(description);
});
