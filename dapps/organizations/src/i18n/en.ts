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
const i18n: any = {
  "_org": {
    "breadcrumbs": {
      "identification": "Identification",
      "organizations": "Organizations"
    },
    "dispatchers": {
      "request-identification": "Requesting Identification...",
      "verification-accept": "Accepting Identification..."
    },
    "ident-notary": {
      "account-id": "Account-ID",
      "info": "Identify your account to be a trusted evan.network member",
      "issue": {
        "accountId": {
          "desc": "Account ID for which the notarial confirmation should be created.",
          "error": "Please enter a valid Account ID!",
          "title": "Account-ID"
        },
        "files": {
          "error": "You must add at least 1 notarized document to continue.",
          "title": "Notarially certified files"
        },
        "header": "Issue Identification Verification",
        "issue": "Issue Identification Verification"
      },
      "learn-more": "Learn more",
      "pin": {
        "confirmation-code": "Your confirmation code is",
        "confirmation-code-desc": "Print your confirmation code and mail it to the address on the document.",
        "desc": "Please enter the PIN that was sent to you and generate your confirmation code. Please send it to the address below.",
        "desc-hin": "Please pay attention to upper and lower case.",
        "desc2": "This service will cost 150 EVE.",
        "generate-answer": "Generate confirmation code",
        "header": "Notarial Identification",
        "pin": {
          "desc": "The PIN contained in the letter.",
          "error": "Please enter a PIN to continue.",
          "error2": "The PIN entered was not correct. Please enter the correct PIN.",
          "title": "PIN"
        }
      },
      "print": "Print",
      "request": {
        "header": "Notarial Identification",
        "request-ident": "Beantragen"
      },
      "status": {
        "accepted": "notarially identified",
        "confirming": "under review",
        "forwarding": "is processed by the provider",
        "issued": "notarially identified",
        "requested": "requsted",
        "title": "Identification",
        "unkown": "no identification"
      },
      "status-actions": {
        "confirming": "Print confirmation code",
        "issued": "Accept",
        "requested": "Enter PIN",
        "unkown": "Request"
      },
      "title": "Overview",
      "verification": {
        "accept": "Accept",
        "company": "Company-Identitfication",
        "company-random": "Company-ID-Identification",
        "incorrect": "The company IDs issued to you were not created by the correct instance.",
        "status": "Status"
      }
    },
    "overview": {
      "title": "My Organizations"
    },
    "types": {
      "organization": "Organization",
      "person": "Person"
    }
  }
}
/* tslint:enable */

export default i18n;
