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
import { Prop, } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';

@Component({ })
export default class LayoutWrapperComponent extends mixins(EvanComponent) {
  /**
   * Step for translation the left panel text
   */
  @Prop({
    type: String,
    default: function() {
      return '';
    }
  }) step;

  /**
   * Type of the ui, for that the layout wrapper will be used (e.g. sign-up.company)
   */
  @Prop({
    type: String,
    default: function() {
      return '';
    }
  }) type;

  /**
   * List of image names, that should be displayed on which step.
   */
  @Prop() images: Array<string>;

  /**
   * Special image size definitions for the left-panel images.
   */
  imageSizes = {
    '1.svg': 'width: 176px; margin-bottom: 51px; margin-left: -1px;',
    '2.svg': 'width: 176px; margin-bottom: 49px; margin-left: -1px;',
    '3.svg': 'width: 168px; margin-bottom: 79px; margin-left: 0px;',
    '4.svg': 'width: 168px; margin-bottom: 79px; margin-left: 0px;',
    '5.svg': 'width: 168px; margin-bottom: 79px; margin-left: 0px;',
    '6.svg': 'width: 386px; margin-left: -1px; margin-bottom: 5px;',
    '7.svg': 'width: 148.5px; margin-bottom: 61px; margin-left: 2px;',
    '8.svg': 'width: 148.5px; margin-bottom: 61px; margin-left: 2px;',
    '9.svg': 'width: 148.5px; margin-bottom: 57px; margin-left: 0px; ',
    '10.svg': 'width: 151px; margin-bottom: 65px; margin-left: 3px;',
    '11.svg': 'width: 176px; margin-bottom: 51px; margin-left: -1px;',
    '12.svg': 'width: 176px; margin-bottom: 51px; margin-left: 10px;',
    '13.svg': 'height: 380px;',
    '14.svg': 'width: 176px; margin-bottom: 51px; margin-left: 8px;',
  };

  /**
   * Set initial image size.
   */
  mounted() {
    this.setImageStyle();
  }

  /**
   * Set new image size, when img was loaded
   */
  setImageStyle() {
    const banner: any = this.$el.querySelector('img.desc-banner');
    if (banner) {
      banner.style.cssText = this.imageSizes[this.images[this.step]] + ' z-index: 1';
    }
  }
}
