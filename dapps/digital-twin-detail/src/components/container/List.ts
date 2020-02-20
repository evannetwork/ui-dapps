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
import { Prop } from 'vue-property-decorator';
import { EvanComponent, EvanTableColumn } from '@evan.network/ui-vue-core';
import { DAppContainer } from '@evan.network/digital-twin-lib';
import { ListSchema } from './DataSchemaInterface';
import ShareContainerComponent from './ShareContainer';
import ListItemDetailComponent from './ListItemDetail';

interface FileList {
  files: File[];
}
interface File {
  file: Uint8Array;
  name: string;
  size: number;
}

@Component
export default class ContainerListComponent extends mixins(EvanComponent) {
  @Prop() name: string;

  @Prop({ default: false }) prohibited: boolean;

  schema: ListSchema;

  container: DAppContainer;

  columns: EvanTableColumn[];

  selectedValue = null;

  get isEditable(): boolean {
    return this.$store.state.container.permissions[this.name]?.readWrite;
  }

  static isFileList(input: string | number | FileList): input is FileList {
    return input && Object.keys(input).includes('files');
  }

  created(): void {
    this.container = this.$store.state.container;
    this.schema = this.container.plugin.template.properties[this.name].dataSchema;
    this.setColumns();
  }

  /**
   * Transforms table cell into desired a readable output
   * @param value input from table cell. Can be of type string, number, object or file list
   * @param key object key
   */
  transformValuesForDisplay(value, key?: string): string {
    // show null values as empty strings
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      if (ContainerListComponent.isFileList(value)) {
        return this.getFilesDisplay(value);
      }
      // "recursive" call on 1st level of the object
      if (key) {
        return this.transformValuesForDisplay(value[key]);
      }
    }

    // display unknown objects
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    // display primitives
    return value;
  }

  /**
   * Is the current entry in loading state and currently in dispatcher calculation?
   */
  isValueLoading(value: string): boolean {
    return (this.container.dispatcherData[this.name] || []).indexOf(value) !== -1;
  }

  /**
   * Formats a file list for display
   * @param fileList file list to be displayed
   */
  getFilesDisplay(fileList: FileList): string {
    return fileList.files.length === 1
      ? fileList.files[0].name
      : `${fileList.files.length} ${this.$t('_twin-detail.data.files')}`;
  }

  getValues(): any[] {
    return [
      ...(this.container.dispatcherData[this.name] || []),
      ...(this.container.entries[this.name] || []),
    ];
  }

  /**
   * Get the total number of list entries or `?` if we don't have access to the list.
   */
  getEntriesCount(): string {
    const total = this.container.listEntryCounts[this.name];
    const count = this.getValues().length;
    const maxPerPage = 30;

    if (total === undefined) {
      return null;
    }

    if (count === 0) {
      return this.$t('_twin-detail.data.list.no-entries');
    }

    if (total > maxPerPage) {
      return this.$t('_twin-detail.data.list.count-out-of-total', { count, total });
    }

    return this.$t('_twin-detail.data.list.count-entries', { count });
  }

  /**
   * Generates dynamic columns
   */
  setColumns(): void {
    const type = DAppContainer.getSchemaType(this.schema.items);
    const i18nScope = `${this.$route.params.container}.${this.name}`;
    const columns = [];

    switch (type) {
      case 'object': {
        Object.keys(this.schema.items.properties).forEach((key) => {
          columns.push({
            key,
            label: this.$t(`${i18nScope}.properties.${key}.label`, key),
            tdClass: 'truncate',
          });
        });
        break;
      }
      default: {
        columns.push({
          key: 'value',
          label: this.$t('_twin-detail.data.list.value'),
          tdClass: 'truncate',
        });
        break;
      }
    }

    columns.push({
      key: '__loading',
      label: '',
      tdClass: 'loading-cell',
    });

    this.columns = columns;
  }

  openDetail(item): void {
    this.selectedValue = item;

    (this.$refs.listItemDetail as ListItemDetailComponent).showPanel();
  }

  onShare(): void {
    (this.$refs.shareContainer as ShareContainerComponent).showPanel();
  }

  isProhibited(): boolean {
    if (this.$store.state.container.permissions[this.name]?.read === true) {
      return false;
    }

    if (this.$store.state.container.permissions[this.name]?.readWrite === true) {
      return false;
    }

    return true;
  }
}
