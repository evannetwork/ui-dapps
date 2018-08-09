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
  Component, OnInit,                   // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from 'angular-libs';

import {
  EvanAlertService,
  EvanUtilService,
  EvanBookmarkService,
  EvanRoutingService,
  createOpacityTransition,
  EvanQueue,
  EvanQrCodeService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'dapp-add',
  templateUrl: 'dapp-add.html',
  animations: [
    createOpacityTransition()
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DAppAddComponent extends AsyncComponent {
  private dappForm: FormGroup;
  private loading: boolean;
  private isMobile: boolean;
  private featuredDapps: Array<any> = [ ];
  private featuredLoading: boolean;
  private clearQueue: Function;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: EvanAlertService,
    private utils: EvanUtilService,
    private routing: EvanRoutingService,
    private bookmarkService: EvanBookmarkService,
    public _DomSanitizer: DomSanitizer,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private qrCodeService: EvanQrCodeService
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.isMobile = this.utils.isMobile();
    this.dappForm = this.formBuilder.group({
      ensAddress: ['', Validators.required ]
    });

    this.dappForm.valueChanges.subscribe(() => this.ref.detectChanges());

    this.loadFeatured();
    this.clearQueue = await this.queue
      .onQueueFinish(this.bookmarkService.queueId, (reload) => {
        this.bookmarkService.getDAppBookmarks(reload);
      });
    
    this.ref.detectChanges();
  }

  async _ngOnDestroy() {
    this.clearQueue();
  }

  loadFeatured(): void {
    this.featuredLoading = true;

    // load predefine dapps that should be available as suggestion
    this.bookmarkService
      .getBookmarkDefinitions([
        'taskboard',
        'uav',
        'explorer',
      ])
      .then(definitions => {
        this.featuredDapps = definitions;
        this.featuredLoading = false;

        this.ref.detectChanges();
      });
  };

  submitOnEnter(event: any) {
    if (event.keyCode === 13) {
      this.submit(this.dappForm.value.ensAddress);

      event.stopPropagation();
      return false;
    }
  }

  /**
   * Handle DApp loading.
   */
  submit(ensAddress) {
    let dapp;

    this.loading = true;
    this.bookmarkService
      .getBookmarkDefinition(ensAddress.toLowerCase())
      .then(definition => {
        dapp = definition;
        dapp.trimmedName = definition.name.replace(/\s/g, '');

        this.alertService.addDAppAlertStyle(dapp);

        switch (dapp.status) {
          case 'already_added': return this.alreadyAdded(dapp)
          case 'invalid': return this.showInvalid(dapp)
          case 'valid': {
            return this
              .showValid(dapp)
              .then(() => this.bookmarkService.queueAddBookmark(ensAddress.toLowerCase(), dapp))
              .then(() => this.routing.goBack())
              .catch(() => { });
          }
        }
      })
      .then(() => {
        this.alertService.removeDAppAlertStyle(dapp.name);

        this.loading = false
        this.ref.detectChanges();
      });
  }

  /**
   * Show dialog to check if the user want's to really add this DApp.
   *
   * @param dapp   Param object
   */
  showValid(dapp: any): Promise<any> {
    return this
      .alertService.showSubmitAlert(
        '_dappdapps.alert.validTitle',
        {
          key: '_dappdapps.alert.dappMessage',
          translateOptions: dapp
        },
        'cancel',
        'submit'
      );
  }

  /**
   * Show dialog to show that a invalid ENS address was provided.
   *
   * @param dapp   Param object
   */
  showInvalid(dapp: any): Promise<any> {
    return this.alertService
      .showSubmitAlert(
        '_dappdapps.alert.inValidTitle',
        {
          key: '_dappdapps.alert.invalidMessage',
          translateOptions: dapp
        },
        'ok'
      )
      .catch(() => {});
  }

  /**
   * Show dialog to show that a DApp already was added.
   *
   * @param dapp   Param object
   */
  alreadyAdded(dapp: any): Promise<any> {
    return this.alertService.showSubmitAlert(
      '_dappdapps.alert.alreadyTitle',
      {
        key: '_dappdapps.alert.dappMessage',
        translateOptions: dapp
      },
      'ok'
    )
    .catch(() => { });
  }

  async scanQRCode() {
    try {
      const value = await this.qrCodeService.scanQRCode();

      this.dappForm.controls['ensAddress'].setValue(value);
      this.submit(value);

      this.ref.detectChanges();
    } catch (ex) { }
  }
}
