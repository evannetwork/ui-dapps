import { client } from 'nightwatch-api';
import { Then, When } from 'cucumber';
import { WAIT_TIME } from '../core/core';

/**
 * Returns the best fitting quote sign according to the content string.
 *
 * @param {*} content
 */
const getQuote = (content) => {
  if (content.indexOf('"') > -1 && content.indexOf("'") > -1) {
    console.error('String contains both types of quotes');
  }

  // contains " but not '
  if (content.indexOf('"') > -1 && content.indexOf("'") === -1) {
    return "'";
  }

  return '"';
};

Then(/I want to see a text including ("([^"]*)"|`([^`]*)`)$/,
  async (content) => {
    const q = getQuote(content);
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    // TODO: does only exact match, not including
    const xPathSelector = `//*[normalize-space(text()) = ${q}${content}${q}]`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.be.present;
    client.useCss(); // switches back to css selector
  });

Then('I want to see a {string} headline including {string}',
  async (element, content) => {
    if (!/^h\d$/i.test(element)) {
      throw new Error('The `element` param must be a html headline tag h1, h2, h3, ...');
    }
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//${element}[normalize-space(text()) = "${content}"]`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.be.present;
    client.useCss(); // switches back to css selector
  });

Then('I do not want to see a text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = "${content}"]`;

    await client.waitForElementNotPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.not.be.present;
    client.useCss(); // switches back to css selector
  });

When('I click on an element with text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = "${content}"]`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  });
