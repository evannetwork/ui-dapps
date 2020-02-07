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

import { bccUtils } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-dapp-browser';

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
  static async getTwinShareBMail(vueInstance): Promise<BmailContent> {
    const runtime = vueInstance.getRuntime();
    const { container, twin } = vueInstance.$store.state;
    const { profile } = runtime;
    const alias = await bccUtils.getUserAlias(profile);
    // ensure profile container is setup
    await profile.loadForAccount();

    const pathToContainer = [`#/${vueInstance.dapp.rootEns}`,
      `detail.digital-twin.${getDomainName()}`,
      twin.contractAddress,
      'data',
      container.contractAddress,
    ].join('/');

    return {
      content: {
        from: runtime.activeAccount,
        fromAlias: alias,
        title: vueInstance.$t('_digital-twin-lib.bmail.share.title'),
        body: `${vueInstance.$t('_digital-twin-lib.bmail.share.body', { alias }).replace(/\n/g, '<br>')} <br /> <a href="${pathToContainer}">Link</a>`,
        attachments: [
          {
            containerAddress: container.contractAddress,
            type: 'container',
          },
        ],
      },
    };
  }

  static async getProfileShareBMail(vueInstance): Promise<BmailContent> {
    const runtime = vueInstance.getRuntime();
    const { profile } = runtime;
    const alias = await bccUtils.getUserAlias(profile);
    // ensure profile container is setup
    await profile.loadForAccount();

    return {
      content: {
        from: vueInstance.getRuntime().activeAccount,
        fromAlias: alias,
        title: vueInstance.$t('_profile.bmail.share.title'),
        body: vueInstance.$t('_profile.bmail.share.body', { alias }).replace(/\n/g, '<br>'),
        attachments: [
          {
            fullPath: [
              `/${vueInstance.dapp.rootEns}`,
              `profile.vue.${getDomainName()}`,
              vueInstance.getRuntime().activeAccount,
            ].join('/'),
            type: 'url',
          },
          {
            containerAddress: profile.profileContainer.config.address,
            type: 'container',
          },
        ],
      },
    };
  }
}
