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
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import axios from 'axios';

// evan.network imports
import { EvanForm, EvanFormControl, getDomainName, } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import SignUp from '../sign-up/sign-up.ts';

interface TwinDBCPForm extends EvanForm {
  name: EvanFormControl;
  description: EvanFormControl;
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
   * Setup twin forms.
   */
  created() {
    // makes a field required
    const requiredValidator = (vueInstance: TwinSignUp, form: EvanForm, control: EvanFormControl) => {
      return control.value && control.value.length !== 0;
    }

    // base ui specs, that will be passed to the dynamic controls
    const uiSpecs = { attr: { label: '' } };
    const control = { value: '', uiSpecs, };
    const metadataControl = JSON.parse(JSON.stringify(control));
    const listControl = JSON.parse(JSON.stringify(control));

    // set control sizes
    metadataControl.uiSpecs.attr.size = 6;
    listControl.uiSpecs.attr.size = 4;

    // create seperated control for dates
    const dateControl = JSON.parse(JSON.stringify(listControl));
    dateControl.uiSpecs.attr.type = 'date';

    // controls that will be passed to the forms
    const metadataControls = { };
    const listControls = { };

    // add controls to the formular
    for (let i = 0; i < 5; i++) {
      // add metadata controls
      metadataControls[`key${ i }`] = { ...metadataControl, validate: requiredValidator };
      metadataControls[`value${ i }`] = { ...metadataControl, };

      // add list controls
      listControls[`date${ i }`] = { ...dateControl, validate: requiredValidator, };
      listControls[`description${ i }`] = { ...listControl, validate: requiredValidator, };
      listControls[`value${ i }`] = { ...listControl, validate: requiredValidator, };
    }

    // create forms with the dynamic created controls
    this.metadataForm = new EvanForm(this, metadataControls);
    this.listForm = new EvanForm(this, listControls);

    for (let i = 0; i < 5; i++) {
      this.metadataForm[`key${ i }`].value = `key${ i }`
      this.metadataForm[`value${ i }`].value = `value${ i }`
      // add list controls
      this.listForm[`date${ i }`].value = `date${ i }`
      this.listForm[`description${ i }`].value = `description${ i }`
      this.listForm[`value${ i }`].value = `value${ i }`
    }

    // setup twin dbcp formular
    this.twinDbcpForm = (<TwinDBCPForm> new EvanForm(this, {
      name: {
        value: '',
        validate: requiredValidator,
        uiSpecs: {
          attr: {
            required: true,
          }
        }
      },
      description: {
        value: '',
        uiSpecs: {
          attr: {
            rows: 5,
            type: 'textarea',
          }
        },
      }
    }));

    // setup steps
    const creatingOrOnboarded = () => this.onboardedDialog;
    this.steps = [
      {
        title: '_onboarding.sign-up.twin.steps.dbcp.title',
        disabled: () => creatingOrOnboarded(),
      },
      {
        title: '_onboarding.sign-up.twin.steps.metadata.title',
        disabled: () => creatingOrOnboarded() || !this.twinDbcpForm.isValid,
      },
      {
        title: '_onboarding.sign-up.twin.steps.list.title',
        disabled: () => creatingOrOnboarded() || !this.metadataForm.isValid,
      },
      {
        title: '_onboarding.sign-up.twin.steps.finish.title',
        disabled: () => creatingOrOnboarded() || !this.listForm.isValid,
      },
    ];
  }

  /**
   * Uses the current formular data data to create container dbcp.
   */
  buildContainerData() {
    const metadataName = this.$t('_onboarding.sign-up.twin.metadata.container-title');
    const listName = this.$t('_onboarding.sign-up.twin.list.container-title');

    // setup description
    const description = {
      description: this.twinDbcpForm.name.value,
      name: this.twinDbcpForm.name.value,
      dataSchema: {
        [ metadataName ]: {
          "$id": "specifications_schema",
          "properties": { },
          "type": "object"
        },
        [ listName ]: {
          "$id": "history_schema",
          "items": {
            "properties": {
              "date": {
                "default": "",
                "type": "string"
              },
              "description": {
                "default": "",
                "type": "string"
              },
              "value": {
                "default": "",
                "type": "string"
              }
            },
            "type": "object"
          },
          "type": "array"
        }
      }
    };

    // setup data object
    const containerData = { };
    containerData[metadataName] = { };
    containerData[listName] = [ ];

    // add controls to the formular
    for (let i = 0; i < 5; i++) {
      // add metadata containerData
      const metadataKey = this.metadataForm[`key${ i }`].value;
      containerData[metadataName][metadataKey] = this.metadataForm[`value${ i }`].value;

      // add list containerData
      containerData[listName].push({
        date: this.listForm[`date${ i }`].value,
        description: this.listForm[`description${ i }`].value,
        value: this.listForm[`value${ i }`].value,
      });

      // add metadata schema
      description.dataSchema[metadataName].properties[metadataKey] = {
        default: '',
        type: 'string',
      };
    }

    // setup template definition
    const template = {
      permissions: [ metadataName, listName, ],
      properties: {
        [ metadataName ]: {
          dataSchema: description.dataSchema[metadataName],
          permissions: { '0': [ 'set' ] },
          type: 'entry',
        },
        [ listName ]: {
          dataSchema: description.dataSchema[listName],
          permissions: { '0': [ 'set' ] },
          type: 'list',
        },
      },
    };

    return { containerData, description, template, };
  }

