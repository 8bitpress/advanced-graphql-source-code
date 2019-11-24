const resolvers = {
  DateTime: DateTimeResolver,

  Post: {
    author(post, args, context, info) {
      return { __typename: "Profile", id: post.authorProfileId };
    },
    id(post, args, context, info) {
      return post._id;
    },
    isBlocked(post, args, context, info) {
      return post.blocked;
    }
  },

  Profile: {
    posts(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnPosts({
        ...args,
        authorProfileId: profile.id
      });
    }
  },

  Query: {
    post(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getPost(id);
    },
    posts(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getPosts(args);
    }
  }
};

export default resolvers;
