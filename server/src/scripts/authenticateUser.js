// Usage (from `scripts` directory):
// $ node -r dotenv/config -r esm authenticateUser.js <YOUR_EMAIL> <YOUR PASSWORD>

import getToken from "../lib/getToken";

(async () => {
  const [email, password] = process.argv.slice(2);
  const access_token = await getToken(email, password).catch(error => {
    console.log(error);
  });
  console.log(access_token);
})();
