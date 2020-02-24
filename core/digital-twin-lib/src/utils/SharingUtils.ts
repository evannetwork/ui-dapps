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

import { profileUtils } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import { EvanComponent } from '@evan.network/ui-vue-core';

export interface BmailContent {
  content: {
    from: string;
    fromAlias: string;
    title: string;
    body: string;
    attachments:
      {
        fullPath?: string;
        containerAddress?: string;
        type: string;
      }[];
  };
}

export default class SharingUtils {
  static async getTwinShareBMail(vueInstance: EvanComponent): Promise<BmailContent> {
    const runtime = vueInstance.getRuntime();
    const { twin } = vueInstance.$store.state;
    const alias = await profileUtils.getUserAlias(runtime, runtime.activeIdentity);
    // ensure profile container is setup
    await runtime.profile.loadForAccount();

    const pathToContainer = [
      `#/${vueInstance.dapp.rootEns}`,
      `detail.digital-twin.${getDomainName()}`,
      twin.contractAddress,
    ].join('/');

    return {
      content: {
        from: runtime.activeIdentity,
        fromAlias: alias,
        // TODO: Hard coded content for now. This must be translated in the bmail-dapp instead of here.
        title: 'New access to Digital Twin',
        body: `You have been granted access to a Digital Twin by ${alias}. Click on the following Link to view it.
          <br /><br />
          <a href="${pathToContainer}" target="_blank">${twin.description.name}</a>
          `,
        attachments: [
          {
            fullPath: pathToContainer,
            type: 'url',
          },
        ],
      },
    };
  }

  static async getProfileShareBMail(vueInstance: EvanComponent): Promise<BmailContent> {
    const runtime = vueInstance.getRuntime();
    const alias = await profileUtils.getUserAlias(runtime, runtime.activeIdentity);
    // ensure profile container is setup
    await runtime.profile.loadForAccount();

    return {
      content: {
        from: vueInstance.getRuntime().activeIdentity,
        fromAlias: alias,
        title: vueInstance.$t('_profile.bmail.share.title'),
        body: vueInstance.$t('_profile.bmail.share.body', { alias }).replace(/\n/g, '<br>'),
        attachments: [
          {
            fullPath: [
              `/${vueInstance.dapp.rootEns}`,
              `profile.vue.${getDomainName()}`,
              vueInstance.getRuntime().activeIdentity,
            ].join('/'),
            type: 'url',
          },
          {
            containerAddress: await runtime.profile.profileContainer.getContractAddress(),
            type: 'container',
          },
        ],
      },
    };
  }
}
