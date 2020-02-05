Feature: Display Digital Twin Details

  @tag:noLogout
  Scenario: Load full example twin
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
      And I want to see a text including "Full Example #2"
    When I click on an element with text including "Full Example #2"
      And I wait 15 seconds until loading was finished

  @tag:noLogout
  Scenario: all containers are listed
    Then I want to see a text including "Full Example #2"
      And I want to see a text including "General"
      And I want to see a text including "pluginLists"
      And I want to see a text including "pluginEntries"

  @tag:noLogout
  Scenario: list all pluginentries
    When I click on "pluginEntries" in side navigation
    Then I want to see a text including "checkboxEntry"
      And I want to see a text including "filesEntry"
      And I want to see a text including "numberEntry"
      And I want to see a text including "objectEntry"
      And I want to see a text including "textEntry"

  @tag:noLogout
  Scenario: change number entry
    When I set Input field with id "dataset-input-numberEntry-primitive" to "ABC"
    Then The value of the Input field with id "dataset-input-numberEntry-primitive" should be ""
    When I set Input field with id "dataset-input-numberEntry-primitive" to "42"
    Then The value of the Input field with id "dataset-input-numberEntry-primitive" should be "42"

  @tag:noLogout
  Scenario: change checkbox entry
    When I click on vue checkbox control with id "dataset-input-checkboxEntry-primitive"
    # TODO: value depends on previous state, need to check for changed.
    Then The value of the Input field with id "dataset-input-checkboxEntry-primitive" should be "true"

  @tag:noLogout
  Scenario: change text entry
    When I set Input field with id "dataset-input-textEntry-primitive" to "lorem ipsum dolor sit amet consecutor"
    Then The value of the Input field with id "dataset-input-textEntry-primitive" should be "lorem ipsum dolor sit amet consecutor"

  @tag:noLogout
  Scenario: change object entries
    # number
    When I click on input field with label "numberField"
      And I set Input field with label "numberField" to "ABC"
    Then The value of the Input field with label "numberField" should be ""
    When I set Input field with label "numberField" to "42"
    Then The value of the Input field with label "numberField" should be "42"
    # text
    When I set Input field with label "textField" to "gibberish"
    Then The value of the Input field with label "textField" should be "gibberish"
    # object
    When I set Input field with label "objectField" to "gluposti"
    Then I want to see a button "Save"
      And I want to see a button "Cancel"
      And I want to see a text including "Invalid JSON format."
    # And the button "Save" should be "disabled"
    When I set Input field with label "objectField" to `{"new": "entry"}`
    Then I do not want to see a text including "Invalid JSON format."
      And The value of the Input field with label "objectField" should be `{"new": "entry"}`

    When I click on button "Save"
      And I wait 30 seconds until loading was finished
    Then I want to see a text including "Saving data ... completed"
      And The value of the Input field with label "numberField" should be "42"
      And The value of the Input field with label "textField" should be "gibberish"
      And The value of the Input field with label "objectField" should be `{"new": "entry"}`
      And The value of the Input field with id "dataset-input-checkboxEntry-primitive" should be "true"

  @german
  Scenario: with german
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digitale Zwillinge"
      And I want to see a text including "Full Example #2"
    When I click on an element with text including "Full Example #2"
      And I wait 15 seconds until loading was finished
    Then I want to see a text including "Example of a template for a digital twin."
      And I want to see a text including "Allgemein"
      And I want to see a text including "pluginLists"
      And I want to see a text including "pluginEntries"

# TODO:
# Scenario: Lists are shown as table (with potential horizontal scrolling)
# Scenario: New entries to the table can be “clicked” at the top of the table
# Scenario: Paging is solved via infinite scrolling
# Scenario: share functionality for every entry (will open the share data sidebar)
# Scenario: quick navigation to entries on the right side (not on mobile or smaller screens)
# Scenario: change files entry
# Scenario: change list checkbox  entry
