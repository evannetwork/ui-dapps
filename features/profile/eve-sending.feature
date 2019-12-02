Feature: EVE sending

Scenario: Sending eve to a contact
  Given I log in to evan.network using vue with wallet
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Send EVE"
    Then I want to see a text including "Send EVE"
    When I select the dropdown entry "Wallet2" from the dropdown box with the label "Identity"
      And I set Input field with label "Amount of EVE" to "5"
      Then the button "Send" should be "enabled"
    When I send "5" EVE with vue UI
      And I log out from vue
  Given I log in to evan.network using vue with wallet2
    And I click on "Identity" in main menu
    And I click on link to "wallet"
    And I click on button "Send EVE"
    Then I want to see a text including "Send EVE"
    When I select the dropdown entry "Wallet1" from the dropdown box with the label "Identity"
      And I set Input field with label "Amount of EVE" to "5"
      Then the button "Send" should be "enabled"
    When I send "5" EVE with vue UI
