import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DateTime: DateTimeResolver,

  Content: {
    __resolveType(content, context, info) {
      if (content.postId) {
        return "Reply";
      } else {
        return "Post";
      }
    }
  },

  Post: {
    author(post, args, context, info) {
      return { __typename: "Profile", id: post.authorProfileId };
    },
    id(post, args, context, info) {
      return post._id;
    },
    isBlocked(post, args, context, info) {
      return post.blocked;
    },
    replies(post, args, { dataSources }, info) {
      return dataSources.contentAPI.getPostReplies({
        ...args,
        postId: post._id
      });
    }
  },

  Profile: {
    posts(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnPosts({
        ...args,
        authorProfileId: profile.id
      });
    },
    replies(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnReplies({
        ...args,
        authorProfileId: profile.id
      });
    }
  },

  Reply: {
    author(reply, args, context, info) {
      return { __typename: "Profile", id: reply.authorProfileId };
    },
    id(reply, args, context, info) {
      return reply._id;
    },
    isBlocked(reply, args, context, info) {
      return reply.blocked;
    },
    post(reply, args, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(reply.postId);
    },
    postAuthor(reply, args, { dataSources }, info) {
      return { __typename: "Profile", id: reply.postAuthorProfileId };
    }
  },

  Query: {
    post(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(id);
    },
    posts(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getPosts(args);
    },
    reply(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getReplyById(id);
    },
    replies(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getReplies(args);
    },
    searchPosts(
      parent,
      { after, first, query: { text } },
      { dataSources },
      info
    ) {
      return dataSources.contentAPI.searchPosts({
        after,
        first,
        searchString: text
      });
    }
  },

  Mutation: {
    createPost(parent, { data }, { dataSources }, info) {
      return dataSources.contentAPI.createPost(data);
    },
    createReply(parent, { data }, { dataSources }, info) {
      return dataSources.contentAPI.createReply(data);
    },
    deletePost(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.deletePost(id);
    },
    deleteReply(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.deleteReply(id);
    },
    togglePostBlock(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.togglePostBlock(id);
    },
    toggleReplyBlock(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.contentAPI.toggleReplyBlock(id);
    }
  }
};

export default resolvers;
