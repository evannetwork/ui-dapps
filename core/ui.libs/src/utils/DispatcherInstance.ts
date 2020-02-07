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


import * as bcc from '@evan.network/api-blockchain-core';

import Dispatcher from './Dispatcher';
import EvanQueue from './Queue';
import { DispatcherInstanceOptions } from '../interfaces/DispatcherInstanceOptions';

/**
 * A DispatcherInstance is generated, when a Dispatcher was started. This instance runs the startup
 * and step functions and holds the data. Also it contains several status flags, which step is
 * currently running and it saves it's states and data into the queue.
 *
 * @class      DispatcherInstance
 */
export default class DispatcherInstance {
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
  internalStatus = 'stopped';

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
    this.internalStatus = value;
    this.triggerWatchers(value);
  }

  /**
   * Current status
   */
  get status(): string {
    return this.internalStatus;
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
      this.internalStatus = 'error';
    }
  }

  /**
   * Run the startup and run functions. If the evePrice is higher than the eve-treshold (0.5), it
   * will send an event that this transaction must be accepted, before it can be started.
   *
   * @param      {boolean}  accept  should the dispatcher started directly?
   */
  async start(accept?: boolean): Promise<string> {
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
        const gasPrice = parseInt(await this.runtime.signer.getGasPrice(), 16);
        this.evePrice = this.runtime.web3.utils.fromWei(gasPrice.toString());
      }

      if (this.evePrice > (Number.isNaN(priceThreshold) ? defaultThreshold : priceThreshold)) {
        this.status = 'accept';
        return this.status;
      }
    }

    // reset previous errors
    this.error = null;

    await this.startup();
    this.status = 'running';
    await this.run();

    return this.status;
  }

  /**
   * Run all the startup functions.
   */
  async startup(): Promise<void> {
    this.status = 'starting';

    await Promise.all(this.dispatcher.startupSteps.map((startup) => startup(this, this.data)));

    // save the queue data
    await this.save();
  }

  /**
   * Accept the dispatcher instance and start the synchronisation. Used to accept the eve-treshold
   */
  async accept(): Promise<void> {
    await this.start(true);
  }

  /**
   * Run the next step in the queue and persist the data.
   */
  async run(): Promise<void> {
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
          this.error = `${ex.message} (${ex.stack})`;
          this.status = 'error';

          this.runtime.logger.log(ex, 'error');
        }

        // save the queue data
        await this.save();

        // if no error was applied, run the next step
        if (this.status !== 'error') {
          await this.run();
        }
      // if the instance should be delete, remove it!
      } else if (this.status === 'deleting') {
        // else delete it directly
        await this.queue.save(this.dispatcher.id, this.id);
        this.status = 'deleted';
      } else {
        this.status = 'stopped';
      }
    } else {
      this.finish();
    }
  }

  /**
   * Set the stopping status to break synchronisation at the next dispatcher status.
   */
  stop(): void {
    this.status = 'stopping';
  }

  /**
   * Stops the current synchronisation and deletes the instance from the queue.
   */
  async delete(): Promise<void> {
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
  triggerWatchers(status: any): void {
    [
      'evan-queue-*-*',
      `evan-queue-${this.dispatcher.dappEns}-*`,
      `evan-queue-${this.dispatcher.dappEns}-${this.dispatcher.name}`,
      `evan-queue-${this.id}`,
    ].forEach((eventName) => this.sendEvent(eventName, status));
  }

  /**
   * Send an event with an status for this instance.
   *
   * @param      {string}  eventName  event name to trigger
   * @param      {any}     status     status that should be sent
   */
  sendEvent(eventName: string, status: any): void {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        dispatcher: this.dispatcher,
        instance: this,
        status,
      },
    }));
  }

  /**
   * Take the current data and saves it into the queue db.
   */
  async save(): Promise<void> {
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
  async finish(): Promise<void> {
    await this.queue.save(this.dispatcher.id, this.id);
    this.status = 'finished';
  }

  /**
   * Watch for instance updates
   *
   * @param      {Function}  func    function that should be called on an update
   */
  watch(func: ($event: CustomEvent) => any): Function {
    const watch = ($event: CustomEvent) => func($event);
    window.addEventListener(`evan-queue-${this.id}`, watch);

    // return the watch remove function
    return () => window.removeEventListener(`evan-queue-${this.id}`, watch);
  }
}
