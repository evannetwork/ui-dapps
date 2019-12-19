import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const tableSelector = (content) => {
  return `//div[@class="${content}"]//table`;
}

/**
 * Click on button with a certain content.
 */
Then('I want to see a table of {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = tableSelector(content);

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);