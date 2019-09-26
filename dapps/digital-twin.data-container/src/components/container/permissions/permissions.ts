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

import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop, } from 'vue-property-decorator';

import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { deepEqual, cloneDeep } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import { EvanUIDigitalTwin, utils } from '@evan.network/digitaltwin.lib';

import * as dispatchers from '../../../dispatchers/registry';
import ContainerCache from '../../../container-cache';
import UiContainer from '../../../UiContainer';


interface ShareFormInterface extends EvanForm {
  title: EvanFormControl;
  body: EvanFormControl;
}

@Component({ })
export default class ContainerPermissionsComponent extends mixins(EvanComponent) {
  /**
   * Current opened container address
   */
  @Prop() address;

  /**
   * Restrict UI for only one data set.
   */
  @Prop() dataSet;

  /**
   * Current opened container address
   */
  containerAddress = '';
  digitalTwinAddress = '';
  dataSetName = '';
  description: any = null;

  /**
   * Container instance
   */
  container: bcc.Container;

  /**
   * status information
   */
  collapsed = { };
  initialized = false;
  isOwner = false;
  loading = true;
  sharing = false;

  /**
   * array of permitted contacts and it's read / write permissions
   */
  shareConfig: Array<any> = null;

  /**
   * ui container list properties
   */
  properties: Array<string> = null;

  /**
   * Permission map, users mapped to it's permissions within an object. Also create a copy to check
   * for changes and which one must to be shared.
   */
  permissionMap: any = { };
  originPermissionMap: any = null;
  permissionChanged = false;

  /**
   * formular specific variables
   */
  addableContacts: Array<string> = [ ];
  addAccountId = '';
  contacts: any = [ ];
  myProfile: any = null;
  shareForm: ShareFormInterface = null;

  /**
   * Load permissions and address book.
   */
  async created() {
    this.containerAddress = this.address || this.$route.params.containerAddress;
    this.dataSetName = this.dataSet || this.$route.params.entryName;

    const runtime = utils.getRuntime(this);
    let beforeSharing = false;
    await UiContainer.watch(this, async (uiContainer: UiContainer) => {
      // show loading when the container gets already shared
      this.sharing = uiContainer.isSharing;
      this.isOwner = uiContainer.owner === runtime.activeAccount;

      if ((beforeSharing && !this.sharing && !this.loading) || !this.initialized) {
        this.initialized = true;
        this.loading = true;

        this.digitalTwinAddress = uiContainer.digitalTwinAddress;
        this.description = uiContainer.description;

        // all available properties
        this.properties = Object.keys(uiContainer.plugin.template.properties);

        // load share config
        this.shareConfig = await uiContainer.getContainerShareConfigs();

        // fill empty readable / writeable
        this.shareConfig.forEach(userConfig => {
          userConfig.read = userConfig.read || [ ];
          userConfig.readWrite = userConfig.readWrite || [ ];

          // map properties to read and write permissions
          this.$set(this.permissionMap, userConfig.accountId, { });
          this.properties.forEach((property: string) => {
            const canWrite = userConfig.readWrite.indexOf(property) !== -1;
            this.$set(this.permissionMap[userConfig.accountId], property, {
              read: canWrite || userConfig.read.indexOf(property) !== -1,
              readWrite: canWrite,
            });
          });
        });

        // copy permissions for integrity checks
        this.originPermissionMap = cloneDeep(bcc.lodash, this.permissionMap, true);
        this.loading = false;
      }

      beforeSharing = this.sharing;
    });

    await this.setupAddressBook(runtime);
    this.setupSharingForm();
  }

  /**
   * Load runtime and map it into an array.,
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   */
  async setupAddressBook(runtime: bcc.Runtime) {
    // load contacts and transform them into an array
    const addressBook = await runtime.profile.getAddressBook();
    bcc.Ipld.purgeCryptoInfo(addressBook);
    this.myProfile = addressBook.profile[runtime.activeAccount];
    this.contacts = addressBook.profile;

    // reset addable contacts
    this.addableContacts = [ ];

    // check for users, that are not already exists in the permission map
    Object.keys(this.contacts).forEach((address) => {
      if (!this.permissionMap[address]) {
        this.addableContacts.push(address);
      }
    });

    // preselect first user
    if (this.addableContacts.length !== 0) {
      this.addAccountId = this.addableContacts[0];
    }
  }

  /**
   * Check if the original permissionMap is equal to the originPermissionMap.
   */
  checkPermissionChanged(accountId: string, property: string, write: boolean) {
    if (write && this.permissionMap[accountId][property].readWrite) {
      this.$set(this.permissionMap[accountId][property], 'read', true);
    }

    this.permissionChanged = !deepEqual(this.permissionMap, this.originPermissionMap);
  }

