import { UserInputError } from "apollo-server";

import { DateTimeResolver } from "../../lib/customScalars";
import auth0 from "../../config/auth0";
import getToken from "../../lib/getToken";

const resolvers = {
  DateTime: DateTimeResolver,

  Account: {
    __resolveReference(reference) {
      return auth0.getUser({ id: reference.id });
    },
    id(account, args, context, info) {
      return account.user_id;
    },
    createdAt(account, args, context, info) {
      return account.created_at;
    },
    isBlocked(account, args, context, info) {
      return account.blocked;
    },
    isModerator(account, args, context, info) {
      return (
        account.app_metadata &&
        account.app_metadata.roles &&
        account.app_metadata.roles.includes("moderator")
      );
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
    blockAccount(
      parent,
      { data: { isBlocked }, where: { id } },
      context,
      info
    ) {
      return auth0.updateUser({ id }, { blocked: isBlocked });
    },
    changeAccountModeratorRole(
      parent,
      { data: { isModerator }, where: { id } },
      context,
      info
    ) {
      const authorPermissions = [
        "read:own_account",
        "edit:own_account",
        "read:any_profile",
        "edit:own_profile",
        "read:any_content",
        "edit:own_content",
        "upload:own_media"
      ];
      const moderatorPermissions = [
        "read:any_account",
        "block:any_accounts",
        "promote:any_accounts",
        "block:any_content"
      ];

      let roles = isModerator ? ["moderator"] : ["author"];
      let permissions = isModerator
        ? authorPermissions.concat(moderatorPermissions)
        : authorPermissions;

      return auth0.updateUser(
        { id },
        { app_metadata: { groups: [], roles, permissions } }
      );
    },
    createAccount(parent, { data: { email, password } }, context, info) {
      return auth0.createUser({
        app_metadata: {
          groups: [],
          roles: ["author"],
          permissions: [
            "read:own_account",
            "edit:own_account",
            "read:any_profile",
            "edit:own_profile",
            "read:any_content",
            "edit:own_content",
            "upload:own_media"
          ]
        },
        connection: "Username-Password-Authentication",
        email,
        password
      });
    },
    async deleteAccount(parent, { where: { id } }, context, info) {
      try {
        await auth0.deleteUser({ id });
        return true;
      } catch (error) {
        return false;
      }
    },
    async updateAccount(
      parent,
      { data: { email, newPassword, password }, where: { id } },
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
        try {
          const user = await auth0.getUser({ id });
          await getToken(user.email, password);
        } catch (error) {
          throw new UserInputError(error);
        }

        return auth0.updateUser({ id }, { password: newPassword });
      }

      return auth0.updateUser({ id }, { email });
    }
  }
};

export default resolvers;
