import { defineConfig } from "cypress";
import * as fs from "fs";

function getEnvironmentConfig(env: string) {
  const envConfig = JSON.parse(fs.readFileSync("cypress.env.json", "utf8"));
  return envConfig[env] || envConfig["local"];
}

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      const envName = config.env.ENV || "local";
      const envConfig = getEnvironmentConfig(envName);
      config.baseUrl = envConfig.baseUrl;
      return { ...config, env: envConfig };
    },
  },
});
