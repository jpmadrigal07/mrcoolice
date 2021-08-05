const CashOnHandType = require("../typeDefs/CashOnHand");
const CashOnHand = require("../../models/cashOnHand");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

module.exports.createCashOnHand = {
  type: CashOnHandType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const customer = CashOnHand(args);
    return customer.save({
      userId: args.userId,
      amount: args.amount,
      createdAt: args.createdAt,
    });
  },
};

module.exports.updateCashOnHand = {
  type: CashOnHandType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    amount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.amount ? (toUpdate.amount = args.amount) : null;
    args.createdAt ? (toUpdate.createdAt = args.createdAt) : null;
    return CashOnHand.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteCashOnHand = {
  type: CashOnHandType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const cashOnHand = CashOnHand(args);
    return cashOnHand.delete({ _id: args._id });
  },
};
