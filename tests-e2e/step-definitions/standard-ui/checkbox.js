import { client } from 'nightwatch-api';
import { When } from 'cucumber';

/**
 * Click on custom checkbox
 */
When('I click on a custom checkbox at position {string}', async (position) => {
  // Click on label element (sibling) of checkbox. Direct clicks don't work.
  await client.elements(
    'css selector',
    "[type='checkbox']:first-of-type + label",
    (elements) => {
      client.elementIdClick(elements.value[position - 1].ELEMENT);
    },
  );
});

When('Checkbox with id {string} should be checked', async (id) => {
  client.expect.element(`#${id}`).to.be.selected;
});

When('Checkbox with id {string} should be not checked', async (id) => {
  client.expect.element(`#${id}`).to.not.be.selected;
});
