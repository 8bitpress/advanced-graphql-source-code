export function updateFieldPageResults(field, fetchMoreResult, previousResult) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field];

  return newEdges.length
    ? {
        [field]: {
          __typename: previousResult[field].__typename,
          edges: [...previousResult[field].edges, ...newEdges],
          pageInfo
        }
      }
    : previousResult;
}

export function updateSubfieldPageResults(
  field,
  subfield,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];

  return newEdges.length
    ? {
        [field]: {
          ...previousResult[field],
          [subfield]: {
            __typename: previousResult[field][subfield].__typename,
            edges: [...previousResult[field][subfield].edges, ...newEdges],
            pageInfo
          }
        }
      }
    : previousResult;
}
