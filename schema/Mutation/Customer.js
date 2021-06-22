const CustomerType = require("../typeDefs/Customer");
const Customer = require("../../models/customer");
const { GraphQLID, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports.createCustomer = {
  type: CustomerType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args) => {
    const customer = Customer(args);
    return customer.save({
      userId: args.userId,
      description: args.description,
    });
  },
};

module.exports.updateCustomer = {
  type: CustomerType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    description: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.description ? (toUpdate.description = args.description) : null;
    return Customer.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteCustomer = {
  type: CustomerType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const college = Customer(args);
    return college.delete({ _id: args._id });
  },
};
