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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/

import * as bcc from '@evan.network/api-blockchain-core';
import { utils } from '@evan.network/digitaltwin.lib';

import * as fieldUtils from './fields';
import EntryComponent from './components/schema/entries/entry/entry';
import { UIContainerTemplateProperty } from './interfaces';


/**
 * Takes an entry and checks for type array. If it's an array, ensure, that the value array and an
 * addValue object is added. Per default, this values are not returned by the API, templates does
 * not support list entries export and must be load dynamically. The value array is used to handle
 * new arrays, that will be persisted for caching to the indexeddb like the normal entries
 *
 * @param      {UIContainerTemplateProperty}  entry   the entry that should be checked
 */
export function ensureValues(entry: UIContainerTemplateProperty) {
  // use calculated type!
  const type = fieldUtils.getType(entry.dataSchema);

  entry.edit = (<any>entry.edit || {
    dataSchema: bcc.lodash.cloneDeep(entry.dataSchema)
  });

  // set default value
  entry.value = entry.value || fieldUtils.defaultValue(type);

  switch (type) {
    // add an empty value list and an addValue object, the addValue object is used for new
    case 'array': {
      entry.edit.value = entry.edit.value ||
        ensureValues(<any>{ dataSchema: entry.dataSchema.items }).value;
      break;
    }
    case 'object': {
      entry.edit.value = entry.edit.value || bcc.lodash.cloneDeep(entry.value);
      break;
    }
    case 'string': {
      entry.edit.value = entry.edit.value || entry.value;
      break;
    }
    case 'number': {
      entry.edit.value = entry.edit.value || entry.value;
      break;
    }
    case 'files': {
      entry.edit.value = entry.edit.value || {
        files: [ ].concat(entry.value.files)
      };
      break;
    }
  }

  return entry;
}

/**
 * Resets the schema of an data container entry.
 *
 * @param      {UIContainerTemplateProperty}  entry   entry for that the dataSchema should be
 *                                                    resetted
 */
export function resetSchema(entry: UIContainerTemplateProperty) {
  entry.edit.dataSchema = bcc.lodash.cloneDeep(entry.dataSchema);
}

/**
 * Reset the edit value of the entry to the original one.
 *
 * @param      {Vue}                          vueInstance  vue component instance
 * @param      {UIContainerTemplateProperty}  entry        entry for that the edit.value should be
 *                                                         resetted
 */
export function resetValue(vueInstance: any, entry: UIContainerTemplateProperty) {
  // use calculated type!
  const type = fieldUtils.getType(entry.dataSchema);

  // use the correct data schema
  resetSchema(entry);

  switch (type) {
    case 'object': {
      entry.edit.value = bcc.lodash.cloneDeep(entry.value);
      break;
    }
    case 'string': {
      entry.edit.value = entry.value;
      break;
    }
    case 'number': {
      entry.edit.value = entry.value;
      break;
    }
    case 'files': {
      entry.edit.value = {
        files: [ ].concat(entry.value.files)
      };
      break;
    }
  }
}

/**
 * Save the schema of an data container entry.
 *
 * @param      {UIContainerTemplateProperty}  entry   entry, for that the entry.edit.dataSchema
 *                                                    should be used.
 */
export function saveSchema(entry: UIContainerTemplateProperty) {
  entry.dataSchema = bcc.lodash.cloneDeep(entry.edit.dataSchema);
}

/**
 * Use the current edit value and save it into the value.
 *
 * @param      {Vue}                          vueInstance  vue component instance
 * @param      {UIContainerTemplateProperty}  entry        entry for that the edit.value should be
 *                                                         saved
 */
export function saveValue(vueInstance: any, entry: UIContainerTemplateProperty) {
  // use calculated type!
  const type = fieldUtils.getType(entry.dataSchema);

  // use the correct data schema
  saveSchema(entry);

  // lookup values
  switch (type) {
    case 'array': {
      // apply the new value into the array, and clear the old add value
      entry.value.unshift(entry.edit.value);
      entry.edit.value = null;

      // ensure the new empty edit.value
      ensureValues(entry);

      break;
    }
    case 'object': {
      entry.value = bcc.lodash.cloneDeep(entry.edit.value);
      break;
    }
    default: {
      entry.value = fieldUtils.parseFieldValue(type, entry.edit.value);
      entry.edit.value = entry.value;
    }
  }

  // enable save
  utils.enableDTSave();
}
