import fs from 'fs';
import path from 'path';
import { configManager } from '../../config/config.manager.js';

/**
 * Manages hierarchical locators using a cascading inheritance model:
 * Global -> Execution Mode (Web/API/Mobile) -> Specific Page.
 *
 * This class loads and merges JSON locator files from src/resources/locators.
 */
export class LocatorManager {
  /**
   * Initializes the LocatorManager with default paths and current execution mode.
   */
  constructor() {
    this.locators = {};
    this.basePath = path.resolve(process.cwd(), 'src/resources/locators');
    this.currentMode = configManager.get('EXECUTION_MODE');
    this.currentPage = null;
  }

  /**
   * Loads and merges locators for the current execution mode and an optional specific page.
   * Loading priority (highest last): global.json < mode/common.json < mode/page.json.
   * @param {string} [pageName=null] - The name of the page JSON file to load.
   */
  load(pageName = null) {
    this.currentPage = pageName;

    const globalLocators = this._readJson('global.json');
    const modeLocators = this._readJson(path.join(this.currentMode, 'common.json'));

    let pageLocators = {};
    if (pageName) {
      pageLocators = this._readJson(path.join(this.currentMode, `${pageName}.json`));
    }

    // Merge locators: Page > Mode > Global
    this.locators = {
      ...globalLocators,
      ...modeLocators,
      ...pageLocators,
    };
  }

  /**
   * Resolves a logical name to its underlying selector string.
   * @param {string} logicalName - The logical name defined in the JSON files.
   * @returns {string} The resolved selector or the logicalName if no match is found.
   */
  resolve(logicalName) {
    return this.locators[logicalName] || logicalName;
  }

  /**
   * Reads and parses a JSON file from the locators resources directory.
   * @private
   * @param {string} relativePath - Path relative to the base locators directory.
   * @returns {object} Parsed JSON content or an empty object if the file is missing/invalid.
   */
  _readJson(relativePath) {
    const filePath = path.join(this.basePath, relativePath);
    if (fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        console.warn(`⚠️ Failed to parse locator file: ${filePath}. Error: ${error.message}`);
      }
    }
    return {};
  }
}

/**
 * Singleton instance of LocatorManager.
 */
export const locatorManager = new LocatorManager();
