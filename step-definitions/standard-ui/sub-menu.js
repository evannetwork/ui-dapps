import { client } from 'nightwatch-api';
import { When } from 'cucumber';
import { WAIT_TIME_FOR_ELEMENT } from '../../conf/constants';

const subMenuSelector = (entry) => {
  return `//div[contains(@class, 'sidenav')]//a[normalize-space(text()) = "${entry}"]`;
}

/**
 * Click on an entry within the sidepanel
 */
When('I click on {string} in sub menu',
  async (entry) => {
    // throw new Error('Could not find entry in sub menu for: ', entry);

    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = subMenuSelector(entry);

    await client.waitForElementPresent(xPathSelector, WAIT_TIME_FOR_ELEMENT);
    await client.expect.element(xPathSelector).to.be.visible;
    await client.click(xPathSelector);

    client.useCss(); // switches back to css selector
  }
);
