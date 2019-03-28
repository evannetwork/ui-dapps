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


import { System, dapp, queue, getDomainName } from '@evan.network/ui-dapp-browser';

import EvanQueue from './Queue';

/**
 * Handles batched data processing.
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
  price: string;

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
   * Dynamic watch for dispatcher updates within a dapp.
   *
   * @param      {string}  dappEns  Original dapp ens address
   * @param      {string}  name     Technical exported class member of the dispatcher within the dapp.
   * @param      {any}     func     Function that should be called
   */
  static watch(func: any, dappEns = '*', name = '*') {
    document.removeEventListener(`evan-queue-${ dappEns }-${ name }`, func);

    // return the watch remove function
    return () => document.removeEventListener(`evan-queue-${ dappEns }-${ name }`, func);
  }

  constructor(dappEns: string, name: string, price: number, title?: string) {
    this.dappEns = dappEns;
    this.name = name;
    this.title = title || name;
    this.id = dappEns + name;
  }

  /**
   * Get the current running instances.
   */
  async getQueueWithInstances(runtime: any): Promise<any> {
    if (!this.queues[runtime.activeAccount]) {
      // create a new queue and initialize it
      const queue = await new EvanQueue(runtime.activeAccount);
      await queue.initialize();

      // recover all previous running instances for this dispatcher
      const instances = Object.keys(queue.entries)
        .map((entryKey: string) => {
          const entry = queue.entries[entryKey];

          if (entry.dispatcher.dappEns === this.dappEns && entry.dispatcher.name === this.name) {
            const instance = new DispatcherInstance(queue, this, runtime, entry.data);

            instance.error = entry.error;
            instance.status = entry.status;
            instance.stepIndex = entry.stepIndex;

            return instance;
          }
        })
        .filter(instance => !!instance);

      // set the queues cache
      this.queues[runtime.activeAccount] = { queue, instances, };
    }

    // return the queue and the instances
    return this.queues[runtime.activeAccount];
  }

  /**
   * Gets the instances.
   *
   * @param      {any}  runtime  The runtime
   */
  async getInstances(runtime: any): Promise<Array<DispatcherInstance>> {
    return (await this.getQueueWithInstances(runtime)).instances;
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
   * @param      {boolean}   isStartup  Should this step runned at the beginning every time?
   */
  step(stepFunc: Function, isStartup: boolean) {
    this.steps.push(stepFunc);

    return this;
  }

  /**
   * Starts this dispatcher with an specific runtime, an data object at an specific point.
   *
   * @param      {any}     runtime    bcc runtime
   * @param      {any}     data       data object
   * @param      {number}  stepIndex  at which step should be started?
   */
  async start(runtime: any, data: any, stepIndex = 0) {
    const queueWithInstances = await this.getQueueWithInstances(runtime);
    const instance = new DispatcherInstance(queueWithInstances.queue, this, runtime, data,
      stepIndex);
    
    // add the instance into the instances array and watch for updates
    const clearWatcher = this.watch((event) => {
      if (event.detail.status === 'finished') {
        delete queueWithInstances.instances[instance.id];
        clearWatcher();
      }
    });

    // load all instances for this dispatcher and push the new one
    queueWithInstances.instances[instance.id] = instance;

    // start the instance!
    await instance.startup();
    await instance.run();
  }

  /**
   * Watch for instance updates
   *
   * @param      {Function}  func    function that should be called on an update
   */
  watch(func: any) {
    document.addEventListener(`evan-queue-${ this.dappEns }-${ this.name }`, func);

    // return the watch remove function
    return () => document.removeEventListener(`evan-queue-${ this.dappEns }-${ this.name }`, func);
  }
}

/**
 * Instance for an dispatcher
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
  runtime: any;

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
  _status: any;

  /**
   * Error message.
   */
  error: any;

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
  };

  constructor(queue: EvanQueue, dispatcher: Dispatcher, runtime: any, data: any, stepIndex = 0,
    id = Date.now() + Math.round(Math.random() * 1000000)) {
    this.data = data;
    this.dispatcher = dispatcher;
    this.id = id;
    this.queue = queue;
    this.runtime = runtime;
    this.stepIndex = stepIndex;
  }

  /**
   * Run all the startup functions.
   */
  async startup() {
    this.status = 'startup';
    await this.dispatcher.startupSteps.forEach(startup => startup.call(this));
  }

  /**
   * Run the next step in the queue and persist the data.
   */
  async run() {
    if (this.stepIndex < this.dispatcher.steps.length) {
      this.status = 'running';

      try {
        // run the next step
        await (this.dispatcher.steps[this.stepIndex].call(this));

        // increase the stepIndex
        this.stepIndex += 1;
      } catch (ex) {
        this.error = `${ ex.message } (${ ex.stack })`;
        this.status = 'error';

        this.runtime.logger.log(ex, 'error');
      }

      await this.save();

      if (this.status !== 'error') {
        await this.run();
      }
    } else {
      this.status = 'finished';
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
    ].forEach((eventName) =>
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: {
          dispatcher: this.dispatcher,
          instance: this,
          status: status,
        }
      }))
    );
  }

  /**
   * Take the current data and saves it into the queue db.
   */
  async save() {
    await this.queue.save(this.dispatcher.id, this.id, {
      data: this.data,
      dispatcher: {
        dappEns: this.dispatcher.dappEns,
        name: this.dispatcher.name,
      },
      error: this.error,
      status: this.status,
      stepIndex: this.stepIndex
    });
  }

  /**
   * Set the status to finished and remove the queue entry data.
   */
  async finish() {
    this.status = 'finished';
    this.queue.save(this.dispatcher.id, this.id);
  }
}
