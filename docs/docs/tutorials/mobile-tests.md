# Mobile Testing Tutorial

Learn how to automate native and hybrid mobile applications using TAFLEX JS and WebdriverIO (Appium).

## 1. Environment Setup

Mobile testing requires the `@taflex/mobile` package.

> **Note:** If you are running tests locally, ensure you have Appium installed and running. However, if you are executing tests on cloud grids (e.g., BrowserStack or SauceLabs) by configuring `CLOUD_PLATFORM` in your `.env`, the framework handles remote routing automatically and **no local Appium installation is required.**

### Capabilities Configuration
Mobile tests require specific capabilities (platform name, device name, app path, etc).

```javascript
// Example mobile config for driver.initialize()
const mobileConfig = {
    capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'Pixel_6',
        'appium:app': './apps/my-app.apk',
        'appium:automationName': 'UiAutomator2'
    }
};
```

## 2. Writing a Mobile Test

Mobile tests use **Vitest** as the test runner with direct `WebdriverioMobileDriver` instantiation. The driver manages the WebdriverIO/Appium session lifecycle.

```javascript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebdriverioMobileDriver, configManager, MobileConfigSchema } from '@taflex/mobile';

configManager.registerSchema(MobileConfigSchema);
configManager.load();

describe('Mobile App Login', () => {
    const driver = new WebdriverioMobileDriver();

    beforeAll(async () => {
        await driver.initialize({
            cloudPlatform: configManager.get('CLOUD_PLATFORM') || 'local',
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': 'Pixel_6',
                'appium:app': './apps/my-app.apk',
                'appium:automationName': 'UiAutomator2',
            },
        });
    });

    afterAll(async () => {
        await driver.terminate();
    });

    it('should login on Android', async () => {
        // Load mobile-specific locators
        await driver.loadLocators('login');

        const userField = await driver.findElement('username_input');
        const passField = await driver.findElement('password_input');
        const loginBtn = await driver.findElement('submit_button');

        await userField.fill('mobile_user');
        await passField.fill('secret_pass');
        await loginBtn.click();

        const welcome = await driver.findElement('welcome_text');
        expect(await welcome.isVisible()).toBeTruthy();
    });
});
```

## 3. Best Practices

- **Selectors**: Use `accessibility id` (ID) or `Xpath` carefully. In TAFLEX JS, store these in `src/resources/locators/mobile/`.
- **Platform Branching**: If your app logic differs significantly between iOS and Android, create separate locator files (e.g., `login_ios.json`, `login_android.json`) and load the correct one at runtime.
- **Wait Strategies**: Mobile networks and devices can be slow. Use `await element.waitFor()` before critical actions.

## Execution on Real Devices (Cloud)

While local emulators are great for development, TAFLEX JS allows you to run these tests on **real devices** via BrowserStack and SauceLabs.

See the [Cloud Execution Tutorial](./cloud-execution.md) to learn how to configure your credentials and target real devices.
