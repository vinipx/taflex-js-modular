/**
 * Utility class responsible for building platform-specific capabilities
 * for cloud-based testing providers like BrowserStack and SauceLabs.
 */
export class CapabilityBuilder {
  /**
   * Builds capabilities for Web automation based on framework configuration.
   * Handles browser, OS, and cloud-provider-specific options.
   * @param {object} config - Configuration object from ConfigManager.
   * @returns {object} Formatted capabilities object for Playwright connection.
   */
  static buildWebCapabilities(config) {
    const caps = {
      browserName: config.browserType || 'chromium',
      browserVersion: config.browserVersion || 'latest',
    };

    if (config.cloudPlatform === 'browserstack') {
      caps['bstack:options'] = {
        userName: config.cloudUser,
        accessKey: config.cloudKey,
        os: config.os || 'Windows',
        osVersion: config.osVersion || '11',
        projectName: 'Taflex Framework',
        buildName: `Build - ${new Date().toISOString().split('T')[0]}`,
        sessionName: 'Playwright Web Test',
      };
    } else if (config.cloudPlatform === 'saucelabs') {
      caps['sauce:options'] = {
        username: config.cloudUser,
        accessKey: config.cloudKey,
        platformName: config.os || 'Windows 11',
        name: 'Playwright Web Test',
        build: `Build - ${new Date().toISOString().split('T')[0]}`,
      };
    }

    return caps;
  }

  /**
   * Builds configuration and capabilities for Mobile automation using WebdriverIO.
   * @param {object} config - Configuration object from ConfigManager.
   * @returns {object} Formatted configuration object for WebdriverIO remote connection.
   */
  static buildMobileConfig(config) {
    const wdioConfig = {
      user: config.cloudUser,
      key: config.cloudKey,
      capabilities: {
        platformName: config.os || 'Android',
        'appium:deviceName': config.osVersion || 'Google Pixel 7',
        'appium:automationName': config.os === 'iOS' ? 'XCUITest' : 'UiAutomator2',
      },
    };

    if (config.cloudPlatform === 'browserstack') {
      wdioConfig.capabilities['bstack:options'] = {
        projectName: 'Taflex Framework',
        buildName: `Mobile Build - ${new Date().toISOString().split('T')[0]}`,
        sessionName: 'WebdriverIO Mobile Test',
      };
    } else if (config.cloudPlatform === 'saucelabs') {
      wdioConfig.capabilities['sauce:options'] = {
        name: 'WebdriverIO Mobile Test',
        build: `Mobile Build - ${new Date().toISOString().split('T')[0]}`,
      };
    }

    return wdioConfig;
  }
}
