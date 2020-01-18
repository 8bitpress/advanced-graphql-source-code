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
      return dataSources.contentAPI.getPostReplies(
        { ...args, postId: post._id },
        info
      );
    }
  },

  Profile: {
    posts(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnPosts(
        { ...args, authorProfileId: profile.id },
        info
      );
    },
    replies(profile, args, { dataSources }, info) {
      return dataSources.contentAPI.getOwnReplies(
        { ...args, authorProfileId: profile.id },
        info
      );
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
      return dataSources.contentAPI.getPostById(reply.postId, info);
    },
    postAuthor(reply, args, { dataSources }, info) {
      return { __typename: "Profile", id: reply.postAuthorProfileId };
    }
  },

  Query: {
    post(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getPostById(id, info);
    },
    posts(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getPosts(args, info);
    },
    reply(parent, { id }, { dataSources }, info) {
      return dataSources.contentAPI.getReplyById(id, info);
    },
    replies(parent, args, { dataSources }, info) {
      return dataSources.contentAPI.getReplies(args, info);
    },
    searchPosts(
      parent,
      { after, first, query: { text } },
      { dataSources },
      info
    ) {
      return dataSources.contentAPI.searchPosts(
        { after, first, searchString: text },
        info
      );
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
