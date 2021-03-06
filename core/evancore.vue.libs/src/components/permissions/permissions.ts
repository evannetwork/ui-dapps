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

// evan.network imports
import { Prop } from 'vue-property-decorator';
import EvanComponent from '../../component';
import { PermissionsInterface } from '../../interfaces';


@Component({ })
class Permissions extends mixins(EvanComponent) {
  readAll = false;

  readWriteAll = false;

  /**
   * The contract id.
   */
  @Prop({
    default: '',
    required: true,
  }) contractId: string;

  /**
   * The permissions object.
   */
  @Prop({
    default: null,
    required: true,
  }) permissions: PermissionsInterface;

  /**
   * The i18n scope used for translations.
   */
  @Prop({
    default: '_evan',
  }) i18nScope: string;

  /**
   * An array of strings which is used to sort and filter the dataSet keys.
   */
  @Prop({
    default: null,
  }) sortFilter: string[];

  @Prop({}) updatePermissions: Function;

  created() {
    this.sortFilter = this.sortFilter === null ? Object.keys(this.permissions) : this.sortFilter;
    this.readAll = this.allPermissions('read');
    this.readWriteAll = this.allPermissions('readWrite');
  }

  /**
   * Check if readAll or writeAll needs to be (un)checked and execute callback function to update permissions.
   */
  updated() {
    this.sortFilter = this.sortFilter === null ? Object.keys(this.permissions) : this.sortFilter;
    this.readAll = this.allPermissions('read');
    this.readWriteAll = this.allPermissions('readWrite');
    this.updatePermissions({ contractId: this.contractId, permissions: this.permissions });
  }

  get computedSortFilter() {
    return this.sortFilter === null ? Object.keys(this.permissions) : this.sortFilter;
  }

  getPropertyFieldDescription(permissions, property: string): string {
    if (!permissions[property].fields) {
      return property;
    }

    return permissions[property].fields.map((field) => this.getTranslation(
      `${property}.properties.${field}.label`,
      `${property}.properties.${field}`,
      field,
    )).join(', ');
  }

  /**
   * Set all permissions in a contract at once.
   *
   * @param mode: 'read'|'readWrite'
   * @param flag: boolean
   */
  updateAll(mode: 'read'|'readWrite', flag: boolean) {
    this.sortFilter.forEach((property) => {
      this.permissions[property][mode] = flag;

      if (mode === 'read' && !flag) {
        this.permissions[property].readWrite = flag;
      } else if (mode === 'readWrite' && flag) {
        this.permissions[property].read = flag;
      }
    });
  }

  /**
   * Set read property and remove write property if read permission is removed.
   *
   * @param property: string - the name of the property within the contract
   * @param val: boolean - define wether the permission is given or not
   */
  setRead(property: string, val: boolean) {
    this.permissions[property].read = val;

    if (!val) {
      this.permissions[property].readWrite = val;
    }
  }

  /**
   * Set write property and add read property if write permission is given.
   *
   * @param property: string - the name of the property within the contract
   * @param val: boolean - define wether the permission is given or not
   */
  setReadWrite(property: string, val: boolean) {
    this.permissions[property].readWrite = val;

    if (val) {
      this.permissions[property].read = val;
    }
  }

  /**
   * Returns whether all permissions in a contract where checked for a certain access mode.
   *
   * @param mode: 'read'|'readWrite' - for which access mode
   * @param access: PermissionsInterface - The permissions object to check, default `this.permissions`
   */
  allPermissions(mode: 'read'|'readWrite', access = this.permissions): boolean {
    return this.sortFilter.every((key) => access[key][mode] === true);
  }

  /**
   * Return translation for a certain key and scope if set, otherwise only the key.
   *
   * @param      {string}  keys    takes multiple keys and try to translation them against to the
   *                               i18nScope. Last passed string will be used as default.
   * @return     {string}  translation
   */
  getTranslation(...keys: string[]): string {
    for (let i = 0; i < keys.length; i += 1) {
      const mergedKey = `${this.i18nScope}.${keys[i]}`;
      const translation = this.$t(mergedKey);
      if (translation !== mergedKey) {
        return translation;
      }
    }

    return keys[keys.length - 1];
  }
}

export default Permissions;
