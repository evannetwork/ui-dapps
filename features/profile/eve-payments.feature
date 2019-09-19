Feature: EVE payments


@only
Scenario: Paying from Germany with a valid German VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Germany"
  When I set angular Input field with label "VAT" to "DE811363057"
  Then amount to pay is shown as "119.00 €"

@only
Scenario: Paying from Germany with an invalid German VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Germany"
  When I set angular Input field with label "VAT" to "DE811363056"
  Then amount to pay is shown as "-"

@only
Scenario: Paying from Germany with VAT from another country
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Germany"
  When I set angular Input field with label "VAT" to "IT03084300171"
  Then amount to pay is shown as "-"

@only
Scenario: Paying from Germany without a VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Germany"
  Then amount to pay is shown as "119.00 €"

@only
Scenario: Paying from Italy with a valid Italian VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Italy"
  When I set angular Input field with label "VAT" to "IT03084300171"
  Then amount to pay is shown as "100.00 €"

@only
Scenario: Paying from Italy with an invalid Italian VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Italy"
  When I set angular Input field with label "VAT" to "IT10000600010"
  Then amount to pay is shown as "-"

@only
Scenario: Paying from Italy without a VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Italy"
  Then amount to pay is shown as "-"

@only
Scenario: Paying from Austria with a valid Italian VAT number
  Given I log in to evan.network using angular
  Then I go to EVE payments tab
  When I set angular Input field with label "Amount of EVE Tokens *" to "100"
  When I set angular Input field with label "Name *" to "Test User"
  When I set angular Input field with label "Email *" to "test@test.test"
  When I set angular Input field with label "Company *" to "Test Inc."
  When I set angular Input field with label "Address *" to "Test Street 123"
  When I set angular Input field with label "Postal Code *" to "12345"
  When I set angular Input field with label "City *" to "Test City"
  When I select the country "Austria"
  When I set angular Input field with label "VAT" to "IT10000600010"
  Then amount to pay is shown as "-"
