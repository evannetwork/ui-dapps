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

// evan.network imports
import { EvanComponent, EvanForm } from '@evan.network/ui-vue-core';

import dataSetExamples from './dummydata.json';

interface SampleFormInterface extends EvanForm {
  field1: string;
  field2: string;
  field3: number;
  select: string;
  files: any;
}


import { ContainerPermissionsInterface } from '@evan.network/ui-vue-core/src/interfaces';
/**
 * Interface for multiple dataset permissions object.
 */
export interface PermissionsInterface {
  [property: string]: {
    read: boolean,
    readWrite: boolean,
    fields?: string[]
  };
}

@Component({ })
export default class Forms extends mixins(EvanComponent) {
  /**
   * formular flags
   */
  isPublic = true;
  stacked = false;
  onlyForm = false;
  sortFilters = JSON.stringify({
    containerId123: ['Number of Seats', 'Manufactorer', 'Flight Log', 'Parts'],
    containerId456: ['Marke', 'Anzahl Räder', 'Farbe', 'Sitzplätze', 'Kofferraum', 'Nutzung', 'Kilometerstände', 'Fahrtenbuch']
  }, undefined, 2);

  /**
   * Rerender everything
   */
  showForms = true;

  /**
   * Custom field value handling
   */
  field1 = '';
  field2 = 'a';
  field3 = 0;
  field4 = 0;
  field5 = null;

  options = [
    {label: 'Option 1', value: 'option1'},
    {label: 'Option 2', value: 'option2'},
    'Option 3',
    'Option 4',
    'Option 5'
  ];

  sampleForm: SampleFormInterface = null;

  /**
   * Mapped Object from original addressbook
   */
  contacts: any = [];

  /**
   * Watch for dispatcher updates.
   */
  dispatcherWatch = null;

  async created() {
    await this.loadAddressBook();

    this.sampleForm = new EvanForm(this, {
      field1: {
        value: '',
      },
      field2: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
      },
      field3: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'input',
          attr: {
            error: 'custom error',
            label: 'custom label',
            placeholder: 'custom placeholder',
            type: 'number',
            size: 6
          }
        }
      },
      select: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'select',
          attr: {
            options: this.options,
            size: 6,
          }
        }
      },
      vSelect: {
        value: '',
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        },
        uiSpecs: {
          type: 'v-select',
          attr: {
           options: this.contacts,
           taggable: true
          }
        }
      },
      files: {
        value: [ ],
        validate: function(vueInstance: Forms, form: SampleFormInterface) {
          return this.value.length !== 0;
        }
      },
    }) as SampleFormInterface;
  }

  handleSubmit(ev: Event): Promise<any> {
    console.log(ev);

    return new Promise((resolve, _) => {
      setTimeout(() => {
        console.log('resolved');

        resolve('saved');
      }, 1000);
    });
  }

  /**
   * load the addressbook for the current user
   */
  async loadAddressBook() {
    const runtime = (<any>this).getRuntime();

    // load the contacts for the current user, so we can display correct contact alias
    delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
    let addressBook = (await runtime.profile.getAddressBook()).profile;

    this.contacts = Object.keys(addressBook).map(key => {
      return {
        'label': addressBook[key].alias,
        'value': key
      };
    });
  }

  /**
   * Mock: Loads user permissions on a certain container according to a given user hash.
   *
   * @param userId user hash
   */
  loadPermissions(userId: string) {
    return new Promise( (resolve, _) => {
      setTimeout(() => {
        if (dataSetExamples[userId]) {
          resolve(dataSetExamples[userId]);
        } else {
          // for test cases take always first from dummy data
          resolve(Object.values(dataSetExamples)[0]);
        }
      }, 2000);
    });
  }

  /**
   * Mock: will be replaced by permissions update function.
   */
  updatePermissions(permissions: ContainerPermissionsInterface) {
    console.log('permissions to upodate:', JSON.stringify(permissions));

    return new Promise((r, _) => { r(true); });
  }

  isJsonString(str: string) {
    try {
      const json = JSON.parse(str);

      return (typeof json === 'object');
    } catch (e) {

      return false;
    }
  }
}
