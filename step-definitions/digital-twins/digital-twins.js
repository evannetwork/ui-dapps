import { client } from 'nightwatch-api';
import { Given, When, Then } from 'cucumber';

import { setupEvan, backspaces, pauseHere, } from '../../test-utils/test-utils.js';


const evan = setupEvan(client);

const selectors = {
  loading: '#dropdown-queue.running',
  loadingDone: '#dropdown-queue.finished',
  mainMenu: {
    digitalTwinsButton: '#evan-dapp-digitaltwins',
  },
  container: {
    createModal: '#container-create-modal',
    pluginList: '#evan-dt-plugins',
    basePlugin: '#evan-dt-plugins button:first-child',
    create: {
      form: '#dbcp-form',
      name: '#dbcp-form #name',
      description: '#dbcp-form #description',
      addButton: '#th-add-entry',
      entryAddModal: '#entry-add-modal',
      entryAddForm: '#th-entry-add-form',
      dataAreaType: (type) => `select[id="type"] option[value="${ type }"]`,
      dataAreaName: '#th-entry-add-form #name',
      dataAreaSubmit: '#entry-add-modal #th-add-entry',
      dataSetSteps: '.evan-steps button span'
    },
    edit: {
      addDataSet: '#th-entry-add-show',
      dataSet: {
        edit: {
          addButton: '#th-add-entry',
          createConfirmButton: '#container-create-question #container-create',
          editButton: '#entry-edit',
          fieldName: (i) => `#ajv-name-${ i } input`,
          fieldValue: (i) => `#ajv-value-${ i } input`,
          finishButton: '#container-save',
          firstTab: 'th-entries > div:first-child',
          name: '#name',
          schemaApply: '#entry-save',
          typeOption: {
            Metadata: '#type > option[value="object"]',
            List: '#type > option[value="array"]',
            Text: '#type > option[value="string"]',
            Number: '#type > option[value="number"]',
          },
          typeSelect: '#type',
          useSchema: '#entry-save',
          value: '#value',
        },
        view: {
          fieldName: (i) => `#ajv-name-${ i } span`,
          fieldValue: (i) => `#ajv-value-${ i } span`,
          fieldValueSingle: '#value',
        },
      },
      description: '#description',
      name: '#name',
      saveButton: '#container-save',
      spinner: '.evan-loading',
      step1Button: '#container-create-step-0-finish',
    },
  },
  twins: {
    backButton: 'div.dapp-wrapper-body.show-sidebar-2 > div.dapp-wrapper-sidebar-2 > div > div > div > button',
    createButton: '#dt-create',
    createContainerButton: '#dt-container-create',
    edit: {
      description: '#dbcp-form #description',
      name: '#dbcp-form #name',
      saveButton: '#dt-save',
      submitButton: '#twin-create #dt-create',
      submitButtonEve: '#twin-create #container-create'
    },
    favoriteTwins: '#evan-dt-twins > div > a h4',
    firstTwin: '#evan-dt-twins > div:first-child > a',
    view: {
      generalInformation: '#evan-dt-nav-general',
      twinData: '#evan-dt-nav-digitaltwin-details',
      twinName: '.dapp-wrapper-sidebar-2 h6',
      twinDescription: '#digitaltwin\\.evan .container-wide h3'
    },
    pluginsTab: '#dt-plugins',
    pluginsCreateButton: '#dt-plugin-create',

  },
};

// atm not in use but keep it for custom js based selectors
// const createUniqueSelector = async (finder) => {
//   return new Promise((resolve) => {
//     client.execute(
//       function(finderString){
//         const found = (new Function('return ' + finderString)())()
//         const now = Date.now();
//         found.className += now;
//         return now;
//       }, [finder.toString()], (result) => {
//         resolve(`.${result.value}`);
//       });
//   }); 
// };
// const test = await createUniqueSelector(function() {
//   const firstDiv = document.querySelectorAll('div')[0];
//   return firstDiv;
// });
// console.dir(test);

const waitForSyncFinished = async (preLoading = 300000, loading = 300000) => {
  await client.waitForElementPresent(selectors.loading, preLoading);
  await client.waitForElementPresent(selectors.loadingDone, loading);
};

