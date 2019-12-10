import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const getSelector = (label, angular) => {
  // support also the .input-wrapper element around the input
  const inputSelectors = [
    'div/*[contains(@class, "v-select")]'
  ];

  return [ ].concat.apply([ ], inputSelectors.map((inputSelector) => [
    `//label[normalize-space(text()) = "${label}"]/preceding-sibling::${ inputSelector }`,
    `//label[normalize-space(text()) = "${label}"]/following-sibling::${ inputSelector }`,
    `//label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::${ inputSelector }`,
    `//label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::${ inputSelector }`,
  ])).join('|');
}

/**
 * Click on button with a certain content.
 */
When('I select the dropdown entry {string} from the dropdown box with the label {string}',
  async (content, label) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = getSelector(label);
    await client.waitForElementNotPresent('//*[contains(@class, "fullscreen")]', 10 * 1000);
    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);

    const xPathSelectorLi = `//*[normalize-space(text()) = "${content}"]`;
    await client.waitForElementNotPresent('//*[contains(@class, "fullscreen")]', 10 * 1000);
    await client.expect.element(xPathSelectorLi).to.be.present;
    await client.click(xPathSelectorLi);
    client.useCss(); // switches back to css selector
  }
);