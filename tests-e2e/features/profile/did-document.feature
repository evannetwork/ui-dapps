@only
Feature: DID Document in Profile DApp
  Scenario: Add and remove Service Endpoint
    Given I log in to evan.network using vue with identityBased
    And I click on "Identity" in main menu
    And I click on "Decentralized ID" in sub menu
      Then I want to see a "h1" headline including "Decentralized ID (DID)"
      And I want to see a button "Export Document"
      And I want to see a button "Edit"

    When I click on button "Edit"
      Then I want to see a button "Save"
      And I want to see a button "Cancel"
      And the button "Save" should be "disabled"
    When I set Input field with id "labelInput" to "ServiceEndpoint 1"
    And I set Input field with id "urlInput" to "https://test.de"
    And I click on the "mdi-plus" icon button
      Then The value of the Input field with id "labelInput" should be ""
      And The value of the Input field with id "urlInput" should be ""
      And the button "Save" should be "enabled"
    When I click on button "Save"
      Then I want to see a cell with the content "ServiceEndpoint 1"
      And I want to see a cell with the content "https://test.de"

    When I click on button "Edit"
      Then I want to see a button "Save"
      And I want to see a button "Cancel"
      And the button "Save" should be "disabled"



