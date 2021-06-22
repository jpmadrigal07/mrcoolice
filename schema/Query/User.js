const User = require("../../models/user");
const UserType = require("../typeDefs/User");
const { GraphQLID, GraphQLList } = require("graphql");

module.exports.getAllUser = {
  type: GraphQLList(UserType),
  resolve: () => {
    return User.find();
  },
};

module.exports.getUser = {
  type: UserType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return User.findById(args._id).exec();
  },
};
