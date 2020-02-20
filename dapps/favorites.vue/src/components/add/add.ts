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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

import addFavoriteDispatcher from '../../dispatchers/add';

interface FavoriteFormInterface extends EvanForm {
  address: EvanFormControl;
}

@Component({ })
export default class AddComponent extends mixins(EvanComponent) {
  /**
   * formular specific variables
   */
  favoriteForm: FavoriteFormInterface = null;

  /**
   * Can the favorite added? (added, notFound, ok)
   */
  addStatus: string;

  /**
   * Show loading while checking address input
   */
  checking: boolean;

  /**
   * Loaded description for the current address
   */
  description: any;

  /**
   * Setup favorite form.
   */
  created() {
    this.favoriteForm = (<FavoriteFormInterface>new EvanForm(this, {
      address: {
        value: '',
        validate: function(vueInstance: AddComponent, form: FavoriteFormInterface) {
          return this.value.length !== 0;
        }
      },
    }));
  }

  /**
   * Check if an favorite was already added. If not, ask for accept, else, show already added.
   *
   * @param      {any}  $event  form event
   */
  async checkFavorite($event?: any) {
    const runtime = (<any>this).getRuntime();
    const domainName = dappBrowser.getDomainName();

    // load the favorites
    const favorites = await runtime.profile.getBookmarkDefinitions() || {};

    // add root domain, if it was not applied and it is not an contract
    if (this.favoriteForm.address.value.indexOf('0x') !== 0 &&
      this.favoriteForm.address.value.indexOf(domainName, this.favoriteForm.address.value.length - domainName.length) === -1) {
      this.favoriteForm.address.value = `${ this.favoriteForm.address.value }.${ domainName }`;
    }

    // favorite was already added
    if (favorites[this.favoriteForm.address.value]) {
      this.addStatus = 'added';
    } else {
      // check if the description exists
      try {
        const description = await runtime.description.getDescription(
          this.favoriteForm.address.value, runtime.activeAccount);

        // if it is invalid, show the not found
        if (description && description.public) {
          this.description = description.public;
        } else {
          this.description = null;
        }
      } catch (ex) {
        this.description = null;
      }

      this.addStatus = this.description ? 'ok' : 'notFound';
    }

    (<any>this.$refs.favoriteAddModalAccept).show();
  }

  /**
   * Save the new favorite
   */
  async addFavorite() {
    (<any>this.$refs.favoriteAddModal).hide();
    (<any>this.$refs.favoriteAddModalAccept).hide();

    await addFavoriteDispatcher.start((<any>this).getRuntime(), {
      address: this.favoriteForm.address.value,
      name: this.description.name,
      description: this.description.description,
      i18n: this.description.i18n,
      imgSquare: this.description.imgSquare,
      imgWide: this.description.imgWide,
      standalone: this.description.standalone || this.description.dapp.standalone,
      primaryColor: this.description.primaryColor || this.description.dapp.primaryColor,
      secondaryColor: this.description.secondaryColor || this.description.dapp.secondaryColor
    });
  }

  /**
   * Opens the contacts modal
   */
  show() {
    (<any>this.$refs.favoriteAddModal).show();
  }

  /**
   * Opens the contacts modal
   */
  close() {
    (<any>this.$refs.favoriteAddModal).hide();
  }
}
