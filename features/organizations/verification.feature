@CORE-238
Feature: Organizations - Notary Verification

 Scenario: Requesting Notary Verification for current user
  Given I log in to evan.network using vue with organizationIdentification
    And I switch to vue
  Given I am on the path "#/dashboard.vue.evan/profile.vue.evan/detail"
  When I click on tab "Organizations"
    Then I want to see a link to "My Account"
  When I click on link to "My Account"
    Then I want to see a button "Request Notary Verification"

  # Oben the notary verification modal
  When I click on button "Request Notary Verification"
    Then I want to see a modal with the title "Notary Verification"
    And I want to see a button "Request notary verification"
  # and go to next step and fill the form
  When I click on button "Request notary verification"
    Then 8 input fields should be visible
    And 2 select fields should be visible
    And step 1 should be "active"
    And step 2 should be "disabled"
    And step 3 should be "disabled"
    And Input fields with labels "Organization *|Register Court *|Registration number *|Contact *|Department of the company" should be visible
    And I want to see a button "Go back"
  When I fill test data into the request verification modal
    Then the button "Next" should be "enabled"

  # Go to summary page
  When I click on button "Next"
    Then step 2 should be "active"
    And 0 input fields should be visible
    And I want to see a button "Next"

# TODO: more complex test
  # Test go back an forth via steps component, check for deactivated step when form is invalid
  # When I click on button "Go back"
  #   Then 8 input fields should be visible
  #   And step 3 should be "enabled"
  # When I set Input field with label "Registration number *" to "DE"
  #   Then step 3 should be "disabled"
  # When I set Input field with label "Registration number *" to "123456"
  #   Then step 3 should be "enabled"
  # When I click on step 3
  #   Then step 3 should be "active"

    # Go to summary page
  When I click on button "Next"
    Then step 3 should be "active"
    # AND I want to see a checkbox
    And I want to see a button "Request"
    # click on checkbox
    # button Request enabled

  When I click on close button of modal
    Then no modal should be visible

