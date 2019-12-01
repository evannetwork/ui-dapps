@CORE-238
Feature: Organizations - Notary Verification

Scenario: Requesting Notary Verification with non company user
  Given I log in to evan.network using vue with organizationIdentificationNonCompany
  When I click on "Identity" in main menu
    And I click the element with id "nav-entry-verifications"
    Then I want to see a text including "There are currently no verifications available for your profile type."

Scenario: Requesting Notary Verification for current user
  Given I log in to evan.network using vue with organizationIdentification
    When I click on "Identity" in main menu
    And I click the element with id "nav-entry-verifications"
    Then I want to see a text including "Request a notary verification"

  # Oben the notary verification modal
  When I click on button "Request"
    Then I want to see a modal with the title "Notary Verification"
    And I want to see a button "Start request"
  # and go to next step and fill the form
  When I click on button "Start request"
    Then 2 input fields should be visible
    And step 1 should be "active"
    And step 2 should be "disabled"
    And step 3 should be "disabled"
    And Input fields with labels "Contact Person *|Department" should be visible
    And I want to see a button "Go back"
  When I set Input field with label "Contact Person *" to "Evan Test Contact"
    And I set Input field with label "Department" to "Evan Test Department"
    Then the button "Next" should be "enabled"
    And step 2 should be "enabled"
    And step 3 should be "enabled"

  # Go to summary page
  When I click on button "Next"
    Then step 2 should be "active"
    And 0 input fields should be visible
    And I want to see a button "Next"

    # Go to summary page
  When I click on button "Next"
    Then step 3 should be "active"
    And 1 input fields of type "checkbox" should be visible
    And I want to see a button "Request"
  # When I wait for 5 seconds
  #   And I click the element with id "approvedCosts"
  #   And I click the element with id "approvedCosts"
  #   And I click the element with id "approvedCosts"
  #   Then the button "Request" should be "enabled"

  # When I click on close button of modal
  #   Then no modal should be visible

Scenario: Requesting Notary Verification for current user with missing info
  Given I log in to evan.network using vue with organizationIdentification
  When I click on "Identity" in main menu
    When I set Input field with label "Company" to "Test Company"
    And I set Input field with label "Register Court" to ""
    And I set Input field with label "Registration Number" to ""
    And I set Input field with label "Sales Tax ID" to ""
  When I click on button "Save"
    Then the button "Save" should be "disabled"
    And I want to see a element with class "spinner-border"
    And I wait for 5 seconds
  When I click the element with id "nav-entry-verifications"
    Then I want to see a text including "Request a notary verification"
  When I click on button "Request"
    Then I want to see a modal with the title "Notary Verification"
    And I want to see a button "Start request"
  When I click on button "Start request"
    Then I want to see a text including "Registration"
      And Input field with label "Company" should be visible
      And Input field with label "Register Court" should be visible
      And Input field with label "Register" should be visible
      And Input field with label "Registration Number" should be visible
      And Input field with label "Sales Tax ID" should be visible
      And The value of the Input field with label "Register Court" should be ""
      And The value of the Input field with label "Registration Number" should be ""
      And The value of the Input field with label "Sales Tax ID" should be ""
  When I set Input field with label "Company" to "Test Company"
    And I set Input field with label "Register Court" to "Test Register Court"
    And I set Input field with label "Registration Number" to "Test Registration Number"
    And I set Input field with label "Sales Tax ID" to "Test Sales Tax ID"
    And I click on button "Save"
    Then the button "Save" should be "disabled"
    And I want to see a element with class "spinner-border"
    And I wait for 5 seconds
    And Input fields with labels "Contact Person *|Department" should be visible
  When I click on button "Cancel"
    And I click on "Identity" in main menu
    And The value of the Input field with label "Register Court" should be "Test Register Court"
    And The value of the Input field with label "Registration Number" should be "Test Registration Number"
    And The value of the Input field with label "Sales Tax ID" should be "Test Sales Tax ID"
