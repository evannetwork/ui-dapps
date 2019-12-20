Feature: evan.network profile

# Background: Creating a new unspecified account and navigate to the profile detail page
#   # create new profile
#   Given I go to the evan.network startpage
#   Then I want to see a text including "Account type"
#     And I set Input field with label "Account type" to "user"
#     And I set Input field with label "Account name" to "Automated Test Account"
#     And I set Input field with label "Password" to "Test1234"
#     And I set Input field with label "Retype password" to "Test1234"
#   Then the button "Continue" should be "enabled"
#   When I click on button "Continue"
#     And I want to click on vue checkbox control with id "termsAccepted"
#     And I click the element with id "evan-recaptcha"
#     And I wait for 3 seconds
#     Then the button "Create Account" should be "enabled"
#   When I click on button "Create Account"
#     Then I want to see a text including "Creating identity contract..."
#     And I want to see a text including "Encrypting user information..."
#     And I want to see a text including "Creating mailbox, address book, ..."
#     And I want to see a element with class "checkmark"
#     And I want to see a text including "Recovery Key"
#   When I click on button "View Profile"
#     Then I want to see a text including "What would you like to start with?"
#   # test profile type switch
#   When I click on "Profile" in main menu
#     Then I want to see a text including "Profile"
#     Then I want to see a text including "Wallet"
#     Then I want to see a text including "Verifications"
#     Then I want to see a text including "Contacts"
#     Then I want to see a text including "Specify Account Type"

# Scenario: Switching from unspecified account to company account and fill the profile information
#   When I click on button "Specify Account Type"
#     Then I want to see a text including "Specify your Account Type"
#     And the button "Change" should be "disabled"
#   When I click on card with text "Company"
#     Then the button "Change" should be "enabled"
#   When I click on button "Change"
#     Then I want to see a text including "Updating profile information..."
#     And I wait for 20 seconds
#   # Company data filling
#   Then I want to see a text including "Registration"
#     And Input field with label "Company" should be visible
#     And Input field with label "Register Court" should be visible
#     And Input field with label "Register" should be visible
#     And Input field with label "Registration Number" should be visible
#     And Input field with label "Sales Tax ID" should be visible
#   Then I want to see a text including "Contact"
#     And Input field with label "Street and Number" should be visible
#     And Input field with label "Postal Code" should be visible
#     And Input field with label "City" should be visible
#     And Input field with label "Website" should be visible
#   When I click on input field with label "Company"
#     Then I want to see a button "Save"
#     Then I want to see a button "Cancel"
#     Then the button "Save" should be "disabled"
#     Then the button "Cancel" should be "enabled"
#     When I set Input field with label "Company" to "Test Company"
#       And I set Input field with label "Register Court" to "Test Register Court"
#       And I set Input field with label "Register" to "DE"
#       And I set Input field with label "Registration Number" to "Test Registration Number"
#       And I set Input field with label "Sales Tax ID" to "Test Sales Tax ID"
#       Then the button "Save" should be "enabled"
#       When I click on button "Save"
#         Then the button "Save" should be "disabled"
#         And I want to see a element with class "spinner-border"
#         And I wait for 5 seconds
#       When I click the element with id "nav-entry-wallet"
#         And I click the element with id "nav-entry-detail"
#         Then The value of the Input field with label "Company" should be "Test Company"
#         And The value of the Input field with label "Register Court" should be "Test Register Court"
#         And The value of the Input field with label "Register" should be "DE"
#         And The value of the Input field with label "Registration Number" should be "Test Registration Number"
#         And The value of the Input field with label "Sales Tax ID" should be "Test Sales Tax ID"
#   When I click on input field with label "Street and Number"
#     Then I want to see a button "Save"
#     Then I want to see a button "Cancel"
#     Then the button "Save" should be "disabled"
#     Then the button "Cancel" should be "enabled"
#     When I set Input field with label "Street and Number" to "Test Street 16"
#       And I set Input field with label "Postal Code" to "99817"
#       And I set Input field with label "City" to "Test City"
#       And I set Input field with label "Website" to "https://evan.network"
#       Then the button "Save" should be "enabled"
#       When I click on button "Save"
#         Then the button "Save" should be "disabled"
#         And I want to see a element with class "spinner-border"
#         And I wait for 5 seconds
#       When I click the element with id "nav-entry-wallet"
#         And I click the element with id "nav-entry-detail"
#         Then The value of the Input field with label "Street and Number" should be "Test Street 16"
#           And The value of the Input field with label "Postal Code" should be "99817"
#           And The value of the Input field with label "City" should be "Test City"
#           And The value of the Input field with label "Website" should be "https://evan.network"

# Scenario: Switching from unspecified account to iot device account and fill the profile information
#   When I click on button "Specify Account Type"
#     Then I want to see a text including "Specify your Account Type"
#     And the button "Change" should be "disabled"
#   When I click on card with text "Device"
#     Then the button "Change" should be "enabled"
#   When I click on button "Change"
#     Then I want to see a text including "Updating profile information..."
#     And I wait for 20 seconds
#   # Device data filling
#   Then I want to see a text including "Device details"
#     And Input field with label "Data Stream Settings" should be visible
#     And Input field with label "Location" should be visible
#     And Input field with label "Manufacturer" should be visible
#     And Input field with label "Owner" should be visible
#     And Input field with label "Serial Number" should be visible
#   When I click on input field with label "Data Stream Settings"
#     Then I want to see a button "Save"
#     Then I want to see a button "Cancel"
#     Then the button "Save" should be "disabled"
#     Then the button "Cancel" should be "enabled"
#     When I set Input field with label "Data Stream Settings" to "Test"
#       And I set Input field with label "Location" to "Test Location"
#       And I set Input field with label "Manufacturer" to "Test Manufacturer"
#       And I set Input field with label "Owner" to "0x0968b6167B5D19f19F407A63f7B6202204c9330f"
#       And I set Input field with label "Serial Number" to "Test Serial Number"
#       Then the button "Save" should be "enabled"
#       When I click on button "Save"
#         Then the button "Save" should be "disabled"
#         And I want to see a element with class "spinner-border"
#         And I wait for 5 seconds
#       When I click the element with id "nav-entry-wallet"
#         And I click the element with id "nav-entry-detail"
#         Then The value of the Input field with label "Data Stream Settings" should be "Test"
#         And The value of the Input field with label "Location" should be "Test Location"
#         And The value of the Input field with label "Manufacturer" should be "Test Manufacturer"
#         And The value of the Input field with label "Owner" should be "0x0968b6167B5D19f19F407A63f7B6202204c9330f"
#         And The value of the Input field with label "Serial Number" should be "Test Serial Number"
