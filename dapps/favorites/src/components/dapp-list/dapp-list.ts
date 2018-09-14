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

import {
  getDomainName
} from 'dapp-browser';

import {
  Component, OnInit, // @angular/core
  NavController,     // ionic-angular
  DomSanitizer,
  PopoverController, OnDestroy,
  ChangeDetectorRef
} from 'angular-libs';

import {
  createOpacityTransition,
  EvanBCCService,
  EvanBookmarkService,
  EvanQueue,
  EvanAlertService,
  EvanRoutingService,
  EvanModalService,
  EvanCoreService,
  EvanUtilService,
  AsyncComponent
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'dapp-list',
  templateUrl: 'dapp-list.html',
  animations: [
    createOpacityTransition()
  ]
})

export class DAppListComponent extends AsyncComponent {
  private dappKeys: Array<string>;
  private dapps: any;
  private filterString: string;
  private clearQueue: Function
  private showItemPopover: string;
  private loading: boolean;

  constructor(
    public _DomSanitizer: DomSanitizer,
    public routing: EvanRoutingService,
    private bcc: EvanBCCService,
    private bookmarkService: EvanBookmarkService,
    private queue: EvanQueue,
    private alertService: EvanAlertService,
    private popoverCtrl: PopoverController,
    private modalService: EvanModalService,
    private core: EvanCoreService,
    public utils: EvanUtilService,
    private ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  async _ngOnInit() {
    this.dapps = [];
    this.dappKeys = [];

    this.clearQueue = await this.queue
      .onQueueFinish(this.bookmarkService.queueId, async (reload) => {
        await this.loadBookmarks(reload);
      });
  }

  async _ngOnDestroy() {
    this.clearQueue();
  }

  loadBookmarks(reload?: boolean) {
    this.loading = true;

    return this.bookmarkService
      .getDAppBookmarks(reload)
      .then(bookmarks => {
        this.dapps = bookmarks;
        this.dappKeys = Object.keys(bookmarks);

        const indexOfCryptoInfo = this.dappKeys.indexOf('cryptoInfo')

        if (indexOfCryptoInfo !== -1) {
          this.dappKeys.splice(indexOfCryptoInfo, 1);
        }
      })
      .then(() => {
        this.loading = false

        this.ref.detectChanges();
      });
  }

  filter($event: any) {
    const value = $event.target.value;

    if (value && value.trim() !== '') {
      this.dappKeys = Object.keys(this.dapps)
        .filter(dappKey => {
          return JSON.stringify(this.dapps[dappKey])
            .toLowerCase()
            .includes(value.toLowerCase());
        });
    } else {
      this.dappKeys = Object.keys(this.dapps);
    }

    this.ref.detectChanges();
  }

  removeDApp(dappKey: string, uiControl: any) {
    if (uiControl) {
      uiControl.close();
    }

    const dapp = this.dapps[dappKey];
    dapp.trimmedName = dapp.name.replace(/\s|\./g, '');

    this.alertService.addDAppAlertStyle(this.dapps[dappKey]);

    return this
      .alertService.showSubmitAlert(
        '_dappdapps.alert.deleteDAppTitle',
        {
          key: '_dappdapps.alert.dappMessage',
          translateOptions: dapp
        },
        'cancel',
        'submit'
      )
      .then(() => {
        this.dappKeys.splice(this.dappKeys.indexOf(dappKey), 1);

        return this.bookmarkService.queueRemoveBookmark(dappKey);
      })
      .then(() => this.loadBookmarks())
      .catch(() => { })
      .then(() => this.alertService.removeDAppAlertStyle(dapp));
  }

  openDApp(dappKey: string) {
    if (dappKey === `favorites.${ getDomainName() }`) {
      // this.routing.navigate(`../easteregg.${ getDomainName() }`);
    } else {
      this.routing.navigate(
        this.dapps[dappKey].standalone ? `/${dappKey}` : `../${ dappKey }`,
        this.dapps[dappKey].standalone
      );
    }
  }

  togglePopover(dappName: string) {
    if (this.showItemPopover) {
      if (this.showItemPopover !== dappName) {
        this.showItemPopover = dappName;
      } else {
        delete this.showItemPopover;
      }
    } else {
      this.showItemPopover = dappName;
    }

    this.ref.detectChanges();
  }

  copyDAppUrl(dappKey: string) {
    let url = window.location.origin + window.location.pathname;

    if (this.dapps[dappKey].standalone) {
      url += `#${ dappKey }`;
    } else {
      url += `#dashboard.${ getDomainName() }/${ dappKey }`;
    }

    this.core.copyString(url);
  }
}
