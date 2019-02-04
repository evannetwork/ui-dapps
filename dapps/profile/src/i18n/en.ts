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

export const en = {
  "_dappprofile": {
    "account-detail": "Profile informations",
    "account-detail-desc": "Account-Address, Alias, Eve, ...",
    "accountid": "Account-ID",
    "accounts": "Accounts",
    "add-claim-topic": "Add verification check",
    "alias": "Alias",
    "balance": "My EVEs",
    "balance-updated": "EVEs were updated...",
    "cancel": "cancel",
    "claim-topic": {
      "desc": "Verification path to be checked (e.g.: /company)",
      "error": "Please enter a verification path",
      "title": "Verification path"
    },
    "claims": "Verifications",
    "claims-desc": "Verifications selection for UI components",
    "claims-desc-long": "Manage Verifications that are displayed and verified by default in different applications. (Address book, contact selection, ...)",
    "color-theme": "Color Theme",
    "color-theme-desc": "Set the color of the user interface.",
    "color-themes": {
      "dark": "evan.network Design",
      "light": "light Design"
    },
    "configuration": "Configuration",
    "dev-domain": "Test Domain",
    "dev-domain-desc": "The root domain \"evan\" for loading DApps is replaced by the specified one.",
    "dev-domain-loading": "DApps from test domain",
    "dev-domain-loading-desc": "Load DApps from a specifically specified test root domain.",
    "developer-mode": "Developer mode",
    "developer-mode-desc": "Logging DApp, test domain DAPP loading, Header link to explorer.",
    "developers": "Developers",
    "edit-profile": "Edit profile",
    "email": "E-Mail address",
    "encryptionkey-desc": "This key encrypts all data of your profile, including your contacts, b-mails, contracts, etc...",
    "encryptionkey-exported": "Your Encryption Key has been successfully exported to your clipboard",
    "evan-dev-dapps-domain-changed": "test Domain Changes",
    "evan-dev-dapps-domain-changed-desc": "All DApps loaded up to this point are already cached and will not be reloaded with the new configuration. Do you want to restart the application?",
    "evan-dev-dapps-domain-changed-ok": "restart",
    "eve-amount": "EVE amount",
    "export": "export",
    "export-encryptionkey": "Export Profile Encryption Key",
    "export-encryptionkey-desc": "This key encrypts all data of your profile, including your contacts, b-mails, contracts, etc.... Exporting and possibly unsafe storage of this information can lead to serious security risks. Do you really want to export the private key?",
    "export-encryptionkey-ok": "I understand the risk",
    "export-privatekey": "Export Private Key",
    "export-privatekey-desc": "The private key of your account secures access to your blockchain identity. Exporting and possibly unsafe storage of this information can lead to serious security risks. Do you really want to export the private key?",
    "export-privatekey-ok": "I understand the risk",
    "export-security-informations": "Security information",
    "language": "Language",
    "language-changed": "Language changed",
    "language-changed-desc": "After the language has been changed, not all areas of the application are translated immediately. For these changes to take effect, the application must be restarted. Do you want to restart the application now?",
    "language-changed-ok": "restart",
    "language-desc": "Use a specific language for the evan.network applications.",
    "languages": {
      "de": "German",
      "en": "English"
    },
    "logout": "Logout",
    "logout-desc": "Do you really want to log out?",
    "my-profile": "My Profile",
    "my-verifications": "My verifications",
    "no-email": "No e-mail address specified",
    "no_alias": "No Alias",
    "notifications": "Notifications",
    "notifictions-desc": "Enables push notifications for your mobile device.",
    "ok": "ok",
    "payment": {
      "channel-actions": "Actions",
      "create-payment-channel": "Setup storage fund",
      "delete": "Delete",
      "delete-hash": "Delete file via hash",
      "delete-hash-desc": "Filehash (QmXXXX)",
      "delete-hash-error": "Please enter a valid IPFS hash!",
      "estimated-funds": "Estimated months until assets are deleted",
      "funds-available": "Availabe EVE for storage",
      "initial-eve-amount": "Initial amout of eve to lock",
      "monthly-cost": "Monthly storage costs",
      "payments": "Storage payments",
      "payments-desc": "Manage your storage payments",
      "payments-detail": "Storage payment details",
      "pinned-hashes": "Stored Assets",
      "setup-payment-channel": "Setup storage funds",
      "setup-payment-channel-desc": "When storing data on evan.network you will be charged monthly for every kB. You must lock EVE for the payment of the data.",
      "topup": "Topup",
      "topup-alert": {
        "cancel": "cancel",
        "description": "Do you really want to top up your storage storage funds with {{ eve }} EVE?",
        "submit": "proceed",
        "title": "Topup storage funds"
      },
      "topup-payment-channel": "Topup storage funds with EVE",
      "topup-payment-channel-desc": "EVE amount",
      "topup-payment-channel-error": "Please specify an amount of EVE higher than 0."
    },
    "private-key": "Private Key",
    "privatekey-desc": "The private key of your account secures access to your blockchain identity.",
    "privatekey-exported": "Your private key successfully exported to your clipboard",
    "profile-claims-dispatcher": {
      "description": "Save verification selection",
      "title": "Save verification selection"
    },
    "profile-encryption-key": "Profile Encryption Key",
    "receiver": {
      "desc": "Account address to which Eve should be sent",
      "error": "Please enter a valid address!",
      "title": "Receiver"
    },
    "runtime-config": "Runtime settings",
    "save-claim-topics": "save verification selection",
    "send-eve": {
      "desc": "Do you really want to send {{ eve }} Eve to the account {{ address }}?",
      "input": {
        "description": "Amount of Eves to be sent",
        "error": "Please specify a amount of Eves between 0.1 and maximum {{{ balance }} Eve to continue.",
        "title": "Eve"
      },
      "ok": "send",
      "title": "Send Eve"
    },
    "send-eve-dispatcher": {
      "description": "Eve will be transferred from the current account to another account.",
      "title": "Send Eve"
    },
    "settings": "Settings",
    "settings-desc": "runtime environment, developer, presentation"
  },
  "detail": "Profile informations",
  "payments": "Storage payments",
  "profile": "My Profile",
  "profiledetail": "My Profile",
  "profileroot": "My Profile",
  "settings": "Settings",
  "verifications": "Verifications"
};
