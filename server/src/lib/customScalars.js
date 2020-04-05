import { ApolloError } from "apollo-server";
import { GraphQLScalarType } from "graphql";
import { isISO8601 } from "validator";

export const DateTimeResolver = new GraphQLScalarType({
  name: "DateTime",
  description: "An ISO 8601-encoded UTC date string.",
  parseValue: value => {
    if (isISO8601(value)) {
      return value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string");
  },
  serialize: value => {
    if (typeof value !== "string") {
      value = value.toISOString();
    }

    if (isISO8601(value)) {
      return value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string");
  },
  parseLiteral: ast => {
    if (isISO8601(ast.value)) {
      return ast.value;
    }
    throw new ApolloError("DateTime must be a valid ISO 8601 Date string");
  }
});
