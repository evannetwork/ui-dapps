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
import { Prop, Watch } from 'vue-property-decorator';
import { throttle } from 'lodash';

import EvanComponent from '../../component';

interface Entry {
  id: string;
  label: string;
  offsetTop?: number;
  disabled?: boolean;
}

/**
 * Component to provide simple scroll to element functionality.
 * Requires a list if ids and labels, where the ids should be available somewhere in rendered HTML.
 *
 * @usage <evan-onpage-navigation :entries="navEntries" scrollContainerSelector=".dapp-wrapper-content" />
 * @class OnpageNavigationComponent
 * @selector evan-onpage-navigation
 */
@Component
class OnpageNavigationComponent extends mixins(EvanComponent) {
  /**
   * The selector for a container in which we want to scroll.
   * Will not be updated after once initialized.
   */
  @Prop({
    type: String,
    default: 'body',
  }) scrollContainerSelector: string;

  /**
   * List of labels and ids sorted by its vertical position.
   */
  @Prop({
    default: [],
  }) entries: Entry[];

  /**
   * The id of the currently active item.
   */
  activeItem = null;

  /**
   * Store the reference to scroll container element.
   */
  scrollContainer = null;

  runtime = null;

  /**
   * Check element positions after updated.
   */
  @Watch('entries')
  updatePositions(): void {
    this.updateElementPositions();
  }

  /**
   * Initialize navigation and scroll listener.
   */
  async created(): Promise<void> {
    this.activeItem = this.entries[0].id;

    await this.$nextTick(); // wait for rendered;
    this.updateElementPositions();
    this.setScrollContainer();

    this.scrollContainer.addEventListener('scroll', this.scrollHandler);
  }

  /**
   * Remove event listener.
   */
  beforeDestroy(): void {
    this.scrollContainer.removeEventListener('scroll', this.scrollHandler);
  }

  /**
   * Set first item which has bigger y-offset than the scroll position as active.
   * Needs to be class method outside throttled function to keep vue this context.
   *
   * @param offset
   */
  handleScroll(offset: number): void {
    this.activeItem = this.entries.find((item) => item?.offsetTop > offset).id;
  }

  /**
   * Watch if user scrolled and set active item accordingly
   */
  scrollHandler = throttle(
    async ({ target: { scrollTop } }) => {
      this.activeItem = this.handleScroll(scrollTop);
    },
    100,
    { trailing: true },
  );

  /**
   * Smoothly scroll to element with target id.
   *
   * @param id
   */
  scrollToElement(id: string): void {
    const element = document.getElementById(id);

    if (!element) {
      this.runtime = this.getRuntime();
      this.runtime.logger.log(`Target element with id #${id} is not in DOM`, 'error');

      return;
    }

    this.activeItem = id;
    this.scrollContainer.scrollTo({
      behavior: 'smooth',
      left: element.offsetLeft,
      top: element.offsetTop,
    });
  }

  /**
   * get the reference to the scroll container.
   */
  setScrollContainer(): void {
    const element = document.getElementById(this.entries[0].id);

    this.scrollContainer = element.closest(this.scrollContainerSelector);
  }

  /**
   * Iterate over target elements and add their y-positions.
   */
  async updateElementPositions(): Promise<void> {
    this.entries.forEach(({ id }, idx) => {
      const element = document.getElementById(id);

      if (!element) {
        this.runtime = this.getRuntime();
        this.runtime.logger.log(`Element #${id} is not in DOM. Disabled in list.`, 'warning');
        this.entries[idx].disabled = true;
        this.entries[idx].offsetTop = Infinity;

        return;
      }

      this.entries[idx].offsetTop = element.offsetTop;
    });
  }
}

export default OnpageNavigationComponent;
