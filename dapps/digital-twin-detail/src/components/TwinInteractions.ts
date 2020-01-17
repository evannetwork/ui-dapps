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
import { dispatchers } from '@evan.network/digital-twin-lib';
import { downloadObject } from '@evan.network/ui';
import { EvanComponent, DbcpFormComponentClass, SwipePanelComponentClass } from '@evan.network/ui-vue-core';


@Component
export default class DigitalTwinInteractionsComponent extends mixins(EvanComponent) {
  /**
   * Show loading symbol
   */
  duplicating = false;
  exporting = false;

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

  /**
   * Creates a duplicated twin from the current definition.
   */
  async createTwinDuplicate(): Promise<void> {
    this.duplicating = true;
    
    const description: any = this.dbcpForm.getDescription();
    const imqSquare = description.imgSquare;
    delete description.imqSquare;
    // start twin duplicate dispatcher
    await dispatchers.twinCreateDispatcher.start(
      this.getRuntime(),
      {
        description,
        twinImage: imqSquare,
        twinTemplate: this.$store.state.twin.contractAddress,
      }
    );

    this.duplicating = false;
  }

  /**
   * Open the duplicate twin sidepanel.
   */
  duplicateTwin(): void {
    this.duplicatePanel.show();
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
  async exportTemplate(showModal = true): Promise<void> {
    showModal && this.exportModal.show();

    if (!this.exportedTemplate) {
      this.exporting = true;
      this.exportedTemplate = await this.$store.state.twin.exportAsTemplate();
      this.exporting = false;
    }
  }
}
