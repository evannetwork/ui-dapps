@only
Feature: Digital Twin - Detail View for missing permissions

  Background:
    Given I log in to evan.network using vue

  Scenario: Access foreign twin without permissions
    When I am on the path "#/dashboard.vue.evan/detail.digital-twin.evan/0x56fc9d62fce20193cd0c1d597aa7919630895b0b"
      Then I want to see a text including "Test Car Twin"
      And I want to see a text including "Information"
      But
    When I click on an element with text including "Maintenance"
      Then I want to see a text including "maintenance"
      # But Each form field should be disabled
      And I do not want to see a button "Share"
    When I click on an element with text including "Specifications"
      Then I want to see a text including "Characteristics"
      And I want to see a text including "Name"
      But Each form field should be disabled
      And I do not want to see a button "Share"
