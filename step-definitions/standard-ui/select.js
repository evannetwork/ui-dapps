import { client } from 'nightwatch-api';
import { When } from 'cucumber';

/**
 * Click on a Vue Select box
 */
When('I click on the Vue Select with label {string}',
  async (label) => {
    let elementId;
    const xPathSelector = `//*/text()[normalize-space(.) = '${label}']/parent::*`;

    await client.getAttribute('xpath', xPathSelector, "for", attr => {
        elementId = attr.value;
    });

    await client.click("css selector", `#${elementId}`);
  }
);

/**
 * Select a specific item from Vue Select list
 */
// When('I select the item ')