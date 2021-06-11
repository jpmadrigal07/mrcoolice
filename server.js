const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const cors = require("cors");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const ExpressGraphQL = require('express-graphql').graphqlHTTP
const app = express();
const schema = require('./schema/schemas')

// Connect to Mongo
mongoose
  .connect(keys.mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

// Use Routes
app.use("/mrcoolice", ExpressGraphQL({
  schema:schema,
  graphiql:true
}))

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));