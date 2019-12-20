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
import * as dtLib from '@evan.network/digitaltwin.lib';

/* tslint:disable */
const i18n: any = {
  "_digitaltwins": {
    "add": "Suchen",
    "add-digitaltwin": "Neuer Digitaler Zwilling",
    "containerlink": {
      "address": {
        "desc": "Adresse des Plugins, welches in den Digitalen Zwilling verknüpft werden soll.",
        "error": "Bitte geben Sie eine Adresse ein.",
        "title": "Plugin"
      },
      "change-twin": "Digitalen Zwilling ändern",
      "description1": "Über das Eingabefeld können Sie die Adresse eines Digitalen Zwillings auswählen in den Sie ein Plugin verknüpfen wollen. Existiert dort bereits eine bestehende Instanz, wird diese direkt für Sie geöffnet. Ist die Adresse noch nicht vergeben, können Sie einen neuen Digitalen Zwilling erstellen und an diese Adresse binden, oder einen bestehenden Zwilling mit dieser Adresse verknüpfen.",
      "description2": "Über das Eingabefeld können Sie eine Adresse eines Plugins auswählen, das in den Digitalen Zwilling verknüpft werden soll.",
      "digitaltwin": "Digitaler Zwilling",
      "invalid-container": {
        "desc": "Die eingegebene Adresse ist falsch oder entspricht einem Vertrag mit ungültigem Format. Bitte geben Sie eine korrekte Adresse ein.",
        "title": "Ungültiges Plugin"
      },
      "linking": "Bestehendes Plugin wird verknüpft...",
      "name": {
        "desc": "ENS Adresse, unter dem das Plugin in dem Digitalen Zwilling gespeichert werden soll.",
        "error": "Bitte geben Sie einen ENS Adresse ein.",
        "title": "ENS Adresse"
      },
      "use": "Plugin verknüpfen"
    },
    "containers": {
      "create": "Plugin hinzufügen",
      "empty": "Plugins",
      "empty-desc": "Jeder Digitale Zwilling repräsentiert eine Zusammenstellung aus verschiedenen Plugins. Jedes Plugin kann eine Zusammenstellung verschiedener Metadaten (Herstellerinformationen, Bedienungsanleitungen, ...) oder Listeneinträgen (Wartungsprotokoll, Bilder, ...) enthalten.<br><br>",
      "empty-desc-perm": "<b class=\"text-center d-block mt-3\">In diesen Digitalen Zwilling wurde noch kein Plugin hinzugefügt. Nutzen Sie den \"Plugin hinzufügen\" oder \"Plugin-Instanz verknüpfen\" Button, um ein neues Plugin zu erstellen oder eine bestehende Plugin-Instanz zu verknüpfen.</b>",
      "empty-desc-noperm": "<b class=\"text-center d-block mt-3\">In diesen Digitalen Zwilling wurde noch kein Plugin hinzugefügt.</b>",
      "in-creation": "wird erstellt...",
      "link": "Plugin-Instanz verknüpfen",
      "title": "Plugins"
    },
    "createForm": {
      "create": "Digitalen Zwilling erstellen",
      "desc": "Geben Sie die generellen Daten Ihres Digitalen Zwillings an.",
      "question": {
        "action": "Erstellen",
        "desc": "Durch das Bestätigen, wird der Digitale Zwilling mit den angegeben Daten erstellt, Transaktionen ausgelöst und EVE verbraucht. Möchten Sie fortfahren?",
        "title": "Digitalen Zwilling erstellen",
        "dont-show": "Nicht mehr anzeigen"
      }
    },
    "detail": {
      "add-favorite": "Als Favorit hinzufügen",
      "add-favorite-quest": "Wollen Sie diesen Digitalen Zwilling als Favoriten hinzufügen?",
      "edit": "Beschreibung anpassen",
      "error": {
        "desc": "Die ausgewählte Adresse entspricht keinem gültigen Digitalen Zwilling. Bitte gehen Sie sicher, dass die korrekte Adresse geöffnet wurde.",
        "title": "Ungültiger Digitaler Zwilling"
      },
      "map-to-ens": "An Domainnamen binden",
      "my-new-twin": "Neuer Digitaler Zwilling",
      "remove-favorite": "Von den Favoriten entfernen",
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
    "empty-plugins": "Keine Plugins verfügbar...",
    "in-creation": "In Erstellung...",
    "lookup": {
      "address": {
        "desc": "Geben Sie die Adresse Ihres Digitalen Zwillings ein (z.B.: auto.meinefirma, 0x0E50465BC6a553f9F55C17380ace4a11B893dd92).",
        "error": "Bitte geben Sie eine gültige Adresse ein.",
        "title": "Adresse Ihres Digitalen Zwillings",
        "use-address": "Digitalen Zwilling auf ENS Adresse binden"
      },
      "already-registered": {
        "desc": "Die angegebene Adresse ist nicht verfügbar und gehört bereits einem anderen Nutzer.",
        "title": "Nicht verfügbar"
      },
      "create": {
        "action": "Digitalen Zwilling erstellen",
        "desc": "Für diese Adresse existiert noch kein Digitaler Zwilling. Möchten Sie einen neuen für diese Adresse erstellen?",
        "title": "Digitalen Zwilling erstellen"
      },
      "description": "Über das Eingabefeld ist es Ihnen möglich, eine Adresse für einen Digitalen Zwilling zu überprüfen. Existiert dort bereits eine bestehende Instanz, wird diese direkt für Sie geöffnet. Ist die Adresse noch nicht vergeben, können Sie einen neuen Digitalen Zwilling erstellen und an diese Adresse binden, oder einen bestehenden Digitalen Zwilling mit dieser Adresse verknüpfen.",
      "error": {
        "desc": "Die angeforderte Adresse enthält keinen validen Digitalen Zwilling. Bitte überprüfen Sie Ihre Eingabe.",
        "title": "Fehler beim Laden"
      },
      "missing-balance": {
        "desc": "Bevor Sie einen Digitalen Zwilling erstellen können, müssen Sie die angegebene Adresse besitzen. Sie können diese Adresse für <b>{ ensPrice }EVE</b> kaufen, besitzen allerdings nur { balance } EVE. Bitte stocken Sie Ihr Konto auf, um fortzufahren.",
        "title": "Adresse verfügbar"
      },
      "not-buyable": {
        "desc": "Die angegebene Adresse ist nicht verfügbar.",
        "title": "Nicht verfügbar"
      },
      "purchase": {
        "action": "Adresse kaufen",
        "desc": "Bevor Sie einen Digitalen Zwilling erstellen können, müssen Sie die angegebene Adresse besitzen. Möchten Sie diese Adresse für <b>{ ensPrice } EVE</b> kaufen?",
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
      "description": "An jeden Digitalen Zwilling und Plugin können automatisiert Verifizierungen vergeben werden. Die Darstellung der Oberfläche befindet sich momentan in der Entwicklung.",
      "title": "Verifizierungen"
    },
    "welcome": "Willkommen in der Digitalen Zwillingsverwaltung"
  }
}
/* tslint:enable */

i18n._datacontainer = dataContainer.translations.de._datacontainer;
i18n._digitaltwins.breadcrumbs = dtLib.translations.de.breadcrumbs;

export default i18n;
