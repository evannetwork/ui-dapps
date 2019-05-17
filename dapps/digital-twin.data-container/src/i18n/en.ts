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
      "add": "Add field",
      "edit-schema": "Edit schema",
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
        "desc": "Value of the field",
        "error": "Please enter a value of the correct type!",
        "title": "Value"
      }
    },
    "breadcrumbs": {
      "add": "Add",
      "container-link": "Link Data Container",
      "containers": "Data Container overview",
      "create": "Create",
      "create-plugin": "Create Plugin",
      "datacontainer.digitaltwin": "Data Container",
      "digitaltwins": "Digital Twins",
      "lookup": "Open",
      "overview": "Favorites & recent Digital Twins",
      "plugin": "Plugin",
      "plugins": "Plugins",
      "verifications": "Verifications"
    },
    "context-menu": {
      "clone": "Clone",
      "create-container": "Create Data Container",
      "link": "Link to Digital Twin",
      "share": "Share",
      "plugin-save": "Save as plugin"
    },
    "create-question": {
      "action": "Create",
      "desc": "Have you configured all data correctly and would you like to continue? After the creation, the configurations of the different Data Container can still be updated.",
      "title": "Create Data Container"
    },
    "createForm": {
      "back": "Go Back",
      "base-plugin": "Base Plugin",
      "container-configuration": "Data Configuration",
      "continue": "Continue",
      "create": "Create",
      "description": {
        "desc": "Short description for the Data Container",
        "title": "Description"
      },
      "finish": "Finish configuration",
      "general": "General Information",
      "name": {
        "desc": "Name of the Data Container",
        "error": "Please provide a name!",
        "title": "Name"
      },
      "save": "Save Data Container",
      "sub-title": "Specify general information, data schema and values.",
      "plugin": {
        "desc": "Plugin of the Data Container",
        "title": "Plugin"
      },
      "title": "Create Data Container"
    },
    "dispatcher": {
      "create": "Creating Data Container...",
      "link": "Link Data Container...",
      "share": "Share Data Container...",
      "plugin": "Saving plugin...",
      "plugin-share": "Sharing plugin...",
      "update": "Updating Data Container..."
    },
    "edit": "Edit",
    "edit-dbcp": "Adjust Container Description",
    "edit-schema": "Data set schema definition",
    "entry": {
      "add": "Add data set",
      "add-desc": "A data set corresponds to separated areas in which a wide variety of information can be maintained. They can be shared independently with third parties.",
      "array-type": {
        "title": "List type"
      },
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
    "in-creation": "In Creation...",
    "in-saving": "Saving...",
    "list": {
      "add-list-entry": "Add list entry",
      "canel-list-entry": "Cancel",
      "data": "Data",
      "load-more": "Load more...",
      "results": "Results",
      "show-less": "Show less",
      "show-more": "Show more"
    },
    "no-permissions": {
      "desc": "You have no permission to view this data container.",
      "title": "No permissions"
    },
    "share": {
      "action": "Share",
      "bmail": {
        "body": "Hello,<br><br>You have been invited by <b>{alias}</b> into a data container:<br><br><b>{subject}</b><br><br>Sincerely,<br><br>{alias}",
        "title": "Invitation to Data Container"
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
    "plugin": {
      "bmail": {
        "body": "Hello,<br><br>You have received a data container plugin from <b>{alias}</b>: <br><br><b>{subject}</b><br><br>Sincerely,<br><br>{alias}",
        "title": "Invitation to Data Container plugin"
      },
      "create-container": "Create Data Container",
      "create-title": "Create new Plugin",
      "edit-dbcp": "Adjust Description",
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
