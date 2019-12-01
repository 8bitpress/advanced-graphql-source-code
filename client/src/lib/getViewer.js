import client from "../graphql/apollo";
import { GET_VIEWER } from "../graphql/queries";

export default async function getViewer() {
  const result = await client.query({ query: GET_VIEWER });
  if (result) {
    const { error, data, loading } = result;
    return { error, data, loading };
  }
  return null;
}
