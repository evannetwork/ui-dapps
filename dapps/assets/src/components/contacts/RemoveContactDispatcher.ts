import { Dispatcher, DispatcherInstance } from '@evan.network/ui';
import { getDomainName } from '@evan.network/ui-dapp-browser';
import { Contact } from './ContactInterfaces';

const removeContactDispatcher = new Dispatcher(
  `assets.${getDomainName()}`,
  'removeContactDispatcher',
  40 * 1000,
  '_assets.dispatcher.remove-contact',
);

removeContactDispatcher
  .step(async (instance: DispatcherInstance, data: Contact) => {
    const { runtime } = instance;

    // ensure latest addressbook is loaded
    await runtime.profile.loadForAccount(runtime.profile.treeLabels.addressBook);

    // remove the contact
    await runtime.profile.removeContact(data.address);

    // save the account
    await runtime.profile.storeForAccount(runtime.profile.treeLabels.addressBook);
  });

export default removeContactDispatcher;
