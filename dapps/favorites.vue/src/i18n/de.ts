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

/* tslint:disable */
export default {
  _favorites: {
    add: 'Favorit hinzufügen',
    'add-form': {
      address: {
        desc: 'Bitte geben Sie die Anwendungsadresse ein. (ENS- / Vertragsadresse)',
        error: 'Bitte geben Sie eine Adresse ein!',
        title: 'Anwendungsadresse',
      },
      modal: {
        added: {
          desc: 'Diese Anwendung ist bereits zu Ihren Favoriten hinzugefügt worden.',
          title: 'Favorit hinzufügen',
        },
        notFound: {
          desc: 'Für die angegebene Adresse konnte keine Anwendung gefunden werden.',
          title: 'Nicht gefunden',
        },
        ok: {
          desc: 'Wollen sie die ausgewählte Anwendung zu Ihren Favoriten hinzufügen?',
          title: 'Favorit hinzufügen',
        },
      },
    },
    dispatcher: {
      add: {
        title: 'Favorit hinzufügen',
        starting: 'Favorit wird hinzufügt',
        step0: false,
        finished: 'Favorit wurde erfolgreich hinzufgefügt',
      },
      remove: {
        title: 'Favorit entfernen',
        starting: 'Favorit wird entfernt',
        step0: false,
        finished: 'Favorit wurde erfolgreich entfernt',
      },
    },
    favorites: 'Favoriten',
    'favorites-desc': 'Übersicht meiner Favoriten',
    'no-favorites': {
      desc: 'Sie haben noch keine Favoriten in hinzugefügt. Nutzen Sie den nachfolgenden Button, um einen Favoriten hinzuzufügen.',
      title: 'Keine Favoriten',
    },
    overview: 'Übersicht',
    remove: 'Favorit löschen',
    'remove-modal': {
      desc: 'Wollen Sie diesen Favorit wirklich löschen?',
      title: 'Favorit löschen',
    },
  },
};
