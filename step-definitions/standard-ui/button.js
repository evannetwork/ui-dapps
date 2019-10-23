import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const buttonSelector = (content) => {
  return [
    `//*[contains(@class, 'btn') and normalize-space(text()) = '${content}']`,
    `//*[normalize-space(text()) = '${ content }']/ancestor::*[contains(@class, 'btn')]`
  ].join('|');
}

/**
 * Click on button with a certain content.
 */
When('I click on button {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = buttonSelector(content);

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);

/**
 * Click on button with a certain content.
 */
When('I click on button before the text {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[normalize-space(text()) = '${content}']/preceding::button[1]`;

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);

/**
 * Asserts that a button with a certain content is visible within 10 seconds.
 */
Then('I want to see a button {string}',
  async (content) => {
     // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
     client.useXpath();
     const xPathSelector = buttonSelector(content);

     await client.waitForElementPresent(xPathSelector, 10 * 1000);
     await client.expect.element(xPathSelector).to.be.visible;

     client.useCss(); // switches back to css selector
  }
)

/**
 * Assures that an element with .btn class has a certain state.
 */
Then('the button {string} should be {string}',
  async(content, statusType) => {
    client.useXpath();

    const xPathSelector = buttonSelector(content);
    await client.waitForElementPresent(xPathSelector, 10 * 1000);
    await client.expect.element(xPathSelector).to.be.visible;

    switch (statusType) {
      case 'disabled':
        await client.expect.element(xPathSelector).to.have.attribute('disabled');

        break;
      case 'enabled':
      case 'clickable':
          await client.expect.element(xPathSelector).to.not.have.attribute('disabled');

        break;
      default:
        throw new Error(`Button can not be tested for ${statusType}`)
    }

    client.useCss();
  }
)

module.exports = { buttonSelector, }