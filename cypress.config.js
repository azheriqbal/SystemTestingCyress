import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://www.webdriveruniversity.com",
    screenshotOnRunFailure: true,
    trashAssetsBeforeRunsuccess: true,
    videoCompression: 50,
    viewportHeight: 1080,
    viewportWidth: 1920,
    envv:{
      first_Name: "Sarah",
      last_Name: "jones",
      url_1:"http://getby-Cypress.env('url_1')",

    }
  },
});

//Video is recored with cypress is run headless
//videoCompression has value 1-51 better to wrost
//cypress run env 