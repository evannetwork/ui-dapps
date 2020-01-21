import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';
import * as testUtils from '../../test-utils/test-utils.js';

const getSelector = (label, angular) => {
  if (!angular) {
    // support also the .input-wrapper element around the input
    const inputSelectors = [
      'input', 'div/input',
      'select', 'div/select',
      'textarea', 'div/textarea',
    ];

    return [
      ...inputSelectors.map((inputSelector) => [
        `//label[normalize-space(text()) = "${label}"]/preceding-sibling::${inputSelector}`,
        `//label[normalize-space(text()) = "${label}"]/following-sibling::${inputSelector}`,
        `//label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::${inputSelector}`,
        `//label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::${inputSelector}`,
      ]),
    ].join('|');
  }
  return [
    `//ion-label[normalize-space(text()) = "${label}"]/preceding-sibling::ion-input/input`,
    `//ion-label[normalize-space(text()) = "${label}"]/following-sibling::ion-input/input`,
    `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::ion-input/input`,
    `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::ion-input/input`,
  ].join('|');
};

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When(/^I set( angular)? Input field with label "([^"]*)" to "([^"]*)"$/, async (angular, label, content) => {
  client.useXpath();

  // select following or preceding input with label having text or having text in any tag inside label tag
  const selector = getSelector(label, !!angular);

  await client.expect.element(selector).to.be.visible;
  await testUtils.betterClearValue(selector);

  if (content && typeof content === 'string' && content.length > 0) {
    await client.setValue(selector, testUtils.parseEnvVar(content));
  }

  client.useCss();
});

/**
 * Same semantic like "When I set( angular)? Input field with label ".
 * Created separate function for backwards compatibility.
 */
When('I type {string} into the input field with label {string}', async (content, label) => {
  const elementId = await testUtils.getElementIdByLabel(label);

  await client.expect.element(`#${elementId}`).to.be.visible;
  await testUtils.betterClearValue(`#${elementId}`);

  if (content && typeof content === 'string' && content.length > 0) {
    await client.setValue(`#${elementId}`, testUtils.parseEnvVar(content));
  }
});

/**
 * Looks for an input field with id and fills the values into the input field.
 */
When('I set Input field with id {string} to {string}',
  async (id, content) => {
    client.useCss();

    await client.expect.element(`#${id}`).to.be.visible;
    await testUtils.betterClearValue(`#${id}`);

    if (content && typeof content === 'string' && content.length > 0) {
      await client.setValue(`#${id}`, testUtils.parseEnvVar(content));
    }
  });

/**
 * Looks for an input field with id and fills the values into the input field.
 */
When('I set Input field with placeholder {string} to {string}',
  async (placeholder, content) => {
    const selector = `//input[@placeholder='${placeholder}']`;
    client.useXpath();
    await client.expect.element(selector).to.be.visible;
    await testUtils.betterClearValue(selector);

    if (content && typeof content === 'string' && content.length > 0) {
      await client.setValue(selector, testUtils.parseEnvVar(content));
    }
  });

/**
 * Looks for an input field with id and fills the values into the input field.
 */
When('I clear Input field with id {string}',
  async (id) => {
    client.useCss();
    await client.expect.element(`#${id}`).to.be.visible;
    await testUtils.betterClearValue(`#${id}`);
  });

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When('I click on input field with label {string}',
  async (label) => {
    client.useXpath();

    // select following or preceding input with label having text or having text in any tag inside label tag
    const selector = getSelector(label);
    await client.expect.element(selector).to.be.visible;
    await client.click(selector);

    client.useCss();
  });


/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When('I clear input field with label {string}',
  async (label) => {
    client.useXpath();

    // select following or preceding input with label having text or having text in any tag inside label tag
    const selector = getSelector(label);
    await client.expect.element(selector).to.be.visible;
    await testUtils.betterClearValue(selector);

    client.useCss();
  });

/**
 * Assures that a certain amount of input fields is visible.
 */
Then('{int} input fields should be visible', async (count) => {
  if (count === 0) {
    return client.expect.elements('input').count.to.equal(count);
  }

  await client.waitForElementPresent('input', 1000);
  return client.expect.elements('input').count.to.equal(count);
});

/**
* Assures that a certain amount of input fields having certain type is visible.
*/
Then('{int} input fields of type {string} should be visible', async (count, type) => {
  if (count === 0) {
    return client.expect.elements(`input[type="${type}"]`).count.to.equal(count);
  }

  await client.waitForElementPresent(`input[type="${type}"]`, 1000);
  return client.expect.elements(`input[type="${type}"]`).count.to.equal(count);
});

/**
* Assures that a certain amount of select fields is visible.
*/
Then('{int} select fields should be visible', async (count) => {
  if (count === 0) {
    return client.expect.elements('select').count.to.equal(count);
  }

  await client.waitForElementPresent('select', 1000);
  return client.expect.elements('select').count.to.equal(count);
});

/**
 * Assures that an input field beside a certain label fields is visible.
 */
Then('Input field with label {string} should be visible',
  async (label) => {
    client.useXpath();
    await client.expect.element(getSelector(label)).to.be.visible;
    client.useCss();
  });

/**
 * Assures that an input field beside a certain label fields is present in the DOM.
 */
Then('Input field with label {string} should be invisible',
  async (label) => {
    client.useXpath();
    await client.expect.element(getSelector(label)).to.be.present;
    await client.expect.element(getSelector(label)).not.to.be.visible;
    client.useCss();
  });

/**
 * Assures that many input fields beside a certain labels are visible.
 * - labels should be seperated by pipes 'Label1|Label2'.
 */
Then('Input fields with labels {string} should be visible',
  async (labels) => {
    client.useXpath();

    Promise.race(labels.split('|')
      .map(async (label) => client.expect.element(getSelector(label)).to.be.visible));

    client.useCss();
  });

/**
 * Click on label next to the evan checkbox control
 */
Then('I click on vue checkbox control with id {string}',
  async (id) => {
    client.useXpath();

    const selector = `//*[@id="${id}"]/following-sibling::label[@for="${id}"]`;
    await client.expect.element(selector).to.be.visible;
    await client.click(selector);

    client.useCss();
  });

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
Then('The value of the Input field with label {string} should be {string}',
  async (label, content) => {
    client.useXpath();
    const expected = testUtils.parseEnvVar(content);
    // select following or preceding input with label having text or having text in any tag inside label tag
    const selector = getSelector(label);
    await client.assert.value(selector, expected);
    client.useCss();
  });

/**
 * Looks for an input field with certain placeholder and checks if it has the desired value.
 */
Then('The value of the Input field with placeholder {string} should be {string}',
  async (placeholder, content) => {
    client.useXpath();
    const expected = testUtils.parseEnvVar(content);

    await client.assert.value(`//input[@placeholder='${placeholder}']`, expected);
    client.useCss();
  });
