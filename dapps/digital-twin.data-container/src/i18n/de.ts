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
import * as dtLib from '@evan.network/digitaltwin.lib';

/* tslint:disable */
const i18n: any = {
  "_datacontainer": {
    "ajv": {
      "add": "Feld hinzufügen",
      "edit-schema": "Schema bearbeiten",
      "empty": "nicht gesetzt",
      "errors": {
        "missing-max": "nicht spezifiziert",
        "missing-min": "nicht spezifiziert",
        "text": "Der angegebene Wert muss vom Typ \"{typ}\" sein! (min: {min}, max: {max})"
      },
      "files-no-default": "Felder vom Typ Datei können keine Standardwerte enthalten.",
      "max": {
        "desc": "Maximalwert",
        "error": "Der Maximalwert muss immer größer gleich dem Minimalwert sein.",
        "title": "Max."
      },
      "min": {
        "desc": "Minimalwert (leer lassen um es als Pflichtfeld zu deaktivieren)",
        "error": "Der Minimalwert muss immer kleiner oder gleich dem Maximalwert sein.",
        "title": "Min."
      },
      "name": {
        "desc": "Bezeichung des Feldes",
        "error": {
          "empty": "Bitte geben Sie einen Namen ein!",
          "exists": "Bitte geben Sie einen Namen an, der nicht einem bestehenden Feld entspricht!"
        },
        "title": "Feldname"
      },
      "not-permitted": {
        "desc": "Sie besitzen keine Berechtigung diesen Datenbereich einzusehen.",
        "title": "Ungültige Berechtigung"
      },
      "required": {
        "title": "Pflichtfeld"
      },
      "reset-values": "Abbrechen",
      "save": {
        "edit": "Werte übernehmen",
        "save": "Speichern",
        "schema": "Schema übernehmen"
      },
      "type": {
        "title": "Typ"
      },
      "value": {
        "desc": "vorgegebener Wert des Feldes",
        "error": "Bitte geben Sie einen Wert des korrekten Typs an!",
        "title": "Standardwert"
      }
    },
    "context-menu": {
      "clone": "Klonen",
      "create-container": "Daten Container erstellen",
      "export": "Exportieren",
      "link": "Container verknüpfen",
      "plugin-save": "Als Plugin speichern",
      "share": "Teilen"
    },
    "create-question": {
      "action": "Hinzufügen",
      "desc": "Haben Sie alle Daten korrekt konfiguriert und möchten Sie fortfahren? Nach der Erstellung lassen sich die Konfigurationen der verschiedenen Datenbereiche weiterhin anpassen.",
      "title": "Plugin hinzufügen"
    },
    "createForm": {
      "add-plugin": "Plugin hinzufügen",
      "back": "Zurück",
      "base-plugin": "Basis-Plugin",
      "container-configuration": "Daten Konfiguration",
      "continue": "Weiter",
      "create": "Erstellen",
      "create-plugin": "Alleinstehendes Plugin erstellen",
      "edit-dbcp-hint": "Falsches Plugin ausgewählt? Ändern Sie es hier.",
      "empty-plugins": "Sie haben noch keine Plugins erstellt, die in diesen Digitalen Zwilling hinzugefügt werden können.",
      "finish": "Konfiguration abschließen",
      "general": "Generelle Informationen",
      "import-error": "Es wurde versucht, ein ungültiges Plugin zu importieren.",
      "import-plugin-1": "Nutzen Sie dieses Feld, um exportierte Plugins zu importieren...",
      "import-plugin-2": "Ziehen Sie Ihre Datei(en) hierher, um zu beginnen<br>oder klicken Sie zum Durchsuchen",
      "plugin": {
        "desc": "Konfiguration des neuen Plugins",
        "title": "Plugin-Typ"
      },
      "plugin-select": "Plugin-Auswahl",
      "sub-title": "Allgemeine Informationen, Datenschema und Werte.",
      "to-plugins": "Zu den Plugins"
    },
    "dbcp": {
      "description": {
        "desc": "Kurze Beschreibung",
        "title": "Beschreibung"
      },
      "name": {
        "desc": "Name",
        "error": "Bitte geben Sie einen Namen an!",
        "title": "Name"
      }
    },
    "dispatcher": {
      "create": "Daten Container wird erstellt...",
      "link": "Daten Container wird verlinkt...",
      "plugin": "Plugin speichern",
      "plugin-remove": "Plugin löschen",
      "plugin-share": "Plugin teilen",
      "share": "Daten Container wird geteilt...",
      "update": "Daten Container wird aktualisiert..."
    },
    "edit": "Bearbeiten",
    "edit-dbcp": "Container Beschreibung anpassen",
    "edit-schema": "Datenbereich Schema Definition",
    "entries": "Datenbereich",
    "entry": {
      "add": "Datenbereich hinzufügen",
      "add-desc": "Ein Datenbereich entspricht einem abgetrennten Kontext, in dem verschiedenste Informationen gepflegt werden können. Sie können unabhängig voneinander an dritte geteilt werden können.",
      "array-type": {
        "title": "Listentyp"
      },
      "entry-type": "Datebereichs-Typ",
      "name": {
        "desc": "Name des Datenbereichs",
        "error": {
          "already": "Bitte geben Sie einen Namen an, der noch nicht existiert.",
          "length": "Bitte geben Sie einen gültigen Namen (keine Sonderzeichen, mindestens ein Buchstabe).",
          "reserved": "Der eingebene Name ist reserviert und kann nicht verwendet werden."
        },
        "title": "Name"
      },
      "type": {
        "title": "Typ"
      },
      "value": {
        "desc": "Wert des Feldes",
        "error": "Bitte geben Sie einen korrekten Wert an!",
        "title": "Wert"
      }
    },
    "field": {
      "edit": "Bearbeiten"
    },
    "in-creation": "Ein Plugin befindet sich in der Erstellung.<br><br><h4 class=\"text-muted\">Bitte warten Sie, bis der Vorgang abgeschlossen ist...</h4>",
    "in-saving": "Plugin wird gespeichert...",
    "list": {
      "add-list-entry": "Listeneintrag hinzufügen",
      "canel-list-entry": "Abbrechen",
      "data": "Daten",
      "load-more": "Mehr laden...",
      "results": "Ergebnisse",
      "show-less": "Weniger anzeigen",
      "show-more": "Mehr anzeigen"
    },
    "no-entries": {
      "desc": "Dem Plugin wurden noch keine Datenbereiche hinzugefügt. Nutzen Sie den nachfolgenden Button, um Datenbereiche hinzuzufügen und zu konfigurieren.",
      "title": "Leeres Plugin"
    },
    "no-permissions": {
      "desc": "Sie besitzen keine Berechtigungen dieses Plugin einzusehen.",
      "title": "Keine Berechtigungen"
    },
    "plugin": {
      "bmail": {
        "body": "Guten Tag,<br><br>Ihnen wurde die Plugin-Vorlage <b>{subject}</b> von <b>{alias}</b> gesendet. Nutzen Sie den \"Anhang öffnen\" Button, um Sie Ihrem Profil hinzufügen. <br><br>Mit freundlichen Grüßen,<br><br>{alias}",
        "title": "Plugin-Vorlage"
      },
      "create-container": "Daten Container erzeugen",
      "create-title": "Neue Plugin erstellen",
      "delete": "Plugin löschen",
      "delete-quest": "Wollen Sie dies Plugin wirklich löschen?",
      "edit-dbcp": "Beschreibung Anpassen",
      "in-saving": "Ein Plugin wird gespeichert<br><br><h4 class=\"text-muted\">Bitte warten Sie, bis der Vorgang abgeschlossen ist...</h4>",
      "save": "Plugin speichern"
    },
    "plugin-cache": {
      "action": "Wiederherstellen",
      "clear": "Löschen",
      "desc": "Sie haben ungespeicherte Änderungen, möchten Sie diese wiederherstellen?",
      "title": "Ungespeicherte Änderungen"
    },
    "plugin-handler": {
      "edit-modes": {
        "desc": "Bitte schließen Sie alle Änderungen ab, um speichern zu können.",
        "title": "Ungespeicherte Änderungen"
      }
    },
    "save-dbcp": "Speichern",
    "sets": {
      "reset": {
        "desc": "Wollen sie die aktuellen Änderungen zurücksetzen?",
        "title": "Datenbereich zurücksetzen"
      }
    },
    "share": {
      "action": "Teilen",
      "bmail-container": {
        "body": "Guten Tag,<br><br>Sie wurden in die Plugin-Instanz <b>{subject}</b> von <b>{alias}</b> eingeladen.<br><br><b>Adresse des Plugins</b>:{containerAddress}<br><br><br>Mit freundlichen Grüßen,<br><br>{alias}",
        "title": "Einladung in Plugin-Instanz"
      },
      "bmail-twin": {
        "body": "Guten Tag,<br><br>Sie wurden in den Digitalen Zwilling <b>{subject}</b> von <b>{alias}</b> eingeladen.<br><br><b>Adresse des Digitalen Zwillings</b>:{digitalTwinAddress}<br><br><br>Mit freundlichen Grüßen,<br><br>{alias}",
        "title": "Einladung in Digitalen Zwilling"
      },
      "desc": "Senden Sie diesen Daten Container an Personen aus Ihrem Adressbuch und spezifizieren Sie dessen Zugriffsberechtigungen.",
      "entry": "Datenbereich",
      "no-contacts": {
        "desc": "Daten können nur mit Kontakten und einem validen Schlüsselaustausch geteilt werden. Sie besitzen noch keine Kontakte, um Daten zu teilen.<br>Wollen sie die Kontakte öffnen?",
        "open-contacts": "Kontakte öffnen",
        "title": "Keine Kontakte"
      },
      "no-permissions": {
        "desc": "Sie haben keine Berechtigungen, diesen Daten Container zu teilen.",
        "title": "Nicht berechtigt"
      },
      "read": "Lesen",
      "read-write": "Lesen und Schreiben",
      "subject": {
        "desc": "Geben Sie einen Betreff zu diesem Daten Container an. (z.B.: Digitaler Zwilling Zugehörigkeit, Daten Container Name)",
        "error": "Bitte geben Sie einen Betreff ein!",
        "title": "Betreff"
      },
      "title": "Teilen",
      "user": {
        "desc": "Nutzer dem die ausgewählten Daten geteilt werden sollen.",
        "title": "Nutzer"
      }
    },
    "types": {
      "array": "Liste",
      "boolean": "Checkbox",
      "files": "Dateien",
      "images": "Bilder",
      "number": "Zahl",
      "object": "Metadaten",
      "string": "Text"
    }
  }
}
/* tslint:enable */;

i18n._digitaltwins = { breadcrumbs: dtLib.translations.de.breadcrumbs };

export default i18n;
