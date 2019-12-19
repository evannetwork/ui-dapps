Feature: Contacts assets

Scenario: Check whether the content of Contacts is displayed
  Given I log in to evan.network using vue
    And I go to My Assets tab
    And I go to Contacts tab
    And I wait for 2 seconds
    Then I want to see a table of "contacts"

Scenario: Check whether the modal for New Contact Invitation is displayed
  Given I log in to evan.network using vue
    And I go to Contacts tab
    Then I want to see a plus button
    When I click on plus button
    Then I want to see a swipe-panel with the title "Add new Contact"
    