export default {
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
