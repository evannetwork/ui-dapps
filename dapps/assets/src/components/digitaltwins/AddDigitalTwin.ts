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
import { EvanComponent } from '@evan.network/ui-vue-core';

// load twin templates
import bicycleTwin from './templates/bicycle.json';
import carTwin from './templates/car.json';

@Component
class AddDigitalTwinComponent extends mixins(EvanComponent) {
  name: string = null;
  desc: string = null;
  template = null;
  image = null;
  presetTemplates = [
    {
      label: this.$t('_assets.digitaltwins.bike'),
      value: 'bike',
      content: bicycleTwin
    },
    {
      label: this.$t('_assets.digitaltwins.car'),
      value: 'car',
      content: carTwin
    }
  ];

  handleTemplateSelectChange(event: Event) {
    this.template = (<HTMLInputElement>event.target).value;

    console.log(this.template);
  }

  handleImageChange(ev: Event) {
    this.image = ev;
  }

  /**
   * Converts Blob representing JSON file into an JS Object.
   *
   * @param blob
   */
  _blobToObj(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      try {
        reader.onload = (ev) => {
          resolve(JSON.parse(<string>ev.target.result));
        };

        reader.readAsText(blob);
      } catch (err) {
        reject(err);
      }
    });
  }

  async handleFileUpload (ev: Event) {
    const schema = await this._blobToObj(ev[0].blob);

    console.log(schema);
  }

  showPanel() {
    (this.$refs.addDigitalTwinPanel as any).show();
  }

  closePanel() {
    (this.$refs.addDigitalTwinPanel as any).hide();
  }

  addDigitalTwin(ev: Event) {
    console.log(ev);
  }
}

export default AddDigitalTwinComponent;
