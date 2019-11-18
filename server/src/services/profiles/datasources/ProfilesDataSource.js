import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import gravatarUrl from "gravatar-url";

class ProfilesDataSource extends DataSource {
  constructor({ auth0, Profile }) {
    super();
    this.auth0 = auth0;
    this.Profile = Profile;
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

  getFollowedProfiles(following) {
    return this.Profile.find({ _id: { $in: following } }).exec();
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
    return deletedProfile.username;
  }
}

export default ProfilesDataSource;
