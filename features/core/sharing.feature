@only
Feature: evan.network sharing

Scenario: Log into test account and navigate to the profile detail page
  # Log in
  Given I log in to evan.network using vue
    Then I want to see a text including "What would you like to start with?"
  
  When I click on "Profile" in main menu
    Then I want to see a text including "Profile"
    Then I want to see a text including "Wallet"
    Then I want to see a text including "Verifications"
    Then I want to see a text including "Contacts"
  When I click on button "Share"
    Then I want to see a text including "Select contact to share with"
  When I click the element with id "shareContactSelect"
    Then I want to see a element with class "vs__dropdown-menu"
  When I click the element with role "option"

  

  Given I wait for enter
  # <ul role="listbox" class="vs__dropdown-menu"><li role="option" class="vs__dropdown-option vs__dropdown-option--selected vs__dropdown-option--highlight">
  #         dtrinh44
  #       </li> <!----></ul>