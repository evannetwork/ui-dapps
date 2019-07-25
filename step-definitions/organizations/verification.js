import { client } from 'nightwatch-api';
import { Given, When, Then, setDefinitionFunctionWrapper, Tag } from 'cucumber';

/************************************** Fill the formular *****************************************/
let identModal = '#request-verification-modal';
When(/I fill test data into the request verification modal/,
  async () => {
    const identForm = `${ identModal } #ident-formular`;

    await client.setValue(`${ identForm } #organization`, 'evan GmbH');
    await client.setValue(`${ identForm } #country`, 'germany');
    await client.setValue(`${ identForm } #court`, 'Amtsgericht Erfurt');
    await client.setValue(`${ identForm } #register`, 'HRB');
    await client.setValue(`${ identForm } #registerNumber`, '98765');
    await client.setValue(`${ identForm } #address`, 'Johannisplatz 16');
    await client.setValue(`${ identForm } #zipCode`, '99817');
    await client.setValue(`${ identForm } #city`, 'Eisenach');
    await client.setValue(`${ identForm } #contact`, 'Test Contact');
    await client.setValue(`${ identForm } #department`, 'Test Department');
  }
)
