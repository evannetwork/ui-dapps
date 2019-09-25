import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const cardSelector = (content) => {
  return [
    `//*[normalize-space(text()) = '${ content }']/ancestor::*[contains(@class, 'evan-card')]`
  ].join('|');
}

/**
 * Click on card with a certain text.
 */
When('I click on card with text {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = cardSelector(content);

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);
