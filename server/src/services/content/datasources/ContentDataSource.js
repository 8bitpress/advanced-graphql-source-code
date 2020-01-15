import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import { deleteUpload, uploadStream } from "../../../lib/handleUploads";
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

  async uploadMedia(media, profileId) {
    const buffer = Buffer.from(media.buffer.data);
    const uploadedMedia = await uploadStream(buffer, {
      folder: `${process.env.NODE_ENV}/${profileId}`,
      sign_url: true,
      type: "authenticated"
    }).catch(error => {
      throw new Error(`Failed to upload media. ${error.message}`);
    });

    return uploadedMedia.secure_url;
  }

  // CREATE
  async createPost({ media, text, username }) {
    const profile = await this.Profile.findOne({ username }).exec();

    if (!profile) {
      throw new UserInputError(
        "You must provide a valid username as the author of this post."
      );
    }

    let uploadedMediaUrl;

    if (media) {
      uploadedMediaUrl = await this.uploadMedia(media, profile._id);
    }

    const newPost = new this.Post({
      ...(uploadedMediaUrl && { media: uploadedMediaUrl }),
      authorProfileId: profile._id,
      text
    });

    return newPost.save();
  }

  async createReply({ media, postId, text, username }) {
    const post = await this.Post.findById(postId).exec();
    const profile = await this.Profile.findOne({ username }).exec();

    if (!profile) {
      throw new UserInputError(
        "You must provide a valid username as the author of this reply."
      );
    } else if (!post) {
      throw new UserInputError(
        "You must provide a valid parent post ID for this reply."
      );
    }

    const newReply = new this.Reply({
      authorProfileId: profile._id,
      text,
      postId,
      postAuthorProfileId: post.authorProfileId
    });

    return newReply.save();
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

  async getPostById(id) {
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
      const profile = await this.Profile.findOne({
        username: rawFilter.followedBy
      }).exec();

      if (!profile) {
        throw new UserInputError("User with that username cannot be found.");
      }

      filter.authorProfileId = {
        $in: [...profile.following, profile._id]
      };
    }

    if (rawFilter && rawFilter.includeBlocked === false) {
      filter.blocked = { $in: [null, false] };
    }

    const sort = this.getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getReplies({ after, before, first, last, orderBy, filter: rawFilter }) {
    const { to, from } = rawFilter;

    if (!to && !from) {
      throw new UserInputError(
        "You must provide a username to get replies to or from."
      );
    } else if (to && from) {
      throw new UserInputError(
        "You may only provide a `to` or `from` argument."
      );
    }

    let filter = {};
    const profile = await this.Profile.findOne({ username: from || to }).exec();

    if (!profile) {
      throw new UserInputError("User with that username cannot be found.");
    }

    if (from) {
      filter.authorProfileId = profile._id;
    } else {
      filter.postAuthorProfileId = profile._id;
    }

    const sort = this.getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.replyPagination.getEdges(queryArgs);
    const pageInfo = await this.replyPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  getReplyById(id) {
    return this.Reply.findById(id).exec();
  }

  async searchPosts({ after, first, searchString }) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = {
      $text: { $search: searchString },
      blocked: { $in: [null, false] }
    };
    const queryArgs = { after, first, filter, sort };
    const edges = await this.postPagination.getEdges(queryArgs);
    const pageInfo = await this.postPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  // UPDATE
  async togglePostBlock(id) {
    const post = await this.Post.findById(id).exec();
    const currentBlockedStatus =
      post.blocked === undefined ? false : post.blocked;

    return this.Post.findOneAndUpdate(
      { _id: id },
      { blocked: !currentBlockedStatus },
      { new: true }
    ).exec();
  }

  async toggleReplyBlock(id) {
    const reply = await this.Reply.findById(id).exec();
    const currentBlockedStatus =
      reply.blocked === undefined ? false : reply.blocked;

    return this.Reply.findOneAndUpdate(
      { _id: id },
      { blocked: !currentBlockedStatus },
      { new: true }
    ).exec();
  }

  // DELETE
  async deletePost(id) {
    const deletedPost = await this.Post.findOneAndDelete({ _id: id }).exec();
    const { media } = deletedPost;

    if (media) {
      await deleteUpload(media);
    }

    return deletedPost._id;
  }

  async deleteReply(id) {
    const deletedReply = await this.Reply.findByIdAndDelete(id).exec();
    const { media } = deletedPost;

    if (media) {
      await deleteUpload(media);
    }

    return deletedReply._id;
  }
}

export default ContentDataSource;
