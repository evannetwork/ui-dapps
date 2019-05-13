# Data Container DApp

Handle data containers in digital twins.

## HTML Selectors

### Create
- #container-create-form
  - #template
  - #name
  - #description
- #container-create-step-0-finish
- #container-finish
- #container-create-question
  - #container-create

### Detail
- #container-context-menu-open
- #container-context-menu
  - #container-dbcp-edit
  - #container-share
  - #container-container-link
  - #container-clone
  - #container-template-create
- #container-save
- #container-share-modal
  - #subject
  - #shareUser
  - #read${ index }
  - #write${ index }
  - #clear${ index }
  - #container-share
  - #container-go-addressbook
- #container-dbcp-modal
  - #name
  - #description
  - #container-dbcp-save
- [Template-Handler](###Template-Handler)
- #container-saving

### Template
- #template-context-menu-open
- #template-context-menu
  - #template-dbcp-edit
  - #template-share
  - #template-container-create
  - #template-clone
- #template-share-modal
  - #subject
  - #shareUser
  - #template-share
  - #template-go-addressbook
- #template-dbcp-modal
  - #name
  - #description
  - #template-dbcp-save
- [Template-Handler](###Template-Handler)
- #template-save
- #template-saving

### Template-Handler
- #th-cache-modal
  - #th-cache-clear
  - #th-cache-restore
- #th-unsaved-changes-modal
- #th-entry-${ property.replace('.', '')
- #th-entry-add-show
- #th-cache-modal-show
- #th-entry-add-form
  - #type
  - #arrayType
  - #name
- #th-add-entry
- [Entry](###Entry)

### Entry
- #dc-entry-${ entryName }
- [Entry-Object](###Entry-Object)
- [Entry-List](###Entry-List)
- [Entry-Field](###Entry-Field)

### Entry-Object
- #entry-object-schema-edit
- #entry-object-edit
- #entry-object-edit-cancel
- #entry-object-edit-save
- [AJV-Editor](###AJV-Editor)

### Entry-List
- #entry-list-schema-edit
- #entry-list-schema
  - #entry-list-schema-cancel
  - #entry-list-schema-save
  - [AJV-Editor](###AJV-Editor)
- #entry-list-add-entry
- #entry-list-add
  - #entry-list-add-cancel
  - #entry-list-add-save
  - [AJV-Editor](###AJV-Editor)
  - [Single-Field](###Single-Field)
- #entry-list-table
  - #entry-list-remove
  - #entry-list-load-more
  - [Single-Field](###Single-Field)
    - list-value-${ index }

### Entry-Field
- #entry-field-edit
- #entry-field-cancel
- #entry-field-save
- [Single-Field](###Single-Field)

### Single-Field
- [Single-Files](###Single-Files)
- [Single-Number](###Single-Number)
- [Single-String](###Single-String)

### AJV-Editor
- #name-${ index }
- #type-${ index }
- #ajv-add-field
- #ajv-remove-field
- #dc-field-${ index }

### Files
- #file-input-remove-modal
  - #file-input-remove-accept
  - [Modals](###Modals)
- #file-input-remove
- #file-input-download-${ index }
- #file-input-upload

### Numbers
- #value / #value-${ index }

### String
- #value / #value-${ index }

