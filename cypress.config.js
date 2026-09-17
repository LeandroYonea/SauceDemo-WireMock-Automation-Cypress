const { defineConfig } = require("cypress");
const mochawesome = require('cypress-mochawesome-reporter/plugin');
require('dotenv').config();

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true,
  },
  env: {
    USER_EMAIL: process.env.USER_EMAIL,
    LOCKED_USER: process.env.LOCKED_USER,
    PASSWORD_USER: process.env.PASSWORD_USER,
    BASE_URL_WIREMOCK: process.env.BASE_URL_WIREMOCK
  },

  e2e: {
    baseUrl: process.env.BASE_URL,
    baseUrlWiremock: process.env.BASE_URL_WIREMOCK,
    specPattern: ["cypress/backend/e2e/**/*.cy.js", "cypress/frontend/e2e/**/*.cy.js"],
    supportFile: "cypress/support/e2e.js",
    video: false,
    screenshotOnRunFailure: true,
    trashAssetsBeforeRuns: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 1,
      openMode: 0
    },
    setupNodeEvents(on, config) {
      mochawesome(on);
      return config;
    },
  },
});
