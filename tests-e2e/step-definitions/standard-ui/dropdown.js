import { client } from 'nightwatch-api';
import { When } from 'cucumber';
import { flatMap } from 'lodash';

const getSelector = (label) => {
  // support also the .input-wrapper element around the input
  const inputSelectors = [
    'div/*[contains(@class, "vs__search")]',
  ];

  return flatMap(inputSelectors, (inputSelector) => [
    `//label[normalize-space(text()) = "${label}"]/preceding-sibling::${inputSelector}`,
    `//label[normalize-space(text()) = "${label}"]/following-sibling::${inputSelector}`,
    `//label[contains(., "${label}")]/parent::*//${inputSelector}`,
  ]).join('|');
};

const activateSelect = async (label) => {
  client.useXpath();
  const xPathSelector = getSelector(label);

  await client.expect.element(xPathSelector).to.be.present;
  await client.click(xPathSelector);
};

const selectNthEntry = async (entry, label) => {
  await activateSelect(label);

  client.useCss();
  const liSelector = `ul.vs__dropdown-menu li:nth-child(${entry})`;

  await client.expect.element(liSelector).to.be.present;
  await client.click(liSelector);
};

const selectEntryByValue = async (content, label) => {
  await activateSelect(label);

  client.useXpath();
  const xPathSelectorLi = `//ul[contains(concat(" ",normalize-space(@class)," ")," vs__dropdown-menu ")]//li[normalize-space(text()) = "${content}"]`;
  // const xPathSelectorLi = `//*[normalize-space(text()) = "${content}"]`; // TODO: removeme

  await client.expect.element(xPathSelectorLi).to.be.present;
  await client.click(xPathSelectorLi);
  client.useCss(); // switches back to css selector
};

const selectByContentOrEntryIndex = async (content, entryIndex, label) => {
  client.useXpath();
  await activateSelect(label);

  const xPathContent = `//ul[contains(concat(" ",normalize-space(@class)," ")," vs__dropdown-menu ")]//li[normalize-space(text()) = "${content}"]`;
  const xpathIndex = `//ul[contains(concat(" ",normalize-space(@class)," ")," vs__dropdown-menu ")]//li[${entryIndex}]`;
  const xPathSelectorLi = `${xPathContent}|${xpathIndex}`;

  await client.expect.element(xPathSelectorLi).to.be.present;
  await client.click(xPathSelectorLi);
  client.useCss(); // switches back to css selector
};

/**
 * Select certain entry from vue-select dropdown.
 */
When('I select the entry {string} from the dropdown with the label {string}', selectEntryByValue);

/**
 * Select entry by index from vue-select dropdown.
 */
When('I select entry {int} from dropdown with the label {string}', selectNthEntry);

/**
 * Select entry by index from vue-select dropdown and fallback to index if not found.
 */
When('I select the entry {string} or entry {int} from dropdown with the label {string}', selectByContentOrEntryIndex);

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
