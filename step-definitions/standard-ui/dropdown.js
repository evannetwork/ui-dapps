import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

const getSelector = (label, angular) => {
  if (!angular) {
    // support also the .input-wrapper element around the input
    const inputSelectors = [
      'div', 'div/div'
    ];

    return [ ].concat.apply([ ], inputSelectors.map((inputSelector) => [
      `//label[normalize-space(text()) = "${label}"]/preceding-sibling::${ inputSelector }`,
      `//label[normalize-space(text()) = "${label}"]/following-sibling::${ inputSelector }`,
      `//label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::${ inputSelector }`,
      `//label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::${ inputSelector }`,
    ])).join('|');
  } else {
    return [
      `//ion-label[normalize-space(text()) = "${label}"]/preceding-sibling::ion-input/input`,
      `//ion-label[normalize-space(text()) = "${label}"]/following-sibling::ion-input/input`,
      `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/preceding-sibling::ion-input/input`,
      `//ion-label/*[normalize-space(text()) = "${label}"]/parent::*/following-sibling::ion-input/input`
    ].join('|');
  }
}

/**
 * Click on button with a certain content.
 */
When('I select the dropdown entry {string} from the dropdown box with the label {string}',
  async (content, label) => {
    // xpath will be used as the locating strategy so all the selectors you pass should be xpath selectors
    client.useXpath();
    const xPathSelector = getSelector(label);

    await client.expect.element(xPathSelector).to.be.present;
    await client.click(xPathSelector);

    const xPathSelectorLi = `//*[normalize-space(text()) = "${content}"]`;

    await client.expect.element(xPathSelectorLi).to.be.present;
    await client.click(xPathSelectorLi);
    client.useCss(); // switches back to css selector
  }
);