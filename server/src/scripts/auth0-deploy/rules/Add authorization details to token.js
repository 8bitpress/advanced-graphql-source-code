function (user, context, callback) {
  if (
    user.app_metadata &&
    user.app_metadata.roles &&
    user.app_metadata.permissions
  ) {
    context.accessToken["https://devchirps.com/user_authorization"] = {
      groups: user.app_metadata.groups,
      roles: user.app_metadata.roles,
      permissions: user.app_metadata.permissions
    };
    callback(null, user, context);
  } else {
		user.app_metadata = {
      groups: [],
      roles: ["author"],
      permissions: [
        "read:own_account",
        "edit:own_account",
        "read:any_profile",
        "edit:own_profile",
        "read:any_content",
        "edit:own_content",
        "upload:own_media"
      ]
    };

    auth0.users
      .updateAppMetadata(user.user_id, user.app_metadata)
      .then(function() {
        context.accessToken["https://devchirps.com/user_authorization"] = user.app_metadata;
        callback(null, user, context);
      })
      .catch(function(err) {
        callback(err);
      });
  }
}