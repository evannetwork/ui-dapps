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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Component, { mixins } from 'vue-class-component';
// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import { getRuntime } from '../../utils';
var OverviewComponent = /** @class */ (function (_super) {
    __extends(OverviewComponent, _super);
    function OverviewComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * show loading symbol
         */
        _this.loading = true;
        /**
         * mapped for better iteration
         */
        _this.categories = {
            /**
             * favorite identities of the current user
             */
            favorites: [],
            /**
             * dbcp description of last identities
             */
            lastIdentities: []
        };
        /**
         * Loaded descriptions
         */
        _this.descriptions = {};
        return _this;
    }
    /**
     * Load dbcp descriptions for the last identities, so we can display more informations.
     */
    OverviewComponent.prototype.created = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runtime, loadPromises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runtime = getRuntime(this);
                        this.categories.favorites = this.$store.state.favorites;
                        this.categories.lastIdentities = this.$store.state.lastIdentities;
                        loadPromises = {};
                        return [4 /*yield*/, Promise.all([].concat(this.categories.favorites, this.categories.lastIdentities)
                                .map(function (ensAddress) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b, ex_1;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _c.trys.push([0, 2, , 3]);
                                            // load the description only once
                                            loadPromises[ensAddress] = loadPromises[ensAddress] || runtime.description
                                                .getDescription(ensAddress, runtime.activeAccount);
                                            _a = this.descriptions;
                                            _b = ensAddress;
                                            return [4 /*yield*/, loadPromises[ensAddress]];
                                        case 1:
                                            _a[_b] = (_c.sent()).public;
                                            return [3 /*break*/, 3];
                                        case 2:
                                            ex_1 = _c.sent();
                                            console.log(ex_1);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 1:
                        _a.sent();
                        // filter favorites, that could not be loaded
                        this.categories.favorites = this.categories.favorites
                            .filter(function (ensAddress) { return !!_this.descriptions[ensAddress]; });
                        this.categories.lastIdentities = this.categories.lastIdentities
                            .filter(function (ensAddress) { return !!_this.descriptions[ensAddress]; });
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    OverviewComponent = __decorate([
        Component({})
    ], OverviewComponent);
    return OverviewComponent;
}(mixins(EvanComponent)));
export default OverviewComponent;
//# sourceMappingURL=overview.js.map