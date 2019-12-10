import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan } from '../../test-utils/test-utils.js';

/**
 * Sends eve to another user. Current ui must be on wallet, with opened eve send ui and filled out
 * formulars. So the test can submit the transaction and can check for balance differences.
 */
When('I send {string} EVE with vue UI', async (amount) => {
  client.useCss();
  const evan = setupEvan(client);
  let previous, after;

  await client.getText('#evan-account-balance', (result) => {
    previous = parseFloat(result.value.replace(/\s|\n|EVE/g, ''));
  });

  // start eve sending  
  await client.click('#evan-eve-send');
  await client.waitForElementPresent('#evan-eve-send-submit', 5000);
  await client.expect.element('#evan-eve-send-submit').to.be.present;
  await client.click('#evan-eve-send-submit');
  await client.waitForElementPresent('.success', 15 * 1000);
  await client.pause(3 * 1000);

  await client.getText('#evan-account-balance', (result) => {
    after = parseFloat(result.value.replace(/\s|\n|EVE/g, ''))
  });

  // gas fee is also used and must be calculated, just check with an difference of 0.1 eve to be
  // sure
  if (!(after + parseFloat(amount) <= previous) ||
      !(after + parseFloat(amount) + 0.1 >= previous)) {
    throw new Error(`Invalid balance after eve sending! ` +
      `(${ previous } => ${ amount } EVE => ${ after })`);
  }
  // wait until success is gone
  await client.pause(5 * 1000);
});
