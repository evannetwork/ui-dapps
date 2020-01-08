import { client } from 'nightwatch-api';
import { Then, When } from 'cucumber';
import { WAIT_TIME_FOR_ELEMENT } from '../../conf/constants'
import { getElementsCount, scrollToElement } from '../../test-utils/test-utils';

/**
 * Checks whether a table has a certain count of headers.
 *
 * @example Then I want to see a table having 5 headers
 */
Then('I want to see a table having {int} headers', async (count) => {
  client.useXpath();
  if (count === 0) {
    return client.expect.elements('//table//th').count.to.equal(0);
  }

  await client.waitForElementPresent('//table//th', WAIT_TIME_FOR_ELEMENT)
  await client.expect.elements('//table//th').count.to.equal(count);
  client.useCss();
});

/**
 * Checks if we have a table having certain headers.
 *
 * @param headers separeted headers by comma or pipe.
 * @example Then I want to see a table having headers "Name, Updated, Created
 */
Then('I want to see a table having headers {string}', async (headers) => {
  client.useXpath();
  // Check for every head available
  for (const head of headers.split(/\||,/)) {
    const xPathSelector = `//table//th[normalize-space(text()) = "${head.trim()}"]`;
    await client.expect.element(xPathSelector).to.be.present;
  };

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
    return client.expect.elements('//table//tr').count.to.equal(0);
  }

  await client.waitForElementPresent('//table//tr', WAIT_TIME_FOR_ELEMENT)
  const elementsCount = await getElementsCount('//table//tr');
  client.useCss();

  switch (operator) {
    case "min":
    case "at least":
    case "above":
      console.log(`check for ${elementsCount} bigger than ${count}`)
      return client.verify.ok(elementsCount > count, `Got more than ${count} rows.`);
      break;
    case "max":
    case "maximum":
    case "below":
      console.log(`check for ${elementsCount} smaller than ${count}`)
      return client.verify.ok(elementsCount < count, `Got less than ${count} rows.`);
      // await client.expect(elementsCount).to.be.lt(count);
      break;
    default:
      return client.verify.ok(elementsCount === count, `Got exactly ${count} rows.`);
  }
});

When('I scroll to last table row', async () => {
  await client.getLocationInView('tbody > tr:last-child')
})
