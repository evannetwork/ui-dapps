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
import * as bcc from '@evan.network/api-blockchain-core';
import EvanUIIdentity from '../../identity';
import * as identitityUtils from '../../utils';
var IdentitiesRootComponent = /** @class */ (function (_super) {
    __extends(IdentitiesRootComponent, _super);
    function IdentitiesRootComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * show general loading
         */
        _this.loading = true;
        /**
         * Show left panel overview or is an detail is opened?
         */
        _this.sideNav = 0;
        /**
         * Categories of the left navigation
         */
        _this.navigation = [
            [
                {
                    name: 'my-identities',
                    active: false,
                    emptyNav: 'lookup',
                    children: [
                        { name: 'identity-overview', path: 'overview', i18n: true },
                    ]
                },
                {
                    name: 'my-templates',
                    active: false,
                    children: []
                }
            ],
            []
        ];
        return _this;
    }
    /**
     * Initialize when the user has logged in.
     */
    IdentitiesRootComponent.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var that;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.$route.name) {
                            this.navigation[0][0].active = true;
                        }
                        return [4 /*yield*/, this.loadFavorites()];
                    case 1:
                        _a.sent();
                        this.setLastOpenedIdentities();
                        this.loading = false;
                        return [4 /*yield*/, this.loadIdentity()];
                    case 2:
                        _a.sent();
                        that = this;
                        this.hashChangeWatcher = function () { return that.loadIdentity(); };
                        // add the hash change listener
                        window.addEventListener('hashchange', this.hashChangeWatcher);
                        // clear the watcher if the component was already destroyed
                        if (this.wasDestroyed) {
                            this.beforeDestroy();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clear the hash change watcher
     */
    IdentitiesRootComponent.prototype.beforeDestroy = function () {
        this.wasDestroyed = true;
        // only remove the hashChangeWatcher, when it was already bind (asynchronious call can take
        // longer and the dapp was switched before)
        if (this.hashChangeWatcher) {
            // remove the hash change listener
            window.removeEventListener('hashchange', this.hashChangeWatcher);
        }
        // clear listeners
        this.$store.state.uiIdentity && this.$store.state.uiIdentity.destroy(this);
    };
    /**
     * Load the identity favorites for the current user.
     */
    IdentitiesRootComponent.prototype.loadFavorites = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runtime, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        runtime = identitityUtils.getRuntime(this);
                        _a = this.$store.state;
                        return [4 /*yield*/, bcc.DigitalIdentity.getFavorites(runtime)];
                    case 1:
                        _a.favorites = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Load identity data. Checks for identity changes and if a identity is opened.
     */
    IdentitiesRootComponent.prototype.loadIdentity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var identityAddress, uiIdentity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        identityAddress = this.$route.params.identityAddress;
                        uiIdentity = this.$store.state.uiIdentity;
                        if (!(identityAddress && (!uiIdentity || (uiIdentity && !uiIdentity.loading)))) return [3 /*break*/, 2];
                        if (!(!uiIdentity || identityAddress !== uiIdentity.address)) return [3 /*break*/, 2];
                        // if identity was set, destroy it
                        uiIdentity && uiIdentity.destroy(this);
                        // create new instance of the evan ui identity, that wraps general ui and navigation
                        // functions
                        this.$set(this.$store.state, 'uiIdentity', new EvanUIIdentity(identityAddress));
                        // load identity specific data
                        return [4 /*yield*/, this.$store.state.uiIdentity.initialize(this, identitityUtils.getRuntime(this))];
                    case 1:
                        // load identity specific data
                        _a.sent();
                        // apply the container categories every time, when the identity was load, so the containers
                        // and paths will be dynamic
                        this.sideNav = 1;
                        this.navigation[1] = this.$store.state.uiIdentity.navigation;
                        // show latest identities
                        this.setLastOpenedIdentities();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Activate a category and close all others.
     *
     * @param      {Arrayany}  categories  List of categories that should be closed
     * @param      {any}       category    Category that should be activated
     */
    IdentitiesRootComponent.prototype.toggleLeftCategory = function (categories, category) {
        categories.forEach(function (deactivateCat) { return deactivateCat.active = false; });
        category.active = !category.active;
        // if the category is empty, navigate directly tho the empty nav point
        if (category.children.length === 0 && category.emptyNav) {
            this.evanNavigate(category.emptyNav);
        }
        if (category.children.length === 1) {
            this.evanNavigate(category.children[0].path);
        }
    };
    /**
     * Checks for localStorage, which addresses were opened before.
     */
    IdentitiesRootComponent.prototype.setLastOpenedIdentities = function () {
        var lastIdentities = identitityUtils.getLastOpenedIdentities();
        // if we hadn't opened 5 identites before, use favorites
        if (lastIdentities.length < 5) {
            lastIdentities = lastIdentities.concat(this.$store.state.favorites.slice(0, 10));
            lastIdentities = Array.from(new Set(lastIdentities));
        }
        // show everytime the overview entry and apply the last identities
        this.navigation[0][0].children = [this.navigation[0][0].children[0]]
            .concat(lastIdentities.slice(0, 5).map(function (address) {
            return { name: address, path: address, i18n: false };
        }));
        this.$store.state.lastIdentities = lastIdentities;
    };
    IdentitiesRootComponent = __decorate([
        Component({})
    ], IdentitiesRootComponent);
    return IdentitiesRootComponent;
}(mixins(EvanComponent)));
export default IdentitiesRootComponent;
//# sourceMappingURL=root.js.map