import { Box, Button, Form, FormField, Select } from "grommet";
import { Search } from "grommet-icons";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import React from "react";

const SearchForm = ({ history, location }) => {
  const options = [
    { label: "For Posts", value: "searchPosts" },
    { label: "For Profiles", value: "searchProfiles" }
  ];
  const qsValues = queryString.parse(location.search);

  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={({ value: { searchText, searchType } }) => {
        history.push(`/search/?type=${searchType.value}&text=${searchText}`);
      }}
    >
      <Box align="start" direction="row" justify="between">
        <Box flex={{ grow: 1, shrink: 0 }} margin={{ right: "medium" }}>
          <FormField
            a11yTitle="Search Text"
            id="searchText"
            name="searchText"
            placeholder="Search DevChirps..."
            required
            value={(qsValues && qsValues.text) || ""}
          />
        </Box>
        <Box margin={{ right: "small" }}>
          <FormField
            a11yTitle="Type of Search"
            component={Select}
            id="searchType"
            labelKey="label"
            name="searchType"
            options={options}
            plain
            required
            value={
              qsValues &&
              qsValues.type &&
              options.find(option => option.value === qsValues.type)
            }
            valueKey="value"
          />
        </Box>
        <Box
          align="center"
          background="accent-3"
          justify="center"
          overflow="hidden"
          round="full"
        >
          <Button
            a11yTitle="Search..."
            icon={<Search color="brand" size="22px" />}
            type="submit"
          />
        </Box>
      </Box>
    </Form>
  );
};

export default withRouter(SearchForm);
