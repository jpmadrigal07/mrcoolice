const Customer = require("../../models/customer");
const CustomerType = require("../typeDefs/Customer");
const { GraphQLID, GraphQLList } = require("graphql");

module.exports.getAllCustomer = {
  type: GraphQLList(CustomerType),
  resolve: () => {
    return Customer.find();
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
