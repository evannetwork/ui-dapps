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
  "_datacontainer": {
    "ajv": {
      "add": "Feld hinzufügen",
      "edit-schema": "Schema bearbeiten",
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
        "desc": "Wert des Feldes",
        "error": "Bitte geben Sie einen Wert des korrekten Typs an!",
        "title": "Wert"
      }
    },
    "breadcrumbs": {
      "add": "Hinzufügen",
      "container-link": "Daten Container verknüpfen",
      "containers": "Daten Container Übersicht",
      "create": "Erstellen",
      "create-template": "Vorlage erstellen",
      "datacontainer.digitaltwin": "Daten Container",
      "digitaltwins": "Digitale Zwillinge",
      "lookup": "Öffnen",
      "overview": "Favoriten & letzte Zwillinge",
      "template": "Vorlage",
      "templates": "Vorlagen",
      "verifications": "Verifizierungen"
    },
    "context-menu": {
      "clone": "Klonen",
      "create-container": "Daten Container erstellen",
      "link": "Container verknüpfen",
      "share": "Teilen",
      "template-save": "Als Vorlage speichern"
    },
    "create-question": {
      "action": "Erstellen",
      "desc": "Haben Sie alle Daten korrekt konfiguriert und möchten Sie fortfahren? Nach der Erstellung lassen sich die Konfigurationen der verschiedenen Datenbereiche weiterhin anpassen.",
      "title": "Datencontainer Erstellen"
    },
    "createForm": {
      "back": "Zurück",
      "base-template": "Basis-Vorlage",
      "container-configuration": "Daten Konfiguration",
      "continue": "Weiter",
      "create": "Erstellen",
      "description": {
        "desc": "Kurze Beschreibung des Daten Containers",
        "title": "Beschreibung"
      },
      "finish": "Konfiguration abschließen",
      "general": "Generelle Informationen",
      "name": {
        "desc": "Name des Daten Containers",
        "error": "Bitte geben Sie einen Namen an!",
        "title": "Name"
      },
      "save": "Daten Container Speichern",
      "sub-title": "Allgemeine Informationen, Datenschema und Werte.",
      "template": {
        "desc": "Vorlage des Datencontainers",
        "title": "Vorlage"
      },
      "title": "Daten Container erstellen"
    },
    "dispatcher": {
      "create": "Daten Container wird erstellt...",
      "link": "Daten Container wird verlinkt...",
      "share": "Daten Container wird geteilt...",
      "template": "Vorlage speichern",
      "template-share": "Vorlage teilen",
      "update": "Daten Container wird aktualisiert..."
    },
    "edit": "Bearbeiten",
    "edit-dbcp": "Container Beschreibung anpassen",
    "edit-schema": "Datenbereich Schema Definition",
    "entry": {
      "add": "Datenbereich hinzufügen",
      "add-desc": "Ein Datenbereich entspricht einem abgetrennten Kontext, in dem verschiedenste Informationen gepflegt werden können. Sie können unabhängig voneinander an dritte geteilt werden können.",
      "array-type": {
        "title": "Listentyp"
      },
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
    "in-creation": "In Erstellung...",
    "in-saving": "Wird gespeichert...",
    "list": {
      "add-list-entry": "Listeneintrag hinzufügen",
      "canel-list-entry": "Abbrechen",
      "data": "Daten",
      "load-more": "Mehr laden...",
      "results": "Ergebnisse",
      "show-less": "Weniger anzeigen",
      "show-more": "Mehr anzeigen"
    },
    "no-permissions": {
      "desc": "Sie besitzen keine Berechtigungen diesen Datencontainer einzusehen.",
      "title": "Keine Berechtigungen"
    },
    "share": {
      "action": "Teilen",
      "bmail": {
        "body": "Guten Tag,<br><br>Sie wurden von <b>{alias}</b> in einen Daten Container eingeladen: <br><br><b>{subject}</b><br><br>Mit freundlichen Grüßen,<br><br>{alias}",
        "title": "Einladung in Daten Container"
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
    "template": {
      "bmail": {
        "body": "Guten Tag,<br><br>Ihnen wurde eine Daten Container Vorlage von <b>{alias}</b> gesendet: <br><br><b>{subject}</b><br><br>Mit freundlichen Grüßen,<br><br>{alias}",
        "title": "Daten Container Vorlage"
      },
      "create-container": "Daten Container erzeugen",
      "create-title": "Neue Vorlage erstellen",
      "edit-dbcp": "Beschreibung Anpassen",
      "save": "Vorlage speichern"
    },
    "template-cache": {
      "action": "Wiederherstellen",
      "clear": "Löschen",
      "desc": "Sie haben ungespeicherte Änderungen, möchten Sie diese wiederherstellen?",
      "title": "Ungespeicherte Änderungen"
    },
    "template-handler": {
      "edit-modes": {
        "desc": "Bitte schließen Sie alle Änderungen ab, um speichern zu können.",
        "title": "Ungespeicherte Änderungen"
      }
    },
    "types": {
      "array": "Liste",
      "files": "Dateien",
      "images": "Bilder",
      "number": "Zahl",
      "object": "Metadaten",
      "string": "Text"
    }
  }
}
/* tslint:enable */;
