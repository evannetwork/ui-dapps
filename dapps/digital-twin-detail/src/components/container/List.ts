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
import { EvanComponent } from '@evan.network/ui-vue-core';
import { DAppContainer } from '@evan.network/digital-twin-lib';
import { ListSchema } from './DataSchemaInterface';

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

  schema: ListSchema;

  value: any[];

  container: DAppContainer;

  columns: string[];

  created(): void {
    this.container = this.$store.state.container;
    const { dispatcherData, plugin, entries } = this.container;
    this.schema = plugin.template.properties[this.name].dataSchema;
    this.value = dispatcherData[this.name] || entries[this.name];
    this.columns = ContainerListComponent.getColumns(this.value);
  }

  /**
   * Transforms table cell into desired a readable output
   * @param value input from table
   * @param key object key
   */
  transformValuesForDisplay(value, key?: string): string {
    if (typeof value === 'object') {
      if (ContainerListComponent.isFileList(value)) {
        return this.getFilesDisplay(value);
      }
      // "recursive" call on 1st level of the object
      if (key) {
        return this.transformValuesForDisplay(value[key]);
      }
    }
    // display primitives and unknown objects
    return JSON.stringify(value);
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

  static isFileList(input: string | number | FileList): input is FileList {
    return Object.keys(input).includes('files');
  }

  /**
   * Generates dynamic columns from array input
   * @param input data input
   */
  static getColumns(input: any[]): string[] {
    // Columns from object keys
    if (typeof input[0] === 'object') {
      return Object.keys(input[0]);
    }
    // Fallback for array with primitives
    return ['TODO generic list'];
  }
}
