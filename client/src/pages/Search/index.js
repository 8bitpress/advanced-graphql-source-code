import { Box, Text } from "grommet";
import { useQuery } from "@apollo/client";
import queryString from "query-string";
import React from "react";

import { SEARCH_POSTS, SEARCH_PROFILES } from "../../graphql/queries";
import { updateFieldPageResults } from "../../lib/updateQueries";
import ContentList from "../../components/ContentList";
import Loader from "../../components/Loader";
import LoadMoreButton from "../../components/LoadMoreButton";
import MainLayout from "../../layouts/MainLayout";
import ProfileList from "../../components/ProfileList";
import SearchForm from "../../components/SearchForm";

const Search = ({ location }) => {
  const { text, type } = queryString.parse(location.search);

  const SEARCH_QUERY = type === "searchPosts" ? SEARCH_POSTS : SEARCH_PROFILES;
  const { data, fetchMore, loading } = useQuery(SEARCH_QUERY, {
    variables: { query: { text: text || "" } }
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

  return (
    <MainLayout>
      <Box margin={{ top: "small" }}>
        <SearchForm />
        {data && data[type] && data[type].edges.length ? (
          <>
            {data.searchPosts ? (
              <ContentList contentData={data[type].edges} />
            ) : (
              <ProfileList profileData={data[type].edges} />
            )}
            {data[type].pageInfo.hasNextPage && (
              <Box direction="row" justify="center">
                <LoadMoreButton
                  onClick={() =>
                    fetchMore({
                      variables: { cursor: data[type].pageInfo.endCursor },
                      updateQuery: (previousResult, { fetchMoreResult }) =>
                        updateFieldPageResults(
                          type,
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
          <Text as="p" margin={{ top: "small" }}>
            {text &&
            type &&
            (type === "searchPosts" || type === "searchProfiles")
              ? "Sorry, no results found for that search phrase!"
              : "Submit a search query above to see results."}
          </Text>
        )}
      </Box>
    </MainLayout>
  );
};

export default Search;
