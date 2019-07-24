import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Click on button with a certain content.
 */
When('I click on button {string}',
  async (content) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = `//*[contains(@class, 'btn') and normalize-space(text()) = '${content}']`;

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);
    client.useCss(); // switches back to css selector
  }
);

/**
 * Asserts that a button with a certain content is visible witihn 10 seconds.
 */
Then('I want to see a button {string}',
  async (content) => {
     // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
     client.useXpath();
     const xPathSelector = `//*[contains(@class, 'btn') and normalize-space(text()) = '${content}']`;

     await client.waitForElementPresent(xPathSelector, 10 * 1000);
     await client.assert.visible(xPathSelector);

     client.useCss(); // switches back to css selector
  }
)


/**
 * Assures that the modal is open and has a certain title set.
 */
Then('button {string} should be {string}',
  async(step, statusType) => {
    const internalStep = step -1;

    await client.waitForElementPresent('.evan-steps', 1000)
    await client.assert.cssClassPresent(`#evan-container-create-step-${internalStep}`, statusType);

    if (statusType === 'disabled') {
      await client.assert.attributeEquals(
        `#evan-container-create-step-${internalStep}`,
        'disabled',
        'disabled'
      );
    }
  }
)
