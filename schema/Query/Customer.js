const Customer = require("../../models/customer");
const CustomerType = require("../typeDefs/Customer");
const { GraphQLID, GraphQLList, GraphQLInt } = require("graphql");

module.exports.getAllCustomer = {
  type: GraphQLList(CustomerType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Customer.find().skip( skip ).limit( limit );
  },
};

module.exports.getCustomer = {
  type: CustomerType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Customer.findById(args._id).exec();
  },
};
