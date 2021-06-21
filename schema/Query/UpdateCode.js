const User = require("../../models/user");
const jsonwebtoken = require("jsonwebtoken");
const keys = require("../../config/keys");
const { GraphQLString } = require("graphql");
const VerifyTokenType = require("../typeDefs/VerifyToken");
const childProcess = require("child_process");

module.exports.updateCode = {
  type: VerifyTokenType,
  args: {
    token: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    try {
      // Check if token is defined
      const { token } = args;
      if (!token) {
        throw new Error("Token is invalid");
      }
      // Verify the token
      const { username, exp, id } = jsonwebtoken.verify(token, keys.cookieKey);
      // Check if username exist in db
      const user = await User.findOne({ username });
      // Get userId
      if (!user) {
        throw new Error("No user with that username");
      }
      // Check if token is not expired
      const elapsedTimeInSeconds = Math.floor(
        parseInt(exp) - Date.now() / 1000
      );
      const elapsedSeconds = elapsedTimeInSeconds % 60;
      if (Math.sign(elapsedSeconds) === -1) {
        throw new Error("Token is expired");
      }
      // Return isVerified true if all 3 condition passed
      childProcess.exec("update_code.bat", function (error, stdout, stderr) {
        console.log(stdout);
      });

      return { updateExecuted: true };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
