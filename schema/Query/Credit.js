const Credit = require("../../models/credit");
const CreditType = require("../typeDefs/Credit");
const { GraphQLID, GraphQLList, GraphQLString } = require("graphql");

module.exports.getAllCredit = {
  type: GraphQLList(CreditType),
  resolve: () => {
    return Credit.find();
  },
};

module.exports.getAllCreditByCustomer = {
  type: GraphQLList(CreditType),
  args: {
    customerId: { type: GraphQLString },
  },
  resolve: (parent, { customerId }) => {
    return Credit.find({ customerId });
  },
};

module.exports.getCredit = {
  type: CreditType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Credit.findById(args._id).exec();
  },
};
