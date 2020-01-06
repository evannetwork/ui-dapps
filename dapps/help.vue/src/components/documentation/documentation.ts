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

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component
export default class DocumentationComponent extends mixins(EvanComponent) {
  /**
   * Current domain name
   */
  domainName = (<any>this).domainName;

  /**
   * Tabs for top navigation
   */
  navEntries: Array<any> = [ ];

  created() {
    this.navEntries = [
      { key: 'github', icon: 'mdi mdi-github-circle' },
      { key: 'bccdocs', icon: 'mdi mdi-server-security' },
      { key: 'uidocs', icon: 'mdi mdi-format-color-fill' },
    ]
    .map(entry => (entry ? {
      id: `nav-entry-${ entry.key }`,
      href: `${ (<any>this).dapp.fullUrl }/${ entry.key }`,
      text: `_help.docs.${ entry.key }`,
      icon: entry.icon,
    } : null));
  }
}
