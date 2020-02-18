/*
  Copyright (C) 2018-present evan GmbH.

  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3,
  as published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program. If not, see http://www.gnu.org/licenses/ or
  write to the Free Software Foundation, Inc., 51 Franklin Street,
  Fifth Floor, Boston, MA, 02110-1301 USA, or download the license from
  the following URL: https://evan.network/license/
*/

// vue imports
import Component, { mixins } from 'vue-class-component';
import axios from 'axios';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { bccHelper, session, lightwallet } from '@evan.network/ui-session';
import { agentUrl } from '@evan.network/ui';
import { EvanForm, EvanFormControl, getDomainName } from '@evan.network/ui-vue-core';

import SignUp from '../sign-up/sign-up';

// load twin templates
import bicycleTwin from './twins/bicycle.json';
import carTwin from './twins/car.json';

// get the twin helper
import { getTranslationFromDBCP } from './twinHelper';

interface TwinDBCPForm extends EvanForm {
  description: EvanFormControl;
  name: EvanFormControl;
  type: EvanFormControl;
}

@Component({ })
export default class TwinSignUp extends mixins(SignUp) {
  /**
   * Form for getting twin name / description.
   */
  twinDbcpForm: TwinDBCPForm = null;

  /**
   * Formular for getting twin metadata entry.
   */
  metadataForm: EvanForm = null;

  /**
   * Formular for gettin list entry data.
   */
  listForm: EvanForm = null;

  /**
   * Available twins, that can be selected for creation.
   */
  twins = {
    bicycle: bicycleTwin,
    car: carTwin,
  };

  /**
   * Collection data of data sets, that were filled
   */
  twinData = { };

  /**
   * Force dynamic step content rerendering
   */
  rerenderSteps = false;

  /**
   * Images that should be used for side panel and twin creation.
   */
  images = ['1.svg', '2.svg', '3.svg', '13.svg'];

  /**
   * All steps that should be displayed for creating the current twin.
   */
  twinSteps: Array<any> = [];

  /**
   * Setup twin forms.
   */
  created() {
    // setup twin dbcp formular
    this.setupTwinDBCPForm();
    // setup initial steps
    this.twinTypeChange();
  }

  /**
   * Create the twin dbcp form.
   */
  setupTwinDBCPForm() {
    this.profileForm.accountType.value = 'user';
    this.twinDbcpForm = (<TwinDBCPForm> new EvanForm(this, {
      type: {
        value: 'bicycle',
        uiSpecs: {
          attr: {
            required: true,
            options: Object.keys(this.twins).map((twinKey: string) => {
              const twin = this.twins[twinKey];
              return {
                label: getTranslationFromDBCP(this, twin.description, 'name'),
                value: twinKey,
              };
            }),
          },
          input: () => {
            this.twinTypeChange();
            // force step rerendering
            this.rerenderSteps = true;
            this.$nextTick(() => this.rerenderSteps = false);
          },
          type: 'select',
        },
      },
      name: {
        value: '',
        validate: (_: TwinSignUp, __: EvanForm, c: EvanFormControl) => c.value && c.value.length !== 0,
        uiSpecs: {
          attr: {
            required: true,
          },
        },
      },
      description: {
        value: '',
        uiSpecs: {
          attr: {
            rows: 5,
          },
          type: 'textarea',
        },
      },
    }));
  }

  /**
   * Render only the data set steps dynamically.
   */
  dataSetSteps() {
    return this.twinSteps.filter((step, index) => index !== 0);
  }

  /**
   * Takes the current twin selection and setup the correct steps.
   */
  twinTypeChange() {
    const creatingOrOnboarded = () => this.onboardedDialog;
    this.twinSteps = [
      {
        title: '_onboarding.sign-up.twin.steps.dbcp.title',
        disabled: () => creatingOrOnboarded(),
      },
    ];

    // iterate over the twin plugins and it's data sets, that should be filled
    const twinDefinition = this.twins[this.twinDbcpForm.type.value];
    const order = ['maintenance.maintenance', 'metadata.characteristics'];
    const dataSets = [];
    // collect all the data sets within the plugins
    Object.keys(twinDefinition.plugins).forEach((pluginName: string) => Object
      .keys(twinDefinition.plugins[pluginName].template.properties)
      .forEach((key) => dataSets.push(`${pluginName}.${key}`)));

    // sort all the data sets and apply them as steps
    dataSets
      .filter((key) => order.indexOf(key) !== -1)
      .sort((a, b) => (order.indexOf(a) < order.indexOf(b) ? 1
        : order.indexOf(a) > order.indexOf(b) ? -1
          : 0))
      .forEach((key, stepIndex) => {
        const [pluginName, dataSetName] = key.split('.');
        const plugin = twinDefinition.plugins[pluginName];

        if (dataSetName !== 'type') {
          // setup data objects / arrays, especially for their data set type
          if (plugin.template.properties[dataSetName].type === 'entry') {
            this.twinData[key] = this.twinData[key] || { };
          } else {
            this.twinData[key] = this.twinData[key] || [{ }, { }, { }];
          }

          this.twinSteps.push({
            dataSetSpecs: {
              data: this.twinData[key],
              dataSchema: plugin.template.properties[dataSetName].dataSchema,
              description: plugin.description,
              dataSetName,
            },
            description: getTranslationFromDBCP(this, plugin.description, `${dataSetName}.description`),
            title: getTranslationFromDBCP(this, plugin.description, `${dataSetName}.name`),
            disabled: () => {
              if (stepIndex === 0 || !this.$refs.stepForm) {
                return creatingOrOnboarded() || !this.twinDbcpForm.isValid;
              }
              return creatingOrOnboarded() || !this.$refs.stepForm[stepIndex - 1].isValid();
            },
          });
        }
      });
  }

