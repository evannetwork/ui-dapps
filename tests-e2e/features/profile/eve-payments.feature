@angular
Feature: EVE payments using angular

  Scenario: Checking amount when paying from Germany with an invalid German VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Germany"
      And I set angular Input field with label "VAT" to "DE000000020"
    Then amount to pay is shown as "-"

  Scenario: Checking amount when paying from Germany with VAT from another country
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Germany"
      And I set angular Input field with label "VAT" to "IT03084300171"
    Then amount to pay is shown as "-"

  Scenario: Checking amount when paying from Germany without a VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Germany"
    Then amount to pay is shown as "119.00 €"

  Scenario: Checking amount when paying from Italy with a valid Italian VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Italy"
      And I set angular Input field with label "VAT" to "IT03084300171"
    Then amount to pay is shown as "100.00 €"

  Scenario: Checking amount when paying from Italy with an invalid Italian VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Italy"
      And I set angular Input field with label "VAT" to "IT10000600010"
    Then amount to pay is shown as "-"

  Scenario: Checking amount when paying from Italy without a VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Italy"
    Then amount to pay is shown as "-"

  Scenario: Checking amount when paying from Austria with a valid Italian VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Austria"
      And I set angular Input field with label "VAT" to "IT10000600010"
    Then amount to pay is shown as "-"

  Scenario: Executing Payment from Germany with a valid German VAT number
    Given I log in to evan.network using angular
      And I go to EVE payments tab
    When I set angular Input field with label "Amount of EVE Tokens *" to "100"
      And I set angular Input field with label "Name *" to "Test User"
      And I set angular Input field with label "Email *" to "test@test.test"
      And I set angular Input field with label "Company *" to "Test Inc."
      And I set angular Input field with label "Address *" to "Test Street 123"
      And I set angular Input field with label "Postal Code *" to "12345"
      And I set angular Input field with label "City *" to "Test City"
      And I select the country "Germany"
      And I set angular Input field with label "VAT" to "DE811363057"
    Then amount to pay is shown as "119.00 €"
    When I enter the credit card "4242424242424242", valid util "424" with the CVC "242"
      And I click on the buy button
    Then a success message is shown
