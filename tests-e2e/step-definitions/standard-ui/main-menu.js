import { client } from 'nightwatch-api';
import { When } from 'cucumber';

const mainMenu = {
  'Digital Twins': '#evan-dapp-digitaltwins',
  'My Assets': '#evan-dapp-assets',
  'Verification Center': '#evan-dapp-verifications',
  Notifications: '#evan-dapp-mailbox',
  DApps: '#evan-dapp-favorites',
  Explorer: '#evan-dapp-explorer',
  Favorites: '#evan-dapp-favorites',
  Help: '#evan-dapp-help',
  Identity: '#evan-dapp-profile',
  Settings: '#evan-dapp-settings',
  Synchronization: '#evan-dapp-synchronization',
};

/**
 * Click on an entry within the sidepanel
 */
When('I click on {string} in main menu', async (entry) => {
  client.useCss();

  if (!mainMenu[entry]) {
    throw new Error('Could not find entry in main menu for: ', entry);
  } else {
    const selector = mainMenu[entry];

    // ensure that the element is present
    await client.waitForElementPresent(selector);

    // open it
    await client.click(selector);

    // wait a second after synchronization was opened, to be sure, that the animation has finished
    if (entry === 'Synchronization') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});
