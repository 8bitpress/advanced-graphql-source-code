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
    viewer(parent, args, { user }, info) {
      return accounts[0];
    }
  }
};

export default resolvers;
