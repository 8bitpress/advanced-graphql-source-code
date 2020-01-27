// Usage (from `server` directory):
// $ node -r dotenv/config -r esm src/scripts/auth0-deploy/import.js dotenv_config_path=.env.production

import { deploy } from "auth0-deploy-cli";

(async () => {
  const config = {
    AUTH0_ALLOW_DELETE: false,
    AUTH0_API_MAX_RETRIES: 10,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID_DEPLOY,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET_DEPLOY,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_EXCLUDED_CLIENTS: ["auth0-deploy-cli-extension"],
    AUTH0_KEYWORD_REPLACE_MAPPINGS: {
      GH_CLIENT_ID: process.env.GITHUB_CLIENT_ID_AUTH0,
      GH_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET_AUTH0
    }
  };

  deploy({
    config,
    env: false,
    input_file: "src/scripts/auth0-deploy/tenant.yaml"
  })
    .then(() => {
      console.log("Tenant import was successful.");
    })
    .catch(error => {
      console.log("Error importing tenant:", error);
    });
})();