When(/^I create a new digital twin with the name "([^"]+)" and the description "([^"]+)"$/,
  async (name, description) => {
    await client.click(selectors.mainMenu.digitalTwinsButton);
    await client.waitForElementPresent(selectors.twins.createButton, 10000);
    await client.click(selectors.twins.createButton);
    // fill in twin data
    await client.waitForElementPresent(selectors.twins.edit.submitButton, 10000);
    await client.waitForElementPresent(selectors.twins.edit.name, 10000);
    await client.setValue(selectors.twins.edit.name, [backspaces(20), name]);
    await client.setValue(selectors.twins.edit.description, description);
    // click confirmation of eve usage
    
    await client.click(selectors.twins.edit.submitButton);
    await client.click(selectors.twins.edit.submitButtonEve);
    // wait for completion (first let current save button fade away)
    await client.pause(1000);
    await client.waitForElementPresent(selectors.twins.view.twinName, 60000);
    await client.pause(1000);
  },
);

When(/^I add a container with the name "([^"]+)" and the description "([^"]+)"$/,
  async (name, description) => {
    await client.waitForElementPresent(selectors.twins.createContainerButton, 10000);
    await client.click(selectors.twins.createContainerButton);
    await client.waitForElementPresent(selectors.container.edit.step1Button, 10000);
    await client.waitForElementPresent(selectors.container.edit.name, 10000);
    await client.setValue(selectors.container.edit.name, [backspaces(20), name]);
    await client.setValue(selectors.container.edit.description, description);
    await client.click(selectors.container.edit.step1Button);
    await client.waitForElementPresent(selectors.container.edit.saveButton, 60000);
    await client.pause(1000);
  },
);

When(/^I add a data set with the type "(([^"]+))", the name "([^"]+)" and the value "([^"]+)"$/,
  async (type, name, value) => {
    // start
    await client.click(selectors.container.edit.addDataSet);

    // select type
    await client.click(selectors.container.edit.dataSet.edit.typeSelect);
    await client.click(selectors.container.edit.dataSet.edit.typeOption[type]);

    // enter name and confirm
    await client.setValue(selectors.container.edit.dataSet.edit.name, [backspaces(20), name]);
    await client.waitForElementPresent(selectors.container.edit.dataSet.edit.addButton, 10000);
    await client.click(selectors.container.edit.dataSet.edit.addButton);

    // enter value
    switch (type) {
      case 'Metadata': {
        await client.click('.ajv-add-overlay');
        await client.pause(1000);
        const [ field0, value0 ] = value.split(':');
        await client.waitForElementPresent(selectors.container.edit.dataSet.edit.fieldName(0), 10000);
        await client.setValue(selectors.container.edit.dataSet.edit.fieldName(0), field0);
        await client.click(selectors.container.edit.dataSet.edit.useSchema);
        await client.waitForElementPresent(selectors.container.edit.dataSet.edit.fieldValue(0), 10000);
        await client.setValue(selectors.container.edit.dataSet.edit.fieldValue(0), value0);
        break;
      }
      case 'Text':
      case 'Number': {
        // await client.click(selectors.container.edit.dataSet.edit.editButton);
        // await client.pause(1000);
        await client.setValue(selectors.container.edit.dataSet.edit.value, value);
        break;
      }
      case 'List':
      default: throw new Error(`unknown type: ${type}`);
    } 

    await client.click(selectors.container.edit.dataSet.edit.schemaApply);
    await client.pause(1000);
    await client.click(selectors.container.edit.dataSet.edit.finishButton);
    await client.waitForElementPresent(selectors.container.edit.dataSet.edit.createConfirmButton, 10000);
    await client.click(selectors.container.edit.dataSet.edit.createConfirmButton);

    await client.waitForElementPresent(selectors.container.edit.spinner, 10000);
    await client.waitForElementPresent(selectors.container.edit.saveButton, 120000);
  },
);


