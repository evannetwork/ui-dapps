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
import { EvanComponent, EvanForm, EvanFormControl } from '@evan.network/ui-vue-core';


interface DBCPForm extends EvanForm {
  description: EvanFormControl;
  imgSquare: EvanFormControl;
  name: EvanFormControl;
}

@Component({ })
export default class DBCPComponent extends mixins(EvanComponent) {
  /**
   * Apply DBCP form from outside to have the full control of validation. If empty, default form is
   * used.
   */
  @Prop() form;

  /**
   * Dbcp definition including predefined values.
   */
  @Prop() dbcp;

  /**
   * Disable all inputs.
   */
  @Prop() disabled;

  /**
   * Do not add content spacing
   */
  @Prop() disableSpacing;

  /**
   * Currently used dbcp form instance for getting name, imgSquare, description
   */
  // _form: DBCPForm = null;
  _form: any = null;

  /**
   * Setup the form.
   */
  async created() {
    this._form = this.form || (<DBCPForm>new EvanForm(this, { }));

    // fill empty name control
    if (!this._form.name) {
      this._form.addControl('name', {
        value: (this.dbcp && this.dbcp.name) ? this.dbcp.name : '',
        validate: function(vueInstance: DBCPComponent, form: DBCPForm) {
          return this.value.trim().length !== 0;
        }
      });
    }

    // fill empty description control
    if (!this._form.description) {
      this._form.addControl('description', {
        value: (this.dbcp && this.dbcp.description) ? this.dbcp.description : '',
      });
    }

    // fill empty imgSquare control
    if (!this._form.imgSquare) {
      this._form.addControl('imgSquare', {
        value: (this.dbcp && this.dbcp.imgSquare) ? this.dbcp.imgSquare : '',
      });
    }

    this.$emit('init', this);
    this.$nextTick(() => (<any>this.$refs.name).focus());
  }

  /**
   * Trigger the submit event for the current formular.
   */
  save() {
    if (this._form.isValid) {
      this.$emit('submit', {
        name: this._form.name.value,
        description: this._form.description.value,
        imgSquare: this._form.imgSquare.value,
      });
    }
  }

  /**
   * Return form is valid flag.
   */
  isValid() {
    return this._form.isValid;
  }
}
