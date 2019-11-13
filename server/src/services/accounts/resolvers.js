import { UserInputError } from "apollo-server";
import request from "request";
import util from "util";

import auth0 from "../../config/auth0";

const requestPromise = util.promisify(request);

const resolvers = {
  Account: {
    __resolveReference(reference) {
      return auth0.getUser({ id: reference.id });
    },
    id(account, args, context, info) {
      return account.user_id;
    },
    createdAt(account, args, context, info) {
      return account.created_at;
    }
  },

  Query: {
    account(_, { id }, context, info) {
      return auth0.getUser({ id });
    },
    accounts(parent, args, context, info) {
      return auth0.getUsers();
    },
    viewer(parent, args, { user }, info) {
      if (user && user.sub) {
        return auth0.getUser({ id: user.sub });
      }
      return null;
    }
  },

  Mutation: {
    createAccount(
      parent,
      {
        data: { email, password }
      },
      context,
      info
    ) {
      return auth0.createUser({
        connection: "Username-Password-Authentication",
        email,
        password
      });
    },
    async deleteAccount(
      parent,
      {
        where: { id }
      },
      context,
      info
    ) {
      try {
        await auth0.deleteUser({ id });
        return true;
      } catch (error) {
        return false;
      }
    },
    async updateAccount(
      parent,
      {
        data: { email, newPassword, password },
        where: { id }
      },
      context,
      info
    ) {
      if (!email && !newPassword && !password) {
        throw new UserInputError(
          "You must supply some account data to update."
        );
      } else if (email && newPassword && password) {
        throw new UserInputError(
          "Email and password cannot be updated simultaneously."
        );
      } else if ((!password && newPassword) || (password && !newPassword)) {
        throw new UserInputError(
          "Provide the existing and new passwords when updating the password."
        );
      }

      if (!email) {
        const user = await auth0.getUser({ id });

        const options = {
          method: "POST",
          url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
          headers: { "content-type": "application/x-www-form-urlencoded" },
          form: {
            grant_type: "http://auth0.com/oauth/grant-type/password-realm",
            realm: "Username-Password-Authentication",
            username: user.email,
            password,
            audience: process.env.AUTH0_AUDIENCE,
            client_id: process.env.AUTH0_CLIENT_ID_GRAPHQL,
            client_secret: process.env.AUTH0_CLIENT_SECRET_GRAPHQL,
            scope: "openid"
          }
        };

        const response = await requestPromise(options);
        const body = JSON.parse(response.body);

        if (body.access_token) {
          return auth0.updateUser({ id }, { password: newPassword });
        } else {
          throw new UserInputError(
            body.error_description || "User account could not be verified."
          );
        }
      }

      return auth0.updateUser({ id }, { email });
    }
  }
};

export default resolvers;
