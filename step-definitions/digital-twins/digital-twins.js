import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';
import { backspaces, pauseHere, switchToVue } from '../../test-utils/test-utils.js';


const evan = setupEvan(client);

const selectors = {
  mainMenu: {
    digitalTwinsButton: '#main-menu > li:nth-child(1) > a',
  },
  container: {
    edit: {
      addDataSet: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div:nth-child(1) > div.bg-level-1.p-3.border.rounded.d-flex.flex-wrap > div > i',
      dataSet: {
        edit: {
          addButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div:nth-child(1) > div.white-box.border.rounded.mt-3 > div.footer > button',
          createConfirmButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div:nth-child(2) > div.modal.fade.show > div > div > div.modal-footer > button.btn.btn-primary.btn-rounded.font-weight-normal',
          fieldName: (i) => `#name`,
          fieldValue: (i) => '#value',
          finishButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.d-flex.mb-3.align-items-center > div:nth-child(3) > button',
          firstTab: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div:nth-child(4) > div.bg-level-1.p-3.border.rounded.d-flex.flex-wrap > div.batch-label.active',
          name: '#name',
          saveUpdateButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.d-flex.mb-5.align-items-center > div.d-flex > button.btn.btn-primary.btn-rounded',
          schemaApply: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div:nth-child(1) > div:nth-child(3) > div > div > div:nth-child(2) > div > button',
        },
        view: {
          fieldName: (i) => 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div:nth-child(4) > div:nth-child(3) > div > div > div:nth-child(2) > table > tbody > tr > td:nth-child(1) > span',
          fieldValue: (i) => 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div:nth-child(4) > div:nth-child(3) > div > div > div:nth-child(2) > table > tbody > tr > td:nth-child(2) > div > div > span',
        },
      },
      description: '#description',
      name: '#name',
      saveButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div:nth-child(1) > div.white-box.border.rounded.mt-3 > div.footer > button',
      spinner: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.white-box.border.rounded > div > div > div > div',
      submitButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div:nth-child(2) > div.container-wide > div.evan-steps > div.pt-3 > div > div.footer > button',
    },
  },
  twins: {
    backButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-sidebar-2 > div > div > div > button',
    createButton: 'div.dapp-wrapper-body > div.dapp-wrapper-content > div:nth-child(5) > div > div.d-flex.align-items-center > div:nth-child(3) > a.btn.btn-rounded.btn-light.font-weight-normal',
    createContainerButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-content > div.container-wide > div > div.header > div > a > i',
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

When(/^I add a container with the name "([^"]+)" and the description "([^"]+)"$/,
  async (name, description) => {
    await client.waitForElementPresent(selectors.twins.createContainerButton, 10000);
    await client.click(selectors.twins.createContainerButton);
    await client.waitForElementPresent(selectors.container.edit.submitButton, 10000);
    await client.setValue(selectors.container.edit.name, [backspaces(20), name]);
    await client.setValue(selectors.container.edit.description, description);
    await client.click(selectors.container.edit.submitButton);
    await client.waitForElementPresent(selectors.container.edit.saveButton, 60000);
    await client.pause(1000);
  },
);

When(/^I add a data set with the default type and the name "([^"]+)"$/,
  async (name) => {
    await client.click(selectors.container.edit.addDataSet);
    await client.setValue(selectors.container.edit.dataSet.edit.name, [backspaces(20), name]);
    await client.waitForElementPresent(selectors.container.edit.dataSet.edit.addButton, 10000);
    await client.click(selectors.container.edit.dataSet.edit.addButton);

    // click on field name, enter name and value (1x)
    await client.click('.ajv-add-overlay');
    await client.pause(1000);
    await client.setValue(selectors.container.edit.dataSet.edit.fieldName(0), 'field 1');
    await client.setValue(selectors.container.edit.dataSet.edit.fieldValue(0), 'value 1');

    await client.click(selectors.container.edit.dataSet.edit.schemaApply);
    await client.pause(1000);
    await client.click(selectors.container.edit.dataSet.edit.finishButton);
    await client.waitForElementPresent(selectors.container.edit.dataSet.edit.createConfirmButton, 10000);
    await client.click(selectors.container.edit.dataSet.edit.createConfirmButton);

    await client.waitForElementPresent(selectors.container.edit.spinner, 10000);
    await client.waitForElementPresent(selectors.container.edit.dataSet.edit.saveUpdateButton, 120000);
  },
);


// requires "When(/^I create a new digital twin with the name..." beforehand
// as selection on twin with a specific name is tricky and anonymous browser does not keep order of last twins
Then(/^I can open the last twin$/, async () => {
  // open description of given twin
  await client.click(selectors.mainMenu.digitalTwinsButton);
  await client.waitForElementPresent(selectors.twins.favoriteTwins, 10000);
  await client.click(selectors.twins.firstTwin);
  await client.waitForElementPresent(selectors.twins.view.twinData, 10000);
});

Then(/^I can see that the twin name is "([^"]+)" and the description is "([^"]+)"$/, async (name, description) => {
  await client.click(selectors.twins.view.twinData);
  await client.pause(1000);
  await client.waitForElementPresent(selectors.twins.view.generalInformation, 10000);
  await client.click(selectors.twins.view.generalInformation);

  await client.waitForElementPresent(selectors.twins.edit.name, 10000);
  await client.expect.element(selectors.twins.edit.name).value.to.equal(name);
  await client.expect.element(selectors.twins.edit.description).value.to.equal(description);
});

Then(/^I can see that the first property has a key named "([^"]+)" and a value of "([^"]+)"$/, async (name, value) => {
  // await client.click(selectors.container.edit.dataSet.edit.firstTab);
  await client.pause(1000);
  await client.expect.element(selectors.container.edit.dataSet.view.fieldName(0)).text.to.equal(name);
  await client.expect.element(selectors.container.edit.dataSet.view.fieldValue(0)).text.to.equal(value);
});