import { Box, Text } from "grommet";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_POSTS } from "../../graphql/queries";
import { updateFieldPageResults } from "../../lib/updateQueries";
import { useAuth } from "../../context/AuthContext";
import ContentList from "../../components/ContentList";
import Loader from "../../components/Loader";
import LoadMoreButton from "../../components/LoadMoreButton";
import MainLayout from "../../layouts/MainLayout";
import SearchForm from "../../components/SearchForm";

const Home = () => {
  const { viewerQuery } = useAuth();

  const { data, fetchMore, loading } = useQuery(GET_POSTS, {
    variables: {
      filter: {
        followedBy: viewerQuery.data.viewer.profile.username,
        includeBlocked: false
      }
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <Box align="center" margin={{ top: "medium" }}>
          <Loader />
        </Box>
      </MainLayout>
    );
  }

  const { posts } = data;

  return (
    <MainLayout>
      <Box margin={{ top: "medium" }}>
        <SearchForm />
        {posts.edges.length ? (
          <>
            <ContentList contentData={posts.edges} />
            {posts.pageInfo.hasNextPage && (
              <Box direction="row" justify="center">
                <LoadMoreButton
                  onClick={() =>
                    fetchMore({
                      variables: { cursor: posts.pageInfo.endCursor },
                      updateQuery: (previousResult, { fetchMoreResult }) =>
                        updateFieldPageResults(
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
          <Text as="p">Nothing to display in your feed yet!</Text>
        )}
      </Box>
    </MainLayout>
  );
};

export default Home;
