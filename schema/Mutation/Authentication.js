const { GraphQLString } = require("graphql");
const jsonwebtoken = require("jsonwebtoken");
const keys = require("../../config/keys");
const User = require("../../models/user");
const AuthType = require("../typeDefs/Auth");

module.exports.login = {
  type: AuthType,
  args: {
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: async (parent, args) => {
    const { username, password } = User(args);
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("No user with that username");
      }
      const isValid = (await password) === user.password;
      if (!isValid) {
        throw new Error("Incorrect password");
      }
      // return jwt
      const token = jsonwebtoken.sign(
        { id: user.id, username: user.username, role: user.userType },
        keys.cookieKey,
        { expiresIn: "1d" }
      );
      return { token, user };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
