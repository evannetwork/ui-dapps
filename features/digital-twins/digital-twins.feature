Feature: Digital Twins


Scenario: Creating a new twin

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  And I can see that the twin name is "Test Twin" and the description is "this is a test twin"


@tag:only
Scenario: Creating a new twin and add a container

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  When I add a container with the name "Test Container" and the description "this is a test container"
  And I add a data set with the default type and the name "Test data set" 
  And I can see that the first property has a key named "field 1" and a value of "value 1"
