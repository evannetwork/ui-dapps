import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('I want to see a modal with the title {string}',
  async(title) => {

    if (!title) {
      throw new Error('Empty modal title. Title should be defined!');
    }

    await client.waitForElementPresent('.modal-dialog', 500);
    await client.assert.visible('.modal-dialog');
    await client.assert.containsText('.modal-dialog .modal-title', title);
  }
)

/**
 * Assures that the modal is open and has a certain title set.
 */
Then('no modal should be visible',
  async() => {
    await client.waitForElementNotPresent('.modal-dialog', 1000)
  }
)

/**
 * Assures that the modal is open and has a certain title set.
 */
When('I click on close button of modal',
  async() => {
    await client.click('button.btn .mdi.mdi-close');
  }
)
