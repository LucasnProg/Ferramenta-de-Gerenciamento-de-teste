import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    specPattern: [
      'test/frontend/**/*.cy.{js,jsx,ts,tsx}', 
      'test/backend/**/*.cy.{js,jsx,ts,tsx}',  
    ],
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  
});
