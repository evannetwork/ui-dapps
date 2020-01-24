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
import fastDeepEqual from 'fast-deep-equal/es6';

// class names for file types that does not be checked for deep equal check
const fileTypes = [
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8Array,
  ArrayBuffer,
];

/**
 * Deep equal for objects (https://github.com/epoberezkin/fast-deep-equal/blob/master/index.js)
 *
 * @param      {any}     a          object a
 * @param      {any}     b          object b
 */
export function deepEqual(a, b): boolean {
  // do not check equality for files, it will cause performance issues
  if (fileTypes.indexOf(a.constructor) !== -1) {
    return true;
  }

  return fastDeepEqual(a, b);
}

/**
 * Lodash cloneDeep wrapper including ignoreFiles flag.
 *
 * @param      {any}  lodash       lodash instance
 * @param      {any}  obj          object that should be cloned
 * @param      {any}  ignoreFiles  should file entries be ignored?
 */
export function cloneDeep(lodash: any, obj: any, ignoreFiles = false): any {
  if (ignoreFiles) {
    return lodash.cloneDeepWith(obj, (value: any) => {
      // eslint-disable-next-line no-underscore-dangle
      if (value && (value._isBuffer || fileTypes.indexOf(value.constructor) !== -1)) {
        return value;
      }

      return undefined;
    });
  }

  return lodash.cloneDeep(obj);
}

/**
 * Downloads a string as file.
 *
 * @param      {string}  fileName  file name to download the content to.
 * @param      {string}  contnt   content that should be placed within the file.
 */
export function downloadObject(fileName: string, content: any): void {
  const stringified = JSON.stringify(content, null, 2);
  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(stringified)}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', `${fileName}.json`);
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}
