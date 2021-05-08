const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signIn");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("success");
});
app.post("/signin", signIn.handleSignIn(db, bcrypt));
app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);
app.get("/profile/:id", (req, res) => profile.handleGetProfile(req, res, db));
app.put("/image", (req, res) => image.handleImage(req, res, db));
app.post("/imageurl", (req, res) => image.handleApiCall(req, res));

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT} `);
});
