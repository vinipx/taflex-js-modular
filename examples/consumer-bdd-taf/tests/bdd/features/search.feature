Feature: Playwright Documentation Site

  Scenario: Verify the Playwright homepage loads correctly
    Given I am on the Playwright homepage
    Then the page title should contain "Playwright"

  Scenario: Verify the Get Started link is visible
    Given I am on the Playwright homepage
    Then I should see the "Get started" link

  Scenario: Navigate to the Get Started page
    Given I am on the Playwright homepage
    When I click the "Get started" link
    Then the page title should contain "Installation"
