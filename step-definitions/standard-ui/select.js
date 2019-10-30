import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Click on button with a certain content.
 */
When('I click on vue select with label {string}',
  async (label) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = '${content}']`;

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);