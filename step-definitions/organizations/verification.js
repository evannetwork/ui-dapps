import { client } from 'nightwatch-api';
import { Given, When, Then, setDefinitionFunctionWrapper, Tag } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

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
Then(/I want to see the organization verification detail for "([^"]+)"/,
  async (accountId) => {
    const evan = setupEvan(client);
    accountId = accountId === 'My Account' ?
      evan.accounts.organizationIdentification.accountId : accountId;
    await client.waitForElementPresent(`#org-ident-detail-${ accountId }`, 10 * 1000);
    await client.assert.visible(`#org-ident-detail-${ accountId }`);
  }
);

/************************************** Open request modal ****************************************/
When(/I click on the organization verification request start button/,
  async (accountId) => {
    await client.click('#ident-request-unkown');
  }
)
Then(/I want to see the organization identification request formular/,
  async (accountId) => {
    await client.waitForElementPresent('#request-identification-modal', 10 * 1000);
    await client.assert.visible('#request-identification-modal');
  }
);

/************************************** Fill the formular *****************************************/
let identModal = '#request-identification-modal';
When(/I fill test data into the request verification modal/,
  async (accountId) => {
    const identForm = `${ identModal } #ident-formular`;

    await client.setValue(`${ identForm } #company`, 'evan GmbH');
    await client.setValue(`${ identForm } #regNumber`, 'Handelregister XYZ');
    await client.setValue(`${ identForm } #country`, 'germany');
    await client.setValue(`${ identForm } #address`, 'Johannisplatz 16');
    await client.setValue(`${ identForm } #zipCode`, '99817');
    await client.setValue(`${ identForm } #city`, 'Eisenach');
    await client.setValue(`${ identForm } #contact`, 'Test Contact');
  }
)
Then(/the organization identification submit button should be enabled/,
  async (accountId) => {
    await client.expect.element(`${ identModal } #ident-request`).to.not.have.attribute('disabled');
  }
);