// requires "When(/^I create a new digital twin with the name..." beforehand
// as selection on twin with a specific name is tricky and anonymous browser does not keep order of last twins
Then(/^I can open the last twin$/, async () => {
  // open description of given twin
  await client.click(selectors.mainMenu.digitalTwinsButton);
  await client.waitForElementPresent(selectors.twins.favoriteTwins, 10000);
  await client.click(selectors.twins.firstTwin);
  await client.waitForElementPresent(selectors.twins.view.twinName, 10000);
});

Then(/^I can see that the twin name is "([^"]+)" and the description is "([^"]+)"$/, async (name, description) => {
  await client.waitForElementPresent(selectors.twins.view.twinName, 10000);
  await client.expect.element(selectors.twins.view.twinName).text.to.equal(name);
  await client.expect.element(selectors.twins.view.twinDescription).text.to.equal(description);
});

Then(/^I can see that the first property has a key named "([^"]+)" and a value of "([^"]+)"$/, async (name, value) => {
  await client.pause(1000);
  await client.expect.element(selectors.container.edit.dataSet.view.fieldName(0)).text.to.equal(name);
  await client.expect.element(selectors.container.edit.dataSet.view.fieldValue(0)).text.to.equal(value);
});

Then(/^I can see that the value is "([^"]+)"$/, async (value) => {
  await client.pause(1000);
  await client.expect.element(selectors.container.edit.dataSet.view.fieldValueSingle).text.to.equal(value);
});


When(/^I define a new plugin with the name "([^"]+)" and the description "([^"]+)"$/, async (pluginName, pluginDescription) => {
  // click on the left twin menu icon
  await client.click(selectors.mainMenu.digitalTwinsButton);
  await client.waitForElementPresent(selectors.twins.createButton, 10000);

  // click on the "plugins" tab and wait for the create button
  await client.click(selectors.twins.pluginsTab);
  await client.waitForElementPresent(selectors.twins.pluginsCreateButton, 10000);
  await client.click(selectors.twins.pluginsCreateButton);

  // click the base plugin from the plugin list
  await client.waitForElementPresent(selectors.container.pluginList, 10000);
  await client.click(selectors.container.basePlugin);

  // define name and description for plugin
  await client.waitForElementPresent(selectors.container.create.form, 10000);
  await client.setValue(selectors.container.create.name, [backspaces(20), pluginName]);
  await client.setValue(selectors.container.create.description, [backspaces(20), pluginDescription]);
});


When(/^add a data set with the type "(([^"]+))" with the name "([^"]+)"$/, async (type, name) => {
  // add a new data area
  await client.click(selectors.container.create.addButton);
  await client.waitForElementPresent(selectors.container.create.entryAddModal, 10000);

  await client.click(selectors.container.create.dataAreaType('object'));

  await client.setValue(selectors.container.create.dataAreaName, [backspaces(20), name]);
  await client.click(selectors.container.create.dataAreaSubmit);
});

When(/^add a field to the data set "(([^"]+))" with the name "([^"]+)" with the type "([^"]+)" and the default value "([^"]+)"$/, async (dataSet, fieldName, fieldType, defaultFieldValue) => {
  await client.pause(1000);
  client.elements('css selector', selectors.container.create.dataSetSteps, async (buttonElements) => {
    console.dir(buttonElements)
    for(let buttonElement of buttonElements.value) {
      var elementID = buttonElement.ELEMENT;
      console.log('Checking Element - ' + elementID);
      const buttonText = client.elementIdText(elementID, (result) => {
        console.log(result);
      });
    }
  })
  // add a new data area
 /*await client.click(selectors.container.create.addButton);
  await client.waitForElementPresent(selectors.container.create.entryAddModal, 10000);

  await client.click(selectors.container.create.dataAreaType('object'));

  await client.setValue(selectors.container.create.dataAreaName, [backspaces(20), name]);
  await client.click(selectors.container.create.dataAreaSubmit);*/
});

When(/^create the plugin$/, async (type, name) => {
  // add a new data area
  await client.click(selectors.container.edit.dataSet.edit.finishButton);
  await client.waitForElementPresent(selectors.container.createModal, 10000);

  await client.click(selectors.container.createModal);


});
