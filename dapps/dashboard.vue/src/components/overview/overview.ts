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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent, getDomainName,  } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

@Component({ })
export default class OverviewComponent extends mixins(EvanComponent) {
  dashboardEntries: Array<any> = [
    {
      title: 'explanations',
      img: 'performance-colored.svg',
      path: `help.vue.${ getDomainName() }`,
    },
    {
      title: 'digitaltwins',
      img: 'plus.svg',
      path: `digitaltwins.${ getDomainName() }`,
      class: 'bg-primary',
    },
  ];

  /**
   * check for mainnet and replace the contacts card.
   */
  created() {
    if (window.location.href.startsWith('https://dashboard.evan.network')) {
      this.dashboardEntries.unshift({
        title: 'testcore',
        img: 'testcore.svg',
        fullPath: `https://dashboard.test.evan.network/#/onboarding.evan/identity-import?origin=dashboard.vue.evan`,
      });
    }
  }

  /**
   * Ask for continue latest work
   */
  mounted() {
    // restore the recovery url when it's available and the last url wasn't the dashboard
    if (window.localStorage['evan-recovery-url'] &&
        !window.localStorage['evan-recovery-url'].endsWith(`dashboard.vue.${ getDomainName() }`)) {
      // (<any>this.$refs.recoveryModal).show();
    }
  }

  /**
   * Takes the window.localStorage['evan-recovery-url'] and navigate the user to this url.
   */
  recoverUrl() {
    window.location.href = window.localStorage['evan-recovery-url'];
  }
}
