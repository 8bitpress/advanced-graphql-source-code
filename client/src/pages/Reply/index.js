import { Box } from "grommet";
import { Route } from "react-router-dom";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_REPLY } from "../../graphql/queries";
import ContentListItem from "../../components/ContentListItem";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";
import SingleContent from "../../components/SingleContent";

const Reply = ({ match }) => {
  const { data, loading } = useQuery(GET_REPLY, {
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
  } else if (data && data.reply) {
    const { reply } = data;

    return (
      <MainLayout>
        <ContentListItem contentData={reply.post} />
        <SingleContent contentData={reply} />
      </MainLayout>
    );
  }

  return <Route component={NotFound} />;
};

export default Reply;
