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

import EntryComponent from './components/entries/entry/entry';
import * as utils from './utils';
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
  entry.edit = (<any>entry.edit || {
    dataSchema: JSON.parse(JSON.stringify(entry.dataSchema))
  });

  switch (entry.dataSchema.type) {
    // add an empty value list and an addValue object, the addValue object is used for new
    case 'array': {
      entry.value = entry.value || [ ];
      entry.edit.value = entry.edit.value ||
        ensureValues(<any>{ dataSchema: { type: entry.dataSchema.items.type } }).value;
      break;
    }
    case 'object': {
      entry.value = entry.value || { };
      entry.edit.value = entry.edit.value || JSON.parse(JSON.stringify(entry.value));
      break;
    }
    case 'string': {
      entry.value = entry.value || '';
      entry.edit.value = entry.edit.value || entry.value;
      break;
    }
    case 'number': {
      entry.value = entry.value || 0;
      entry.edit.value = entry.edit.value || entry.value;
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
  entry.edit.dataSchema = JSON.parse(JSON.stringify(entry.dataSchema));
}

/**
 * Reset the edit value of the entry to the original one.
 *
 * @param      {Vue}                          vueInstance  vue component instance
 * @param      {UIContainerTemplateProperty}  entry        entry for that the edit.value should be
 *                                                         resetted
 */
export function resetValue(vueInstance: any, entry: UIContainerTemplateProperty) {
  // use the correct data schema
  resetSchema(entry);

  switch (entry.dataSchema.type) {
    // add an empty value list and an addValue object, the addValue object is used for new
    case 'array': {
      // we do not need to do anything, value save is handled by the component it self
      vueInstance.$set(vueInstance.entry, 'mode', 'view');
      break;
    }
    case 'object': {
      // in schema mode, jump to edit mode and do not reset the value
      if (vueInstance.entry.mode === 'schema') {
        vueInstance.$set(vueInstance.entry, 'mode', 'edit');
      } else {
        // in edit mode reset the value and go to view mode
        entry.edit.value = JSON.parse(JSON.stringify(entry.value));
        vueInstance.$set(vueInstance.entry, 'mode', 'view');
      }
      break;
    }
    case 'string': {
      entry.edit.value = entry.value;
      vueInstance.$set(vueInstance.entry, 'mode', 'view');
      break;
    }
    case 'number': {
      entry.edit.value = entry.value;
      vueInstance.$set(vueInstance.entry, 'mode', 'view');
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
  entry.dataSchema = JSON.parse(JSON.stringify(entry.edit.dataSchema));
}

/**
 * Use the current edit value and save it into the value.
 *
 * @param      {Vue}                          vueInstance  vue component instance
 * @param      {UIContainerTemplateProperty}  entry        entry for that the edit.value should be
 *                                                         saved
 */
export function saveValue(vueInstance: any, entry: UIContainerTemplateProperty) {
  // use the correct data schema
  saveSchema(entry);

  // lookup values
  switch (entry.dataSchema.type) {
    case 'array': {
      // apply the new value into the array, and clear the old add value
      entry.value.unshift(entry.edit.value);
      entry.edit.value = null;

      // ensure the new empty edit.value
      ensureValues(entry);

      break;
    }
    case 'object': {
      entry.value = JSON.parse(JSON.stringify(entry.edit.value));
      break;
    }
    case 'string': {
      entry.value = entry.edit.value;
      break;
    }
    case 'number': {
      entry.value = entry.edit.value;
      break;
    }
  }

  // go back to view mode
  vueInstance.$set(vueInstance.entry, 'mode', 'view');

  // enable save
  utils.enableDTSave();
}