  async createOfflineTwin() {
    const { password, accountId, privateKey, runtime, } = await this.getProfileCreationData();
    const { description, containerData, template, } = this.buildContainerData();
    const network = runtime.environment;
    const profile = runtime.profile;

    console.log({ password, accountId, privateKey, runtime, })
    console.log({ description, containerData, template, })

    return;

    // disable pinning while profile files are being created
    profile.ipld.ipfs.disablePin = true;
    // clear hash log
    profile.ipld.hashLog = [];

    const pk = '0x' + privateKey;
    const signature = runtime.web3.eth.accounts.sign('Gimme Gimme Gimme!', pk).signature;
    // trigger smart agent to create a new twin
    const requestedTwin = await axios.post(`${ agentUrl }/api/smart-agents/twin/create`, {
      accountId,
      signature,
      captchaToken: this.recaptchaToken,
      twinDescription: {
        description: this.twinDbcpForm.name.value,
        name: this.twinDbcpForm.name.value,
      },
      containerDescription: description,
      containerData,
    });

    const dhKeys = runtime.keyExchange.getDiffieHellmanKeys();
    await profile.addContactKey(
      runtime.activeAccount, 'dataKey', dhKeys.privateKey.toString('hex'));
    await profile.addPublicKey(dhKeys.publicKey.toString('hex'));

    // set initial structure by creating addressbook structure and saving it to ipfs
    const cryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo('aesEcb');
    const fileHashes: any = {};

    const cryptorAes = runtime.cryptoProvider.getCryptorByCryptoAlgo(
      runtime.dataContract.options.defaultCryptoAlgo);
    const hashCryptor = runtime.cryptoProvider.getCryptorByCryptoAlgo(
      runtime.dataContract.cryptoAlgorithHashes);
    const [hashKey, blockNr] = await Promise.all([
      hashCryptor.generateKey(),
      runtime.web3.eth.getBlockNumber(),
    ]);

    // setup sharings for new profile
    const sharings = {};
    const profileKeys = Object.keys(containerData);
    // add hashKey
    await runtime.sharing.extendSharings(
      sharings, accountId, accountId, '*', 'hashKey', hashKey);
    // extend sharings for profile data
    const dataContentKeys = await Promise.all(profileKeys.map(() => cryptorAes.generateKey()));
    for (let i = 0; i < profileKeys.length; i++) {
      await runtime.sharing.extendSharings(
        sharings, accountId, accountId, profileKeys[i], blockNr, dataContentKeys[i]);
    }
    // upload sharings
    let sharingsHash = await runtime.dfs.add(
      'sharing', Buffer.from(JSON.stringify(sharings), runtime.dataContract.encodingUnencrypted));

    // used to exclude encrypted hashes from fileHashes.ipfsHashes
    const ipfsExcludeHashes = [ ];
    // encrypt containerData
    fileHashes.properties = { entries: { } };
    await Promise.all(Object.keys(containerData).map(async (key: string, index: number) => {
      const encrypted = await cryptorAes.encrypt(
        containerData[key],
        { key: dataContentKeys[index] }
      );
      const envelope = {
        private: encrypted.toString('hex'),
        cryptoInfo: cryptorAes.getCryptoInfo(
          runtime.nameResolver.soliditySha3((requestedTwin as any).contractId)),
      };
      let ipfsHash = await runtime.dfs.add(key, Buffer.from(JSON.stringify(envelope)));
      profile.ipld.hashLog.push(`${ ipfsHash.toString('hex') }`);

      fileHashes.properties.entries[key] = await cryptor.encrypt(
        Buffer.from(ipfsHash.substr(2), 'hex'),
        { key: hashKey, }
      );

      fileHashes.properties.entries[key] = `0x${ fileHashes.properties.entries[key]
        .toString('hex') }`;
      ipfsExcludeHashes.push(fileHashes.properties.entries[key]);
    }));

    fileHashes.properties.entries[profile.treeLabels.publicKey] =
      await profile.storeToIpld(profile.treeLabels.publicKey);
    fileHashes.sharingsHash = sharingsHash;
    // keep only unique values, ignore addressbook (encrypted hash)
    fileHashes.ipfsHashes = [
      ...profile.ipld.hashLog,
      ...Object.keys(fileHashes.properties.entries)
        .map(key => fileHashes.properties.entries[key]),
    ];
    fileHashes.ipfsHashes = (
      (arrArg) => arrArg.filter(
        (elem, pos, arr) => arr.indexOf(elem) === pos && ipfsExcludeHashes.indexOf(elem) === -1
      )
    )(fileHashes.ipfsHashes);
    // clear hash log
    profile.ipld.hashLog = [];
    // re-enable pinning
    profile.ipld.ipfs.disablePin = false;

    await axios.post(`${ agentUrl }/api/smart-agents/twin/fill`, {
      accountId: accountId,
      signature: signature,
      twinInfo: fileHashes,
      accessToken: (requestedTwin as any).accessToken,
      contractId: (requestedTwin as any).contractId,
    });
  }
}

