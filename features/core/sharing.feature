@only
Feature: evan.network sharing

Scenario: Log into test account and navigate to the profile detail page
  # Log in
  Given I log in to evan.network using vue
  Then I want to see a text including "What would you like to start with?"
  
  Given I wait for enter

  # Then I want to see a text including "Please select an account type."
  # When I click on link to "sign-in"
  # Then I want to see a text including "Recovery Key"
  # When I set Input field with id "mnemonicInput0" to "shove"
  #   And I set Input field with id "mnemonicInput1" to "cherry"
  #   And I set Input field with id "mnemonicInput2" to "yard"
  #   And I set Input field with id "mnemonicInput3" to "promote"
  #   And I set Input field with id "mnemonicInput4" to "acid"
  #   And I set Input field with id "mnemonicInput5" to "surprise"
  #   And I set Input field with id "mnemonicInput6" to "nerve"
  #   And I set Input field with id "mnemonicInput7" to "home"
  #   And I set Input field with id "mnemonicInput8" to "spare"
  #   And I set Input field with id "mnemonicInput9" to "patrol"
  #   And I set Input field with id "mnemonicInput10" to "top"
  #   And I set Input field with id "mnemonicInput11" to "prevent"
  #   Then the button "Next" should be "enabled"
  # When I click on button "Next"
  #   And I wait for 3 seconds
  #   Then I want to see a text including "Password"
  # When I set Input field with label "Password" to "Test1234"
  #   And I click on button "Unlock"
  #   And I wait for 3 seconds
  #   Then I want to see a text including "Welcome to the evan.network"
  # When I click on "Profile" in main menu
  #   Then I want to see a text including "Profile"
  #   Then I want to see a text including "Wallet"
  #   Then I want to see a text including "Verifications"
  #   Then I want to see a text including "Contacts"
  #   Then I want to see a text including "Specify Account Type"
  # When I click on button "Share"
