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
  'task-create': 'Neuer Auftrag',
  'queue': 'Datensynchronisation',
  'task': 'Neuen Auftrag hinzufügen',
  'open-dapp': 'DApp öffnen',
  '_dapptaskboard': {
    'no-task-created': 'Keine Aufträge verfügbar',
    'nothing-found-filter': 'Es wurden keine Aufträge mit dem Inhalt <b>{{ filter }}</b> gefunden...',
    'add': 'Neuen Auftrag hinzufügen',
    'add-hint': 'Bitte alle mit * gekennzeichneten Felder ausfüllen.',
    'remove': 'Entfernen',
    'filter-items': 'Aufträge filtern oder erstellen...',
    'solve-todo': 'Speichern',
    'close-todo': 'Zurück',
    '_dapptaskboard.min': 'min.',
    'create-task': 'Aufgabe erstellen',
    'showMore': 'Technische Vertragsdetails anzeigen',
    'showLess': 'Technische Vertragsdetails verbergen',
    'add-members': 'Mitglieder hinzufügen',
    'invite-members': 'Einladungen versenden',
    'technical-details': 'Technische Vertragsdetails',
    'task-reload': 'Auftrag wird aktualisiert...',
    'yes': 'Ja',
    'no': 'Nein',
    'todo-finish-not-allowed': 'Sie sind nicht berechtigt Aufgaben abzuschließen.',
    'rlyFinishMember': 'Auftrag abschließen',
    'rlyFinishMemberMessage': `
      Wenn Sie die Arbeit an diesem Auftrag fertig melden, wird Ihr Auftraggeber über den Fortschritt benachrichtigt und
      eine weitere Bearbeitung ist nicht mehr möglich.
    `,
    'strict-finish-hint': `
      Die Aufgaben müssen nacheinander abgearbeitet werden. Bitte schließen Sie die vorherige
      Aufgaben ab.
    `,
    'todo-finish-hint-1': `
      Die Aufgaben muss gestartet sein und Sie zu bearbeiten.
    `,
    'todo-finish-hint-2': `
      Sie müssen die Bearbeitung dieses Auftrags akzeptieren, um Ihn zu bearbeiten. 
    `,
    'create-form': {
      'task-title': 'Titel *',
      'members' : 'Mitglieder *',
      'what-needs-to-be-done' : 'Was muss erledigt werden?',
      'title-placeholder': 'Geben Sie den Titel des Auftrags',
      'add-todo-hint': `Fügen Sie mindestens eine Aufgabe hinzu, um fortzufahren.`,
      'todos': 'Aufgaben *',
      'add-member': 'Mitglied hinzufügen:',
      'criteria': 'Erfüllungskriterien',
      'me': 'Mir',
      'i': 'Ich',
      'criteria-description': 'Um eine Aufgabe abzuschließen, müssen die Erfüllungskriterien erfüllt sein.',
      'task-finish-in-order': 'Aufgaben müssen in Reihenfolge abgearbeitet werden',
      'new-todo': 'Neue Aufgabe',
      'order': 'Aufgabenreihenfolge'
    },
    'dispatcher': {
      'create-task': 'Auftrag erstellen',
      'create-task-description': 'Initialisiert neue Auftrag inklusive Mitgliedern und Aufgaben.',
      'todo-log': 'Aufgabe abschließen',
      'todo-log-description': 'Speichert abgeschlossene Aufgaben am Vertrag',
      'state': 'Vertragsstatus ändern',
      'state-description': 'Ändert den Status eines Vertrags'
    },
    'todocriteria': {
      'comment': 'Kommentar',
      'comment-desc': 'Kommentar',
      'pictures': 'Bilder',
      'files': 'Dateien',
      'choice': 'Auswahl (ja / nein)',
      'choice-label': 'Frage',
      'choice-required': 'Muss mit Ja beantwortet werden?',
      'min-pics-required': 'Mindestanzahl an Bildern',
      'min-files-required': 'Mindestanzahl an Dateien',
      'comment-required': 'Kommentar erforderlich?',
      'take-a-picture': 'Bild hinzufügen',
      'no-pictures-taken': 'Es wurden noch keine Bilder aufgenommen.',
      'signature': 'Unterschrift',
      'signature-required': 'Ist die Unterschrift erforderlich?',
      'signature-clear-text': 'Klarname',
      'empty-signature': 'Es wurden noch keine Unterschrift gespeichert.',
      'label': 'Kriterium',
      'description': 'Beschreibung',
      'required': 'Erforderlich',
      'none': 'Bestätigung',
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
    'todos': 'Aufgaben',
    'add-new-todos': 'Neue Aufgaben hinzufügen',
    'created-by': 'Erstellt von',
    'no-members': 'Keine Mitglieder eingeladen',
    'contract-id': 'Vertrags ID',
    'solve-task-hint': 'Um eine Aufgabe abzuschließen, müssen die Aufgaben erfüllt sein.',
    'contract-locked': 'Vertrag gesperrt',
    'contract-locked-desc': `
      Sie sind kein Teilnehmer dieser Aufgabe und Sie besitzen nicht die benötigten Rechte um die
      internen Daten zu lesen.
    `,
    'contract-state': 'Auftragsstatus',
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
    'set-terminated': 'Auftrag abschließen',
    'set-contract-terminated': 'Auftrag abschließen',
    'set-active': 'Auftrag starten',
    'my-state': 'Mein Status',
    'set-my-state-active': 'Annehmen',
    'reject-task': 'Ablehen',
    'not-activated': 'Vertrag nicht aktiviert',
    'not-activated-desc': 'Dieser Vertrag ist nicht für Sie aktiviert. Bitte aktivieren Sie diesen Vertag, um Aufgaben abzuarbeiten.',
    'task-status': 'Auftragsstatus',
    'task-details': 'Auftragsdetails',
    'set-me-terminated': 'Bearbeitung abschließen',
    'for': 'für',
    'creator': 'Ersteller',
    'reallyTerminate': 'Auftrag abschließen?',
    'reallyTerminateMessage': 'Wenn Sie diesen Auftrag abschließen sind keine Änderungen mehr von den eingeladenen Benutzern möglich',
    'solveTodo': 'Aufgabe abschließen?',
    'solveTodoInvalid': 'Aufgabe abschließen nicht möglich',
    'solveTodoMessage': 'Wollen Sie die Aufgabe als erledigt markieren?',
    'startToSolveTodo': 'Aufgabe nicht gestartet',
    'startToSolveTodoMessage': 'Die Aufgabe muss gestartet sein, damit Aufgaben abgearbeiet werden können.',
    'created-from': 'Erstellt von'
  }
};

