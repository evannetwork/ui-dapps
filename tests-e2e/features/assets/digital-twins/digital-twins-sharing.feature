Feature: Digital Twin - Sharing

  Background:
    Given I log in to evan.network using vue
    Then I want to see a text including "My Assets"

    When I click on "My Assets" in main menu
      Then I want to see a text including "My Assets"
    When I search in assets for "Test Car Share Twin"
    And I click on an element with text including "Test Car Share Twin"
    And I wait 20 seconds until loading was finished
      Then I want to see a text including "Test Car Share Twin"

  Scenario: Share a DT via My Assets
    When I click on an element with text including "Maintenance"
      Then I want to see a text including "maintenance"
      And the button "Share" should be "enabled"
    When I click on button "Share"
    And I wait for 1 seconds
      Then I want to see a text including "Share your Digital Twin"
    When I click on the Vue Select with label "Select contact to share with"
    And I press the "DOWN_ARROW" key
    And I press the "DOWN_ARROW" key
    And I press the "ENTER" key
      Then I want to see a text including "characteristics"
      And I want to see a text including "owner"
      But the button "Update Sharing Options" should be "disabled"
    When I click on a custom checkbox at position "3"
      Then the button "Update Sharing Options" should be "enabled"
    When I click on button "Update Sharing Options"
      And I wait 60 seconds until loading was finished
    Then I want to see a text including "Sharing data ... completed"
      And I click on button "Cancel"
    # check if sharing works
    When I click on button "Share"
    And I wait for 1 seconds
      Then I want to see a text including "Share your Digital Twin"
    When I click on the Vue Select with label "Select contact to share with"
      And I press the "DOWN_ARROW" key
      And I press the "DOWN_ARROW" key
      And I press the "ENTER" key
    Then The value of the Input field with id "0x70456b04d97ABC2B831EcE124379E4e8847ad6BC-characteristics-read" should be "true"
    When I click on a custom checkbox at position "3"
      Then the button "Update Sharing Options" should be "enabled"
    When I click on button "Update Sharing Options"
      And I wait 60 seconds until loading was finished
    Then I want to see a text including "Sharing data ... completed"
      And I click on button "Cancel"
    # check if unsharing works
    When I click on button "Share"
    And I wait for 1 seconds
      Then I want to see a text including "Share your Digital Twin"
    When I click on the Vue Select with label "Select contact to share with"
      And I press the "DOWN_ARROW" key
      And I press the "DOWN_ARROW" key
      And I press the "ENTER" key
    Then The value of the Input field with id "0x70456b04d97ABC2B831EcE124379E4e8847ad6BC-characteristics-read" should be "true"


  Scenario: Sharing Overview should display shared users
    When I click on an element with text including "Sharings"
    Then I want to see a text including "Unknown"
      And I want to see a text including "Users"
      And I want to see a text including "Companies"
      And I want to see a text including "All"
      And I want to see a text including "Wallet1"
      And I want to see a text including "Wallet2"
    # type filtering
    When I click on an element with text including "Unknown"
    Then I want to see a text including "Wallet1"
      And I do not want to see a text including "Wallet2"
    When I click on an element with text including "Companies"
    Then I want to see a text including "Wallet2"
      And I do not want to see a text including "Wallet1"
    When I click on an element with text including "All"
    Then I want to see a text including "Wallet1"
      And I want to see a text including "Wallet2"
    # text filtering
    When I set Input field with id "searchInput" to "Wallet1"
    Then I want to see a text including "Wallet1"
      And I do not want to see a text including "Wallet2"
    When I set Input field with id "searchInput" to "Wallet2"
    Then I want to see a text including "Wallet2"
      And I do not want to see a text including "Wallet1"
    When I set Input field with id "searchInput" to "stufffffff"
      Then I do not want to see a text including "This digital twin was not shared with any user with this filter"
      And I set Input field with id "searchInput" to ""

    # open empty sidebar
    When I click on button with id "share-twin-btn"
      And I wait 10 seconds until loading was finished
    Then I want to see a text including "Select contact to share with"
      And The value of the Input field with id "shareContactSelect" should be ""
    When I click on the Vue Select with label "Select contact to share with"
    And I press the "DOWN_ARROW" key
    And I press the "ENTER" key
      Then I want to see a text including "characteristics"
      And I want to see a text including "owner"
      And I click on button "Cancel"
    # open sidebar with user
    When I click on an element with text including "Wallet1"
      And I wait 10 seconds until loading was finished
    Then I want to see a text including "Select contact to share with"
      And I want to see a text including "maintenance"
      And I want to see a text including "specifications"
      And The value of the Input field with id "0x37d4423A85390C2A289b310c34B463C5EacA6423-read-all" should be "true"
      And The value of the Input field with id "0x70456b04d97ABC2B831EcE124379E4e8847ad6BC-read-all" should be "false"
      And I click on button "Cancel"

