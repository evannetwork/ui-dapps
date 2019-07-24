import { client } from 'nightwatch-api';
import { When, Then, Given } from 'cucumber';

/**
 * Assures that a certain step has a certain state, like active or disabled.
 */
Then('step {int} should be {string}',
  async(step, statusType) => {
    const internalStep = step -1;

    if (['active', 'disabled'].indexOf(statusType) === -1) {
      throw new Error('Step should be "active" or "disabled"!');
    }

    await client.waitForElementPresent('.evan-steps', 1000)
    await client.assert.cssClassPresent(`#evan-container-create-step-${internalStep}`, statusType);

    if (statusType === 'disabled') {
      await client.assert.attributeEquals(
        `#evan-container-create-step-${internalStep}`,
        'disabled',
        'true'
      );
    }
  }
)
