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
        "text": "Der angegebene Wert muss vom Typ \"{typ}\" sein. (min: {min}, max: {max})"
      },
      "files-no-default": "Felder vom Typ Datei können keine Standardwerte enthalten.",
      "max": {
        "desc": "Maximalwert",
        "error": "Der Maximalwert muss immer größer gleich dem Minimalwert sein.",
        "title": "Max."
      },
      "min": {
        "desc": "Minimalwert (leer lassen, um es als Pflichtfeld zu deaktivieren)",
        "error": "Der Minimalwert muss immer kleiner oder gleich dem Maximalwert sein.",
        "title": "Min."
      },
      "name": {
        "desc": "Bezeichung des Feldes",
        "error": {
          "empty": "Bitte geben Sie einen Namen ein.",
          "exists": "Bitte geben Sie einen Namen an, der nicht einem bestehenden Feld entspricht."
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
        "error": "Bitte geben Sie einen Wert des korrekten Typs an.",
        "title": "Standardwert"
      }
    },
    "context-menu": {
      "clone": "Klonen",
      "create-container": "Plugin erstellen",
      "export": "Exportieren",
      "link": "Plugin verknüpfen",
      "plugin-save": "Als Plugin speichern",
      "share": "Teilen"
    },
    "create-question": {
      "action": "Hinzufügen",
      "desc": "Haben Sie alle Daten korrekt konfiguriert und möchten Sie fortfahren? Nach der Erstellung lassen sich die Daten-Konfiguration der verschiedenen Datenbereiche weiterhin anpassen.",
      "title": "Plugin hinzufügen"
    },
    "createForm": {
      "add-plugin": "Plugin hinzufügen",
      "back": "Zurück",
      "base-plugin": "Basis-Plugin",
      "container-configuration": "Daten-Konfiguration",
      "continue": "Weiter",
      "create": "Erstellen",
      "create-plugin": "Alleinstehendes Plugin erstellen",
      "edit-dbcp-hint": "Falsches Plugin ausgewählt? Ändern Sie es hier.",
      "empty-plugins": "Sie haben noch keine Plugins erstellt, die in diesen Digitalen Zwilling hinzugefügt werden können.",
      "finish": "Daten-Konfiguration abschließen",
      "general": "Generelle Informationen",
      "import-error": "Es wurde versucht, ein ungültiges Plugin zu importieren.",
      "import-plugin-1": "Nutzen Sie dieses Feld, um exportierte Plugins zu importieren...",
      "import-plugin-2": "Ziehen Sie Ihre exportierten Plugins hierher, <br>oder klicken Sie zum Durchsuchen",
      "plugin": {
        "desc": "Daten-Konfiguration des neuen Plugins",
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
        "error": "Bitte geben Sie einen Namen an.",
        "title": "Name"
      }
    },
    "dispatcher": {
      "create": "Plugin Instany wird erstellt...",
      "link": "Plugin wird verlinkt...",
      "plugin": "Plugin-Vorlage wird gespeichert...",
      "plugin-remove": "Plugin wird gelöscht...",
      "plugin-share": "Plugin wird geteilt...",
      "share": "Plugin wird geteilt...",
      "update": "Plugin wird aktualisiert..."
    },
    "edit": "Bearbeiten",
    "edit-dbcp": "Beschreibung anpassen",
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
        "error": "Bitte geben Sie einen korrekten Wert an.",
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
      "desc-noperm": "<b class=\"text-center d-block mt-3\">Diesem Plugin wurden keine Datenbereiche hinzugefügt.</b>",
      "desc-perm": "<b class=\"text-center d-block mt-3\">Diesem Plugin wurden keine Datenbereiche hinzugefügt. Nutzen Sie den nachfolgenden Button, um Datenbereiche hinzuzügen.</b>",
      "short": "Keine Datenbereiche verfügbar...",
      "title": "Jedes Plugin kann verschiedene Datenbereiche wie Metadaten, Listen, Texten, Zahlen, Dateien oder einfachen Checkboxen enthalten."
    },
    "no-permissions": {
      "desc": "Sie besitzen keine Berechtigungen dieses Plugin einzusehen.",
      "title": "Keine Berechtigungen"
    },
    "plugin": {
      "bmail": {
        "body": "Guten Tag,\n\nIhnen wurde die Plugin-Vorlage {name} von {alias} gesendet. Nutzen Sie den \"Anhang öffnen\" Button, um Sie Ihrem Profil hinzufügen.\n\nMit freundlichen Grüßen,\n\n{alias}",
        "title": "Plugin-Vorlage"
      },
      "bmail-desc": "Der ausgewählte Benutzer wird per Blockchain-Mail benachrichtigt. Im folgenden Formular können Sie die Nachricht anpassen.",
      "create-container": "Plugin erzeugen",
      "create-title": "Neues Plugin erstellen",
      "delete": "Plugin löschen",
      "delete-quest": "Wollen Sie dieses Plugin wirklich löschen?",
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
      "add-user": "Neuen Nutzer hinzufügen",
      "add-user-desc": "Fügen Sie einen neuen Nutzer aus Ihren Kontakten in die Freigabe-Übersicht hinzu.",
      "bmail-container": "Guten Tag,\n\nSie wurden in die Plugin-Instanz {name} von {alias} eingeladen.\n\nPlugin: {name} - {containerAddress}\n\nMit freundlichen Grüßen,\n\n{alias}",
      "bmail-description": "Alle ausgwählten Berechtigungen werden an die entsprechenden Nutzer freigegeben und per Blockchain-Mail benachrichtigt. Im folgenden können Sie die Nachricht anpassen.",
      "bmail-twin": "Guten Tag,\n\nSie wurden in den Digitalen Zwilling {name} von {alias} eingeladen.\n\nDigitaler Zwilling: {twinName} - {digitalTwinAddress}\nPlugin: {name} - {containerAddress}\n\nMit freundlichen Grüßen,\n\n{alias}",
      "body": {
        "desc": "Nachrichtentext",
        "error": "Bitte geben Sie einen Nachrichtentext ein.",
        "title": "Nachrichtentext"
      },
      "desc": "Senden Sie dieses Plugin an Personen aus Ihrem Adressbuch.",
      "entry": "Datenbereich",
      "no-contacts": {
        "desc": "Daten können nur mit Kontakten aus ihrem Adressbuch geteilt werden. Sie besitzen noch keine Kontakte oder all Ihre Kontakte sind bereits der aktuellen Freigabe-Übersicht hinzugefügt.<br>Wollen sie die Kontakte-Anwendung öffnen, um weitere Kontakte hinzuzufügen?",
        "desc-plugins": "Daten können nur mit Kontakten aus ihrem Adressbuch geteilt werden. Sie besitzen noch keine Kontakte, um Daten zu teilen.<br>Wollen sie die Kontakte-Anwendung öffnen, um weitere Kontakte hinzuzufügen?",
        "open-contacts": "Kontakte öffnen",
        "title": "Keine Kontakte"
      },
      "no-permissions": {
        "desc": "Sie haben keine Berechtigungen, dieses Plugin zu teilen.",
        "title": "Nicht berechtigt"
      },
      "property": "Datenbereich",
      "read": "Lesen",
      "read-write": "Lesen und Schreiben",
      "share": "Freigeben",
      "title": {
        "desc": "z.B.: Digitaler Zwilling Zugehörigkeit, Plugin Name.",
        "error": "Bitte geben Sie einen Betreff ein.",
        "title": "Betreff"
      },
      "user": {
        "desc": "Nutzer dem die ausgewählten Daten geteilt werden sollen.",
        "title": "Nutzer"
      },
      "write": "schreiben"
    },
    "technical": {
      "address": "Vertragsadresse",
      "in-explorer": "Im evan.network Explorer öffnen",
      "owner": "Eigentümer"
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
