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
import * as dataContainer from '@evan.network/datacontainer.digitaltwin';
import * as digitaltwin from '@evan.network/digitaltwin';
import * as dtLib from '@evan.network/digitaltwin.lib';

/* tslint:disable */
const i18n: any = {
  "_digitaltwins": {
    "digitaltwins": {
      "create": "Create Digital Twin",
      "desc": "Overview of my Digital Twins",
      "empty": "My Digital Twins",
      "empty-desc": "Machines, cars, products, and people can all be represented with a digital twin. Digital twins mirror the asset’s or person’s attributes and status on the blockchain. Creating a twin for cars, forklifts, and other assets enables them to report their status to the network in fractions of a second and respond to requests autonomously.<br><br>A Digital Twin therefore is a unique representation of a real world object in the evan.network. It can hold attributes and any other data about the real world object, and implement operations and tasks concerning the real world object, all cryptographically secured on the blockchain.<br><br><b class=\"text-center d-block mt-3\">Use the \"Create Digital Twin\" or \"Open Digital Twin\" button to create a new one or to open an existing one.</b>",
      "in-creation": "Creating Digital Twin...",
      "open": "Search Digital Twin",
      "title": "My Digital Twins"
    },
    "plugins": {
      "create": "Create Plugin",
      "desc": "Overview about my Plugin Templates",
      "empty": "My Plugins",
      "empty-desc": "In each Digital Twin different plugins can be installed for different topics like <b>machine-specific metadata</b>, <b>service log</b> or a calendar. Each plugin contains information about permissions, data specifications, including their format and validation and user interfaces. <br><br><b class=\"text-center d-block mt-3\">You have not yet created any plugins. Use the \"Create a Plugin\" button to create a new one.</b>",
      "in-creation": "Creating Plugin...",
      "title": "My Plugins"
    },
    "plugins-overview": "My plugins"
  }
}

i18n._datacontainer = dataContainer.translations.en._datacontainer;
i18n._digitaltwins = Object.assign(
  digitaltwin.translations.en._digitaltwins,
  i18n._digitaltwins,
);

export default i18n;
/* tslint:enable */
