import { Box } from "grommet";
import { Route } from "react-router-dom";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_POST } from "../../graphql/queries";
import { updateSubfieldPageResults } from "../../lib/updateQueries";
import ContentList from "../../components/ContentList";
import Loader from "../../components/Loader";
import LoadMoreButton from "../../components/LoadMoreButton";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";
import SingleContent from "../../components/SingleContent";

const Post = ({ match }) => {
  const { data, fetchMore, loading } = useQuery(GET_POST, {
    variables: {
      id: match.params.id
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
  } else if (data && data.post) {
    const { post } = data;

    return (
      <MainLayout>
        <SingleContent contentData={post} />
        <ContentList contentData={post.replies.edges} />
        {post.replies.pageInfo.hasNextPage && (
          <Box direction="row" justify="center">
            <LoadMoreButton
              onClick={() =>
                fetchMore({
                  variables: { repliesCursor: post.replies.pageInfo.endCursor },
                  updateQuery: (previousResult, { fetchMoreResult }) =>
                    updateSubfieldPageResults(
                      "post",
                      "replies",
                      fetchMoreResult,
                      previousResult
                    )
                })
              }
            />
          </Box>
        )}
      </MainLayout>
    );
  }

  return <Route component={NotFound} />;
};

export default Post;
