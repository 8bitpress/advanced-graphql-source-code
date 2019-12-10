import { Button } from "grommet";
import { Halt } from "grommet-icons";
import { useMutation } from "@apollo/client";
import React from "react";

import { BLOCK_ACCOUNT } from "../../graphql/mutations";

const AccountBlockButton = ({ accountId, iconSize, isBlocked }) => {
  const [blockAccount, { loading }] = useMutation(BLOCK_ACCOUNT);

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
        await blockAccount({
          variables: {
            data: { isBlocked: !isBlocked },
            where: { id: accountId }
          }
        });
      }}
    />
  );
};

AccountBlockButton.defaultProps = {
  iconSize: "small"
};

export default AccountBlockButton;
