import auth0 from "../../config/auth0";

const accounts = [
  {
    id: "1",
    email: "devchirps@mandiwise.com"
  }
];

const resolvers = {
  Account: {
    __resolveReference(reference) {
      return accounts.find(account => account.id === reference.id);
    }
  },

  Query: {
    async viewer(parent, args, { user }, info) {
      const viewer = await auth0.getUser({ id: user.sub });
      console.log(viewer);
      return accounts[0];
    }
  }
};

export default resolvers;
