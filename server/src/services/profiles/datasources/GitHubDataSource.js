import { AuthenticationError } from "apollo-server";
import { DataSource } from "apollo-datasource";
import { graphql } from "@octokit/graphql";

class GitHubDataSource extends DataSource {
  constructor({ auth0 }) {
    super();
    this.auth0 = auth0;
  }

  initialize(config) {
    this.context = config.context;
  }

  async setAuthHeader() {
    if (this.context.user) {
      const user = await this.auth0
        .getUser({ id: this.context.user.sub })
        .catch(() => {
          this.authorization = null;
        });
      this.authorization = `token ${user.identities[0].access_token}`;
    } else {
      throw new AuthenticationError("User not authenticated.");
    }
  }

  async getGitHubURL() {
    await this.setAuthHeader();

    try {
      const response = await graphql(
        `
          query {
            viewer {
              url
            }
          }
        `,
        { headers: { authorization: this.authorization } }
      );
      return response.viewer.url;
    } catch {
      return null;
    }
  }

  async getPinnedItems() {
    try {
      await this.setAuthHeader();

      const response = await graphql(
        `
          {
            viewer {
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
        { headers: { authorization: this.authorization } }
      );

      const {
        viewer: {
          pinnedItems: { edges }
        }
      } = response; // NEW!

      return edges.length
        ? edges.reduce((acc, curr) => {
            const { primaryLanguage } = curr.node;
            curr.node.primaryLanguage = primaryLanguage
              ? primaryLanguage.name
              : null;
            acc.push(curr.node);
            return acc;
          }, [])
        : null; // NEW!
    } catch {
      return null;
    }
  }
}

export default GitHubDataSource;
