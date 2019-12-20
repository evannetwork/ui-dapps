import { client } from 'nightwatch-api';
import { Given } from 'cucumber';

import { setupEvan, backspaces, pauseHere, } from '../../test-utils/test-utils.js';


Given('I wait for enter',
  async () => {
    await pauseHere();
  }
);

Given('I wait for {int} seconds',
  async (seconds) => {
    await client.pause(seconds * 1000);
  }
);


