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
import * as bcc from '@evan.network/api-blockchain-core';
import { getIdentityBaseDbcp, getLastOpenedIdentities, latestIdentitiesKey } from './utils';
import * as dispatchers from './dispatchers/registy';
/**
 * Represents the UI representation for a evan.network. Handles data management and so on.
 *
 * @class      EvanUIIdentity
 */
var EvanUIIdentity = /** @class */ (function () {
    function EvanUIIdentity(address) {
        /**
         * List of data containers.
         */
        this.containers = [];
        /**
         * watch for dispatcher updates
         */
        this.dispatcherListeners = [];
        /**
         * is the identity currently loading?
         */
        this.loading = true;
        /**
         * creation is in progress
         */
        this.isCreating = false;
        /**
         * Was the identity adjusted and a save is needed?
         */
        this.dirty = false;
        this.dirtyObjects = [];
        /**
         * is this identity is a favorite?
         */
        this.isFavorite = false;
        this.isFavoriteLoading = false;
        /**
         * show loading, when save process is running
         */
        this.saving = false;
        this.address = address;
        // set initial navigation
        this.navigation = [
            {
                name: 'identity-details',
                active: true,
                children: [
                    { name: 'general', path: address, i18n: true },
                    { name: 'verifications', path: address + "/verifications", i18n: true }
                ]
            },
            {
                name: 'containers',
                active: false,
                children: []
            }
        ];
        // apply this identity address to the last opened identities
        var lastIdentities = getLastOpenedIdentities();
        var existingIndex = lastIdentities.indexOf(address);
        if (existingIndex !== -1) {
            lastIdentities.splice(existingIndex, 1);
        }
        lastIdentities.unshift(address);
        // only save the latest 20 entries
        window.localStorage[latestIdentitiesKey] = JSON.stringify(lastIdentities.slice(0, 20));
    }
    /**
     * Return the default identity config.
     */
    EvanUIIdentity.getIdentityConfig = function (runtime, address, dbcp) {
        return {
            accountId: runtime.activeAccount,
            address: address,
            containerConfig: { accountId: runtime.activeAccount, },
            description: dbcp,
            factoryAddress: '0xE8aB5213BDD998FB39Ed41352a7c84a6898C288a',
        };
    };
    /**
     * Stops all dispatcher listeners and kill the vue store instance, if it's set
     *
     * @param      {any}  vueInstance  a vue instance
     */
    EvanUIIdentity.prototype.destroy = function (vueInstance) {
        if (vueInstance) {
            vueInstance.$store.state.uiIdentity = null;
        }
        this.dispatcherListeners.forEach(function (listener) { return listener(); });
    };
    /**
     * Return the DigitalIdentity instance for the current class instancew.
     *
     * @param      {bccRuntime}  runtime  The runtime
     */
    EvanUIIdentity.prototype.getIdentityInstance = function (runtime) {
        return new bcc.DigitalIdentity(runtime, EvanUIIdentity.getIdentityConfig(runtime, this.address));
    };
    /**
     * Check if currently an synchronisation is running for the favorites.
     */
    EvanUIIdentity.prototype.getFavoriteLoading = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var add, remove;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatchers['favoriteAddDispatcher'].getInstances(runtime)];
                    case 1:
                        add = _a.sent();
                        return [4 /*yield*/, dispatchers['favoriteRemoveDispatcher'].getInstances(runtime)];
                    case 2:
                        remove = _a.sent();
                        return [2 /*return*/, []
                                .concat(Object.keys(add), Object.keys(remove))
                                // filter for the current identity
                                .filter(function (instanceKey) {
                                var instance = add[instanceKey] || remove[instanceKey];
                                return instance.data.address === _this.address;
                            })
                                .length > 0];
                }
            });
        });
    };
    /**
     * Load the initial data for the digital identity
     */
    EvanUIIdentity.prototype.initialize = function (vueInstance, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, identity, _b, _c, _d, _e;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        this.loading = true;
                        // clear all previous watchers
                        this.dispatcherListeners.forEach(function (listener) { return listener(); });
                        this.dispatcherListeners = [];
                        // if we are not loading the create components, show the details.
                        _a = this;
                        return [4 /*yield*/, bcc.DigitalIdentity.getValidity(runtime, this.address)];
                    case 1:
                        // if we are not loading the create components, show the details.
                        _a.validity = _f.sent();
                        if (!this.validity.exists) return [3 /*break*/, 5];
                        identity = this.getIdentityInstance(runtime);
                        _b = this;
                        return [4 /*yield*/, identity.getDescription()];
                    case 2:
                        _b.dbcp = _f.sent();
                        _c = this;
                        return [4 /*yield*/, identity.isFavorite()];
                    case 3:
                        _c.isFavorite = _f.sent();
                        // check for is favorite updates
                        _d = this;
                        return [4 /*yield*/, this.getFavoriteLoading(runtime)];
                    case 4:
                        // check for is favorite updates
                        _d.isFavoriteLoading = _f.sent();
                        this.isFavoriteLoading && this.watchFavoriteLoading(runtime);
                        return [3 /*break*/, 7];
                    case 5:
                        _e = this;
                        return [4 /*yield*/, getIdentityBaseDbcp()];
                    case 6:
                        _e.dbcp = _f.sent();
                        // set default dbcp name
                        this.dbcp.name = this.address;
                        // check for running dispatchers
                        this.setIsCreating(vueInstance, runtime);
                        this.dispatcherListeners.push(dispatchers.identityCreateDispatcher
                            .watch(function () { return _this.setIsCreating(vueInstance, runtime); }));
                        _f.label = 7;
                    case 7:
                        this.setNameTranslations(vueInstance);
                        this.loading = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks for changes and triggers the save dispatcher
     *
     * @param      {bccRuntime}  runtime  bcc runtime
     */
    EvanUIIdentity.prototype.saveChanges = function (runtime) {
        var _this = this;
        if (this.dirty) {
            // lookup dirty objects and pass them into the save object
            var dataToSave_1 = { address: this.address };
            this.dirtyObjects.forEach(function (key) { return dataToSave_1[key] = _this[key]; });
            // start the dispatcher and watch for updates
            this.saving = true;
            dispatchers.identityUpdateDispatcher.start(runtime, dataToSave_1);
        }
    };
    /**
     * Sets a data property and makes the identity dirty.
     *
     * @param      {string}  key     nested key (e.g. dbcp.name)
     * @param      {any}     value   value that should be set
     */
    EvanUIIdentity.prototype.setData = function (key, value) {
        var splitKey = key.split('.');
        var paramKey = splitKey.pop();
        var parentDataObj = this;
        // find the correct nested obj
        splitKey.forEach(function (parentKey) { return parentDataObj = parentDataObj[parentKey]; });
        // make it only dirty, when the value has changed
        if (parentDataObj[paramKey] !== value) {
            parentDataObj[paramKey] = value;
            if (this.dirtyObjects.indexOf(splitKey[0]) === -1) {
                this.dirtyObjects.push(splitKey[0]);
            }
            // make the identity dirty
            this.dirty = true;
        }
    };
    /**
     * Check if the current identity with the specific address is in creation
     */
    EvanUIIdentity.prototype.setIsCreating = function (vueInstance, runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var instances, wasCreating;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatchers.identityCreateDispatcher.getInstances(runtime)];
                    case 1:
                        instances = _a.sent();
                        wasCreating = this.isCreating;
                        // is currently an identity for this address is in creation?
                        this.isCreating = Object.keys(instances)
                            .filter(function (id) { return instances[id].data.address; }).length !== 0;
                        if (!(!this.isCreating && wasCreating)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.initialize(vueInstance, runtime)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Set the translation for the current dbcp name, so the breadcrumbs will be displayed correctly.
     */
    EvanUIIdentity.prototype.setNameTranslations = function (vueInstance) {
        var customTranslation = {};
        var i18n = vueInstance.$i18n;
        customTranslation["_identities.breadcrumbs." + this.address] = this.dbcp.name;
        i18n.add(i18n.locale(), customTranslation);
    };
    /**
     * Toggle the current dispatcher state
     */
    EvanUIIdentity.prototype.toggleFavorite = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var dispatcherName;
            return __generator(this, function (_a) {
                dispatcherName = this.isFavorite ? 'favoriteRemoveDispatcher' : 'favoriteAddDispatcher';
                // start the dispatcher
                dispatchers[dispatcherName].start(runtime, { address: this.address });
                // toggle favorite
                this.isFavorite = !this.isFavorite;
                // only watch, when it wasn't watched before
                if (!this.isFavoriteLoading) {
                    this.isFavoriteLoading = true;
                    this.watchFavoriteLoading(runtime);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Watch for favorite loading updates
     *
     * @param      {bccRuntime}  runtime  The runtime
     */
    EvanUIIdentity.prototype.watchFavoriteLoading = function (runtime) {
        var _this = this;
        var watch = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getFavoriteLoading(runtime)];
                    case 1:
                        _a.isFavoriteLoading = _b.sent();
                        // clear the watchers, when the synchronization has finished
                        if (!this.isFavoriteLoading) {
                            addListener();
                            removeListener();
                            this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(addListener, 1));
                            this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(removeListener, 1));
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        // watch for updates
        var addListener = dispatchers['favoriteAddDispatcher'].watch(watch);
        var removeListener = dispatchers['favoriteRemoveDispatcher'].watch(watch);
        this.dispatcherListeners.push(addListener);
        this.dispatcherListeners.push(removeListener);
    };
    /**
     * Watch for saving updates
     */
    EvanUIIdentity.prototype.watchSaving = function (runtime) {
        return __awaiter(this, void 0, void 0, function () {
            var listener;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, dispatchers.identitySaveDispatcher.watch(function () { return __awaiter(_this, void 0, void 0, function () {
                            var instances;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, dispatchers.identitySaveDispatcher.getInstances(runtime)];
                                    case 1:
                                        instances = _a.sent();
                                        // filter instances for this address
                                        this.saving = Object
                                            .keys(instances)
                                            .filter(function (instanceKey) { return instances[instanceKey].data.address === _this.address; })
                                            .length > 0;
                                        // clear listeners
                                        if (!this.saving) {
                                            listener();
                                            this.dispatcherListeners.splice(this.dispatcherListeners.indexOf(listener, 1));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        listener = _a.sent();
                        this.dispatcherListeners.push(listener);
                        return [2 /*return*/];
                }
            });
        });
    };
    return EvanUIIdentity;
}());
export default EvanUIIdentity;
//# sourceMappingURL=identity.js.map