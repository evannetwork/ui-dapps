import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';
import { WAIT_TIME } from '../core/core';

/**
 * Click on menu tab with a certain content.
 */
When('I want to see a text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = '${content}']`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.be.present;
    client.useCss(); // switches back to css selector
  }
);

/**
 * Click on menu tab with a certain content.
 */
When('I want to see not a text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = '${content}']`;

    await client.waitForElementNotPresent(xPathSelector, WAIT_TIME);
    await client.expect.element(xPathSelector).to.not.be.present;
    client.useCss(); // switches back to css selector
  }
);

/**
 * Click on menu tab with a certain content.
 */
When('I click on an element with text including {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = '${content}']`;

    await client.waitForElementPresent(xPathSelector, WAIT_TIME);
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);
