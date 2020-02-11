Feature: Digital Twin - Detail

  Background:
    Given I log in to evan.network using vue
      And I click on "My Assets" in main menu
      And I click on "Digital Twins" in sub menu
      And I search in assets for "Test Car Twin"
      And I click on an element with text including "Test Car Twin"
      And I wait for 3 seconds
      And I wait 20 seconds until loading was finished

  Scenario: Open Digital Twin
    Then I want to see an element with class "twin-name"
      And I want to see an element with class "twin-owner"
      And I want to see an element with class "twin-desc"
      And I want to see a text including "Test Car Twin"
      And I want to see a text including "Test Account"
      And I want to see a text including "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."

  Scenario: Edit DBCP
    When I click on link to "/data"
      And I click on link to "/data/general"
    Then I want to see a text including "Information"
    # change data and save description
    When I set Input field with label "Name" to "Test Car Twin 2"
      And I set Input field with label "Description" to "Nice Description"
      And I click on button "Save"
    Then I want to see a text including "Starting Saving description ..."
      And I want to see a text including "Saving description ... completed"
      And I want to see a text including "Test Car Twin 2"
      And I want to see a text including "Nice Description"
    # ensure, that the write process was successfull
    When I refresh the page
      And I type "process.env.USER_DEFAULT_PASSWORD" into the input field with label "Password"
      And I click on button "Log in"
      And I wait for 3 seconds
    Then I want to see a text including "Test Car Twin 2"
      And I want to see a text including "Nice Description"
    # reset to previous description
    When I set Input field with label "Name" to "Test Car Twin"
      And I set Input field with label "Description" to "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
      And I click on button "Save"
    Then I want to see a text including "Starting Saving description ..."
      And I want to see a text including "Saving description ... completed"

  Scenario: Mark as favorite
    # mark as favorite
    When I click on the "star-outline" icon
    Then I want to see an element with class "evan-loading.icon-replacer"
      And I want to see a text including "Starting Adding favorite ..."
      And I want to see a text including "Adding favorite ... completed"
      And I want to see the "star" icon
    # remove from favorites
    When I click on the "star" icon
    Then I want to see an element with class "evan-loading.icon-replacer"
      And I want to see a text including "Starting Removing favorite ..."
      And I want to see a text including "Removing favorite ... completed"
      And I want to see the "star-outline" icon

  Scenario: Export as template
    When I click on the "dots-vertical" icon button
    Then I want to see a text including "Export as template"
    When I click on an element with text including "Export as template"
      And I wait for 3 seconds
    Then I want to see a text including "Creating template ..."
      And I want to see an element with class "evan-success"
      And the button "Download" should be "enabled"

  Scenario: Create Twin duplicate
    When I click on the "dots-vertical" icon button
    Then I want to see a text including "Duplicate"
    When I click on an element with text including "Duplicate"
      And I wait for 3 seconds
    Then the button "Duplicate" should be "enabled"
    When I click on button "Duplicate"
    Then I want to see a text including "Starting Create Twin"
    When I wait 60 seconds until loading was finished
    Then I want to see a text including "Create Twin completed"
