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
import axios from 'axios';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import { agentUrl } from '@evan.network/ui';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

import * as dispatchers from '../../../../../dispatchers/registry';

import { issueVerification } from '../notary.identifications';


interface IssueFormInterface extends EvanForm {
  files: EvanFormControl;
  requestId: EvanFormControl;
}

@Component({ })
export default class IdentNotaryIssueComponent extends mixins(EvanComponent) {
  /**
   * Forumular to insert the certified notary files.
   */
  issueForm: IssueFormInterface = null;

  /**
   * Is currently something in issueing process?
   */
  issueing = false;

  async created() {
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
      files: {
        value: [ ],
        validate: function(vueInstance: IdentNotaryIssueComponent, form: IssueFormInterface) {
          return this.value.length === 0 ? '_org.ident.notary.issue.files.error' : true;
        }
      }
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
   * Trigger the identification issue request
   */
  async issueIdentification() {
    this.issueing = true;

    try {
       await issueVerification((<any>this).getRuntime(), this.issueForm.requestId.value, this.issueForm.files.value)
    } catch (ex) {
      (<any>this).getRuntime().logger.log(ex.message);
      this.issueForm.files._error = ex.message;
    }

    this.issueing = false;
  }
}
