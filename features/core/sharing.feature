@only
Feature: evan.network sharing

Scenario: Log into test account and navigate to the profile detail page
  # Log in
  Given I log in to evan.network using vue
    Then I want to see a text including "What would you like to start with?"
  
  When I click on "Profile" in main menu
    Then I want to see a text including "Profile"
    And I want to see a text including "Wallet"
    And I want to see a text including "Verifications"
    And I want to see a text including "Contacts"
  When I click on button "Share"
    Then I want to see a text including "Select contact to share with"
  When I click on the Vue Select with label "Select contact to share with"
    And I press the "ENTER" key
    Then I want to see a text including "Profile Data"
    But the button "Update Sharing Options" should be "disabled"
  When I click the element with selector ".input-wrapper > label"
    Then the button "Update Sharing Options" should be "enabled"
  When I click on button "Update Sharing Options"

  Given I wait for enter
  # <ul role="listbox" class="vs__dropdown-menu"><li role="option" class="vs__dropdown-option vs__dropdown-option--selected vs__dropdown-option--highlight">
  #         dtrinh44
  #       </li> <!----></ul>
  #shareContactSelect > ul > li
  # //*[@id="shareContactSelect"]/ul/li