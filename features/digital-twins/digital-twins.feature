Feature: Digital Twins

Scenario: Creating a new twin
  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  And I can see that the twin name is "Test Twin" and the description is "this is a test twin"


Scenario: Creating a new twin and add a container with a Metadata field

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  When I add a container with the name "Test Container" and the description "this is a test container"
  And I add a data set with the type "Metadata", the name "Test data set" and the value "field 1:value 1" 
  And I can see that the first property has a key named "field 1" and a value of "value 1"


Scenario: Creating a new twin and add a container with a Text field

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  When I add a container with the name "Test Container" and the description "this is a test container"
  And I add a data set with the type "Text", the name "Test data set" and the value "I am a sample value"
  And I can see that the value is "I am a sample value"


Scenario: Creating a new twin and add a container with a Number field

  Given I log in to evan.network
  Then I switch to vue
  When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  Then I can open the last twin
  When I add a container with the name "Test Container" and the description "this is a test container"
  And I add a data set with the type "Number", the name "Test data set" and the value "1337"
  And I can see that the value is "1337"