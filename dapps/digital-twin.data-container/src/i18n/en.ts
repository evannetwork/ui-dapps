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
      "empty": "not set",
      "errors": {
        "missing-max": "not specified",
        "missing-min": "not specified",
        "text": "The specified value must be of type \"{type}\". (min: {min}, max: {max})"
      },
      "files-no-default": "File type fields cannot contain default values.",
      "max": {
        "desc": "Maximum value",
        "error": "The maximum value must always be greater than or equal to the minimum value.",
        "title": "Max."
      },
      "min": {
        "desc": "Minimum value (is mandatory, if specified)",
        "error": "The minimum value must always be less than or equal to the maximum value.",
        "title": "Min."
      },
      "name": {
        "desc": "Name of the field",
        "error": {
          "empty": "Please enter a name.",
          "exists": "Please enter a name that does not correspond to an existing field."
        },
        "title": "Field name"
      },
      "not-permitted": {
        "desc": "You do not have permission to view this Data Set.",
        "title": "Invalid authorization"
      },
      "required": {
        "title": "Required"
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
        "error": "Please enter a value of the correct type.",
        "title": "Default value"
      }
    },
    "context-menu": {
      "clone": "Clone",
      "create-container": "Create Plugin",
      "export": "Export",
      "link": "Link to Digital Twin",
      "plugin-save": "Save as plugin",
      "share": "Share"
    },
    "create-question": {
      "action": "Add",
      "desc": "Confirming this will create the Digital Twin with the specified data, trigger transactions and consume EVE. Would you like to continue? After the creation, the configurations of the different Plugins can still be updated.",
      "title": "Add Plugin"
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
      "import-error": "An attempt was made to import an invalid plugin.",
      "import-plugin-1": "Use this field to import exported plugins...",
      "import-plugin-2": "Drag your plugin(s) here <br>or click to browse",
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
        "error": "Please provide a name.",
        "title": "Name"
      }
    },
    "dispatcher": {
      "create": "Creating Data Plugin Instance...",
      "link": "Linking Plugin Instance...",
      "plugin": "Saving Plugin Instance...",
      "plugin-remove": "Deleting Plugin...",
      "plugin-share": "Sharing plugin...",
      "share": "Sharing Plugin Instance...",
      "update": "Updating Plugin Instance..."
    },
    "edit": "Edit",
    "edit-dbcp": "Adjust Description",
    "edit-schema": "Data Set schema definition",
    "entries": "Data Sets",
    "entry": {
      "add": "Add Data Set",
      "add-desc": "A Data Set corresponds to separated areas in which a wide variety of information can be maintained. They can be shared independently with third parties.",
      "array-type": {
        "title": "List type"
      },
      "entry-type": "Data Set Type",
      "name": {
        "desc": "Name of the Data Set",
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
      "desc-noperm": "<b class=\"text-center d-block mt-3\">No Data Sets have been added to this plugin.</b>",
      "desc-perm": "<b class=\"text-center d-block mt-3\">No Data Sets have been added to this plugin. Use the button below to add Data Sets.</b>",
      "short": "No Data Sets available...",
      "title": "Each plugin can contain different Data Sets such as metadata, lists, texts, numbers, files or simple checkboxes."
    },
    "no-permissions": {
      "desc": "You have no permission to view this Plugin.",
      "title": "No permissions"
    },
    "plugin": {
      "bmail": {
        "body": "Hello,\n\nyou've been sent the plugin template {name} from {alias}. Use the \"open attachment\" button to add you to your profile.\n\nBest regards,\n\n{alias}",
        "title": "Plugin Template"
      },
      "bmail-desc": "The selected user will be notified by blockchain mail. In the following formular you can customize the message.",
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
        "title": "Reset Data Set"
      }
    },
    "share": {
      "action": "Share",
      "add-user": "Add new user",
      "add-user-desc": "Add a new user from your contacts to the sharing overview.",
      "bmail-container": "Hello,\n\nYou were invited to the plugin instance {name} of {alias}.\n\nPlugin: {name} - {containerAddress}.\n\nBest Regards,\n\n{alias}",
      "bmail-description": "All selected permissions are released to the corresponding users and notified by blockchain mail. In the following formular you can customize the message.",
      "bmail-twin": "Hello,\n\nYou were invited to the Digital Twin {name} of {alias}.\n\nDigital Twin: {twinName} - {digitalTwinAddress}\nPlugin: {name} - {containerAddress}\n\nBest Regards,\n\n{alias}",
      "body": {
        "desc": "Message text",
        "error": "Please enter a message text",
        "title": "Message text"
      },
      "desc": "Send this Plugin to people from your address book.",
      "entry": "Data Set",
      "no-contacts": {
        "desc": "Data can only be shared with contacts from your address book. You don't have any contacts yet or all your contacts are already added to the current sharing overview.<br>Do you want to open the Contacts application to add more contacts?",
        "desc-plugins": "Data can only be shared with contacts from your address book. You do not yet have contacts to share data. <br>Do you want to open the Contacts application to add more contacts?",
        "open-contacts": "Open Contacts",
        "title": "No contacts"
      },
      "no-permissions": {
        "desc": "You do not have permissions to share this data plugin.",
        "title": "Not permitted"
      },
      "property": "Data-Set",
      "read": "Read",
      "read-write": "Read and Write",
      "share": "Share",
      "title": {
        "desc": "e.g.: Digital Twin Affiliation, Plugin Name.",
        "error": "Please enter a Title",
        "title": "Title"
      },
      "user": {
        "desc": "User to whom the selected data should be shared.",
        "title": "User"
      },
      "write": "write"
    },
    "technical": {
      "address": "Contract-Address",
      "in-explorer": "open in evan.network Explorer",
      "owner": "Owner"
    },
    "types": {
      "array": "List",
      "boolean": "Checkbox",
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
