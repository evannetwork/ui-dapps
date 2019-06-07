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
      "add": "Add field",
      "edit-schema": "Edit schema",
      "files-no-default": "File type fields cannot contain default values.",
      "name": {
        "desc": "Name of the field",
        "error": {
          "empty": "Please enter a name!",
          "exists": "Please enter a name that does not correspond to an existing field!"
        },
        "title": "Field name"
      },
      "not-permitted": {
        "desc": "You do not have permission to view this data set.",
        "title": "Invalid authorization"
      },
      "reset-values": "Cancel",
      "save": {
        "edit": "Save",
        "save": "Save",
        "schema": "Use Schema"
      },
      "type": {
        "title": "Type"
      },
      "value": {
        "desc": "Default value of the field",
        "error": "Please enter a value of the correct type!",
        "title": "Default value"
      }
    },
    "context-menu": {
      "clone": "Clone",
      "create-container": "Create Data Container",
      "link": "Link to Digital Twin",
      "plugin-save": "Save as plugin",
      "share": "Share"
    },
    "create-question": {
      "action": "Create",
      "desc": "Have you configured all data correctly and would you like to continue? After the creation, the configurations of the different Data Container can still be updated.",
      "title": "Create Data Container"
    },
    "createForm": {
      "add-plugin": "Add Plugin",
      "back": "Go Back",
      "base-plugin": "Base Plugin",
      "container-configuration": "Data Configuration",
      "continue": "Continue",
      "create": "Create",
      "create-plugin": "Create Standalone Plugin",
      "edit-dbcp-hint": "Wrong plugin selected? Change it here.",
      "empty-plugins": "You have not yet created any plugins that can be added to these Digital Twin.",
      "finish": "Finish configuration",
      "general": "General Information",
      "plugin": {
        "desc": "Configuration of the new plugin",
        "title": "Plugin Type"
      },
      "plugin-select": "Plugin Selection",
      "sub-title": "Specify general information, data schema and values.",
      "to-plugins": "Go to the plugins"
    },
    "dbcp": {
      "description": {
        "desc": "Short description",
        "title": "Description"
      },
      "name": {
        "desc": "Name",
        "error": "Please provide a name!",
        "title": "Name"
      }
    },
    "dispatcher": {
      "create": "Creating Data Container...",
      "link": "Link Data Container...",
      "plugin": "Saving plugin...",
      "plugin-remove": "Plugin löschen",
      "plugin-share": "Sharing plugin...",
      "share": "Share Data Container...",
      "update": "Updating Data Container..."
    },
    "edit": "Edit",
    "edit-dbcp": "Adjust Container Description",
    "edit-schema": "Data set schema definition",
    "entries": "Data Sets",
    "entry": {
      "add": "Add data set",
      "add-desc": "A data set corresponds to separated areas in which a wide variety of information can be maintained. They can be shared independently with third parties.",
      "array-type": {
        "title": "List type"
      },
      "entry-type": "Data Set Type",
      "name": {
        "desc": "Name of the data set",
        "error": {
          "already": "Please enter a name that does not yet exist",
          "length": "Please enter a valid name (no special characters, at least one letter)",
          "reserved": "The entered name is reserved and cannot be used."
        },
        "title": "Name"
      },
      "type": {
        "title": "Type"
      },
      "value": {
        "desc": "Value of the field",
        "error": "Please enter a correct value",
        "title": "Value"
      }
    },
    "field": {
      "edit": "Edit"
    },
    "in-creation": "A plugin is being created.<br><br><h4 class=\"text-muted\">Please wait until the process is completed...</h4>",
    "in-saving": "Saving pluging...",
    "list": {
      "add-list-entry": "Add list entry",
      "canel-list-entry": "Cancel",
      "data": "Data",
      "load-more": "Load more...",
      "results": "Results",
      "show-less": "Show less",
      "show-more": "Show more"
    },
    "no-entries": {
      "desc": "No data sets have been added to the plugin yet. Use the button below to add and configure data sets.",
      "title": "Empty plugin"
    },
    "no-permissions": {
      "desc": "You have no permission to view this data container.",
      "title": "No permissions"
    },
    "plugin": {
      "bmail": {
        "body": "Hello,<br><br>You have been sent the plugin template <b>{subject}</b> from <b>{alias}</b>. Use the \"open attachment\" button to add it to your profile. <br><br>Sincerely,<br><br>{alias}",
        "title": "Plugin Template"
      },
      "create-title": "Create new Plugin",
      "delete": "Delete Plugin",
      "delete-quest": "Do you really want to delete this plugin?",
      "edit-dbcp": "Adjust Description",
      "in-saving": "Saving Plugin<br><br><h4 class=\"text-muted\">Please wait until the process is finished...</h4>",
      "save": "Save Plugin"
    },
    "plugin-cache": {
      "action": "Restore",
      "clear": "Delete",
      "desc": "You have unsaved changes, do you want to restore it?",
      "title": "Unsaved changes"
    },
    "plugin-handler": {
      "edit-modes": {
        "desc": "Please complete all changes to be able to save.",
        "title": "Unsaved changes"
      }
    },
    "save-dbcp": "Save",
    "sets": {
      "reset": {
        "desc": "Do you want to reset the current changes?",
        "title": "Reset data set"
      }
    },
    "share": {
      "action": "Share",
      "bmail": {
        "body": "Hello,<br><br>You have been invited into the Digital Twin Plugin <b>{subject}</b> by <b>{alias}</b>. Use the \"open attachment\" button to add it to your profile. <br><br>Sincerely,<br><br>{alias}",
        "title": "Invitation to Digital Twin Plugin"
      },
      "desc": "Send this data container to people in your address book and specify their access permissions.",
      "entry": "Data set",
      "no-contacts": {
        "desc": "Data can only be shared with contacts and a valid key exchange. You do not yet have contacts to share data. <br>Do you want to open the contacts?",
        "open-contacts": "Open Contacts",
        "title": "No contacts"
      },
      "no-permissions": {
        "desc": "You do not have permissions to share this data container.",
        "title": "Not permitted"
      },
      "read": "Read",
      "read-write": "Read and Write",
      "subject": {
        "desc": "Specify a subject for this data container. (e.g.: Digital Twin name, Data Container Name)",
        "error": "Please enter a subject!",
        "title": "Subject"
      },
      "title": "Share",
      "user": {
        "desc": "User to whom the selected data should be shared.",
        "title": "User"
      }
    },
    "types": {
      "array": "List",
      "files": "Files",
      "images": "Images",
      "number": "Number",
      "object": "Metadata",
      "string": "Text"
    }
  }
}
/* tslint:enable */;

i18n._digitaltwins = { breadcrumbs: dtLib.translations.en.breadcrumbs };

export default i18n;
