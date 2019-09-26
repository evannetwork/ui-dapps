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
  ActivatedRoute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  FormBuilder,
  FormControl,
  FormGroup,
  Input,
  NavController,
  OnDestroy,
  OnInit,
  TranslateService,
  Validators,
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  createTabSlideTransition,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanMailboxService,
  EvanModalService,
  EvanQueue,
  EvanRoutingService,
  EvanTranslationService,
} from '@evan.network/ui-angular-core';

/**************************************************************************************************/

@Component({
  selector: 'account-detail',
  templateUrl: 'account-detail.html',
  animations: [
    createOpacityTransition(),
    createTabSlideTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AccountDetailComponent extends AsyncComponent {
  private accountId: string;
  private account: any;
  public loading: boolean;
  private loadingSave: boolean;
  private loadingDelete: boolean;
  private isCreate: boolean;
  private isMyAccount: boolean;
  private addressBook: any;
  private showStatus: boolean;
  private showMail: boolean;
  private showAccountId: boolean;
  private saving: boolean;
  private clearQueue: Function;
  private emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * is currently something saving?
   */
  private savingProfile: boolean;

  /**
   * current account form instance
   */
  @ViewChild('accountForm') accountForm: any;

  /**
   * current ion tag input component
   */
  @ViewChild('ionTagInput') ionTagInput: any;

  constructor(
    private translate: EvanTranslationService,
    private routing: EvanRoutingService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private addressBookService: EvanAddressBookService,
    private alertService: EvanAlertService,
    private mailboxService: EvanMailboxService,
    private core: EvanCoreService,
    private queueService: EvanQueue,
    private bcc: EvanBCCService,
    private modalService: EvanModalService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    const myAccountId = this.core.activeAccount();

    this.accountId = this.routing.getHashParam('id');
    this.isCreate = !this.accountId;
    this.isMyAccount = this.accountId === myAccountId;
    this.addressBook = { };

    this.clearQueue = await this.queueService
      .onQueueFinish(this.addressBookService.queueId, async (reload) => {
        await this.loadAddressBook();

        // check if currently something is saving
        this.savingProfile = this.queueService
          .getQueueEntry(this.addressBookService.queueId, true).data.length > 0;
        // update the ui, if the queue has finished saving
        reload && this.detectTimeout();
      });

    if ((window.location.hash.indexOf('add-via-mail') !== -1 && !this.isMyAccount) ||
        (this.account.profile && this.account.profile.email)) {
      this.showMail = true;
    }

    if (window.location.hash.indexOf('add-via-accountid') !== -1 ||
       (this.account.accountId && this.account.profile.email !== this.accountId)) {
      this.showAccountId = true;
    }

    if (this.showMail) {
      this.account.eves = 1;
    }

    // fill empty tags
    this.account.tags = this.account.tags || [ ];

    this.setTranslation();
    this.detectTimeout();
  }

  async _ngOnDestroy() {
    this.clearQueue();
  }

  async setTranslation() {
    await this.core.utils.timeout(0);

    if (!this.isCreate) {
      const activeRouteName = this.routing.getDAppNameFromCurrRoutePath();
      let alias = '';
      let email = '';

      if (this.account.alias) {
        alias = this.account.alias;
      }

      if (this.account.email) {
        email = this.account.value;
      }

      this.translate.addSingleTranslation(
        activeRouteName,
        alias ||
        email ||
        activeRouteName
      );
    }
  }

  /**
   * Load current displayed account and all accounts that are added to the current address book.
   */
  async loadAddressBook() {
    this.loading = true;
    this.addressBook = Object.assign({}, await this.addressBookService.loadAccounts() || {});
    this.account = this.addressBook[this.accountId];

    if (!this.account) {
      this.account = {};
    }

    if (!this.account.profile) {
      this.account.profile = {};
    }

    this.account.accountId = this.accountId;

    // set translation for account id in dashboard header
    if (this.isMyAccount && !this.account.alias) {
      this.translate.addSingleTranslation(
        this.accountId,
        this.translate.instant('_dappcontacts.me')
      );
    } else {
      this.translate.addSingleTranslation(
        this.accountId,
        this.account.alias ? this.account.alias : this.accountId
      );
    }

    this.loading = false;
  }

  /**
   * Adds the current formdata to the address book queue.
   *
   * @param formData   Current data from this.accountForm.value
   */
  async saveProfile(formData, $event) {
    // don't save when pressing enter to submit
    if ($event.x === 0 && $event.y === 0) {
      return;
    }


    if (!this.saving) {
      this.saving = true;

      try {
        let mail: any;

        if (this.isCreate) {
          // check for enough eve to invite user
          const balance = await this.core.getBalance();
          if (balance < (parseFloat(formData.eves) + 0.5)) {
            try {
              this
                .alertService.showSubmitAlert(
                  '_dappcontacts.alert.eve-missing',
                  '_dappcontacts.alert.eve-missing-description',
                  'submit'
                );
            } catch (ex) { }

            this.saving = false;
            return;
          }

          // check if profile for the account exists
          if (formData.accountId) {
            const profile = this.bcc.getProfileForAccount(formData.accountId);
            const exists = await profile.exists();

            if (!exists) {
              try {
                this
                  .alertService.showSubmitAlert(
                    '_dappcontacts.alert.profile-missing',
                    '_dappcontacts.alert.profile-missing-description',
                    'submit'
                  );
              } catch (ex) { }

              this.saving = false;
              return;
            }
          }

          mail = await this.mailboxService
            .showMailModal(
              this.modalService,
              '_dappcontacts.invitation-message',
              '_dappcontacts.invitation-message-long',
              '_dappcontacts.invitation-text.title',
              '_dappcontacts.invitation-text.body',
            );
        }

        formData.accountId = formData.accountId || this.accountId || formData.email;

        // if the input of the ion tags are not empty, the user does not recognize to use the enter
        // button => we are such user friendly, so keep it!
        if (this.ionTagInput && this.ionTagInput._editTag.length > 0) {
          formData.tags.push(this.ionTagInput._editTag);
        }

        this.addressBookService.addContactToQueue(formData.accountId, {
          isCreate: this.isCreate,
          mail: mail,
          profile: formData,
          sendMailInvitation: window.location.hash.indexOf('add-via-mail') !== -1,
        });

        if (this.isMyAccount) {
          this.core.utils.sendEvent('evan-username-updated');
        }
        
        this.routing.goBack();
      } catch (ex) { }

      this.saving = false;
    }
  }

  /**
   * Adds an contact remove queue data entry to the queue.
   *
   */
  async deleteProfile() {
    return this
      .alertService.showSubmitAlert(
        '_dappcontacts.alert.remove-title',
        '_dappcontacts.alert.remove-description',
        'cancel',
        'submit'
      )
      .then(() => {
        this.addressBookService.addRemoveContactToQueue(this.accountId, this.account.profile);

        this.routing.goBack();
      })
      .catch(() => { });
  }

  /**
   * Run detectChanges directly and after and timeout again, to update select fields.
   */
  detectTimeout() {
    this.ref.detectChanges();

    setTimeout(() => this.ref.detectChanges());
  }

  /**
   * Checks if a form property is touched and invalid.
   *
   * @param      {string}   paramName  name of the form property that should be checked
   * @return     {boolean}  true if touched and invalid, else false
   */
  showError(paramName: string) {
    if (this.accountForm && this.accountForm.controls[paramName]) {
      return this.accountForm.controls[paramName].invalid &&
        this.accountForm.controls[paramName].touched;
    }
  }

  /**
   * Check if a correct account id was inserted.
   *
   * @param      {string}   accountId  the account id to check
   * @return     {boolean}  True if account identifier valid, False otherwise.
   */
  isAccountIdValid(accountId: string) {
    return !this.isCreate || (this.isCreate && 
      accountId && this.bcc.web3.utils.isAddress(accountId) &&
      accountId !== this.core.activeAccount() &&
      !this.addressBook.hasOwnProperty(accountId));
  }
}
