Feature: evan.network login

Scenario: Logging in to evan.network using angular

  Given I log in to evan.network using angular
  Then I can see the angular dashboard

@tag:noLogout
Scenario: Logout from of evan.network using angular

  Given I log in to evan.network using angular with default
  When I log out from angular
  Then I am no longer logged in to angular

Scenario: Logging in to evan.network using vue

  Given I log in to evan.network using vue
  Then I want to see a text including "What would you like to start with?"

Scenario: Logging in to evan.network using vue with a wrong password

  Given I go to the evan.network startpage
  Then I want to see a text including "Please select an account type."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I set Input field with id "mnemonicInput0" to "shove"
    And I set Input field with id "mnemonicInput1" to "cherry"
    And I set Input field with id "mnemonicInput2" to "yard"
    And I set Input field with id "mnemonicInput3" to "promote"
    And I set Input field with id "mnemonicInput4" to "acid"
    And I set Input field with id "mnemonicInput5" to "surprise"
    And I set Input field with id "mnemonicInput6" to "nerve"
    And I set Input field with id "mnemonicInput7" to "home"
    And I set Input field with id "mnemonicInput8" to "spare"
    And I set Input field with id "mnemonicInput9" to "patrol"
    And I set Input field with id "mnemonicInput10" to "top"
    And I set Input field with id "mnemonicInput11" to "prevent"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 3 seconds
    Then I want to see a text including "Password"
  When I set Input field with label "Password" to "Test12345"
    And I click on button "Unlock"
    Then I want to see a text including "The provided password is invalid."

Scenario: Logging in to evan.network using vue with a right password

  Given I go to the evan.network startpage
  Then I want to see a text including "Please select an account type."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I set Input field with id "mnemonicInput0" to "shove"
    And I set Input field with id "mnemonicInput1" to "cherry"
    And I set Input field with id "mnemonicInput2" to "yard"
    And I set Input field with id "mnemonicInput3" to "promote"
    And I set Input field with id "mnemonicInput4" to "acid"
    And I set Input field with id "mnemonicInput5" to "surprise"
    And I set Input field with id "mnemonicInput6" to "nerve"
    And I set Input field with id "mnemonicInput7" to "home"
    And I set Input field with id "mnemonicInput8" to "spare"
    And I set Input field with id "mnemonicInput9" to "patrol"
    And I set Input field with id "mnemonicInput10" to "top"
    And I set Input field with id "mnemonicInput11" to "prevent"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 3 seconds
    Then I want to see a text including "Password"
  When I set Input field with label "Password" to "Test1234"
    And I click on button "Unlock"
    And I wait for 3 seconds
    Then I want to see a text including "Welcome to the evan.network"

Scenario: Logging in to evan.network using vue with a not registered mnemnonic

  Given I go to the evan.network startpage
  Then I want to see a text including "Please select an account type."
  When I click on link to "sign-in"
  Then I want to see a text including "Recovery Key"
  When I set Input field with id "mnemonicInput0" to "lesson"
    And I set Input field with id "mnemonicInput1" to "wing"
    And I set Input field with id "mnemonicInput2" to "miracle"
    And I set Input field with id "mnemonicInput3" to "asthma"
    And I set Input field with id "mnemonicInput4" to "trial"
    And I set Input field with id "mnemonicInput5" to "way"
    And I set Input field with id "mnemonicInput6" to "regret"
    And I set Input field with id "mnemonicInput7" to "gravity"
    And I set Input field with id "mnemonicInput8" to "original"
    And I set Input field with id "mnemonicInput9" to "manage"
    And I set Input field with id "mnemonicInput10" to "cup"
    And I set Input field with id "mnemonicInput11" to "sad"
    Then the button "Next" should be "enabled"
  When I click on button "Next"
    And I wait for 3 seconds
    Then I want to see a text including "There is no evan.network Identity associated with this recovery key."


@tag:noLogout
Scenario: Logout from of evan.network using vue

  Given I log in to evan.network using vue with default
  When I log out from vue
  Then I am no longer logged in to vue