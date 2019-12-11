import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DateTime: DateTimeResolver,

  Account: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.accountsAPI.getAccountById(reference.id);
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
    account(_, { id }, { dataSources }, info) {
      return dataSources.accountsAPI.getAccountById(id);
    },
    accounts(parent, args, { dataSources }, info) {
      return dataSources.accountsAPI.getAccounts();
    },
    viewer(parent, args, { dataSources, user }, info) {
      if (user && user.sub) {
        return dataSources.accountsAPI.getAccountById(user.sub);
      }
      return null;
    }
  },

  Mutation: {
    blockAccount(
      parent,
      { data: { isBlocked }, where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.blockAccount(id, isBlocked);
    },
    changeAccountModeratorRole(
      parent,
      { data: { isModerator }, where: { id } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.changeAccountModeratorRole(
        id,
        isModerator
      );
    },
    createAccount(
      parent,
      { data: { email, password } },
      { dataSources },
      info
    ) {
      return dataSources.accountsAPI.createAccount(email, password);
    },
    async deleteAccount(
      parent,
      { where: { id } },
      { dataSources, queues },
      info
    ) {
      const accountDeleted = await dataSources.accountsAPI.deleteAccount(id);

      if (accountDeleted) {
        await queues.deleteAccountQueue.sendMessage(
          JSON.stringify({ accountId: id })
        );
      }

      return accountDeleted;
    },
    updateAccount(parent, { data, where: { id } }, { dataSources }, info) {
      return dataSources.accountsAPI.updateAccount(id, data);
    }
  }
};

export default resolvers;
