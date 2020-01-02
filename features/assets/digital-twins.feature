Feature: Digital Twin assets

  Background:
    Given I log in to evan.network using vue
      And I click on "My Assets" in main menu

  Scenario: Check whether the content of Digital Twins is displayed
    When I click on "Digital Twins" in sub menu
    Then Input field with label "Digital Twins" should be invisible
      And I want to see a table having 6 headers
      And I want to see a table having headers "Name, Owner, Updated, Created"
      And I want to see a table having "at least" 5 rows
      And I want to see a table having "maximum" 25 rows
    When I wait for 1 seconds
      And I scroll to last table row
      And I wait for 3 seconds
    Then I want to see a table having "at least" 25 rows
    And I wait for 3 seconds
    And I want to see a table having "at least" 30 rows

