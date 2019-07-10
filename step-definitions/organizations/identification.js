import { client } from 'nightwatch-api';
import { Given, When, Then, setDefinitionFunctionWrapper, Tag } from 'cucumber';

import { setupEvan } from '../../test-utils/angular.js';
import { isVue, switchToVue } from '../../test-utils/test-utils.js';

/************************************** Open organization dapp ************************************/
When(/^I want to open the organizations dapp and open the organization card for "([^"]+)"$/, 
  async (accountId) => {
    const evan = setupEvan(client);
    accountId = accountId === 'My Account' ?
      evan.accounts.organizationIdentification.accountId : accountId;

    // open the organizations dapp
    await client.click(`#evan-dapp-organizations`);
    await client.waitForElementPresent('#evan-org-overview', 10 * 1000);

    await client.waitForElementPresent(`#evan-org-${ accountId }`, 10 * 1000);
    await client.click(`#evan-org-${ accountId }`);
  }
);
Then(/I want to see the organization identification detail for "([^"]+)"/,
  async (accountId) => {
    const evan = setupEvan(client);
    accountId = accountId === 'My Account' ?
      evan.accounts.organizationIdentification.accountId : accountId;
    await client.waitForElementPresent(`#org-ident-detail-${ accountId }`, 10 * 1000);
    await client.assert.visible(`#org-ident-detail-${ accountId }`);
  }
);

/************************************** Open request modal ****************************************/
When(/I click on the organization identification request start button/,
  async (accountId) => {
    client.click('#ident-request-unkown');
  }
)
Then(/I want to see the organization identification request formular/,
  async (accountId) => {
    await client.waitForElementPresent('#request-identification-modal', 10 * 1000);
    await client.assert.visible('#request-identification-modal');
  }
);

/************************************** Fill the formular *****************************************/
When(/I fill test data into the request identification modal/,
  async (accountId) => {
    await client.setValue('#request-identification-modal #company', 'evan GmbH');
    await client.setValue('#request-identification-modal #regNumber', 'Handelregister XYZ');
    await client.setValue('#request-identification-modal #country', 'germany');
    await client.setValue('#request-identification-modal #address', 'Johannisplatz 16');
    await client.setValue('#request-identification-modal #zipCode', '99817');
    await client.setValue('#request-identification-modal #city', 'Eisenach');
    await client.setValue('#request-identification-modal #contact', 'Test Contact');
  }
)
Then(/The request organization identification button should be enabled/,
  async (accountId) => {
  }
);
