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
      "verification": "Verification",
      "identifications": "Identifications",
      "notary": "Notary",
      "organization": "Organization",
      "organizations": "Organizations"
    },
    "dispatchers": {
      "request-verification": "Requesting Verification...",
      "verification-accept": "Accepting Verification..."
    },
    "ident": {
      "categories": {
        "identifications": "Identifications",
        "notary": "Notary Verification"
      },
      "notary": {
        "account-id": "Account-ID",
        "info": "Identify your account to be a trusted evan.network member",
        "issue": {
          "accountId": {
            "desc": "Account ID for which the notary confirmation should be created.",
            "error": "Please enter a valid Account ID!",
            "title": "Account-ID"
          },
          "requestId": {
            "desc": "Enter the request ID for which the notary verification is to be completed.",
            "error": "Please enter a correct request ID",
            "title": "Request ID"
          },
          "files": {
            "error": "You must add at least 1 notarized document to continue.",
            "title": "Notary certified files"
          },
          "header": "Issue Identification Verification",
          "issue": "Issue Identification Verification"
        },
        "learn-more": "Learn more",
        "no-requests": "You have not yet requested a Notary Verification. Use the following button to request one.",
        "pin": {
          "confirmation-code": "Your confirmation code was successfully recognized.",
          "confirmation-code-desc": "Print your confirmation code and mail it to the address on the document.",
          "desc": "Please enter the PIN that was sent to you and generate your confirmation code.",
          "desc-hin": "Please pay attention to upper and lower case.",
          "desc2": "Please send it to the address below.",
          "generate-answer": "Generate confirmation code",
          "header": "Notary Verification",
          "pin": {
            "desc": "The six digits PIN you received within the letter.",
            "error": "Please enter the PIN to continue.",
            "error2": "The PIN entered was not correct. Please enter the correct PIN.",
            "title": "PIN"
          }
        },
        "print": "Print",
        "request": {
          "why": {
            "title": "TODO: Warum eine Notarielle Verifikation",
            "intro": "TODO: Mit einer notariellen Verifikation können Ihre Geschäftspartner sicher sein, dass ...",
            "advantages": [
              "TODO: ihr Account von <em>Ihnen</em> und nicht von einem Dritten betrieben wird.",
              "TODO: Ihre Firma im <em>Handelsregister</em> eingetragen ist.",
              "TODO: sie mit <em>vertrauenswürdigen Partnern</em> arbeiten."
            ]
          },
          "how": {
            "title": "TODO: Wie wird Notariell Verifiziert?",
            "intro": "TODO: Die notarielle Verifikation Ihres Accounts erfolgt durch eine notarielle Überprüfung des Handelsregisters sowie einer notariellen Zwei-Faktor-Authentifizierung. Somit bietet diese Form der Account-Verifizierung die höchste Sicherheit im evan.network.",
            "steps": {
              "1": {
                "title": "TODO: Beantragen Sie Ihre Verifikation",
                "question": "TODO: Was brauche ich dafür?"
              },
              "2": {
                "title": "TODO: Warten Sie auf die Aufforderung des Notars",
                "question": "TODO: Wie lange dauert es, bis ich die Aufforderung erhalte?"
              },
              "3": {
                "title": "TODO: Übersenden Sie Ihren Bestätigungscode dem Notar",
                "question": "TODO: Wie erhalte ich meinen Bestätigungscode?"
              },
              "4": {
                "title": "TODO: Erhalten und bestätigen Sie die notarielle Verifikation",
                "question": "TODO:  An wen wende ich mich, wenn ich keine Bestätigung erhalten habe? Wie lange dauert der gesamte Prozess?"
              }
            }
          },
          "costs": {
            "title": "TODO: Was kostet eine Notarielle Verifikation?",
            "intro": "TODO: Für die Ausstellung einer notariellen Verifikation wird Ihr Wallet mit 200 EVE belastet."
          },
          "step": "Step",
          "address": {
            "desc": "Enter address",
            "error": "Please enter an address.",
            "title": "Address"
          },
          "back": "Go back",
          "city": {
            "desc": "Enter city name",
            "error": "Please enter a city.",
            "title": "City"
          },
          "organization": {
            "desc": "Enter organization name",
            "error": "Please enter a organization name",
            "title": "Organization"
          },
          "contact": {
            "desc": "Enter contact name",
            "error": "Please enter a contact person",
            "title": "Contact"
          },
          "countries": {
            "germany": "Germany"
          },
          "country": {
            "desc": "Enter country name",
            "error": "Please enter a country",
            "title": "Country"
          },
          "description": "Please fill in the formular to request a notary verification of your organisation. This service is subject to a fee.",
          "header": "Notary Verification",
          "mail": {
            "body": "I hereby request a Notary Verification with the following information: <br><br><ul><li>Evan-AccountID: {organizationEvanId}</li><li>Commercial Register Number: {organizationRegistrationNumber}</li><li>Organization: {organizationName}</li><li>Contact: {organizationContact}</li><li>Address: {organizationStreetAddress}</li><li>City: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Request for Notary Verification"
          },
          "next": "Next",
          "postal-address": "Postal Address",
          "proof": {
            "contact-is": "Contact person is",
            "footer": "Notary verification is subject to a fee.",
            "footer2": "Your wallet will be charged 200 EVE.",
            "for-org": "For the organization",
            "question-desc": "To complete the notary verification, you will receive a password for the attention of the following person.",
            "title": "Please check all information.",
            "with-reg-number": "with the commercial register number",
            "you-request": "You request one",
            "you-request-2": "Notary Verification"
          },
          "regNumber": {
            "desc": "Enter Commercial Register Number",
            "error": "Please enter a correct commercial register number",
            "title": "Commercial Register Number"
          },
          "request-ident": "Beantragen",
          "requested1": "You have successfully applied for a Notary Verification for your organization.",
          "requested2": "Your wallet has been charged 200 EVE.",
          "requesting": "Notary verification is requested...",
          "zipCode": {
            "desc": "Enter Postcode",
            "error": "Please enter a valid post code",
            "title": "Postcode"
          }
        },
        "status": {
          "accepted": "notarially identified",
          "confirming": "under review",
          "forwarding": "is processed by the provider",
          "issued": "notarially identified",
          "requested": "requsted",
          "title": "Verification",
          "unknown": "no verification"
        },
        "status-actions": {
          "confirming": "Print confirmation",
          "issued": "Accept",
          "requested": "Enter PIN",
          "unknown": "Request",
          "unknown-long": "Request Notary Verification"
        },
        "title": "Notary Verification",
        "verification": {
          "accept": "Accept",
          "organization": "Organization-Identitfication",
          "organization-random": "Organization-ID-Verification",
          "incorrect": "The organization IDs issued to you were not created by the correct instance.",
          "status": "Status"
        }
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
