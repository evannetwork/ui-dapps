Feature: Digital Twin - Creation
  Test different scenarios using predefined templates, upload of correct template and a template with missing properties.
  Checks also if empty description field is filled with the translated value from template.

  Background:
    Given I log in to evan.network using vue
    When I click on "My Assets" in main menu
    Then I want to see a text including "Digital Twins"
      And I want to see a "plus" icon button
    When I click on the "plus" icon button
    Then I want to see a text including "Create a new Digital Twin"
      And I want to see a text including "Add Image"
      And the button "Create Digital Twin" should be "disabled"

  Scenario: Creating a new twin from predefined template
    When I set Input field with placeholder "Give a meaningful name" to "My Testtwin 1337"
      And I set Input field with label "Select a template" to "Bicycle"
      And I wait for 1 seconds
    Then The value of the Input field with label "Description" should be "Twin that represents a bicycle within the real world. Includes technical specifications, information about the owner and a maintenance log."
    Then the button "Create Digital Twin" should be "enabled"

  Scenario: Creating a new twin from json upload template
    When I type "Meaningful test" into the input field with label "Name"
      And I upload file "bicycle.json" to the dropzone with the id "file-input-upload"
      And I wait for 1 seconds
    Then I do not want to see a text including "Errors occured in template"
      And The value of the Input field with label "Description" should be "English description for Bicycle Twin with manual file upload."
      And the button "Create Digital Twin" should be "enabled"

  Scenario: Creating a new twin from errornous template
    When I set Input field with placeholder "Give a meaningful name" to "My Testtwin 1337"
      And I upload file "bicycle-with-errors.json" to the dropzone with the id "file-input-upload"
      And I wait for 1 seconds
    Then I want to see a text including "Errors occured in template"
      And the button "Create Digital Twin" should be "disabled"
