import { client } from 'nightwatch-api';
import { When } from 'cucumber';


const selectEntryByValue = async (content, id) => {
  await client.expect.element(`#${id}`).to.be.present;

  await client.execute(function setDefaults(dropdownId, label) { // eslint-disable-line prefer-arrow-callback
    const v = document.getElementById(dropdownId).parentElement.parentElement.parentElement.__vue__;
    v.select(v.options.filter((op) => {
      if (op.label !== null) {
        return op.label === label;
      }

      return op === label;
    })[0]);
    v.open = false;
    return true;
  }, [id, content], function (result) {
    this.assert.ok(result.value);
  });

  client.useCss(); // switches back to css selector
};

/**
 * Select certain entry from vue-select dropdown.
 */
When('I select the entry {string} from the dropdown with the id {string}', selectEntryByValue);

/**
 * Click on a Vue Select box
 */
When('I click on the Vue Select with label {string}',
  async (label) => {
    let elementId;
    // Search for the label element two parents up from the found text
    const xPathSelector = `//*/text()[normalize-space(.) = '${label}']/../../parent::label`;

    // Get id of select box from "for" attribute of the label
    await client.getAttribute('xpath', xPathSelector, 'for', (attr) => {
      elementId = attr.value;
    });

    await client.click(`#${elementId}`);
  });
