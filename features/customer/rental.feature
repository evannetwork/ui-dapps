Feature: Rental demo

@only
Scenario: Running the rental demo
  Given I start the rental demo
  And I log in to evan.network using angular with rentalDispo
  Then the disponent can create a transport order
  And I log out from angular
  # Then I log in to evan.network using angular with rentalDriver
  # And the driver can resolve a transport order
  # And I log out from angular
  # And I log in to evan.network using angular with rentalDispo
  # And the disponent can finish the transport order
  # And I log out from angular
