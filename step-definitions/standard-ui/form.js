import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When('I set Input field with label {string} to {string}',
  async(label, content) => {
    client.useXpath();
    const xPathSelector = `//label[normalize-space(text()) = '${label}']/following-sibling::input`;

    await client.expect.element(xPathSelector).to.be.visible;
    await client.clearValue(xPathSelector);
    await client.setValue(xPathSelector, content);
    client.useCss();
  }
)

/**
 * Assures that a certain amount of input fields is visible.
 */
Then('{int} input fields should be visible',
  async(count) => {
    if (count === 0) {
      return client.expect.elements('input').count.to.equal(count);
    }

    await client.waitForElementPresent('input', 1000)
    await client.expect.elements('input').count.to.equal(count);
  }
)

/**
 * Assures that a certain amount of select fields is visible.
 */
Then('{int} select fields should be visible',
  async(count) => {
    if (count === 0) {
      return client.expect.elements('input').count.to.equal(count);
    }

    await client.waitForElementPresent('select', 1000)
    await client.expect.elements('select').count.to.equal(count);
  }
)

/**
 * Assures that an input field beside a certain label fields is visible.
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
 * Assures that many input fields beside a certain labels are visible.
 * - labels should be seperated by pipes 'Label1|Label2'.
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
