import { Button } from "grommet";
import { useMutation } from "@apollo/client";
import { UserAdmin } from "grommet-icons";
import React from "react";

import { CHANGE_ACCOUNT_MODERATOR_ROLE } from "../../graphql/mutations";

const ModeratorRoleButton = ({ accountId, iconSize, isModerator }) => {
  const [changeAccountModeratorRole, { loading }] = useMutation(
    CHANGE_ACCOUNT_MODERATOR_ROLE
  );

  return (
    <Button
      a11yTitle="Change User Moderator Role"
      disabled={loading}
      icon={
        <UserAdmin color={isModerator ? "brand" : "dark-4"} size={iconSize} />
      }
      onClick={() => {
        changeAccountModeratorRole({
          variables: { where: { id: accountId } }
        }).catch(err => {
          console.log(err);
        });
      }}
    />
  );
};

ModeratorRoleButton.defaultProps = {
  iconSize: "small"
};

export default ModeratorRoleButton;
