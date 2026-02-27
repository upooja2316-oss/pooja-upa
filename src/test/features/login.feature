Feature: User Authentication tests

  Background: 
    Given User navigates to the application
    And User click on the login link

@regression
  Scenario: Login should be success
   And User enter the username as "<username>"
   And User enter the password as "<password>"
    And User click on the login button
    And Login should be success
     Examples:
      | username | password  |
      | ortoni   | pass1234$ | 



 #Scenario: Login should not be success
  #  Given User enter the username as "koushik"
   # Given User enter the password as "Passkoushik"
    #When User click on the login button
    #But Login should fail