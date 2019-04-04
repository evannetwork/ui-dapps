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

  You can be released from the requirements of the GNU Affero General Public
  License by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts
  of it on other blockchains than evan.network.

  For more information, please contact evan GmbH at this address:
  https://evan.network/license/
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component, { mixins } from 'vue-class-component';
// evan.network imports
import { EvanComponent, EvanForm } from '@evan.network/ui-vue-core';
import * as dispatchers from '../../dispatchers/registy';
import { getRuntime } from '../../utils';
var GeneralComponent = /** @class */ (function (_super) {
    __extends(GeneralComponent, _super);
    function GeneralComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * formular specific variables
         */
        _this.generalForm = null;
        return _this;
    }
    /**
     * Setup the form.
     */
    GeneralComponent.prototype.created = function () {
        var _this = this;
        var uiIdentity = this.$store.state.uiIdentity;
        this.generalForm = new EvanForm(this, {
            name: {
                value: uiIdentity.dbcp.name,
                validate: function (vueInstance, form) {
                    vueInstance.$store.state.uiIdentity.setData('dbcp.name', this.value);
                    return this.value.length !== 0;
                }
            },
            description: {
                value: uiIdentity.dbcp.description,
                validate: function (vueInstance, form) {
                    vueInstance.$store.state.uiIdentity.setData('dbcp.description', this.value);
                    // update identity dbcp and return true, i's not required
                    return true;
                }
            },
            img: {
                value: '',
            },
        });
        this.$nextTick(function () { return _this.generalForm.name.$ref.focus(); });
    };
    /**
     * Create the new identity
     */
    GeneralComponent.prototype.createIdentity = function () {
        if (!this.$store.state.uiIdentity.exists) {
            dispatchers.identityCreateDispatcher.start(getRuntime(this), {
                address: this.$store.state.uiIdentity.address,
                dbcp: this.$store.state.uiIdentity.dbcp
            });
        }
    };
    GeneralComponent = __decorate([
        Component({})
    ], GeneralComponent);
    return GeneralComponent;
}(mixins(EvanComponent)));
export default GeneralComponent;
//# sourceMappingURL=general.js.map