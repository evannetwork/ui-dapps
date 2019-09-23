import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const getSelector = (label) => {
  return [
    `//label[normalize-space(text()) = '${label}']/preceding-sibling::input`,
    `//label[normalize-space(text()) = '${label}']/following-sibling::input`,
    `//label/*[normalize-space(text()) = '${label}']/parent::*/preceding-sibling::input`,
    `//label/*[normalize-space(text()) = '${label}']/parent::*/following-sibling::input`
  ].join('|');
}

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When('I set Input field with label {string} to {string}',
  async(label, content) => {
    client.useXpath();

    // select following or preceding input with label having text or having text in any tag inside label tag
    const selector = getSelector(label);

    await client.expect.element(selector).to.be.visible;
    await client.clearValue(selector),
    await client.setValue(selector, content);
    client.useCss();
  }
);

/**
 * Looks for an input field with id and fills the values into the input field.
 */
When('I set Input field with id {string} to {string}',
  async(id, content) => {
    await client.expect.element(`#${ id }`).to.be.visible;
    await client.clearValue(`#${ id }`),
    await client.setValue(`#${ id }`, content);
    client.useCss();
  }
);

/**
 * Looks for an input field with sibling label having certain content and fills the values into the input field.
 */
When('I click on input field with label {string}',
  async(label) => {
    client.useXpath();

    // select following or preceding input with label having text or having text in any tag inside label tag
    const selector = getSelector(label);

    await client.expect.element(selector).to.be.visible;
    await client.click(selector);

    client.useCss();
  }
);

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
 * Assures that a certain amount of input fields having certain type is visible.
 */
Then('{int} input fields of type {string} should be visible',
  async(count, type) => {
    if (count === 0) {
      return client.expect.elements(`input[type="${type}"]`).count.to.equal(count);
    }

    await client.waitForElementPresent(`input[type="${type}"]`, 1000)
    await client.expect.elements(`input[type="${type}"]`).count.to.equal(count);
  }
)

/**
 * Assures that a certain amount of select fields is visible.
 */
Then('{int} select fields should be visible',
  async(count) => {
    if (count === 0) {
      return client.expect.elements('select').count.to.equal(count);
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
