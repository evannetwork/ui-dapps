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
import { EvanComponent } from '@evan.network/ui-vue-core';
import { UIContainerFile } from '@evan.network/ui';
import { ContainerPlugin } from '@evan.network/api-blockchain-core';

import createTwinDispatcher from '../dispatchers/createTwinDispatcher';
// load twin template
import bicycleTwin from './templates/bicycle.json';
import carTwin from './templates/car.json';

// TODO: get from common interfaces
interface DigitalTwinTemplate {
  description: {
    description?: string;
    i18n?: {
      [language: string]: {
        description?: string;
        name: string;
      }
    };
    name: string;
  };
  plugins: { [pluginName: string]: ContainerPlugin };
}

@Component
class AddDigitalTwinComponent extends mixins(EvanComponent) {
  description: string = null;
  image = null;
  name: string = null;
  runtime = null;
  selectedTemplate = 'carTwin';
  template = <DigitalTwinTemplate>carTwin;
  twinTemplates = { bicycleTwin, carTwin };
  presetTemplates = this._getTemplateSelectOptions();

  // generate select options from twin templates
  handleTemplateSelectChange(event: Event) {
    this.selectedTemplate = (<HTMLInputElement>event.target).value;
    this.template = this.twinTemplates[this.selectedTemplate];
    this._setDefaults();
  }

  handleImageChange(ev: Event) {
    this.image = ev;
  }

  async created() {
    this.runtime = await this.getRuntime(); // TODO: possible to do unblocking?
  }

  /**
   * Set empty fields from template and update current template by uploaded file.
   *
   * @param files
   */
  async handleFileUpload (files: UIContainerFile[]) {
    // skip when file was deleted
    if (!files[0]) {
      return;
    }

    this.template = await this._blobToObj(files[0].blob) as DigitalTwinTemplate;

    const valid = this.runtime.description.validateDescription(this.template);

    console.log(valid);

    this._setDefaults();
    this._addToPresetTemplates(this.template, files[0].name);
    this.selectedTemplate = files[0].name;

    // ugly hack to wait till underlying select component received new props
    window.setTimeout(() => this.$forceUpdate(), 200);
  }

  showPanel() {
    (this.$refs.addDigitalTwinPanel as any).show();
  }

  closePanel() {
    (this.$refs.addDigitalTwinPanel as any).hide();
  }

  addDigitalTwin() {
    // merge custom fields into template.
    const template = <any>Object.assign({}, this.template); // TODO: use twin template interface

    if (this.description) {
      template.description.description = this.description;
    }
    template.description.name = this.name;
    delete template.description.i18n;

    console.log('template', template);
    // TODO: dispatch with image and template

    createTwinDispatcher.start(this.getRuntime(), {twinTemplate: template, twinImage: this.image } );
  }

  /**
   * Converts Blob representing JSON file into an JS Object.
   *
   * @param blob
   */
  _blobToObj(blob: Blob): Promise<Object> {
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

  /**
   * Adds e new entry to the twin selection list.
   *
   * @param template - DigitalTwinTemplate
   * @param twinKey - unique key per template
   */
  _addToPresetTemplates(template: DigitalTwinTemplate, key: string) {
    this.twinTemplates[key] = template;
    this.presetTemplates = this._getTemplateSelectOptions();
  }

  _getTemplateSelectOptions() {
    return Object.keys(this.twinTemplates).map(twinKey => {
      return {
        value: twinKey,
        label: this._getLocalizedTemplateEntry(this.twinTemplates[twinKey], 'name'),
      };
    });
  }

  /**
   * Returns localized string from template or general if not found.
   *
   * @param template
   */
  _getLocalizedTemplateEntry(template: DigitalTwinTemplate, entry: string): string {
    const lang = this.$i18n.locale() || window.localStorage.getItem('evan-language');

    return template.description?.i18n[lang]?.[entry] || template.description?.[entry] || '';
  }

  /**
   * Set name and description from twin template when not set before.
   */
  _setDefaults() {
    if (!this.name) {
      this.name = this._getLocalizedTemplateEntry(this.template, 'name');
    }

    if (!this.description) {
      this.description = this._getLocalizedTemplateEntry(this.template, 'description');
    }
  }
}

export default AddDigitalTwinComponent;
