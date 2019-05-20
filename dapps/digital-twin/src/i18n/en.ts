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

/* tslint:disable */
export default {
  "_digitaltwins": {
    "add": "Open",
    "add-digitaltwin": "Add Digital Twin",
    "breadcrumbs": dataContainer.translations.en._digitaltwins.breadcrumbs
    "containerlink": {
      "address": {
        "desc": "Address of the data container to be linked to the digital twin.",
        "error": "Please enter an address!",
        "title": "Data Container"
      },
      "change-twin": "Change Digital Twin",
      "description1": "Using the input field, You can select an address of a digital twin into which You want to link a data container. If an existing instance already exists there, it is opened directly for You. If the address is not yet assigned, You can create a new digital twin and bind it to this address or link an existing one to this address.",
      "description2": "Using the input field, You can select an address of a data container that is to be linked to the digital twin.",
      "digitaltwin": "Digital Twin",
      "invalid-container": {
        "desc": "The address entered appears to be incorrect or to correspond to a contract with an invalid format. Please enter the correct address",
        "title": "Invalid Data Container"
      },
      "linking": "Linking",
      "name": {
        "desc": "Alias under which the container will be stored in the digital twin.",
        "error": "Please enter an alias",
        "title": "Alias"
      },
      "use": "Link Data Container"
    },
    "containers": {
      "create": "Create",
      "empty": "Data Container",
      "empty-desc": "Each Digital Twin represents a collection of different data containers. Each data container can contain a set of different metadata (manufacturer information, operating instructions, ...) or list entries (maintenance logs, pictures, ...).<br><br><b class=\"text-center d-block mt-3\">No data container has yet been created for this digital twin. Use the \"create\" or \"link\" button on the top to create a new data container or link to an existing one.</b>",
      "in-creation": "in creation...",
      "link": "Link"
    },
    "context-menu": {
      "link": "Link Data Container"
    },
    "digitaltwins": "Twins",
    "dispatcher": {
      "binding": "Digital twin is bound to domain...",
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
    "empty-navigation": "No entries available",
    "generalForm": {
      "add-favorite": "Add as favorite",
      "create": "Create",
      "description": {
        "desc": "Short description for the Digital Twin",
        "title": "Description"
      },
      "map-to-ens": "Bind to domain name",
      "my-new-twin": "New Digital Twin",
      "name": {
        "desc": "Name of the Digital Twin",
        "error": "Please provide a name!",
        "title": "Name"
      },
      "remove-favorite": "Remove from favorites",
      "save": "Save",
      "title": "Metadata"
    },
    "in-creation": "Creating Digital Twin...",
    "left-categories": {
      "container-overview": "Data Container overview",
      "containers": {
        "desc": "All Data Containers associated with the Digital Twin",
        "title": "Data Containers"
      },
      "digitaltwin-details": {
        "desc": "General information about the Digital Twin.",
        "title": "Digital Twin"
      },
      "general": "General information",
      "verifications": "Verifications"
    },
    "lookup": {
      "address": {
        "desc": "Enter the address of your Digital Twin (e.g.: car.mycompany, 0x0E50465BC6a553f9F55C17380ace4a11B893dd92).",
        "error": "Please enter a valid address",
        "title": "Address of your Digital Twin",
        "use-address": "Bind digital twin to ens address"
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
      "title": "Open Digital Twin"
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
    "unlock-digitaltwin-panel": "<b>This Digital Twin is being created.</b><br><br>Please finish creation to see the page navigation.",
    "verifications": {
      "description": "Each Digital Twin and Data Container can be automatically verified. The user interface is currently under development.",
      "title": "Verifications"
    },
    "welcome": "Welcome to the Digital Twin management"
  }
}
/* tslint:enable */;
