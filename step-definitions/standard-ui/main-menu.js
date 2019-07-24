import { client } from 'nightwatch-api';
import { When } from 'cucumber';

/**
 * Assert that
 */
When('I click on {string} in main menu',
  async (entry) => {
    let selector = '';

    switch (entry) {
      case 'Organizations':
          const path = 'organizations.evan'
          selector = `#main-menu a[href*="${path}"]`;

          break;
      // TODO: other cases
      default:
          throw new Error('Could not find entry in main menu for: ', entry);
    }

    await client.expect.element(selector).to.be.present;

    // Just to be sure
    await client.expect.element(selector).text.to.equal(entry);
    await client.click(selector);
  }
);



