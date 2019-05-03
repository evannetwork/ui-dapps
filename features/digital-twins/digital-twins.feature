Feature: Digital Twins

@tag:only
Scenario: Creating a new twin

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  And I can see that the twin name is "Test Twin" and the description is "this is a test twin"
