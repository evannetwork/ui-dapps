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

// vue imports
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

// evan.network imports
import { EvanComponent } from '@evan.network/ui-vue-core';
import * as bcc from '@evan.network/api-blockchain-core';
import * as dappBrowser from '@evan.network/ui-dapp-browser';

// allowed mail categories
const mailCategories = {
  received: { icon: 'mdi mdi-email mr-3', offset: 0, mails: [ ] },
  sent: { icon: 'mdi mdi-send mr-3', offset: 0, mails: [ ] },
};

@Component({ })
export default class MailboxComponent extends mixins(EvanComponent) {
  /**
   * show the loading symbol
   */
  loading = true;

  /**
   * Current category of visible contacts
   */
  activeCategory = '';

  /**
   * Mails categorized into received and send
   */
  mailCategories: any = null;

  /**
   * List of read mails
   */
  readMails: Array<string> = JSON.parse(window.localStorage['evan-mail-read'] || '[ ]');

  /**
   * Currents users contacts
   */
  addressBook: any;

  /**
   * Tabs for top navigation
   */
  navEntries: Array<any> = [ ];

  /**
   * Watch for hash updates and load digitaltwin detail, if a digitaltwin was laod
   */
  hashChangeWatcher: any;

  /**
   * Mails are load after the user logged in and runtime was set up by the dapp-wrapper
   */
  async created() {
    this.navEntries = [
      { key: 'received', icon: 'mdi mdi-email-outline' },
      { key: 'sent', icon: 'mdi mdi-send' },
    ]
    .map(entry => (entry ? {
      id: `nav-entry-${ entry.key }`,
      href: `${ (<any>this).dapp.fullUrl }/${ entry.key }`,
      text: `_mailbox.breadcrumbs.${ entry.key }`,
      icon: entry.icon,
    } : null));

    // watch for saving updates
    this.hashChangeWatcher = (async () => {
      if (this.activeCategory !== this.$route.params.category) {
        this.activeCategory = this.$route.params.category;
        await this.loadMails();
      }
    }).bind(this);

    // add the hash change listener
    window.addEventListener('hashchange', this.hashChangeWatcher);
    await this.hashChangeWatcher();
  }

  /**
   * Clear location change watchers
   */
  beforeDestroy() {
    this.hashChangeWatcher && window.removeEventListener('hashchange', this.hashChangeWatcher);
  }

  /**
   * Load the contacts and map them to the tag categories and make it usable from the template
   *
   * @param      {boolean}  reload  was the component reloaded?
   */
  async loadMails(reload?: boolean, mailsToReach = 10) {
    // quick usage
    const runtime = (<any>this).getRuntime();

    // set initial mail object or force mailbox reload on clicking reloading button
    if (!this.mailCategories || reload || !this.addressBook) {
      this.mailCategories = JSON.parse(JSON.stringify(mailCategories));

      // load the contacts for the current user, so we can display correct contact alias
      await this.loadAddressBook();
    }

    // make the first letter of the category upper case, so the correct contract function will be
    // called
    const categoryName = this.activeCategory === 'received' ? 'Received' : 'Sent';
    // load mail inbox informations
    const category = this.mailCategories[this.activeCategory];

    this.$set(category, 'loading', true);

    // show and render the loading
    this.loading = typeof category.totalResultCount === 'undefined';
    await Promise.resolve((resolve) => setTimeout(resolve, 100));

    // load the mails
    const mailResult = await runtime.mailbox.getMails(10, category.offset, categoryName);

    // check for loading more mails
    category.totalResultCount = mailResult.totalResultCount;
    window.localStorage['evan-mail-read-count'] = category.totalResultCount;

    // map all the mails in to an mail array
    const mailArray = Object.keys(mailResult.mails)
      .map((mailAddress: string) => {
        if (mailResult.mails[mailAddress] && mailResult.mails[mailAddress].content) {
          const mail = mailResult.mails[mailAddress].content;
          mail.address = mailAddress;

          return mail;
        }
      })
      .filter(mail => !!mail);

    // apply them to the original array
    category.mails = category.mails.concat(mailArray);

    // raise the offset to load the next mails
    category.offset += 10;

    // if not the full amount of mails could be loaded (could not decrypt), load more, but only if
    // more mails are available
    if (mailArray.length < mailsToReach &&
       ((category.offset - 10) < category.totalResultCount)) {
      await this.loadMails(false, mailsToReach - mailArray.length);
    }

    category.loading = false;
    this.loading = false;
  }

  /**
   * Navigates the mail detail and sets the mail read.
   *
   * @param      {any}  mail    mail object
   */
  openMailDetail(mail: any) {
    (<any>this).evanNavigate(`${ this.activeCategory }/detail/${ mail.address }`);

    // set the mail read and save it into the local store
    if (this.readMails.indexOf(mail.address) === -1) {
      this.readMails.push(mail.address);

      window.localStorage['evan-mail-read'] = JSON.stringify(this.readMails)
    }
  }

  /**
   * load the addressbook for the current user
   */
  async loadAddressBook() {
    const runtime = (<any>this).getRuntime();

    // load the contacts for the current user, so we can display correct contact alias
    delete runtime.profile.trees[runtime.profile.treeLabels.addressBook];
    this.addressBook = (await runtime.profile.getAddressBook()).profile;
  }
}
