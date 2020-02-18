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
import { Prop } from 'vue-property-decorator';
import EvanComponent from '../../component';

/**
 * Data Table based on bootstrap table
 * https://bootstrap-vue.js.org/docs/components/table
 *
 * @class         EvanTable
 * @selector      evan-table
 */
@Component
export default class EvanTable extends mixins(EvanComponent) {
  /**
   * Flag to always display scrollbar
   */
  @Prop({ default: false }) showScrollbar: boolean;

  scrollContainer: Element;

  /**
   * Clear listeners.
   */
  beforeDestroy(): void {
    this.scrollContainer.removeEventListener('scroll', this.onScroll);
  }

  /**
   * Bind custom scroll listeners, because inner bootstrap table element is scrolling.
   */
  mounted(): void {
    this.scrollContainer = this.$el.querySelector('.b-table-sticky-header') || this.$el;
    this.scrollContainer.addEventListener('scroll', this.onScroll);
  }

  /**
   * Just send custom scroll event to parent components.
   *
   * @param      {any}  $event  scroll event
   */
  onScroll($event: any): void {
    this.$emit('scroll', $event);
  }
}
