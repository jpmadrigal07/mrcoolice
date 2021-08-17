const Credit = require("../../models/credit");
const CreditType = require("../typeDefs/Credit");
const { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } = require("graphql");

module.exports.getAllCredit = {
  type: GraphQLList(CreditType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Credit.find().skip( skip ).limit( limit );
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
