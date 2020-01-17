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
import { Prop } from 'vue-property-decorator';

// @evan imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { UIContainerFile } from '@evan.network/ui';
import {
  Runtime,
  DigitalTwinTemplate as DigitalTwinTemplateInterface,
} from '@evan.network/api-blockchain-core';
import {
  dispatchers,
  TemplateErrorInterface,
} from '@evan.network/digital-twin-lib';

// load twin template
import bicycleTwin from './templates/bicycle.json';
import carTwin from './templates/car.json';

@Component
class AddDigitalTwinComponent extends mixins(EvanComponent) {
  description: string = null;

  image = null;

  name: string = null;

  runtime: Runtime = null;

  selectedTemplate = 'carTwin';

  template = carTwin as DigitalTwinTemplateInterface;

  twinTemplates = { bicycleTwin, carTwin };

  presetTemplates = this.getTemplateSelectOptions({ bicycleTwin, carTwin });

  templateErrors: TemplateErrorInterface[] = [];

  @Prop() createdCallBack: Function;

  // generate select options from twin templates
  handleTemplateSelectChange(event: Event) {
    this.selectedTemplate = (event.target as HTMLInputElement).value;
    this.template = this.twinTemplates[this.selectedTemplate];
    this.setDefaults();
  }

  handleImageChange(ev: Event) {
    this.image = ev;
  }

  loading = false;

  async created() {
    this.runtime = await this.getRuntime();
    dispatchers.twinCreateDispatcher.watch(({ detail: { status } }: CustomEvent) => {
      if (status === 'starting') {
        this.resetForm();
        this.loading = false;

        this.$toasted.show(
          this.$t('_assets.digitaltwins.create-info'),
          {
            type: 'info',
            duration: 10000, // 10 seconds
          },
        );
      }

      if (status === 'error') {
        alert('There was a problem creating the twin. Please check your config and try again.');

        this.loading = false;
      }

      if (status === 'finished' && typeof this.createdCallBack === 'function') {
        this.createdCallBack();
      }
    });
  }

  resetForm() {
    this.description = null;
    this.image = null;
    this.name = null;
    this.selectedTemplate = 'carTwin';
    this.template = carTwin as DigitalTwinTemplateInterface;
    this.templateErrors = [];
  }

  /**
   * Set empty fields from template and update current template by uploaded file.
   *
   * @param files
   */
  async handleFileUpload(files: UIContainerFile[]) {
    this.templateErrors = [];
    // skip when file was deleted
    if (!files[0]) {
      return;
    }

    const rollBackTemplate = JSON.stringify(this.template);
    this.template = await AddDigitalTwinComponent.blobToObj(files[0].blob) as DigitalTwinTemplateInterface;

    this.templateErrors = this.getTemplateErrorInterfaces(this.template);

    if (this.templateErrors.length > 0) {
      this.template = JSON.parse(rollBackTemplate);

      return;
    }

    this.setDefaults();
    this.addToPresetTemplates(this.template, files[0].name);
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
    const template = ({ ...this.template }) as DigitalTwinTemplateInterface;

    if (this.description) {
      template.description.description = this.description;
    }
    template.description.name = this.name;
    delete template.description.i18n;

    dispatchers.twinCreateDispatcher.start(this.getRuntime(), {
      twinTemplate: template,
      twinImage: this.image,
    });
  }

  /**
   * Converts Blob representing JSON file into an JS Object.
   *
   * @param blob
   */
  private static blobToObj(blob: Blob): Promise<any> {
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
  private addToPresetTemplates(template: DigitalTwinTemplateInterface, key: string) {
    this.twinTemplates[key] = template;
    this.presetTemplates = this.getTemplateSelectOptions(this.twinTemplates);
  }

  private getTemplateSelectOptions(templates: Record<string, DigitalTwinTemplateInterface>) {
    return Object.keys(templates).map((twinKey) => ({
      value: twinKey,
      label: this.getLocalizedTemplateEntry(templates[twinKey], 'name'),
    }));
  }

  /**
   * Returns localized string from template or general if not found.
   *
   * @param template
   */
  private getLocalizedTemplateEntry(template: DigitalTwinTemplateInterface, entry: string): string {
    const lang = this.$i18n.locale() || window.localStorage.getItem('evan-language');

    return (
      template.description?.i18n[lang]?.[entry]
      || template.description?.[entry]
      || ''
    );
  }

  /**
   * Set name and description from twin template when not set before.
   */
  private setDefaults() {
    if (!this.name) {
      this.name = this.getLocalizedTemplateEntry(this.template, 'name');
    }

    if (!this.description) {
      this.description = this.getLocalizedTemplateEntry(this.template, 'description');
    }
  }

  private getTemplateErrorInterfaces(template: DigitalTwinTemplateInterface): TemplateErrorInterface[] {
    const TemplateErrorInterfaces = [];
    const validationResult = this.runtime.description.validateDescription({ public: template.description });

    if (Array.isArray(validationResult)) {
      TemplateErrorInterfaces.push({
        name: 'description',
        errors: validationResult,
      });
    }

    Object.keys(template.plugins).forEach((pluginKey: string) => {
      const { description } = template.plugins[pluginKey];
      const errors = this.runtime.description.validateDescription({
        public: description,
      });

      if (Array.isArray(errors) && errors.length > 0) {
        TemplateErrorInterfaces.push({
          name: pluginKey,
          errors,
        });
      }
    });

    return TemplateErrorInterfaces;
  }
}

export default AddDigitalTwinComponent;
