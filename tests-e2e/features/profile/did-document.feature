@only
Feature: DID Document in Profile DApp
  Scenario: Check correct display of DID
    Given I log in to evan.network using vue with "identityBased"
    @tag:useIdentity
    And I click on "Identity" in main menu
    And I click on link to "Decentralized ID"
      Then I want to see a text including "Decentralized ID (DID)"
