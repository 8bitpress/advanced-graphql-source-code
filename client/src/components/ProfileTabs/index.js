import { Box, Tab, Tabs, Text } from "grommet";
import { ChatOption, Group, Note } from "grommet-icons";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_PROFILE_CONTENT } from "../../graphql/queries";
import { updateSubfieldPageResults } from "../../lib/updateQueries";
import ContentList from "../../components/ContentList/";
import Loader from "../Loader";
import LoadMoreButton from "../LoadMoreButton";
import ProfileList from "../ProfileList/";
import RichTabTitle from "../RichTabTitle/";

const ProfileTabs = ({ username }) => {
  const { data, fetchMore, loading } = useQuery(GET_PROFILE_CONTENT, {
    variables: { username }
  });

  if (loading) {
    return (
      <Box align="center" margin={{ top: "medium" }}>
        <Loader />
      </Box>
    );
  }

  const {
    profile: { following, posts, replies }
  } = data;

  return (
    <Tabs justify="start" margin={{ bottom: "medium", top: "medium" }}>
      <Tab title={<RichTabTitle icon={<Note />} label="Posts" size="xsmall" />}>
        <Box margin={{ top: "medium" }}>
          {posts.edges.length ? (
            <>
              <ContentList contentData={posts.edges} />
              {posts.pageInfo.hasNextPage && (
                <Box direction="row" justify="center">
                  <LoadMoreButton
                    onClick={() =>
                      fetchMore({
                        variables: {
                          postsCursor: posts.pageInfo.endCursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) =>
                          updateSubfieldPageResults(
                            "profile",
                            "posts",
                            fetchMoreResult,
                            previousResult
                          )
                      })
                    }
                  />
                </Box>
              )}
            </>
          ) : (
            <Text as="p">No posts to display yet!</Text>
          )}
        </Box>
      </Tab>
      <Tab
        title={
          <RichTabTitle icon={<ChatOption />} label="Replies" size="xsmall" />
        }
      >
        <Box margin={{ top: "medium" }}>
          {replies.edges.length ? (
            <>
              <ContentList contentData={replies.edges} />
              {replies.pageInfo.hasNextPage && (
                <Box direction="row" justify="center">
                  <LoadMoreButton
                    onClick={() =>
                      fetchMore({
                        variables: {
                          repliesCursor: replies.pageInfo.endCursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) =>
                          updateSubfieldPageResults(
                            "profile",
                            "replies",
                            fetchMoreResult,
                            previousResult
                          )
                      })
                    }
                  />
                </Box>
              )}
            </>
          ) : (
            <Text as="p">No replies to display yet!</Text>
          )}
        </Box>
      </Tab>
      <Tab
        title={
          <RichTabTitle icon={<Group />} label="Following" size="xsmall" />
        }
      >
        <Box margin={{ top: "medium" }}>
          {following.edges.length ? (
            <>
              <ProfileList profileData={following.edges} />
              {following.pageInfo.hasNextPage && (
                <Box direction="row" justify="center">
                  <LoadMoreButton
                    onClick={() =>
                      fetchMore({
                        variables: {
                          followingCursor: following.pageInfo.endCursor
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) =>
                          updateSubfieldPageResults(
                            "profile",
                            "following",
                            fetchMoreResult,
                            previousResult
                          )
                      })
                    }
                  />
                </Box>
              )}
            </>
          ) : (
            <Text as="p">No followed users to display yet!</Text>
          )}
        </Box>{" "}
        {/* UPDATED! */}
      </Tab>
    </Tabs>
  );
};

export default ProfileTabs;
