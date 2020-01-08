import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Click on menu tab with a certain content.
 */
When('I click on tab {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[contains(@class, 'evan-tab') and normalize-space(text()) = "${content}"]`;

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);

/**
 * Asserts that a menu tab with a certain content is visible within 10 seconds.
 */
Then('I want to see a tab {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[contains(@class, 'evan-tab') and normalize-space(text()) = "${content}"]`;

    await client.waitForElementPresent(xPathSelector, 10 * 1000);
    await client.expect.element(xPathSelector).to.be.visible;

     client.useCss(); // switches back to css selector
  }
)
