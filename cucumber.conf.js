const { setDefaultTimeout, After, AfterAll, BeforeAll } = require('cucumber');
const { client, createSession, closeSession, startWebDriver, stopWebDriver } = require('nightwatch-api');
const { setupEvan } = require('./test-utils/angular.js');


// some test take longer than 1m, so increased to 10m just to be sure
setDefaultTimeout(600000);


BeforeAll(async () => {
  const options = { env: 'chromeLocal' || process.env.NIGHTWATCH_ENV || 'chrome' };
  await startWebDriver(options);
  await createSession(options);
});

After(async (scenario) => {
  const noLogout = !!scenario.pickle.tags.filter(tag => tag.name == '@tag:noLogout').length;
  if (!noLogout) {
    const evan = setupEvan(client);
    await evan.logout();
  }
});

AfterAll(async () => {
  await closeSession();
  await stopWebDriver();
});
