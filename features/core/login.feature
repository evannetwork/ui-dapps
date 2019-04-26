Feature: evan.network login


Scenario: Logging in to evan.network

  Given I log in to evan.network
  Then I can see the dashboard


@tag:noLogout
Scenario: Logout from of evan.network

  Given I log in to evan.network with default
  When I log out
  Then I am no longer logged in