Feature: Login as user

  Scenario: Login as user
    Given that I am a user
    When I login as a user
    Then I should see home view

  Scenario: Visit gallery view
    Given that I am a user
    When I login as a user
    And I press "gallery"
    Then I should see gallery view