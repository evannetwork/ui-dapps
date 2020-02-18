Feature: evan.network sharing

  Scenario: Share via sharings section on profile page
    Given I log in to evan.network using vue
    Then I want to see a text including "My Assets"

    When I click on "Identity" in main menu
    Then I want to see a text including "Identity"
      And I want to see a text including "Wallet"
      And I want to see a text including "Verifications"
    When I click on "Sharings" in sub menu
    Then I want to see a text including "Select contact to share with"
      And I want to see a text including "Your Identity Data Sharings"
    When I click on the Vue Select with label "Select contact to share with"
      And I press the "DOWN_ARROW" key
      And I press the "ENTER" key
    Then I want to see a text including "Identity Data"
    But the button "Share data" should be "disabled"
    When I click on a custom checkbox at position "3"
    Then the button "Share data" should be "enabled"
    When I click on button "Share data"

  Scenario: Share via share button on profile page
    Given I log in to evan.network using vue
    Then I want to see a text including "My Assets"

    When I click on "Identity" in main menu
      Then I want to see a text including "Identity"
      And I want to see a text including "Wallet"
      And I want to see a text including "Verifications"
    When I click on button "Share"
      And I wait for 1 seconds
      Then I want to see a text including "Update Identity Permissions"
    When I click on the Vue Select with label "Select contact to share with"
      And I press the "DOWN_ARROW" key
      And I press the "ENTER" key
    Then I want to see a text including "Identity Data"
    But the button "Share data" should be "disabled"
    When I click on a custom checkbox at position "3"
    Then the button "Share data" should be "enabled"
    When I click on button "Share data"
    Then the button "Share data" should be "disabled"
