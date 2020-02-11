Feature: Digital Twin - Container + Datat Sets

  @tag:noLogout
  Scenario: Load full example twin
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
      And I want to see a text including "Full Example #3"
    When I click on an element with text including "Full Example #3"
      And I wait 30 seconds until loading was finished

  @tag:noLogout
  Scenario: all containers are listed
    Then I want to see a text including "Full Example #3"
      And I want to see a text including "General"
      And I want to see a text including "pluginEntries"
      And I want to see a text including "pluginEntriesValidation"
      And I want to see a text including "pluginLists"
      And I want to see a text including "pluginListsValidation"

  @tag:noLogout
  @only
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
    When I click on button "Cancel"

  @tag:noLogout
  Scenario: change checkbox entry
    When I click on vue checkbox control with id "dataset-input-checkboxEntry-primitive"
    # TODO: value depends on previous state, need to check for changed.
    Then The value of the Input field with id "dataset-input-checkboxEntry-primitive" should be "true"
    When I click on button "Cancel"

  @tag:noLogout
  Scenario: change text entry
    When I set Input field with id "dataset-input-textEntry-primitive" to "lorem ipsum dolor sit amet consecutor"
    Then The value of the Input field with id "dataset-input-textEntry-primitive" should be "lorem ipsum dolor sit amet consecutor"
    When I click on button "Cancel"

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
    Then I want to see a text including "Invalid JSON format."
    # And the button "Save" should be "disabled" #TODO
    When I set Input field with label "objectField" to `{"new":"entry"}`
    Then I do not want to see a text including "Invalid JSON format."
      And The value of the Input field with label "objectField" should be `{"new":"entry"}`
    # Save button is enabled and twin is saved
    When I click on button "Save"
      And I wait 30 seconds until loading was finished
    Then I want to see a text including "Saving data ... completed"
      And The value of the Input field with label "numberField" should be "42"
      And The value of the Input field with label "textField" should be "gibberish"
      And The value of the Input field with label "objectField" should be `{"new":"entry"}`
      And The value of the Input field with id "dataset-input-checkboxEntry-primitive" should be "true"

  @tag:noLogout
  Scenario: check formular validation
    When I click on "pluginEntriesValidation" in side navigation
      And I wait 30 seconds until loading was finished
    When I click on input field with label "numberField"
    Then the button "Save" should be "disabled"
    # number
    When I set Input field with label "numberField" to "12345"
    Then I want to see a text including "should be <= 123"
    When I set Input field with label "numberField" to "0"
    Then I want to see a text including "should be >= 1"
    And I set Input field with label "numberField" to "123"
    # text
    When I set Input field with label "textField" to "gibberish gibberish gibberish"
    Then I want to see a text including "should not be longer than 20 characters"
    When I set Input field with label "textField" to ""
    Then I want to see a text including "should not be shorter than 1 character"
      And I set Input field with label "textField" to "gibberish"
    # object
    When I set Input field with label "objectField" to "gluposti"
    Then I want to see a text including "Invalid JSON format."
    When I set Input field with label "objectField" to `{}`
    Then I want to see a text including "should have required property bar"
    When I set Input field with label "objectField" to `{"bar": "123"}`
    Then I want to see a text including "should be number"
    When I set Input field with label "objectField" to `{"bar": 123, "minMax": ""}`
    Then I want to see a text including "should not be shorter than 1 character"
    When I set Input field with label "objectField" to `{"bar": 123, "minMax": "12345678901"}`
    Then I want to see a text including "should not be longer than 10 characters"
      And I set Input field with label "objectField" to `{"bar": 123, "minMax": "123"}`
    # array
    When I set Input field with label "arrayField" to "gluposti"
    Then I want to see a text including "Invalid JSON format."
    When I set Input field with label "arrayField" to `[]`
    Then I want to see a text including "should not have less than 1 item"
    When I set Input field with label "arrayField" to `[""]`
    Then I want to see a text including "should be object"
    When I set Input field with label "arrayField" to `[{},{},{},{},{},{},{}]`
    Then I want to see a text including "should not have more than 5 items"
    And I set Input field with label "arrayField" to `[{}]`
    # files
    Then I want to see a text including "should not have less than 1 item"
    When I upload file "bicycle.json" to the dropzone with the id "dataset-input-objectEntry-filesField"
      And I wait for 1 seconds
    When I click on button "Save"
      And I wait 30 seconds until loading was finished

  @tag:noLogout
  @only
  Scenario: list all list plugin entries
    When I click on "pluginListsValidation" in side navigation
      And I want to see a text including "listObject"
    When I click the element with id "dataset-list-listObject-dropdown"
    Then I want to see a text including "Show all"
      And I want to see a text including "Add an Entry"
    When I click the element with id "dataset-list-listObject-add"
      And I wait for 1 seconds
    When I set Input field with label "fieldNumber" to "123"
      And I set Input field with label "fieldText" to "gibberish"
      And I set Input field with label "objectField" to `{"bar": 123, "minMax": "123"}`
      And I set Input field with label "arrayField" to `[{}]`
      And I upload file "bicycle.json" to the dropzone with the id "dataset-input-listObject-fieldFiles"
      And I wait for 1 seconds
    Then the button "Add Entry" should be "enabled"
    When I click on button "Add Entry"
      And I wait 30 seconds until loading was finished
    Then I want to see a text including "Saving data ... completed"


  Scenario: localization test with english
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
      And I want to see a text including "Bike i18n test"
    When I click on an element with text including "Bike i18n test"
      And I wait 15 seconds until loading was finished
    Then I want to see a text including "Dieser Zwilling stellt ein Fahrrad in der realen Welt dar. Er enthält technische Spezifikationen, Informationen über den Eigentümer und ein Wartungsprotokoll."
      And I want to see a text including "General"
      And I want to see a text including "Specifications"
      And I want to see a text including "Maintenance"
    When I click on "Specifications" in side navigation
    Then I want to see a text including "Characteristics"
      And I want to see a text including "Type"
      And I want to see a text including "Color"
      And I want to see a text including "Wheel size"
      And I want to see a text including "Category"
      And I want to see a text including "Manufacturer"
      And I want to see a text including "Name"
      And I want to see a text including "City"
      And I want to see a text including "Country"
      And I want to see a text including "Post-Code"
      And I want to see a text including "Street & Number"

  @german
  Scenario: localization test with german
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digitale Zwillinge"
      And I want to see a text including "Bike i18n test"
    When I click on an element with text including "Bike i18n test"
      And I wait 15 seconds until loading was finished
    Then I want to see a text including "Dieser Zwilling stellt ein Fahrrad in der realen Welt dar. Er enthält technische Spezifikationen, Informationen über den Eigentümer und ein Wartungsprotokoll."
      And I want to see a text including "Allgemein"
      And I want to see a text including "Spezifikationen"
      And I want to see a text including "Wartung"
    When I click on "Spezifikationen" in side navigation
    Then I want to see a text including "Eigenschaften"
      And I want to see a text including "Typ"
      And I want to see a text including "Farbe"
      And I want to see a text including "Reifengröße"
      And I want to see a text including "Kategorie"
      And I want to see a text including "Hersteller"
      And I want to see a text including "Name"
      And I want to see a text including "Stadt"
      And I want to see a text including "Land"
      And I want to see a text including "Postleitzahl"
      And I want to see a text including "Straße & Nummer"

# TODO:
# Scenario: Lists are shown as table (with potential horizontal scrolling)
# Scenario: New entries to the table can be “clicked” at the top of the table
# Scenario: Paging is solved via infinite scrolling
# Scenario: share functionality for every entry (will open the share data sidebar)
# Scenario: quick navigation to entries on the right side (not on mobile or smaller screens)
# Scenario: change files entry
# Scenario: change list checkbox entry
