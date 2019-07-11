Feature: Organizations - Notary Identification

Scenario: Requesting Notary Identification for current user
  Given I log in to evan.network using vue with organizationIdentification
    And I switch to vue
  When I want to open the organizations dapp and open the organization card for "My Account"
    Then I want to see the organization identification detail for "My Account"
  When I click on the organization identification request start button
    Then I want to see the organization identification request formular
  When I fill test data into the request identification modal
    Then the organization identification submit button should be enabled

