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

// evan.network imports
import { Dispatcher } from '@evan.network/ui';
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// internal
import * as notaryLib from '../notary.lib';

@Component({ })
export default class NotaryVerificationCardComponent extends mixins(EvanComponent) {
  /**
   * Address for that the notary verifications should be loaded
   */
  @Prop() address;

  /**
   * Request id for that the detail should be displayed
   */
  @Prop() requestId;

  /**
   * Direct verification if the notary flow is already done
   */
  @Prop() verifications;

  /**
   * ui status flags
   */
  loading = true;
  error = false;

  /**
   * Current verification status for the user
   */
  details = null;

  /**
   * states for that actions are available
   */
  statusActions = [ 'unknown', 'requested', 'confirming', 'issued', ];

  /**
   * Dispatcher instance for watching mailbox attachment updates.
   */
  attachmentDispatcher = new Dispatcher(
    `mailbox.vue.${ dappBrowser.getDomainName() }`,
    'attachmentDispatcher',
    0
  );

  /**
   * is a mailbox attachment dispatche running?
   */
  accepting = false;

  /**
   * watch for queue updates
   */
  listeners = [ ];

  /**
   * Load current status
   */
  async created() {
    // load data
    await this.loadDetails();

    // watch for attachment updates
    this.listeners.push(this.attachmentDispatcher.watch(() => this.checkAccepting()));
  }

  /**
   * Load the details for the opened request / identification verifications.
   */
  async loadDetails() {
    const runtime = (<any>this).getRuntime();

    this.loading = true;
    try {
      if (this.verifications) {
        this.details = {
          status: 'finished',
          verifications: this.verifications
        };
      } else {
        this.details = await notaryLib.getIdentificationDetails(
          runtime,
          this.address,
          this.requestId,
        );
      }
    } catch (ex) {
      runtime.logger.log(ex.message, 'error');
      this.error = true;
    }

    this.loading = false;
  }

  /**
   * Check if currently a mailbox attachment dispatcher is running
   */
  async checkAccepting() {
    if (this.details.status === 'issued') {
      const runtime = (<any>this).getRuntime();
      const instances = (await this.attachmentDispatcher.getInstances(runtime))
        .filter(instance =>
          instance.data.attachment.type === 'verifications' &&
          this.details.issuedMail &&
          this.details.issuedMailAddress === instance.data.mailAddress
        );

      // reload when synchronisation have finished and previous instance has runned
      if (instances.length === 0 && this.accepting) {
        await notaryLib.closeRequest(runtime, this.requestId);
        await this.$store.state.profileDApp.profile.loadForAccount(
          this.$store.state.profileDApp.profile.treeLabels.contracts);
        await notaryLib.triggerRequestReload(this.address, {
          requestId: this.requestId,
          status: 'finished',
        });
      }

      this.accepting = instances.length !== 0;
    }
  }

  /**
   * Start the action for the current status.
   */
  runStatusAction() {
    switch (this.details.status) {
      case 'unknown':
      case 'requested':
      case 'confirming': {
        (<any>this.$refs.identAction).show();
        break;
      }
      case 'issued': {
        // change attachment type to vericications, so we can use the attachment dispatcher
        const attachment = this.details.issuedMail.attachments[0];
        attachment.type = 'verifications';
        this.attachmentDispatcher.start((<any>this).getRuntime(), {
          attachment: attachment,
          mail: this.details.issuedMail,
          mailAddress: this.details.issuedMailAddress,
        });

        break;
      }
    }
  }
}
