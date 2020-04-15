
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

/**
 * This is an adaption of `vuex-shared-mutations` localStorage strategy.
 * The modification allows shared mutation in the same window, e.g. for multiple
 * instances of the store in the same page, like in micro frontends.
 * It uses the better compatible local storage API.
 *
 * @see: https://github.com/xanf/vuex-shared-mutations/blob/master/src/strategies/localStorage.js
 */
const DEFAULT_KEY = 'vuex-shared-mutations';
const globalObj = (typeof window !== 'undefined'
  ? window
  : global) as any;

const MAX_LENGTH = 4 * 1024; // max message length
let messageCounter = 1;

function splitMessage(message): string[] {
  const partsCount = Math.ceil(message.length / MAX_LENGTH);

  return Array.from({ length: partsCount }).map((_, idx) => message.substr(idx * MAX_LENGTH, MAX_LENGTH));
}

interface Options {
  window?: Window;
  localStorage?: any;
  key?: string;
}

export default class LocalStorageStrategy {
  uniqueId: string = null;

  messageBuffer = [];

  window = null;

  storage = null;

  options: Options = {};

  eventName: 'vuex-updated-event';

  constructor(options: Options = {}) {
    const windowImpl = options.window || globalObj.window;
    const localStorageImpl = options.localStorage || globalObj.localStorage;
    if (
      !LocalStorageStrategy.available({
        window: windowImpl,
        localStorage: localStorageImpl,
      })
    ) {
      throw new Error('Strategy unavailable');
    }

    this.uniqueId = `${Date.now()}-${Math.random()}`;
    this.messageBuffer = [];
    this.window = windowImpl;
    this.storage = localStorageImpl;
    this.options = {
      key: DEFAULT_KEY,
      ...options,
    };
  }

  /**
   * Check whether localStorage is available and can be used.
   *
   * @param param0
   */
  static available(
    { window: windowImpl, localStorage: localStorageImpl } = {
      window: globalObj?.window,
      localStorage: globalObj?.localStorage,
    },
  ): boolean {
    if (!windowImpl || !localStorageImpl) {
      return false;
    }

    try {
      localStorageImpl.setItem('vuex-shared-mutations-test-key', Date.now());
      localStorageImpl.removeItem('vuex-shared-mutations-test-key');
      return true;
    } catch (e) {
      return false;
    }
  }

  handleEvent(event: StorageEvent, fn: Function): boolean {
    if (!event.newValue) {
      return false;
    }

    // handle only our storage events
    if (!event.key.includes('##') || event.key.split('##')[0] !== this.options.key) {
      return false;
    }

    const message = this.window.JSON.parse(event.newValue);
    if (message.author === this.uniqueId) {
      return false;
    }

    this.messageBuffer.push(message.messagePart);

    if (this.messageBuffer.length === message.total) {
      const mutation = this.window.JSON.parse(this.messageBuffer.join(''));
      this.messageBuffer = [];
      fn(mutation);
    }
    return true;
  }

  /**
   * Listen to updated vuex states.
   *
   * Handles both: Our synthetic custom StorageEvent and the native StorageEvent, so we receive the
   * events also on the same window.
   *
   * @param fn
   */
  addEventListener(fn: Function): boolean {
    this.window.addEventListener(this.eventName, (e: StorageEvent) => this.handleEvent(e, fn));
    return this.window.addEventListener('storage', (e: StorageEvent) => this.handleEvent(e, fn));
  }

  /**
   * This function is called when a shared key shall be updated.
   *
   * @param message
   */
  share(message: object): void {
    const rawMessage = this.window.JSON.stringify(message);
    const messageParts = splitMessage(rawMessage);
    messageParts.forEach((m, idx) => {
      messageCounter += 1;
      const key = `${this.options.key}##${idx}`;

      const payload = JSON.stringify({
        author: this.uniqueId,
        part: idx,
        total: messageParts.length,
        messagePart: m,
        messageCounter,
      });
      this.storage.setItem(
        key,
        payload,
      );

      // manually dispatch event so it also gets fired in same window, since storage Events do fire only on other window
      dispatchEvent(new StorageEvent(this.eventName, {
        newValue: payload,
        key,
      }));

      this.storage.removeItem(key);
    });
  }
}