  /**
   * Initialize share form.
   */
  async setupSharingForm() {
    // setup share form, so the user can insert a custom form
    let title = [
      (<any>this).$t('_digitaltwins.breadcrumbs.datacontainer.digitaltwin'),
      `: ${ this.description.name }`,
    ];
    let body;
    let twinName;

    // if digital twin is opened, build subject including twin dbcp
    if (this.digitalTwinAddress) {
      const digitaltwin = EvanUIDigitalTwin.getDigitalTwin(
        utils.getRuntime(this),
        this.digitalTwinAddress
      );
      const twinDesc = await digitaltwin.getDescription();
      twinName = twinDesc.name;

      title.unshift(`${ twinDesc.name }, `);
      title.unshift(`${ (<any>this).$t('_digitaltwins.breadcrumbs.digitaltwin') }: `);
    }

    body = (<any>this).$t(
      this.digitalTwinAddress ?
        '_datacontainer.share.bmail-twin' :
        '_datacontainer.share.bmail-container',
      {
        alias: this.myProfile.alias,
        containerAddress: this.containerAddress,
        digitalTwinAddress: this.digitalTwinAddress,
        name: this.description.name,
        twinName: twinName,
      }
    );

    this.shareForm = (<ShareFormInterface>new EvanForm(this, {
      title: {
        value: title.join(''),
        validate: function(vueInstance: ContainerPermissionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      },
      body: {
        value: body,
        validate: function(vueInstance: ContainerPermissionsComponent, form: ShareFormInterface) {
          return this.value.trim().length !== 0;
        }
      }
    }));
  }

   /**
   * Share the data contract with others
   */
  share() {
    const runtime = utils.getRuntime(this);
    const address = this.containerAddress;
    const domainName = (<any>this).dapp.domainName;
    const fullPath = [ `/${ (<any>this).dapp.rootEns }`,  `digitaltwins.${ domainName }` ];

    // if digital twin was opened, open container unter twin address when it was shared
    if (this.digitalTwinAddress) {
      fullPath.push(`digitaltwin.${ domainName }`);
      fullPath.push(this.digitalTwinAddress);
    }

    // apply container address
    fullPath.push(`datacontainer.digitaltwin.${ domainName }`);
    fullPath.push(address);

    // transform the ui permission into an conainter share config
    const shareConfigs = [ ];
    Object.keys(this.permissionMap).forEach(accountId => {
      // if something has changed, detect changes
      if (!deepEqual(this.permissionMap[accountId], this.originPermissionMap[accountId])) {
        const shareConfig: bcc.ContainerShareConfig = {
          accountId: accountId,
          read: [ ],
          readWrite: [ ],
        };

        // iterate through properties and get new read / readWrite permissions
        this.properties.forEach(property => {
          if (this.permissionMap[accountId][property].read &&
              !this.originPermissionMap[accountId][property].read) {
            shareConfig.read.push(property);
          }
          if (this.permissionMap[accountId][property].readWrite &&
              !this.originPermissionMap[accountId][property].readWrite) {
            shareConfig.readWrite.push(property);
          }
        });

        // push the new share config into the share configs array
        shareConfigs.push(shareConfig);
      }
    });

    // build bmail for invited user
    const bMailContent = {
      content: {
        from: runtime.activeAccount,
        fromAlias: this.myProfile.alias,
        title: this.shareForm.title.value,
        body: this.shareForm.body.value.replace(/\n/g, '<br>'),
        attachments: [
          {
            fullPath: fullPath.join('/'),
            type: 'url',
          },
          {
            containerAddress: this.containerAddress,
            twinAddress: this.digitalTwinAddress,
            type: 'container',
          }
        ],
      },
    };

    // start the dispatcher
    dispatchers.shareDispatcher.start(utils.getRuntime(this), {
      address,
      shareConfigs,
      bMailContent,
    });

    (<any>this.$refs.shareModal).hide();
  }

  /**
   * Adds the selected user with empty permissions into the permission Map
   */
  addUser() {
    // add the permission map
    this.permissionMap[this.addAccountId] = { };
    this.properties.forEach(property => {
      this.permissionMap[this.addAccountId][property] = {
        read: false,
        readWrite: false
      };
    });

    // add the copy
    this.originPermissionMap[this.addAccountId] = cloneDeep(bcc.lodash,
      this.permissionMap[this.addAccountId], true);

    // remove the new added contact from the available list
    this.addableContacts.splice(this.addableContacts.indexOf(this.addAccountId), 1);

    // preselect next user
    if (this.addableContacts.length !== 0) {
      this.addAccountId = this.addableContacts[0];
    }

    // close add user modal
    (<any>this.$refs.addUserModal).hide();
  }
}
