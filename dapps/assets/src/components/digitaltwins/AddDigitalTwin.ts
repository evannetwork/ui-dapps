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
import { ContainerPlugin, Runtime } from '@evan.network/api-blockchain-core';
import { dispatchers } from '@evan.network/digital-twin-lib';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { Prop } from 'vue-property-decorator';
import { UIContainerFile } from '@evan.network/ui';

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
      };
    };
    name: string;
  };
  plugins: { [pluginName: string]: ContainerPlugin };
}

interface ValidationError {
  dataPath: string;
  keyword: string;
  message: string;
  params: any;
  schemaPath: string;
}

interface TemplateError {
  name: string;
  errors: ValidationError[];
}

@Component
class AddDigitalTwinComponent extends mixins(EvanComponent) {
  description: string = null;
  image = null;
  name: string = null;
  runtime: Runtime = null;
  selectedTemplate = 'carTwin';
  template = carTwin as DigitalTwinTemplate;
  twinTemplates = { bicycleTwin, carTwin };
  presetTemplates = this._getTemplateSelectOptions();
  templateErrors: any[] = [];

  @Prop() createdCallBack: Function;

  // generate select options from twin templates
  handleTemplateSelectChange(event: Event) {
    this.selectedTemplate = (event.target as HTMLInputElement).value;
    this.template = this.twinTemplates[this.selectedTemplate];
    this._setDefaults();
  }

  handleImageChange(ev: Event) {
    this.image = ev;
  }

  loading = false;

  async created() {
    console.log(typeof this.createdCallBack);
    this.runtime = await this.getRuntime();
    dispatchers.twinCreateDispatcher.watch( ({detail: { status }}: CustomEvent) => {
      if (status === 'running') {
        this.resetForm();
        this.loading = false;
      }

      if (status === 'error') {
        alert('There was a problem creating the twin. Please check your config and try again.');

        this.loading = false;
      }

      if (status === 'finished' && typeof this.createdCallBack === 'function') {
        console.log('cretaed cb');
        this.createdCallBack();
      }
    });
  }

  resetForm() {
    this.description = null;
    this.image = null;
    this.name = null;
    this.selectedTemplate = 'carTwin';
    this.template = carTwin as DigitalTwinTemplate;
    this.templateErrors = [];
  }

  /**
   * Set empty fields from template and update current template by uploaded file.
   *
   * @param files
   */
  async handleFileUpload (files: UIContainerFile[]) {
    this.templateErrors = [];
    // skip when file was deleted
    if (!files[0]) {

      return;
    }

    const rollBackTemplate = JSON.stringify(this.template);
    this.template = await this._blobToObj(files[0].blob) as DigitalTwinTemplate;

    this.templateErrors = this._getTemplateErrors(this.template);

    if (this.templateErrors.length > 0) {
      this.template = JSON.parse(rollBackTemplate);

      return;
    }

    this._setDefaults();
    this._addToPresetTemplates(this.template, files[0].name);
    this.selectedTemplate = files[0].name;

    // wait till template select component received new props
    (this.$refs.templateSelector as EvanComponent).$nextTick(this.$forceUpdate);
  }

  showPanel() {
    (this.$refs.addDigitalTwinPanel as any).show();
  }

  closePanel() {
    (this.$refs.addDigitalTwinPanel as any).hide();
  }

  addDigitalTwin() {
    // merge custom fields into template.
    this.loading = true;
    const template = Object.assign({}, this.template) as any; // TODO: use twin template interface

    if (this.description) {
      template.description.description = this.description;
    }
    template.description.name = this.name;
    delete template.description.i18n;

    dispatchers.twinCreateDispatcher
      .start(this.getRuntime(), {twinTemplate: template, twinImage: this.image } );
  }

  /**
   * Converts Blob representing JSON file into an JS Object.
   *
   * @param blob
   */
  _blobToObj(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      try {
        reader.onload = (ev) => {
          resolve(JSON.parse(ev.target.result as string));
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

  _getTemplateErrors(template: any): TemplateError[] {
    const templateErrors = [];
    const validationResult = this.runtime.description.validateDescription({public: template.description});

    if (Array.isArray(validationResult)) {
      templateErrors.push({
        name: 'description',
        errors: validationResult
      });
    }
    Object.keys(template.plugins).forEach((pluginKey: string) => {
      const { description } = template.plugins[pluginKey];
      const errors = this.runtime.description.validateDescription({public: description});

      if (Array.isArray(errors) && errors.length > 0) {
        templateErrors.push({
          name: pluginKey,
          errors
        });
      }
    });

    return templateErrors;
  }
}

export default AddDigitalTwinComponent;
