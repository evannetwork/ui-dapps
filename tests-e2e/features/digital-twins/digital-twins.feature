@only
Feature: Digital Twins
  skip this feature currently, since test needs to be updated

  Scenario: Creating a new twin from template
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
      And I want to see a "plus" icon button
    When I click on the "plus" icon button
    Then I want to see a text including "Create a new Digital Twin"
      And I want to see a text including "Add Image"
    When I set Input field with placeholder "Give a meaningful name" to "My Testtwin 1337"
      # And I select the entry "Bicycle" from the dropdown with the label "Select a template"
      And I click on input field with label "Select a template"
      And I set Input field with label "Select a template" to "bicycleTwin"
    # TODO: Then The value of the Input field with label "Description" should be "Twin that represents a bicycle within the real world. Includes technical specifications, information about the owner and a maintenance log."

  # @skip
  # Scenario: Creating a new twin and plugin with a Metadata field and add it to the twin
  #   Given I log in to evan.network using vue
  #   Then I can open the last twin
  #   When I define a new plugin with the name "Test Container" and the description "this is a test container"
  #     And add a data set with the type "Metadata" with the name "Sample Value"
  #     And add a field to the data set "Sample Value" with the name "Sample Field" with the type "Text" and the default value "Test"
  #     And create the plugin
  #   Then I can see the the plugin "Test Container" in my list of plugins
  #   When I add a container with the name "Test Container" and the description "this is a test container"
  #     And I add a data set with the type "Metadata", the name "Test data set" and the value "field 1:value 1"
  #     And I can see that the first property has a key named "field 1" and a value of "value 1"

  # @skip
  # Scenario: Creating a new twin and add a container with a Text field
  #   Given I log in to evan.network using vue
  #   When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  #   Then I can open the last twin
  #   When I add a container with the name "Test Container" and the description "this is a test container"
  #     And I add a data set with the type "Text", the name "Test data set" and the value "I am a sample value"
  #     And I can see that the value is "I am a sample value"

  # @skip
  # Scenario: Creating a new twin and add a container with a Number field
  #   Given I log in to evan.network using vue
  #   When I create a new digital twin with the name "Test Twin" and the description "this is a test twin"
  #   Then I can open the last twin
  #   When I add a container with the name "Test Container" and the description "this is a test container"
  #     And I add a data set with the type "Number", the name "Test data set" and the value "1337"
  #     And I can see that the value is "1337"
