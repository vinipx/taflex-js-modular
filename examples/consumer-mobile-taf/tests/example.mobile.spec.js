import { WebdriverioMobileDriver, logger, configManager, MobileConfigSchema } from '@taflex/mobile';

describe('TAFLEX Consumer Mobile Example', () => {
  beforeAll(() => {
    configManager.registerSchema(MobileConfigSchema);
    configManager.load();
  });

  it('should verify @taflex/core and @taflex/mobile are importable', () => {
    expect(logger).toBeDefined();
    expect(configManager).toBeDefined();
    expect(WebdriverioMobileDriver).toBeDefined();
  });

  it('should create a mobile driver instance', () => {
    const driver = new WebdriverioMobileDriver();

    expect(driver).toBeDefined();
    expect(typeof driver.initialize).toBe('function');
    expect(typeof driver.terminate).toBe('function');
    expect(typeof driver.navigateTo).toBe('function');
    expect(typeof driver.findElement).toBe('function');
    expect(typeof driver.captureScreenshot).toBe('function');
  });

  it('should read cloud platform configuration', () => {
    const platform = configManager.get('CLOUD_PLATFORM') || 'local';

    expect(['local', 'browserstack', 'saucelabs']).toContain(platform);
  });

  // Real mobile tests require a running Appium server and a device/emulator.
  // Uncomment the tests below once your environment is set up.

  // describe('with Appium server running', () => {
  //   let driver;
  //
  //   beforeAll(async () => {
  //     driver = new WebdriverioMobileDriver();
  //     await driver.initialize({
  //       cloudPlatform: 'local',
  //       hostname: 'localhost',
  //       port: 4723,
  //       capabilities: {
  //         platformName: 'Android',
  //         'appium:deviceName': 'emulator-5554',
  //         'appium:automationName': 'UiAutomator2',
  //         browserName: 'Chrome',
  //       },
  //     });
  //   });
  //
  //   afterAll(async () => {
  //     await driver.terminate();
  //   });
  //
  //   it('should navigate to a URL', async () => {
  //     await driver.navigateTo('https://playwright.dev');
  //   });
  // });
});
