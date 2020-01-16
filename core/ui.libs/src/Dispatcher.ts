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


import { System, dapp, queue, getDomainName, bccHelper } from '@evan.network/ui-dapp-browser';
import * as bcc from '@evan.network/api-blockchain-core';

import EvanQueue from './Queue';

/**
 * The Dispatcher handles batched data processing and saves the data within the EvanQueue. Within
 * the dispatcher, the several steps can be defined. From this, instances can be generated, that
 * will process the provided steps.
 *
 * @class      Dispatcher
 */
export class Dispatcher {
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
  startupSteps: Array<Function> = [ ];

  /**
   * List of step functions.
   */
  steps: Array<Function> = [ ];

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
  static watch(func: ($event: CustomEvent) => any, dappEns = '*', name = '*') {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${ dappEns }-${ name }`, watch);

    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${ dappEns }-${ name }`, watch);
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
    this.id = (`${ dappEns }|||${ name }`);
    this.gas = gas;
  }

  /**
   * Add a step, that should be runned every time at the begging and ignore the state.
   *
   * @param      {Function}  stepFunc   Function that should be called.
   */
  startup(stepFunc: Function) {
    this.startupSteps.push(stepFunc);

    return this;
  }

  /**
   * Adds a step into the step array
   *
   * @param      {Function}  stepFunc   Function that should be called.
   */
  step(stepFunc: Function) {
    this.steps.push(stepFunc);

    return this;
  }

  /**
   * Get the current running instances.
   *
   * @param      {bccRuntime}  runtime  bcc runtime
   * @param      {boolean}     asArray  should be the result an array?
   */
  async getInstances(runtime: bcc.Runtime, asArray = true): Promise<any> {
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
    } else {
      return Object.keys(instances).map((key) => instances[key]);
    }
  }

  /**
   * Starts this dispatcher with an specific runtime, an data object at an specific point.
   *
   * @param      {any}     runtime    bcc runtime
   * @param      {any}     data       Any option that should passed into the steps
   * @param      {number}  stepIndex  step index to start at
   * @param      {number}  price      The custom calculated price
   */
  async start(runtime: bcc.Runtime, data: any, stepIndex = 0, price?: number) {
    const uiCoreQueue = await new EvanQueue(runtime.activeAccount);

    // map the original dispatcher instance to the current one => other dapps can create a
    // dispatcher instance pointing to the original ens and can watch and start the dispatcher
    // without implementing the original logic
    const originalDispatcher = (await System.import(`${ this.dappEns }!dapp-content`))[this.name];
    if (originalDispatcher) {
      Object.keys(originalDispatcher).forEach(key => this[key] = originalDispatcher[key]);
    }

    const instance = new DispatcherInstance({
      queue: uiCoreQueue,
      dispatcher: this,
      runtime,
      data: data,
      stepIndex: stepIndex,
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
  watch(func: ($event: CustomEvent) => any) {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${ this.dappEns }-${ this.name }`, watch);
    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${ this.dappEns }-${ this.name }`, watch);
  }
}

interface DispatcherInstanceOptions {
  // Queue for the current runtime and dispatcher
  queue: EvanQueue;
  // Dispatcher that should be runned.
  dispatcher: Dispatcher;
  // A initialized bcc runtime.
  runtime: bcc.Runtime;
  // Data that should be passed to the steps
  data: any;
  // Active step.
  stepIndex?: number;
  // If the instance must be accepted, the eve price will be estimated and saved to this instance.
  customPrice?: number;
  // dispatcher runtime id
  id?: any;
  // Error message.
  error?: any;
}

/**
 * A DispatcherInstance is generated, when a Dispatcher was started. This instance runs the startup
 * and step functions and holds the data. Also it contains several status flags, which step is
 * currently running and it saves it's states and data into the queue.
 *
 * @class      DispatcherInstance
 */
export class DispatcherInstance {
  /**
   * Queue for the current runtime and dispatcher
   */
  queue: EvanQueue;

  /**
   * Dispatcher that should be runned.
   */
  dispatcher: Dispatcher;

  /**
   * A initialized bcc runtime.
   */
  runtime: bcc.Runtime;

  /**
   * Data that should be passed to the steps
   */
  data: any;

  /**
   * Active step.
   */
  stepIndex: number;

  /**
   * dispatcher runtime id
   */
  id: any;

  /**
   * Current running status
   */
  _status = 'stopped';

  /**
   * Error message.
   */
  error: any = false;

  /**
   * If the instance must be accepted, the eve price will be estimated and saved to this instance.
   */
  evePrice: number;

  /**
   * Custom applied eve price that will overwrite the dispatcher one
   */
  customEvePrice: number;

  /**
   * Set the current status.
   */
  set status(value) {
    this._status = value;
    this.triggerWatchers(value);
  }

  /**
   * Current status
   */
  get status() {
    return this._status;
  }

  constructor(options: DispatcherInstanceOptions) {
    this.data = options.data;
    this.dispatcher = options.dispatcher;
    this.id = options.id || Date.now() + Math.round(Math.random() * 1000000);
    this.queue = options.queue;
    this.runtime = options.runtime;
    this.stepIndex = options.stepIndex || 0;

    if (options.customPrice) {
      this.customEvePrice = options.customPrice;
    }

    if (options.error) {
      this.error = options.error;
      this._status = 'error';
    }
  }

  /**
   * Run the startup and run functions. If the evePrice is higher than the eve-treshold (0.5), it
   * will send an event that this transaction must be accepted, before it can be started.
   *
   * @param      {boolean}  accept  should the dispatcher started directly?
   */
  async start(accept?: boolean) {
    await this.save();

    // if the instance starts the first time and the price threshold is reached, ask for permissions
    if (!accept && this.stepIndex === 0) {
      // calculate the price
      const defaultThreshold = 0;
      const priceThreshold = parseFloat(window.location['dispatcher-eve-treshold'] || '0.5');
      let evePrice;

      // use default one or estimate the costs from dispatcher configuration
      if (this.customEvePrice) {
        evePrice = this.customEvePrice;
      } else {
        const gasPrice = parseInt(await (<any>this.runtime.signer).getGasPrice(), 16);
        this.evePrice = this.runtime.web3.utils.fromWei(gasPrice.toString());
      }

      if (this.evePrice > (isNaN(priceThreshold) ? defaultThreshold : priceThreshold)) {
        return this.status = 'accept';
      }
    }

    // reset previous errors
    this.error = null;

    await this.startup();
    this.status = 'running';
    await this.run();
  }

  /**
   * Run all the startup functions.
   */
  async startup() {
    this.status = 'starting';

    await Promise.all(this.dispatcher.startupSteps.map(startup => startup(this, this.data)));

    // save the queue data
    await this.save();
  }

  /**
   * Accept the dispatcher instance and start the synchronisation. Used to accept the eve-treshold
   */
  async accept() {
    await this.start(true);
  }

  /**
   * Run the next step in the queue and persist the data.
   */
  async run() {
    if (this.stepIndex < this.dispatcher.steps.length) {
      if (this.status === 'running') {
        try {
          // run the next step
          await this.dispatcher.steps[this.stepIndex](this, this.data);

          // increase the stepIndex
          this.stepIndex += 1;
          // trigger event again to update status
          this.status = 'running';
        } catch (ex) {
          this.error = `${ ex.message } (${ ex.stack })`;
          this.status = 'error';

          this.runtime.logger.log(ex, 'error');
        }

        // save the queue data
        await this.save();

        // if no error was applied, run the next step
        if (this.status !== 'error') {
          await this.run();
        }
      } else {
        // if the instance should be delete, remove it!
        if (this.status === 'deleting') {
          // else delete it directly
          await this.queue.save(this.dispatcher.id, this.id);
          this.status = 'deleted';
        } else {
          this.status = 'stopped';
        }
      }
    } else {
      this.finish();
    }
  }

  /**
   * Set the stopping status to break synchronisation at the next dispatcher status.
   */
  stop() {
    this.status = 'stopping';
  }

  /**
   * Stops the current synchronisation and deletes the instance from the queue.
   */
  async delete() {
    // if the queue is running, wait for finished and delete in their
    if (this.status === 'running') {
      this.status = 'deleting';
    } else {
      // else delete it directly
      await this.queue.save(this.dispatcher.id, this.id);
      this.status = 'deleted';
    }
  }

  /**
   * Run all watchers with an specific status
   */
  triggerWatchers(status: any) {
    [
      `evan-queue-*-*`,
      `evan-queue-${ this.dispatcher.dappEns }-*`,
      `evan-queue-${ this.dispatcher.dappEns }-${ this.dispatcher.name }`,
      `evan-queue-${ this.id }`,
    ].forEach((eventName) => this.sendEvent(eventName, status));
  }

  /**
   * Send an event with an status for this instance.
   *
   * @param      {string}  eventName  event name to trigger
   * @param      {any}     status     status that should be sent
   */
  sendEvent(eventName: string, status: any) {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        dispatcher: this.dispatcher,
        instance: this,
        status: status,
      }
    }));
  }

  /**
   * Take the current data and saves it into the queue db.
   */
  async save() {
    await this.queue.save(this.dispatcher.id, this.id, {
      data: this.data,
      error: this.error,
      status: this.status,
      stepIndex: this.stepIndex,
      customEvePrice: this.customEvePrice,
    });
  }

  /**
   * Set the status to finished and remove the queue entry data.
   */
  async finish() {
    await this.queue.save(this.dispatcher.id, this.id);
    this.status = 'finished';
  }

  /**
   * Watch for instance updates
   *
   * @param      {Function}  func    function that should be called on an update
   */
  watch(func: ($event: CustomEvent) => any) {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${ this.id }`, watch);

    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${ this.id }`, watch);
  }
}
