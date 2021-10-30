const CashOnHand = require("../../models/cashOnHand");
const CashOnHandType = require("../typeDefs/CashOnHand");
const { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } = require("graphql");

module.exports.getAllCashOnHand = {
  type: GraphQLList(CashOnHandType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return CashOnHand.find().skip( skip ).limit( limit );
  },
};

module.exports.getAllCashOnHandByUser = {
  type: GraphQLList(CashOnHandType),
  args: {
    userId: { type: GraphQLString },
  },
  resolve: (parent, { userId }) => {
    return CashOnHand.find({ userId });
  },
};

module.exports.getCashOnHand = {
  type: CashOnHandType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return CashOnHand.findById(args._id).exec();
  },
};
