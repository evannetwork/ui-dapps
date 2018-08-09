/*
  Copyright (C) 2018-present evan GmbH. 
  
  This program is free software: you can redistribute it and/or modify it
  under the terms of the GNU Affero General Public License, version 3, 
  as published by the Free Software Foundation. 
  
  This program is distributed in the hope that it will be useful, 
  but WITHOUT ANY WARRANTY; without even the implied warranty of 
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details. 
  
  You should have received a copy of the GNU Affero General Public License along with this program.
  If not, see http://www.gnu.org/licenses/ or write to the
  
  Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA, 02110-1301 USA,
  
  or download the license from the following URL: https://evan.network/license/ 
  
  You can be released from the requirements of the GNU Affero General Public License
  by purchasing a commercial license.
  Buying such a license is mandatory as soon as you use this software or parts of it
  on other blockchains than evan.network. 
  
  For more information, please contact evan GmbH at this address: https://evan.network/license/ 
*/

export const de = {
  'taskboard': 'Task Board',
  'task-create': 'Neue Aufgabe',
  'queue': 'Datensynchronisation',
  'task': 'Neue Aufgabe hinzufügen',
  '_dapptaskboard': {
    'no-task-created': 'Keine Aufgaben verfügbar',
    'nothing-found-filter': 'Es wurden keine Aufgaben mit dem Inhalt <b>{{ filter }}</b> gefunden...',
    'add': 'Neue Aufgabe hinzufügen',
    'remove': 'Entfernen',
    'filter-items': 'Aufgaben filtern oder erstellen...',
    'create-form': {
      'task-title': 'Titel *',
      'members' : 'Mitglieder *',
      'what-needs-to-be-done' : 'Was muss erledigt werden?',
      'add-todo-hint': `
        Bitte geben ein ToDo in das Textfeld ein und bestätigen sie mit der Eingabetaste.<br><br>
        <b>Fügen Sie mindestens ein ToDo hinzu, um fortzufahren.</b>
      `,
      'todos': 'ToDos *',
      'add-member': 'Mitglied hinzufügen:',
      'criteria': 'Erfüllungskriterien',
      'me': 'Mir',
      'i': 'Ich',
      'criteria-description': 'Um ein ToDo abzuschließen, müssen die Erfüllungskriterien erfüllt sein.',
      'task-finish-in-order': 'ToDo\'s müssen in Reihenfolge abgearbeitet werden'
    },
    'dispatcher': {
      'create-task': 'Aufgabe erstellen',
      'create-task-description': 'Initialisiert neue Aufgaben inklusive Mitgliedern und ToDos.',
    },
    'todocriteria': {
      'comment': 'Kommentar',
      'img': 'Bild',
    },
    'contract-invitation': {
      'text-title': 'Vertragseinladung',
      'text-body': `
Sie wurden zu folgendem Task eingeladen {{ taskName }}.
Aktivieren Sie den Anhang dieser Mail, um die Einladung anzunehmen.
`
    },
    'submit': 'Bestätigen',
    'cancel': 'Abbrechen',
    'loading': 'Auftrag laden...',
    'solved-by': 'Erledigt von',
    'solved-at': 'Erledigt',
    'created': 'Erstellt am',
    'members': 'Mitglieder',
    'todos': 'ToDos',
    'created-by': 'Erstellt von',
    'no-members': 'Keine Mitglieder eingeladen',
    'contract-id': 'Vertrags ID',
    'contract-locked': 'Vertrag gesperrt',
    'contract-locked-desc': `
      Sie sind kein Teilnehmer dieser Aufgabe und sie besitzen nicht die benötigten Rechte um die
      internen Daten zu lesen.
    `,
    'contract-state': 'Aufgabenstatus',
    'contract-states': {
      'undefined': 'Unbekannt',
      '0': 'Initial',
      '1': 'Fehler',
      '2': 'Entwurf',
      '3': 'ausstehende Genehmigung',
      '4': 'Geprüft',
      '5': 'Aktiv',
      '6': 'Verifiziert abgeschlossen',
      '7': 'Abgeschlossen',
      'loading': 'Aktualisieren...'
    },
    'my-states': {
      'undefined': 'Unbekannt',
      '0': 'Initial',
      '1': 'Fehler',
      '2': 'Entwurf',
      '3': 'Abgelehnt',
      '4': 'Aktiv',
      '5': 'Abgeschlossen',
      'loading': 'Aktualisieren...'
    },
    'set-terminated': 'Aufgabe abschließen',
    'set-active': 'Aufgabe starten',
    'my-state': 'Mein Status',
    'set-my-state-active': 'Annehmen',
    'reject-task': 'Ablehen',
    'not-activated': 'Vertrag nicht aktiviert',
    'not-activated-desc': 'Dieser Vertrag ist nicht für Sie aktiviert. Bitte aktivieren Sie diesen Vertag, um ToDos abzuarbeiten.',
    'task-status': 'Auftragsstatus',
    'task-details': 'Auftragsdetails',
    'set-me-terminated': 'Bearbeitung abschließen',
    'for': 'für',
    'creator': 'Ersteller',
    'reallyTerminate': 'Aufgabe abschließen ?',
    'reallyTerminateMessage': 'Wenn Sie die Aufgabe abschließen sind keine Änderungen mehr von den eingeladenen Benutzern möglich',
    'solveTodo': 'ToDo abschließen ?',
    'solveTodoMessage': 'Wollen Sie das ToDo als erledigt markieren ?',
    'startToSolveTodo': 'Aufgabe nicht gestartet',
    'startToSolveTodoMessage': 'Die Aufgabe muss gestartet sein, damit Todos abgearbeiet werden können.',
    'created-from': 'Erstellt von'
  }
};

