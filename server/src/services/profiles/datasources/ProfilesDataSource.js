import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import DataLoader from "dataloader";

import { uploadStream } from "../../../lib/handleUploads";
import gravatarUrl from "gravatar-url";
import Pagination from "../../../lib/Pagination";

class ProfilesDataSource extends DataSource {
  _profileByIdLoader = new DataLoader(async ids => {
    const profiles = await this.Profile.find({ _id: { $in: ids } }).exec();

    return ids.map(id =>
      profiles.find(profile => profile._id.toString() === id)
    );
  });

  constructor({ auth0, Profile }) {
    super();
    this.auth0 = auth0;
    this.Profile = Profile;
    this.pagination = new Pagination(Profile);
  }

  // UTILITIES
  getProfileSort(sortEnum) {
    let sort = {};

    if (sortEnum) {
      const sortArgs = sortEnum.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    } else {
      sort.username = 1;
    }

    return sort;
  }

  // CREATE
  async createProfile(profile) {
    const account = await this.auth0
      .getUser({ id: profile.accountId })
      .catch(() => {
        throw new UserInputError(
          "Profile cannot be created for a user account that does not exist."
        );
      });
    const { picture } = account;

    if (picture && picture.includes("githubusercontent")) {
      profile.avatar = picture;
    } else {
      const { email } = account;
      const avatar = gravatarUrl(email, { default: "mm" });
      profile.avatar = avatar;
    }

    const newProfile = new this.Profile(profile);

    return newProfile.save();
  }

  // READ
  async checkViewerFollowsProfile(viewerAccountId, profileId) {
    const viewerProfile = await this.Profile.findOne({
      accountId: viewerAccountId
    }).exec();
    return viewerProfile.following.includes(profileId);
  }

  async getFollowedProfiles({
    after,
    before,
    first,
    last,
    orderBy,
    following
  }) {
    let sort = {};

    if (orderBy) {
      const sortArgs = orderBy.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    } else {
      sort.username = 1;
    }

    const filter = { _id: { $in: following } };
    const queryArgs = { after, before, first, last, filter, sort };
    const edges = await this.pagination.getEdges(queryArgs);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  getProfile(filter) {
    return this.Profile.findOne(filter).exec();
  }

  getProfileById(id) {
    return this._profileByIdLoader.load(id);
  }

  async getProfiles({ after, before, first, last, orderBy }) {
    const sort = this.getProfileSort(orderBy);
    const queryArgs = { after, before, first, last, sort };
    const edges = await this.pagination.getEdges(queryArgs);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async searchProfiles({ after, first, searchString }) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = { $text: { $search: searchString } };
    const queryArgs = { after, first, filter, sort };
    const edges = await this.pagination.getEdges(queryArgs);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  // UPDATE
  followProfile(username, profileIdToFollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $addToSet: { following: profileIdToFollow } },
      { new: true }
    ).exec();
  }

  unfollowProfile(username, profileIdToUnfollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $pull: { following: profileIdToUnfollow } },
      { new: true }
    ).exec();
  }

  async updateProfile(
    currentUsername,
    { avatar, description, fullName, username }
  ) {
    if (!avatar && !description && !fullName && !username) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    let uploadedAvatar;

    if (avatar) {
      const profile = await this.Profile.findOne({
        username: currentUsername
      }).exec();

      if (!profile) {
        throw new UserInputError("User with that username cannot be found.");
      }

      const buffer = Buffer.from(avatar.buffer.data);
      uploadedAvatar = await uploadStream(buffer, {
        folder: `${process.env.NODE_ENV}/${profile._id}`,
        format: "png",
        public_id: "avatar",
        sign_url: true,
        transformation: [
          { aspect_ratio: "1:1", crop: "crop" },
          { height: 400, width: 400, crop: "limit" }
        ],
        type: "authenticated"
      }).catch(error => {
        throw new Error(`Failed to upload profile picture. ${error.message}`);
      });
    }

    const data = {
      ...(uploadedAvatar && { avatar: uploadedAvatar.secure_url }),
      ...(description && { description }),
      ...(fullName && { fullName }),
      ...(username && { username })
    };

    return this.Profile.findOneAndUpdate({ username: currentUsername }, data, {
      new: true
    }).exec();
  }

  // DELETE
  async deleteProfile(username) {
    const deletedProfile = await this.Profile.findOneAndDelete({
      username
    }).exec();
    return deletedProfile._id;
  }
}

export default ProfilesDataSource;
