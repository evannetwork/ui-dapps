Feature: evan.network onboarding

Scenario: Registering a new account on evan Happy Path

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I click the element with id "termsAccepted"
    And I click the element with id "evan-recaptcha"
    And I wait for 3 seconds
    Then the button "Create Account" should be "enabled"
  When I click on button "Create Account"
    Then I want to see a text including "Creating identity contract..."
    And I want to see a text including "Encrypting user information..."
    And I want to see a text including "Creating mailbox, address book, ..."
    And I want to see a element with class "checkmark"
    And I want to see a text including "Recovery Key"
  When I click on button "View Profile"
    Then I want to see a text including "What would you like to start with?"

Scenario: Registering a new account not set account name

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
  Then I want to see a text including "Please enter a user name!"
    And the button "Continue" should be "disabled"

Scenario: Registering a new account and test password checks

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test"
  Then I want to see a text including "Your password must be at least 8 characters long!"
    And the button "Continue" should be "disabled"
  Then I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1235"
  Then I want to see a text including "Your password must match the previous one!"
    And the button "Continue" should be "disabled"

Scenario: Registering a new account on evan and not check terms

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  And I set Input field with label "Account name" to "Automated Test Account"
  And I set Input field with label "Password" to "Test1234"
  And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  Then I click on button "Continue"
  Then I click the element with id "evan-recaptcha"
  Then the button "Create Account" should be "disabled"

Scenario: Registering a new account on evan and not check recaptcha

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  And I set Input field with label "Account name" to "Automated Test Account"
  And I set Input field with label "Password" to "Test1234"
  And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  Then I click on button "Continue"
  Then I click the element with id "termsAccepted"
  Then the button "Create Account" should be "disabled"

Scenario: Registering a new company account on evan

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Account type" to "company"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
    Then I want to see a element with class "evan-step-0"
    Then I want to see a element with class "evan-step-1"
    Then I want to see a element with class "evan-step-2"
    Then I want to see a element with class "evan-step-3"
    And the button "Continue" should be "enabled"
  When I click on button "Continue"
    Then Input field with label "Company" should be visible
    And Input field with label "Register Court" should be visible
    And Input field with label "Register" should be visible
    And Input field with label "Registration Number" should be visible
    And Input field with label "Sales Tax ID" should be visible
  When I set Input field with label "Company" to "Test Company"
    And I set Input field with label "Register Court" to "Test Register Court"
    And I set Input field with label "Register" to "DE"
    And I set Input field with label "Registration Number" to "Test Registration Number"
    And I set Input field with label "Sales Tax ID" to "Test Sales Tax ID"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    Then Input field with label "Street and Number" should be visible
    And Input field with label "Postal Code" should be visible
    And Input field with label "City" should be visible
    And Input field with label "Website" should be visible
  When I set Input field with label "Street and Number" to "Test Street 16"
    And I set Input field with label "Postal Code" to "99817"
    And I set Input field with label "City" to "Test City"
    And I set Input field with label "Website" to "https://evan.network"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I click the element with id "termsAccepted"
    And I click the element with id "evan-recaptcha"
    And I wait for 3 seconds
    Then the button "Create Account" should be "enabled"
  # TODO: Add account creation and check if data is passed correctly
  # When I click on button "Create Account"
  #   Then I want to see a text including "Creating identity contract..."
  #   And I want to see a text including "Encrypting user information..."
  #   And I want to see a text including "Creating mailbox, address book, ..."
  #   And I want to see a element with class "checkmark"
  #   And I want to see a text including "Recovery Key"
  # When I click on button "View Profile"
  #   Then The value of the Input field with label "Company" should be "Test Company"
  #   And The value of the Input field with label "Register Court" should be "Test Register Court"
  #   And The value of the Input field with label "Register" should be "DE"
  #   And The value of the Input field with label "Registration Number" should be "Test Registration Number"
  #   And The value of the Input field with label "Sales Tax ID" should be "Test Sales Tax ID"
  #   And The value of the Input field with label "Street and Number" should be "Test Street 16"
  #   And The value of the Input field with label "Postal Code" should be "99817"
  #   And The value of the Input field with label "City" should be "Test City"
  #   And The value of the Input field with label "Website" should be "https://evan.network"
