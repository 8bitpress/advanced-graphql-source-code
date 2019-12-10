import update from "immutability-helper";

import { GET_PROFILE_CONTENT, SEARCH_PROFILES } from "../graphql/queries";

export function updateFieldPageResults(field, fetchMoreResult, previousResult) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field];

  return newEdges.length
    ? {
        [field]: {
          __typename: previousResult[field].__typename,
          edges: [...previousResult[field].edges, ...newEdges],
          pageInfo
        }
      }
    : previousResult;
}

export function updateProfileContentAuthor(cache, username, updatedAuthor) {
  let { profile } = cache.readQuery({
    query: GET_PROFILE_CONTENT,
    variables: { username }
  });
  const updatedPostsEdges = profile.posts.edges.map(edge =>
    update(edge.node, {
      $set: { ...edge.node.author, ...updatedAuthor }
    })
  );
  const updatedRepliesEdges = profile.replies.edges.map(edge =>
    update(edge.node, {
      $set: { ...edge.node.author, ...updatedAuthor }
    })
  );

  cache.writeQuery({
    query: GET_PROFILE_CONTENT,
    data: {
      profile: {
        ...profile,
        posts: { ...profile.posts, edges: updatedPostsEdges },
        replies: { ...profile.replies, edges: updatedRepliesEdges }
      }
    }
  });
}

export function updateProfileContentFollowing(cache, followingId, username) {
  let { profile } = cache.readQuery({
    query: GET_PROFILE_CONTENT,
    variables: { username }
  });
  const followingIndex = profile.following.edges.findIndex(
    item => item.node.id === followingId
  );
  const isFollowing =
    profile.following.edges[followingIndex].node.viewerIsFollowing;
  const updatedProfile = update(profile, {
    following: {
      edges: {
        [followingIndex]: {
          node: { viewerIsFollowing: { $set: !isFollowing } }
        }
      }
    }
  });

  cache.writeQuery({
    query: GET_PROFILE_CONTENT,
    data: { profile: updatedProfile }
  });
}

export function updateSearchProfilesFollowing(cache, followingId, text) {
  let { searchProfiles } = cache.readQuery({
    query: SEARCH_PROFILES,
    variables: { query: { text } }
  });

  const followingIndex = searchProfiles.edges.findIndex(
    item => item.node.id === followingId
  );
  const isFollowing =
    searchProfiles.edges[followingIndex].node.viewerIsFollowing;
  const updatedSearchProfiles = update(searchProfiles, {
    edges: {
      [followingIndex]: {
        node: { viewerIsFollowing: { $set: !isFollowing } }
      }
    }
  });

  cache.writeQuery({
    query: SEARCH_PROFILES,
    data: { searchProfiles: updatedSearchProfiles }
  });
}

export function updateSubfieldPageResults(
  field,
  subfield,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];

  return newEdges.length
    ? {
        [field]: {
          ...previousResult[field],
          [subfield]: {
            __typename: previousResult[field][subfield].__typename,
            edges: [...previousResult[field][subfield].edges, ...newEdges],
            pageInfo
          }
        }
      }
    : previousResult;
}
