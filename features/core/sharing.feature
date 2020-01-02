Feature: evan.network sharing

  Scenario: Log into test account and navigate to the profile detail page
    # Log in
    Given I log in to evan.network using vue
    Then I want to see a text including "What would you like to start with?"

    When I click on "Identity" in main menu
    Then I want to see a text including "Profile"
      And I want to see a text including "Wallet"
      And I want to see a text including "Verifications"
      And I want to see a text including "Contacts"
    When I click on button "Share"
    Then I want to see a text including "Select contact to share with"
    When I click on the Vue Select with label "Select contact to share with"
      And I press the "DOWN_ARROW" key
      And I press the "ENTER" key
    Then I want to see a text including "Profile Data"
    But the button "Update Sharing Options" should be "disabled"
    When I click on a custom checkbox at position "3"
    Then the button "Update Sharing Options" should be "enabled"
    When I click on button "Update Sharing Options"
    Then the button "Update Sharing Options" should be "disabled"
