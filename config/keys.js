// KEYS.JS
if (process.env.NODE_ENV === "production") {
  // PRODUCTIONS KEYS
  module.exports = require("./prod");
} else {
  // DEV KEYS
  module.exports = require("./dev");
}
