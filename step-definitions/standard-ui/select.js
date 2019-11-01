import { client } from 'nightwatch-api';
import { When } from 'cucumber';

/**
 * Click on a Vue Select box
 */
When('I click on the Vue Select with label {string}',
  async (label) => {
    let elementId;
    const xPathSelector = `//*/text()[normalize-space(.) = '${label}']/parent::*`;

    // Get id of select box from "for" attribute of the label
    await client.getAttribute('xpath', xPathSelector, "for", attr => {
        elementId = attr.value;
    });

    await client.click(`#${elementId}`);
  }
);
