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

// import evan libs
import { ComponentRegistrationInterface } from '@evan.network/ui-vue-core';
import * as dtLib from '@evan.network/digitaltwin.lib';

import AJVComponent from './schema/ajv/ajv.vue';
import AJVValuesComponent from './schema/ajv-values/ajv-values.vue';
import BooleanComponent from './schema/fields/boolean/boolean.vue';
import ContainerActionsComponent from './container/container-actions/container-actions.vue';
import ContainerComponent from './container/container/container.vue';
import ContainerPermissionsComponent from './container/permissions/permissions.vue';
import ContainerTechnicalComponent from './container/technical/technical.vue';
import CreateComponent from './create/create.vue';
import DataContainerTreeComponent from './tree/tree.vue';
import EntryComponent from './schema/entries/entry/entry.vue';
import EntryFieldComponent from './schema/entries/field/field.vue';
import EntryListComponent from './schema/entries/list/list.vue';
import EntryObjectComponent from './schema/entries/object/object.vue';
import FieldComponent from './schema/fields/field/field.vue';
import FieldFilesComponent from './schema/fields/files/files.vue';
import FieldNumberComponent from './schema/fields/number/number.vue';
import FieldObjectComponent from './schema/fields/object/object.vue';
import FieldStringComponent from './schema/fields/string/string.vue';
import NewEntryComponent from './schema/new-entry/new-entry.vue';
import NewlistEntryComponent from './set/new-list-entry/new-list-entry.vue';
import PluginActions from './plugin/plugin-actions/plugin-actions.vue';
import PluginComponent from './plugin/plugin/plugin.vue';
import SetActionsComponent from './set/set-actions/set-actions.vue';
import SetSchemaComponent from './set/schema/schema.vue';

// export them all, so other applications can access them
export { }

// map them to element names, so they can be used within templates
const componentRegistration: Array<ComponentRegistrationInterface> = [
  { name: 'dc-actions', component: ContainerActionsComponent },
  { name: 'dc-ajv', component: AJVComponent },
  { name: 'dc-ajv-values', component: AJVValuesComponent },
  { name: 'dc-create', component: CreateComponent },
  { name: 'dc-detail', component: ContainerComponent },
  { name: 'dc-entry', component: EntryComponent },
  { name: 'dc-entry-field', component: EntryFieldComponent },
  { name: 'dc-entry-list', component: EntryListComponent },
  { name: 'dc-entry-object', component: EntryObjectComponent },
  { name: 'dc-field', component: FieldComponent },
  { name: 'dc-field-boolean', component: BooleanComponent },
  { name: 'dc-field-files', component: FieldFilesComponent },
  { name: 'dc-field-number', component: FieldNumberComponent },
  { name: 'dc-field-object', component: FieldObjectComponent },
  { name: 'dc-field-string', component: FieldStringComponent },
  { name: 'dc-list-entries-add', component: NewlistEntryComponent },
  { name: 'dc-new-entry', component: NewEntryComponent },
  { name: 'dc-permissions', component: ContainerPermissionsComponent },
  { name: 'dc-plugin', component: PluginComponent },
  { name: 'dc-plugin-actions', component: PluginActions },
  { name: 'dc-set-actions', component: SetActionsComponent },
  { name: 'dc-set-schema', component: SetSchemaComponent },
  { name: 'dc-technical', component: DataContainerTreeComponent },
  { name: 'dc-tree', component: DataContainerTreeComponent },
].concat(dtLib.componentRegistration);

export default componentRegistration;