  /**
   * Show the next status img and text for the profile creation.
   */
  nextCreationStatus() {
    if (this.creationTime !== 43) {
      this.creationTime++;
      this.timeoutCreationStatus = setTimeout(() => this.nextCreationStatus(), 1000);
    }

    if (this.creationTime % 11 === 0) {
      this.creatingProfile += 1;
    }
  }

  /**
   * Uses the current formular data to create container dbcp.
   */
  buildContainerData() {
    const twinTemplate = this.twins[this.twinDbcpForm.type.value];

    // setup description
    const twinDescription = {
      description: this.twinDbcpForm.description.value,
      name: this.twinDbcpForm.name.value,
      author: 'evan',
      version: '1.0.0',
      dbcpVersion: 2,
    };

    // setup container data
    let containerDescription = { author: 'evan', version: '1.0.0', dbcpVersion: 2 };
    let containerTemplate = { };

    // build container description and template definition out of seperated plugins
    Object.keys(twinTemplate.plugins).forEach((pluginName) => {
      containerDescription = bcc.lodash.merge(containerDescription,
        twinTemplate.plugins[pluginName].description);
      containerTemplate = bcc.lodash.merge(containerTemplate,
        twinTemplate.plugins[pluginName].template);
    });

    // for the usage of metadata name
    containerDescription.description = this.twinDbcpForm.name.value;
    containerDescription.name = this.twinDbcpForm.name.value;

    // merge all the collected data, to build container data
    const containerData = { type: 'Signup Twin' };
    Object.keys(this.twinData).forEach((key) => {
      containerData[key.split('.')[1]] = this.twinData[key];
    });

    return {
      twinDescription, containerTemplate, containerDescription, containerData,
    };
  }

