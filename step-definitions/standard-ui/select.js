import { client } from 'nightwatch-api';
import { When } from 'cucumber';
import { getElementIdByLabel } from '../../test-utils/test-utils';


/**
 * Click on a Vue Select box
 */
When('I click on the Vue Select with label {string}',
  async (label) => {
    const elementId = await getElementIdByLabel(label);
    
    await client.click(`#${elementId}`);
  }
);
