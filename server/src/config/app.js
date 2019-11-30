import cors from "cors";
import express from "express";
import jwt from "express-jwt";
import jwksClient from "jwks-rsa";

function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.headers.cookie) {
    const tokenCookie = req.headers.cookie
      .split("; ")
      .find(cookie => cookie.includes("access_token"));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }
  return null;
}

const app = express();

const jwtCheck = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: false,
  getToken
});

app.use(jwtCheck, (err, req, res, next) => {
  if (err.code === "invalid_token") {
    return next();
  }
  return next(err);
});

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  );
}

export default app;
