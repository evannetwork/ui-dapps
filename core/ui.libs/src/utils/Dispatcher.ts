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


import { System } from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';

import DispatcherInstance from './DispatcherInstance';
import EvanQueue from './Queue';

/**
 * The Dispatcher handles batched data processing and saves the data within the EvanQueue. Within
 * the dispatcher, the several steps can be defined. From this, instances can be generated, that
 * will process the provided steps.
 *
 * @class      Dispatcher
 */
export default class Dispatcher {
  /**
   * Original dapp ens address.
   */
  dappEns: string;

  /**
   * Technical exported class member of the dispatcher within the dapp.
   */
  name: string;

  /**
   * Combination of dapp ens and the name
   */
  id: string;

  /**
   * I18N display key.
   */
  title: string;

  /**
   * estimated gas price for one full steps run.
   */
  gas: number;

  /**
   * estimated eve price for one full steps run.
   */
  evePrice: number;

  /**
   * Steps that should be runned everytime at synchrnisation beginning
   */
  startupSteps: Array<Function> = [];

  /**
   * List of step functions.
   */
  steps: Array<Function> = [];

  /**
   * Were the instances loaded before?
   */
  initialized = false;

  /**
   * Queue instances mapped to account id's and running dispatcher instances.
   */
  queues = { };

  /**
   * Dynamic watch for dispatcher updates within a dapp. Per default, it watches for everything.
   * Optional, other dapp ens addresses or dispatcher names can be listened.
   *
   * @param      {any}  func    callback function that should be called
   * @param      {string}  dappEns  ens address that should be watched
   * @param      {string}  name     dispatcher name that should be watched
   */
  static watch(func: ($event: CustomEvent) => any, dappEns = '*', name = '*'): Function {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${dappEns}-${name}`, watch);

    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${dappEns}-${name}`, watch);
  }

  /**
   * @param  {string} dappEns - Original dapp ens address.
   * @param  {string} name - Technical exported class member of the dispatcher within the dapp.
   * @param  {number} gas - estimated gas price for one full steps run.
   * @param  {string} title? - I18N display key.
   */
  constructor(dappEns: string, name: string, gas: number, title?: string) {
    this.dappEns = dappEns;
    this.name = name;
    this.title = title || name;
    this.id = (`${dappEns}|||${name}`);
    this.gas = gas;
  }

  /**
   * Add a step, that should be runned every time at the begging and ignore the state.
   *
   * @param      {Function}  stepFunc   Function that should be called.
   */
  startup(stepFunc: Function): Dispatcher {
    this.startupSteps.push(stepFunc);

    return this;
  }

  /**
   * Adds a step into the step array
   *
   * @param      {Function}  stepFunc   Function that should be called.
   */
  step(stepFunc: Function): Dispatcher {
    this.steps.push(stepFunc);

    return this;
  }

  /**
   * Get the current running instances.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   * @param      {boolean}     asArray  should be the result an array?
   */
  async getInstances(
    runtime: bcc.Runtime,
    asArray = true,
  ): Promise<DispatcherInstance[]|{[name: string]: DispatcherInstance}> {
    // create a new queue and initialize it
    const uiCoreQueue = await new EvanQueue(runtime.activeAccount);

    // recover all previous running instances for this dispatcher
    const entries = await uiCoreQueue.load(this.id);
    const instances = { };

    Object.keys(entries).forEach((instanceId: string) => {
      const entry = entries[instanceId];
      const instance = new DispatcherInstance({
        queue: uiCoreQueue,
        dispatcher: this,
        runtime,
        data: entry.data,
        stepIndex: entry.stepIndex,
        id: instanceId,
        error: entry.error,
        customPrice: entry.customPrice,
      });

      // add instance to instances
      instances[instance.id] = instance;
    });

    // return the queue and the instances
    if (!asArray) {
      return instances;
    }
    return Object.keys(instances).map((key) => instances[key]);
  }

  /**
   * Starts this dispatcher with an specific runtime, an data object at an specific point.
   *
   * @param      {any}     runtime    bcc runtime
   * @param      {any}     data       Any option that should passed into the steps
   * @param      {number}  stepIndex  step index to start at
   * @param      {number}  price      The custom calculated price
   */
  async start(runtime: bcc.Runtime, data: any, stepIndex = 0, price?: number): Promise<DispatcherInstance> {
    const uiCoreQueue = await new EvanQueue(runtime.activeAccount);

    /* map the original dispatcher instance to the current one => other dapps can create a
       dispatcher instance pointing to the original ens and can watch and start the dispatcher
       without implementing the original logic */
    const originalDispatcher = (await System.import(`${this.dappEns}!dapp-content`))[this.name];
    if (originalDispatcher) {
      Object.keys(originalDispatcher).forEach((key: string) => {
        this[key] = originalDispatcher[key];
      });
    }

    const instance = new DispatcherInstance({
      queue: uiCoreQueue,
      dispatcher: this,
      runtime,
      data,
      stepIndex,
    });

    // start the instance!
    await instance.start();

    return instance;
  }

  /**
   * Watch for instance updates
   *
   * @param      {Function}  func    function that should be called on an update
   */
  watch(func: ($event: CustomEvent) => any): Function {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${this.dappEns}-${this.name}`, watch);
    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${this.dappEns}-${this.name}`, watch);
  }
}
