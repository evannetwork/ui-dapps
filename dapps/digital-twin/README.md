# Digital Twin

## HTML Selectors
### Root
- #dt-nav-digitaltwin-details
  - #dt-nav-general
  - #dt-nav-verifications
- #dt-nav-container-overview
  - #dt-nav-containers
  - #dt-nav-${ subCategory.path.split('/').pop() }

### Open
- #dt-lookup
- [ENS-Field](###ENS-Field)
- [ENS-Actions](###ENS-Actions)

### Create
- #dt-general-form
  - #use-address
  - #name
  - #description
  - [ENS-Field](###ENS-Field)
- #evam-dt-create
- #dt-save
- #dt-creating
- [ENS-Actions](###ENS-Actions)

### Map
- #dt-lookup-modal
  - #dt-lookup-map-ens
- #dt-lookup-check-ens
- #dt-map-binding
- #dt-ens-form
  - [ENS-Field](###ENS-Field)
- [ENS-Actions](###ENS-Actions)

### General
- #dt-general-dropdown
  - #dt-general-favorite-toggle
  - #dt-general-map-ens

### ENS-Field
- #dt-ens-select
- #address

### ENS-Actions
- #dt-ens-create
- #dt-ens-purchase
- #dt-ens-purchasing
- #dt-lookup-modal-
  - #open
  - #create
  - #error
  - #missing-balance
  - #purchase
  - #already-registered

### Containers
- #dt-containers-dropdown
- #dt-container-link
- #dt-container-create
- #dt-container-${ container.path.split('/').pop()

### Container Link
- #dt-container-lookup
- #dt-container-linking
- #dt-container-link-invalid
- #dt-container-dt-change
- #dt-container-link-form
  - #name
  - #address
  - #dt-container-link
- [General](###General)
- [ENS-Field](###ENS-Field)
- [ENS-Actions](###ENS-Actions)