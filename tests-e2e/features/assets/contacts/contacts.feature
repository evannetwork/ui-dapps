@only
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
