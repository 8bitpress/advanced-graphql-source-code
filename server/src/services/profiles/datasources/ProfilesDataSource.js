import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import gravatarUrl from "gravatar-url";
import Pagination from "../../../lib/Pagination";

class ProfilesDataSource extends DataSource {
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
    const { email } = account;
    const avatar = gravatarUrl(email, { default: "mm" });
    profile.avatar = avatar;
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
    return this.Profile.findById(id).exec();
  }

  getProfiles() {
    return this.Profile.find({}).exec();
  }

  searchProfiles(searchString) {
    return this.Profile.find(
      { $text: { $search: searchString } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" }, _id: -1 })
      .exec();
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

  updateProfile(currentUsername, { description, fullName, username }) {
    if (!description && !fullName && !username) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    const data = {
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
