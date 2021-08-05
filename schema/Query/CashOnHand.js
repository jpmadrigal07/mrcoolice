const CashOnHand = require("../../models/cashOnHand");
const CashOnHandType = require("../typeDefs/CashOnHand");
const { GraphQLID, GraphQLList, GraphQLString } = require("graphql");

module.exports.getAllCashOnHand = {
  type: GraphQLList(CashOnHandType),
  resolve: () => {
    return CashOnHand.find();
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
