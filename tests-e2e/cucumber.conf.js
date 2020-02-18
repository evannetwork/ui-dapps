import {
  client, createSession, closeSession, startWebDriver, stopWebDriver,
} from 'nightwatch-api';
import {
  setDefaultTimeout, After, AfterAll, Before, BeforeAll,
} from 'cucumber';
import * as testUtils from './test-utils/test-utils.js';


// some test take longer than 1m, so increased to 10m just to be sure
setDefaultTimeout(600000);

global.tags = [];

BeforeAll(async () => {
  const options = { env: process.env.NIGHTWATCH_ENV || 'chrome' };
  await startWebDriver(options);
  await createSession(options);
  await client.resizeWindow(1920, 1080);
});

Before((scenario) => {
  // ensure we use css selector by default
  client.useCss();

  global.tags = scenario.pickle.tags.map((tag) => tag.name); // add tags to global for later usage
});

After(async (scenario) => {
  const noLogout = !!scenario.pickle.tags.filter((tag) => tag.name === '@tag:noLogout').length;

  if (!noLogout) {
    const evan = testUtils.setupEvan(client);
    // eslint-disable-next-line
    await client.execute(function() {
      window.localStorage.setItem('evan-vault', '');
      window.localStorage.setItem('evan-account', '');
      window.localStorage.setItem('evan-warnings-disabled', '{"payment-channel":true}');
      return true;
    });

    await client.url(`${evan.baseUrl}`);
  }
});

AfterAll(async () => {
  await closeSession();
  await stopWebDriver();
});
