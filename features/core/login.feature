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
  Then I want to see a text including 'What would you like to start with?'

@tag:noLogout
Scenario: Logout from of evan.network using vue

  Given I log in to evan.network using vue with default
  When I log out from vue
  Then I am no longer logged in to vue