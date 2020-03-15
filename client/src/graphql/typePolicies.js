export default {
  Post: {
    fields: {
      replies: {
        keyArgs: []
      }
    }
  },
  Profile: {
    fields: {
      following: {
        keyArgs: []
      },
      posts: {
        keyArgs: []
      },
      replies: {
        keyArgs: []
      }
    }
  },
  Query: {
    fields: {
      posts: {
        keyArgs: ["filter"]
      },
      searchPosts: {
        keyArgs: ["query"]
      },
      searchProfiles: {
        keyArgs: ["query"]
      }
    }
  }
};
