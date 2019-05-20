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
import * as digitalTwin from '@evan.network/digitaltwin';

/* tslint:disable */
export default {
  "_digitaltwins": {
    "breadcrumbs": digitalTwin.translations.en._digitaltwins.breadcrumbs,
    "digitaltwins": {
      "create": "Create Digital Twin",
      "desc": "Overview of my Digital Twins.",
      "empty": "My Digital Twins",
      "empty-desc": "Machines, cars, products, and people can all be represented with a digital twin. Digital twins mirror the asset’s or person’s attributes and status on the blockchain. Creating a twin for cars, forklifts, and other assets enables them to report their status to the network in fractions of a second and respond to requests autonomously.<br><br>A Digital Twin therefore is a unique representation of a real world object in the evan.network. It can hold attributes and any other data about the real world object, and implement operations and tasks concerning the real world object, all cryptographically secured on the blockchain.<br><br><b class=\"text-center d-block mt-3\">Use the \"Create Digital Twin\" or \"Open Digital Twin\" button to create a new one or to open an existing one.</b>",
      "in-creation": "Creating Digital Twin...",
      "open": "Open Digital Twin",
      "title": "My Digital Twins"
    },
    "plugins": {
      "create": "Create Plugin",
      "desc": "Recent plugins or create new ones",
      "empty": "My Plugins",
      "empty-desc": "In each Digital Twin different plugins can be installed for different topics like <b>machine-specific metadata</b>, <b>service log</b> or a calendar. Each plugin contains information about permissions, data specifications, including their format and validation and user interfaces. <br><br><b class=\"text-center d-block mt-3\">You have not yet created any plugins. Use the \"Create a Plugin\" button to create a new one.</b>",
      "in-creation": "Creating Plugin...",
      "title": "My Plugins"
    },
    "plugins-overview": "My plugins"
  }
}
/* tslint:enable */;
