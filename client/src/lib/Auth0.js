import auth0 from "auth0-js";
import Cookies from "js-cookie";

class Auth0 {
  _auth0Client = new auth0.WebAuth({
    audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
    responseType: "token",
    scope: "openid profile"
  });

  handleAuthentication = () => {
    return new Promise((resolve, reject) => {
      this._auth0Client.parseHash((error, authResult) => {
        if (error || !authResult) {
          return reject(error || "No token available.");
        }

        this.setSession(authResult);
        resolve();
      });
    });
  };

  isAuthenticated = () => {
    const expiresAt = JSON.parse(
      localStorage.getItem("access_token_expires_at")
    );
    return expiresAt ? new Date().getTime() < expiresAt : false;
  };

  login = () => {
    this._auth0Client.authorize();
  };

  logout = () => {
    this._auth0Client.logout({ returnTo: process.env.AUTH0_LOGOUT_URL });
    localStorage.removeItem("access_token_expires_at");
    Cookies.remove("access_token");
  };

  renewToken(expiresIn) {
    if (expiresIn > 0) {
      setTimeout(() => {
        this.silentAuth().catch(() => {
          this.logout();
        });
      }, expiresIn);
    }
  }

  setSession(authResult) {
    const cookieOptions = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    };
    Cookies.set("access_token", authResult.accessToken, cookieOptions);
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    localStorage.setItem("access_token_expires_at", expiresAt);
    this.renewToken(authResult.expiresIn * 1000);
  }

  silentAuth = () => {
    return new Promise((resolve, reject) => {
      this._auth0Client.checkSession({}, (error, authResult) => {
        if (error || !authResult) {
          localStorage.removeItem("access_token_expires_at");
          Cookies.remove("access_token");
          return reject(error || "No token available.");
        }

        this.setSession(authResult);
        resolve();
      });
    });
  };
}

export default Auth0;
