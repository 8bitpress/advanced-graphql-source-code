import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import Pagination from "../../../lib/Pagination";

class ContentDataSource extends DataSource {
  constructor({ Post, Profile, Reply }) {
    super();
    this.Post = Post;
    this.Profile = Profile;
    this.Reply = Reply;
    this.postPagination = new Pagination(Post);
    this.replyPagination = new Pagination(Reply);
  }

  // UTILITIES
  getContentSort(sortEnum) {
    let sort = {};

    if (sortEnum) {
      const sortArgs = sortEnum.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    return sort;
  }

  // CREATE
  async createPost({ username, text }) {
    let profile;

    try {
      profile = await this.Profile.findOne({ username }).exec();
    } catch (error) {
      throw new UserInputError(
        "You must provide a valid username as the author of this post."
      );
    }

    const newPost = new this.Post({ authorProfileId: profile._id, text });
    return newPost.save();
  }

  // READ

  async getOwnPosts({ after, before, first, last, orderBy, authorProfileId }) {
    const sort = this.getContentSort(orderBy);
    const filter = { authorProfileId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getOwnReplies({
    after,
    before,
    first,
    last,
    orderBy,
    authorProfileId
  }) {
    const sort = this.getContentSort(orderBy);
    const filter = { authorProfileId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getPost(id) {
    return this.Post.findById(id);
  }

  async getPostReplies({ after, before, first, last, orderBy, postId }) {
    const sort = this.getContentSort(orderBy);
    const filter = { postId };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getPosts({ after, before, first, last, orderBy, filter: rawFilter }) {
    let filter = {};

    if (rawFilter && rawFilter.followedBy) {
      try {
        const profile = await this.Profile.findOne({
          username: rawFilter.followedBy
        });
        filter.authorProfileId = {
          $in: [...profile.following, profile._id]
        };
      } catch (error) {
        throw new UserInputError("User with that username cannot be found.");
      }
    }

    if (rawFilter && rawFilter.includeBlocked === false) {
      filter.blocked = false || undefined;
    }

    const sort = this.getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getReplies({ after, before, first, last, orderBy, filter: rawFilter }) {
    const { to, from } = rawFilter;
    let filter = {};

    if (!to && !from) {
      throw new UserInputError(
        "You must provide a username to get replies to or from."
      );
    } else if (to && from) {
      throw new UserInputError(
        "You may only provide a `to` or `from` argument."
      );
    }

    try {
      const profile = await this.Profile.findOne({ username: from || to });

      if (from) {
        filter.authorProfileId = profile._id;
      } else {
        filter.postAuthorProfileId = profile._id;
      }
    } catch (error) {
      throw new UserInputError("User with that username cannot be found.");
    }

    const sort = this.getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  // UPDATE

  // DELETE
  async deletePost(id) {
    const deletedPost = await this.Post.findOneAndDelete({ _id: id }).exec();
    return deletedPost._id;
  }
}

export default ContentDataSource;
