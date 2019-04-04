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
import { EvanComponent, EvanForm } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';
import * as dispatchers from '../../dispatchers/registy';
import { getRuntime, getDomainName } from '../../utils';
// empty contract address
var nullAddress = '0x0000000000000000000000000000000000000000';
var LookupComponent = /** @class */ (function (_super) {
    __extends(LookupComponent, _super);
    function LookupComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * formular specific variables
         */
        _this.lookupForm = null;
        /**
         * Switch the texts for the current lookup modal.
         */
        _this.lookupModalScope = '';
        /**
         * params for the modal display
         */
        _this.modalParams = {
            /**
             * currents users balance
             */
            balance: 0,
            /** when the user has entered an ens address, that is not selled, load the ens price and provide
              * the functionallity to purchase it
              */
            ensPrice: 0,
        };
        /**
         * Check if the currenrt user is purchasing an ens address
         */
        _this.purchasingInstances = {};
        /**
         * Show loading during ens check
         */
        _this.checking = false;
        return _this;
    }
    /**
     * Setup the Lookup form.
     */
    LookupComponent.prototype.created = function () {
        var _this = this;
        this.lookupForm = new EvanForm(this, {
            address: {
                value: '',
                validate: function (vueInstance, form) {
                    return this.value.length !== 0;
                }
            },
        });
        /**
         * watch for ens purchase changes
         */
        this.checkPurchasing();
        dispatchers.ensDispatcher.watch(function () { return _this.checkPurchasing(); });
        // auto focus
        this.$nextTick(function () { return _this.lookupForm.address.$ref.focus(); });
    };
    /**
     * Check if the user is currently buyin an ens address.
     */
    LookupComponent.prototype.checkPurchasing = function () {
        return __awaiter(this, void 0, void 0, function () {
            var beforeKeys, beforeAddress, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        beforeKeys = Object.keys(this.purchasingInstances);
                        beforeAddress = beforeKeys.length > 0 ?
                            this.purchasingInstances[beforeKeys[0]].data.ensAddress : null;
                        // load new instances
                        _a = this;
                        return [4 /*yield*/, dispatchers.ensDispatcher
                                .getInstances(getRuntime(this))];
                    case 1:
                        // load new instances
                        _a.purchasingInstances = _b.sent();
                        // if the synchronisation has finished, check the address again
                        if (beforeKeys.length > 0 && Object.keys(this.purchasingInstances).length === 0) {
                            this.lookupForm.address.value = beforeAddress || this.lookupForm.address.value;
                            this.checkAddress();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check, if an identity exists for the address. If not, ask the user to create one. If the user
     * is not the owner of the ens address
     */
    LookupComponent.prototype.checkAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runtime, domainName, address, isValidIdentity, errorMsg, parentOwner, _a, splitAddr, topLevelAdress, _b, _c, _d, ex_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        runtime = getRuntime(this);
                        domainName = getDomainName();
                        address = this.lookupForm.address.value;
                        this.checking = true;
                        // reset lookup modal scope
                        this.lookupModalScope = '';
                        // replace duplicated dots
                        address = address.replace(/\.\./g, '.');
                        // add root domain, if it was not applied and it is not an contract
                        if (address.indexOf('0x') !== 0 &&
                            address.indexOf(domainName, address.length - domainName.length) === -1) {
                            this.lookupForm.address.value = address = address + "." + domainName;
                        }
                        return [4 /*yield*/, bcc.DigitalIdentity.getValidity(runtime, address)];
                    case 1:
                        isValidIdentity = _e.sent();
                        if (!isValidIdentity.valid) return [3 /*break*/, 2];
                        this.evanNavigate(address);
                        // trigger reload
                        this.$store.state.uiIdentity && this.$store.state.uiIdentity.destroy(this);
                        return [3 /*break*/, 14];
                    case 2:
                        errorMsg = isValidIdentity.error.message;
                        if (!(errorMsg.indexOf('contract does not exist') !== -1)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.getParentRecursive(address)];
                    case 3:
                        parentOwner = _e.sent();
                        if (!(parentOwner === runtime.activeAccount)) return [3 /*break*/, 4];
                        this.lookupModalScope = 'create';
                        return [3 /*break*/, 11];
                    case 4:
                        if (!(parentOwner === nullAddress)) return [3 /*break*/, 10];
                        // load the currents users balance
                        _a = this.modalParams;
                        return [4 /*yield*/, dappBrowser.core.getBalance(runtime.activeAccount)];
                    case 5:
                        // load the currents users balance
                        _a.balance = _e.sent();
                        _e.label = 6;
                    case 6:
                        _e.trys.push([6, 8, , 9]);
                        splitAddr = address.split('.');
                        topLevelAdress = splitAddr.slice(splitAddr.length - 2, splitAddr.length)
                            .join('.');
                        _b = this.modalParams;
                        _d = (_c = runtime.web3.utils).fromWei;
                        return [4 /*yield*/, runtime.nameResolver.getPrice(topLevelAdress)];
                    case 7:
                        _b.ensPrice = _d.apply(_c, [_e.sent()]);
                        return [3 /*break*/, 9];
                    case 8:
                        ex_1 = _e.sent();
                        runtime.logger.log(ex_1, 'error');
                        this.lookupModalScope = 'not-buyable';
                        return [3 /*break*/, 9];
                    case 9:
                        // when it's not buyable, check if the user has enough funds
                        if (this.lookupModalScope !== 'not-buyable') {
                            // check for users balance
                            if (this.modalParams.balance < this.modalParams.ensPrice) {
                                this.lookupModalScope = 'missing-balance';
                            }
                            else {
                                this.lookupModalScope = 'purchase';
                            }
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        this.lookupModalScope = 'already-registered';
                        _e.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        this.lookupModalScope = 'error';
                        _e.label = 13;
                    case 13:
                        this.$refs.lookupModal && this.$refs.lookupModal.show();
                        _e.label = 14;
                    case 14:
                        this.checking = false;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the parent owner.
     *
     * @param      {any}     runtime  bcc runtime
     * @param      {string}  address  ens address
     */
    LookupComponent.prototype.getParentRecursive = function (address, owner) {
        if (owner === void 0) { owner = nullAddress; }
        return __awaiter(this, void 0, void 0, function () {
            var runtime, namehash, ex_2, splitAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        runtime = getRuntime(this);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        namehash = runtime.nameResolver.namehash(address);
                        return [4 /*yield*/, runtime.executor.executeContractCall(runtime.nameResolver.ensContract, 'owner', namehash)];
                    case 2:
                        owner = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ex_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        if (owner === runtime.activeAccount) {
                            return [2 /*return*/, owner];
                        }
                        else {
                            splitAddress = address.split('.');
                            if (splitAddress.length > 2) {
                                return [2 /*return*/, this.getParentRecursive(splitAddress.splice(1, splitAddress.length).join('.'), owner)];
                            }
                            else {
                                return [2 /*return*/, owner];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Buy the current address.
     */
    LookupComponent.prototype.purchaseAdress = function () {
        var _this = this;
        // start the dispatcher
        dispatchers.ensDispatcher.start(getRuntime(this), { ensAddress: this.lookupForm.address.value });
        // hide modal
        this.$refs.lookupModal.hide();
        // show loading
        this.$nextTick(function () { return _this.checkPurchasing(); });
    };
    /**
     * open identity address
     */
    LookupComponent.prototype.createIdentity = function () {
        this.evanNavigate(this.lookupForm.address.value);
        // trigger reload
        this.$store.state.uiIdentity && this.$store.state.uiIdentity.destroy(this);
        // hide modal
        this.$refs.lookupModal.hide();
    };
    LookupComponent = __decorate([
        Component({})
    ], LookupComponent);
    return LookupComponent;
}(mixins(EvanComponent)));
export default LookupComponent;
//# sourceMappingURL=lookup.js.map