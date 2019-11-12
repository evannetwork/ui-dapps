Feature: evan.network login

Scenario: Logging in to evan.network using angular

  Given I log in to evan.network using angular
  Then I can see the angular dashboard

@tag:noLogout
Scenario: Logout from of evan.network using angular

  Given I log in to evan.network using angular with default
  When I log out from angular
  Then I am no longer logged in to angular

Scenario: Logging in to evan.network using vue

  Given I log in to evan.network using vue
  Then I want to see a text including "What would you like to start with?"

Scenario: Logging in to evan.network using vue with a wrong password

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I enter the mnemonic "offer portion one equal brave unique song year series spot bargain vendor"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 3 seconds
    Then I want to see a text including "Password"
  When I set Input field with label "Password" to "Test12345"
    And I click on button "Log in"
    Then I want to see a text including "The provided password is invalid."

Scenario: Logging in to evan.network using vue with a right password

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I enter the mnemonic "offer portion one equal brave unique song year series spot bargain vendor"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 1 seconds
    Then I want to see a text including "Password"
  When I set Input field with label "Password" to "Test1234"
    And I click on button "Log in"
    And I wait for 3 seconds
    Then I want to see a text including "Welcome to the evan.network"

Scenario: Logging in to evan.network using vue with a not registered mnemnonic

  Given I go to the evan.network startpage
  Then I want to see a text including "Select user type and specify your account name and password."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I enter the mnemonic "lesson wing miracle asthma trial way regret gravity original manage cup sad"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 3 seconds
    Then I want to see a text including "There is no evan.network identity associated with this recovery key."

Scenario: Refreshing the page and re-entering password

  Given I log in to evan.network using vue
  Then I want to see a text including "What would you like to start with?"

  When I refresh the page
    

@tag:noLogout
Scenario: Logout from of evan.network using vue

  Given I log in to evan.network using vue with default
  When I log out from vue
  Then I am no longer logged in to vue
