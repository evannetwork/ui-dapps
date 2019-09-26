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
      "create": "Digitalen Zwilling erstellen",
      "desc": "Übersicht meiner Digitalen Zwillinge",
      "empty": "Meine Digitalen Zwillinge",
      "empty-desc": "Maschinen, Autos, Produkte und Menschen können alle mit einem digitalen Zwilling dargestellt werden. Digitale Zwillinge spiegeln die Attribute und den Status des Assets oder der Person in der Blockchain wieder. Die Erstellung eines Zwillings für Autos, Gabelstapler und andere Anlagen ermöglicht es Ihnen, ihren Status in Bruchteilen einer Sekunde an das Netzwerk zu melden und autonom auf Anfragen zu reagieren.<br><br><br>Ein Digitaler Zwilling ist daher eine einzigartige Darstellung eines realen Objekts im evan.network. Es kann Attribute und alle anderen Daten über das reale Objekt enthalten, und Operationen und Aufgaben bezüglich des realen Objekts implementieren, die alle kryptographisch auf der Blockchain gesichert sind.<br><br><b class=\"text-center d-block mt-3\">Sie haben noch keinen digitalen Zwilling geöffnet oder favoritisiert. Benutzen Sie den \"Digitalen Zwilling erstellen\" oder \"Digitalen Zwilling öffnen\" Button, um einen Neuen zu erstellen oder einen Bestehenden zu öffnen.</b>",
      "in-creation": "Digitaler Zwilling wird erstellt...",
      "open": "Digitalen Zwilling suchen",
      "title": "Meine Digitalen Zwillinge"
    },
    "plugins": {
      "create": "Plugin Erstellen",
      "desc": "Übersicht meiner Plugins",
      "empty": "Meine Plugins",
      "empty-desc": "In jedem Digitalen Zwilling können verschiede Plugins zu verschiedenen Thematiken wie <b>Maschinespezifische Metadaten</b>, <b>Service Log</b> oder ein Kalender installiert werden. Jedes Plugin enthält Informationen zu Berechtigungen, Datenspezifikationen, inklusive deren Format und Validierung und Oberflächen. <br><br><b class=\"text-center d-block mt-3\">Sie haben noch keine Plugins erstellt. Benutzen Sie \"Plugin erstellen\", um ein neues zu erstellen.</b>",
      "in-creation": "Plugin wird erstellt...",
      "title": "Meine Plugins"
    },
    "plugins-overview": "Meine Plugins"
  }
}

i18n._datacontainer = dataContainer.translations.de._datacontainer;
i18n._digitaltwins = Object.assign(
  digitaltwin.translations.de._digitaltwins,
  i18n._digitaltwins,
);

export default i18n;
/* tslint:enable */
