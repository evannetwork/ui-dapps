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
  ChangeDetectorRef,
  Component,
  DomSanitizer,
  Input,
  NavController,
  OnDestroy,
  OnInit,
  TranslateService,
  ViewChild,
} from '@evan.network/ui-angular-libs';

import {
  AnimationDefinition,
  AsyncComponent,
  createOpacityTransition,
  createRouterTransition,
  EvanAlertService,
  EvanBCCService,
  EvanVerificationService,
  EvanCoreService,
  EvanQueue,
  EvanRoutingService,
  QueueId,
} from '@evan.network/ui-angular-core';

import { VerificationService } from '../../services/service';

/**************************************************************************************************/

/**
 * Used to check if the identity for the current logged in user exists, if not, it will enable a
 * functionality, to create a new identity.
 */
@Component({
  selector: 'evan-identity-missing',
  templateUrl: 'identity-missing.html',
  animations: [
    createOpacityTransition()
  ]
})

export class EvanIdentityMissingComponent extends AsyncComponent {
  /*****************    variables    *****************/
  /**
   * has the current user already a identity?
   */
  private identityExists: boolean;

  /**
   * Function to unsubscribe from queue results.
   */
  private queueWatcher: Function;

  /**
   * Is currently the identity creation queue running?
   */
  private identityCreating: boolean;

  /**
   * queue id for the identityDispatcher
   */
  private queueId: QueueId;

  constructor(
    private _DomSanitizer: DomSanitizer,
    private alertService: EvanAlertService,
    private bcc: EvanBCCService,
    private verificationService: EvanVerificationService,
    private core: EvanCoreService,
    private internalVerificationService: VerificationService,
    private queue: EvanQueue,
    private ref: ChangeDetectorRef,
    private routingService: EvanRoutingService,
  ) {
    super(ref);
  }

  /**
   * Load verifications for the current addres, contract address or the active account.
   */
  async _ngOnInit() {
    this.queueId = this.verificationService.getQueueId('identityDispatcher');

    // watch for updates
    this.queueWatcher = await this.queue.onQueueFinish(
      this.queueId,
      async (reload, results) => {
        // check if the current user has an identity
        this.identityExists = await this.bcc.verifications.identityAvailable(this.core.activeAccount());
        this.identityCreating = this.queue.getQueueEntry(this.queueId, true).data.length > 0;
        this.ref.detectChanges();
      }
    );
  }

  /**
   * Remove watchers
   */
  async _ngOnDestroy() {
    this.queueWatcher();
  }

  /**
   * Triggers the queue for creating an identity.
   */
  createIdentity() {
    this.queue.addQueueData(this.queueId, { });
    this.identityCreating = true;

    this.ref.detectChanges();
  }
}
