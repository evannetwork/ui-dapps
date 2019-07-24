import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('{int} input fields should be visible',
  async(count) => {
    await client.waitForElementPresent('input', 1000)

    await client.expect.elements('input').count.to.equal(count);
  }
)

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('{int} select fields should be visible',
  async(count) => {
    await client.waitForElementPresent('select', 1000)

    await client.expect.elements('select').count.to.equal(count);
  }
)

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('Input field with label {string} should be visible',
  async(label) => {
    client.useXpath();
    const xPathSelector = `//label[normalize-space(text()) = '${label}']/following-sibling::input`;

    await client.expect.element(xPathSelector).to.be.visible;
    client.useCss();
  }
)

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('Input fields with labels {string} should be visible',
  async(labels) => {
    client.useXpath();

    for( const label of labels.split('|') ) {
      const xPathSelector = `//label[normalize-space(text()) = '${label}']/following-sibling::input`;

      await client.expect.element(xPathSelector).to.be.visible;
    }

    client.useCss();
  }
)
