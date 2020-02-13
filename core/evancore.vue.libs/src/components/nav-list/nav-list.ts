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
import Component, { mixins } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

// evan.network imports
import { Route } from 'vue-router';
import EvanComponent from '../../component';
import { NavEntryInterface } from './NavEntryInterface';

/**
 * Displays navigation list in evan.network design using vue router integration for checking active
 * and activating tabs (optimized for evan-dapp-wrapper-level-2)
 *
 * @class      NavListComponent @selector      evan-nav-list
 */
@Component
export default class NavListComponent extends mixins(EvanComponent) {
  /**
   * Navigation entries that should be displayed (NavEntry can also be null to display a my-auto
   * separator)
   */
  @Prop() entries: Array<NavEntryInterface>;

  /**
   * Shows the profile display in the top of the nav-list
   */
  @Prop({ default: true }) showProfile: boolean;

  /**
   * Shows the logout button at the bottom of the nav list
   */
  @Prop({ default: true }) showLogout: boolean;

  /* created(): void {
       this.$emit('init', this);
     } */

  // eslint-disable-next-line class-methods-use-this
  onClick(entry: NavEntryInterface, route: Route): void {
    // Close the sidenav for mobile view
    window.dispatchEvent(new CustomEvent('dapp-wrapper-sidebar-close'));

    if (entry?.action) {
      entry.action();
    }

    this.$router.push(route.path);
  }
}
