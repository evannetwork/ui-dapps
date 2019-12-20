import { client } from 'nightwatch-api';
import { When, Then, Given } from 'cucumber';

/**
 * Assures that a certain step has a certain state, like active, enabled or disabled.
 */
Then('step {int} should be {string}',
  async(step, statusType) => {
    const internalStep = step - 1;

    await client.waitForElementPresent('.evan-steps', 1000)

    switch (statusType) {
      case 'active':
        await client.assert.cssClassPresent(`.evan-step-${internalStep}`, statusType);

        break;
      case 'disabled':
        await client.expect.element(`.evan-step-${internalStep}`).to.have.attribute('disabled');

        break;
      case 'enabled':
        await client.expect.element(`.evan-step-${internalStep}`).to.not.have.attribute('disabled');

        break;
      default:
        throw new Error('Step should be "active", "enabled" or "disabled"!');
    }
  }
)

/**
 * Click on a certain step in the steps indicator.
 */
When('I click on step {int}',
  async (step) => {
    const internalStep = step -1;

    // await client.waitForElementPresent('.evan-steps', 1000)
    await client.click(`.evan-step-${internalStep}`);
  }
)
