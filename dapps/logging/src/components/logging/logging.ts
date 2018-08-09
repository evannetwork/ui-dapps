/*
  Copyright (C) 2018-present evan GmbH. 
  
  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3, 
  as published by the Free Software Foundation. 
  
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details. 
  
  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the
  
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,
  
  or download the license from the following URL: https://evan.network/license/ 
  
  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network. 
  
  For more information, please contact evan GmbH at this address: https://evan.network/license/ 
*/

import {
  logLog,
  LogLevel
} from 'bcc';

import {
  Component, OnInit, OnDestroy, // @angular/core
  TranslateService,             // @ngx-translate/core
  NavController,                // ionic-angular
  ViewChild, Slides,
  AfterViewInit, ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanQueue,
  EvanAlertService,
  EvanToastService,
  EvanRoutingService,
  ObjectToArrayPipe,
  createOpacityTransition,
  EvanSlidesService,
  EvanUtilService,
  EvanTranslationService,
  EvanCoreService,
  EvanAddressBookService,
  EvanLoggingService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'logging',
  templateUrl: 'logging.html',
  animations: [
    createOpacityTransition()
  ]
})

export class LoggingComponent extends AsyncComponent {
  private logs: Array<any>;
  private logWatcher: any;
  private levels: any;
  private levelKeys: Array<string>;
  private activeLevels: any;
  private showFilters: boolean;
  private _LTracker: Array<any>;
  private logglyKey: string;

  constructor(
    private addressBookService: EvanAddressBookService,
    private coreService: EvanCoreService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
    private utils: EvanUtilService,
    private logging: EvanLoggingService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    // set log levels and filters
    this.levels = LogLevel;
    this.levelKeys = Object.keys(LogLevel).filter((level: any) => isNaN(level));
    this.activeLevels = { };
    this.levelKeys.forEach(logLevel => this.activeLevels[logLevel] = true);

    // set initial values
    this.filter();
    
    // watch for changes
    this.logWatcher = setInterval(() => this.filter(), 3000);
  }

  async _ngOnDestroy() {
    window.clearInterval(this.logWatcher);
  }

  /**
   * filter current log levels to handle bcc.logLogs and filter values
   */
  filter() {
    this.logs = this.logging
      .getLogsIncludingQueue()
      .filter(entry => this.activeLevels[entry.level])
      .sort((loga, logb) => logb.timestamp - loga.timestamp);

    this.ref.detectChanges();
  }

  /**
   * Enable filter showing
   */
  toggleFilters() {
    this.showFilters = !this.showFilters;

    this.ref.detectChanges();
  }

  /**
   * Logs a log entry to the console and copies it to the clipboard.
   */
  logSingleLog(log: any) {
    this.coreService.copyString(JSON.stringify(log, null, 2));

    console.log('evan.network logging: ')
    console.log(`  - timestamp: ${ log.timestamp }`);
    console.log(`  - level: ${ log.level }`);

    if (console[log.level]) {
      console[log.level](log.message);
    } else {
      console.log(log.message);
    }
  }

  /**
   * Clears all log messages.
   */
  clearLogs() {
    logLog.splice(0, logLog.length);
    this.filter();
  }
}
