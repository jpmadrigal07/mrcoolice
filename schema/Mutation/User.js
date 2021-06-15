const UserType = require("../typeDefs/User");
const User = require('../../models/user');
const { GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLString } = require("graphql");

module.exports.createUser = {
  type: UserType,
  args: {
    username: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    userType: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (parent, args) => {
    const user = User(args);
    return user.save({
        username: args.username,
        password: args.password,
        userType: args.userType,
        firstName: args.userType,
        lastName: args.userType
    });
  },
};

module.exports.updateUser = {
  type: UserType,
  args: {
    _id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    userType: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  },
  resolve: (parent, args) => {
    const toUpdate = {}
    args.username ? toUpdate.username = args.username : null
    args.password ? toUpdate.password = args.password : null
    args.userType ? toUpdate.userType = args.userType : null
    args.firstName ? toUpdate.firstName = args.firstName : null
    args.lastName ? toUpdate.lastName = args.lastName : null
    return User.findByIdAndUpdate(
      { _id: args._id },
      { $set: toUpdate }
    );
  },
};

module.exports.deleteUser = {
  type: UserType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const user = User(args);
    return user.delete({ _id: args._id });
  },
};
