import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const panelSelector = (content) => {
  return [
    `//div[contains(@class, "evan-swipe-panel")]/header/h3[normalize-space(text()) = "${content}"]`,
    `//div[contains(@class, "evan-swipe-panel")]`,
  ].join('|');
}

/**
 * Assures that the swipe-panel is open and has a certain title set.
 */
Then('I want to see a swipe-panel with the title {string}',
  async(title) => {
    client.useXpath();
    const xPathSelector = panelSelector(title);
    await client.expect.element(xPathSelector).to.be.present;
    client.useCss(); // switches back to css selector
  }
)