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

export interface UIContainerFile extends bcc.ContainerFile {
  /**
   * The file size in bytes
   */
  size?: number;

  /**
   * Size parsed to kb, md, ...
   */
  readableSize?: string;

  // downloadable url
  blobUri: string;
  blob: Blob;
}

/**
 * Takes an usual File object (e.g. File from HTML 5 file input) and transforms it into an
 * blockchain-core understandable file.
 *
 * @param      {File}  file    html 5 input result file
 */
export async function fileToContainerFile(
  file: any,
): Promise<UIContainerFile> {
  // use html 5 files and already saved files whit another structure
  const fileOrigin = file.file ? file.file : file;
  const type = file.type || file.fileType;

  // use the correct url creator, search for the correct buffer object and create a blob and blob
  // uri
  const urlCreator = (<any>window).URL || (<any>window).webkitURL;
  const buffer = fileOrigin.buffer ? fileOrigin.buffer : await readFileAsArrayBuffer(fileOrigin);
  const blob = new Blob([ buffer ], { type });

  return {
    blob: blob,
    blobUri: urlCreator.createObjectURL(blob),
    file: buffer,
    fileType: type,
    name: file.name,
    readableSize: getReadableFileSize(file.size),
    size: file.size,
  };
}

/**
 * Upload a file that were selected with an HTML 5 <input type="file"> selector or using
 * the evan-file-select component and transforms them into an encryption object
 *
 * @param      {Array<any>}    files    array of files
 * @return     {Promise<any>}  uploaded files transformed into an encryption object
 */
export async function readFileAsArrayBuffer(file: File): Promise<any> {
  if (file instanceof ArrayBuffer) {
    return file;
  } else {
    return await new Promise(resolve => {
      const fileReader = new FileReader();

      // when the file was loaded successfully, return the uploaded file
      fileReader.onloadend = ($event: any) => resolve($event.target.result);

      // start file reading
      fileReader.readAsArrayBuffer(file);
    });
  }
}


/**
 * Parse the file size to a human readable format
 *
 * @param      {number}  size    size in B
 * @return     {string}  XXX KB / XXX MB
 */
export function getReadableFileSize(size: number) {
  if ((size / 1000000) > 1) {
    return `${ (size / 1000000).toFixed(2) } MB`;
  } else if ((size / 1000) > 1) {
    return `${ (size / 1000).toFixed(2) } KB`;
  } else {
    return `${ size.toFixed(2) }B`;
  }
}
