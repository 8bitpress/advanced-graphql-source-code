export function updateSubfieldPageResults(
  field,
  subfield,
  fetchMoreResult,
  previousResult
) {
  const { edges: newEdges, pageInfo } = fetchMoreResult[field][subfield];

  console.log(previousResult);

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
