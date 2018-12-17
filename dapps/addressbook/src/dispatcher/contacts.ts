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
  Injectable,
  Component, OnInit, Input,            // @angular/core
  Validators, FormBuilder, FormGroup,  // @angular/forms
  DomSanitizer
} from 'angular-libs';

import {
  QueueSequence,
  QueueDispatcher,
  EvanAddressBookService,
  SingletonService,
  EvanOnboardingService,
  EvanBCCService,
  EvanTranslationService,
} from 'angular-core';

import {
  translations
} from '../i18n/registry';

/**************************************************************************************************/

@Injectable()
export class ContactsDispatcherService {
  static providers = [
    EvanAddressBookService,
    EvanOnboardingService,
    SingletonService,
    EvanBCCService,
    EvanTranslationService
  ];

  constructor(
    public addressBookService: EvanAddressBookService,
    public onboardingService: EvanOnboardingService,
    public singleton: SingletonService,
    public bcc: EvanBCCService,
    public translationService: EvanTranslationService
  ) {
    return singleton.create(ContactsDispatcherService, this);
  }
}

export const ContactsDispatcher = new QueueDispatcher(
  [
    new QueueSequence(
      '_dappcontacts.dispatcher.key-exchange',
      '_dappcontacts.dispatcher.key-exchange-description',
      async (service: ContactsDispatcherService, queueEntry: any) => {
        const addressBook = await service.addressBookService.loadAccounts();
        const accountKeys = Object.keys(addressBook);

        for (let entry of queueEntry.data) {
          const accountId = entry.accountId;

          if (entry.type === 'remove') {
            await service.bcc.profile.removeContact(accountId);
          } else {
            // if a new account was added, send the com key to the account id
            if (entry.isCreate) {
              const mail = entry.mail;

              if (entry.sendMailInvitation) {
                let eves = (entry.profile.eves || 0).toString();

                await service.onboardingService.onboarding.sendInvitation(
                  {
                    to: `${accountId}`,
                    subject: mail.title,
                    body: mail.body,
                    fromAlias: mail.fromAlias,
                    lang: service.translationService.getCurrentLang()
                  },
                  service.bcc.web3.utils.toWei(eves)
                );
              } else {
                let profile = service.bcc.getProfileForAccount(accountId);
                const targetPubKey = await profile.getPublicKey();
                const commKey = await service.bcc.keyExchange.generateCommKey();
                await service.bcc.keyExchange.sendInvite(accountId, targetPubKey, commKey, mail);

                // add key to profile
                await service.bcc.profile.addContactKey(
                  accountId,
                  'commKey',
                  commKey
                );
              }

              await service.bcc.profile.addProfileKey(
                accountId, 'alias', entry.alias
              );
            }

            for (let profileKey of Object.keys(entry.profile)) {
              await service.bcc.profile.addProfileKey(accountId, profileKey,
                entry.profile[profileKey]);
            }
          }
        }

        await service.bcc.profile.storeForAccount(service.bcc.profile.treeLabels.addressBook);
      }
    )
  ],
  translations
);
