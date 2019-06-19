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
import * as dataContainer from '@evan.network/datacontainer.digitaltwin';
import * as dtLib from '@evan.network/digitaltwin.lib';

/* tslint:disable */
const i18n: any ={
  "_digitaltwins": {
    "add": "Search",
    "add-digitaltwin": "Add Digital Twin",
    "containerlink": {
      "address": {
        "desc": "Address of the Plugin to be linked to the Digital Twin.",
        "error": "Please enter an address!",
        "title": "Plugin"
      },
      "change-twin": "Change Digital Twin",
      "description1": "Using the input field, You can select an address of a Digital Twin into which You want to link a Plugin. If an existing instance already exists there, it is opened directly for You. If the address is not yet assigned, You can create a new Digital Twin and bind it to this address or link an existing one to this address.",
      "description2": "Using the input field, You can select an address of a Plugin that is to be linked to the Digital Twin.",
      "digitaltwin": "Digital Twin",
      "invalid-container": {
        "desc": "The address entered appears to be incorrect or to correspond to a contract with an invalid format. Please enter the correct address",
        "title": "Invalid Plugin"
      },
      "linking": "Linking existing Plugin",
      "name": {
        "desc": "ENS Address under which the Plugin will be stored in the Digital Twin.",
        "error": "Please enter an ENS Address",
        "title": "ENS Address"
      },
      "use": "Link Plugin"
    },
    "containers": {
      "create": "Add Plugin",
      "desc": "All Plugins associated with the Digital Twin",
      "empty": "Plugins",
      "empty-desc": "Each Digital Twin represents a collection of different Plugins. Each Plugin can contain a set of different metadata (manufacturer information, operating instructions, ...) or list entries (maintenance logs, pictures, ...).<br><br>",
      "empty-desc-perm": "<b class=\"text-center d-block mt-3\">No Plugin has beend added to this Digital Twin. Use the \"Add Plugin\" or \"Link Plugin\" button on the top.</b>",
      "empty-desc-noperm": "<b class=\"text-center d-block mt-3\">No Plugin has beend added to this Digital Twin.",
      "in-creation": "in creation...",
      "link": "Link Plugin",
      "title": "Plugins"
    },
    "createForm": {
      "create": "Create Digital Twin",
      "desc": "Enter the general data of your Digital Twin.",
      "question": {
        "action": "Create",
        "desc": "Confirming this will create the Digital Twin with the specified data, trigger transactions and consume EVE. Would you like to continue?",
        "title": "Create Digital Twin",
        "dont-show": "Don't show anymore"
      }
    },
    "detail": {
      "add-favorite": "Add as favorite",
      "add-favorite-quest": "Do you want to add this Digital Twin to your favorites?",
      "edit": "Edit Description",
      "error": {
        "desc": "The selected address does not correspond to a valid Digital Twin. Please make sure that the correct address has been opened.",
        "title": "Invalid Digital Twin"
      },
      "map-to-ens": "Bind to ENS Address",
      "my-new-twin": "New Digital Twin",
      "remove-favorite": "Remove from favorites",
      "remove-favorite-quest": "Do you really want to remove this Digital Twin from your Favorites?",
      "save": "Save",
      "title": "Metadata of the Digital Twin"
    },
    "digitaltwins": "Twins",
    "dispatcher": {
      "binding": "Digital Twin is bound to domain...",
      "create": "Digital Twin creation",
      "digitaltwin": {
        "create": "Creating Digital Twin",
        "save": "Creating Digital Twin"
      },
      "favorite": {
        "add": "Digital Twin is stored as a favorite",
        "remove": "Digital Twin is removed from favorites"
      },
      "map-ens": "Bind Digital Twin to domain"
    },
    "empty-plugins": "No plugins available...",
    "in-creation": "Creating Digital Twin...",
    "lookup": {
      "address": {
        "desc": "Enter the address of your Digital Twin (e.g.: car.mycompany, 0x0E50465BC6a553f9F55C17380ace4a11B893dd92).",
        "error": "Please enter a valid address",
        "title": "Address of your Digital Twin",
        "use-address": "Bind Digital Twin to ENS Address"
      },
      "already-registered": {
        "desc": "The specified address is not available.",
        "title": "Not available"
      },
      "create": {
        "action": "Create Digital Twin",
        "desc": "There is no Digital Twin yet for this address. Would you like to create a new one for this address?",
        "title": "Create Digital Twin"
      },
      "description": "Using the following input field, it is possible for you to verify an address for a Digital Twin. If an instance already exists there, it will be opened directly for you. If the address is not yet assigned, you can create a new Digital Twin and bind it to this address or link an existing one to this address.",
      "error": {
        "desc": "The requested address does not contain a valid Digital Twin. Please check your input.",
        "title": "Error"
      },
      "missing-balance": {
        "desc": "Before you can create a Digital Twin, you must have purchased the address. You can buy this address for <b>{ensPrice} EVE</b>, but you only have {balance} EVE. Please top up your account to continue",
        "title": "Address available"
      },
      "not-buyable": {
        "desc": "The address given is not available and not for sale.",
        "title": "Not for sale"
      },
      "purchase": {
        "action": "Buy address",
        "desc": "Before you can create a Digital Twin, you must have purchased the specified root address. Would you like to buy this address for <b>{ensPrice} EVE</b>?",
        "title": "Address available"
      },
      "purchasing": "Purchasing ENS address...",
      "title": "Search Digital Twin"
    },
    "map-ens": {
      "check-ens": "Check Domain",
      "description": "Using the previous input field, you can check and select a domain for a Digital Twin.",
      "ens": "Domain address",
      "modal": {
        "available": {
          "action": "Bind Digital Twin",
          "desc": "The given address is available. Do you want to bind this Digital Twin to this address?",
          "title": "Domain available"
        },
        "exists": {
          "desc": "The specified domain is already assigned.",
          "title": "Assign domain"
        }
      },
      "title": "Bind a Digital Twin to a Domain Name"
    },
    "startup": "What would you like to start with?",
    "verifications": {
      "description": "Each Digital Twin and Plugin can be automatically verified. The user interface is currently under development.",
      "title": "Verifications"
    },
    "welcome": "Welcome to the Digital Twin management"
  }
}
/* tslint:enable */

i18n._datacontainer = dataContainer.translations.en._datacontainer;
i18n._digitaltwins.breadcrumbs = dtLib.translations.en.breadcrumbs;

export default i18n;
