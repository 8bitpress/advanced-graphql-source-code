import { Route } from "react-router-dom";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_PROFILE } from "../../graphql/queries";
import Loader from "../../components/Loader/";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";

const Profile = ({ match }) => {
  const { data, error, loading } = useQuery(GET_PROFILE, {
    variables: { username: match.params.username }
  });

  if (loading) {
    return (
      <MainLayout>
        <Loader centered />
      </MainLayout>
    );
  } else if (data && data.profile) {
    return (
      <MainLayout>
        <p>My name is {data.profile.fullName}</p>
      </MainLayout>
    );
  } else if (error) {
    return <Route component={NotFound} />;
  }

  return <MainLayout>{null}</MainLayout>;
};

export default Profile;
