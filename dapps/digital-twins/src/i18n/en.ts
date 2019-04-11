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

/* tslint:disable */
export default {
  "_digitaltwins": {
    "add": "Open",
    "add-digitaltwin": "Add digital Twin",
    "breadcrumbs": {
      "add": "Add",
      "containerlink": "Link Data Container",
      "containers": "Data container overview",
      "datacontainer.digitaltwin": "Data Container",
      "digitaltwins": "Digital Twins",
      "lookup": "Open",
      "overview": "Favorites & last digitaltwins",
      "templates": "Templates",
      "verifications": "Verifications"
    },
    "containerlink": {
      "address": {
        "desc": "Address of the data container to be linked to the digital twin.",
        "error": "Please enter an address!",
        "title": "Data Container"
      },
      "description1": "Using the following input field, you can select an address of a digital twin into which you want to link a data container. If an existing instance already exists there, it is opened directly for you. If the address is not yet assigned, you can create a new digital twin and bind it to this address or link an existing one to this address.",
      "description2": "Using the following input field, you can select an address of a data container that is to be linked to the digital twin.",
      "invalid-container": {
        "desc": "The address entered appears to be incorrect or to correspond to a contract with an invalid format. Please enter the correct address",
        "title": "Invalid data container"
      },
      "linking": "Linking",
      "name": {
        "desc": "Alias under which the container will be stored in the digital twin.",
        "error": "Please enter an alias",
        "title": "Alias"
      },
      "use": "Link"
    },
    "containers": {
      "create": "Create",
      "empty": "Data Container",
      "empty-desc": "No data container has yet been created for this digital Twin. Use the \"create\" or \"link\" button to create a new data container or to link an existing one.",
      "in-creation": "in creation...",
      "link": "Link"
    },
    "context-menu": {
      "link": "Link data container"
    },
    "digitaltwins": "Twins",
    "dispatcher": {
      "create": "Digital digitaltwin creation",
      "digitaltwin": {
        "create": "Creating Digital digitaltwin",
        "save": "Creating Digital digitaltwin"
      },
      "favorite": {
        "add": "Digital digitaltwin is stored as a favorite",
        "remove": "Digital digitaltwin is removed from favorites"
      }
    },
    "empty-navigation": "No entries available",
    "generalForm": {
      "create": "Create",
      "description": {
        "desc": "Short description for the digital Twin",
        "title": "Description"
      },
      "name": {
        "desc": "Name of the digital DigitalTwin",
        "error": "Please provide a name!",
        "title": "Name"
      },
      "save": "Speichern",
      "title": "General Information"
    },
    "in-creation": "Creating Digital DigitalTwin...",
    "left-categories": {
      "container-overview": "Data container overview",
      "containers": {
        "desc": "All data containers associated with the digital Twin",
        "title": "Data containers"
      },
      "digitaltwin-details": {
        "desc": "General information about the digital Twin.",
        "title": "Digital DigitalTwin"
      },
      "digitaltwin-overview": "Favorites & last digitaltwins",
      "general": "Metadata",
      "my-digitaltwins": {
        "desc": "Last digitaltwins or open new ones",
        "title": "My Twins"
      },
      "my-templates": {
        "desc": "Last templates or create new ones",
        "title": "My Templates"
      },
      "open-digitaltwin": "Open digital Twin",
      "verifications": "Verifications"
    },
    "lookup": {
      "address": {
        "desc": "Enter the address of your digital Twin (e.g.: car.mycompany, 0x0E50465BC6a553f9F55C17380ace4a11B893dd92).",
        "error": "Please enter a valid address",
        "title": "Address"
      },
      "already-registered": {
        "desc": "The specified address is not available.",
        "title": "Not available"
      },
      "create": {
        "action": "Create digital Twin",
        "desc": "There is no digital Twin yet for this address. Would you like to create a new one for this address?",
        "title": "Not available"
      },
      "description": "Using the following input field, it is possible for you to verify an address for a digital Twin. If an instance already exists there, it will be opened directly for you. If the address is not yet assigned, you can create a new digital Twin and bind it to this address or link an existing one to this address.",
      "error": {
        "desc": "The requested address does not contain a valid digital Twin. Please check your input.",
        "title": "Error"
      },
      "missing-balance": {
        "desc": "Before you can create a digital DigitalTwin, you must have purchased the address provided. You can buy this address for <b>{ensPrice} EVE</b>, but you only have {balance} EVE. Please top up your account to continue",
        "title": "Address available"
      },
      "not-buyable": {
        "desc": "The address given is not available and not for sale.",
        "title": "Not for sale"
      },
      "purchase": {
        "action": "Buy address",
        "desc": "Before you can create a digital DigitalTwin, you must have purchased the specified root address. Would you like to buy this address for <b>{ensPrice} EVE</b>?",
        "title": "Address available"
      },
      "purchasing": "Purchasing ENS address...",
      "title": "Open"
    },
    "overview": {
      "empty": "Favorites & last digitaltwins",
      "empty-desc": "You have not yet opened or favored any digital Twins. Use \"open\" button to open a digital Twin or to create a new one.",
      "favorites": "My Favorites",
      "lastTwins": "Last opened",
      "title": "Overview"
    },
    "start": {
      "add": {
        "desc": "Add a digital Twin based on your existing templates or open a existing one.",
        "title": "Open digital Twin"
      },
      "overview": {
        "desc": "Overview about my and last opened digitaltwins.",
        "title": "My digital Twins"
      },
      "templates": {
        "desc": "Manage templates for your digital Twins.",
        "title": "My Templates"
      }
    },
    "startup": "What would you like to start with?",
    "unlock-digitaltwin-panel": "<b>The opened digital Twin is in creation.</b><br><br>Please finish creation to unlock the page navigation.",
    "welcome": "Welcome to the digital Twin management"
  }
}
/* tslint:enable */;
