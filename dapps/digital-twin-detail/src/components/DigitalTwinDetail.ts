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
import { DigitalTwinTemplate } from '@evan.network/api-blockchain-core';
import { DAppTwin, dispatchers } from '@evan.network/digital-twin-lib';
import { downloadObject } from '@evan.network/ui';
import { EvanComponent, DbcpFormComponentClass, SwipePanelComponentClass } from '@evan.network/ui-vue-core';


@Component
export default class DigitalTwinDetailComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  duplicating = false;
  exporting = false;
  loading = true;

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was load
   */
  hashChangeWatcher: any;

  /**
   * Template definition of the current twin.
   */
  exportedTemplate: DigitalTwinTemplate;

  /**
   * Element instances.
   */
  dbcpForm: DbcpFormComponentClass;
  duplicatePanel: SwipePanelComponentClass;
  exportModal: SwipePanelComponentClass;

  navItems = [
    {
      key: 'overview',
      icon: 'mdi mdi-view-dashboard-outline'
    },
    {
      key: 'data',
      icon: 'mdi mdi-file-document-box-outline'
    },
    {
      key: 'verifications',
      icon: 'mdi mdi-checkbox-marked-circle-outline'
    },
    {
      key: 'sharings',
      icon: 'mdi mdi-share-variant'
    },
    {
      key: 'did',
      icon: 'mdi mdi-identifier'
    }
  ].map(entry => {
    return {
      label: `_twin-detail.${entry.key}.${entry.key}-title`,
      icon: entry.icon,
      to: { name: entry.key }
    };
  });

  /**
   * Clear the hash change watcher
   */
  beforeDestroy(): void {
    // clear listeners
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
    this.$store.state.twin && this.$store.state.twin.stopWatchDispatchers();
  }

  /**
   * Creates a duplicated twin from the current definition.
   */
  async createTwinDuplicate(): Promise<void> {
    this.duplicating = true;
    
    const description: any = this.dbcpForm.getDescription();
    const imqSquare = description.imgSquare;
    delete description.imqSquare;
    // start twin duplicate dispatcher
    await dispatchers.twinCreateDispatcher
      .start(this.getRuntime(), {
        description,
        twinImage: imqSquare,
        twinTemplate: this.$store.state.twin.contractAddress,
      });

    this.duplicating = false;
  }

  /**
   * Go back to assets dapp.
   */
  close(): void {
    window.location.hash = `/${this.dapp.rootEns}/assets.${this.dapp.domainName}/digitaltwins`;
  }

  /**
   * Triggers the previously exported twin template.
   */
  downloadTwinTemplate(): void {
    downloadObject(this.$store.state.twin.description.name, this.exportedTemplate);
    this.exportModal.hide();
  }

  /**
   * Exports the current opened twin as templated and downloads it as a json file.
   */
  async exportTwinTemplate(showModal = true): Promise<void> {
    showModal && this.exportModal.show();

    if (!this.exportedTemplate) {
      this.exporting = true;
      this.exportedTemplate = await this.$store.state.twin.exportAsTemplate();
      this.exporting = false;
    }
  }

  /**
   * Setup digital twin functionalities.
   */
  async initialize(): Promise<void> {
    let beforeTwin;

    // watch for url changes and load different twin data
    this.hashChangeWatcher = async (): Promise<void> => {
      // only load another twin, when address has changed
      if (this.$route.params.twin && beforeTwin !== this.$route.params.twin) {
        beforeTwin = this.$route.params.twin;

        // show loading and remove old watchers
        this.loading = true;
        this.exportedTemplate = null;
        this.$store.state.twin && this.$store.state.twin.stopWatchDispatchers();

        // initialize a new twin, but keep old reference until twin is loaded
        const newTwin = new DAppTwin(this, this.getRuntime(), this.$route.params.twin);
        await newTwin.initialize();
        newTwin.watchDispatchers();

        // set new reference and hide loading
        this.$set(this.$store.state, 'twin', newTwin);
        this.loading = false;
      }
    };

    await this.hashChangeWatcher();
    // watch for hash changes, so the contract address can be simply replaced within the url
    window.addEventListener('hashchange', this.hashChangeWatcher);
  }
}
