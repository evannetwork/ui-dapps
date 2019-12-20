Feature: EVE payments Vue

Scenario: Checking amount when paying from Germany with an invalid German VAT number
  Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Germany" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And I set Input field with label "VAT ID" to "DE000000020"
    And I press the "TAB" key
    Then I want to see a text including "VAT ID seems to be invalid."
    And the button with id "execute-payment" should be "disabled"
    And I want to see a text including "Total: 10.00 €"


Scenario: Checking amount when paying from Germany without a VAT number
  Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Germany" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And the button with id "execute-payment" should be "enabled"
    And I want to see a text including "Total: 11.90 €"


Scenario: Checking amount when paying from Italy with a valid Italian VAT number
   Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Italy" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And I set Input field with label "VAT ID" to "IT03084300171"
    And I press the "TAB" key
    And the button with id "execute-payment" should be "enabled"
    And I want to see a text including "Total: 10.00 €"

Scenario: Checking amount when paying from Italy with an invalid Italian VAT number
   Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Italy" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And I set Input field with label "VAT ID" to "IT10000600010"
    And I press the "TAB" key
    Then I want to see a text including "VAT ID seems to be invalid."
    And the button with id "execute-payment" should be "disabled"
    And I want to see a text including "Total: 10.00 €"

Scenario: Checking amount when paying from Italy without a VAT number
   Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Italy" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And I set Input field with label "VAT ID" to "IT00502591209"
    And I wait for 2 seconds
    And I set Input field with label "VAT ID" to ""
    And I press the "TAB" key
    Then I want to see a text including "The VAT ID could not be validated!"
    And the button with id "execute-payment" should be "disabled"
    And I want to see a text including "Total: 10.00 €"

Scenario: Checking amount when paying from Austria with a valid Italian VAT number
   Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Austria" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Austria"
    And I set Input field with label "VAT ID" to "IT10000600010"
    And I press the "TAB" key
    Then I want to see a text including "Provided VAT ID does not match given country code."
    And the button with id "execute-payment" should be "disabled"
    And I want to see a text including "Total: 10.00 €"

Scenario: Executing Payment from Germany with a valid German VAT number
   Given I log in to evan.network using vue
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Buy EVE"
    Then I want to see a text including "Buy EVE"
 # When I set Input field with label "Amount of EVE (at least 10)" to "15"
    And I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
    Then the button "Continue" should be "enabled"
  When I click on button "Continue"
    And I set Input field with label "Name" to "Test"
    And I set Input field with label "E-Mail" to "test@test.test"
    And I set Input field with label "Company Name" to "Test Inc."
    And I set Input field with label "Street and Number" to "Test Street 123"
    And I set Input field with label "Postal Code" to "12345"
    And I set Input field with label "City" to "Test City"
    And I select the dropdown entry "Germany" from the dropdown box with the label "Company HQ Country"
    # And I select the country "Germany"
    And I set Input field with label "VAT ID" to "DE811363057"
    And I press the "TAB" key
    And the button with id "execute-payment" should be "enabled"
    And I want to see a text including "Total: 11.90 €"
  When I click on button with id "execute-payment"
    Then I wait "300" seconds until loading was finished
    And I want to see a text including "Your order was successfully placed. You will receive an invoice by email. The process is completed as soon as you receive the invoice."
