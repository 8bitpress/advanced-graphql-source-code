import { Box, Tab, Tabs, Text } from "grommet";
import { ChatOption, Group, Note } from "grommet-icons";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_PROFILE_CONTENT } from "../../graphql/queries";
import ContentList from "../../components/ContentList/";
import Loader from "../Loader";
import RichTabTitle from "../RichTabTitle/";

const ProfileTabs = ({ username }) => {
  const { data, loading } = useQuery(GET_PROFILE_CONTENT, {
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
            <ContentList contentData={posts.edges} />
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
            <ContentList contentData={replies.edges} />
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
        <p>Followed users go here...</p>
      </Tab>
    </Tabs>
  );
};

export default ProfileTabs;
