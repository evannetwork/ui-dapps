import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

import { setupEvan } from '../../../test-utils/test-utils.js';

When('I click on link to {string}', async (linkPart) => {
  let contained = '';
  const evan = setupEvan(client);

  switch (linkPart) {
    case 'My Account':
      contained = evan.accounts.organizationIdentification.accountId;

      break;
    default:
      contained = linkPart;
  }

  await client.waitForElementPresent(`a[href*="${contained}"]`, 10 * 1000);
  await client.click(`a[href*="${contained}"]`);
});

Then('I want to see a link to {string}',
  async (linkPart) => {
    const evan = setupEvan(client);
    let contained = '';

    switch (linkPart) {
      case 'My Account':
        contained = evan.accounts.organizationIdentification.accountId;
        break;
      default:
        contained = linkPart;
    }

    await client.waitForElementPresent(`a[href*="${contained}"]`, 10 * 1000);
    await client.expect.element(`a[href*="${contained}"]`).to.be.visible;
  });
