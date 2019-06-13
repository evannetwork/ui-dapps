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
  let type;

  // subSchema could be empty by trying to access array items schema on object or field schema
  if (subSchema) {
    // check if it's a file
    if (subSchema.$comment) {
      let $comment;

      try {
        $comment = JSON.parse(subSchema.$comment);
      } catch (ex) { }

      if ($comment && $comment.isEncryptedFile) {
        type = 'files';
      }
    } else {
      type = subSchema.type;
    }
  }

  return type;
}

/**
 * Get the default value for a field type.
 *
 * @param      {any}  subSchema  properties subSchema
 * @param      {any}  type       field type (string, object, array, number, files)
 */
export function defaultValue(subSchema: any) {
  const type = getType(subSchema);

  switch (type) {
    // add an empty value list and an addValue object, the addValue object is used for new
    case 'array': {
      return [ ]
    }
    case 'object': {
      const defaultReturn = { };

      Object.keys(subSchema).forEach(key => {
        if (subSchema[key].default) {
          defaultReturn[key] = subSchema[key].default;
        }
      });

      return defaultReturn;
    }
    case 'string': {
      return subSchema.default || '';
    }
    case 'number': {
      return typeof subSchema.default === 'undefined' ? 0 : subSchema.default;
    }
    case 'files': {
      return {
        files: [ ]
      };
    }
    case 'boolean': {
      return !!subSchema.default;
    }
  }
}

/**
 * Validator functions for each field type.
 *
 * @param      {string}           type     field type (string, files, ...)
 * @param      {EvanFormControl}  field    from control for the field values
 * @param      {any}              schema   schema including min and max specification
 * @param      {string}           address  container / plugin address
 * @param      {any}              $i18n    vue i18n object for translation error messages directly
 */
export function validateField(
  type: string,
  field: EvanFormControl,
  schema: any,
  address: string,
  $i18n: any,
) {
  if (!schema) {
    return true;
  } else {
    // allow empty values in plugins
    const emptyValues = address === 'plugin-create' ||
      (!address.startsWith('0x') && address !== 'dc-create');
    // do not use min value by using emptyValues
    const min = emptyValues ? '' : (schema[getMinPropertyName(type)] || '');
    const max = (schema[getMaxPropertyName(type)] || '');
    let valid;

    switch (type) {
      case 'string': {
        const value = field.value ? field.value.trim() : '';

        valid = (min === '' || value.length >= min) &&
                (max === '' || value.length <= max);
        break;
      }
      case 'number': {
        const value = parseFloat(field.value);

        valid = (!isNaN(value) || field.value.length === 0 && min === '') &&
                (min === '' || value >= min) &&
                (max === '' || value <= max);
        break;
      }
      case 'files': {
        const files = field.value.files;

        valid = (min === '' || files.length >= min) &&
                (max === '' || files.length <= max);
        break;
      }
      case 'boolean': {
        valid = true;
        break;
      }
    }

    // if valid, directly return it's valid
    if (valid) {
      return true;
    // else, calculate the error message
    } else {
      return $i18n.translate('_datacontainer.ajv.errors.text', {
        max: max !== '' ? max : $i18n.translate('_datacontainer.ajv.errors.missing-max'),
        min: min !== '' ? min : $i18n.translate('_datacontainer.ajv.errors.missing-min'),
        type,
      });
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
      return typeof value !== 'undefined' && value !== '' ? parseFloat(value) : value;
    }
    case 'files': {
      const converted = [ ];
      const allowedFileProperties = [ 'file', 'name', 'size', ];

      // remove remove blob and blobUri object from files
      value.files.forEach((file: any) => {
        const copy = { ...file };

        // only use Uint8Array's for correct deep equal check
        copy.file = new Uint8Array(copy.file);

        // remove runtime data
        Object.keys(copy).forEach(prop => {
          if (allowedFileProperties.indexOf(prop) === -1) {
            delete copy[prop];
          }
        });

        converted.push(copy);
      })

      return { files: converted };
    }
    default: {
      return value;
    }
  }
};

/**
 * Returns minimum property name by type.
 *
 * @param      {string}  type    type that should be checked
 */
export function getMinPropertyName(type: string) {
  switch (type) {
    case 'string': {
      return 'minLength';
    }
    case 'number': {
      return 'minimum';
    }
    case 'files': {
      return 'minItems';
    }
  }
}

/**
 * Returns minimum property name by type.
 *
 * @param      {string}  type    type that should be checked
 */
export function getMaxPropertyName(type: string) {
  switch (type) {
    case 'string': {
      return 'maxLength';
    }
    case 'number': {
      return 'maximum';
    }
    case 'files': {
      return 'maxItems';
    }
  }
}
