@only
Feature: Digital Twin Detail

  @tag:noLogout
  Scenario:
    Given I log in to evan.network using vue
      And I click on "My Assets" in main menu
      And I click on "Digital Twins" in sub menu
      And I search in assets for "Full Example #3"
      And I click on an element with text including "Full Example #3"
      And I wait 20 seconds until loading was finished

  @tag:noLogout
  Scenario: open plugin list entries
    When I click on "pluginLists" in side navigation
    Then I want to see a text including "listCheckbox"
      And I want to see a text including "listFiles"
      And I want to see a text including "listNumber"
      And I want to see a text including "listObject"
      And I want to see a text including "listText"

  @tag:noLogout
  Scenario: check list of files
    When I click on an element with text including "2 files"
    Then I want to see a "h3" headline including "Detail"
      And I want to see a text including "Screen Shot 2020-01-31 at 13.26.30.png"
      And I want to see a text including "Screen Shot 2020-02-05 at 14.19.32.png"
      And I want to see a button "Close"
    When I click on button "Close"
    Then I do not want to see a text including "Detail"

  @tag:noLogout
  Scenario: check list of numbers
  When I click on an element with text including "678"
  Then I want to see a "h3" headline including "Detail"
    And I want to see a text including "678"
    And I want to see a button "Close"
  When I click on button "Close"
    Then I do not want to see a text including "Detail"

  @tag:noLogout
  Scenario: check list of complex objects
  Then I want to see a table having headers "arrayField, fieldCheckbox, fieldFiles, fieldNumber, fieldText, objectField"
  When I click on an element with text including "eins zwei drei"
  Then I want to see a "h3" headline including "Detail"
    And I want to see a text including `[{"asdasd":"asdadsad"},{"asdasds":"asdasdsa"}]`
    And I want to see a text including "arrayField"
    And I want to see a text including `[{"asdasd":"asdadsad"},{"asdasds":"asdasdsa"}]`
    And I want to see a text including "fieldCheckbox"
    And I want to see a text including "fieldFiles"
    And I want to see a text including "Screen Shot 2020-01-31 at 13.26.30.png"
    And I want to see a text including "fieldNumber"
    And I want to see a text including "123"
    And I want to see a text including "fieldText"
    And I want to see a text including "eins zwei drei"
    And I want to see a text including "objectField"
    And I want to see a text including `{"foo":"test"}`
    And I want to see a button "Close"
  When I click on button "Close"
    Then I do not want to see a text including "Detail"

