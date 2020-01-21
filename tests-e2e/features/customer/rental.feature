@angular
Feature: Rental demo

  Scenario: Dispo can create transportorder
    Given I start the rental demo
      And I log in to evan.network using angular with rentalDispo
    Then the disponent can create a transport order

  Scenario: Driver can solve transportorder
    Then I log in to evan.network using angular with rentalDriver
      And the driver can resolve a transport order

  Scenario: Dispo can finish transportorder
      And I log in to evan.network using angular with rentalDispo
      And the disponent can finish the transport order

