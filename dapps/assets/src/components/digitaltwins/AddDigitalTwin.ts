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
import { cloneDeep } from 'lodash';
import { Prop } from 'vue-property-decorator';

// @evan imports
import { EvanComponent, DbcpFormComponentClass } from '@evan.network/ui-vue-core';
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
  dbcpComp: DbcpFormComponentClass = null;

  image = null;

  runtime: Runtime = null;

  selectedTemplate = 'carTwin';

  template = carTwin as DigitalTwinTemplateInterface;

  twinTemplates = { bicycleTwin, carTwin };

  presetTemplates = this.getTemplateSelectOptions({ bicycleTwin, carTwin });

  templateErrors: TemplateErrorInterface[] = [];

  clearTwinCreateWatcher: Function;

  @Prop() createdCallBack: Function;

  beforeDestroy(): void {
    this.clearTwinCreateWatcher();
  }

  // generate select options from twin templates
  handleTemplateSelectChange(): void {
    this.template = this.twinTemplates[this.selectedTemplate];
    this.setDefaults();
  }

  handleImageChange(ev: Event): void {
    this.image = ev;
  }

  loading = false;

  async created(): Promise<void> {
    this.runtime = this.getRuntime();
    /* TODO: maybe refactor it the "vue way"? ($emit and listen)
       Currently this is VERY convoluted with going into the dapp-wrapper even */
    this.clearTwinCreateWatcher = dispatchers.twinCreateDispatcher
      .watch(({ detail: { status } }: CustomEvent) => {
        if (status === 'starting') {
          this.closePanel();
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

  /**
   * Set empty fields from template and update current template by uploaded file.
   *
   * @param files
   */
  async handleFileUpload(files: UIContainerFile[]): Promise<void> {
    // get the uploaded file and directly remove it from the ui
    const uploaded = files.pop();

    // reset template errors
    this.templateErrors = [];

    // skip when file was deleted
    if (!uploaded) {
      return;
    }

    const rollBackTemplate = JSON.stringify(this.template);
    try {
      this.template = await AddDigitalTwinComponent.blobToObj(uploaded.blob) as DigitalTwinTemplateInterface;
      this.templateErrors = this.getTemplateErrorInterfaces(this.template);
    } catch (ex) {
      this.templateErrors = [{
        name: 'description',
        errors: [],
      }];
    }

    if (this.templateErrors.length > 0) {
      this.template = JSON.parse(rollBackTemplate);

      return;
    }

    this.setDefaults();
    this.addToPresetTemplates(this.template, uploaded.name);
    this.selectedTemplate = uploaded.name;

    // wait till template select component received new props
    (this.$refs.templateSelector as EvanComponent).$nextTick(this.$forceUpdate);
  }

  showPanel(): void {
    (this.$refs.addDigitalTwinPanel as any).show();
  }

  closePanel(): void {
    (this.$refs.addDigitalTwinPanel as any).hide();
  }

  addDigitalTwin(): void {
    // merge custom fields into template.
    this.loading = true;
    const template = cloneDeep(this.template) as DigitalTwinTemplateInterface;
    const dbcpFormValue = this.dbcpComp.getDescription();

    if (dbcpFormValue.description) {
      template.description.description = dbcpFormValue.description;
    }
    template.description.name = dbcpFormValue.name;
    delete template.description.i18n;

    dispatchers.twinCreateDispatcher.start(this.getRuntime(), {
      twinTemplate: template,
      twinImage: dbcpFormValue.imgSquare,
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
        reader.onload = (ev): void => {
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
  private addToPresetTemplates(template: DigitalTwinTemplateInterface, key: string): void {
    this.twinTemplates[key] = template;
    this.presetTemplates = this.getTemplateSelectOptions(this.twinTemplates);
  }

  private getTemplateSelectOptions(templates: Record<string, DigitalTwinTemplateInterface>): any {
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
    let localized = template.description?.[entry] || '';

    if (template.description?.i18n && template.description?.i18n[lang]?.[entry]) {
      localized = template.description?.i18n[lang]?.[entry];
    }

    return localized;
  }

  /**
   * Set name and description from twin template when not set before.
   */
  private setDefaults(): void {
    if (!this.dbcpComp.dbcpForm.name.value) {
      this.dbcpComp.dbcpForm.name.value = this.getLocalizedTemplateEntry(this.template, 'name');
    }

    if (!this.dbcpComp.dbcpForm.description.value) {
      this.dbcpComp.dbcpForm.description.value = this.getLocalizedTemplateEntry(this.template,
        'description');
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

    if (!template.plugins) {
      return TemplateErrorInterfaces;
    }

    Object.keys(template.plugins).forEach((pluginKey: string) => {
      const { description } = template.plugins[pluginKey];
      const errors = this.runtime.description.validateDescription({
        public: description,
      });

      if (!Array.isArray(errors) || errors.length === 0) {
        return;
      }

      TemplateErrorInterfaces.push({
        name: pluginKey,
        errors,
      });
    });

    return TemplateErrorInterfaces;
  }
}

export default AddDigitalTwinComponent;
