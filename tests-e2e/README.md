# evan.network UI tests
[Nightwatch](http://nightwatchjs.org/) Integration with BrowserStack.

![BrowserStack Logo](https://d98b8t1nnulk5.cloudfront.net/production/images/layout/logo-header.png?1469004780)

<img src ="http://nightwatchjs.org/img/logo-nightwat h.png" height = "110">

## STRUCTURE HAS BEEN HEAVILY
Documentation update will follow but for now just use

```
  npm run test-testnet
```

And make sure you have your ```.env``` set up correctly (see example file).


## Running your tests
- running tests on [localhost](http://localhost:3000/dev.html)
```
  npm run test-local chrome
  npm run test-local chrome,firefox,safari
  npm run test-local chrome,firefox,safari -f tests/evan/login
```

- running tests on [dashboard.test.evan.network](https://dashboard.test.evan.network)
```
  npm run test-testnet chrome
  npm run test-testnet chrome,firefox,safari
```

## Use it from anywhere
### Custom commands
Add `@evan.network/ui-tests` as a dependency to your project and add the following scripts to your package.json (do not forget to adjust the `testname`§ parameter):

```
  "scripts": {
    ...
    "test-local": "node node_modules/@evan.network/ui-tests/scripts/local.runner.js --config node_modules/@evan.network/ui-tests/conf/evan.conf.js --testname 'my-cool-test' --type localhost --env ",
    "test-testnet": "./node_modules/.bin/nightwatch --config node_modules/@evan.network/ui-tests/conf/evan.conf.js --testname 'my-cool-test' --type testnet --env "
    ...
  }
```

Now you can use the same commands from `Running your Tests`.

### Use test-utils

```
const setupEvan = require('@evan.network/ui-tests').setupEvan;

module.exports = {
  'evan.network login': function (browser) {
    // apply the evan functions to the browser context
    setupEvan(browser);

    browser
      .evan.login('...', '...')
      .end();
  }
};
```

## Notes
* You can view your test results on the [BrowserStack automate dashboard](https://www.browserstack.com/automate)
* To test on a different set of browsers, check out our [platform configurator](https://www.browserstack.com/automate/node#setting-os-and-browser)
* You can export the environment variables for the Username and Access Key of your BrowserStack account
  
  ```
  export BROWSERSTACK_USERNAME=<browserstack-username> &&
  export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
  ```

## Connecting to BrowserStack via a proxy server
You can specify proxy settings in Nightwatch by adding the `proxy` key in your `*.conf.js` 

```javascript
  test_settings: {
    default: {
      desiredCapabilities: {
        // Your capabilities
      },
      proxy: {
        "host": "",     // "127.0.0.1"
        "port": "",     // "8081"
        "protocol": ""  // "http"
      }
    }
  }
```
  
## Additional Resources
* [Documentation for writing automate test scripts in Node](https://www.browserstack.com/automate/node)
* [Customizing your tests on BrowserStack](https://www.browserstack.com/automate/capabilities)
* [Browsers & mobile devices for selenium testing on BrowserStack](https://www.browserstack.com/list-of-browsers-and-platforms?product=automate)
* [Using REST API to access information about your tests via the command-line interface](https://www.browserstack.com/automate/rest-api)
* [Example to update the Browserstack session status based on the test results](https://github.com/blueimp/nightwatch-browserstack)
