import { and, rule, shield } from "graphql-shield";

import getPermissions from "../../lib/getPermissions";

const canReadAnyContent = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("read:any_content");
});

const canEditOwnContent = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("edit:own_content");
});

const canBlockAnyContent = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("block:any_content");
});

const isCreatingOwnContent = rule()(
  async (parent, { data: { username } }, { user, dataSources }, info) => {
    const profile = await dataSources.contentAPI.Profile.findOne({
      username
    }).exec();

    if (!profile || !user || !user.sub) {
      return false;
    }

    return user.sub === profile.accountId;
  }
);

const isEditingOwnPost = rule()(
  async (parent, { where: { id } }, { user, dataSources }, info) => {
    if (!user || !user.sub) {
      return false;
    }

    const profile = await dataSources.contentAPI.Profile.findOne({
      accountId: user.sub
    }).exec();
    const post = await dataSources.contentAPI.getPost(id);

    if (!profile || !post) {
      return false;
    }

    return profile._id.toString() === post.authorProfileId.toString();
  }
);

const isEditingOwnReply = rule()(
  async (parent, { where: { id } }, { user, dataSources }, info) => {
    if (!user || !user.sub) {
      return false;
    }

    const profile = await dataSources.contentAPI.Profile.findOne({
      accountId: user.sub
    }).exec();
    const reply = await dataSources.contentAPI.getReply(id);

    if (!profile || !reply) {
      return false;
    }

    return profile._id.toString() === reply.authorProfileId.toString();
  }
);

const permissions = shield(
  {
    Query: {
      post: canReadAnyContent,
      posts: canReadAnyContent,
      reply: canReadAnyContent,
      replies: canReadAnyContent,
      searchPosts: canReadAnyContent
    },
    Mutation: {
      createPost: and(canEditOwnContent, isCreatingOwnContent),
      createReply: and(canEditOwnContent, isCreatingOwnContent),
      deletePost: and(canEditOwnContent, isEditingOwnPost),
      deleteReply: and(canEditOwnContent, isEditingOwnReply),
      togglePostBlock: canBlockAnyContent,
      toggleReplyBlock: canBlockAnyContent
    }
  },
  {
    debug: (process.env.NODE_ENV = "development" ? true : false)
  }
);

export default permissions;
