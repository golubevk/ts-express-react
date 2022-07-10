/*******************************************************************************
 * @config.ts
 ******************************************************************************/

import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';
import base from './server-config/default';
import test from './server-config/test';
import prod from './server-config/production';

const { NODE_ENV } = process.env;

let realConfig = base;
realConfig.buildTime = Date.now();

const prodServerConfig = merge({}, base, prod);
const testServerConfig = merge({}, base, test);

if (NODE_ENV === 'production') {
  realConfig = prodServerConfig;
} else if (NODE_ENV === 'test') {
  realConfig = testServerConfig;
}

export default realConfig;
export const prodConfig = cloneDeep(prodServerConfig);
export const testConfig = cloneDeep(testServerConfig);
