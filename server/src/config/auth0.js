import { ManagementClient } from "auth0";

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID_MGMT_API,
  clientSecret: process.env.AUTH0_CLIENT_SECRET_MGMT_API
});

export default auth0;
