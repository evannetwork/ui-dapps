Feature: evan.network onboarding

Scenario: Registering a new account on evan Happy Path

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account type" to "user"
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I click on vue checkbox control with id "termsAccepted"
    And I click the element with id "evan-recaptcha"
    And I wait for 3 seconds
    Then the button "Create Account" should be "enabled"
  #  When I click on button "Create Account"
  #  Then I want to see a text including "Creating identity contract..."
  #  And I want to see a text including "Encrypting user information..."
  #  And I want to see a text including "Creating mailbox, address book, ..."
  #  And I want to see a element with class "checkmark"
  #  And I want to see a text including "Recovery Key"
  # When I click on button "View Profile"
  #  Then I want to see a text including "What would you like to start with?"

Scenario: Registering a new account not set account name

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account type" to "user"
    And I set Input field with label "Account name" to ""
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
  Then I want to see a text including "Please enter a account name!"
    And the button "Continue" should be "disabled"

Scenario: Registering a new account and test password checks

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Account type" to "user"
    And I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test"
    And I press the "TAB" key
  Then I want to see a text including "Your password must be at least 8 characters long!"
    And the button "Continue" should be "disabled"
  Then I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1235"
    And I press the "TAB" key
  Then I want to see a text including "Your password must match the previous one!"
    And the button "Continue" should be "disabled"

Scenario: Registering a new account on evan and not check terms

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  And I set Input field with label "Account type" to "user"
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
  And I set Input field with label "Account type" to "user"
  And I set Input field with label "Account name" to "Automated Test Account"
  And I set Input field with label "Password" to "Test1234"
  And I set Input field with label "Retype password" to "Test1234"
  Then the button "Continue" should be "enabled"
  Then I click on button "Continue"
  Then I click on vue checkbox control with id "termsAccepted"
  Then the button "Create Account" should be "disabled"

Scenario: Registering a new company account on evan

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
    And I set Input field with label "Name of the company" to "Automated Test Account"
    And I set Input field with label "Account type" to "company"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
    Then I want to see a element with class "evan-step-0"
    Then I want to see a element with class "evan-step-1"
    Then I want to see a element with class "evan-step-2"
    Then I want to see a element with class "evan-step-3"
    And the button "Continue" should be "enabled"
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
    Then Input field with label "Register Court" should be visible
    And Input field with label "Register" should be visible
    And Input field with label "Registration Number" should be visible
    And Input field with label "VAT ID" should be visible
  When I set Input field with label "Register Court" to "Test Register Court"
    # TODO: should be HRB/HRA ???
    And I set Input field with label "Register" to "DE"
    And I set Input field with label "Registration Number" to "Test Registration Number"
    And I set Input field with label "VAT ID" to "Test VAT ID"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I click on vue checkbox control with id "termsAccepted"
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
  #   And The value of the Input field with label "VAT ID" should be "Test VAT ID"
  #   And The value of the Input field with label "Street and Number" should be "Test Street 16"
  #   And The value of the Input field with label "Postal Code" should be "99817"
  #   And The value of the Input field with label "City" should be "Test City"
  #   And The value of the Input field with label "Website" should be "https://evan.network"

Scenario: Creating a new bicycle twin using onboarding

  Given I go to the evan.network startpage
    And I am on the path "#/dashboard.vue.evan/onboarding.vue.evan/twin-sign-up"
    Then I want to see a text including "Create your Digital Twin"
    And I want to see a text including "Choose a type and give your Digital Twin a name."
    And the button "Continue" should be "disabled"

  When I set Input field with label "Type" to "bycicle"
    When I set Input field with label "Name" to "Onboarding Automated Twin"
    And I set Input field with label "Description" to "Enim fugiat magna sunt consectetur pariatur irure elit laborum ea tempor."
    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
    Then the button "Continue" should be "enabled"
    Then I want to see a text including "Describe your bicycle by it's specifications"

  When I set Input field with label "Type" to "mountain bike"
    And I set Input field with label "Color" to "red"
    And I set Input field with label "Wheel size" to "29"
    And I set Input field with label "Category" to "male"
    And I set Input field with label "Manufacturer" to "Ghost"
    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
    Then the button "Continue" should be "enabled"
    And I want to see a text including "History of maintenance logs."
    And I want to see a text including "Date"
    And I want to see a text including "Description"
    And I want to see a text including "Processor"

  When I set Input field with id "date0" to "01.01.2018"
    And I set Input field with id "date1" to "02.03.2019"
    And I set Input field with id "date2" to "30.11.2019"

    And I set Input field with id "description0" to "service start"
    And I set Input field with id "description1" to "service end"
    And I set Input field with id "description2" to "rent start"

    And I set Input field with id "processor0" to "User 1"
    And I set Input field with id "processor1" to "User 2"
    And I set Input field with id "processor2" to "User 3"

    Then the button "Continue" should be "enabled"

  When I click on button "Continue"
  Then the button "Create Account" should be "disabled"
    And I want to see a text including "For your access to your Digital Twin, we need an alias and a password."
  When I set Input field with label "Account name" to "Automated Test Account"
    And I set Input field with label "Password" to "Test1234"
    And I set Input field with label "Retype password" to "Test1234"
    And I click the element with id "evan-recaptcha"
    And I click on vue checkbox control with id "termsAccepted"
    And I wait for 3 seconds
  Then the button "Create Account" should be "enabled"

  # TODO: wait until profile was created
# Scenario: Creating a new twin using onboarding

#   Given I log in to evan.network using vue
#     And I click on "Digital Twins" in main menu
#     Then I want to see a text including "Onboarding Automated Twin"
#   When I click on an element with text including "Onboarding Automated Twin"
#     Then I want to see a text including "Digital Twin"
#     And I want to see a text including "Onboarding Automated Twin"
#     And I want to see a text including "Plugin Overview"
#     And I want to see a text including "Technical Details"
#     And I want to see a text including "Permissions"
#     And I want to see a text including "TestContainer"
#   When I click on an element with text including "TestContainer"
#     Then I want to see a text including "History"
#     And I want to see a text including "Specifications"
#   When I click on an element with text including "Specifications"
#     Then I want to see a text including "Data Set Type: Metadata"
#     Then The value of the Input field with label "Type" should be "mountain bike"
#     Then The value of the Input field with label "Color" should be "red"
#     Then The value of the Input field with label "Wheel size" should be "29"
#     Then The value of the Input field with label "Gender" should be "male"
#     Then The value of the Input field with label "Manufacturer" should be "Ghost"
#   When I click on an element with text including "History"
#     And I want to see a text including "01.01.2018"
#     And I want to see a text including "02.03.2019"
#     And I want to see a text including "30.11.2019"
#     And I want to see a text including "service start"
#     And I want to see a text including "service end"
#     And I want to see a text including "rent start"
#     And I want to see a text including "User 1"
#     And I want to see a text including "User 2"
#     And I want to see a text including "User 3"
