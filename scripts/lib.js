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

const exec = require('child_process').exec;
const path = require('path');
const { lstatSync, readdirSync } = require('fs');

const scriptsFolder = process.cwd();
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source).map(name => path.join(source, name)).filter(isDirectory);
const nodeEnv = process.argv.indexOf('--prod') !== -1 ?'production' :
  process.env.NODE_ENV || 'development';

/**
 * Executes and console command
 *
 * @param      {string}       command            command to execute
 * @param      {string}       runtimeFolder      path for runtime folder
 * @return     {Promise<any}  resolved when command is finished
 */
async function runExec(command, runtimeFolder) {
  return new Promise((resolve, reject) => {
    exec(
      `NODE_ENV=${ nodeEnv } ${ command }`,
      { cwd: runtimeFolder, NODE_ENV: nodeEnv },
      async (err, stdout, stderr) => {
        if (err) {
          let errMessage = `Error occured while running command: ${ command }\n\n`;
          if (stdout) {
            errMessage += `stdout\n======\n${ stdout.replace(/^/gm, '    ') }`;
          }
          if (stderr) {
            errMessage += `stderr\n======\n${ stderr.replace(/^/gm, '    ') }`;
          }

          reject(errMessage);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

/**
 * Return the process arguments as an object
 *
 * @param      {Array<any>}  [argList=process.argv]  list of arguments, defaults to process.argv
 * @return     {any}         object, with argument names as property keys
 */
function getArgs(argList = process.argv) {
  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    } else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }

  return arg;
}

module.exports = {
  getArgs,
  getDirectories,
  isDirectory,
  nodeEnv,
  runExec,
  scriptsFolder,
}