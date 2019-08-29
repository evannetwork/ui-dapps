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
const i18n: any ={
  "_org": {
    "breadcrumbs": {
      "identifications": "Identifications",
      "notary": "Notary",
      "organization": "Organization",
      "organizations": "Organizations",
      "verification": "Verification"
    },
    "dispatchers": {
      "request-verification": "Requesting Verification...",
      "verification-accept": "Accepting Verification..."
    },
    "ident": {
      "back": "Go back",
      "categories": {
        "identifications": "Identifications",
        "notary": "Notary Verification"
      },
      "done": "Close",
      "error": "Error",
      "error-loading": "An error occurred while loading the data. Please try again.",
      "next": "Next",
      "notary": {
        "account-id": "Account-ID",
        "check-updates": "Checking for updates...",
        "info": "Identify your account to be a trusted evan.network member",
        "issue": {
          "accountId": {
            "desc": "Account ID for which the notary confirmation should be created.",
            "error": "Please enter a valid Account ID!",
            "title": "Account-ID"
          },
          "header": "Issue Organization Verification",
          "issue": "Issue Organization Verification",
          "issuing": "Issuing Organization Verification",
          "file-rename-hint": "The uploaded files will be renamed to a uniform naming scheme during the organization verification process.",
          "issued": {
            "error": {
              "desc": "The organization verification could not be issued. Please try again or contact your administrator.",
              "title": "Error"
            },
            "success": {
              "desc": "The organization verification was issued successfully.",
              "title": "Finished"
            }
          },
          "issuing": "Issuing Identification Verification",
          "privateFiles": {
            "error": "You must add at least 1 notarized document to continue.",
            "title": "Private, Notary certified files"
          },
          "publicFiles": {
            "error": "You must add at least 1 notarized document to continue.",
            "title": "Public, Notary certified files"
          },
          "requestId": {
            "desc": "Enter the request ID for which the notary verification is to be completed.",
            "error": "Please enter a correct request ID",
            "title": "Request ID"
          }
        },
        "learn-more": "Learn more",
        "no-requests": "You have not yet requested a Notary Verification. Use the following button to request one.",
        "pin": {
          "confirmation-code": "Your confirmation code was successfully generated.",
          "confirmation-code-desc": "Print your confirmation document.",
          "desc": "Please enter the PIN that was sent to you and generate your confirmation code.",
          "desc-hin": "Please pay attention to upper and lower case.",
          "did-printed": "Did you print the document?",
          "do-not-forget": "Please ensure to sign and stamp the document before sending it to the requesting notary.",
          "download": "No option to print now? Download as PDF file.",
          "generate-answer": "Generate code",
          "header": "Authentication",
          "next-step": "After successful verification by the notary, your account will be verified.",
          "next-step2": "You will be informed of this in your account mailbox.",
          "pin": {
            "desc": "The six digits PIN you received within the letter.",
            "error": "Please enter the PIN to continue.",
            "error2": "The PIN entered was not correct. Please enter the correct PIN.",
            "title": "PIN"
          },
          "step": {
            "pin": "PIN",
            "print": "Print Document",
            "send": "Send via Letter"
          }
        },
        "print": "Print",
        "reload": "Reload",
        "request": {
          "address": {
            "desc": "Enter address",
            "error": "Please enter an address.",
            "title": "Address"
          },
          "city": {
            "desc": "City",
            "error": "Please enter a city.",
            "title": "City"
          },
          "contact": {
            "desc": "Enter contact name",
            "error": "Please enter a contact person",
            "title": "Contact"
          },
          "costs": {
            "approve": "Yes, I request notarial verification, at the transaction cost of 200 EVE.",
            "description": "The transaction costs for notarial verification are 200 EVE. Your wallet will be debited with this amount.",
            "hint": "The request for a notarial verification is subject to a fee.",
            "title": "Costs"
          },
          "countries": {
            "germany": "Germany"
          },
          "country": {
            "desc": "Company headquarters country",
            "error": "Please select the company headquartes country",
            "title": "Company HQ country"
          },
          "court": {
            "desc": "Where is the company registered?",
            "error": "Please enter the information of the registration authority!",
            "title": "Register Court"
          },
          "department": {
            "desc": "Department",
            "error": "Please insert the department of the company!",
            "title": "Department of the company"
          },
          "description": "Please fill in the formular to request a notary verification of your organisation. This service is subject to a fee.",
          "header": "Notary Verification",
          "how": {
            "steps": {
              "1": {
                "description": "Enter the commercial register number, register court, your address and a contact person.",
                "title": "1st Step: Request"
              },
              "2": {
                "description": "You will receive a PIN by letter. Use this to generate the confirmation document and send it signed to the inquiring notary.",
                "title": "2nd Step: Authenticate"
              },
              "3": {
                "description": "If the notarial verification is successful, you will be notified. Accept the verification as the last step.",
                "title": "3rd Step: Accept"
              }
            },
            "title": "Steps"
          },
          "mail": {
            "body": "I hereby request a Notary Verification with the following information: <br><br><ul><li>Evan-AccountID: {organizationEvanId}</li><li>Commercial Register Number: {organizationRegistrationNumber}</li><li>Organization: {organizationName}</li><li>Contact: {organizationContact}</li><li>Address: {organizationStreetAddress}</li><li>City: {organizationZipCode} {organizationCity} ,{organizationCountry}</li></ul>",
            "title": "Request for Notary Verification"
          },
          "not-enough-funds": "<i class=\"mdi mdi-alert-outline\"></i> You need at least 200 EVE on your wallet. Your wallet has insufficient funds ({readableFunds} EVE)! <a href=\"/#/dashboard.evan/profile.evan/buy-eve\">Buy EVE</a>",
          "organization": {
            "desc": "Organization name",
            "error": "Please enter a organization name",
            "title": "Organization"
          },
          "postal-address": "Postal Address",
          "proof": {
            "description": "To complete the notary verification, you will receive a PIN by letter from a notary to attention of the following person.",
            "title": "Please check all information."
          },
          "register": {
            "desc": "Type of register",
            "error": "Please select the rgister type!",
            "title": "Register"
          },
          "registerNumber": {
            "desc": "98765",
            "error": "Please enter the registration number",
            "title": "Registration number"
          },
          "request-ident": "Request",
          "request-verification": "Request notary verification",
          "requested1": "You have successfully applied for a Notary Verification for your organization.",
          "requested2": "Your wallet has been charged 200 EVE.",
          "requested3": "You will receive a letter from a notary soon.",
          "requesting": "Notary verification is requested...",
          "step": "Step",
          "who": {
            "description": "As a registered company you can request a notarial verification of your account.",
            "link": "read more",
            "title": "Prerequisites"
          },
          "why": {
            "description": "The notarial verification confirms that your company has the account ID {accountId}. With this confirmation you can prove yourself to your business partners and verify that transactions, digital twins and smart contracts originate from you.",
            "link": "read more",
            "title": "Advantages"
          },
          "zipCode": {
            "desc": "Postcode",
            "error": "Please enter a valid post code",
            "title": "Postcode"
          }
        },
        "request-error": "Request could not be loaded!",
        "status": {
          "accepted": "verified by notary",
          "confirming": "under review",
          "finished": "verified by notary",
          "forwarding": "is processed by the provider",
          "issued": "verified by notary",
          "requested": "requested",
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
        "step": {
          "costs": "Costs",
          "summary": "Summary",
          "your_data": "Your Data"
        },
        "title": "Notary Verification",
        "verification": {
          "accept": "Accept",
          "incorrect": "The organization IDs issued to you were not created by the correct instance.",
          "organization": "Organization-Verification",
          "organization-random": "Organization-ID-Verification",
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
