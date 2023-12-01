const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");

const app = express();

const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize session
app.use(
  session({
    secret: "rob-boss-is-cool",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

