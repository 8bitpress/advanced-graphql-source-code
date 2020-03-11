import { rule, shield, and, or } from "graphql-shield";

import getPermissions from "../../lib/getPermissions";

const canBlockAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("block:any_account");
});

const canEditOwnAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("edit:own_account");
});

const canPromoteAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("promote:any_account");
});

const canReadAnyAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("read:any_account");
});

const canReadOwnAccount = rule()((parent, args, { user }, info) => {
  const userPermissions = getPermissions(user);
  return userPermissions && userPermissions.includes("read:own_account");
});

const isReadingOwnAccount = rule()((parent, { id }, { user }, info) => {
  return user.sub === id;
});

const isEditingOwnAccount = rule()(
  (parent, { where: { id } }, { user }, info) => {
    return user.sub === id;
  }
);

const permissions = shield(
  {
    Query: {
      account: or(
        and(canReadOwnAccount, isReadingOwnAccount),
        canReadAnyAccount
      ),
      accounts: canReadAnyAccount
    },
    Mutation: {
      changeAccountBlockedStatus: canBlockAccount,
      changeAccountModeratorRole: canPromoteAccount,
      deleteAccount: and(canEditOwnAccount, isEditingOwnAccount),
      updateAccount: and(canEditOwnAccount, isEditingOwnAccount)
    }
  },
  { debug: process.env.NODE_ENV === "development" }
);

export default permissions;
