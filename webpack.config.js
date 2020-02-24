const path = require('path');
const { getDirectories } = require('./scripts/lib');

/**
 * Utilise parallel-webpack to run all builds in parallel.
 *
 * `yarn parallel-webpack`
 *
 * @see: https://github.com/trivago/parallel-webpack
 */

const dappCategories = [
  'core',
  'dapps',
  'libs',
  // 'evan-libs', // no webpack file :/
];

/**
 * Return the dapp dirs for a specific category.
 *
 * @param      {string}  category  category name (core, libs, dapps)
 */
const getCategoryDAppDirs = (category) => getDirectories(path.resolve(category));

const parallelWebpackConfig = [];

dappCategories.forEach((category) => {
  const dappDirs = getCategoryDAppDirs(category);

  dappDirs.forEach((dappDir) => {
    // eslint-disable-next-line
    const dbcp = require(`${dappDir}/dbcp.json`);
    // eslint-disable-next-line
    const dappWebPackConfig = require(`${dappDir}/webpack.config.js`);

    /* TODO: why actually in Dappbrowser node Module?
       TODO: copy afterwards
       const runtimeFolder = `node_modules/@evan.network/ui-dapp-browser/runtime/external/${dbcp.public.name}`; */


    parallelWebpackConfig.push(dappWebPackConfig);
  });
});

module.exports = parallelWebpackConfig;
