import { UserInputError } from "apollo-server";

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
    following(profile, args, { dataSources }, info) {
      return dataSources.profilesAPI.getFollowedProfiles(profile.following);
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
    async profile(parent, { username }, { dataSources }, info) {
      const profile = await dataSources.profilesAPI.getProfile({ username });

      if (!profile) {
        throw new UserInputError("Profile does not exist.");
      }
      return profile;
    },
    profiles(parent, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfiles();
    },
    searchProfiles(parent, { query: { text } }, { dataSources }, info) {
      return dataSources.profilesAPI.searchProfiles(text);
    }
  },

  Mutation: {
    createProfile(parent, { data }, { dataSources }, info) {
      return dataSources.profilesAPI.createProfile(data);
    },
    deleteProfile(parent, { where: { username } }, { dataSources }, info) {
      return dataSources.profilesAPI.deleteProfile(username);
    },
    followProfile(
      parent,
      { data: { followingProfileId }, where: { username } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.followProfile(
        username,
        followingProfileId
      );
    },
    unfollowProfile(
      parent,
      { data: { followingProfileId }, where: { username } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.unfollowProfile(
        username,
        followingProfileId
      );
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
