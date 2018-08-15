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
  Profile
} from 'bcc';

import {
  Component, OnInit,      // @angular/core
  TranslateService,       // @ngx-translate/core
  NavController,          // ionic-angular
  Validators, FormBuilder, FormGroup,  // @angular/forms
  ActivatedRoute,
  Input, ChangeDetectorRef
} from 'angular-libs';

import {
  AnimationDefinition,
  createRouterTransition,
  EvanTranslationService,
  EvanRoutingService,
  EvanAddressBookService,
  createOpacityTransition,
  TrustDialogComponent,
  EvanModalService,
  EvanCoreService,
  EvanBCCService,
  EvanMailboxService
} from 'angular-core';

/**************************************************************************************************/

@Component({
  selector: 'account-create',
  templateUrl: 'account-create.html',
  animations: [
    createOpacityTransition()
  ]
})

export class AccountCreateComponent implements OnInit {
  constructor(
    private translate: EvanTranslationService,
    private routing: EvanRoutingService,
    private route: ActivatedRoute,
    private modalService: EvanModalService,
    private mailboxService: EvanMailboxService,
    private core: EvanCoreService,
    private bcc: EvanBCCService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ref.detach();
    this.ref.detectChanges();
  }

  async showOnboardingAgentDialog() {
    const smartAgentAccountId = '0x063fB42cCe4CA5448D69b4418cb89E663E71A139';
    const smartAgentCommKey = await this.bcc.profile.getContactKey(
      smartAgentAccountId,
      'commKey',
    );
    if (smartAgentCommKey) {
      this.routing.navigate('../add-via-mail');
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
  
            await this.bcc.profile.storeForAccount(this.bcc.profile.treeLabels.addressBook);
          }
        }, true);

        this.routing.navigate('../add-via-mail');
      } catch (ex) { }
    }
  }
}
