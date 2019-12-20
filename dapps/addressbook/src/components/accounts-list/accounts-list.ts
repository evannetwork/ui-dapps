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

import {
  getDomainName
} from '@evan.network/ui-dapp-browser';

import {
  Component, OnInit, OnDestroy,      // @angular/core
  NavController,                     // ionic-angular
  TranslateService,                  // @ngx-translate/core
  ChangeDetectorRef
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanMailboxService,
  EvanModalService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
  EvanUtilService,
  QueueId,
  TrustDialogComponent,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'accounts-list',
  templateUrl: 'accounts-list.html',
  animations: [
    createOpacityTransition()
  ]
})

export class AccountListComponent extends AsyncComponent {
  public loading: boolean;
  private accounts: any;
  private groupedAccounts: any;
  private availableGroups: Array<string>;
  private myAccount: string;
  private clearQueue : Function;

  /**
   * current selected selection value for creating new contacts
   */
  private createSelectValue: string;

  /**
   * uncollapsed groups
   */
  private hiddenGroups: any = { };

  /**
   * current active group for displaying contacs of
   */
  private activeGroup: string;

  /**
   * Function to unsubscribe from profile verifications watcher queue results.
   */
  private profileVerificationsWatcher: Function;

  /**
   * for the current profile activated verifications
   */
  private verifications: Array<string> = [ ];

  constructor(
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationsService: EvanVerificationService,
    private core: EvanCoreService,
    private modalService: EvanModalService,
    private queueService: EvanQueue,
    private ref: ChangeDetectorRef,
    private routing: EvanRoutingService,
    private translate: EvanTranslationService,
    private utils: EvanUtilService,
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.myAccount = this.core.activeAccount();
    this.groupedAccounts = { };
    this.availableGroups = [ ];

    this.clearQueue = await this.queueService
      .onQueueFinish(this.addressBookService.queueId, (reload) => {
        this.loadAccounts();
      });

    // load profile active verifications
    this.profileVerificationsWatcher = await this.queueService.onQueueFinish(
      new QueueId(`profile.${ getDomainName() }`, '*'),
      async (reload, results) => {
        reload && await this.core.utils.timeout(0);
        this.verifications = await this.verificationsService.getProfileActiveVerifications();
        this.ref.detectChanges();
      }
    );
  }

  async _ngOnDestroy() {
    this.clearQueue();
    this.profileVerificationsWatcher();
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
      let tags = [ this.translate.instant('_dappcontacts.all') ];

      // if defined, use the given ones
      if (contact.tags) {
        tags = tags.concat(contact.tags);
      }

      // lowercase everything, so we can use correct grouping
      tags.forEach(tag => {
        let id = tag.toLowerCase();

        this.groupedAccounts[id] = this.groupedAccounts[id] || {
          groupName: tag,
          contacts: [ ]
        };

        this.groupedAccounts[id].contacts.push(accountKeys[i]);
      });
    }

    this.availableGroups = Object
      .keys(this.groupedAccounts)
      .map(group => {
        this.groupedAccounts[group].contacts = this.groupedAccounts[group].contacts.sort((a, b) => {
          if (this.accounts[a].alias > this.accounts[b].alias) {
            return 1;
          } else {
            return -1;
          }
        });

        return group;
      })
      .sort((a: any, b: any) => a < b ? -1 : 1);

    if (this.availableGroups.length > 0 && 
        (!this.activeGroup || this.availableGroups.indexOf(this.activeGroup) === -1)) {
      this.activeGroup = this.availableGroups[0];
    }

    this.detectTimeout();
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

  /**
   * Navigates to the specific create contact page
   *
   * @param      {string}  selected  the selected option
   */
  openCreate(selected: string) {
    if (this.createSelectValue) {
      if (this.createSelectValue === 'send-invitation-mail') {
        this.showOnboardingAgentDialog();
      } else {
        this.routing.navigate('./add-via-accountid');
      }

      setTimeout(() => {
        this.createSelectValue = '';
        this.ref.detectChanges();
      });
    }
  }

  async showOnboardingAgentDialog() {
    const smartAgentAccountId = '0x063fB42cCe4CA5448D69b4418cb89E663E71A139';
    const smartAgentCommKey = await this.bcc.profile.getContactKey(
      smartAgentAccountId,
      'commKey',
    );
    if (smartAgentCommKey) {
      this.routing.navigate('./add-via-mail');
    } else {
      try {
        await this.modalService.createModal(TrustDialogComponent, {
          smartAgentName: 'Onboarding Smart Agent',
          smartAgentRights: [
            'key-exchange',
            'mailbox-send'
          ],
          smartAgentDetails: {
            description: `
              The onboarding Smart Agent gives you the ability, to invite persons via Email and send
              them EVE\'s as seed money. They receive a custom Email with an invite link.
              You get a mailbox message with the onboarded user id and the new alias of the account
            `,
            verifiedBy: 'evan.network',
            verifiedAt: '28.02.2018',
            createdBy: 'evan.network',
            createdAt: '28.02.2018',
          },
          smartAgentAccountId: '0x063fB42cCe4CA5448D69b4418cb89E663E71A139',
          smartAgentTrustFn: async() => {
            const myAccountId = this.core.activeAccount();
            let profile = this.bcc.getProfileForAccount(smartAgentAccountId);
  
            const targetPubKey = await profile.getPublicKey();
            const commKey = await this.bcc.keyExchange.generateCommKey();
            await this.bcc.keyExchange.sendInvite(smartAgentAccountId, targetPubKey, commKey, {});
  
            // add key to profile
            await this.bcc.profile.addContactKey(
              smartAgentAccountId,
              'commKey',
              commKey
            );
            await this.bcc.profile.addProfileKey(
              smartAgentAccountId, 'alias', 'Email Smart Agent'
            );
            await this.bcc.profile.addProfileKey(
              smartAgentAccountId, 'tags', 'Smart Agent'
            );
  
            await this.bcc.profile.storeForAccount(this.bcc.profile.treeLabels.addressBook);
          }
        }, true);

        this.routing.navigate('./add-via-mail');
      } catch (ex) { }
    }
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }
}
