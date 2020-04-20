Feature: evan.network dashboard

  Scenario: Management UI should be disabled for old profiles
    Given I log in to evan.network using vue with accountBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
    Then I want to see a text including "You are currently logged in with an old, non-identity-based profile. User management for identities is only supported for current profiles."
  @only
  Scenario: Can provide read permission to contact
    Given I log in to evan.network using vue with identityBased
      And I click on "Settings" in main menu
    When I click on "Identity Management" in sub menu
    Then I want to see a text including "In the following table, you can add or remove contacts that have access to the current identity. For example, they are authorized to access all data, edit information, share data, or perform transactions."
      And I want to see a text including "No contacts are yet authorized to interact via your identity."
    When I click the element with class "side-panel-open"
    Then I want to see a text including "Identity permissions"
    When I select the entry "Identity Based 2" from the dropdown with the label "Contact"
      And I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "enabled"
    When I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "disabled"
    When I click on vue checkbox control with id "identity-write-perm"
    Then the button "Save" should be "enabled"
      And The value of the Input field with id "identity-read-perm" should be "true"
    When I click on vue checkbox control with id "identity-read-perm"
    Then the button "Save" should be "disabled"
      And The value of the Input field with id "identity-write-perm" should be "false"

  Scenario: Can provide read+write permission to contact

  Scenario: Can remove write permission for contact

  Scenario: Can remove read permission for contact
