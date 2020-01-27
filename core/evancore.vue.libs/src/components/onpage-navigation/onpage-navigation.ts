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
import { Prop } from 'vue-property-decorator';
// import { throttle } from 'lodash';
import { lodash } from '@evan.network/api-blockchain-core';

import EvanComponent from '../../component';

interface Entry {
  id: string;
  label: string;
  offsetTop?: number;
}

/**
 * Component to provide simple scroll to element functionality.
 *
 * Requires a list if ids and labels. Where the ids should be available somewhere in rendered HTML.
 */
@Component
export default class TestContainerComponent extends mixins(EvanComponent) {
  @Prop({
    type: String,
    default: '.dapp-wrapper-content',
  }) scrollContainerSelector: string;

  @Prop({
    default: [],
  }) entries: Entry[];

  activeItem = null;

  scrollContainer = null;

  async created() {
    this.activeItem = this.entries[0].id;

    await this.$nextTick(); // wait for rendered;
    this.updateElementPositions();
    this.setScrollContainer();

    this.scrollContainer.addEventListener('scroll', this.scrollHandler);
  }

  beforeDestroy() {
    this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
  }

  handleScroll(offset: number): void {
    this.activeItem = this.entries.find((item) => item?.offsetTop > offset).id;
  }

  /**
   * Watch if user scrolled down and load more twins when necessary
   */
  scrollHandler = lodash.throttle(
    async ({ target: { clientHeight, scrollTop, scrollHeight } }) => {
      console.log(clientHeight, scrollTop, scrollHeight);

      this.handleScroll(scrollTop);
    },
    100,
    { trailing: true },
  );

  scrollToElement(id: string): void {
    const element = document.getElementById(id);

    this.activeItem = id;
    this.scrollContainer.scrollTo({
      behavior: 'smooth',
      left: element.offsetLeft,
      top: element.offsetTop,
    });
  }

  setScrollContainer(): void {
    console.log(this.entries);

    const element = document.getElementById(this.entries[0].id);

    this.scrollContainer = element.closest(this.scrollContainerSelector);
  }

  // TODO: ensure list is sorted by offsetTop of elements.
  async updateElementPositions(): Promise<void> {
    this.entries.forEach((item, idx) => {
      this.entries[idx].offsetTop = document.getElementById(item.id).offsetTop;
    });
  }
}
