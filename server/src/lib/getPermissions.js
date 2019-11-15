export default function getPermissions(user) {
  if (user && user["https://devchirps.com/user_authorization"]) {
    return user["https://devchirps.com/user_authorization"].permissions;
  }
  return false;
}
