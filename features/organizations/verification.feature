@CORE-238 @only
Feature: Organizations - Notary Verification

Scenario: Requesting Notary Verification for current user
  Given I log in to evan.network using vue with organizationIdentification
    And I switch to vue
  When I click on "Organizations" in main menu
    Then I want to see a link to "My Account"
  When I click on link to "My Account"
    Then I want to see a button "Request Notary Verification"

  # Oben the notary verification modal and go to next step and fill the form
  When I click on button "Request Notary Verification"
    Then I want to see a modal with the title "Notary Verification"
    And I want to see a button "Next"
  When I click on button "Next"
    Then 8 input fields should be visible
    And 2 select fields should be visible
    And step 2 should be "active"
    And step 3 should be "disabled"
    And Input fields with labels "Organization *|Register Court *|Registration number *|Contact *|Department of the company" should be visible
    And I want to see a button "Go back"
  When I fill test data into the request verification modal
    Then the button "Next" should be "enabled"

  # Go to summary page
  When I click on button "Next"
    Then step 3 should be "active"
    And 0 input fields should be visible
    And I want to see a button "Request"

  # Test go back an forth via steps component, check for deactivated step when form is invalid
  When I click on button "Go back"
    Then 8 input fields should be visible
    And step 3 should be "enabled"
  When I set Input field with label "Registration number *" to "DE"
    Then step 3 should be "disabled"
  When I set Input field with label "Registration number *" to "123456"
    Then step 3 should be "enabled"
  When I click on step 3
    Then step 3 should be "active"

  # TODO: fire request, against mocked http

  When I click on close button of modal
    Then no modal should be visible

#  When I want to open the organizations dapp and open the organization card for "My Account"
#      Then I want to see the organization verification detail for "My Account"
###  When I click on button "Request Notary Verification"
#  When I click on the organization verification request start button
###    Then I want to see a modal with the title "Notary Verification"
#  When I fill test data into the request verification modal
#    Then the organization verification submit button should be enabled

