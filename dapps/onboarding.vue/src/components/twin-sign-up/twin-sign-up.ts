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
}

