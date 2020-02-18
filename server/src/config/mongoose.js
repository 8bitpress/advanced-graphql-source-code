import mongoose from "mongoose";

export default function() {
  const connectionUrl = process.env.MONGODB_URL;

  mongoose.connect(connectionUrl, {
    ...(process.env.NODE_ENV === "production" && {
      authSource: "admin",
      pass: process.env.MONGO_INITDB_ROOT_PASSWORD,
      user: process.env.MONGO_INITDB_ROOT_USERNAME
    }),
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose default connection ready at ${connectionUrl}`);
  });

  mongoose.connection.on("error", error => {
    console.log("Mongoose default connection error:", error);
  });
}