  /**
   * Create a new profile and a new twin with the provided data.
   */
  async createOfflineTwin() {
    try {
      const {
        password, accountId, privateKey, runtime, vault,
      } = await this.getProfileCreationData();
      const {
        twinDescription, containerTemplate, containerDescription, containerData,
      } = this.buildContainerData();
      const { profile } = runtime;

      // start creation animation
      this.nextCreationStatus();

      // disable pinning while profile files are being created
      profile.ipld.ipfs.disablePin = true;
      // clear hash log
      profile.ipld.hashLog = [];

      const pk = `0x${privateKey}`;
      const { signature } = runtime.web3.eth.accounts.sign('Gimme Gimme Gimme!', pk);
      // trigger smart agent to create a new twin
      const requestedTwinP = axios.post(`${agentUrl}/api/smart-agents/twin/create`, {
        accountId,
        captchaToken: this.recaptchaToken,
        containerDescription,
        containerTemplate,
        signature,
        twinDescription,
      });

      const createdProfileP = bcc.Onboarding.createOfflineProfile(
        runtime,
        this.getUserData(),
        accountId,
        privateKey,
        this.recaptchaToken,
        runtime.environment,
      );

      const [requestedTwin] = await Promise.all([requestedTwinP, createdProfileP]);
      // set initial structure by creating addressbook structure and saving it to ipfs
      const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');
      const fileHashes: any = {};

      const cryptorAes = runtime.cryptoProvider.getCryptorByCryptoAlgo(
        runtime.dataContract.options.defaultCryptoAlgo,
      );
      const hashCryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo(
        runtime.dataContract.cryptoAlgorithHashes,
      );
      const [hashKey, blockNr] = await Promise.all([
        hashCryptor.generateKey(),
        runtime.web3.eth.getBlockNumber(),
      ]);

      // setup sharings for new profile
      const sharings = {};
      const profileKeys = Object.keys(containerData);
      // add hashKey
      await runtime.sharing.extendSharings(
        sharings, accountId, accountId, '*', 'hashKey', hashKey,
      );
      // extend sharings for profile data
      const dataContentKeys = await Promise.all(profileKeys.map(() => cryptorAes.generateKey()));
      for (let i = 0; i < profileKeys.length; i++) {
        await runtime.sharing.extendSharings(
          sharings, accountId, accountId, profileKeys[i], blockNr, dataContentKeys[i],
        );
      }
      // upload sharings
      const sharingsHash = await runtime.dfs.add(
        'sharing', Buffer.from(JSON.stringify(sharings), runtime.dataContract.encodingUnencrypted),
      );

      // used to exclude encrypted hashes from fileHashes.ipfsHashes
      const ipfsExcludeHashes = [];
      // encrypt containerData
      fileHashes.properties = { entries: { type: '' }, lists: {} };
      await Promise.all(Object.keys(containerData).map(async (key: string, index: number) => {
        if (Array.isArray(containerData[key])) {
          fileHashes.properties.lists[key] = [];

          await Promise.all(containerData[key].map(async (element, elemIdx) => {
            const encrypted = await cryptorAes.encrypt(
              element,
              { key: dataContentKeys[index] },
            );
            const envelope = {
              private: encrypted.toString('hex'),
              cryptoInfo: cryptorAes.getCryptoInfo(
                runtime.nameResolver.soliditySha3((requestedTwin as any).data.containerAddress),
              ),
            };
            const ipfsHash = await runtime.dfs.add(key, Buffer.from(JSON.stringify(envelope)));
            profile.ipld.hashLog.push(`${ipfsHash.toString('hex')}`);

            fileHashes.properties.lists[key][elemIdx] = await cryptor.encrypt(
              Buffer.from(ipfsHash.substr(2), 'hex'),
              { key: hashKey },
            );

            fileHashes.properties.lists[key][elemIdx] = `0x${fileHashes.properties.lists[key][elemIdx]
              .toString('hex')}`;
            ipfsExcludeHashes.push(fileHashes.properties.lists[key][elemIdx]);
          }));
        } else {
          const encrypted = await cryptorAes.encrypt(
            containerData[key],
            { key: dataContentKeys[index] },
          );
          const envelope = {
            private: encrypted.toString('hex'),
            cryptoInfo: cryptorAes.getCryptoInfo(
              runtime.nameResolver.soliditySha3((requestedTwin as any).data.containerAddress),
            ),
          };
          const ipfsHash = await runtime.dfs.add(key, Buffer.from(JSON.stringify(envelope)));
          profile.ipld.hashLog.push(`${ipfsHash.toString('hex')}`);

          fileHashes.properties.entries[key] = await cryptor.encrypt(
            Buffer.from(ipfsHash.substr(2), 'hex'),
            { key: hashKey },
          );

          fileHashes.properties.entries[key] = `0x${fileHashes.properties.entries[key]
            .toString('hex')}`;
          ipfsExcludeHashes.push(fileHashes.properties.entries[key]);
        }
      }));

      fileHashes.sharingsHash = sharingsHash;
      // keep only unique values, ignore addressbook (encrypted hash)
      fileHashes.ipfsHashes = [
        ...profile.ipld.hashLog,
        ...Object.keys(fileHashes.properties.entries)
          .map((key) => fileHashes.properties.entries[key]),
      ];
      fileHashes.ipfsHashes = (
        (arrArg) => arrArg.filter(
          (elem, pos, arr) => arr.indexOf(elem) === pos && ipfsExcludeHashes.indexOf(elem) === -1,
        )
      )(fileHashes.ipfsHashes);

      // re-enable pinning
      profile.ipld.ipfs.disablePin = false;

      const twinFillP = await axios.post(`${agentUrl}/api/smart-agents/twin/fill`, {
        accountId,
        signature,
        twinInfo: fileHashes,
        accessToken: (requestedTwin as any).data.accessToken,
        containerId: (requestedTwin as any).data.containerAddress,
      });

      await this.finishOnboarding(runtime, vault, accountId, password);

      // wait another 2 seconds to ensure, that the ipfs hashes are available
      setTimeout(() => {
        // show success message and navigate the user to the digital twins
        this.creatingProfile = 6;
        setTimeout(() => {
          window.location.hash = [
            `/dashboard.vue.${getDomainName()}`,
            `detail.digital-twin.${getDomainName()}`,
            requestedTwin.data.twinAddress,
          ].join('/');
        }, 2000);
      }, 2000);
    } catch (ex) {
      // reset all steps of proile creation
      utils.log(ex.message, 'error');
      this.creatingProfile = 0;
      this.creationTime = -1;
      this.recaptchaToken = null;
      (this.$refs.creatingProfileError as any).show();
      window.clearTimeout(this.timeoutCreationStatus);
    }
  }
}
