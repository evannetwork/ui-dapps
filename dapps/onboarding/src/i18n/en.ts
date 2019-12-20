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

export const en = {
  'onboarding': 'Onboarding',
  'onboardinglist': 'Onboarding',
  '_dapponboarding': {
    'accept-contact': 'add contact',
    'invited-info': 'You were invited by <b>{{ inviteeAlias }}</b> to the evan.network.',
    'invited-desc': 'If you add this contact to your address book, you will receive <b>{{ eveAmount }} EVE</b> as an invitation gift.',
    'open-last-dapp': 'go to evan.network',
    'logout': "logout",
    'already-joined': 'evan.network Onboarding',
    'already-joined-desc': 'You are registered and logged in to the evan.network',
    'onboarding': 'Welcome to the <b>evan.network</b>',
    'welcome': 'Welcome to the <b>evan.network</b>',
    'what-is-evan': 'What is the <b>evan.network</b>?',
    'onboarding-info': 'You were invited to the evan.network by <b>{{ inviteeAlias }}</b>.',
    'onboarding-desc': 'When you finish the onboarding process you receive <b>{{ eveAmount }} EVE</b>.',
    'welcome-desc': `
    The <b>evan.network</b> is a <b>platform</b> for the coordination of value creation in <b>partner networks</b>.
      With the help of <b>block chain technology</b>, the <b>evan.network</b> creates direct communication between
    medium-sized companies without the need for a central intermediary, <b>cost-efficient</b>, <b>binding</b> and <b>audit-proof</b>.
      With the <b>evan.network</b> you can lead your processes into the <b>"Industry 4.0"</b> era.
    `,
    'start-using-evan': 'To start in evan.network, choose one of the following options',
    'new-mnemonic-account': 'Create a new identity',
    'mnemonic-account': 'Use an existing identity',
    'metamask-account': 'Use MetaMask',
    'metamask': 'Metamask',
    'metamask-locked': `Metamask is locked`,
    'metamask-locked-desc': `
    Your Metamask Plugin is locked or not installed. Please unlock / install it and try again.
      `,
    'download-here': 'Install',
    'metamask-browser-not-supported': 'Browser not supported',
    'metamask-browser-not-supported-desc': `
    It seems that your browser does not support Metamask. Please use one of the following browsers:
      <ul>
      <li>Google Chrome</li>
      <li>Opera</li>
      <li>Firefox</li>
      </ul>
      `,
    'install': 'Install',
    'install-and-reload': 'and',
    'reload': 'Reload app',
    'start': 'Start using the evan.network',
    'profile-create': 'evan.network Profile',
    'disagree': 'Disagree',
    'agree': 'Agree',
    'terms-of-use': 'Terms of use',
    'identity-create': 'Create New Identity',
    'identity-import': 'Use Existing Identity',
    'mnemonic-description': `
      You want to create a new identity. These 12 words represent the recovery phrase, or the Master PIN for your new evan.network identity. They are the only way import your data to other devices or recover your data. This might be necessary when you lose or reset your current device.
    `,
    'mnemonic-import-description': `
    Please insert your 12 word <b>evan.network</b> identity recovery phrase.
      `,
    'mnemonic-write-down': `
    Please save these words in a safe way (e. g. sheet of paper).
      `,
    'have-writte-down': 'Continue',
    'cancel-have-writte-down': 'Show all',
    'mnemonic-riddle': 'Please fill the empty words to ensure, that you write down all words correct.',
    'ask-writte-down': {
      'title': 'Have you really written down these words?',
      'message': `If you lose these 12 words, you will lose access to your business partners,
      contracts and other metadata irrevocable.`,
      'cancel': 'Cancel',
      'ok': 'Continue'
    },
    'no-profile': 'evan.network Profile missing',
    'no-profile-desc': `
      To use evan.network Apps and to save your personal data, it's necessary to create a
      profile.
      Please insert your name and continue by clicking "Create Profile".
       <ul>
        <li>Your user name is a human readable alias to display additionally to your account ID.</li>
        <li>The password is used to protect your private key  that is stored locally.<br/>
            This way your data is still protected when either one of your devices with the private key,
            or even the blockchain itself is somehow compromised: you need both the key and the password.</li>
       </ul>
    `,
    'create-profile': 'Create Profile',
    'user-alias': 'Your User Name',
    'error': 'Error occurred',
    'error-message': 'An error occuredd. Please try again.',
    'error-verification': 'Error occurred',
    'error-verification-message': 'An error occurred while transferring your invitation EVEs, please try again',
    'retry': 'Retry',
    'report-error': 'Report Error',
    'wait-for-profile': 'Please wait while your profile is being created.',
    'account-id': 'Active Profile-ID',
    'balance': 'Profile Balance',
    'refresh': 'Refresh',
    'startCapital': {
      'title': 'Starting Balance',
      'desc': "This account has no balance yet and can't initiate any transactions.<br/>For this reason we provide a little start capital. After ensuring you are not a web-bot.",
      'get': 'Get a little start capital.',
      'limitExceeded': "You can't get EVEs like this anymore.",
      'withinLimit': 'You received {{ amount }} EVEs.',
      'limitLeft': 'You can do this {{ limit }} more times.',
      'faucet': 'You can get more at <a href="https://gitter.im/evannetwork/faucet" target="_blank">https://gitter.im/evannetwork/faucet</a>.',
      'fail': `
Unfortunately, an error has occurred.
Try again later or use <a href="https://gitter.im/evannetwork/faucet" target="_blank">https://gitter.im/evannetwork/faucet</a>.`,
    },
    'no-balance': 'Balance too low',
    'no-balance-desc': `
      The balane of your profile is too low to create your profile.
      Please transfer some Etherem to your profile.
    `,
    'mail-invitation-accepted': {
      'title': 'Invitation accepted',
      'subject': 'Invitation request Accepted',
      'body':
        `Hi,

    Your invitation request was accepted. The User is onboarded with the alias {{ userAlias }}.

    With kind regards,

    the evan.network team`,
    },
    'ok': 'Ok',
    'copy-account-id': 'Copy Account ID',
    'next': 'Next',
    'metamask-no-words-found': 'No suggestion found...',
    'invalid-mnemonic': 'Your password word order is incorrect. Please check your entered words.',
    'show-mnemonic-input': 'Advanced',
    'mnemonic': '12-Word Password',
    'password': 'Password',
    'password-repeat': 'Password-Repeat',
    'password-min-characters': 'Your password must be at least 8 characters.',
    'password-one-character': 'Your password must contain at least one letter.',
    'password-one-uppercase-character': 'Your password must contain at least one uppercase letter.',
    'password-one-digest-needed': 'Your password must contain at least one digit.',
    'password-match-repeat': 'Your password must match the repeated one.',
    'onboarded': 'evan.network',
    'onboarded-desc': 'You joined evan.network. Welcome.',
    'onboarded-balance': 'If you need funds for development you can get more at <a href="https://gitter.im/evannetwork/faucet" target="_blank">https://gitter.im/evannetwork/faucet</a>.',
    'profile-provider': 'Your profile is safely stored and encrypted in evan.network.',
    'profile-metamask': 'the Metamask browser plugin',
    'scan-qr-code-mnemonic': 'Scan mnemonic QR-Code'
  }
};
