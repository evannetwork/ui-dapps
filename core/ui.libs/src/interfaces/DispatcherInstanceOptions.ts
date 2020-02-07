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
