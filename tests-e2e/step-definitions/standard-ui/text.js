import { client } from 'nightwatch-api';
import { Then, When } from 'cucumber';
import { WAIT_TIME } from '../core/core';

Then('I want to see a text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = "${content}"]`; // TODO: does only exact match, not including

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.be.present;
    client.useCss(); // switches back to css selector
  }
);

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
  }
);

Then('I do not want to see a text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = "${content}"]`;

    await client.waitForElementNotPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.not.be.present;
    client.useCss(); // switches back to css selector
  }
);

When('I click on an element with text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = "${content}"]`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);
