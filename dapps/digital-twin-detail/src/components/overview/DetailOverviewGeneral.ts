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

import Component, { mixins } from 'vue-class-component';
import { EvanComponent } from '@evan.network/ui-vue-core';
import { Prop } from 'vue-property-decorator';

@Component
export default class DetailOverviewGeneralComponent extends mixins(EvanComponent) {
  @Prop() did: string;

  @Prop() ownerName: string;

  @Prop() ownerAddress: string;

  @Prop() createdAt: string;

  @Prop() isOwner: boolean;

  routeToOwner(): void {
    window.location.hash = `/${this.dapp.rootEns}/profile.vue.${this.dapp.domainName}/${this.ownerAddress}/detail`;
  }

  /**
   * Adds text to clipboard.
   *
   * @param text Text to copy
   */
  copyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    this.$toasted.show(
      this.$t('_twin-detail.overview.copied'),
      {
        duration: 3000,
        type: 'success',
      },
    );
  }
}
