# Test Design Best Practices

## Page Object Model (POM)
Even with hierarchical locators, we recommend using the Page Object Model to encapsulate page actions.

```javascript
class LoginPage {
    constructor(driver) {
        this.driver = driver;
    }

    async login(username, password) {
        await this.driver.loadLocators('login');
        await (await this.driver.findElement('username_field')).fill(username);
        await (await this.driver.findElement('password_field')).fill(password);
        await (await this.driver.findElement('login_button')).click();
    }
}
```

## Atomic Tests
Keep tests small and focused on a single capability.

## Clean Data Setup
Use the `DatabaseManager` to set up and tear down test data before and after execution.
