Feature: evan.network dashboard

Scenario: Navigating through core DApps using the dashboard
  Given I log in to evan.network using vue
  Then I want to see a text including "What would you like to start with?"
  When I click on "DApps" in main menu
    Then I want to see a text including "Overview about your favorites"
  When I click on "Digital Twins" in main menu
    Then I want to see a text including "Overview of my Digital Twins"
  When I click on "Verification Center" in main menu
    Then I want to see a text including "Under construction"
  When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
  When I click on "Actions" in main menu
    Then I want to see a text including "Incoming Messages"
  When I click on "Synchronization" in main menu
    Then I want to see a text including "Data-Synchronization"
    And I want to see a text including "Everything is synchronized"
  When I click on button before the text "Data-Synchronization"
    Then I want to see not a text including "Data-Synchronization"
  When I click on "Help" in main menu
    Then I want to see a text including "Wiki"
  When I click on "Identity" in main menu
    Then I want to see a text including "Identity"
    Then I want to see a text including "Wallet"
    Then I want to see a text including "Verifications"
    Then I want to see a text including "Contacts"


Scenario: See working synchronization status
  Given I log in to evan.network using vue
  When I am on the path "#/dashboard.vue.evan/components.vue.evan/dispatcher-test"
    And I click on button "Success Dispatcher"
    Then I want to see the "spinner" icon
  When I click on "Synchronization" in main menu
    Then I want to see a text including "0%"
    And I want to see a text including "25%"
    And I want to see a text including "50%"
    And I want to see a text including "75%"
    Then I want to see a text including "Everything is synchronized"
  When I click on button before the text "Data-Synchronization"
    And I want to see the "sync" icon


Scenario: Handle errors in synchronization
  Given I log in to evan.network using vue
  When I am on the path "#/dashboard.vue.evan/components.vue.evan/dispatcher-test"
    And I click on button "Error Dispatcher"
    Then I want to see the "alert" icon
  When I click on "Synchronization" in main menu
    And I want to click on the "close-circle-outline" icon
    Then I want to see a text including "Delete Entry"
  When I click on button "Delete"
    Then I want to see a text including "Everything is synchronized"
  When I click on button before the text "Data-Synchronization"
    And I want to see the "sync" icon