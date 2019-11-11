Feature: evan.network onboarding

Scenario: Registering a new account on evan Happy Path

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I want to click on vue checkbox control with id "termsAccepted"
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
  Then I want to click on vue checkbox control with id "termsAccepted"
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
    And I want to click on vue checkbox control with id "termsAccepted"
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

@only
Scenario: Creating a new twin using onboarding

  Given I go to the evan.network startpage
    And I open the path "dashboard.vue.evan/onboarding.vue.evan/twin-sign-up"
    Then I want to see a text including "Create your Digital Twin"
    Then the button "Continue" should be "disabled"

  When I set Input field with label "Name" to "Onboarding Automated Twin"
    And I set Input field with label "Description" to "Enim fugiat magna sunt consectetur pariatur irure elit laborum ea tempor."
    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
    Then the button "Continue" should be "disabled"
    Then I want to see a text including "Describe your Digital Twin by its specifications"
    Then I want to see a text including "Notation"
    Then I want to see a text including "Value"

  When I set Input field with placeholder "e.g. Serial-Nr." to "Serial-Nr"
    And I set Input field with placeholder "e.g. Type" to "Type"
    And I set Input field with placeholder "e.g. Manufacturer" to "Manufacturer"
    And I set Input field with placeholder "e.g. Owner" to "Owner"
    And I set Input field with placeholder "e.g. Fuel" to "Fuel"
    And I set Input field with placeholder "12XY3456ABC" to "12XY3456ABC"
    And I set Input field with placeholder "Vehicle" to "Vehicle"
    And I set Input field with placeholder "BMW" to "BMW"
    And I set Input field with placeholder "Company AG" to "Company AG"
    And I set Input field with placeholder "Petrol" to "Petrol"
    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
    Then the button "Continue" should be "disabled"
    And I want to see a text including "Deposit important, historical events"
    And I want to see a text including "Date"
    And I want to see a text including "Description"
    And I want to see a text including "Value"

  When I set Input field with placeholder "01.02.2019 09:01" to "1111-11-11"
    And I set Input field with placeholder "01.02.2019 11:54" to "2222-22-22"
    And I set Input field with placeholder "06.02.2019 11:13" to "3333-33-33"
    And I set Input field with placeholder "07.02.2019 12:04" to "4444-44-44"
    And I set Input field with placeholder "07.02.2019 12:15" to "5555-55-55"

    And I set Input field with placeholder "e.g. service start" to "service start"
    And I set Input field with placeholder "e.g. service end" to "service end"
    And I set Input field with placeholder "e.g. rent start" to "rent start"
    And I set Input field with placeholder "e.g. rent end" to "rent end"
    And I set Input field with placeholder "e.g. cleaning start" to "cleaning start"

    And I set Input field with placeholder "authorized repair shop" to "authorized repair shop"
    And I set Input field with placeholder "543.21 €" to "543.21 €"
    And I set Input field with placeholder "Mr. John Doe" to "Mr. John Doe"
    And I set Input field with placeholder "123.45 Miles" to "123.45 Miles"
    And I set Input field with placeholder "Mr. Max Johnson" to "Mr. Max Johnson"

    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
    Then the button "Create Account" should be "disabled"
    And I want to see a text including "For your access to your Digital Twin, we need an alias and a password."
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
    And I click the element with id "evan-recaptcha"
    And I want to click on vue checkbox control with id "termsAccepted"
    And I wait for 3 seconds
    Then the button "Create Account" should be "enabled"
