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
*/

module.exports = {
  browserStack: {
    name: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
  },
  accounts: {
    default: {
      mnemonic: process.env.USER_DEFAULT_MNEMONIC,
      password: process.env.USER_DEFAULT_PASSWORD,
    },
    wallet: {
      mnemonic: process.env.USER_WALLET_MNEMONIC,
      password: process.env.USER_WALLET_PASSWORD,
    },
    wallet2: {
      mnemonic: process.env.USER_WALLET2_MNEMONIC,
      password: process.env.USER_WALLET2_PASSWORD,
    },
    rentalDispo: {
      mnemonic: process.env.USER_RENTAL_DISPO_MNEMONIC,
      password: process.env.USER_RENTAL_DISPO_PASSWORD,
    },
    rentalDriver: {
      mnemonic: process.env.USER_RENTAL_DRIVER_MNEMONIC,
      password: process.env.USER_RENTAL_DRIVER_PASSWORD,
    },
    organizationIdentification: {
      accountId: process.env.USER_ORGANIZATION_IDENT_ACCOUNTID,
      mnemonic: process.env.USER_ORGANIZATION_IDENT_MNEMONIC,
      password: process.env.USER_ORGANIZATION_IDENT_PASSWORD,
    },
    organizationIdentificationNonCompany: {
      mnemonic: process.env.USER_ORGANIZATION_IDENT_NON_COMPANY_MNEMONIC,
      password: process.env.USER_ORGANIZATION_IDENT_NON_COMPANY_PASSWORD,
    },
    accountBased: {
      mnemonic: process.env.USER_ACCOUNT_BASED_MNEMONIC,
      password: process.env.USER_ACCOUNT_BASED_PASSWORD,
    },
    identityBased: {
      mnemonic: process.env.USER_IDENTITY_BASED_MNEMONIC,
      password: process.env.USER_IDENTITY_BASED_PASSWORD,
    },
    identityBased2: {
      mnemonic: process.env.USER_IDENTITY_BASED2_MNEMONIC,
      password: process.env.USER_IDENTITY_BASED2_PASSWORD,
    },
  },
};
