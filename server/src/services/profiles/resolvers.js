const resolvers = {
  Account: {
    profile(account, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfile({
        accountId: account.id
      });
    }
  },

  Profile: {
    __resolveReference(reference, { dataSources }) {
      return dataSources.profilesAPI.getProfileById(reference.id);
    },
    account(profile, args, context, info) {
      return { __typename: "Account", id: profile.accountId };
    },
    id(profile, args, context, info) {
      return profile._id;
    },
    viewerIsFollowing(profile, args, { dataSources, user }, info) {
      return dataSources.profilesAPI.checkViewerFollowsProfile(
        user.sub,
        profile._id
      );
    }
  },

  Query: {
    profile(parent, { username }, { dataSources }, info) {
      return dataSources.profilesAPI.getProfile({ username });
    },
    profiles(parent, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfiles();
    }
  },

  Mutation: {
    createProfile(parent, { data }, { dataSources }, info) {
      return dataSources.profilesAPI.createProfile(data);
    },
    deleteProfile(parent, { where: { username } }, { dataSources }, info) {
      return dataSources.profilesAPI.deleteProfile(username);
    },
    updateProfile(
      parent,
      { data, where: { username: currentUsername } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.updateProfile(currentUsername, data);
    }
  }
};

export default resolvers;
