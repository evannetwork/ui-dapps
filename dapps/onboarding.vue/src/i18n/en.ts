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
  "_onboarding": {
    "close": "Close",
    "continue": "Continue",
    "free-input": "Free input",
    "invalid-mnemonic-integrity": "The composition of the words in your recovery key is incorrect. Please check your input.",
    "invalid-mnemonic-word": "This is not a correct word for a recovery key!",
    "mail-invitation-accepted": {
      "body": "Hello, <br>the user with the email address {userEmail} accepted your invitation to the evan.network and is now available under that name: {userAlias}.<br><br> Your evan.network Team",
      "subject": "User has accepted your request",
      "title": "Invitation accepted"
    },
    "mnemonic-word": "{index}. Word",
    "mnemonic-words": "12 Wörter",
    "password": "Password",
    "password-match-repeat": "Your password must match the second entry.",
    "password-min-characters": "Your password must be at least 8 characters long",
    "password-one-character": "Your password must contain at least one letter",
    "password-one-digest-needed": "Your password must contain at least one number",
    "password-one-uppercase-character": "Your password must contain at least one capital letter",
    "password-repeat": "Password repetition",
    "please-login-signup": "Use an existing identity or create a new one to continue.",
    "sign-in": {
      "decrypt": "Decrypt",
      "desc": "Restore an existing evan.network Identity on this device",
      "get-mnemonic": "Recovery Key",
      "get-mnemonic-desc": "Please enter the 12 words you received during sign up.",
      "get-password": "Decrypt Identity",
      "get-password-desc": "Enter your password to access the data of your Identity.",
      "invalid-password": "The provided password is invalid.",
      "no-profile": "No Identity found",
      "no-profile-desc": "There is no evan.network Identity associated with this recovery key. Please check your input or use <b>sign up</b> to create an Identity with the current recovery key.",
      "title": "Log in",
      "welcome": "Contact request",
      "welcome-desc": "You have received a contact request."
    },
    "sign-up": {
      "account-type": "Account type",
      "agree": "Agree",
      "alias": "Alias",
      "already-signed-up": "Have an account already? <a href=\"#/dashboard.vue.evan/onboarding.vue.evan/sign-in\">Login</a>",
      "cancel-riddle": "Cancel",
      "create-profile": {
        "creation-time": "about {creationTime} / 30 seconds",
        "desc": "Please confirm your humanity and accept our terms of use.",
        "long": "All data for the creation of your evan.network identity has been recorded. Please confirm the terms of use via the captcha query to complete the process.",
        "status-1": "Creating identity contract...",
        "status-2": "Encrypting user information...",
        "status-3": "Creating mailbox, address book, ...",
        "status-4": "Setting up verification management...",
        "status-5": "Identity was successfully created...",
        "title": "Create Account"
      },
      "create-account": "Create your account",
      "desc": "Create your evan.network Identity",
      "desc-long": "Generate your secure and independent Identity on the evan.network. With the help of this Identity, you can interact with business partners, contracts and companies. You can restore your identity on another device at any time using your generated recovery key and continue working.",
      "errors": {
        "password-match-repeat": "Your password must match the previous one!",
        "password-min-characters": "Your password must be at least 8 characters long!",
        "password-one-character": "Your password must contain at least one lette!r",
        "password-one-digest-needed": "Your password must contain at least one number!",
        "password-one-uppercase-character": "Your password must contain at least one capital letter!",
        "user-name": "Please enter a user name!"
      },
      "get-mnemonic": "Recovery Key",
      "get-mnemonic-desc": "Save your Recovery Key securly.",
      "get-mnemonic-desc-long": "Using this <b>recovery key</b>, you can <b>restore your identity</b> on any device and access your data. Please <b>save these 12 words in a secure way</b> as possible (preferably offline, e.g. on a piece of paper). <br><br> If you lose these 12 words, you will <b>lose access to your business partners, contracts and profile information</b>.",
      "headings": {
        "header-0" : "Your gateway to digitization",
        "desc-0": "Digital Identities alone does not make a network. What is also needed is a neutral operating platform on which transactions between things, organisations and people can be securely and trustfully processed.",
        "header-1": "Transparency",
        "desc-1": "Blockchain technology enables transarency of transaction by secure a non-personalized transparency. Any transaction could be seen by any member of the blockchain. Your privaty is saved by using decrypted addresses instead of plain names. To easy up",
      },
      "password0": "Password",
      "password1": "Retype password",
      "profile-create-error": {
        "desc": "An error occurred during profile creation. Please try again.",
        "ok": "ok",
        "title": "Error"
      },
      "profile-informations": "User Information",
      "profile-informations-desc": "Please define a Username and a Password.",
      "select-account-type": "Please select an account type.",
      "terms-of-use": {
        "desc": "Confirm the Terms of Use.",
        "title": "Terms of use"
      },
      "terms-accepted": "I agree the <a href=\"https://evan.network/terms/\" target=\"_blank\">Terms of Use</a>",
      "title": "Sign up",
      "use-profile": "Continue",
      "user-name": "Username",
      "welcome": "Contact Request",
      "welcome-desc": "You have received a contact request."
    },
    "signed-in": {
      "accept-contact": "accept contact request",
      "go-to-evan": "Continue to evan.network",
      "invited": "Welcome to the evan.network <b>{alias} ({accountId})</b>.<br><br>You were invited by <b>{inviteeAlias}</b> to the evan.network. If you add this contact to your address book, you will receive <b>{eveAmount} EVE</b> as an invitation gift.",
      "title": "evan.network log in",
      "unlock-for-accept": "You are already signed in to the evan.network.<br><br>You have received a contact request from <b>{inviteeAlias}</b>. Unlock your profile to continue or use the back button, to log in with an other identity.",
      "welcome-signed-in": "You are already signed in to the evan.network <b>({accountId})</b>.<br><br>Use the following button to start your work or use the back button, to log in with an other identity.",
      "welcome-unlocked": "Welcome to the evan.network <b>{alias} ({accountId})</b>.<br><br>You can now start your work."
    }
  }
}
/* tslint:enable */
