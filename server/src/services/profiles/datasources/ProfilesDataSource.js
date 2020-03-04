import { DataSource } from "apollo-datasource";
import { graphql } from "@octokit/graphql";
import { UserInputError } from "apollo-server";
import DataLoader from "dataloader";

import { uploadStream } from "../../../lib/handleUploads";
import getProjectionFields from "../../../lib/getProjectionFields";
import gravatarUrl from "gravatar-url";
import Pagination from "../../../lib/Pagination";

class ProfilesDataSource extends DataSource {
  _profileByIdLoader = new DataLoader(async keys => {
    const ids = [...new Set(keys.map(key => key.id))];
    const profiles = await this.Profile.find({ _id: { $in: ids } })
      .select(keys[0].projection)
      .exec();

    return keys.map(key =>
      profiles.find(profile => profile._id.toString() === key.id)
    );
  });

  constructor({ auth0, Profile }) {
    super();
    this.auth0 = auth0;
    this.Profile = Profile;
    this.pagination = new Pagination(Profile);
  }

  initialize(config) {
    this.context = config.context;
  }

  // UTILITIES

  async _getPinnedItems(githubToken, username) {
    const response = await graphql(
      `
      {
        user(login: "${username}") {
          pinnedItems(first: 6, types: [GIST, REPOSITORY]) {
            edges {
              node {
                ... on Gist {
                  id
                  name
                  description
                  url
                }
                ... on Repository {
                  id
                  name
                  description
                  primaryLanguage {
                    name
                  }
                  url
                }
              }
            }
          }
        }
      }
    `,
      { headers: { authorization: `token ${githubToken}` } }
    ).catch(() => null);

    const { edges } = response.user.pinnedItems;

    return edges.length
      ? edges
          .reduce((acc, curr) => {
            const { primaryLanguage: lang } = curr.node;
            curr.node.primaryLanguage = lang ? lang.name : null;
            acc.push(curr.node);
            return acc;
          }, [])
          .map(pin => {
            const { id: githubId, ...rest } = pin;
            return { githubId, ...rest };
          })
      : null;
  }

  _getProfileSort(sortEnum) {
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
      const avatar = gravatarUrl(account.email, { default: "mm" });
      profile.avatar = avatar;
    }

    if (account.user_id.includes("github")) {
      const { html_url } = account;
      const username = html_url.split("/").pop();
      const pinnedItems = await this._getPinnedItems(
        account.identities[0].access_token,
        username
      );
      profile.githubUrl = html_url;
      profile.pinnedItems = pinnedItems;
    }

    const newProfile = new this.Profile(profile);

    return newProfile.save();
  }

  // READ

  async checkViewerFollowsProfile(viewerAccountId, profileId) {
    const viewerProfile = await this.Profile.findOne({
      accountId: viewerAccountId
    })
      .select("following")
      .exec();
    return viewerProfile.following.includes(profileId);
  }

  async getFollowedProfiles(
    { after, before, first, last, orderBy, following },
    info
  ) {
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
    const projection = getProjectionFields(info, this.Profile.schema);
    const edges = await this.pagination.getEdges(queryArgs, projection);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  getProfile(filter, info) {
    const projection = getProjectionFields(info, this.Profile.schema);
    return this.Profile.findOne(filter).select(projection);
  }

  getProfileById(id, info) {
    const projection = getProjectionFields(info, this.Profile.schema);
    return this._profileByIdLoader.load(
      { id, projection },
      { cacheKeyFn: key => key.id }
    );
  }

  async getProfiles({ after, before, first, last, orderBy }, info) {
    const sort = this._getProfileSort(orderBy);
    const queryArgs = { after, before, first, last, sort };
    const projection = getProjectionFields(info, this.Profile.schema);
    const edges = await this.pagination.getEdges(queryArgs, projection);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async searchProfiles({ after, first, searchString }, info) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = { $text: { $search: searchString } };
    const queryArgs = { after, first, filter, sort };
    const projection = getProjectionFields(info, this.Profile.schema);
    const edges = await this.pagination.getEdges(queryArgs, projection);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  // UPDATE

  followProfile(username, profileIdToFollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $addToSet: { following: profileIdToFollow } },
      { new: true }
    );
  }

  unfollowProfile(username, profileIdToUnfollow) {
    return this.Profile.findOneAndUpdate(
      { username },
      { $pull: { following: profileIdToUnfollow } },
      { new: true }
    );
  }

  async updateProfile(
    currentUsername,
    { avatar, description, fullName, github, username }
  ) {
    if (!avatar && !description && !fullName && !github && !username) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    let uploadedAvatar, githubUrl, pinnedItems;

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

    if (github) {
      const accountId = this.context.user.sub;

      if (!accountId.includes("github")) {
        throw new UserInputError("Only GitHub accounts can fetch GitHub data.");
      }

      const account = await this.auth0.getUser({ id: accountId });
      const { html_url } = account;
      const username = html_url.split("/").pop();
      githubUrl = html_url;
      pinnedItems = await this._getPinnedItems(
        account.identities[0].access_token,
        username
      );
    }

    const data = {
      ...(githubUrl && { githubUrl }),
      ...(pinnedItems && { pinnedItems }),
      ...(uploadedAvatar && { avatar: uploadedAvatar.secure_url }),
      ...(description && { description }),
      ...(fullName && { fullName }),
      ...(username && { username })
    };

    return this.Profile.findOneAndUpdate({ username: currentUsername }, data, {
      new: true
    });
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
