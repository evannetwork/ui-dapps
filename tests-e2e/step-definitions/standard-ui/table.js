import { client } from 'nightwatch-api';
import { Then, When } from 'cucumber';
import { WAIT_TIME_FOR_ELEMENT } from '../../conf/constants';
import { getElementsCount } from '../../test-utils/test-utils';

/**
 * Checks whether a table has a certain count of headers.
 *
 * @example Then I want to see a table having 5 headers
 */
Then('I want to see a table having {int} headers', async (count) => {
  client.useXpath();
  if (count === 0) {
    await client.expect.elements('//table//th').count.to.equal(0);
  }

  await client.waitForElementPresent('//table//th', WAIT_TIME_FOR_ELEMENT);
  await client.expect.elements('//table//th').count.to.equal(count);
  client.useCss();
});

/**
 * Checks if we have a table having certain headers.
 *
 * @param headers separated headers by comma or pipe.
 * @example Then I want to see a table having headers "Name, Updated, Created
 */
Then('I want to see a table having headers {string}', async (headers) => {
  client.useXpath();
  // Check for every head available
  await Promise.all(headers.split(/\||,/).map(async (head) => {
    const xPathSelector = `//table//th[normalize-space(text()) = "${head.trim()}"]`;
    await client.expect.element(xPathSelector).to.be.present;
  }));

  client.useCss();
});

/**
 * Checks whether a table has a certain count of headers.
 *
 * @example Then I want to see a table having 5 headers
 */
Then('I want to see a table having {string} {int} rows', async (operator, count) => {
  client.useXpath();
  if (count === 0) {
    await client.expect.elements('//table//tbody//tr').count.to.equal(0);
  }

  await client.waitForElementPresent('//table//tbody//tr', WAIT_TIME_FOR_ELEMENT);
  const elementsCount = await getElementsCount('//table//tbody//tr');
  client.useCss();

  switch (operator) {
    case 'min':
    case 'at least':
    case 'above':
      await client.assert.ok(elementsCount > count, `Got more than ${count} rows.`);
      break;
    case 'max':
    case 'maximum':
    case 'below':
      await client.assert.ok(elementsCount < count, `Got less than ${count} rows.`);
      break;
    default:
      await client.assert.ok(elementsCount === count, `Got exactly ${count} rows.`);
  }
});

Then('I want to see a cell with the content {string}', async (content) => {
  client.useXpath();

  await client.waitForElementPresent(`//table//td[normalize-space(text()) = "${content}"]`, WAIT_TIME_FOR_ELEMENT);

  client.useCss();
});

When('I scroll to last table row', async () => {
  await client.getLocationInView('tbody > tr:last-child');
});
