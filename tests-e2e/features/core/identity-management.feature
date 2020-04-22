Feature: evan.network dashboard

  Scenario: Management UI should be disabled for old profiles
    Given I log in to evan.network using vue with accountBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
    Then I want to see a text including "You are currently logged in with an old, non-identity-based profile. User management for identities is only supported for current profiles."
 
  Scenario: Check correct formular handling
    Given I log in to evan.network using vue with identityBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
    Then I want to see a text including "In the following table, you can add or remove contacts that have access to the current identity. For example, they are authorized to access all data, edit information, share data, or perform transactions."
      And I want to see a text including "No contacts are yet authorized to interact via your identity."
    When I click the element with class "side-panel-open"
    Then I want to see a text including "Identity permissions"
    When I select the entry "Identity Based 2" from the dropdown with the id "identity-contact-select"
      And I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "enabled"
    When I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "disabled"
    When I click on vue checkbox control with id "identity-write-perm"
    Then the button "Save" should be "enabled"
      And Checkbox with id "identity-read-perm" should be checked
    When I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "disabled"
      And Checkbox with id "identity-write-perm" should be not checked

  @only
  Scenario: Can provide permission to contact
    # invite
    Given I log in to evan.network using vue with identityBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
      And I click the element with class "side-panel-open"
      And I select the entry "Identity Based 2" from the dropdown with the id "identity-contact-select"
      And I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "enabled"
    When I click on button "Save"
    Then I want to see a text including "Starting Granting access to identity ..."
      And I wait for 3 seconds
      And I want to see a text including "Granting access to identity ... completed"
    When I wait for 1 seconds
    Then I want to see a cell with the content "Identity Based 2"
    # accept the invitation
    When I log out from vue
      And I log in to evan.network using vue with identityBased2
      And I click on "Notifications" in main menu
    Then I want I want to see a text including "Identity access"
      And I want I want to see a text including "a few seconds ago"
    When I click on an element with text including "a few seconds ago"
    Then I want to see a button "Save identity access"
    When I click on button "Save identity access"
      And I click on button "continue"
    Then I want to see a text including "Starting Contact/Contract sync"
      And I wait for 3 seconds
      And I want to see a text including "Contact/Contract sync completed"
    When I click on button "Switch identity"
    Then I want to see an element with class "callout.active"
      And I want to see an element with class "b-overlay.position-fixed"
    When I click the element with class "close-overlay"
      And I wait for 1 seconds
    Then I switch to identity "Identity Based 1"
    When I click on "Settings" in main menu
      And I click on "Identity Management" in sub menu
    Then I want to I want to see a text including "Identity Based 2"
    When I click on an element with text including "Identity Based 2"
    Then I do not want to see a text including "Remove Permissions"
      And Checkbox with id "identity-read-perm" should be checked
      And Checkbox with id "identity-write-perm" should be not checked
      And The element with id "identity-contact-select" should have attribute "disabled"
      And The element with id "identity-contact-note" should have attribute "disabled"
      And The element with id "identity-read-perm" should have attribute "disabled"
      And The element with id "identity-write-perm" should have attribute "disabled"
      And the button "Save" should be "disabled"
    # remove access
    Given I log in to evan.network using vue with identityBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
      And I click the element with class "side-panel-open"
    When I click on an element with text including "Identity Based 2"
    Then I want to see a button "Remove Permissions"
    When I click on button "Remove Permissions"
      And I click on button "Remove"
    Then I want to see a text including "Starting Removing permissions for identity ..."
      And I wait for 3 seconds
      And I want to see a text including "Removing permissions for identity ... completed"
      And I do not want to see a text including "Identity Based 2"
    # accept remove access
    When I log out from vue
      And I log in to evan.network using vue with identityBased2
      And I click on "Notifications" in main menu
    Then I want I want to see a text including "Identity access revoked"
      And I want I want to see a text including "a few seconds ago"
      And I want to see a button "Remove identity access"
    When I click on button "Remove identity access"
      And I click on button "continue"
    Then I want to see a text including "Starting Contact/Contract sync ..."
      And I wait for 3 seconds
      And I want to see a text including "Contact/Contract sync ... completed"
    When I click on button "Switch identity"
    Then I want to see an element with class "callout.active"
      And I want to see an element with class "b-overlay.position-fixed"
      And I not want to see an element with class "callout active" and text "Identity Based 1"
