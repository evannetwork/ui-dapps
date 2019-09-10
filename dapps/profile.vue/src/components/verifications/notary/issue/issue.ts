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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { agentUrl } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import * as dispatchers from '../../../../dispatchers/registry';

import { issueVerification } from '../notary.identifications';


interface IssueFormInterface extends EvanForm {
  files: EvanFormControl;
  privateFiles: EvanFormControl;
  publicFiles: EvanFormControl;
  requestId: EvanFormControl;
}

@Component({ })
export default class IdentNotaryIssueComponent extends mixins(EvanComponent) {
  /**
   * Forumular to insert the certified notary files.
   */
  issueForm: IssueFormInterface = null;

  /**
   * Is currently something in issuing process?
   */
  issuing = false;
  status = '';

  async created() {
    this.setupIssueForm();
  }

  /**
   * Creates the issue form for gathering issue information.
   */
  setupIssueForm() {
    this.issueForm = (<IssueFormInterface>new EvanForm(this, {
      accountId: {
        value: '',
        validate: function(vueInstance: IdentNotaryIssueComponent, form: IssueFormInterface) {
          return EvanForm.validEthAddress(this.value);
        }
      },
      requestId: {
        value: '',
        validate: function(vueInstance: IdentNotaryIssueComponent, form: IssueFormInterface) {
          return !!this.value;
        }
      },
      publicFiles: {
        value: [ ],
        validate: function(vueInstance: IdentNotaryIssueComponent, form: IssueFormInterface) {
          return true;
          // return this.value.length === 0 ? '_profile.ident.notary.issue.files.error' : true;
        }
      },
      privateFiles: {
        value: [ ],
        validate: function(vueInstance: IdentNotaryIssueComponent, form: IssueFormInterface) {
          return true;
          // return this.value.length === 0 ? '_profile.ident.notary.issue.files.error' : true;
        }
      },
    }));
  }

  /**
   * Show the info modal.
   */
  show() {
    (<any>this.$refs).issueModal.show();
  }

  /**
   * Hide the info modal.
   */
  hide() {
    (<any>this.$refs).issueModal.hide();
  }

  /**
   * Hide the info and the status modal.
   */
  hideBoth() {
    (<any>this.$refs).statusModal.hide();

    if (this.status === 'success') {
      (<any>this.$refs).issueModal.hide();
    }
  }

  /**
   * Trigger the verification issue request
   */
  async issueIdentification() {
    this.issuing = true;

    const runtime = (<any>this).getRuntime();
    try {
      await issueVerification(
        runtime,
        this.issueForm.requestId.value,
        {
          private: this.issueForm.privateFiles.value,
          public: this.issueForm.publicFiles.value
        }
      );

      // reset form and show success modal
      this.setupIssueForm();
      this.status = 'success';
    } catch (ex) {
      runtime.logger.log(ex.message, 'error');
      this.status = 'error';
    }

    // show success modal
    (<any>this.$refs.statusModal).show();
    this.issuing = false;
  }
}
