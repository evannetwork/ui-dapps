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
const isArray = Array.isArray;
const keyList = Object.keys;
const hasProp = Object.prototype.hasOwnProperty;

// class names for file types that does not be checked for deep equal check
const fileTypes = [
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8Array,
  ArrayBuffer
];

/**
 * Deep equal for objects (https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js)
 *
 * @param      {any}     a          object a
 * @param      {any}     b          object b
 */
export function deepEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    // do not check equality for files, it will cause performance issues
    if (fileTypes.indexOf(a.constructor) !== -1) {
      return true;
    }

    let arrA = isArray(a)
      , arrB = isArray(b)
      , i
      , length
      , key;

    if (arrA && arrB) {
      length = a.length;
      if (length !== b.length) {
        return false;
      }

      for (i = length; i-- !== 0;) {
        if (!deepEqual(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    if (arrA !== arrB) {
      return false;
    }

    let dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA !== dateB) {
      return false;
    }

    if (dateA && dateB) {
      return a.getTime() === b.getTime();
    }

    let regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA !== regexpB) {
      return false;
    }
    if (regexpA && regexpB) {
      return a.toString() === b.toString();
    }

    let keys = keyList(a);
    length = keys.length;

    if (length !== keyList(b).length) {
      return false;
    }

    for (i = length; i-- !== 0;) {
      if (!hasProp.call(b, keys[i])) {
        return false;
      }
    }

    for (i = length; i-- !== 0;) {
      key = keys[i];
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  }

  return a !== a && b !== b;
}

/**
 * Lodash cloneDeep wrapper including ignoreFiles flag.
 *
 * @param      {any}  lodash       lodash instance
 * @param      {any}  obj          object that should be cloned
 * @param      {any}  ignoreFiles  should file entries be ignored?
 */
export function cloneDeep(lodash: any, obj: any, ignoreFiles = false) {
  if (ignoreFiles) {
    return lodash.cloneDeepWith(obj, (value: any) => {
      // value.__proto__.constructor.toString().indexOf('Buffer') !== -1
      if (value && (value._isBuffer || fileTypes.indexOf(value.constructor) !== -1)) {
        return value;
      }
    });
  } else {
    return lodash.cloneDeep(obj);
  }
}
