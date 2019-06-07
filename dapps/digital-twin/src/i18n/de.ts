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
const i18n: any = {
  "_digitaltwins": {
    "add": "Suchen",
    "add-digitaltwin": "Neuer digitaler Zwilling",
    "containerlink": {
      "address": {
        "desc": "Adresse des Plugins der in den digitalen Zwilling verknüpft werden soll.",
        "error": "Bitte geben Sie eine Adresse ein!",
        "title": "Plugin"
      },
      "change-twin": "Digitalen Zwilling ändern",
      "description1": "Über das Eingabefeld können Sie die Adresse eines digitalen Zwillings auswählen in den Sie einen Plugin verknüpfen wollen. Existiert dort bereits eine bestehende Instanz, wird diese direkt für Sie geöffnet. Ist die Adresse noch nicht vergeben, können Sie einen neuen digitalen Zwilling erstellen und an diese Adresse binden, oder eine bestehende mit dieser Adresse verknüpfen.",
      "description2": "Über das Eingabefeld können Sie eine Adresse eines Datencontainers auswählen, der in den digitalen Zwilling verknüpft werden soll.",
      "digitaltwin": "Digitaler Zwilling",
      "invalid-container": {
        "desc": "Die eingebene Adresse ist falsch oder entspricht einem Vertrag mit ungültigem Format. Bitte geben Sie eine korrekte Adresse ein.",
        "title": "Ungültiger Plugin"
      },
      "linking": "Bestehendes Plugin Wird verknüpft...",
      "name": {
        "desc": "ENS Adresse, unter dem der Container in dem digitalen Zwilling gespeichert werden soll.",
        "error": "Bitte geben Sie einen ENS Adresse ein!",
        "title": "ENS Adresse"
      },
      "use": "Plugin verknüpfen"
    },
    "containers": {
      "create": "Plugin hinzufügen",
      "empty": "Plugins",
      "empty-desc": "Jeder Digitale Zwilling repräsentiert eine Zusammenstellung aus verschiedenen Plugins. Jedes Plugin kann eine Zusammenstellung verschiedener Metadaten (Herstellerinformationen, Bedienungsanleitungen, ...) oder Listeneinträgen (Wartungsprotokoll, Bilder, ...) enthalten.<br><br><b class=\"text-center d-block mt-3\">Für diesen Digitalen Zwilling wurde noch kein Plugin hinzugefügt. Nutzen Sie den \"erstellen\" oder \"verknüpfen\" Button, um ein neues Plugin zu erstellen oder eine bestehende Plugin-Instanz zu verknüpfen.</b>",
      "in-creation": "wird erstellt...",
      "link": "Plugin-Instanz verknüpfen",
      "title": "Plugins"
    },
    "createForm": {
      "create": "Digitalen Zwilling erstellen",
      "desc": "Geben Sie die generellen Daten Ihres Digitalen Zwillings an.",
      "question": {
        "action": "Erstellen",
        "desc": "Haben Sie alle Daten korrekt angegeben?",
        "title": "Digitalen Zwilling erstellen"
      }
    },
    "detail": {
      "add-favorite": "Als Favorit hinzufügen",
      "add-favorite-quest": "Wollen Sie diesen Digitalen Zwilling als Favoriten hinzufügen?",
      "edit": "Beschreibung anpassen",
      "error": {
        "desc": "Die ausgewählte Adresse entspricht keinem gültigen Digitalen Zwilling. Bitte gehen Sie sicher, dass die korrekt Adresse geöffnet wurde.",
        "title": "Ungültiger Digitaler Zwilling"
      },
      "map-to-ens": "An Domainnamen binden",
      "my-new-twin": "Neuer Digitaler Zwilling",
      "remove-favorite": "Als Favorit entfernen",
      "remove-favorite-quest": "Wollen Sie diesen Digitalen Zwilling wirklich von den Favoriten entfernen?",
      "save": "Speichern",
      "title": "Metadaten des Digitalen Zwillings"
    },
    "digitaltwins": "Digitale Zwillinge",
    "dispatcher": {
      "binding": "Digitaler Zwilling wird an Domain gebunden...",
      "create": "Digitaler Zwilling wird erstellt",
      "digitaltwin": {
        "create": "Digitaler Zwilling wird erstellt",
        "save": "Digitaler Zwilling wird gespeichert"
      },
      "favorite": {
        "add": "Digitaler Zwilling wird als Favorit gespeichert",
        "remove": "Digitaler Zwilling wird aus den Favoriten entfernt"
      },
      "map-ens": "Digitalen Zwilling an Domain binden"
    },
    "empty-navigation": "Keine Einträge verfügbar",
    "in-creation": "In Erstellung...",
    "lookup": {
      "address": {
        "desc": "Geben Sie die Adresse Ihres digitalen Zwillings ein (z.B.: auto.meinefirma, 0x0E50465BC6a553f9F55C17380ace4a11B893dd92).",
        "error": "Bitte geben Sie eine gültige Adresse ein!",
        "title": "Adresse Ihres Digitalen Zwillings",
        "use-address": "Digitalen Zwilling auf ENS Adresse binden"
      },
      "already-registered": {
        "desc": "Die angegebene Adresse ist nicht verfügbar und gehört bereits einem anderen Nutzer.",
        "title": "Nicht verfügbar"
      },
      "create": {
        "action": "Digitale Zwilling erstellen",
        "desc": "Für diese Adresse existiert noch kein digitaler Zwilling. Möchten Sie einen neuen für diese Adresse erstellen?",
        "title": "Digitale Zwilling erstellen"
      },
      "description": "Über das Eingabefeld ist es Ihnen möglich eine Adresse für einen digitalen Zwilling zu überprüfen. Existiert dort bereits eine bestehende Instanz, wird diese direkt für Sie geöffnet. Ist die Adresse noch nicht vergeben, können Sie einen neuen digitalen Zwilling erstellen und an diese Adresse binden, oder eine bestehende mit dieser Adresse verknüpfen.",
      "error": {
        "desc": "Die angeforderte Adresse enthält keinen validen digitalen Zwilling. Bitte überprüfen Sie Ihre Eingabe.",
        "title": "Fehler beim Laden"
      },
      "missing-balance": {
        "desc": "Bevor Sie einen digitalen Zwilling erstellen können, müssen Sie die angegebe Adresse besitzen. Sie können diese Adresse für <b>{ ensPrice }EVE</b> kaufen, besitzen allerdings nur { balance } EVE. Bitte stocken Sie Ihr Konto auf um fortzufahren.",
        "title": "Adresse verfügbar"
      },
      "not-buyable": {
        "desc": "Die angegebene Adresse ist nicht verfügbar.",
        "title": "Nicht verfügbar"
      },
      "purchase": {
        "action": "Adresse kaufen",
        "desc": "Bevor Sie einen digitalen Zwilling erstellen können, müssen Sie die angegebe Adresse besitzen. Möchten Sie diese Adresse für <b>{ ensPrice } EVE</b> kaufen?",
        "title": "Adresse verfügbar"
      },
      "purchasing": "ENS Adresse erwerben...",
      "title": "Digitalen Zwilling suchen"
    },
    "map-ens": {
      "check-ens": "Domain überprüfen",
      "description": "Über das vorherige Eingabefeld, ist es Ihnen möglich, eine Domain für einen digitale Zwilling zu überprüfen und auszuwählen.",
      "ens": "Domain Addresse",
      "modal": {
        "available": {
          "action": "Digitalen Zwilling binden",
          "desc": "Die angegeben Adresse ist verfügbar. Wollen Sie diesen Digitalen Zwilling auf diese Adresse binden?",
          "title": "Domain verfügbar"
        },
        "exists": {
          "desc": "Die angegeben Domain ist bereits vergeben.",
          "title": "Domain vergeben"
        }
      },
      "title": "Digitalen Zwilling auf Domainnamen binden"
    },
    "startup": "Womit möchten Sie starten?",
    "verifications": {
      "description": "An jeden digitalen Zwilling und Plugin können automatisiert Verizifierungen vergeben werden. Die Darstellung der Oberfläche befindet sich momentan in der Entwicklung.",
      "title": "Verizifierungen"
    },
    "welcome": "Willkommen in der digitalen Zwillingsverwaltung"
  }
}
/* tslint:enable */

i18n._datacontainer = dataContainer.translations.de._datacontainer;
i18n._digitaltwins.breadcrumbs = dtLib.translations.de.breadcrumbs;

export default i18n;
