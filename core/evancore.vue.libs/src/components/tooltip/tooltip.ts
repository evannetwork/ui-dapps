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
import { Prop } from 'vue-property-decorator';

// evan.network imports
import EvanComponent from '../../component';

/**
 * Bootstrap tooltip wrapper.
 *
 * @class         SuccessComponent
 * @selector      evan-success
 */
@Component({ })
export default class EvanTooltip extends mixins(EvanComponent) {
  /**
   * Tooltip placement
   */
  @Prop({ default: 'top' }) placement;

  /**
   * Timeout in ms, until the tooltip gets shown
   */
  @Prop({ default: 300 }) delay;

  /**
   * Should it be a large tooltip?
   */
  @Prop() multiline;

  /**
   * Is it displayed?
   */
  showTooltip = false;

  /**
   * tooltip toggle functions
   */
  onMouseEnter: Function;

  onMouseLeave: Function;

  /**
   * bind parent element watchers
   */
  mounted() {
    let showTimeout: any;

    // show tooltip after delay ms
    this.onMouseEnter = () => {
      showTimeout = setTimeout(() => {
        this.showTooltip = true;
        this.$el.parentElement.className += ' evan-tooltip-parent';
      }, this.delay);
    };

    // hide tooltip and clear the show timeout
    this.onMouseLeave = () => {
      window.clearTimeout(showTimeout);
      this.showTooltip = false;
      this.$el.parentElement.className = this.$el.parentElement.className
        .replace(' evan-tooltip-parent', '');
    };

    // bind mouse events
    this.$el.parentElement.addEventListener('mouseenter', (this.onMouseEnter as any));
    this.$el.parentElement.addEventListener('mouseleave', (this.onMouseLeave as any));
  }

  /**
   * unbind parent element watchers
   */
  beforeDestroy() {
    this.$el.parentElement.removeEventListener('mouseenter', (this.onMouseEnter as any));
    this.$el.parentElement.removeEventListener('mouseleave', (this.onMouseLeave as any));
  }
}
