import { Box, Button, Form, FormField, Select } from "grommet";
import { Search } from "grommet-icons";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import React, { useState } from "react";

const SearchForm = () => {
  const options = [
    { label: "For Posts", value: "searchPosts" },
    { label: "For Profiles", value: "searchProfiles" }
  ];

  const history = useHistory();
  const location = useLocation();
  const qsValues = queryString.parse(location.search);

  const [text, setText] = useState((qsValues && qsValues.text) || "");
  const [type, setType] = useState(
    (qsValues &&
      qsValues.type &&
      options.find(option => option.value === qsValues.type)) ||
      ""
  );

  return (
    <Form
      messages={{ required: "Required" }}
      onSubmit={() => {
        history.push(`/search?type=${type.value}&text=${text}`);
      }}
    >
      <Box align="start" direction="row" justify="between">
        <Box flex={{ grow: 1, shrink: 0 }} margin={{ right: "medium" }}>
          <FormField
            a11yTitle="Search Text"
            id="searchText"
            name="searchText"
            onInput={event => {
              setText(event.target.value);
            }}
            placeholder="Search DevChirps..."
            required
            value={text}
          />
        </Box>
        <Box margin={{ right: "small" }}>
          <FormField
            a11yTitle="Type of Search"
            component={Select}
            id="searchType"
            labelKey="label"
            name="searchType"
            onChange={({ option }) => {
              setType(option);
            }}
            options={options}
            plain
            required
            value={type}
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

export default SearchForm;
