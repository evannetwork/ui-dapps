Feature: Organizations - Notary Identification

@tag:only
Scenario: Requesting Notary Identification for current user
  Given I log in to evan.network with organizationIdentification
    And I switch to vue
  When I want to open the organizations dapp and open the organization card for "My Account"
    Then I want to see the organization identification detail for "My Account"
  When I click on the organization identification request start button
    Then I want to see the organization identification request formular
  When the continue button was clicked
    Then I want to see the company information preview
  When I click the request button
    Then I want to see a loading symbol
    And when this was done, the success modal should be shown
