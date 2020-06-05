# Advanced GraphQL with Apollo & React (Source Code)

This repo contains the completed files for the app built throughout the _Advanced GraphQL with Apollo & React_ book from 8-Bit Press.

**[Learn more about the book and download a sample chapter here.](https://8bit.press/book/advanced-graphql)**

## What's in the Book?

If you've done basic GraphQL tutorials in the past and wondered, "alright, what's next?" then this book was written for you.

Advanced topics covered in the book include:

### Apollo Federation and Gateway

For anything beyond a toy app, it doesn't take long for a GraphQL schema to balloon in size. Apollo Federation allows you to tame that beast by drawing sensible boundaries between multiple services with their own federated schemas, and then declaratively composing them together into a single data graph with Apollo Gateway.

### Authentication and Authorization with Auth0

Authentication and permissions-based authorization are some of the trickiest things to get right in an app. Using [Auth0](https://auth0.com/) we'll implement a fully-featured auth system that supports custom user roles and optional GitHub-based logins. Bonus! We'll also learn how to easily migrate an Auth0 tenant used for development purposes to a dedicated production tenant prior to deployment.

### Apollo Data Sources

Bloating resolver functions with data-fetching logic can be messy and often isn't very DRY. We'll use Apollo data sources to neatly encapsulate and organize data-fetching logic within each service.

### Relay-Style Pagination

Relay-style pagination is a popular choice for paginating results in a GraphQL API, but implementing its spec from scratch isn't for the faint of heart! We'll build out a helper class step-by-step to paginate documents retrieved from MongoDB using the Relay pagination algorithm.

### Apollo Client 3.0 with React Hooks

We'll take a modern approach to build a React client app using function components only along with a variety of different hooks, including Apollo Client's `useQuery` and `useMutation` hooks.

### Manage Data in the Apollo Client Cache

We'll use the new type policies feature of Apollo Client to customize how it caches data belonging to different types in a schema. We'll also explore multiple strategies for updating the cache to re-render components after a mutation completes or paginated queries are fetched.

### Message Queues with Redis

Occasionally, the self-contained services that comprise an app will need a way to communicate with each other. We'll explore using Redis as a message queue so that we can cascade the act of deleting a user account and all of its related data and media assets from one service to the next.

### Automatic Persisted Queries

Automatic Persisted Queries help improve network performance by sending smaller hashed representations of a query to Apollo Server. We'll use Redis as a scalable option for storing these query hashes.

### Batching with DataLoader

When left unchecked, nested GraphQL queries can put a significant strain on the data stores behind them. The DataLoader library will allow us to batch requests to Auth0 and MongoDB and decrease the total number of requests per query by an order of magnitude.

### Enhanced Query Performance Using info

The`info` argument of a resolver function is a somewhat mysterious creature given its general lack of documentation anywhere. We'll dig into the `info` object and use the data it provides about a given query's abstract syntax tree to optimize requests to the database.

### Deployment with Docker

We'll see how we can use Docker to package up and deploy a React app, MongoDB, Redis, and four separate Node.js processes to Digital Ocean, and then also add nginx as a reverse proxy server and HTTPS with Let's Encrypt certificates to our production app.

## What Does All the Code in This Repo Do?

The book takes a hands-on approach to learning advanced GraphQL concepts by building the back-end and front-end of a microblogging app called DevChirps from scratch (the code you see here!).

DevChirps users can write posts and reply to them, add images to their posts and replies, follow other users, and search for content and users with a full-text search. Users with a moderator role can block content and other user accounts.

Users who sign up for DevChirps with a GitHub account can showcase pinned repos and gists on their profile too.

## About the Author

Mandi Wise discovered her love for building web things 20 years ago. She spent the last five years sharing that passion by teaching software development to others, including how to build web and mobile applications powered by GraphQL APIs. You can find her on [GitHub](https://github.com/mandiwise) and [Twitter](https://twitter.com/mandiwise).

## Questions & Feedback

Email [hello@8bit.press](mailto:hello@8bit.press) if you have any questions or feedback about this book.

---

Copyright © 2020 8-Bit Press Inc.
