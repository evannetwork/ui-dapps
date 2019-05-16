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

import Vue from 'vue';
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';

/**
 * Return the easy type definition from a ajv schema (e.g. used to detect file fields).
 *
 * @param      {any}      subSchema   ajv sub schema
 * @param      {boolean}  firstLevel  only check the first level recursively
 * @return     {string}   The type.
 */
export function getType(subSchema: any, firstLevel = true): string {
  // check if it's a file
  if (subSchema.$comment) {
    let $comment;

    try {
      $comment = JSON.parse(subSchema.$comment);
    } catch (ex) { }

    if ($comment && $comment.isEncryptedFile) {
      return 'files';
    }
  }

  return subSchema.type;
}

/**
 * Get the default value for a field type.
 *
 * @param      {string}  type    field type (string, object, array, number, files)
 */
export function defaultValue(type: string) {
  switch (type) {
    // add an empty value list and an addValue object, the addValue object is used for new
    case 'array': {
      return [ ];
    }
    case 'object': {
      return { };
    }
    case 'string': {
      return '';
    }
    case 'number': {
      return 0;
    }
    case 'files': {
      return {
        files: [ ]
      };
    }
  }
}

/**
 * Validator functions for each field type.
 *
 * @param      {string}           type         field type (string, files, ...)
 * @param      {EvanFormControl}  field        from control for the field values
 * @param      {Vue}              vueInstance  original vue component instance
 * @param      {EvanForm}         form         parent form of the field
 */
export function validateField(
  type: string,
  field: EvanFormControl,
  vueInstance: Vue,
  form: EvanForm
) {
  switch (type) {
    case 'string': {
      return field.value &&
        field.value.trim().length !== 0;
    }
    case 'number': {
      return !isNaN(parseFloat(field.value));
    }
    case 'files': {
      return true;
    }
  }
};

/**
 * Validator functions for each field type.
 *
 * @param      {string}  type    field type (string, files, ...)
 * @param      {any}     value   value of the field
 */
export function parseFieldValue(
  type: string,
  value: any
) {
  switch (type) {
    case 'string': {
      return value.trim();
    }
    case 'number': {
      return parseFloat(value);
    }
    case 'files': {
      return value;
    }
  }
};

