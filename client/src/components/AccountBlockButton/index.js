import { Button } from "grommet";
import { Halt } from "grommet-icons";
import { useMutation } from "@apollo/client";
import React from "react";

import { CHANGE_ACCOUNT_BLOCKED_STATUS } from "../../graphql/mutations";

const AccountBlockButton = ({ accountId, iconSize, isBlocked }) => {
  const [changeAccountBlockedStatus, { loading }] = useMutation(
    CHANGE_ACCOUNT_BLOCKED_STATUS
  );

  return (
    <Button
      a11yTitle="Block User"
      disabled={loading}
      icon={
        <Halt
          color={isBlocked ? "status-critical" : "dark-4"}
          size={iconSize}
        />
      }
      onClick={async () => {
        await changeAccountBlockedStatus({
          variables: { where: { id: accountId } }
        });
      }}
    />
  );
};

AccountBlockButton.defaultProps = {
  iconSize: "small"
};

export default AccountBlockButton;
