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
  Component,     // @angular/core
  DomSanitizer,
  ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  EvanAddressBookService,
  EvanAlertService,
  EvanBCCService,
  EvanCoreService,
  EvanQrCodeService,
  EvanRoutingService,
  EvanToastService,
  createOpacityTransition,
  createRouterTransition,
  EvanTranslationService,
  createTabSlideTransition
} from 'angular-core';

import {
  BaseContract,
  RightsAndRoles,
  prottle,
  createBC
} from 'bcc';

import { ExplorerService } from '../../services/explorer.service';

/**************************************************************************************************/

@Component({
  selector: 'explorer-verifications',
  templateUrl: 'verifications.html',
  animations: [
    createTabSlideTransition()
  ]
})
/**
 * Detail wrapper for the whole application when an id was opened
 */
export class ExplorerVerificationsComponent extends AsyncComponent {
  /**
   * value of the current selected id
   */
  private id: string;

  /**
   * id corresponding contract id 
   */
  private contractAddress: string;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private addressBook: EvanAddressBookService,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private core: EvanCoreService,
    private explorerService: ExplorerService,
    private qrCodeService: EvanQrCodeService,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
    private toastService: EvanToastService,
    private translateService: EvanTranslationService,
  ) {
    super(ref);
  }
 
  async _ngOnInit() {
    this.id = this.routingService.getHashParam('id');
    this.contractAddress = await this.explorerService.nameResolver.getAddress(this.id) || this.id;
  }
}
