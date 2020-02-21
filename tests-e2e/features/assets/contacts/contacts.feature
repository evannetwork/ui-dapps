
Feature: Contacts assets
  Background:
    Given I log in to evan.network using vue
      And I click on "My Assets" in main menu

  Scenario: Check whether the content of Contacts is displayed
    When I click on "Contacts" in sub menu
    Then I want to see a "span" headline including "Contacts"
      And I want to see a table having 5 headers
      And I want to see a table having headers "Name, Note, Added"

  Scenario: Check whether the modal for New Contact Invitation is displayed
    Given I am on the path "#/dashboard.vue.evan/assets.evan/contacts"
    Then I want to see a "plus" icon button
    When I click on the "plus" icon button
    Then I want to see a swipe-panel with the title "Add new Contact"

  Scenario: Check filtering for a user
    Given I am on the path "#/dashboard.vue.evan/assets.evan/contacts"
    Then I want to see a table having "at least" 4 rows
    And I want to see a text including "Wallet1"
    And I want to see a text including "Wallet1"

    When I click on the "magnify" icon
    And I set Input field with id "contactSearchbox" to "gibberishstringtwinwontfindanything"
    And I wait for 2 seconds
    Then I want to see a table having "exactly" 1 rows
    And I want to see a text including "No results for this filter."

    When I set Input field with id "contactSearchbox" to "Wallet1"
    And I wait for 2 seconds
    Then I want to see a table having "exactly" 1 rows
    And I want to see a text including "Wallet1"
    But I do not want to see a text including "Wallet2"
