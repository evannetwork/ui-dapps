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
  Component, OnInit, OnDestroy,      // @angular/core
  NavController,                     // ionic-angular
  TranslateService,                  // @ngx-translate/core
  ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanAddressBookService,
  createOpacityTransition,
  EvanAlertService,
  EvanCoreService,
  EvanUtilService,
  EvanQueue,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'accounts-list',
  templateUrl: 'accounts-list.html',
  animations: [
    createOpacityTransition()
  ]
})

export class AccountListComponent extends AsyncComponent {
  private loading: boolean;
  private accounts: any;
  private groupedAccounts: any;
  private availableLetters: Array<string>;
  private myAccount: string;
  private clearQueue : Function;

  constructor(
    public addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private core: EvanCoreService,
    private queueService: EvanQueue,
    private utils: EvanUtilService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.myAccount = this.core.activeAccount();
    this.groupedAccounts = { };
    this.availableLetters = [ ];

    this.clearQueue = await this.queueService
      .onQueueFinish(this.addressBookService.queueId, (reload) => {
        this.loadAccounts();
      });
  }

  async _ngOnDestroy() {
    this.clearQueue();
  }

  /**
   * Load accounts from the address book service.
   */
  async loadAccounts() {
    this.loading = true;

    this.ref.detectChanges();
    this.accounts = await this.addressBookService.loadAccounts() || {};

    this.filter();

    this.loading = false;

    this.ref.detectChanges();
  }

  /**
   * Filter current displayed account keys for the input value.
   *
   * @param  $event  Search input event to get input value
   */
  filter($event?: any) {
    let value = '';
    let accountKeys = [ ];

    if ($event) {
      value = $event.target.value || '';
    }

    accountKeys = Object
      .keys(this.accounts)
      .filter(accountKey => {
        if (!this.accounts[accountKey] || accountKey == 'keys' || accountKey == 'profile') {
          return false;
        } else {
          return accountKey.indexOf(value) !== -1 ||
            JSON
              .stringify(this.accounts[accountKey])
              .toLowerCase()
              .includes(value.toLowerCase());
        }
      });

    // remove my self from address book
    const myAccountIndex = accountKeys.indexOf(this.myAccount);
    if (myAccountIndex !== -1) {
      accountKeys.splice(myAccountIndex, 1);
    }

    // group the accounts
    this.groupedAccounts = { };

    for (let i = 0; i < accountKeys.length; i++) {
      const contact = this.accounts[accountKeys[i]];
      
      let firstLetter = '*';

      if (contact.alias) {
        firstLetter = contact.alias[0].toUpperCase();
      }

      this.groupedAccounts[firstLetter] = this.groupedAccounts[firstLetter] || [ ];

      this.groupedAccounts[firstLetter].push(accountKeys[i]);
    }

    this.availableLetters = Object
      .keys(this.groupedAccounts)
      .sort();

    this.ref.detectChanges();
  }

  removeContact(accountId: string) {
    return this
      .alertService.showSubmitAlert(
        '_dappcontacts.alert.remove-title',
        '_dappcontacts.alert.remove-description',
        'cancel',
        'submit'
      )
      .then(() => {
        this.addressBookService.addRemoveContactToQueue(accountId, this.accounts[accountId]);

        this.loadAccounts();
      })
      .catch(() => { });
  }
}
