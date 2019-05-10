# Digital Twin

## HTML Selectors
### Root
- evan-dt-nav-digitaltwin-details
  - evan-dt-nav-general
  - evan-dt-nav-verifications
- evan-dt-nav-container-overview
  - evan-dt-nav-containers
  - evan-dt-nav-${ subCategory.path.split('/').pop() }

### Open
- [ENS-Field](###ENS-Field)
- [ENS-Actions](###ENS-Actions)
- evan-dt-lookup

### Create
- evan-dt-general-form
  - use-address
  - [ENS-Field](###ENS-Field)
  - name
  - description
- evam-dt-create
- evan-dt-save
- evan-dt-creating
- [ENS-Actions](###ENS-Actions)

### Map
- [ENS-Actions](###ENS-Actions)
- evan-dt-lookup-modal
  - evan-dt-lookup-map-ens
- evan-dt-lookup-check-ens
- evan-dt-map-binding
- evan-dt-ens-form
  - [ENS-Field](###ENS-Field)

### General
- evan-dt-general-dropdown
  - evan-dt-general-favorite-toggle
  - evan-dt-general-map-ens

### ENS-Field
- evan-dt-ens-select
- address

### ENS-Actions
- evan-dt-ens-create
- evan-dt-ens-purchase
- evan-dt-ens-purchasing
- evan-dt-lookup-modal-
  - open
  - create
  - error
  - missing-balance
  - purchase
  - already-registered

### Containers
- evan-dt-containers-dropdown
- evan-dt-container-link
- evan-dt-container-create
- evan-dt-container-${ container.path.split('/').pop()

### Container Link
- evan-dt-container-lookup
- evan-dt-container-linking
- evan-dt-container-link-invalid
- evan-dt-container-dt-change
- evan-dt-container-link-form
  - name
  - address
  - evan-dt-container-link
- [General](###General)
- [ENS-Field](###ENS-Field)
- [ENS-Actions](###ENS-Actions)