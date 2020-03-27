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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent, EvanTableColumn } from '@evan.network/ui-vue-core';
import { Prop } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, excluded } from 'vee-validate/dist/rules';
import { ServiceEndpoint } from './DidInterfaces';

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class ServiceEndpointsComponent extends mixins(EvanComponent) {
  @Prop() isEditMode;

  @Prop() isLoading;

  @Prop() endpoints: ServiceEndpoint[];

  formKey = 'initial';

  newId: string = null;

  newType: string = null;

  newUrl: string = null;

  columns: EvanTableColumn[] = [
    {
      key: 'id',
      label: this.$t('_profile.did.id'),
      tdClass: 'truncate',
    },
    {
      key: 'type',
      label: this.$t('_profile.did.type'),
      tdClass: 'truncate',
    },
    {
      key: 'url',
      label: this.$t('_profile.did.url'),
      tdClass: 'truncate',
    },
    {
      key: 'action',
      label: '',
      thClass: 'th-icon',
    },
  ]

  get endpointIds(): string[] {
    return this.endpoints.map((endpoint) => endpoint.id);
  }

  created(): void {
    this.initValidation();
  }

  onSubmitRow(): void {
    const newEndpoints: ServiceEndpoint[] = [
      ...this.endpoints,
      {
        id: this.newId,
        type: this.newType,
        url: this.newUrl,
      },
    ];

    this.newId = null;
    this.newType = null;
    this.newUrl = null;
    // Workaround to reset to non-dirty inputs
    this.formKey = new Date().toISOString();

    this.$emit('updateEndpoints', newEndpoints);
  }

  /**
   * Removes the selected endpoint temporarily
   * @param index row index of the item to be removed
   */
  deleteEndpoint(index: number): void {
    const newEndpoints = this.endpoints.filter((_, idx) => idx !== index);

    this.$emit('updateEndpoints', newEndpoints);
  }

  /**
   * Set up used validation rules
   */
  initValidation(): void {
    extend('required', {
      ...required,
      message: this.$t('_evan.validation.required'),
    });

    extend('url', {
      validate: (value: string) => {
        try {
          /**
           * Validate against RFC 3986
           * Not pretty, but a regex would be even worse
           */
          // eslint-disable-next-line no-new
          new URL(value);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: this.$t('_evan.validation.url'),
    });

    extend('excluded', {
      ...excluded,
      message: this.$t('_profile.did.id-unique-error'),
    });

    extend('startsWith', {
      validate: (value: string, args: { term: string }) => value.startsWith(args.term),
      message: this.$t('_profile.did.did-format-error'),
      params: ['term'],
    });
  }
}
