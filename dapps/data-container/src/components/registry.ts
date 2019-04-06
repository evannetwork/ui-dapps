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

// import evan libs
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';

import AJVComponent from './entries/ajv/ajv.vue';
import EntryComponent from './entry/entry.vue';
import EntryListComponent from './entries/list/list.vue';
import EntryObjectComponent from './entries/object/object.vue';
import EntrySchemaComponent from './entries/schema/schema.vue';
import FieldComponent from './entries/field/field.vue';
import FieldFilesComponent from './fields/files/files.vue';
import FieldImagesComponent from './fields/images/images.vue';
import FieldNumberComponent from './fields/number/number.vue';
import FieldStringComponent from './fields/string/string.vue';
import TemplateHandlerComponent from './template-handler/template-handler.vue';

// export them all, so other applications can access them
export { }

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'di-ajv', component: AJVComponent },
  { name: 'di-entry', component: EntryComponent },
  { name: 'di-field', component: FieldComponent },
  { name: 'di-entry-list', component: EntryListComponent },
  { name: 'di-entry-object', component: EntryObjectComponent },
  { name: 'di-entry-schema', component: EntrySchemaComponent },
  { name: 'di-field-files', component: FieldFilesComponent },
  { name: 'di-field-images', component: FieldImagesComponent },
  { name: 'di-field-number', component: FieldNumberComponent },
  { name: 'di-field-string', component: FieldStringComponent },
  { name: 'di-template-handler', component: TemplateHandlerComponent },
];

export default componentRegistration;
