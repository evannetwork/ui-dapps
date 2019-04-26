Feature: Rental demo

Scenario: Running the rental demo

  Given I start the rental demo
  Then the disponent can create a transport order
  And the driver can resolve a transport order
  And the disponent can finish the transport order
