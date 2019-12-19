Feature: Digital Twin assets

Scenario: Check whether the content of Digital Twins is displayed
  Given I log in to evan.network using vue
    And I go to My Assets tab
    And I wait for 3 seconds
    Then I want to see a table of "digital-twins"
  