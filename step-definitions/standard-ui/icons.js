import { client } from 'nightwatch-api';
import { When, Then } from 'cucumber';

/**
 * Ensure that a specific icon is shown.
 */
When('I want to see the {string} icon',
  async(icon) => {
    if (icon.startsWith('spinner')) {
      await client.expect.element(`[class*='${ icon }']`).to.be.visible;
    } else {
      await client.expect.element(`.mdi.mdi-${ icon }`).to.be.visible;
    }
  }
);

/**
 * Ensure that a specific icon is shown.
 */
When('I click on the {string} icon',
  async(icon) => {
    await client.expect.element(`.mdi.mdi-${ icon }`).to.be.visible;
    await client.click(`.mdi.mdi-${ icon }`);
  }
);
