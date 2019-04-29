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

/**
 * Detect file schemas
 */
export function detectFileSchemas(subSchema: any, callback: Function) {
  const usesEnryption = (schema) => {
    if (schema.type === 'files') {
      return true;
    } else if (schema.type === 'string' && schema.$comment) {
      try {
        return JSON.parse(schema.$comment).isEncryptedFile;
      } catch (ex) {
        // ignore non-JSON comments
      }
    }
    return false;
  };

  if (usesEnryption(subSchema)) {
    // simple entry
    return callback(subSchema);
  } else if (subSchema.type === 'array' && usesEnryption(subSchema.items)) {
    // list/array with entries
    return callback(subSchema);
  } else {
    // check if nested
    if (subSchema.type === 'array') {
      return this.detectFileSchemas(subSchema.items, callback);
    } else if (subSchema.type === 'object') {
      // check objects subproperties
      const transformed = {};
      for (let key of Object.keys(subSchema.properties)) {
        transformed[key] = this.detectFileSchemas(subSchema.properties[key], callback);
      }
      return transformed;
    }
    // no encryption required
    return subSchema;
  }
}

/**
 * Transformations that should be runned, before the template can be saved (e.g. cleanup, correct
 * file schemas).
 *
 * @param      {any}  schema  ajv dataSchema
 */
export function getSaveTemplate(schema: any) {
  return detectFileSchemas(schema, (subSchema: any) => {
    schema.type = 'string';
    schema.$comment = bcc.Container.defaultSchemas.filesEntry.$comment;
  });
}

/**
 * Transforms a usal ajv schema into a ui template schema (e.g. to use easy usable file entries)
 *
 * @param      {any}  schema  ajv dataSchema
 */
export function getUITemplate(schema: any) {
  return detectFileSchemas(schema, (subSchema: any) => {
    schema.type = 'files';
  });
}
