import React from "react";

import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  const value = useAuth();

  return (
    <MainLayout>
      <p>
        I am authenticated:{" "}
        {!value.checkingSession && value.isAuthenticated().toString()}
      </p>
    </MainLayout>
  );
};

export default Home;
