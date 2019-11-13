import auth0 from "../../config/auth0";

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
  }
};

export default resolvers;
