import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import * as testUtils from '../../test-utils/test-utils.js';

When(/I go to EVE payments tab/, async () => {
  const evan = testUtils.setupEvan(client);

  await client.url(`${evan.baseUrl}#/dashboard.evan/profile.evan/buy-eve`);
  await client.waitForElementPresent('.buy-eve', 10 * 1000);
});

When('I select the country {string}', async (country) => {
  client.useXpath();

  const countryDropdown = '//ion-label/*[normalize-space(text()) = \'Country *\']/parent::*/following-sibling::ion-select';
  await client.expect.element(countryDropdown).to.be.visible;
  await client.click(countryDropdown);

  await client.waitForElementPresent('//h2[normalize-space(text()) = \'Country *\']', 20e3);
  client.pause(1e3);

  const selectedCountry = `//button[@ion-button='alert-radio-button']/*/*[normalize-space(text()) = '${country}']/parent::*/parent::*`;
  const radioButton = await client.element('xpath', selectedCountry);

  await client.execute((innerCountry) => {
    const radioButtons = Array.from(document.querySelectorAll('ion-alert button.alert-radio-button'));
    const matches = radioButtons.filter((innerRadioButton) => innerRadioButton.querySelector('.alert-radio-label').innerText === innerCountry);
    if (matches.length) {
      matches[0].scrollIntoView();
    }
  }, [country]);

  client.pause(1e3);
  await client.click(selectedCountry);

  const okButton = '//button[@ion-button=\'alert-button\']/*[normalize-space(text()) = \'OK\']/parent::*';
  await client.click(okButton);

  client.useCss();
});

When('I enter the credit card {string}, valid util {string} with the CVC {string}',
  async (card, validUntil, cvc) => {
    client.useCss();
    // switch to stripe iframe
    await client.frame(0);

    // set value set focus on input
    await client.setValue('input[name="cardnumber"]', '');
    await client.setValue('input[name="cardnumber"]', '');
    await client.setValue('input[name="cardnumber"]', '');

    // type values
    await [...[card, validUntil, cvc].join('')].reduce(async (chain, element) => {
      await chain;
      await client.pause(100);
      await client.keys(element);
    }, Promise.resolve());

    // switch back to top context
    await client.frame(null);
  });

When('I click on the buy button', async () => {
  client.useXpath();

  await client.click('//ion-icon[@name="cash"]/parent::*/parent::*');

  client.useCss();
});

Then('a success message is shown', async () => {
  await client.waitForElementPresent('.success-hint', 60e3);
});

Then('amount to pay is shown as {string}', async (amount) => {
  client.useXpath();

  const selector = `//h1[normalize-space(text()) = 'Total amount']/parent::*/following-sibling::div/h1[normalize-space(text()) = '${amount}']`;
  await client.waitForElementPresent(selector, 30 * 1000);

  client.useCss();
});
